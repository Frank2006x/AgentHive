import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

const runTestValidator = async (state: LeetCodeState) => {
  console.log("TestValidator: Reviewing solution code...");
  
  const prompt = `Review this solution code for the LeetCode problem "${state.problemName}".

Problem Statement:
${state.problemStatement}

Constraints:
${state.constraints.join("\n")}

Examples:
${state.examples.map((ex, i) => `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}`).join("\n\n")}

Solution Code:
\`\`\`python
${state.powerMode.finalCode}
\`\`\`

Provide a detailed review:
1. Does the code correctly solve the problem? (Yes/No with explanation)
2. Does it handle all edge cases?
3. Is the time complexity optimal?
4. Is the space complexity optimal?
5. Code quality and style feedback
6. Any potential bugs or issues

Format:
VERDICT: [PASS/NEEDS_IMPROVEMENT]
FEEDBACK: [Detailed feedback]`;

  try {
    const response = await llm.invoke([
      new SystemMessage("You are a code reviewer and test validator."),
      new HumanMessage(prompt),
    ]);
    
    const review = response.content as string;
    
    // Parse verdict
    const passed = review.toLowerCase().includes("verdict: pass") ||
                  (review.toLowerCase().includes("correctly") && 
                   !review.toLowerCase().includes("incorrectly"));
    
    console.log(`TestValidator: Code review ${passed ? "PASSED" : "NEEDS_IMPROVEMENT"}`);
    
    return new Command({
      goto: "explainer",
      update: {
        powerMode: {
          ...state.powerMode,
          testResults: {
            passed,
            feedback: review,
          },
        },
        messages: [...state.messages, `Code review: ${passed ? "PASSED" : "NEEDS_IMPROVEMENT"}`],
        flow: [...state.flow, "testValidator"],
      },
    });
  } catch (error) {
    console.error("TestValidator: Error", error);
    return new Command({
      goto: "explainer",
      update: {
        messages: [...state.messages, "Error during code validation"],
        flow: [...state.flow, "testValidator"],
      },
    });
  }
};

export default runTestValidator;
