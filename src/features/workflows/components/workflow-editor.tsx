"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from "next/link";

interface WorkflowEditorProps {
    workflowId: string;
}

export const WorkflowEditor = ({ workflowId }: WorkflowEditorProps) => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/workflows">
                            <ArrowLeftIcon className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold">Workflow Editor</h1>
                        <p className="text-sm text-muted-foreground">
                            Editing workflow: {workflowId}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <SaveIcon className="size-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 bg-muted/30 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">Workflow Canvas</p>
                    <p className="text-sm">Drag and drop nodes to build your workflow</p>
                </div>
            </div>
        </div>
    );
};
