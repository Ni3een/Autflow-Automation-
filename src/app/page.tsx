import React, { Suspense } from "react";
import { getQueryClient,trpc } from "@/trpc/server";
import Prisma from "@/lib/db";
import { Client } from "@/app/client";

import { cn } from "@/lib/utils";
import {caller} from "@/trpc/server";
import {Button} from "@/components/ui/button";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
const Page= async ()=>{ 
  const queryClient= getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
      <div  className="min-h-screen min-w-screen flex items-center justify-center">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<div>Loading...</div>}>
            <Client/>
          </Suspense>
        </HydrationBoundary>
        </div>
  )
}

export default Page 