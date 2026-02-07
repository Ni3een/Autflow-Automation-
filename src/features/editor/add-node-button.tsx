"use client"  

import {PlusIcon} from "lucide-react"
import {memo} from "react"
import {Button} from "@/components/ui/button"
import { NodeSelector } from "@/components/node-selector"
import {useState} from "react"

export const AddNodeButton=memo(()=>{
    const [selectorProps,setSelectorProps]=useState(false)
    return(
        <NodeSelector open={selectorProps} onOpenChange={setSelectorProps}>
        <Button
        onClick={()=>{}}
        size="icon"
        variant="outline"
        className="bg-background"
        
        >
            <PlusIcon/>
        </Button>
        </NodeSelector>
    )
})
AddNodeButton.displayName="AddNodeButton"