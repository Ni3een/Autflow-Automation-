import { requireAuth } from "@/lib/auth-utils";
import { CredentialView } from "@/features/credentials/components/credential";
import { prefetch } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { CredentialsErrorView } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
interface PageProps{
    params:Promise<{credentialId:string}>;
}

const Page= async ({ params }: PageProps)=>{
    await requireAuth();
    const { credentialId } = await params;
    prefetchCredential(credentialId);
    return(
    <div className="p-4 md:px-10 md:py-6 h-full">
    <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
            <ErrorBoundary fallback={<CredentialsErrorView/>}>
            <Suspense fallback={<div>Loading...</div>}>
                <CredentialView credentialId={credentialId} />
                </Suspense>
            </ErrorBoundary>
    </HydrateClient>
    </div>
    </div>
    );
}
export default Page;