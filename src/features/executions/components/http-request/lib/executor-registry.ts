import { NodeExecutor } from "@/features/executions/types";
import { NodeType } from "@prisma/client";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import {openaiExecutor} from "@/features/executions/components/Openai/executor";
import { geminiExecutor } from "@/features/executions/components/gemini/executor";
import { groqExecutor } from "@/features/executions/components/groq/executor";
import { discordExecutor } from "@/features/executions/components/discord/executor";
export const executorRegistry:Record<NodeType,NodeExecutor>={
    [NodeType.MANUAL_TRIGGER]:manualTriggerExecutor,
    [NodeType.INITIAL]:manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]:httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]:googleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]:stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.DEEPSEEK]: geminiExecutor,
    [NodeType.OPENAI]: openaiExecutor,
    [NodeType.GROQ]: groqExecutor,
    [NodeType.DISCORD]: discordExecutor,
    [NodeType.SLACK]: httpRequestExecutor,
};
export const getExecutor=(type:NodeType):NodeExecutor=>{
    const executor=executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}