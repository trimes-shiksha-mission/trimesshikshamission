import { createTRPCRouter, protectedProcedure } from '../trpc'

export const areasRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.area.findMany()
  })
})
