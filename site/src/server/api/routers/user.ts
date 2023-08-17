import { compare, hash } from 'bcryptjs'
import validate from 'deep-email-validator'
import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  unProtectedProcedure
} from '../trpc'

export const userRouter = createTRPCRouter({
  register: unProtectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(8).max(255),
        maritalStatus: z.enum(['married', 'unmarried', 'divorced', 'widowed']),
        gender: z.enum(['male', 'female', 'other']),
        birthday: z.date(),
        contact: z.string().min(3).max(255),
        occupation: z.string().min(3).max(255),
        qualification: z.string().min(3).max(255),
        gautra: z.string().min(3).max(255),
        nativeTown: z.string().min(3).max(255),
        bloodGroup: z.string().min(3).max(255),
        address: z.string().min(3).max(255),
        isPrivateProperty: z.boolean(),
        areaId: z.string().uuid(),
        familyAnnualIncome: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      const { password, ...rest } = input
      const hashedPassword = await hash(password, 10)
      const isEmailValid = await validate(input.email)
      if (!isEmailValid.valid) {
        throw new Error(
          'This email address not found,please provide valid email address!'
        )
      }
      const user = await prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword
        }
      })
      return user
    }),

  profile: protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: session.user.id
      },
      include: {
        area: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    return {
      ...user,
      password: undefined
    }
  }),

  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(8).max(255),
        newPassword: z.string().min(8).max(255)
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: session.user.id,
          headId: null
        }
      })
      if (!user.password) {
        throw new Error("You're not allowed to change password!")
      }
      const isPasswordValid = await compare(input.oldPassword, user.password)

      if (!isPasswordValid) {
        throw new Error('Old password is not correct')
      }
      const newPassword = await hash(input.newPassword, 10)
      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          password: newPassword
        }
      })
      return 'Password changed successfully!'
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        maritalStatus: z.enum(['married', 'unmarried', 'divorced', 'widowed']),
        gender: z.enum(['male', 'female', 'other']),
        birthday: z.date(),
        contact: z.string().min(10).max(10),
        occupation: z.string(),
        qualification: z.string(),
        gautra: z.string(),
        nativeTown: z.string(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        address: z.string(),
        isPrivateProperty: z.boolean().default(false),
        familyAnnualIncome: z.string(),
        areaId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      await prisma.user.findUniqueOrThrow({
        where: {
          id: session.user.id
        }
      })
      const isEmailValid = await validate(input.email)
      if (!isEmailValid.valid) {
        throw new Error(
          'This email address not found,please provide valid email address!'
        )
      }
      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          ...input
        }
      })
      return 'Profile updated successfully!'
    }),

  registerMember: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(255),
        email: z.string().email().optional(),
        maritalStatus: z.enum(['married', 'unmarried', 'divorced', 'widowed']),
        gender: z.enum(['male', 'female', 'other']),
        birthday: z.date(),
        contact: z.string().min(3).max(255).optional(),
        occupation: z.string().min(3).max(255),
        qualification: z.string().min(3).max(255),
        gautra: z.string().min(3).max(255),
        nativeTown: z.string().min(3).max(255),
        bloodGroup: z.string().min(3).max(255),
        address: z.string().min(3).max(255),
        isPrivateProperty: z.boolean(),
        relationWithHead: z.string().min(3).max(255)
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      if (input.email) {
        const isEmailValid = await validate(input.email)
        if (!isEmailValid.valid) {
          throw new Error(
            'This email address not found, please provide valid email address!'
          )
        }
      }
      const user = await prisma.user.create({
        data: {
          ...input,
          headId: session.user.id,
          createdById: session.user.id,
          updatedById: session.user.id
        }
      })
      return user
    }),

  getMembers: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const members = await prisma.user.findMany({
      where: {
        headId: session.user.id
      },
      orderBy: {
        name: 'asc'
      }
    })
    return members
  }),

  deleteMember: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx: { prisma, session }, input: id }) => {
      await prisma.user.delete({
        where: {
          id,
          headId: session.user.id
        }
      })
      return 'Member deleted successfully!'
    }),

  updateMember: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        name: z.string(),
        email: z.string().email().optional(),
        maritalStatus: z.enum(['married', 'unmarried', 'divorced', 'widowed']),
        gender: z.enum(['male', 'female', 'other']),
        birthday: z.date(),
        contact: z.string().min(10).max(10).optional(),
        occupation: z.string(),
        qualification: z.string(),
        gautra: z.string(),
        nativeTown: z.string(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        address: z.string(),
        isPrivateProperty: z.boolean().default(false),
        relationWithHead: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      if (input.email) {
        const isEmailValid = await validate(input.email)
        if (!isEmailValid.valid) {
          throw new Error(
            'This email address not found, please provide valid email address!'
          )
        }
      }
      await prisma.user.update({
        where: {
          id: input.userId,
          headId: session.user.id
        },
        data: {
          ...input,
          updatedById: session.user.id
        }
      })
      return 'Member updated successfully!'
    })
})
