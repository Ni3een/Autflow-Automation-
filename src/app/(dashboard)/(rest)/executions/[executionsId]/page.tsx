import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { ExecutionView } from "@/features/executions/components/execution";
import { ExecutionsErrorView, ExecutionsLoading } from "@/features/executions/components/executions";

interface PageProps {
    params: Promise<{ executionsId: string }>;
}

const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { executionsId } = await params;
    
    prefetchExecution(executionsId);

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<ExecutionsErrorView/>}>
                        <Suspense fallback={<ExecutionsLoading/>}>
                            <ExecutionView executionId={executionsId}/>
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    );
};

export default Page;