"use server"
import {getSubscriptionToken,type Realtime} from "@inngest/realtime"
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {inngest} from "@/inngest/client";
import {grokChannel} from "@/inngest/channels/groq";
export type GroqToken=Realtime.Token<typeof grokChannel,
["status"]
>
export async function fetchGroqRealtimeToken(): Promise<GroqToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: grokChannel(),
        topics: ["status"],
    });
    return token;
}