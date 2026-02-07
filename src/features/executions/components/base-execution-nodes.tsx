"use client"

import {type NodeProps,Position} from "@xyflow/react"
import {type LucideIcon} from "lucide-react"
import Image from "next/image"
import {memo,type ReactNode,useCallback} from "react"

import {BaseNode,BaseNodeContent} from "../../../components/react-flow/base-node"
import {BaseHandle} from "../../../components/react-flow/base-handle"
import {WorkflowNode} from "../../../components/workflow-nodes"

interface BaseExecutionNodeProps extends NodeProps{
    icon:LucideIcon | string;
    name:string;
    description?:string;
    children?:ReactNode;
    //status?:NodeStatus;
    onSettings?:()=>void;
    onDoubleClick?:()=>void;
}

export const BaseExecutionNode = memo(
    ({
        id,
        icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick,
    }:BaseExecutionNodeProps)=>{
        const handleDelete=()=>{

        }
        return(
            <WorkflowNode
                name={name}
                description={description}
                onSettings={onSettings}
                >
                    <BaseNode onDoubleClick={onDoubleClick}>
                    <BaseNodeContent>
                    {typeof icon === "string" ? (
                        <Image src={icon} alt={name} width={16} height={16} />
                    ) : (
                        (() => { const IconComponent = icon; return <IconComponent className="size-4 text-muted-foreground" />; })()
                    )}
                        {children}
                        <BaseHandle
                        id="target-1"
                        type="target"
                        position={Position.Left}
                        >
                        </BaseHandle>
                         <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                        >
                        </BaseHandle>
                    </BaseNodeContent>
                    </BaseNode>
            </WorkflowNode>
        )
    }
)

BaseExecutionNode.displayName="BaseExecutionNode"