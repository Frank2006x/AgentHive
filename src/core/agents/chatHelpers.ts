import { StudyStateType, ConversationEntry } from "./state";

/**
 * Helper functions for the chat-based tutoring system
 */

/**
 * Add user question to the state
 */
export function addUserQuestion(
  state: StudyStateType,
  question: string,
): Partial<StudyStateType> {
  const userMessage: ConversationEntry = {
    role: "user",
    message: question,
    timestamp: Date.now(),
  };

  return {
    userQuestions: [question],
    conversationHistory: [userMessage],
    awaitingUserInput: false,
  };
}

/**
 * Add general user message to the conversation
 */
export function addUserMessage(
  state: StudyStateType,
  message: string,
): Partial<StudyStateType> {
  const userMessage: ConversationEntry = {
    role: "user",
    message: message,
    timestamp: Date.now(),
  };

  return {
    conversationHistory: [userMessage],
    awaitingUserInput: false,
  };
}

/**
 * Check if the conversation indicates the user might be stuck
 */
export function isUserStuck(state: StudyStateType): boolean {
  const recentMessages = state.conversationHistory.slice(-6);
  const userMessages = recentMessages.filter((msg) => msg.role === "user");

  // If user has asked multiple questions recently
  if (userMessages.length >= 3 && !state.isSolutionComplete) {
    return true;
  }

  return false;
}

/**
 * Get conversation summary for context
 */
export function getConversationSummary(state: StudyStateType): string {
  const history = state.conversationHistory;
  if (history.length === 0) return "No conversation yet.";

  const recent = history
    .slice(-5)
    .map((entry) => `${entry.role}: ${entry.message.slice(0, 100)}...`)
    .join("\n");

  return `Recent conversation (${history.length} total messages):\n${recent}`;
}

/**
 * Example function to simulate user interactions (for testing)
 */
export function simulateUserInteraction(
  state: StudyStateType,
  type: "question" | "message",
  content: string,
): Partial<StudyStateType> {
  switch (type) {
    case "question":
      return addUserQuestion(state, content);
    case "message":
      return addUserMessage(state, content);
    default:
      return {};
  }
}
