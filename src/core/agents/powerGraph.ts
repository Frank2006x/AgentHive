import { START, StateGraph } from "@langchain/langgraph";
import { PowerStateSchema } from "./state";
import runProblemFetcher from "./problemFetcher";
import runProblemAnalyzer from "./problemAnalyzer";
import runStrategist from "./strategist";
import runCodeGenerator from "./codeGenerator";
import runTestValidator from "./testValidator";
import runExplainer from "./explainer";

console.log("⚡ Initializing Power Mode Graph...");

// Build the power mode graph
const powerGraph = new StateGraph(PowerStateSchema)
  // Add nodes
  .addNode("problemFetcher", runProblemFetcher)
  .addNode("problemAnalyzer", runProblemAnalyzer)
  .addNode("strategist", runStrategist)
  .addNode("codeGenerator", runCodeGenerator)
  .addNode("testValidator", runTestValidator)
  .addNode("explainer", runExplainer);

// Define edges for power mode flow (linear pipeline)
const app = powerGraph
  // Entry point -> problem fetcher
  .addEdge(START, "problemFetcher")

  // Problem flow
  .addEdge("problemFetcher", "problemAnalyzer")
  .addEdge("problemAnalyzer", "strategist")

  // Power mode autonomous pipeline
  .addEdge("strategist", "codeGenerator")
  .addEdge("codeGenerator", "testValidator")
  .addEdge("testValidator", "explainer")

  // End after explanation
  .addEdge("explainer", "__end__")

  .compile();

console.log("✅ Power Mode Graph compiled successfully!");

export default app;
