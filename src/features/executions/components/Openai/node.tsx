"use client"
import {useState} from "react"
import {Node ,NodeProps, useReactFlow} from "@xyflow/react"
import {GlobeIcon} from "lucide-react"
import {BaseExecutionNode} from "../base-execution-nodes"
import {memo} from "react"

import {OpenAiDialog, type OpenaiFormValues} from "./dialog"
import  {fetchOpenAiRealtimeToken} from "./actions"
import {OPENAI_CHANNEL_NAME} from "@/inngest/channels/openai"
import {openai} from "@ai-sdk/openai"
import { useNodeStatus } from "../../hooks/use-node-status"
type OpenaiNodeData={
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};
type OpenaiNodeType=Node<OpenaiNodeData>;
export const OpenAiNode=memo((props:NodeProps<OpenaiNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:OPENAI_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchOpenAiRealtimeToken,
    });
    const handleOpenSetting=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
    const handleSubmit=(values:OpenaiFormValues )=>{
        setNodes((nodes)=> nodes.map(node=>{
            if(node.id===props.id){
                return {
                    ...node,
                    data:{
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))
    }
    const nodeData=props.data;
    const description=nodeData.userPrompt?`gpt-3.5-turbo:${nodeData.userPrompt.slice(0,50)}...`:"No prompt set"
    return (
        <>
        <OpenAiDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/openai.svg"
        name="OpenAI"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    )
});
OpenAiNode.displayName="OpenAiNode";