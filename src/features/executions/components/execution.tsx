"use client"
import {ExecutionStatus} from "@prisma/client";
import {CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {formatDistanceToNow} from "date-fns";
import {Button} from "@/components/ui/button";

import {
    Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle
} from "@/components/ui/card";
import { EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination } from "@/components/entity-components";
import { useSuspenseExecution } from "../hooks/use-executions";
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger
} from "@/components/ui/collapsible";
import { executeWorkflow } from "@/inngest/function";

const getStatusIcon=(status:ExecutionStatus)=>{
    switch(status){
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-500"/>
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-500"/>
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-500 animate-spin"/>
        default:
            return <ClockIcon className="size-5 text-muted-foreground"/>
    }
}
const formatStatus=(status:ExecutionStatus)=>{
    return status.charAt(0)+status.slice(1).toLowerCase();
}

export const ExecutionView=({executionId}: {executionId:string    })=>{
    
    const {data:execution}=useSuspenseExecution(executionId);
    const [showStackTrace,setShowStackTrace]=useState(false);

    const duration = execution.completedAt
        ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
        : null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                        <CardTitle>{formatStatus(execution.status)}</CardTitle>
                        <CardDescription>
                            Execution for {execution.workflow.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-sm font-medium text-muted-foreground">

                    </p>
                    <Link prefetch href={`/workflows/${execution.workflowID}`} className="text-blue-500 hover:underline">
                        {execution.workflow.name}
                    </Link>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="text-sm">{formatStatus(execution.status)}</p>
                        <p className="text-sm">{formatDistanceToNow(execution.startedAt,{addSuffix: true})}</p>
                        {execution.completedAt ? (
                            <div>
                             <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <p className="text-sm">{formatDistanceToNow(execution.completedAt,{addSuffix: true})}</p>
                            </div>
                        ):null}
                    </div>
                    {duration!==null ? (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <p className="text-sm">{duration}s</p>
                        </div>
                    ):null}
                    
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Event ID</p>
                            <p className="text-sm">{execution.inngestEventId}</p>
                        </div>
                        </div>
                        {execution.error ? (
                            <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
                                <div>
                                    <p className="text-sm font-medium mb-2 text-red-800">Error</p>
                                    <p className="text-sm text-red-700">{execution.error}</p>
                                </div>

                                {execution.errorStack &&(
                                    <Collapsible
                                    open={showStackTrace}
                                    onOpenChange={setShowStackTrace}

                                    >
                                       <CollapsibleTrigger asChild>
                                       <Button
                                       variant="ghost"
                                       size="sm"
                                       className="text-red-900 hover:bg-red-100"
                                       >
                                        {showStackTrace ? "Hide Stack Trace":"Show Stack Trace"}

                                        </Button>
                                       </CollapsibleTrigger>
                                        <CollapsibleContent>
                                        <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                                            {execution.errorStack}
                                        </pre>
                                        </CollapsibleContent>
                                    </Collapsible>
                                )}
                            </div>
                        ) : null}
                        {execution.output && (
                            <div className="mt-6 p-4 bg-green-50 rounded-md">
                                <p className="text-sm font-medium mb-2">Output</p>
                                <p className="text-sm font-mono overflow-auto">{JSON.stringify(execution.output,null,2)}</p>
                            </div>
                        )}
                        
            </CardContent>
        </Card>
    )
}
