import { exampleRouter } from '~/server/api/routers/example'
import { createTRPCRouter } from '~/server/api/trpc'
import { adminsRouter } from './routers/admins'
import { editorialsRouter } from './routers/editorials'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admins: adminsRouter,
  editorials: editorialsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
