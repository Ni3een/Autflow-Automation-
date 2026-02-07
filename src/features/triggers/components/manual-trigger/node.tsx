import {memo} from "react"
import {NodeProps} from "@xyflow/react"
import {BaseTriggerNode} from "../base-trigger-nodes"
import {MousePointerIcon} from "lucide-react"
export const ManualTriggerNode=memo((props:NodeProps)=>{
    return (
        <>
        <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When Clicking Execute Workflow"
        // statu={nodeStatus}
        //onSettings={handleOpenSetting}
        // onDoubleClick={handleOpenSetting}
        />
        </>
    )
})