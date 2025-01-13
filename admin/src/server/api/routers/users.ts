import { readFile } from 'fs/promises'
import Handlebars from 'handlebars'
import path from 'path'
import { z } from 'zod'
import { env } from '~/env.mjs'
import { sendMail } from '~/lib/nodemailer'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        isVerified: z.boolean().optional(),
        search: z.string().optional(),
        gender: z.enum(['male', 'female', 'other']).optional(),
        areaId: z.string().optional(),
        maritalStatus: z
          .enum(['married', 'unmarried', 'divorced', 'widowed'])
          .optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional()
      })
    )
    .query(async ({ ctx: { prisma, session }, input }) => {
      const where: any = {
        ...(input.isVerified !== undefined && {
          isVerified: input.isVerified,
          headId: null
        }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { email: { contains: input.search, mode: 'insensitive' as const } }
          ]
        }),
        ...(input.gender && { gender: input.gender }),
        ...(input.areaId && { areaId: input.areaId }),
        ...(input.maritalStatus && { maritalStatus: input.maritalStatus }),
        ...(input.bloodGroup && { bloodGroup: input.bloodGroup })
      }

      if (session.user.role === 'EDITOR') {
        const editor = await prisma.admin.findUniqueOrThrow({
          where: {
            role: 'EDITOR',
            id: session.user.id
          },
          select: {
            areaId: true
          }
        })
        where.areaId = editor.areaId
      }

      const [users, count] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          select: {
            id: true,
            name: true,
            address: true,
            email: true,
            areaId: true,
            area: {
              select: {
                name: true
              }
            },
            birthday: true,
            bloodGroup: true,
            contact: true,
            createdAt: true,
            updatedAt: true,
            createdBy: {
              select: {
                name: true
              }
            },
            updatedBy: {
              select: {
                name: true
              }
            },
            familyAnnualIncome: true,
            gautra: true,
            gender: true,
            head: {
              select: {
                name: true
              }
            },
            isPrivateProperty: true,
            isVerified: true,
            maritalStatus: true,
            nativeTown: true,
            occupation: true,
            qualification: true,
            relationWithHead: true,
            showInMatrimony: true
          },
          orderBy: {
            name: 'asc'
          }
        }),
        prisma.user.count({ where })
      ])
      return {
        users,
        count
      }
    }),

  verify: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      return await prisma.$transaction(
        async tx => {
          const user = await tx.user.findUniqueOrThrow({ where: { id: input } })
          // Check for permissions
          if (session.user.role === 'EDITOR') {
            const admin = await tx.admin.findUniqueOrThrow({
              where: {
                role: 'EDITOR',
                id: session.user.id
              },
              select: {
                areaId: true
              }
            })
            if (user.areaId !== admin.areaId) throw new Error('Not allowed')
          }
          if (user.isVerified) {
            // Unverify User
            await tx.user.update({
              where: {
                id: input
              },
              data: {
                isVerified: false
              }
            })
          } else {
            // Verify User
            await tx.user.update({
              where: {
                id: input
              },
              data: {
                isVerified: true
              }
            })

            // Send Mail
            // if (user.email) {
            //   const myPath = path.resolve('./template')
            //   let template
            //   if (env.NODE_ENV === 'production')
            //     template = await readFile(
            //       path.join('/', myPath, 'approve.html'),
            //       'utf-8'
            //     )
            //   else template = await readFile('template/approve.html', 'utf-8')
            //   const html = Handlebars.compile(template)({
            //     Name: user.name
            //   })
            //   await sendMail({
            //     to: user.email,
            //     subject: 'Congratulations! Your account has been approved',
            //     html
            //   })
            // }
          }

          return true
        },
        {
          isolationLevel: 'Serializable',
          timeout: 10000
        }
      )
    }),

  deleteOne: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      return await prisma.$transaction(
        async tx => {
          const user = await tx.user.findUniqueOrThrow({ where: { id: input } })
          if (session.user.role === 'EDITOR') {
            const admin = await tx.admin.findUniqueOrThrow({
              where: {
                role: 'EDITOR',
                id: session.user.id
              },
              select: {
                areaId: true
              }
            })
            if (user.areaId !== admin.areaId) throw new Error('Not allowed')
          }

          await tx.user.delete({
            where: {
              id: input
            }
          })

          return true
        },
        {
          isolationLevel: 'Serializable',
          timeout: 10000
        }
      )
    })
})
