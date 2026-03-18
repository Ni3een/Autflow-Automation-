import type {NodeExecutor} from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import {generateText} from "ai"
import prisma from "@/lib/db";
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {geminiChannel} from "@/inngest/channels/gemini";
Handlebars.registerHelper("json",(context)=>{
    const jsonString=JSON.stringify(context,null,2);
    const safeString=new Handlebars.SafeString(jsonString);
    return safeString;
});

type GeminiData={
    variableName?:string,
    credentialId?:string,
    systemPrompt?:string,
    userPrompt?:string;
}
export const geminiExecutor:NodeExecutor<GeminiData>=async({
    data,
    nodeId,context,step,userId,
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
            geminiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Variable name is required")
    }
    if(!data.userPrompt){
        await publish(
            geminiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("User prompt is required")
    }
    if(!data.credentialId){
        await publish(
            geminiChannel().status({
                nodeId,
                status:"error",
            }),

        )
        throw new NonRetriableError("Credential ID is required")
    }
    const systemPrompt=data.systemPrompt?Handlebars.compile(data.systemPrompt)(context)
    :"You are a helpful assistant."

    const userPrompt=Handlebars.compile(data.userPrompt)(context);

    // fetch credentials from context
    const credential=(await step.run("get-credential",()=>{
        return prisma.credential.findUnique({
            where:{
                id:data.credentialId,
                userId, 
            },
            select: {
                value: true,
            },
        })
    })) as { value: string } | null
    if(!credential?.value){
        throw new NonRetriableError("Credential not found")
    }
    const google=createGoogleGenerativeAI({
        apiKey:credential.value,
    });
    try{
        const result=await step.ai.wrap("gemini-generate-text",
        generateText,
        {
            model:google("gemini-2.0-flash"),
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
        geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError(`Gemini generation failed: ${err instanceof Error ? err.message : String(err)}`)
    }
}