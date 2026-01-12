import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import { protectedProcedure } from '../init';
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ctx}) => {
    return prisma.user.findMany({
      where:{
        id:ctx.auth.user.id
      }
    })
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;