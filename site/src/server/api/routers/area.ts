import { createTRPCRouter, unProtectedProcedure } from '../trpc'

export const areaRouter = createTRPCRouter({
  getAll: unProtectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.area.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  })
})
