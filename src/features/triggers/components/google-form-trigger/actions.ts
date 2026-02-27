"use server"
import {getSubscriptionToken,type Realtime} from "@inngest/realtime"
import {httpRequestChannel} from "@/inngest/channels/http-request";
import {inngest} from "@/inngest/client";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
export type GoogleFormTriggerChannel=Realtime.Token<typeof googleFormTriggerChannel,
["status"]
>
export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerChannel> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel(),
        topics: ["status"],
    });
    return token;
}
    

