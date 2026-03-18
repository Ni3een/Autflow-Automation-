import type {NodeExecutor} from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import {decode} from "html-entities";
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
Handlebars.registerHelper("json",(context)=>{
    const jsonString=JSON.stringify(context,null,2);
    const safeString=new Handlebars.SafeString(jsonString);
    return safeString;
});

type slackData={
    variableName?:string,
    webhookUrl?:string,
    content?:string,
}
export const slackExecutor:NodeExecutor<slackData>=async({
    data,
    nodeId,context,step,
    publish,
})=>{
    await publish(
        slackChannel().status({
            nodeId,
            status:"loading",

        }),
    )
    if(!data.variableName){
        await publish(
            slackChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Variable name is required")
    }
    if(!data.webhookUrl){
        await publish(
            slackChannel().status({
                nodeId,
                status:"error",
            }),
        )
        throw new NonRetriableError("Webhook URL is required")
    }
    if(!data.content){
        await publish(
            slackChannel().status({
                nodeId,
                status:"error",
            }),

        )
        throw new NonRetriableError("Message content is required")
    }
    const variableName = data.variableName;
    const webhookUrl = Handlebars.compile(data.webhookUrl)(context);
    if (!/^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/.+/.test(webhookUrl)) {
        throw new NonRetriableError("Invalid Discord webhook URL format")
    }

    const compiledContent = decode(Handlebars.compile(data.content)(context));
    const content = compiledContent.trim().slice(0, 2000);
    if (!content) {
        throw new NonRetriableError("Discord content is empty after template resolution")
    }

    const username = data
        ? decode(Handlebars.compile(data)(context)).trim().slice(0, 80)
        : undefined;

    try {
        await step.run("discord-webhook-request", async () => {
            const payload: { content: string; username?: string } = { content };

            if (username) {
                payload.username = username;
            }

            await ky.post(webhookUrl, {
                json: payload,
            });
        });

        await publish(
            slackChannel().status({
                nodeId,
                status:"success",
            }),
        );

        return {
            ...context,
            [variableName]: {
                content,
            },
        };
    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status:"error",
            }),
        );

        const response = (error as { response?: Response })?.response;
        if (response) {
            let discordError = "Unknown Discord webhook error";
            try {
                const json = await response.clone().json() as {
                    message?: string;
                    code?: number;
                    errors?: unknown;
                };
                discordError = json.message ?? discordError;
                if (json.code) {
                    discordError = `${discordError} (code: ${json.code})`;
                }
            } catch {
                try {
                    const text = await response.clone().text();
                    if (text) {
                        discordError = text;
                    }
                } catch {
                    // Keep fallback message when response body cannot be parsed.
                }
            }

            throw new NonRetriableError(
                `Discord webhook failed: ${response.status} ${response.statusText} - ${discordError}`,
            );
        }

        throw new NonRetriableError(
            `Discord webhook failed: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}