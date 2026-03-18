import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { NodeType } from "@prisma/client";
import { NodeExecutor } from "@/features/executions/types";
import { Node, Edge } from "@xyflow/react";
import { topologicalSort } from "./utils";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger"
import {manualTriggerChannel} from "@/inngest/channels/manual_trigger";
import {geminiChannel} from "@/inngest/channels/gemini";
import {openaiChannel} from "@/inngest/channels/openai";
import { getExecutor } from "@/features/executions/components/http-request/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { grokChannel } from "./channels/groq";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",retries:0},
  { event: "workflows/execute.workflow",
    channels:[
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      grokChannel(),
      discordChannel(),
      slackChannel(),
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
    const userId=await step.run("find-user-id",async()=>{
      const workflow=await prisma.workflow.findUniqueOrThrow({
        where:{ id: workflowId },
        select:{
          userId:true,
        }
      })
      return workflow.userId;
    })
    let context=event.data.initialData ||{};
    for(const node of sortedNodes){
      const executor=getExecutor(node.type as NodeType);
      context=await executor({
        data:node.data as Record<string,unknown>,
        nodeId:node.id,
        userId,
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