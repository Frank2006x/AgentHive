import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { PowerStateType } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

const runExplainer = async (state: PowerStateType) => {
  console.log("Explainer: Generating detailed explanation...");

  const prompt = `Provide a comprehensive explanation for this LeetCode problem solution.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Difficulty: ${state.difficulty}
Category: ${state.problemCategory}

${
  state.selectedStrategy
    ? `
Approach: ${state.selectedStrategy.name}
Time Complexity: ${state.selectedStrategy.timeComplexity}
Space Complexity: ${state.selectedStrategy.spaceComplexity}
`
    : ""
}

Solution Code:
\`\`\`python
${state.finalCode}
\`\`\`

${
  state.testResults.feedback
    ? `
Code Review:
${state.testResults.feedback}
`
    : ""
}

Please provide:
1. Detailed explanation of the algorithm and approach
2. Step-by-step walkthrough with one example
3. Time and space complexity analysis
4. Key insights and patterns used
5. Alternative approaches (briefly)

Make it educational and clear.`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are an expert educator explaining algorithms."),
      new HumanMessage(prompt),
    ]);

    const explanation = response.content as string;

    // Extract complexity analysis
    const timeMatch =
      explanation.match(/Time Complexity:\s*O\([^)]+\)/i) ||
      explanation.match(/Time:\s*O\([^)]+\)/i);
    const spaceMatch =
      explanation.match(/Space Complexity:\s*O\([^)]+\)/i) ||
      explanation.match(/Space:\s*O\([^)]+\)/i);

    console.log("Explainer: Generated comprehensive explanation");

    return new Command({
      goto: END,
      update: {
        fullExplanation: explanation,
        complexityAnalysis: {
          time: timeMatch?.[0] || "Unknown",
          space: spaceMatch?.[0] || "Unknown",
        },
        messages: ["Generated complete solution with explanation"],
        flow: ["explainer"],
      },
    });
  } catch (error) {
    console.error("Explainer: Error", error);
    return new Command({
      goto: END,
      update: {
        messages: ["Error generating explanation"],
        flow: ["explainer"],
      },
    });
  }
};

export default runExplainer;
