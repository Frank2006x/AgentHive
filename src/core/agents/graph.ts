import { StateGraph } from "@langchain/langgraph";
import { agentStateSchema, AgentState, createInitialState } from "./state";
import { problemLoaderNode } from "./problemLoader";
import {
  routerNode,
  explainerNode,
  debuggerNode,
  coordinatorNode,
} from "./supervisor";

// Create the state graph for the multi-agent system
export const createAgentGraph = () => {
  const workflow = new StateGraph(agentStateSchema);

  // Add nodes to the graph
  workflow.addNode("problemLoader", problemLoaderNode);
  workflow.addNode("supervisor", routerNode);
  workflow.addNode("explainer", explainerNode);
  workflow.addNode("debugger", debuggerNode);
  workflow.addNode("coordinator", coordinatorNode);

  // Set the entry point
  workflow.setEntryPoint("problemLoader");

  // Add edges
  workflow.addEdge("problemLoader", "supervisor");

  // Compile the graph
  return workflow.compile();
};

export const runAgentFlow = async (
  userQuestion: string,
  userCode: string = "",
): Promise<AgentState> => {
  try {
    // Create the graph
    const graph = createAgentGraph();

    // Create initial state
    const initialState = createInitialState();
    initialState.userQuestion = [userQuestion];
    initialState.userCode = userCode;

    // Run the graph
    const result = (await graph.invoke(initialState)) as AgentState;

    return result;
  } catch (error) {
    console.error("Error running agent flow:", error);
    throw error;
  }
};

// Example usage function
export const exampleUsage = async () => {
  try {
    // Example 1: Code explanation request
    console.log("=== Example 1: Code Explanation ===");
    const result1 = await runAgentFlow(
      "Can you explain how this bubble sort algorithm works?",
      `function bubbleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
        return arr;
      }`,
    );

    console.log("Flow:", result1.flow);
    console.log(
      "Final response:",
      result1.messages[result1.messages.length - 1].content,
    );

    // Example 2: Debugging request
    console.log("\n=== Example 2: Code Debugging ===");
    const result2 = await runAgentFlow(
      "This code isn't working properly, can you help me fix it?",
      `function factorial(n) {
        if (n = 0) {
          return 1;
        }
        return n * factorial(n - 1);
      }`,
    );

    console.log("Flow:", result2.flow);
    console.log(
      "Final response:",
      result2.messages[result2.messages.length - 1].content,
    );
  } catch (error) {
    console.error("Error in example usage:", error);
  }
};

// Simple function to run a single query
export const askAgents = async (
  question: string,
  code?: string,
): Promise<string> => {
  const result = await runAgentFlow(question, code || "");
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content as string;
};
