import { exampleRouter } from '~/server/api/routers/example'
import { createTRPCRouter } from '~/server/api/trpc'
import { areaRouter } from './routers/area'
import { bannersRouter } from './routers/banners'
import { blogsRouter } from './routers/blog'
import { editorialRouter } from './routers/editorial'
import { userRouter } from './routers/user'
import { marriageProfileRouter } from './routers/marriageProfile'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  editorial: editorialRouter,
  user: userRouter,
  area: areaRouter,
  banners: bannersRouter,
  blogs: blogsRouter,
  marriageProfile: marriageProfileRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
