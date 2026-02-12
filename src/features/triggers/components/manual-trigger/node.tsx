import {memo} from "react"
import {NodeProps} from "@xyflow/react"
import {BaseTriggerNode} from "../base-trigger-nodes"
import {MousePointerIcon} from "lucide-react"
import { ManualTriggerDialog } from "./dialog"
import {useState} from "react"
export const ManualTriggerNode=memo((props:NodeProps)=>{
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSetting=()=>{
        setDialogOpen(true);
    } 
    const nodeStatus="loading"

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
    )
})