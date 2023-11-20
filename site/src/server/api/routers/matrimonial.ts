import { createTRPCRouter, protectedProcedure, unProtectedProcedure } from "../trpc";
import {z} from 'zod'

export const matrimonialRouter = createTRPCRouter({
    registerMatrimonyProfile: unProtectedProcedure
    .input(
        z.object({
            name: z.string(),
            nativePlace:z.string(),
            currentCity:z.string(),
            height:z.string(),
            bloodGroup:z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            complexion:z.string(),
            dietaryHabits: z.enum(['Vegetarian', 'Non-Vegetarian', 'Vegan']),
            dob: z.date(),
            birthPlace: z.string(),
            religion: z.string(),
            caste: z.string(),
            graduation: z.string(),
            postGraduation: z.string(),
            currentJobProfile: z.string(),
            fatherName: z.string(),
            fatherOccupation: z.string(),
            motherName: z.string(),
            motherOccupation:z.string(),
            siblings: z.string(),
            phoneNumber: z.bigint(),
            address: z.string(),
            manglic: z.boolean(),
            maritalSatus: z.enum(['married',
                'unmarried',
                'divorced',
                'widowed'])
        })
    )
    .mutation(async ({ctx: {prisma}, input})=>{
        const request = await prisma.matrimonial.create({
            data:{
                input
            }
        })
        return request
    }),

    getAll: protectedProcedure
    .query(async ({ctx: {prisma}}) =>{
        const request = await prisma.matrimonial.findMany({
        })
        return request
    }),
    
    updateMatrimonyProfile: protectedProcedure
    .input(
        z.object({
            name: z.string(),
            nativePlace:z.string(),
            currentCity:z.string(),
            height:z.string(),
            bloodGroup:z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            complexion:z.string(),
            dietaryHabits: z.enum(['Vegetarian', 'Non-Vegetarian', 'Vegan']),
            dob: z.date(),
            birthPlace: z.string(),
            religion: z.string(),
            caste: z.string(),
            graduation: z.string(),
            postGraduation: z.string(),
            currentJobProfile: z.string(),
            fatherName: z.string(),
            fatherOccupation: z.string(),
            motherName: z.string(),
            motherOccupation:z.string(),
            siblings: z.string(),
            phoneNumber: z.bigint(),
            address: z.string(),
            manglic: z.boolean(),
            maritalSatus: z.enum(['married',
                'unmarried',
                'divorced',
                'widowed'])
        })
    )
    .mutation(async ({ctx: {prisma}, input})=>{
        const request = await prisma.matrimonial.update({
            data:{
                input
            }
        })
        return request
    }),

    deleteMatrimonyProfile: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ctx: {prisma, session}, input: id}) =>{
        await prisma.user.delete({
            where:{
                id,
                headId: session.user.id
            }
        })
        return 'Matrimony Profile deleted Successfully'
    }),

})