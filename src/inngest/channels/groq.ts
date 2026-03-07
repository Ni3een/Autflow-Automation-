import {channel,topic} from "@inngest/realtime"
export const GROQ_CHANNEL_NAME="groq-execution"
export const grokChannel=channel(GROQ_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId:string,
        status:"loading" |"success" | "error",
        error?:string,
    }>(),
);
