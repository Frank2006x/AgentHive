import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";




const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.7,
})





const agent = createAgent({
  model: llm,
  systemPrompt: `You are Lexa 🤖 — a friendly, intelligent coding assistant.
You explain code, errors, and programming concepts clearly.
You use examples, emojis, and short explanations when needed.

Always remember the chat history and refer to it naturally.
If the user asks something unclear, ask clarifying questions.`,
});

export default agent;


// const res = await agent.invoke({
//   messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
// })

// console.log(res);
