import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {useMutation} from "@tanstack/react-query";
import { toast } from "sonner";
import {CredentialType} from "@prisma/client";
import {useQuery} from "@tanstack/react-query";
import { Type } from "lucide-react";
import { useExecutionsParams } from "./use-executions-params";
export const  useSuspenseExecutions=()=>{
    const trpc=useTRPC();
    const [params,setParams]=useExecutionsParams()
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
}

// hook to get a single creditials with suspense
export const  useSuspenseExecution=(id:string)=>{
    const trpc=useTRPC();
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
}

