"use client"
import {EmptyView, EntityItem, LoadingView} from "@/components/entity-components";
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
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { UseEntitySearch } from "../hooks/use-entity-search";
import { EntityList } from "@/components/entity-components";
import { ErrorView } from "@/components/entity-components";
import type { Workflow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
import {useRemoveCredentials} from "../hooks/use-credentials";
import type { Credential } from "@prisma/client";
import { CredentialType } from "@prisma/client";
import  Image  from "next/image";
import { useSuspenseCredentials } from "../hooks/use-credentials";
export const CredentialsSearch=()=>{
    const [params,setParams]=useCredentialsParams();
    const {searchValue,onSearchChange}=UseEntitySearch({
        params,setParams
    });
    return(
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Credentials"
        />
    )
}
export const CredentialsList=()=>{
    const credentials=useSuspenseCredentials();
   return(
    <EntityList 
    items={credentials.data.items}
    getKey={(credential)=>credential.id}
    renderItem={(credential)=><CredentialsItem data={credential}/>}
    emptyView={<CredentialsEmpty/>}
    />
   )
}
export const CredentialsHeader=({disabled}:{disabled?:boolean})=>{
    return(
       
        <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonHref="/credentials/new"
        disabled={disabled}
        newButtonLabel="New Credential"
        />)
}
export const CredentialsPagination=()=>{
    const credentials=useSuspenseCredentials();
    const [params,setParams]=useCredentialsParams();
    return(
        <EntityPagination disabled=
        {credentials.isPending}
        totalPages={credentials.data.totalPages}
        page={credentials.data.page}
        onPageChange={(page)=>setParams({...params,page})}
        />
    )
}
export const CredentialsContainer=({children}:{children:React.ReactNode})=>{
    return(
        <EntityContainer
        header={<CredentialsHeader/>}
        search={<CredentialsSearch/>}
        pagination={<CredentialsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading=()=>{
    return(
        <LoadingView message="Loading credentials..."></LoadingView>


    )
}

export const CredentialsErrorView=()=>{
    return (
        <ErrorView message="Error loading credentials...."></ErrorView>
    )
}
export const CredentialsEmpty=()=>{
    const router=useRouter();
    const {handleError,modal}=useUpgradeModal()
    const handlecreate=()=>{console.log('Create credential')
        router.push(`/credentials/new`)
    }
            
    return(
        <EmptyView 
            onNew={handlecreate}
            message="No items"
            description="You haven't created any credentials yet. Get started by creating your first credential"
        />
    )
}
const credentialLogos:Record<CredentialType,string>={
    [CredentialType.OPENAI]:"/logo/openai.svg",
    [CredentialType.GROQ]:"/logo/groq.svg",
    [CredentialType.GEMINI]:"/logo/gemini-color.svg",
    [CredentialType.DEEPSEEK]:"/logo/deepseek.svg"
}
export const CredentialsItem=({data}: {data: Credential})=>{
    const removeCredential=useRemoveCredentials();
    const handleRemove=()=>{
        removeCredential.mutate({id:data.id});
    }
    const logo=credentialLogos[data.type] || "/logo/openai.svg"
    return(
        <EntityItem
        href={`/credentials/${data.id}`}
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
                <Image src={logo} alt={data.type} width={20} height={20} />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}
        />
    )
}
