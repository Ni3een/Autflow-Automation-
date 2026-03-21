import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ExecutionsErrorView, ExecutionsLoading, ExecutionsList } from "@/features/executions/components/executions";
import { ExecutionsContainer } from "@/features/executions/components/executions";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { exec } from "child_process";
interface PageProps {
    searchParams: Promise<SearchParams>;
}
const Page = async ({ searchParams }: PageProps) => {
    await requireAuth();

    const cleanSearchParams = await executionsParamsLoader(searchParams);
    prefetchExecutions(cleanSearchParams);

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<ExecutionsErrorView/>}>
                        <Suspense fallback={<ExecutionsLoading/>}>
                            <ExecutionsContainer>
                                <ExecutionsList />
                            </ExecutionsContainer>
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>

        </div>
    )
}

export default Page;