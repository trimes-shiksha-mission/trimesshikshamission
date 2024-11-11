import { createTRPCRouter, unProtectedProcedure } from '../trpc'

export const bannersRouter = createTRPCRouter({
  getAll: unProtectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.resource.findMany({
      where: {
        type: 'banner'
      },
      orderBy:{
        name: 'asc'
      }
    })
  })
})
