# Multi-Agent Code Assistant

This is a multi-agent system that uses LangGraph to orchestrate between an explainer agent (using Gemini) and a debugger agent (using Groq) for code assistance.

## Setup

1. **Install Dependencies:**

```bash
npm install @langchain/google-genai @langchain/groq @langchain/core @langchain/langgraph dotenv
```

2. **Environment Variables:**
   Create a `.env` file in your project root:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

### Method 1: Simple Usage

```typescript
import { askAgents } from "./core/agents/graph";

// Simple question
const response = await askAgents(
  "Explain how this function works",
  "function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }",
);
console.log(response);
```

### Method 2: Full Flow with State

```typescript
import { runAgentFlow } from "./core/agents/graph";

const result = await runAgentFlow(
  "Debug this code for me",
  "function broken() { return x + y; }", // Missing variable declarations
);

console.log("Agent Flow:", result.flow);
console.log("Messages:", result.messages);
```

### Method 3: Run Example Script

```bash
# Using ts-node
npx ts-node src/runAgents.ts

# Or compile and run
npm run build
node dist/runAgents.js
```

## Architecture

- **Supervisor/Router**: Analyzes problems and routes to appropriate agents
- **Explainer Agent**: Uses Gemini for code explanations and concept teaching
- **Debugger Agent**: Uses Groq for code debugging and fixing
- **A2A Communication**: Agents can collaborate and route to each other based on context

## Agent Flow Examples

1. **Explanation Request** → Router → Explainer → END
2. **Debug Request** → Router → Debugger → END
3. **Complex Request** → Router → Explainer → Debugger → END (A2A collaboration)

## API Reference

### `runAgentFlow(userQuestion: string, userCode?: string): Promise<AgentState>`

Runs the full multi-agent flow and returns the complete state with agent history.

### `askAgents(question: string, code?: string): Promise<string>`

Simple helper that returns just the final response string.

### Agent State Structure

```typescript
interface AgentState {
  problem: string; // Summarized problem description
  userQuestion: string[]; // [original question, supervisor command]
  userCode: string; // User's code input
  messages: BaseMessage[]; // Conversation history
  flow: string[]; // Agent execution path
}
```

## Troubleshooting

- Ensure API keys are properly set in `.env`
- Check that all dependencies are installed
- Verify TypeScript configuration for ES modules
