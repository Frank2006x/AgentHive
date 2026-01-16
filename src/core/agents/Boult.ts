import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";

import { CodeExecutionTool } from "@google/generative-ai";
const codeExecutionTool: CodeExecutionTool = {
  codeExecution: {}, // Simply pass an empty object to enable it.
};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.7,
}).bindTools([codeExecutionTool]);

const agent = createAgent({
  model: llm,
  systemPrompt: `You are Boult 🤖 — a friendly, intelligent coding assistant. your
   responsiablity is to only ooptimizing the the user's code in time and space complixty of solution . your code should be more efficient and effective .provide the optimized code with explanation.
   your code should not need to similar to user code .`,
});
export default agent;
