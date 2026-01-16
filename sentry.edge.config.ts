// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d12595e9833f5b71d5c6395334171415@o4510624444514304.ingest.us.sentry.io/4510720822804480",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
   integrations: [
      // Add the Vercel AI SDK integration to sentry.server.config.ts
      Sentry.vercelAIIntegration({
        recordInputs: true,
        recordOutputs: true,
      }),
      Sentry.consoleLoggingIntegration({levels:[
        "log","warn","error"
      ]})
    ],
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
