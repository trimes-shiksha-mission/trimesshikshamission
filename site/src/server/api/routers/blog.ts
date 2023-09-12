import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const blogsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        type: z.string()
      })
    )
    .query(async ({ ctx: { prisma }, input: { page, type, limit } }) => {
      const where = {
        type
      }
      const [blogs, count] = await Promise.all([
        prisma.blog.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }),
        prisma.blog.count({
          where
        })
      ])

      return { blogs, count }
    }),

  getOne: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx: { prisma }, input }) => {
      const blog = await prisma.blog.findUnique({
        where: {
          id: input
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return blog
    })
})
