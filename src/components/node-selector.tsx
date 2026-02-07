"use client"

import {createId} from "@paralleldrive/cuid2"
import {useReactFlow} from   "@xyflow/react"
import {
    GlobeIcon,MousePointerIcon

} from "lucide-react"
import {PlaceholderNode} from "./react-flow/placeholder-node"
import {useCallback} from "react"

import {toast} from "sonner"
import {NodeType} from "@prisma/client"
import {Separator} from "@/components/ui/separator"
import {
    Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription,SheetClose,SheetFooter,
    SheetTrigger
} from "@/components/ui/sheet"

export type NodeTypeOption={
    type:NodeType;
    label:string;
    description:string;
    icon:React.ComponentType<{className?:string}> | string;
}
const TriggerNodes:NodeTypeOption[]=[
    {
        type:NodeType.MANUAL_TRIGGER,
        label:"Trigger manually",
        description:"Run the workflow on clicking a button.Good for getting started quickly",
        icon:MousePointerIcon,
    }
]

const excutionNodes:NodeTypeOption[]=[
    {
        type:NodeType.HTTP_REQUEST,
        label:"HTTP Request",
        description:"Make HTTP requests to interact with APIs and web services",
        icon:GlobeIcon,
    }
]
interface NodeSelectorProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    children?:React.ReactNode;
}
export function NodeSelector({
    open,
    onOpenChange,
    children,
}:NodeSelectorProps){
    const {setNodes,getNodes,screenToFlowPosition}=useReactFlow();
    const handleNodeSelect= useCallback((selection:NodeTypeOption)=>{
        if(selection.type===NodeType.MANUAL_TRIGGER){
            const nodes=getNodes()
            const hasManualTrigger=nodes.some(
                (node)=>node.type===NodeType.MANUAL_TRIGGER
            )
            if(hasManualTrigger){
                toast.error("You can only have one manual trigger node in a workflow.")
                return;
            }
        }
        setNodes((nodes)=>{
            const hasinitialTrigger=nodes.some(
                (node)=>node.type===NodeType.INITIAL,
            )
            const centerX=window.innerWidth/2;
            const centerY=window.innerHeight/2;

            const flowPosition=screenToFlowPosition({
                x:centerX+(Math.random()-0.5)*200,
                y:centerY+(Math.random()-0.5)*200,
            })
            const newNode={
                id:createId(),
                data:{},
                position:flowPosition,
                type:selection.type,
            }
            if(hasinitialTrigger){
                return [newNode]
            }
            return [...nodes,newNode]
        })
        onOpenChange(false);
    },[setNodes,getNodes,onOpenChange,screenToFlowPosition])
    return(
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What triggers this worflow?

                    </SheetTitle>
                    <SheetDescription>
                        A triffer is a step that starts your workflow.
                    </SheetDescription>
                    </SheetHeader>
                    <div>
                        {TriggerNodes.map((nodeType)=>{
                            const Icon=nodeType.icon;
                            return(
                                    <div key={nodeType.type} className="w-full justify-start h-auto py-5 px-4
                                    rounded-none cursor-pointer border-l02 border-transparent hover:border-l-primary"
                                    onClick={()=>handleNodeSelect(nodeType)}
                                    >
                                        <div className="flex items-center gap-6 w-full overflow-hidden">
                                            {typeof Icon==="string" ? (
                                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                            ):(
                                                <Icon className="size-5"/>
                                            )}
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-medium text-sm">{nodeType.label}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {nodeType.description}
                                                </span>

                                            </div>
                                        </div>
                                    </div>
                            )
                        })}
                    </div>
                    <Separator className="my-4"/>
                     <div>
                        {excutionNodes.map((nodeType)=>{
                            const Icon=nodeType.icon;
                            return(
                                    <div key={nodeType.type} className="w-full justify-start h-auto py-5 px-4
                                    rounded-none cursor-pointer border-l02 border-transparent hover:border-l-primary"
                                    onClick={()=>handleNodeSelect(nodeType)}
                                    >
                                        <div className="flex items-center gap-6 w-full overflow-hidden">
                                            {typeof Icon==="string" ? (
                                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                            ):(
                                                <Icon className="size-5"/>
                                            )}
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-medium text-sm">{nodeType.label}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {nodeType.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                            )
                        })}
                    </div>
            </SheetContent>
            </Sheet>
    )
}