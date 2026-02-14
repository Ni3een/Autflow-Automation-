import { Inngest, EventSchemas } from "inngest";

type Events = {
  "test/hello.world": {
    data: {
      email: string;
      userId: string;
    };
  };
  "execute/ai": {
    data: {
      prompt?: string;
    };
  };
  "workflows/execute.workflow": {
    data: {
      workflowId: string;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "autoflow",
  schemas: new EventSchemas().fromRecord<Events>(),
});
