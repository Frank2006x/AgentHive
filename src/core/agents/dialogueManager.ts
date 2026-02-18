import { Command, END } from "@langchain/langgraph";
import { StudyStateType } from "./state";

const runDialogueManager = async (state: StudyStateType) => {
  console.log("DialogueManager: Managing conversation flow...");

  // Check if session is complete
  if (state.isSolutionComplete) {
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
        conversationHistory: [congratsMessage],
        messages: ["Session completed successfully!"],
        flow: ["dialogueManager"],
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
  const conversationLength = state.conversationHistory.length;
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
        conversationHistory: [wrapUpMessage],
        awaitingUserInput: true,
        messages: ["Offered to wrap up long conversation"],
        flow: ["dialogueManager"],
      },
    });
  }

  // Continue the conversation - in practice, this would wait for user input
  // For the demo, we'll end here and let the UI handle the next interaction
  return new Command({
    goto: END,
    update: {
      awaitingUserInput: true,
      messages: ["Ready for user input (code, questions, or discussion)"],
      flow: ["dialogueManager"],
    },
  });
};

export default runDialogueManager;
