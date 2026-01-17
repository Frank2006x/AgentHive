import { StateSchema } from "@langchain/langgraph";
import * as z from "zod";
const outputSchema = z.object({
  problemStatement: z.string(),
  constraints: z.string(),
  examples: z.string(),
});

export type AgentState = {
  problem: z.infer<typeof outputSchema>;
  userQuestion: string[]; // [user question, supervisor command for subagents]
  userCode: string;
  AICode: string;
  messages: string[]; // Array of BaseMessage objects
  flow: string[];
};

export const createInitialState = (): AgentState => ({
  problem: {
    problemStatement: "",
    constraints: "",
    examples: "",
  },
  userQuestion: [], // [user question, supervisor command]
  userCode: "",
  AICode: "",
  messages: [],
  flow: [],
});

export const agentStateSchema = new StateSchema({
  problem: outputSchema,
  userQuestion: z.array(z.string()),
  userCode: z.string(),
  AICode: z.string(),
  messages: z.array(z.string()),
  flow: z.array(z.string()),
});
