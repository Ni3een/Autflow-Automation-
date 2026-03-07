import type {NodeExecutor} from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import {generateText} from "ai"
import { openaiChannel } from "@/inngest/channels/openai";
import {createOpenAI, openai} from "@ai-sdk/openai"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {geminiChannel} from "@/inngest/channels/gemini";
Handlebars.registerHelper("json",(context)=>{
    const jsonString=JSON.stringify(context,null,2);
    const safeString=new Handlebars.SafeString(jsonString);
    return safeString;
});

type OpenaiData={
    variableName?:string,
    model?:string,
    systemPrompt?:string,
    userPrompt?:string;
}
export const openaiExecutor:NodeExecutor<OpenaiData>=async({
    data,
    nodeId,context,step,
    publish,
})=>{
    await publish(
        geminiChannel().status({
            nodeId,
            status:"loading",

        }),
    )
    if(!data.variableName){
        await publish(
            openaiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Variable name is required")
    }
    if(!data.userPrompt){
        await publish(
            openaiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("User prompt is required")
    }
    const systemPrompt=data.systemPrompt?Handlebars.compile(data.systemPrompt)(context)
    :"You are a helpful assistant."

    const userPrompt=Handlebars.compile(data.userPrompt)(context);

    // fetch credentials from context
    const creditialValue=process.env.OPENAI_API_KEY
    const google=createOpenAI({
        apiKey:creditialValue,
    });
    try{
        const result=await step.ai.wrap("openai-generate-text",
        generateText,
        {
            model:openai("gpt-3.5-turbo"),
            system:systemPrompt,
            prompt:userPrompt,
            experimental_telemetry:{
                isEnabled:true,
                recordInputs:true,
                recordOutputs:true,
            }
        }
    )
    const text=result.text || "";
    await publish(
        openaiChannel().status({
            nodeId,
            status:"success",
        }),
    )
    return{
        ...context,[data.variableName]:{
            text,
        }
    }
    }catch(err){
        await publish(
            openaiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError(`OpenAI generation failed: ${err instanceof Error ? err.message : String(err)}`)
    }
}