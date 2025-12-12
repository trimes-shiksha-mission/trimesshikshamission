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
  gender: GenderEnum,
})

export const marriageProfileRouter = createTRPCRouter({
  register: protectedProcedure
    .input(MarriageProfileInput)
    .mutation(async ({ input, ctx }) => {
      const { siblings, ...rest } = input
      const profile = await ctx.prisma.marriageProfile.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: ctx.session.user.id
            }
          },
          siblings: siblings
            ? {
                create: siblings
              }
            : undefined
        }
      })
      return {
        success: true,
        profileId: profile.id
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: MarriageProfileInput
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { siblings, ...data } = input.data
      const profile = await ctx.prisma.marriageProfile.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id // Ensure ownership
        },
        data: {
          ...data,
          siblings: siblings
            ? {
                upsert: {
                  create: siblings,
                  update: siblings
                }
              }
            : undefined
        }
      })
      return {
        success: true,
        profileId: profile.id
      }
    }),

  getUserProfiles: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.marriageProfile.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        siblings: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),
    
  getMarriageProfiles: protectedProcedure
  .input(
    z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      name: z.string().optional(),
      nativePlace: z.string().optional(),
      currentCity: z.string().optional(),
      height: z.string().optional(),
      bloodGroup: z
        .enum([
          'A_Positive',
          'A_Negative', 
          'B_Positive',
          'B_Negative',
          'AB_Positive',
          'AB_Negative',
          'O_Positive',
          'O_Negative'
        ])
        .optional(),
      complexion: z
        .enum(['Fair', 'Wheatish', 'Dark'])
        .optional(),
      qualification: z.string().optional(),
      currentJobProfile: z.string().optional(),
      annualIncome: z
        .enum([
          'BELOW_3_LAKHS',
          'Three_TO_Five_LAKHS',
          'Five_TO_Ten_LAKHS',
          'Ten_TO_Fifteen_LAKHS',
          'Fifteen_TO_TwentyFive_LAKHS',
          'ABOVE_25_LAKHS'
        ])
        .optional(),
      fatherName: z.string().optional(),
      fatherOccupation: z.string().optional(),
      motherName: z.string().optional(),
      motherOccupation: z.string().optional(),
      birthPlace: z.string().optional(),
      address: z.string().optional(),
      maritalStatus: z
        .enum(['unmarried', 'divorced', 'widowed', 'married'])
        .optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      manglic: z.boolean().optional(),
      ageRange: z.object({
        min: z.number().optional(),
        max: z.number().optional()
      }).optional()
    })
  )
  .query(async ({ ctx: { prisma }, input }) => {
    const { 
      page, 
      limit, 
      bloodGroup, 
      complexion, 
      annualIncome, 
      maritalStatus, 
      gender, 
      manglic,
      ageRange,
      ...stringFilters 
    } = input;

    // Build age filter if ageRange is provided
    const ageFilter = ageRange?.min || ageRange?.max ? {
      dob: {
        ...(ageRange.max && { 
          gte: new Date(new Date().getFullYear() - ageRange.max, 0, 1) 
        }),
        ...(ageRange.min && { 
          lte: new Date(new Date().getFullYear() - ageRange.min, 11, 31) 
        })
      }
    } : {};

    const [profiles, total] = await Promise.all([
      prisma.marriageProfile.findMany({
        where: {
          // String filters with case-insensitive contains search
          ...Object.keys(stringFilters).reduce((acc, key) => {
            if ((stringFilters as any)[key]) {
              return {
                ...acc,
                [key]: {
                  contains: (stringFilters as any)[key],
                  mode: 'insensitive'
                }
              };
            }
            return acc;
          }, {}),
          // Exact match filters for enums and booleans
          ...(bloodGroup && { bloodGroup }),
          ...(complexion && { complexion }),
          ...(annualIncome && { annualIncome }),
          ...(maritalStatus && { maritalStatus }),
          ...(gender && { gender }),
          ...(typeof manglic === 'boolean' && { manglic }),
          // Age filter
          ...ageFilter
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          siblings: true
        }
      }),
      prisma.marriageProfile.count({
        where: {
          ...Object.keys(stringFilters).reduce((acc, key) => {
            if ((stringFilters as any)[key]) {
              return {
                ...acc,
                [key]: {
                  contains: (stringFilters as any)[key],
                  mode: 'insensitive'
                }
              };
            }
            return acc;
          }, {}),
          ...(bloodGroup && { bloodGroup }),
          ...(complexion && { complexion }),
          ...(annualIncome && { annualIncome }),
          ...(maritalStatus && { maritalStatus }),
          ...(gender && { gender }),
          ...(typeof manglic === 'boolean' && { manglic }),
          ...ageFilter
        }
      })
    ]);
    return {
      data: profiles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    };
  }),
})
