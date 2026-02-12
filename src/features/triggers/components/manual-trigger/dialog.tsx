"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}
export const ManualTriggerDialog=({
    open,   onOpenChange,
}:Props)=>{
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        This trigger allows you to execute the workflow manually by clicking a button. It's perfect for testing and getting started quickly.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                <p className="text-sm text-muted-foreground">Manual Trigger</p>
                </div>
                
            </DialogContent>
        </Dialog>
    )
}

