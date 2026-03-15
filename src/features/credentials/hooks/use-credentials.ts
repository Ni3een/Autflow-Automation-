import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {useMutation} from "@tanstack/react-query";
import { toast } from "sonner";
import {CredentialType} from "@prisma/client";
import {useQuery} from "@tanstack/react-query";
import {useCredentialsParams} from "./use-credentials-params"; 
import { Type } from "lucide-react";
export const  useSuspenseCredentials=()=>{
    const trpc=useTRPC();
    const [params,setParams]=useCredentialsParams()
    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
}

// hooks to create a new credtianls
export const useCreateCredentials=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess(data){
                toast.success(`Credentials "${data.name}" created successfully`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}  
                ));
            },
            onError(error){
                toast.error(`Failed to create credentials: ${error.message}`);
            }
        
        })
    );
}
export const useRemoveCredentials=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();
    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess(data){
                toast.success(`Credentials "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({id:data.id}));
            }
        })

)
}
// hook to get a single creditials with suspense
export const  useSuspenseCredential=(id:string)=>{
    const trpc=useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
}
export const useUpdateCredentials=()=>{
    const trpc=useTRPC();
    const queryClient=useQueryClient();

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess(data){
                toast.success(`Credentials "${data.name}" saved successfully`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}  
                ));
                queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({id:data.id}));
            },
            onError(error){
                toast.error(`Failed to save credentials: ${error.message}`);
            }
        
        })
    );
}
export const useCredentialsByType=(type:CredentialType)=>{
    const trpc=useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({ type }));
}
