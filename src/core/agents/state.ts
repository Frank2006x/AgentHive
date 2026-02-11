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

// Study Mode specific fields
export interface StudyModeState {
  conversationHistory: ConversationEntry[];
  hintLevel: number; // 1-5 progressive hint system
  currentHint: string;
  userCodeAttempts: string[];
  userUnderstandingLevel: "beginner" | "intermediate" | "advanced";
  topicsCovered: string[];
  userQuestions: string[];
  isSolutionComplete: boolean;
  awaitingUserInput: boolean;
}

// Power Mode specific fields
export interface PowerModeState {
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
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

// Reducer that replaces the value
const replaceReducer = <T>() => ({
  value: (x: T, y: T) => y,
  default: () => null as unknown as T,
});

// Array reducer that appends
const appendReducer = <T>() => ({
  value: (x: T[], y: T[]) => [...x, ...y],
  default: () => [],
});

// Main state schema using Annotation
export const LeetCodeStateSchema = Annotation.Root({
  // Mode selection
  mode: Annotation<Mode>(),

  // Common fields
  problemName: Annotation<string>(),
  problemStatement: Annotation<string>(),
  examples: Annotation<Example[]>(appendReducer<Example>()),
  constraints: Annotation<string[]>(appendReducer<string>()),
  problemCategory: Annotation<string>(),
  difficulty: Annotation<string>(),

  // Study Mode state
  studyMode: Annotation<StudyModeState>({
    value: (x, y) => ({ ...x, ...y }),
    default: () => ({
      conversationHistory: [],
      hintLevel: 1,
      currentHint: "",
      userCodeAttempts: [],
      userUnderstandingLevel: "beginner",
      topicsCovered: [],
      userQuestions: [],
      isSolutionComplete: false,
      awaitingUserInput: false,
    }),
  }),

  // Power Mode state
  powerMode: Annotation<PowerModeState>({
    value: (x, y) => ({ ...x, ...y }),
    default: () => ({
      strategies: [],
      selectedStrategy: null,
      finalCode: "",
      testResults: {
        passed: false,
        feedback: "",
      },
      fullExplanation: "",
      complexityAnalysis: {
        time: "",
        space: "",
      },
    }),
  }),

  // Common
  iterationCount: Annotation<number>({
    value: (x, y) => y,
    default: () => 0,
  }),
  errorMessages: Annotation<string[]>(appendReducer<string>()),

  // Messages for streaming
  messages: Annotation<string[]>(appendReducer<string>()),
  flow: Annotation<string[]>(appendReducer<string>()),
});

// Type for the state
export type LeetCodeState = typeof LeetCodeStateSchema.State;

// Initial state creator
export const createInitialState = (mode: Mode = "study", problemName: string = ""): LeetCodeState => ({
  mode,
  problemName,
  problemStatement: "",
  examples: [],
  constraints: [],
  problemCategory: "",
  difficulty: "",
  studyMode: {
    conversationHistory: [],
    hintLevel: 1,
    currentHint: "",
    userCodeAttempts: [],
    userUnderstandingLevel: "beginner",
    topicsCovered: [],
    userQuestions: [],
    isSolutionComplete: false,
    awaitingUserInput: false,
  },
  powerMode: {
    strategies: [],
    selectedStrategy: null,
    finalCode: "",
    testResults: {
      passed: false,
      feedback: "",
    },
    fullExplanation: "",
    complexityAnalysis: {
      time: "",
      space: "",
    },
  },
  iterationCount: 0,
  errorMessages: [],
  messages: [],
  flow: [],
});
