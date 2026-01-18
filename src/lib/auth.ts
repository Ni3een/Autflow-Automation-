import {betterAuth} from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import {checkout,polar,portal} from "@polar-sh/better-auth";
import prisma from "@/lib/db";
import {polarClient } from "./polar"
export const auth=betterAuth({
     database:prismaAdapter(prisma,{
        provider:'postgresql',
     }),
     emailAndPassword:{
        enabled:true,
        autoSignIn:true,
     },
     plugins:[
      polar({
         client:polarClient,
         organizationId:process.env.POLAR_ORGANIZATION_ID!,
         createCustomerOnSignup:true,
         use:[
            checkout({
               products:[
                  {
                     productId:"a1e19edd-d8bd-4dfb-9cb2-49ae914d956d",
                     slug:"pro"
                  }
               ],
               successUrl:process.env.POLAR_SUCCESS_URL!,
               authenticatedUsersOnly:true,
            }),
            portal()
         ]
      })
     ]
});









// Users can sign up/login with email + password
// When they sign up → a corresponding customer is automatically created in Polar (your payment processor)
// Logged-in users can buy subscriptions/products (e.g., your "Pro" plan)
// They get a customer portal to manage their subscriptions/billing
// Everything stays in sync between your database and Polar