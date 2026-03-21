"use client"
import {EmptyView, EntityItem, LoadingView} from "@/components/entity-components";
import {EntityHeader, EntityPagination} from "@/components/entity-components";
import {EntityContainer} from "@/components/entity-components";
import {useRemoveWorkflow} from "@/features/workflows/hooks/use-workflows";
import { UpgradeModal } from "@/components/upgrade-model";
import {formatDistanceToNow} from "date-fns";
import { ExecutionStatus } from "@prisma/client";
import {CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon} from "lucide-react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useTRPC } from "@/trpc/client";
import { router } from "better-auth/api";
import { useRouter } from "next/dist/client/components/navigation";
import { EntitySearch } from "@/components/entity-components";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { EntityList } from "@/components/entity-components";
import { ErrorView } from "@/components/entity-components";
import type { Execution, Workflow } from "@prisma/client";

import { WorkflowIcon } from "lucide-react";
import type { Credential } from "@prisma/client";
import { CredentialType } from "@prisma/client";
import  Image  from "next/image";
import { useSuspenseExecutions } from "../hooks/use-executions";

export const ExecutionsList=()=>{
    const executions=useSuspenseExecutions();
   return(
    <EntityList 
    items={executions.data.items}
    getKey={(execution)=>execution.id}
    renderItem={(execution)=><ExecutionsItem data={execution}/>}
    emptyView={<ExecutionsEmpty/>}
    />
   )
}
export const ExecutionsHeader=()=>{
    return(
       
        <EntityHeader
        title="Executions"
        description="View and manage your executions history"
        
        />)
}
export const ExecutionsPagination=()=>{
    const executions=useSuspenseExecutions();
    const [params,setParams]=useExecutionsParams();
    return(
        <EntityPagination disabled=
        {executions.isPending}
        totalPages={executions.data.totalPages}
        page={executions.data.page}
        onPageChange={(page)=>setParams({...params,page})}
        />
    )
}
export const ExecutionsContainer=({children}:{children:React.ReactNode})=>{
    return(
        <EntityContainer
        header={<ExecutionsHeader/>}
        pagination={<ExecutionsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}

export const ExecutionsLoading=()=>{
    return(
        <LoadingView message="Loading executions..."></LoadingView>


    )
}

export const ExecutionsErrorView=()=>{
    return (
        <ErrorView message="Error loading executions...."></ErrorView>
    )
}
export const ExecutionsEmpty=()=>{
    const router=useRouter();
    const {handleError,modal}=useUpgradeModal()
    const handlecreate=()=>{console.log('Create execution')
        router.push(`/executions/new`)
    }
            
    return(
        <EmptyView 
            message="No items"
            description="You haven't created any executions yet. Get started by creating your first execution"
        />
    )
}
const getStatusIcons=(status:ExecutionStatus)=>{
    switch(status){
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600"/>
            case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600"/>
            case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>

            default:
                return <ClockIcon className="size-5 text-muted-foreground"/>
    }
}
const formatStatus=(status:ExecutionStatus)=>{
    return status.charAt(0)+status.slice(1).toLowerCase();
}
export const ExecutionsItem=({data}: {data: Execution &{workflow:{id:string, name:string}}})=>{
    const duration=data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime()-new Date(data.startedAt).getTime())/1000)
    : null;
    const subtitle=(
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt,{addSuffix:true})}
        {duration!==null && <> &bull; Took {duration}s</>}
        </>
    )
       return(
        <EntityItem
        href={`/executions/${data.id}`}
        title={formatStatus(data.status)}
        subtitle={subtitle}
        image={
            <div className="size-8 flex items-center justify-center">
                {getStatusIcons(data.status)}
            </div>
        }
        />
    )
}
