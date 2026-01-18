import { z } from 'zod';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
      data: {},
    }); 

    return { success: true, message: "AI Executed" };
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflows: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "nitinbhatt",
        userId: ctx.auth.user.id,
      },
    });

    return { success: true, message: "Workflow Created" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
