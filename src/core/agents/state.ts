import { StateSchema } from "@langchain/langgraph";

import * as z from "zod";
export type AgentState = {
  problem: string;
  userQuestion: string[]; // [user question, supervisor command for subagents]
  userCode: string;
  AICode:string;
  messages: string[]; // Array of BaseMessage objects
  flow: string[];
};

export const createInitialState = (): AgentState => ({
  problem: "",
  userQuestion: [], // [user question, supervisor command]
  userCode: "",
  AICode: "",
  messages: [],
  flow: [],
});


export const agentStateSchema = new StateSchema({
    problem:z.string(),
    userQuestion:z.array(z.string()),
    userCode:z.string(),
    AICode:z.string(),
    messages:z.array(z.string()),
    flow:z.array(z.string()),
})