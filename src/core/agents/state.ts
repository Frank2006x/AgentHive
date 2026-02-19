import { Annotation } from "@langchain/langgraph";

// Mode selection type
export type Mode = "study" | "power";

// Example type
export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

// Strategy type for Power Mode
export interface Strategy {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pros: string[];
  cons: string[];
}

// Conversation entry for Study Mode
export interface ConversationEntry {
  role: "user" | "assistant";
  message: string;
  timestamp: number;
}

// Common state interface (shared between both modes)
export interface CommonState {
  mode: Mode;
  problemName: string;
  problemStatement: string;
  examples: Example[];
  constraints: string[];
  problemCategory: string;
  difficulty: string;
  language: string;
  iterationCount: number;
  errorMessages: string[];
  messages: string[];
  flow: string[];
}

// Study Mode State (Chat-based tutoring)
export interface StudyState extends CommonState {
  mode: "study";
  conversationHistory: ConversationEntry[];
  userCode: string;
  userUnderstandingLevel: "beginner" | "intermediate" | "advanced";
  topicsCovered: string[];
  userQuestions: string[];
  isSolutionComplete: boolean;
  awaitingUserInput: boolean;
}

// Power Mode State (Autonomous code generation)
export interface PowerState extends CommonState {
  mode: "power";
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
  userCode: string;
  finalCode: string;
  testResults: {
    passed: boolean;
    feedback: string;
  };
  fullExplanation: string;
  complexityAnalysis: {
    time: string;
    space: string;
  };
}

// Array reducer that appends
const appendReducer = <T>() => ({
  value: (x: T[], y: T[]) => [...x, ...y],
  default: () => [],
});

// Study Mode State Schema
export const StudyStateSchema = Annotation.Root({
  // Mode
  mode: Annotation<"study">({
    value: (x, y) => y,
    default: () => "study" as const,
  }),

  // Common fields
  problemName: Annotation<string>(),
  problemStatement: Annotation<string>(),
  examples: Annotation<Example[]>(appendReducer<Example>()),
  constraints: Annotation<string[]>(appendReducer<string>()),
  problemCategory: Annotation<string>(),
  difficulty: Annotation<string>(),
  language: Annotation<string>(),

  // Study-specific fields
  conversationHistory:
    Annotation<ConversationEntry[]>(appendReducer<ConversationEntry>()),
  userCode: Annotation<string>(),
  userUnderstandingLevel: Annotation<
    "beginner" | "intermediate" | "advanced"
  >(),
  topicsCovered: Annotation<string[]>(appendReducer<string>()),
  userQuestions: Annotation<string[]>(appendReducer<string>()),
  isSolutionComplete: Annotation<boolean>(),
  awaitingUserInput: Annotation<boolean>(),

  // Common metadata
  iterationCount: Annotation<number>({
    value: (x, y) => y,
    default: () => 0,
  }),
  errorMessages: Annotation<string[]>(appendReducer<string>()),
  messages: Annotation<string[]>(appendReducer<string>()),
  flow: Annotation<string[]>(appendReducer<string>()),
});

// Power Mode State Schema
export const PowerStateSchema = Annotation.Root({
  // Mode
  mode: Annotation<"power">({
    value: (x, y) => y,
    default: () => "power" as const,
  }),

  // Common fields
  problemName: Annotation<string>(),
  problemStatement: Annotation<string>(),
  examples: Annotation<Example[]>(appendReducer<Example>()),
  constraints: Annotation<string[]>(appendReducer<string>()),
  problemCategory: Annotation<string>(),
  difficulty: Annotation<string>(),
  language: Annotation<string>(),

  // Power-specific fields
  strategies: Annotation<Strategy[]>(appendReducer<Strategy>()),
  selectedStrategy: Annotation<Strategy | null>({
    value: (x, y) => y,
    default: () => null,
  }),
  userCode: Annotation<string>(),
  finalCode: Annotation<string>(),
  testResults: Annotation<{ passed: boolean; feedback: string }>({
    value: (x, y) => ({ ...x, ...y }),
    default: () => ({ passed: false, feedback: "" }),
  }),
  fullExplanation: Annotation<string>(),
  complexityAnalysis: Annotation<{ time: string; space: string }>({
    value: (x, y) => ({ ...x, ...y }),
    default: () => ({ time: "", space: "" }),
  }),

  // Common metadata
  iterationCount: Annotation<number>({
    value: (x, y) => y,
    default: () => 0,
  }),
  errorMessages: Annotation<string[]>(appendReducer<string>()),
  messages: Annotation<string[]>(appendReducer<string>()),
  flow: Annotation<string[]>(appendReducer<string>()),
});

// Type exports for the schemas
export type StudyStateType = typeof StudyStateSchema.State;
export type PowerStateType = typeof PowerStateSchema.State;

// Initial state creators
export const createStudyInitialState = (
  problemName: string = "",
): StudyStateType => ({
  mode: "study",
  problemName,
  problemStatement: "",
  examples: [],
  constraints: [],
  problemCategory: "",
  difficulty: "",
  language: "python",
  conversationHistory: [],
  userCode: "",
  userUnderstandingLevel: "beginner",
  topicsCovered: [],
  userQuestions: [],
  isSolutionComplete: false,
  awaitingUserInput: false,
  iterationCount: 0,
  errorMessages: [],
  messages: [],
  flow: [],
});

export const createPowerInitialState = (
  problemName: string = "",
): PowerStateType => ({
  mode: "power",
  problemName,
  problemStatement: "",
  examples: [],
  constraints: [],
  problemCategory: "",
  difficulty: "",
  language: "python",
  strategies: [],
  selectedStrategy: null,
  userCode: "",
  finalCode: "",
  testResults: { passed: false, feedback: "" },
  fullExplanation: "",
  complexityAnalysis: { time: "", space: "" },
  iterationCount: 0,
  errorMessages: [],
  messages: [],
  flow: [],
});

// Legacy exports for backward compatibility (will be removed)
export const LeetCodeStateSchema = StudyStateSchema;
export type LeetCodeState = StudyStateType;
export const createInitialState = createStudyInitialState;
