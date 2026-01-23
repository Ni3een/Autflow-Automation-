import prisma from '@/lib/db';
import { createTRPCRouter, premiumProcedure} from '@/trpc/init';
import { protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import {generateSlug} from "random-word-slugs"
export const workflowsRouter=createTRPCRouter({
    create:protectedProcedure.mutation(({ctx})=>{
        return prisma.workflow.create({
            data:{
                name:generateSlug(3),
                userId:ctx.auth.user.id,
            },
        })
    }),
   remove:protectedProcedure.input(z.object({
        id:z.string(),
   })).mutation(({ctx,input})=>{
        return prisma.workflow.delete({
            where:{
                id:input.id,
                userId:ctx.auth.user.id,
            },
        })
    }),
    updateName:protectedProcedure
    .input(z.object({id:z.string(),name:z.string().min(1)})).
    mutation(({ctx,input})=>{
        return prisma.workflow.update({
            where:{id:input.id,userId:ctx.auth.user.id},
            data:{name:input.name}
        })
    }),
    getOne:protectedProcedure
    .input(z.object({id:z.string()}))
    .query(({ctx,input})=>{
        return prisma.workflow.findMany({
            where:{id:input.id,userId:ctx.auth.user.id},
        })
    }),
    getMany:protectedProcedure
    .input(z.object({search:z.string()}))
    .query(({ctx,input})=>{
        return prisma.workflow.findMany({
            where:{userId:ctx.auth.user.id},
        })
    })
   })

   

