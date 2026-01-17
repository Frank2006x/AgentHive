import { ChatGroq } from "@langchain/groq";
import { AIMessage } from "@langchain/core/messages";
import { AgentState } from "./state";
import { createAgent, providerStrategy } from "langchain";
import * as z from "zod";
import { Command } from "@langchain/langgraph";
// Initialize Groq LLM
const groqLLM = new ChatGroq({
  model: "groq/compound",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.1,
});

const outputSchema = z.object({
  msg2Agent: z.string(),
  explaination: z.string(),
  correctedCode: z.string(),
});

const agent = createAgent({
  model: groqLLM,
  systemPrompt: `You are the Debugger agent in a multi-agent coding assistant system.
    Your role is to help users identify and fix bugs in their code.
    Analyze the user's code and problem description to provide clear debugging advice and solutions.
    If the code has no bugs, inform the user that their code is correct and does not require debugging.`,
  responseFormat: providerStrategy(outputSchema),
});

const runDebuggerAgent = async (state: AgentState) => {
  const response = await agent.invoke({
    messages: [
      new AIMessage(`User Code: ${state.userCode}
        Problem Description: ${state.problem}
        User Question: ${state.userQuestion[state.userQuestion.length - 1]}`),
    ],
  });
  state.flow.push("debugger");
  state.messages.push(response.structuredResponse.msg2Agent);
  state.AICode=response.structuredResponse.correctedCode;

  return new Command({
    goto: "supervisor",
    update: {
      flow: state.flow,
      messages: state.messages,
      AICode: state.AICode,
      userQuestion: [
        ...state.userQuestion,
        response.structuredResponse.msg2Agent,
      ],
    },
  });
};
