"use client"
import {useState} from "react"
import {Node ,NodeProps, useReactFlow} from "@xyflow/react"
import {GlobeIcon} from "lucide-react"
import {BaseExecutionNode} from "../base-execution-nodes"
import {memo} from "react"
import {GroqDialoge, type GroqFormValues} from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import {  fetchGroqRealtimeToken } from "./actions"
import { GROQ_CHANNEL_NAME } from "@/inngest/channels/groq"
type GroqNodeData={
    variableName?:string;
    credentialId?:string;
    systemPrompt?:string;
    userPrompt?:string;
};
type GroqNodeType=Node<GroqNodeData>;
export const GroqNode=memo((props:NodeProps<GroqNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:GROQ_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchGroqRealtimeToken,
    });
    const handleOpenSetting=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
    const handleSubmit=(values:GroqFormValues)=>{
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
        <GroqDialoge
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/groq.svg"
        name="Groq"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    )
});
GroqNode.displayName="GroqNode";