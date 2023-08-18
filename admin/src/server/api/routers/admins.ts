import { hash } from 'bcryptjs'
import { z } from 'zod'
import { createTRPCRouter, superUserProtectedProcedure } from '../trpc'

export const adminsRouter = createTRPCRouter({
  getAll: superUserProtectedProcedure
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
        role: 'ADMIN' as const,
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

      const [admins, count] = await Promise.all([
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
            createdBy: {
              select: {
                name: true
              }
            },
            updatedBy: {
              select: {
                name: true
              }
            }
          }
        }),
        prisma.admin.count({
          where
        })
      ])
      return {
        admins,
        count
      }
    }),

  createOne: superUserProtectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(32),
        name: z.string().min(2).max(32)
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const password = await hash(input.password, 10)

      return await prisma.admin.create({
        data: {
          email: input.email,
          name: input.name,
          password,
          role: 'ADMIN',
          createdById: session.user.id,
          updatedById: session.user.id
        }
      })
    }),
  deleteOne: superUserProtectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.admin.delete({
        where: {
          id: input
        }
      })
      return true
    }),
  updateOne: superUserProtectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string().min(2).max(32),
        password: z.string().min(8).max(32).optional()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const data: any = {
        email: input.email,
        name: input.name,
        updatedById: session.user.id
      }
      if (input.password) {
        data.password = await hash(input.password, 10)
      }
      await prisma.admin.update({
        where: {
          id: input.id
        },
        data
      })
      return true
    })
})
