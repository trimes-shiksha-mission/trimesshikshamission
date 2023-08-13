import { z } from 'zod'
import { createTRPCRouter, superUserProtectedProcedure } from '../trpc'

export const editorialsRouter = createTRPCRouter({
  getAll: superUserProtectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        sort: z
          .object({
            by: z.string(),
            order: z.string()
          })
          .optional()
      })
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const [editorials, count] = await Promise.all([
        prisma.editorial.findMany({
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          ...(input.sort && {
            orderBy: {
              [input.sort.by]: input.sort.order
            }
          })
        }),
        prisma.editorial.count()
      ])

      return {
        editorials,
        count
      }
    }),

  createOne: superUserProtectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1)
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.editorial.create({
        data: {
          title: input.title,
          body: input.body
        }
      })
      return true
    }),

  deleteOne: superUserProtectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma }, input }) => {
      await prisma.editorial.delete({
        where: {
          id: input
        }
      })
      return true
    })
})
