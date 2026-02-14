import {Button} from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";
export const ExecuteWorkflowButton=({workflow}:{workflow:any})=>{
    const executeWorkflow=useExecuteWorkflow();
    const handleExecute=()=>{

        executeWorkflow.mutate({id:workflow.id});
    }
    return (
        <Button size="lg" onClick={handleExecute} disabled={executeWorkflow.isPending}>
            <FlaskConicalIcon className="size-4"/>
            Execute Workflow
        </Button>
    )
}