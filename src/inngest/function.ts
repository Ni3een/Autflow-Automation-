import { inngest } from "@/inngest/client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";
const google = createGoogleGenerativeAI();

const deepseek = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "X-Title": "AutoFlow",
  },
});

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ step }) => {
    await step.sleep("pretend", "5s");
    console.log("There is something happening here...");
    const gemini = await step.ai.wrap("gemini-text", async () =>
      generateText({
        model: google("gemini-2.5-flash"),
        prompt: "what is 787687687 * 485857876?",
         experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
  },
      })
    );

    // const deepseekResult = await step.ai.wrap("deepseek-text", async () =>
    //   generateText({
    //     model: deepseek("deepseek-reasoner"),
    //     prompt:
    //       "Write a detailed blog post about the benefits of using AI in everyday life.",
  //     
    //   })
    // );

    return {
      gemini: gemini.text,
      //deepseek: deepseekResult.text,
    };
  }
);
