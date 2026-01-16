import { AIMessage, createAgent, HumanMessage, SystemMessage, ToolMessage } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import leetcodeTool from "../tools/leetcode.js";
import { run } from "node:test";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.7,
});

const boultAgent = createAgent({
  model: llm,
  tools: [leetcodeTool],
  systemPrompt:
    "You are Boult 🤖 — a knowledgeable coding assistant. you have a tool to access the leetcode question and explain the question",
});


export async function runBoultAgent(input: string) {
  console.log(`\n👤 User: ${input}\n`);

  for await (const chunk of await boultAgent.stream(
    { messages: [{ role: "user", content: input }] },
    { streamMode: "updates" }
  )) {
    const [, content] = Object.entries(chunk)[0];
    if (!content?.messages) continue;

    for (const msg of content?.messages) {

      // 1️⃣ Human message (usually only once)
      if (msg instanceof HumanMessage) {
        // already printed above, skip
        continue;
      }

      // 2️⃣ Tool call announcement
      if (
        msg instanceof AIMessage &&
        msg.tool_calls?.length
      ) {
        for (const tool of msg.tool_calls) {
          console.log(
            `🤖 Boult: Calling tool → ${tool.name}(${JSON.stringify(tool.args)})`
          );
        }
        continue;
      }

      // 3️⃣ Tool response
      if (msg instanceof ToolMessage) {
        console.log(
          `📦 Tool(${msg.name}): Problem loaded successfully\n`
        );
        continue;
      }
      
      // 4️⃣ Final AI answer (this is the gold)
      if (
        msg instanceof AIMessage &&
        typeof msg.content === "string"
      ) {
        console.log("🤖 Boult:\n");
        console.log(msg.content);
      }
    }
  }

  console.log("\n✅ Agent run completed\n");
}
runBoultAgent("Explain the leetcode problem 'Maximum Square Area by Removing Fences From a Field'");

