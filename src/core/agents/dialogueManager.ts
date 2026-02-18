import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const runDialogueManager = async (state: LeetCodeState) => {
  console.log("DialogueManager: Managing conversation flow...");

  // Check if session is complete
  if (state.studyMode.isSolutionComplete) {
    console.log("DialogueManager: Session complete, congratulating user");

    const congratsMessage = {
      role: "assistant" as const,
      message:
        "🎉 Congratulations! You've successfully solved the problem! Great work on thinking through it step by step.",
      timestamp: Date.now(),
    };

    return new Command({
      goto: END,
      update: {
        studyMode: {
          ...state.studyMode,
          conversationHistory: [
            ...state.studyMode.conversationHistory,
            congratsMessage,
          ],
        },
        messages: [...state.messages, "Session completed successfully!"],
        flow: [...state.flow, "dialogueManager"],
      },
    });
  }

  // In a real implementation, this would wait for user input
  // For now, we'll simulate awaiting user input by ending here
  // The UI should handle user input and restart the flow

  console.log(
    "DialogueManager: Awaiting user input (code, questions, or responses)",
  );

  // Check if we have too many conversation turns without progress
  const conversationLength = state.studyMode.conversationHistory.length;
  if (conversationLength > 20) {
    console.log("DialogueManager: Long conversation, offering to wrap up");

    const wrapUpMessage = {
      role: "assistant" as const,
      message:
        "We've been working on this for a while! Would you like to continue exploring this problem, or would you like me to help you wrap up what we've learned so far?",
      timestamp: Date.now(),
    };

    return new Command({
      goto: END,
      update: {
        studyMode: {
          ...state.studyMode,
          conversationHistory: [
            ...state.studyMode.conversationHistory,
            wrapUpMessage,
          ],
          awaitingUserInput: true,
        },
        messages: [...state.messages, "Offered to wrap up long conversation"],
        flow: [...state.flow, "dialogueManager"],
      },
    });
  }

  // Continue the conversation - in practice, this would wait for user input
  // For the demo, we'll end here and let the UI handle the next interaction
  return new Command({
    goto: END,
    update: {
      studyMode: {
        ...state.studyMode,
        awaitingUserInput: true,
      },
      messages: [
        ...state.messages,
        "Ready for user input (code, questions, or discussion)",
      ],
      flow: [...state.flow, "dialogueManager"],
    },
  });
};

export default runDialogueManager;
