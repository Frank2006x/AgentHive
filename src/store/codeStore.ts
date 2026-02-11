import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Mode = "study" | "power" | null;

export interface Strategy {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pros: string[];
  cons: string[];
}

export interface ConversationEntry {
  role: "user" | "assistant";
  message: string;
  timestamp: number;
}

interface CodeStore {
  // Existing code editor state
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;

  // NEW: Multi-mode state
  mode: Mode;
  problemName: string;
  problemStatement: string;
  difficulty: string;
  category: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;

  // NEW: Study mode state
  currentHintLevel: number;
  hints: string[];
  isStudyComplete: boolean;
  studyConversation: ConversationEntry[];

  // NEW: Power mode state
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
  generatedCode: string;
  complexityAnalysis: { time: string; space: string };
  explanation: string;
  testResults: { passed: boolean; feedback: string };

  // NEW: UI/Streaming state
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  flow: string[];

  // Actions
  setMode: (mode: Mode) => void;
  setProblemName: (name: string) => void;
  setProblemData: (data: {
    statement?: string;
    difficulty?: string;
    category?: string;
    constraints?: string[];
    examples?: Array<{ input: string; output: string; explanation?: string }>;
  }) => void;

  // Study mode actions
  addHint: (hint: string) => void;
  nextHintLevel: () => void;
  completeStudy: () => void;
  addToStudyConversation: (entry: ConversationEntry) => void;
  resetStudy: () => void;

  // Power mode actions
  setStrategies: (strategies: Strategy[]) => void;
  selectStrategy: (strategy: Strategy) => void;
  setGeneratedCode: (code: string) => void;
  setComplexityAnalysis: (analysis: { time: string; space: string }) => void;
  setExplanation: (explanation: string) => void;
  setTestResults: (results: { passed: boolean; feedback: string }) => void;
  resetPower: () => void;

  // Session actions
  resetSession: () => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamingContent: (content: string) => void;
  clearStreamingContent: () => void;
  setError: (error: string | null) => void;
  addFlowStep: (step: string) => void;
  clearFlow: () => void;
}

export const useCodeStore = create<CodeStore>()(
  devtools(
    (set) => ({
      // Existing state
      code: "",
      language: "python",
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),

      // Multi-mode state
      mode: null,
      problemName: "",
      problemStatement: "",
      difficulty: "",
      category: "",
      constraints: [],
      examples: [],

      // Study mode state
      currentHintLevel: 1,
      hints: [],
      isStudyComplete: false,
      studyConversation: [],

      // Power mode state
      strategies: [],
      selectedStrategy: null,
      generatedCode: "",
      complexityAnalysis: { time: "", space: "" },
      explanation: "",
      testResults: { passed: false, feedback: "" },

      // UI state
      isLoading: false,
      isStreaming: false,
      streamingContent: "",
      error: null,
      flow: [],

      // Actions
      setMode: (mode) => set({ mode }),
      setProblemName: (name) => set({ problemName: name }),
      setProblemData: (data) =>
        set((state) => ({
          problemStatement: data.statement ?? state.problemStatement,
          difficulty: data.difficulty ?? state.difficulty,
          category: data.category ?? state.category,
          constraints: data.constraints ?? state.constraints,
          examples: data.examples ?? state.examples,
        })),

      // Study mode actions
      addHint: (hint) =>
        set((state) => ({
          hints: [...state.hints, hint],
        })),
      nextHintLevel: () =>
        set((state) => ({
          currentHintLevel: Math.min(state.currentHintLevel + 1, 5),
        })),
      completeStudy: () => set({ isStudyComplete: true }),
      addToStudyConversation: (entry) =>
        set((state) => ({
          studyConversation: [...state.studyConversation, entry],
        })),
      resetStudy: () =>
        set({
          currentHintLevel: 1,
          hints: [],
          isStudyComplete: false,
          studyConversation: [],
        }),

      // Power mode actions
      setStrategies: (strategies) => set({ strategies }),
      selectStrategy: (strategy) => set({ selectedStrategy: strategy }),
      setGeneratedCode: (code) => set({ generatedCode: code }),
      setComplexityAnalysis: (analysis) => set({ complexityAnalysis: analysis }),
      setExplanation: (explanation) => set({ explanation }),
      setTestResults: (results) => set({ testResults: results }),
      resetPower: () =>
        set({
          strategies: [],
          selectedStrategy: null,
          generatedCode: "",
          complexityAnalysis: { time: "", space: "" },
          explanation: "",
          testResults: { passed: false, feedback: "" },
        }),

      // Session actions
      resetSession: () =>
        set({
          mode: null,
          problemName: "",
          problemStatement: "",
          difficulty: "",
          category: "",
          constraints: [],
          examples: [],
          currentHintLevel: 1,
          hints: [],
          isStudyComplete: false,
          studyConversation: [],
          strategies: [],
          selectedStrategy: null,
          generatedCode: "",
          complexityAnalysis: { time: "", space: "" },
          explanation: "",
          testResults: { passed: false, feedback: "" },
          isLoading: false,
          isStreaming: false,
          streamingContent: "",
          error: null,
          flow: [],
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      appendStreamingContent: (content) =>
        set((state) => ({
          streamingContent: state.streamingContent + content,
        })),
      clearStreamingContent: () => set({ streamingContent: "" }),
      setError: (error) => set({ error }),
      addFlowStep: (step) =>
        set((state) => ({
          flow: [...state.flow, step],
        })),
      clearFlow: () => set({ flow: [] }),
    }),
    { name: "CodeStore" }
  )
);
