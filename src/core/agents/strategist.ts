import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { LeetCodeState, Strategy } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

const runStrategist = async (state: LeetCodeState) => {
  console.log("Strategist: Generating solution strategies...");
  
  const prompt = `You are a senior software engineer designing solutions for this LeetCode problem.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Difficulty: ${state.difficulty}
Category: ${state.problemCategory}
Constraints: ${state.constraints.join(", ")}

Generate 2-3 different solution strategies with:
1. Strategy name
2. Brief description of the approach
3. Time complexity
4. Space complexity
5. Pros (2-3 points)
6. Cons (2-3 points)

Format your response as:

STRATEGY 1: [Name]
Description: [Description]
Time: O(?)
Space: O(?)
Pros: [Point 1], [Point 2]
Cons: [Point 1], [Point 2]

STRATEGY 2: [Name]
...and so on

Recommend the best strategy based on the constraints and typical LeetCode expectations.`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are an expert algorithm designer."),
      new HumanMessage(prompt),
    ]);
    
    const content = response.content as string;
    
    // Parse strategies from the response
    const strategies: Strategy[] = [];
    const strategyBlocks = content.split(/STRATEGY \d+:/gi).filter(s => s.trim());
    
    strategyBlocks.forEach((block, index) => {
      const nameMatch = block.match(/^\s*([^\n]+)/);
      const descMatch = block.match(/Description:\s*([^\n]+)/i);
      const timeMatch = block.match(/Time:\s*([^\n]+)/i);
      const spaceMatch = block.match(/Space:\s*([^\n]+)/i);
      const prosMatch = block.match(/Pros:\s*([^\n]+)/i);
      const consMatch = block.match(/Cons:\s*([^\n]+)/i);
      
      if (nameMatch) {
        strategies.push({
          name: nameMatch[1].trim(),
          description: descMatch?.[1]?.trim() || "",
          timeComplexity: timeMatch?.[1]?.trim() || "Unknown",
          spaceComplexity: spaceMatch?.[1]?.trim() || "Unknown",
          pros: prosMatch?.[1]?.split(",").map(s => s.trim()).filter(Boolean) || [],
          cons: consMatch?.[1]?.split(",").map(s => s.trim()).filter(Boolean) || [],
        });
      }
    });
    
    // Select the first (best) strategy
    const selectedStrategy = strategies[0] || null;
    
    console.log(`Strategist: Generated ${strategies.length} strategies`);
    
    return new Command({
      goto: "codeGenerator",
      update: {
        powerMode: {
          ...state.powerMode,
          strategies,
          selectedStrategy,
        },
        messages: [...state.messages, `Generated ${strategies.length} solution strategies`],
        flow: [...state.flow, "strategist"],
      },
    });
  } catch (error) {
    console.error("Strategist: Error", error);
    return new Command({
      goto: "codeGenerator",
      update: {
        messages: [...state.messages, "Error generating strategies, proceeding with default"],
        flow: [...state.flow, "strategist"],
      },
    });
  }
};

export default runStrategist;
