import type { inferInput} from '@trpc/tanstack-react-query';
import {prefetch,trpc} from '@/trpc/server';

type Input=inferInput<typeof trpc.workflows.getMany>;


export const prefetchWorkflows=async(input:Input)=>{
    await prefetch(trpc.workflows.getMany.queryOptions(input));
}