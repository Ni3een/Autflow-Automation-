import {memo} from "react"
import {NodeProps} from "@xyflow/react"
import {BaseTriggerNode} from "../base-trigger-nodes"
import {MousePointerIcon} from "lucide-react"
import {useState} from "react"

import {GOOGLE_FORM_TRIGGER_CHANNEL_NAME} from "@/inngest/channels/google-form-trigger"
import {fetchStripeTriggerRealtimeToken} from "./actions"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"
import { StripeTriggerDialog } from "./dialog"
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger"
export const StripeTriggerNode=memo((props:NodeProps)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSetting=()=>{
        setDialogOpen(true);
    } 
    const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:STRIPE_TRIGGER_CHANNEL_NAME,
        topic:"status",
        refreshToken:fetchStripeTriggerRealtimeToken,
    })
    return (
        <>
        <   StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
        <BaseTriggerNode
        {...props}
        icon="/logo/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
        />
        </>
    ); 
});
