import { hash } from 'bcryptjs'
import { z } from 'zod'
import { adminProtectedProcedure, createTRPCRouter } from '../trpc'

export const editorsRouter = createTRPCRouter({
  getAll: adminProtectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
        sort: z
          .object({
            by: z.string(),
            order: z.enum(['asc', 'desc'])
          })
          .optional()
      })
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const where = {
        role: 'EDITOR' as const,
        OR: [
          {
            name: {
              contains: input.search,
              mode: 'insensitive' as const
            }
          },
          {
            email: {
              contains: input.search,
              mode: 'insensitive' as const
            }
          }
        ]
      }

      const [editors, count] = await Promise.all([
        prisma.admin.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          ...(input.sort && {
            orderBy: {
              [input.sort.by]: input.sort.order
            }
          }),
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            areaId: true,
            createdBy: {
              select: {
                name: true
              }
            },
            updatedBy: {
              select: {
                name: true
              }
            },
            area: {
              select: {
                name: true
              }
            }
          }
        }),
        prisma.admin.count({ where })
      ])

      return {
        editors,
        count
      }
    }),

  createOne: adminProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        areaId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      await prisma.admin.create({
        data: {
          role: 'EDITOR',
          ...input,
          password: await hash(input.password, 10),
          createdById: session.user.id,
          updatedById: session.user.id
        }
      })
      return true
    }),

  updateOne: adminProtectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        areaId: z.string().uuid(),
        password: z.string().optional()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const data: any = {
        name: input.name,
        email: input.email,
        areaId: input.areaId
      }
      if (input.password) {
        data.password = await hash(input.password, 10)
      }

      await prisma.admin.update({
        where: {
          id: input.id
        },
        data: {
          ...data,
          updatedById: session.user.id
        }
      })
      return true
    }),

  deleteOne: adminProtectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.admin.delete({
        where: {
          id: input
        }
      })
      return true
    })
})
