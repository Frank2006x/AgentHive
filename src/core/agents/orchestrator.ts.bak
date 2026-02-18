import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

export const orchestratorNode = async (state: LeetCodeState) => {
  console.log("Orchestrator: Processing request...");
  
  // Check if problem is already loaded
  if (!state.problemName) {
    return new Command({
      goto: END,
      update: {
        messages: [...state.messages, "Error: No problem name provided"],
        flow: [...state.flow, "orchestrator"],
      },
    });
  }

  // Route based on mode
  if (state.mode === "study") {
    console.log("Orchestrator: Routing to Study Mode");
    return new Command({
      goto: "problemFetcher",
      update: {
        messages: [...state.messages, "Starting Study Mode..."],
        flow: [...state.flow, "orchestrator"],
      },
    });
  } else {
    console.log("Orchestrator: Routing to Power Mode");
    return new Command({
      goto: "problemFetcher",
      update: {
        messages: [...state.messages, "Starting Power Mode..."],
        flow: [...state.flow, "orchestrator"],
      },
    });
  }
};
