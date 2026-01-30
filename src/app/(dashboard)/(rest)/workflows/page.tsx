import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { WorkflowsList, WorkflowsLoading } from "@/features/workflows/components/workflows";
import {ErrorBoundary} from "react-error-boundary";
import { WorkflowsContainer } from "@/features/workflows/components/workflows";
import { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { LoadingView } from "@/components/entity-components";
import { WorkErrorView } from "@/features/workflows/components/workflows";
type Props={
  searchParams:Promise<SearchParams>
}
const page= async ({searchParams}:Props)=>{
    await requireAuth();

    const params=await workflowsParamsLoader(searchParams)
    await prefetchWorkflows(params);
    return (
      <WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary  fallback={<WorkErrorView/>}>
              <Suspense fallback={<WorkflowsLoading />}>
                < WorkflowsList/>

              </Suspense>  
            </ErrorBoundary>
            </HydrateClient>
            </WorkflowsContainer>
      )
}
export default page;
