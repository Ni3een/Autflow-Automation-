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