"use client"

import {createId} from "@paralleldrive/cuid2"
import {useReactFlow} from   "@xyflow/react"
import {
    GlobeIcon,MousePointerIcon

} from "lucide-react"
import {useCallback} from "react"
import {toast} from "sonner"
import {NodeType} from "@prisma/client"
import {Separator} from "@/components/ui/separator"
import {
    Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription,
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
        description:"Runs the flow on clicking a button. Good for getting started quickly",
        icon:MousePointerIcon,
    },
    {
        type:NodeType.GOOGLE_FORM_TRIGGER,
        label:"Google Form",
        description:"Runs the flow when a Google Form is submitted",
        icon:"/logo/google-form.svg",
    },
    {
        type:NodeType.STRIPE_TRIGGER,
        label:"Stripe Event",
        description:"Runs the flow when a Stripe event is captured",
        icon:"/logo/stripe.svg",
    }
]

const executionNodes:NodeTypeOption[]=[
    {
        type:NodeType.HTTP_REQUEST,
        label:"HTTP Request",
        description:"Makes an HTTP request",
        icon:GlobeIcon,
    },
    {
        type:NodeType.GEMINI,
        label:"Gemini",
        description:"Uses Google Gemini to generate text",
        icon:"/logo/gemini-color.svg",
    },
    {
        type:NodeType.OPENAI,
        label:"OpenAI",
        description:"Uses OpenAI to generate text",
        icon:"/logo/openai.svg",
    },
    {
        type:NodeType.GROQ,
        label:"GROQ",
        description:"Uses GROQ to generate text",
        icon:"/logo/groq.svg",
    },
    {
        type:NodeType.DISCORD,
        label:"Discord",
        description:"Sends messages using Discord webhook",
        icon:"/logo/discord.svg",
    },
    {
        type:NodeType.SLACK,
        label:"Slack",
        description:"Sends messages using Slack webhook",
        icon:"/logo/slack.svg",
    }
]

interface NodeSelectorProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    children?:React.ReactNode;
}

const OptionRow = ({
    option,
    onSelect,
}: {
    option: NodeTypeOption;
    onSelect: (node: NodeTypeOption) => void;
}) => {
    const Icon = option.icon;

    return (
        <button
            type="button"
            className="w-full rounded-none border-l-2 border-transparent px-3 py-3 text-left transition-colors hover:border-l-primary hover:bg-accent/40"
            onClick={() => onSelect(option)}
        >
            <div className="flex w-full items-start gap-4 overflow-hidden">
                <div className="mt-0.5 shrink-0">
                    {typeof Icon === "string" ? (
                        <img src={Icon} alt={option.label} className="size-5 object-contain" />
                    ) : (
                        <Icon className="size-5" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium leading-5">{option.label}</p>
                    <p className="text-xs text-muted-foreground leading-4">{option.description}</p>
                </div>
            </div>
        </button>
    )
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
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    {TriggerNodes.map((nodeType)=>(
                        <OptionRow key={nodeType.type} option={nodeType} onSelect={handleNodeSelect} />
                    ))}
                </div>

                <Separator className="my-3"/>

                <div>
                    {executionNodes.map((nodeType)=>(
                        <OptionRow key={nodeType.type} option={nodeType} onSelect={handleNodeSelect} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}