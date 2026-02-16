import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { NodeType } from "@prisma/client";
import { NodeExecutor } from "@/features/executions/types";
import { Node, Edge } from "@xyflow/react";
import { topologicalSort } from "./utils";
import {manualTriggerChannel} from "@/inngest/channels/manual_trigger";
import { getExecutor } from "@/features/executions/components/http-request/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",retries:0},
  { event: "workflows/execute.workflow",
    channels:[
      httpRequestChannel(),
      manualTriggerChannel(),
    ]
   },
  async ({ event, step,publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }
    const sortedNodes=await step.run("prepare-workflow",async()=>{
      const workflow=await prisma.workflow.findUniqueOrThrow({
      where:{ id: workflowId },
      include:{
        nodes:true,
        connections:true,
      }
      })
      return topologicalSort(workflow.nodes,workflow.connections)
    })
    let context=event.data.initialData ||{};
    for(const node of sortedNodes){
      const executor=getExecutor(node.type as NodeType);
      context=await executor({
        data:node.data as Record<string,unknown>,
        nodeId:node.id,
        context,
        step,
        publish
      })
    }
    return {
      workflowId,
      result:context,
    }
  }
);