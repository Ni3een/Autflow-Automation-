"use client"
import {useState} from "react"
import {Node ,NodeProps, useReactFlow} from "@xyflow/react"
import {GlobeIcon} from "lucide-react"
import {BaseExecutionNode} from "../base-execution-nodes"
import {memo} from "react"
import {HTTPRequestDialog} from "./dialog"
import {fetchHttpRequestRealtimeToken} from "./actions"
import { HttpRequestFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request"
type HttpRequestNodeData={
    variableName?:string;
    endpoint?:string;
    method?:"GET"|"POST"|"PUT"|"DELETE"|"PATCH";
    body?:string;
};
type HttpRequestNodeType=Node<HttpRequestNodeData>;
export const HttpRequestNode=memo((props:NodeProps<HttpRequestNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:HTTP_REQUEST_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchHttpRequestRealtimeToken,
    });
    const handleOpenSetting=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
    const handleSubmit=(values:HttpRequestFormValues)=>{
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
    const description=nodeData?.endpoint?
    `${nodeData.method || "GET"} : ${nodeData.endpoint}`:"No endpoint configured";
    return (
        <>
        <HTTPRequestDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode 
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    )
});
HttpRequestNode.displayName="HttpRequestNode";