import { START, StateGraph } from "@langchain/langgraph";
import { LeetCodeStateSchema, createInitialState } from "./state";
import { orchestratorNode } from "./orchestrator";
import runProblemFetcher from "./problemFetcher";
import runProblemAnalyzer from "./problemAnalyzer";
import runHintGenerator from "./hintGenerator";
import runDialogueManager from "./dialogueManager";
import runStrategist from "./strategist";
import runCodeGenerator from "./codeGenerator";
import runTestValidator from "./testValidator";
import runExplainer from "./explainer";

console.log("🚀 Initializing LeetCode Assistant Graph...");

// Build the graph
const graph = new StateGraph(LeetCodeStateSchema)
  // Entry point - Orchestrator routes based on mode
  .addNode("orchestrator", orchestratorNode)
  
  // Shared nodes (both modes)
  .addNode("problemFetcher", runProblemFetcher)
  .addNode("problemAnalyzer", runProblemAnalyzer)
  
  // Study Mode nodes
  .addNode("hintGenerator", runHintGenerator)
  .addNode("dialogueManager", runDialogueManager)
  
  // Power Mode nodes
  .addNode("strategist", runStrategist)
  .addNode("codeGenerator", runCodeGenerator)
  .addNode("testValidator", runTestValidator)
  .addNode("explainer", runExplainer);

// Define edges
const app = graph
  // Entry point
  .addEdge(START, "orchestrator")
  
  // Orchestrator routes to problem fetcher (both modes start here)
  .addEdge("orchestrator", "problemFetcher")
  
  // Problem flow (shared)
  .addEdge("problemFetcher", "problemAnalyzer")
  
  // Problem analyzer routes based on mode
  .addConditionalEdges("problemAnalyzer", (state) => {
    console.log(`📊 Mode: ${state.mode}, routing accordingly...`);
    return state.mode === "study" ? "hintGenerator" : "strategist";
  })
  
  // Study Mode flow
  .addEdge("hintGenerator", "dialogueManager")
  .addConditionalEdges("dialogueManager", (state) => {
    // Check if study session should continue
    if (state.studyMode.isSolutionComplete || state.studyMode.hintLevel > 5) {
      return "__end__";
    }
    // For now, we'll cycle through hints automatically
    // In a real implementation, this would wait for user input
    return state.studyMode.userCodeAttempts.length > 0 ? "hintGenerator" : "__end__";
  })
  
  // Power Mode flow
  .addEdge("strategist", "codeGenerator")
  .addEdge("codeGenerator", "testValidator")
  .addEdge("testValidator", "explainer")
  .addEdge("explainer", "__end__")
  
  .compile();

console.log("✅ Graph compiled successfully!");

// Example usage function
export async function runLeetCodeAssistant(mode: "study" | "power", problemName: string) {
  console.log(`\n🎯 Running ${mode.toUpperCase()} MODE for problem: ${problemName}\n`);
  
  const initialState = createInitialState(mode, problemName);
  
  const results = [];
  for await (const state of await app.stream(initialState, {
    streamMode: "values",
  })) {
    results.push(state);
    console.log(`\n📍 Current step: ${state.flow[state.flow.length - 1] || "initial"}`);
    
    if (state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      console.log(`💬 ${lastMessage}`);
    }
  }
  
  return results[results.length - 1];
}

// CLI test
if (require.main === module) {
  const mode = (process.argv[2] as "study" | "power") || "study";
  const problemName = process.argv[3] || "two-sum";
  
  runLeetCodeAssistant(mode, problemName)
    .then((finalState) => {
      console.log("\n" + "=".repeat(60));
      console.log("🎉 EXECUTION COMPLETED!");
      console.log("=".repeat(60));
      console.log(`\n📊 Final Flow: ${finalState.flow.join(" → ")}`);
      
      if (mode === "study") {
        console.log(`\n📚 STUDY MODE RESULTS:`);
        console.log(`   Hints provided: ${finalState.studyMode.hintLevel - 1}`);
        console.log(`   Solution complete: ${finalState.studyMode.isSolutionComplete}`);
        console.log(`   Topics covered: ${finalState.studyMode.topicsCovered.join(", ") || "N/A"}`);
      } else {
        console.log(`\n⚡ POWER MODE RESULTS:`);
        console.log(`   Strategy: ${finalState.powerMode.selectedStrategy?.name || "N/A"}`);
        console.log(`   Time: ${finalState.powerMode.complexityAnalysis.time || "N/A"}`);
        console.log(`   Space: ${finalState.powerMode.complexityAnalysis.space || "N/A"}`);
        console.log(`   Tests passed: ${finalState.powerMode.testResults.passed}`);
        
        if (finalState.powerMode.finalCode) {
          console.log(`\n💻 Generated Code:\n${finalState.powerMode.finalCode.slice(0, 500)}...`);
        }
      }
    })
    .catch(console.error);
}

export default app;
