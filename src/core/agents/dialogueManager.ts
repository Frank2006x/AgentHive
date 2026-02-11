import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const runHintGenerator = async (state: LeetCodeState) => {
  console.log(`HintGenerator: Generating hint level ${state.studyMode.hintLevel}...`);
  
  const hintLevels = [
    "Give a very vague hint about the approach. Don't reveal the algorithm.",
    "Provide a slightly more specific hint about the data structure or technique.",
    "Give a hint about the algorithm family or pattern to use.",
    "Provide a more detailed hint with the main idea of the solution.",    
    "Give a detailed hint that almost reveals the solution, but let them code it.",
  ];
  
  const currentLevel = Math.min(state.studyMode.hintLevel - 1, 4);
  const hintInstruction = hintLevels[currentLevel];
  
  const prompt = `You are helping a student learn this LeetCode problem using the Socratic method.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Difficulty: ${state.difficulty}
Category: ${state.problemCategory}

${hintInstruction}

Provide a helpful hint that guides them toward the solution without giving it away entirely.
Keep it encouraging and educational.`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are an educational tutor using the Socratic method."),
      new HumanMessage(prompt),
    ]);
    
    const hint = response.content as string;
    
    // Add to conversation history
    const newEntry = {
      role: "assistant" as const,
      message: `Hint ${state.studyMode.hintLevel}: ${hint}`,
      timestamp: Date.now(),
    };
    
    console.log("HintGenerator: Generated hint");
    
    return new Command({
      goto: "dialogueManager",
      update: {
        studyMode: {
          ...state.studyMode,
          currentHint: hint,
          conversationHistory: [...state.studyMode.conversationHistory, newEntry],
          awaitingUserInput: true,
          hintLevel: state.studyMode.hintLevel + 1,
        },
        messages: [...state.messages, `Hint ${state.studyMode.hintLevel}: ${hint.slice(0, 100)}...`],
        flow: [...state.flow, "hintGenerator"],
      },
    });
  } catch (error) {
    console.error("HintGenerator: Error", error);
    return new Command({
      goto: "dialogueManager",
      update: {
        messages: [...state.messages, "Error generating hint"],
        flow: [...state.flow, "hintGenerator"],
      },
    });
  }
};

export default runHintGenerator;
