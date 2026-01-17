import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, createAgent, providerStrategy } from "langchain";
import loadProblemTool from "../tools/leetcode";
import { Command } from "@langchain/langgraph";
import {AgentState} from "./state";
import { z } from "zod";
// Initialize Gemini LLM for problem analysis
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

const outputSchema = z.object({
  problemStatement: z.string(),
  constraints: z.string(),
  examples: z.string(),
}) ;

const agent = createAgent({
  model: llm,
  tools: [loadProblemTool],
  systemPrompt: `You are a problem loader agent that fetches and summarizes coding problems from LeetCode.
   Given a problem ID, use the loadProblem tool to retrieve the problem details.
   Summarize the problem statement, constraints, and examples clearly for the user.`,
   responseFormat: providerStrategy(outputSchema),
});

const runProblemLoaderNode = async (state:AgentState) => {
  const response = await agent.invoke({
    messages: [new AIMessage(`Load problem from leedcode with this name: ${state.userQuestion[0]}`)],
  });


  return new Command({
    goto: "supervisor",
    update: { problem: response.structuredResponse,flow:[...state.flow, "problemLoader"]},
  });
};

export default runProblemLoaderNode;