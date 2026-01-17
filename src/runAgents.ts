// Example script to run the agent flow
import dotenv from "dotenv";
import { runAgentFlow, exampleUsage, askAgents } from "./core/agents/graph";

// Load environment variables
dotenv.config();

// Main execution function
async function main() {
  try {
    console.log("🤖 Multi-Agent Code Assistant");
    console.log("================================\n");

    // Example 1: Simple question
    console.log("1️⃣ Simple explanation request:");
    const response1 = await askAgents(
      "What is a closure in JavaScript?",
      `function outerFunction(x) {
        return function innerFunction(y) {
          return x + y;
        };
      }`,
    );
    console.log("Response:", response1);
    console.log("\n" + "=".repeat(50) + "\n");

    // Example 2: Debugging request
    console.log("2️⃣ Debugging request:");
    const response2 = await askAgents(
      "This function has a bug, can you help me fix it?",
      `function isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i < num; i++) {
          if (num % i == 0) return false;
        }
        return true;
      }`,
    );
    console.log("Response:", response2);
    console.log("\n" + "=".repeat(50) + "\n");

    // Example 3: Complex request that might trigger agent collaboration
    console.log("3️⃣ Complex request (may trigger A2A communication):");
    const result3 = await runAgentFlow(
      "I'm getting an error with this code and I don't understand why it's happening. Can you help me understand and fix it?",
      `async function fetchUserData(userId) {
        const response = await fetch('/api/users/' + userId);
        const userData = response.json();
        return userData.name;
      }`,
    );

    console.log("Agent Flow:", result3.flow.join(" → "));
    console.log(
      "Final Response:",
      result3.messages[result3.messages.length - 1].content,
    );
    console.log("\n" + "=".repeat(50) + "\n");

    // Example 4: Run the comprehensive example
    console.log("4️⃣ Running comprehensive examples:");
    await exampleUsage();
  } catch (error) {
    console.error("❌ Error running agent flow:", error);

    // Check for common issues
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable");
    }
    if (!process.env.GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY environment variable");
    }
  }
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

export { main };
