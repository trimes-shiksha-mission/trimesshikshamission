import { exampleRouter } from '~/server/api/routers/example'
import { createTRPCRouter } from '~/server/api/trpc'
import { adminsRouter } from './routers/admins'
import { areasRouter } from './routers/areas'
import { bannersRouter } from './routers/banners'
import { editorialsRouter } from './routers/editorials'
import { editorsRouter } from './routers/editors'
import { resourcesRouter } from './routers/resources'
import { usersRouter } from './routers/users'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admins: adminsRouter,
  editorials: editorialsRouter,
  editors: editorsRouter,
  areas: areasRouter,
  users: usersRouter,
  banners: bannersRouter,
  resources: resourcesRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
