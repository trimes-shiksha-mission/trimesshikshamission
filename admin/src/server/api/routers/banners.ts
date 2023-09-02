import { createTRPCRouter, superUserProtectedProcedure } from '../trpc'

export const bannersRouter = createTRPCRouter({
  getAll: superUserProtectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.resource.findMany({
      where: {
        type: 'banner'
      }
    })
  })
})
