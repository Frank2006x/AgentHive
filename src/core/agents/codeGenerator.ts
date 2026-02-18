import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { PowerStateType } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

const runCodeGenerator = async (state: PowerStateType) => {
  console.log("CodeGenerator: Generating solution code...");

  const strategy = state.selectedStrategy;

  const prompt = `Generate a complete, production-quality solution in Python for this LeetCode problem.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Constraints: ${state.constraints.join(", ")}
Examples:
${state.examples
  .map(
    (ex, i) => `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}
Explanation: ${ex.explanation || "N/A"}`,
  )
  .join("\n\n")}

${
  strategy
    ? `Approach: ${strategy.name}
Description: ${strategy.description}
Time Complexity: ${strategy.timeComplexity}
Space Complexity: ${strategy.spaceComplexity}`
    : ""
}

Requirements:
1. Complete Python function with proper signature
2. Include docstring explaining the approach
3. Handle edge cases
4. Follow PEP 8 style guidelines
5. Include comments explaining key logic
6. Provide the optimal solution

Generate the code now:`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are an expert competitive programmer."),
      new HumanMessage(prompt),
    ]);

    const code = response.content as string;

    // Extract code from markdown if present
    const codeMatch = code.match(/```python\s*([\s\S]*?)```/) ||
      code.match(/```\s*([\s\S]*?)```/) || [null, code];
    const cleanCode = codeMatch[1]?.trim() || code;

    console.log("CodeGenerator: Generated solution code");

    return new Command({
      goto: "testValidator",
      update: {
        finalCode: cleanCode,
        messages: ["Generated solution code"],
        flow: ["codeGenerator"],
      },
    });
  } catch (error) {
    console.error("CodeGenerator: Error", error);
    return new Command({
      goto: "testValidator",
      update: {
        messages: ["Error generating code"],
        flow: ["codeGenerator"],
      },
    });
  }
};

export default runCodeGenerator;
