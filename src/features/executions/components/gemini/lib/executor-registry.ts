import { NodeExecutor } from "@/features/executions/types";
import { NodeType } from "@prisma/client";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
export const executorRegistry:Record<NodeType,NodeExecutor>={
    [NodeType.MANUAL_TRIGGER]:manualTriggerExecutor,
    [NodeType.INITIAL]:manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]:httpRequestExecutor, //todo fix that
    [NodeType.GOOGLE_FORM_TRIGGER]:googleFormTriggerExecutor, //todo fix that
    [NodeType.STRIPE_TRIGGER]:stripeTriggerExecutor, //todo fix that
};
export const getExecutor=(type:NodeType):NodeExecutor=>{
    const executor=executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}