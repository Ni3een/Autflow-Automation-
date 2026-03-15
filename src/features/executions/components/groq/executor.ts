import type {NodeExecutor} from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import {generateText} from "ai"
import {createGroq} from "@ai-sdk/groq"
import { grokChannel } from "@/inngest/channels/groq";
import prisma from "@/lib/db";
Handlebars.registerHelper("json",(context)=>{
    const jsonString=JSON.stringify(context,null,2);
    const safeString=new Handlebars.SafeString(jsonString);
    return safeString;
});
type GroqData={
    variableName?:string,
    credentialId?:string,
    model?:string,
    systemPrompt?:string,
    userPrompt?:string;
}
export const groqExecutor:NodeExecutor<GroqData>=async({
    data,
    nodeId,context,step,
    publish,
})=>{
    await publish(
        grokChannel().status({
            nodeId,
            status:"loading",

        }),
    )
    if(!data.variableName){
        await publish(
            grokChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Variable name is required")
    }
    if(!data.userPrompt){
        await publish(
            grokChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("User prompt is required")
    }
    if(!data.credentialId){
        await publish(
            grokChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Credential ID is required")
    }
    const systemPrompt=data.systemPrompt?Handlebars.compile(data.systemPrompt)(context)
    :"You are a helpful assistant."

    const userPrompt=Handlebars.compile(data.userPrompt)(context);

    const credential=(await step.run("get-credential",()=>{
        return prisma.credential.findUnique({
            where:{ id:data.credentialId },
            select:{ value:true },
        })
    })) as { value:string } | null
    if(!credential?.value){
        throw new NonRetriableError("Credential not found")
    }
    const groq=createGroq({
        apiKey:credential.value,
    });
    try{
        const result=await step.run("groq-generate-text",async()=>{
            const res=await generateText({
                model:groq(data.model || "llama-3.3-70b-versatile"),
                system:systemPrompt,
                prompt:userPrompt,
            });
            return {text:res.text};
        });
    const text=result.text || "";
    await publish(
        grokChannel().status({
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
            grokChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError(`Groq generation failed: ${err instanceof Error ? err.message : String(err)}`)
    }
}