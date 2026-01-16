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
  systemPrompt: `You are Lexa 🤖 — a friendly, intelligent coding assistant. your
   responsiablity is to only debug the user's code not to optimize the time and space complixty of solution .check of syntax errors and logical errors
    in the code and provide the corrected code with explanation. dont change the user's code more than necessary .`,
});
export default agent;

