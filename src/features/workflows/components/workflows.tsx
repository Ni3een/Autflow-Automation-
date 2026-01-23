"use client"
import {useCreateWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {EntityHeader} from "@/components/entity-components";
import {EntityContainer} from "@/components/entity-components";
import { UpgradeModal } from "@/components/upgrade-model";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useTRPC } from "@/trpc/client";
import { router } from "better-auth/api";
import { useRouter } from "next/dist/client/components/navigation";
export const WorkflowsList=()=>{
    const workflows=useSuspenseWorkflows();
    return (
        <div className="flex-1 flex justify-center items-center">
            <p>
            {JSON.stringify(workflows.data,null,2)}
            </p>
        </div>
    )
}
export const WorkflowsHeader=({disabled}:{disabled?:boolean})=>{
    const router=useRouter();
    const createWorkflow=useCreateWorkflow();
    const {handleError, modal}=useUpgradeModal()
    const handlecreate=()=>{
        createWorkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`);
            },
            onError:(error)=>{
                handleError(error);}
            
        })
    }
    return(
        <>
        {modal}
        <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew ={handlecreate}
        disabled={disabled}
        newButtonLabel="New Workflow"
        isCreating={createWorkflow.isPending}
        />
        </>
    )
}
export const WorkflowsContainer=({children}:{children:React.ReactNode})=>{
    return(
        <EntityContainer
        header={<WorkflowsHeader/>}
        search={<></>}
        pagination={<></>}
        >
            {children}


        </EntityContainer>
    )
}