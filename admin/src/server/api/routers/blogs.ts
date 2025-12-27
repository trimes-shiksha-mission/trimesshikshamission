import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const blogsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        type: z.string()
      })
    )
    .query(
      async ({ ctx: { prisma, session }, input: { page, type, limit } }) => {
        if (!type.includes('area') && session.user.role === 'EDITOR')
          throw new Error('You are not authorized to view this page')

        if (type.includes('area')) {
          const [_, areaName] = type.split('/')
          await prisma.admin.findFirstOrThrow({
            where: {
              id: session.user.id,
              area: {
                name: areaName
              }
            }
          })
        }

        const where = {
          type
        }
        const [blogs, count] = await Promise.all([
          prisma.blog.findMany({
            where,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              createdBy: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }),
          prisma.blog.count({
            where
          })
        ])

        return { blogs, count }
      }
    ),

  createOne: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        type: z.string()
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { title, body, type } }) => {
        if (!type.includes('area') && session.user.role === 'EDITOR')
          throw new Error('You are not authorized to view this page')
        if (type.includes('area')) {
          const [_, areaName] = type.split('/')
          await prisma.admin.findFirstOrThrow({
            where: {
              id: session.user.id,
              area: {
                name: areaName
              }
            }
          })
        }
        await prisma.blog.create({
          data: {
            body,
            title,
            type,
            createdById: session.user.id
          }
        })
        return true
      }
    ),

  deleteOne: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const blog = await prisma.blog.findFirst({
        where: {
          id: input
        }
      })
      if (!blog) throw new Error('Blog not found')

      if (session.user.role === 'EDITOR') {
        if (!blog.type.includes('area'))
          throw new Error('You are not authorized for this action!')
        const [_, areaName] = blog.type.split('/')
        await prisma.admin.findFirstOrThrow({
          where: {
            id: session.user.id,
            area: {
              name: areaName
            }
          }
        })
      }

      await prisma.blog.delete({
        where: {
          id: input
        }
      })
    }),

  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        body: z.string().min(1),
        type: z.string()
      })
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { id, title, body }
      }) => {
        const blog = await prisma.blog.findFirst({
          where: {
            id
          }
        })
        if (!blog) throw new Error('Blog not found')

        if (session.user.role === 'EDITOR') {
          if (!blog.type.includes('area'))
            throw new Error('You are not authorized for this action!')
          const [_, areaName] = blog.type.split('/')
          await prisma.admin.findFirstOrThrow({
            where: {
              id: session.user.id,
              area: {
                name: areaName
              }
            }
          })
        }

        await prisma.blog.update({
          where: {
            id
          },
          data: {
            body,
            title
          }
        })
        return true
      }
    )
})
