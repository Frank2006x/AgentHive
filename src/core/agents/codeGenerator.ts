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
  const hasUserCode = state.userCode && state.userCode.trim().length > 0;

  const prompt = hasUserCode
    ? `Analyze and OPTIMIZE the user's code for this LeetCode problem.

User's Current Code:
\`\`\`${state.language}
${state.userCode}
\`\`\`

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
    ? `Recommended Approach: ${strategy.name}
Description: ${strategy.description}
Time Complexity: ${strategy.timeComplexity}
Space Complexity: ${strategy.spaceComplexity}`
    : ""
}

Requirements:
1. Analyze the user's approach and identify improvements
2. Generate an OPTIMIZED version in ${state.language}
3. Keep similar structure where possible but optimize algorithm
4. Fix any bugs or inefficiencies
5. Add helpful comments explaining key optimizations
6. Ensure the solution is production-quality

IMPORTANT: Return ONLY the code implementation. Do NOT include:
- Terminal commands or execution instructions
- Phrases like "Run this", "To test", "Execute with"
- Text explanations outside of code comments

Generate the optimized code now:`
    : `Generate a complete, production-quality solution in ${state.language} for this LeetCode problem.

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
1. Complete ${state.language} function with proper signature
2. Include docstring explaining the approach
3. Handle edge cases
4. Follow best practices and style guidelines
5. Include comments explaining key logic
6. Provide the optimal solution

IMPORTANT: Return ONLY the code implementation. Do NOT include:
- Terminal commands or execution instructions
- Phrases like "Run this", "To test", "Execute with"
- Text explanations outside of code comments

Generate the code now:`;

  try {
    const response = await llm.invoke([
      new SystemMessage(
        `You are an expert competitive programmer specializing in code optimization and algorithm analysis.
        
CRITICAL INSTRUCTIONS:
- Generate ONLY the code implementation
- DO NOT include any commands, terminal instructions, or how-to-run text
- DO NOT include explanations outside of code comments
- DO NOT include phrases like "Run this with...", "To test...", or "Execute..."
- Return only the function/class implementation with inline comments
- Output must be ready-to-use code that can be directly copied to an editor`,
      ),
      new HumanMessage(prompt),
    ]);

    const code = response.content as string;

    // Extract code from markdown if present
    const codeMatch = code.match(/```python\s*([\s\S]*?)```/) ||
      code.match(/```javascript\s*([\s\S]*?)```/) ||
      code.match(/```typescript\s*([\s\S]*?)```/) ||
      code.match(/```java\s*([\s\S]*?)```/) ||
      code.match(/```cpp\s*([\s\S]*?)```/) ||
      code.match(/```rust\s*([\s\S]*?)```/) ||
      code.match(/```go\s*([\s\S]*?)```/) ||
      code.match(/```\s*([\s\S]*?)```/) || [null, code];
    const cleanCode = codeMatch[1]?.trim() || code;

    console.log("CodeGenerator: Generated optimized solution code");

    return new Command({
      goto: "testValidator",
      update: {
        finalCode: cleanCode,
        messages: [
          hasUserCode
            ? "Generated optimized solution based on user code"
            : "Generated solution code",
        ],
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
