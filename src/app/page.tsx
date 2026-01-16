"use client"
import { requireAuth } from "@/lib/auth-utils"
import { UnrequireAuth } from "@/lib/auth-utils"
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import {useMutation, useQuery} from "@tanstack/react-query" 
import { Button } from "@/components/ui/button";

const Page=()=>{
  const trpc=useTRPC();
  const testAi=useMutation(trpc.testAi.mutationOptions())
  const {data, refetch}=useQuery(trpc.getWorkflows.queryOptions())
  const create=useMutation(trpc.createWorkflows.mutationOptions({
    onSuccess: () => {
      refetch();
    }
  }))

  const handleCreateWorkflow = () => {
    create.mutate();
  }

   return (
      <div  className="min-h-screen min-w-screen flex flex-col gap-4 items-center justify-center">
        <Button 
          onClick={handleCreateWorkflow}
          disabled={create.isPending}
        >
          {create.isPending ? "Creating..." : "Create Workflow (Test Inngest)"}
        </Button>
        
        {create.isSuccess && (
          <p className="text-green-500">✅ Background job triggered! Check Inngest dashboard.</p>
        )}
        
        {create.isError && (
          <p className="text-red-500">❌ Error: {create.error?.message}</p>
        )}
        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>Test AI</Button>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Workflows:</h3>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
  )
}

export default Page 