import { LeetCodeState, ConversationEntry } from "./state";

/**
 * Helper functions for the chat-based tutoring system
 */

/**
 * Add user code attempt to the state
 */
export function addUserCodeAttempt(
  state: LeetCodeState,
  code: string,
): Partial<LeetCodeState> {
  const userMessage: ConversationEntry = {
    role: "user",
    message: `Here's my code attempt:\n\`\`\`\n${code}\n\`\`\``,
    timestamp: Date.now(),
  };

  return {
    studyMode: {
      ...state.studyMode,
      userCodeAttempts: [...state.studyMode.userCodeAttempts, code],
      conversationHistory: [
        ...state.studyMode.conversationHistory,
        userMessage,
      ],
      awaitingUserInput: false,
    },
  };
}

/**
 * Add user question to the state
 */
export function addUserQuestion(
  state: LeetCodeState,
  question: string,
): Partial<LeetCodeState> {
  const userMessage: ConversationEntry = {
    role: "user",
    message: question,
    timestamp: Date.now(),
  };

  return {
    studyMode: {
      ...state.studyMode,
      userQuestions: [...state.studyMode.userQuestions, question],
      conversationHistory: [
        ...state.studyMode.conversationHistory,
        userMessage,
      ],
      awaitingUserInput: false,
    },
  };
}

/**
 * Add general user message to the conversation
 */
export function addUserMessage(
  state: LeetCodeState,
  message: string,
): Partial<LeetCodeState> {
  const userMessage: ConversationEntry = {
    role: "user",
    message: message,
    timestamp: Date.now(),
  };

  return {
    studyMode: {
      ...state.studyMode,
      conversationHistory: [
        ...state.studyMode.conversationHistory,
        userMessage,
      ],
      awaitingUserInput: false,
    },
  };
}

/**
 * Check if the conversation indicates the user might be stuck
 */
export function isUserStuck(state: LeetCodeState): boolean {
  const recentMessages = state.studyMode.conversationHistory.slice(-6);
  const userMessages = recentMessages.filter((msg) => msg.role === "user");

  // If user has asked multiple questions recently without code attempts
  if (
    userMessages.length >= 3 &&
    state.studyMode.userCodeAttempts.length === 0
  ) {
    return true;
  }

  // If user has made multiple failed attempts
  if (
    state.studyMode.userCodeAttempts.length >= 3 &&
    !state.studyMode.isSolutionComplete
  ) {
    return true;
  }

  return false;
}

/**
 * Get conversation summary for context
 */
export function getConversationSummary(state: LeetCodeState): string {
  const history = state.studyMode.conversationHistory;
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
  state: LeetCodeState,
  type: "code" | "question" | "message",
  content: string,
): Partial<LeetCodeState> {
  switch (type) {
    case "code":
      return addUserCodeAttempt(state, content);
    case "question":
      return addUserQuestion(state, content);
    case "message":
      return addUserMessage(state, content);
    default:
      return {};
  }
}
