"use client"
import {EmptyView, EntityItem, LoadingView} from "@/components/entity-components";
import {useCreateWorkflow, useSuspenseWorkflows} from "@/features/workflows/hooks/use-workflows";
import {EntityHeader, EntityPagination} from "@/components/entity-components";
import {EntityContainer} from "@/components/entity-components";
import {useRemoveWorkflow} from "@/features/workflows/hooks/use-workflows";
import { UpgradeModal } from "@/components/upgrade-model";
import {formatDistanceToNow} from "date-fns";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useTRPC } from "@/trpc/client";
import { router } from "better-auth/api";
import { useRouter } from "next/dist/client/components/navigation";
import { EntitySearch } from "@/components/entity-components";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { UseEntitySearch } from "../hooks/use-entity-search";
import { EntityList } from "@/components/entity-components";
import { ErrorView } from "@/components/entity-components";
import type { Workflow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
export const WorkflowsSearch=()=>{
    const [params,setParams]=useWorkflowsParams();
    const {searchValue,onSearchChange}=UseEntitySearch({
        params,setParams
    });
    return(
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Workflows"
        />
    )
}
export const WorkflowsList=()=>{
    const workflows=useSuspenseWorkflows();
   return(
    <EntityList 
    items={workflows.data.items}
    getKey={(workflow)=>workflow.id}
    renderItem={(workflow)=><WorkflowsItem data={workflow}/>}
    emptyView={<WorkFlowEmpty/>}
    />
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
export const WorkflowPagination=()=>{
    const workflows=useSuspenseWorkflows();
    const [params,setParams]=useWorkflowsParams();
    return(
        <EntityPagination disabled=
        {workflows.isPending}
        totalPages={workflows.data.totalPages}
        page={workflows.data.page}
        onPageChange={(page)=>setParams({...params,page})}
        />
    )
}
export const WorkflowsContainer=({children}:{children:React.ReactNode})=>{
    return(
        <EntityContainer
        header={<WorkflowsHeader/>}
        search={<WorkflowsSearch/>}
        pagination={<WorkflowPagination/>}
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading=()=>{
    return(
        <LoadingView message="Loading workflows..."></LoadingView>


    )
}

export const WorkErrorView=()=>{
    return (
        <ErrorView message="Error loading workflows...."></ErrorView>
    )
}
export const WorkFlowEmpty=()=>{
    const router=useRouter();
    const createWorkflow=useCreateWorkflow();
    const {handleError,modal}=useUpgradeModal()
    const handlecreate=()=>{console.log('Create workflow')
        createWorkflow.mutate(undefined,{
            onError:(error)=>{
                handleError(error);
            },
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`);
            }
            
        })
    }
            
    return(
        <>
        {modal}
        <EmptyView 
            onNew={handlecreate}
            message="No items"
            description="You haven't created any workflows yet. Get started by creating your first workflow"
        />
        </>
    )
}

export const WorkflowsItem=({data}: {data: Workflow})=>{
    const removeWorkflow=useRemoveWorkflow();
    const handleRemove=()=>{
        removeWorkflow.mutate({id:data.id});
    }
    return(
        <EntityItem
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt,{addSuffix:true})}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        />
    )
}
