import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";
import { connection } from "next/server";
import prisma from "@/lib/db";
import { NodeType } from "@prisma/client";
import { NodeExecutor } from "@/features/executions/types";
import { Node, Edge } from "@xyflow/react";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/components/http-request/lib/executor-registry";export const executeWorkflow=inngest.createFunction({id:"execute-workflow"},{event:"workflows/execute.workflow"},async({event,step})=>{
  const workflowId=event.data.workflowId;
  if(!workflowId){
  throw new NonRetriableError("workflowId is required");
  }
  const Sortednodes=await step.run("fetch-workflow-nodes",async()=>{
    const workflow=await prisma.workflow.findUniqueOrThrow({
      where:{id:workflowId},
      include:{
        nodes:true,
        connections:true,
      },
    });
    return topologicalSort(workflow.nodes,workflow.connections);
    
  });
  let context=event.data.initialData || {};
  for(const node of Sortednodes){
    const executor=getExecutor(node.type as NodeType)
    context=await executor({
      data:node.data as Record<string,unknown>,
      nodeId:node.id,
      context,
      step,
    })
  }
  return {
    workflowId,
    result:context,
  };
})