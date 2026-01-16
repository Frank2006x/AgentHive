import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { PromptTemplate } from "@langchain/core/prompts";
import { CodeExecutionTool } from "@google/generative-ai";

const codeExecutionTool: CodeExecutionTool = {
  codeExecution: {}, // Simply pass an empty object to enable it.
};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
}).bindTools([codeExecutionTool]);

const checkpointer = new MemorySaver();

const lexaPrompt = PromptTemplate.fromTemplate(`
You are Lexa 🤖 — a friendly, intelligent coding assistant.
You explain code, errors, and programming concepts clearly.
You use examples, emojis, and short explanations when needed.

Always remember the chat history and refer to it naturally.
If the user asks something unclear, ask clarifying questions.

History:
{history}

User: {input}
Lexa:
`);



const agent = createAgent({
  model: llm,
  checkpointer: checkpointer,
  systemPrompt: `You are Lexa 🤖 — a friendly, intelligent coding assistant.
You explain code, errors, and programming concepts clearly.
You use examples, emojis, and short explanations when needed.

Always remember the chat history and refer to it naturally.
If the user asks something unclear, ask clarifying questions.`,
});

const res = await agent.invoke({
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
})

console.log(res);
