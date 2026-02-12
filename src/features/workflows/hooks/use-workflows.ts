import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {useMutation} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
export const  useSuspenseWorkflows=()=>{
    const trpc=useTRPC();
    const [params,setParams]=useWorkflowsParams()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

// hooks to create a new Workflow
export const useCreateWorkflow=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess(data){
                toast.success(`Workflow "${data.name}" created successfully`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}  
                ));
            },
            onError(error){
                toast.error(`Failed to create workflow: ${error.message}`);
            }
        
        })
    );
}
export const useRemoveWorkflow=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();
    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess(data){
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id:data.id}));
            }
        })

)
}
// hook to get a single workflow with suspense
export const  useSuspenseWorkflow=(id:string)=>{
    const trpc=useTRPC();
    const [params,setParams]=useWorkflowsParams()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

// hook to update workflow name
export const useUpdateWorkflowName=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess(data){
                toast.success(`Workflow "${data.name}" updated`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}  
                ));
                queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id:data.id}));
            },
            onError(error){
                toast.error(`Failed to update workflow: ${error.message}`);
            }
        
        })
    );
}
export const useUpdateWorkflow=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();

    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess(data){
                toast.success(`Workflow "${data.name}" saved successfully`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}  
                ));
                queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id:data.id}));
            },
            onError(error){
                toast.error(`Failed to save workflow: ${error.message}`);
            }
        
        })
    );
}