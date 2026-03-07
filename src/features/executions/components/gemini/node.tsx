"use client"
import {useState} from "react"
import {Node ,NodeProps, useReactFlow} from "@xyflow/react"
import {GlobeIcon} from "lucide-react"
import {BaseExecutionNode} from "../base-execution-nodes"
import {memo} from "react"
import {GeminiDialoge} from "./dialog"
import {GEMINI_CHANNEL_NAME} from "@/inngest/channels/gemini"
import { GeminiFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request"
import { fetchGeminiRealtimeToken } from "./actions"
type GeminiNodeData={
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};
type GeminiNodeType=Node<GeminiNodeData>;
export const GeminiNode=memo((props:NodeProps<GeminiNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:GEMINI_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchGeminiRealtimeToken,
    });
    const handleOpenSetting=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
    const handleSubmit=(values:GeminiFormValues )=>{
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
    const description=nodeData?.userPrompt || "Not configured";
    return (
        <>
        <GeminiDialoge
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/gemini-color.svg"
        name="Gemini"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    )
});
GeminiNode.displayName="GeminiNode";