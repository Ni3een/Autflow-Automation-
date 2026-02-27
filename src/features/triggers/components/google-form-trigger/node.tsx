import {memo} from "react"
import {NodeProps} from "@xyflow/react"
import {BaseTriggerNode} from "../base-trigger-nodes"
import {MousePointerIcon} from "lucide-react"
import { GoogleFormTriggerDialog } from "./dialog"
import {useState} from "react"
import {GOOGLE_FORM_TRIGGER_CHANNEL_NAME} from "@/inngest/channels/google-form-trigger"
import {fetchGoogleFormTriggerRealtimeToken} from "./actions"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"
export const GoogleFormTrigger=memo((props:NodeProps)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSetting=()=>{
        setDialogOpen(true);
    } 
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchGoogleFormTriggerRealtimeToken,
    })
    return (
        <>
        <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode
        {...props}
        icon="/logo/google-form.svg"
        name="Google Form"
        description="When Form is Submitted"
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    ); 
});
