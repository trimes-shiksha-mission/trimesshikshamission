import { createTRPCRouter, unProtectedProcedure } from '../trpc'

export const editorialRouter = createTRPCRouter({
  get: unProtectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.editorial.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
})
