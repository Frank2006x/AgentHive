import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

const runProblemAnalyzer = async (state: LeetCodeState) => {
  console.log("ProblemAnalyzer: Analyzing problem...");
  
  const prompt = `Analyze this LeetCode problem and provide:
1. Difficulty level (Easy/Medium/Hard)
2. Problem category (e.g., Array, Dynamic Programming, Graph, etc.)
3. Key algorithmic concepts involved

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Constraints: ${state.constraints.join(", ")}

Respond in this exact format:
Difficulty: [Easy/Medium/Hard]
Category: [category name]
Concepts: [comma-separated list]`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are a problem analyzer for LeetCode problems."),
      new HumanMessage(prompt),
    ]);
    
    const content = response.content as string;
    
    // Parse the response
    const difficultyMatch = content.match(/Difficulty:\s*(Easy|Medium|Hard)/i);
    const categoryMatch = content.match(/Category:\s*([^\n]+)/i);
    const conceptsMatch = content.match(/Concepts:\s*([^\n]+)/i);
    
    const difficulty = difficultyMatch?.[1] || "Unknown";
    const category = categoryMatch?.[1]?.trim() || "General";
    
    console.log(`ProblemAnalyzer: ${difficulty} - ${category}`);
    
    // Route based on mode
    const nextNode = state.mode === "study" ? "hintGenerator" : "strategist";
    
    return new Command({
      goto: nextNode,
      update: {
        difficulty,
        problemCategory: category,
        messages: [...state.messages, `Problem analyzed: ${difficulty} difficulty, ${category}`],
        flow: [...state.flow, "problemAnalyzer"],
      },
    });
  } catch (error) {
    console.error("ProblemAnalyzer: Error", error);
    
    // Continue even if analysis fails
    const nextNode = state.mode === "study" ? "hintGenerator" : "strategist";
    
    return new Command({
      goto: nextNode,
      update: {
        messages: [...state.messages, "Problem analyzed (with defaults)"],
        flow: [...state.flow, "problemAnalyzer"],
      },
    });
  }
};

export default runProblemAnalyzer;
