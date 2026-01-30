import { requireAuth } from "@/lib/auth-utils";
import { WorkflowEditor } from "@/features/workflows/components/workflow-editor";
import { prefetch } from "@/trpc/server";
import {  prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { WorkflowsLoading } from "@/features/workflows/components/workflows";
import { ErrorBoundary } from "react-error-boundary";
import { WorkErrorView } from "@/features/workflows/components/workflows";
import { EditorError } from "@/features/editor/components/editor";
import { EditorLoading } from "@/features/editor/components/editor";
import { Editor } from "@/features/editor/components/editor";
import {EditorHeader} from "@/features/editor/editor-header";
interface PageProps{
params:Promise<{workflowId:string}>;
}

const Page=async({params}: PageProps)=>{
    await requireAuth();
    const { workflowId } = await params;
    prefetchWorkflow(workflowId);

    return (
        <HydrateClient>
        <ErrorBoundary  fallback={<EditorError/>}>
            <Suspense fallback={<EditorLoading/>}>
            <EditorHeader workflowId={workflowId} />
            <main className="flex-1">
            <Editor workflowId={workflowId} />
            </main>
                      </Suspense>
                    </ErrorBoundary>
        </HydrateClient>
    )
}
export default Page;