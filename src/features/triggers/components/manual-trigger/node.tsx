import {memo} from "react"
import {NodeProps} from "@xyflow/react"
import {BaseTriggerNode} from "../base-trigger-nodes"
import {MousePointerIcon} from "lucide-react"
import { ManualTriggerDialog } from "./dialog"
import {useState} from "react"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"
import {fetchManualTriggerRealtimeToken} from "./actions"
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual_trigger"
export const ManualTriggerNode=memo((props:NodeProps)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSetting=()=>{
        setDialogOpen(true);
    } 
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:MANUAL_TRIGGER_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchManualTriggerRealtimeToken,
    });
    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When Clicking Execute Workflow"
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    ); 
});
