import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { workflowsRouter } from '@/features/workflows/server/router';
import { credentialsRouter } from '@/features/credentials/server/routers';
export const appRouter = createTRPCRouter({
  workflows:workflowsRouter,
  credentials:credentialsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
