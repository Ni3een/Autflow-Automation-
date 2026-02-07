"use client"

import type {NodeProps} from "@xyflow/react"
import {PlusIcon} from "lucide-react"
import {memo,useState} from "react"
import {PlaceholderNode} from "./react-flow/placeholder-node"
import { WorkflowNode } from "./workflow-nodes"
import { NodeSelector } from "./node-selector"
import { set } from "zod"

export const InitialNode=memo((props:NodeProps)=>{
    const [selectorProps,setSelectorProps]=useState(false)
    return (
        <NodeSelector open={selectorProps} onOpenChange={setSelectorProps}>
        <WorkflowNode showToolbar={false}>
            <PlaceholderNode
            {...props}
            onClick={()=>setSelectorProps(true)}
            >
                <div className="cursor-pointer flex items-center justify-center">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
            </WorkflowNode>
            </NodeSelector>

    )
})