import { compare, hash } from 'bcryptjs'
import validate from 'deep-email-validator'
import { z } from 'zod'
import { env } from '~/env.mjs'
import { sendMail } from '~/lib/nodemailer'
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
        fatherName: z.string(),
        birthday: z.date(),
        contact: z.string().min(3).max(255),
        occupation: z.string().min(3).max(255),
        qualification: z.string().min(3).max(255),
        gautra: z.string().min(3).max(255),
        nativeTown: z.string().min(3).max(255),
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
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
        oldPassword: z.string(),
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
        areaId: z.string().uuid(),
        fatherName: z.string()
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
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
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
          headId: session.user.id
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
      const { userId, ...rest } = input
      if (rest.email) {
        const isEmailValid = await validate(rest.email)
        if (!isEmailValid.valid) {
          throw new Error(
            'This email address not found, please provide valid email address!'
          )
        }
      }
      await prisma.user.update({
        where: {
          id: userId,
          headId: session.user.id
        },
        data: {
          ...rest
        }
      })
      return 'Member updated successfully!'
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        name: z.string().optional(),
        qualification: z.string().optional(),
        occupation: z.string().optional(),
        gender: z.enum(['male', 'female', 'other']).optional(),
        gautra: z.string().optional(),
        bloodGroup: z
          .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
          .optional(),
        maritalStatus: z
          .enum(['married', 'unmarried', 'divorced', 'widowed'])
          .optional(),
        familyAnnualIncome: z.string().optional(),
        nativeTown: z.string().optional(),
        address: z.string().optional()
      })
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const { page, limit, gender, bloodGroup, maritalStatus, ...filters } =
        input

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            ...Object.keys(filters).reduce((acc, key) => {
              if ((filters as any)[key]) {
                return {
                  ...acc,
                  [key]: {
                    contains: (filters as any)[key],
                    mode: 'insensitive'
                  }
                }
              }
              return acc
            }, {}),
            ...(gender && { gender }),
            ...(bloodGroup && { bloodGroup }),
            ...(maritalStatus && { maritalStatus })
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            name: 'asc'
          },
          include: {
            area: {
              select: {
                name: true
              }
            },
            members: true
          }
        }),
        prisma.user.count({
          where: {
            ...filters
          }
        })
      ])
      return {
        data: users,
        total
      }
    }),

  registerEmail: unProtectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        contact: z.string().min(10).max(10),
        password: z.string()
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      const { password, ...rest } = input

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          contact: rest.contact
        }
      })
      if (user.headId || !user.password) {
        throw new Error('You are not allowed to register email!')
      }
      const isPasswordValid = await compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Password is not correct!')
      }
      const { valid } = await validate(input.email)
      if (!valid) {
        throw new Error(
          'This email address not found,please provide valid email address!'
        )
      }
      await prisma.user.update({
        where: {
          contact: rest.contact
        },
        data: {
          email: rest.email
        }
      })
      return 'Email updated successfully!'
    }),

  forgotPassword: unProtectedProcedure
    .input(
      z.object({
        email: z.string().email()
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      const { email } = input
      const user = await prisma.user.findUnique({
        where: {
          email,
          headId: null
        }
      })
      if (!user) throw new Error('User not found!')

      if (!user.email) throw new Error('Email not found!')

      const token = await prisma.forgotPasswordToken.create({
        data: { userId: user.id }
      })

      await sendMail({
        to: user.email,
        subject: 'Reset Trimes Password',
        html: `
          <div>
            <p>Hi ${user.name},</p>
            <p>Click on the below link to reset your password</p>
            <a href="${env.NEXTAUTH_URL}/reset-password/${token.id}">Reset Password</a>
          </div>
          `
      })

      return 'Password reset link sent to your email address!'
    }),

  resetPassword: unProtectedProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8).max(255)
      })
    )
    .mutation(async ({ ctx: { prisma }, input }) => {
      const { token, password } = input
      const forgotPasswordToken = await prisma.forgotPasswordToken.findUnique({
        where: {
          id: token
        }
      })

      if (!forgotPasswordToken) throw new Error('Token not found!')
      if (
        forgotPasswordToken.createdAt.getTime() + 1000 * 60 * 100 <
        Date.now()
      )
        throw new Error('Link expired!')
      const hashedPassword = await hash(password, 10)
      await prisma.user.update({
        where: {
          id: forgotPasswordToken.userId
        },
        data: {
          password: hashedPassword
        }
      })
      await prisma.forgotPasswordToken.delete({
        where: {
          id: token
        }
      })
      return 'Password reset successfully!'
    })
})
