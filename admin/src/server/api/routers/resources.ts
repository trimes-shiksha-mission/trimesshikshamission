import { z } from 'zod'
import { env } from '~/env.mjs'
import { supabaseClient } from '~/lib/supabase'
import { createTRPCRouter, superUserProtectedProcedure } from '../trpc'

export const resourcesRouter = createTRPCRouter({
  deleteOne: superUserProtectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma }, input: id }) => {
      const file = await prisma.resource.findUniqueOrThrow({
        where: {
          id
        }
      })
      await supabaseClient.storage.from(env.SUPABASE_BUCKET).remove([file.path])
      return await prisma.resource.delete({
        where: {
          id
        }
      })
    })
})
