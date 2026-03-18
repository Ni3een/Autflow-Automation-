"use client"
import {useState} from "react"
import {Node ,NodeProps, useReactFlow} from "@xyflow/react"
import {BaseExecutionNode} from "../base-execution-nodes"
import {memo} from "react"
import { SlackDialog } from "./dialog"
import { SlackFormValues } from "./dialog"
import {SLACK_CHANNEL_NAME} from "@/inngest/channels/slack"
import { fetchSlackRealtimeToken } from "./actions"
import { useNodeStatus } from "../../hooks/use-node-status"
type SlackNodeData={
    variableName?:string;
    username?:string;
    content?:string;
    webhookUrl?:string;
};
type SlackNodeType=Node<SlackNodeData>;
export const SlackNode=memo((props:NodeProps<SlackNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:SLACK_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchSlackRealtimeToken,
    });
    const handleOpenSetting=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
    const handleSubmit=(values:SlackFormValues )=>{
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
    const description=nodeData?.content? `Sends ${nodeData.content} to Slack`:"Sends a message to Slack";
    return (
        <>
        <SlackDialog
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        />
        <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/slack.svg"
        name="Slack"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    )
});
SlackNode.displayName="SlackNode";