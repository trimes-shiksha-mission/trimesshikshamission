import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

// Enums
const BloodGroupEnum = z.enum([
  'A_Positive',
  'A_Negative',
  'B_Positive',
  'B_Negative',
  'AB_Positive',
  'AB_Negative',
  'O_Positive',
  'O_Negative'
])

const ComplexionEnum = z.enum(['Fair', 'Wheatish', 'Dark'])

const MaritalStatusEnum = z.enum([
  'divorced',
  'widowed',
  'unmarried',
  'married'
])

const GenderEnum = z.enum(['male', 'female', 'other'])

const IncomeBracketEnum = z.enum([
  'BELOW_3_LAKHS',
  'Three_TO_Five_LAKHS',
  'Five_TO_Ten_LAKHS',
  'Ten_TO_Fifteen_LAKHS',
  'Fifteen_TO_TwentyFive_LAKHS',
  'ABOVE_25_LAKHS'
])

// Siblings Schema
const SiblingsSchema = z.object({
  brothers: z.number().int().nonnegative(),
  sisters: z.number().int().nonnegative()
})

export const MarriageProfileInput = z.object({
  name: z.string(),
  nativePlace: z.string(),
  currentCity: z.string(),
  height: z.string(),
  bloodGroup: BloodGroupEnum,
  complexion: ComplexionEnum.optional(),
  dob: z.coerce.date(),
  birthPlace: z.string(),
  qualification: z.string(),
  currentJobProfile: z.string().optional(),
  annualIncome: IncomeBracketEnum,
  fatherName: z.string(),
  fatherOccupation: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  siblings: SiblingsSchema.optional(),
  parentsContact: z.bigint(),
  address: z.string(),
  manglic: z.boolean(),
  maritalStatus: MaritalStatusEnum,
  gender: GenderEnum
})

export const marriageProfileRouter = createTRPCRouter({
  register: protectedProcedure
    .input(MarriageProfileInput)
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.marriageProfile.create({
        data: {
          ...input,
          siblings: input.siblings
            ? {
                create: input.siblings
              }
            : undefined
        }
      })
    })
})
