import { z } from 'zod'
import { createTRPCRouter, unProtectedProcedure } from '../trpc'

export const editorialRouter = createTRPCRouter({
  get: unProtectedProcedure
    .input(
      z.object({
        page: z.number().default(1)
      })
    )
    .query(async ({ ctx: { prisma }, input: { page } }) => {
      const [count, editorial] = await Promise.all([
        prisma.editorial.count(),
        prisma.editorial.findFirst({
          orderBy: {
            createdAt: 'desc'
          },
          skip: page - 1
        })
      ])

      return {
        count,
        editorial
      }
    })
})
