import { StateGraph } from "@langchain/langgraph";
import { createInitialState, agentStateSchema } from "./state";
import runExplainerAgent from "./explainer";
import runSupervisorAgent from "./supervisor";
import runProblemLoaderNode from "./problemLoader";
import runDebuggerAgent from "./debugger";
import { START } from "@langchain/langgraph";

const graph = new StateGraph(agentStateSchema);

graph.addNode("explainer", runExplainerAgent, {
  ends: ["supervisor"],
});
graph.addNode("supervisor", runSupervisorAgent, {
  ends: ["explainer", "loadProblem", "debugger", "__end__"],
});
graph.addNode("loadProblem", runProblemLoaderNode, {
  ends: ["supervisor"],
});
graph.addNode("debugger", runDebuggerAgent, {
  ends: ["supervisor"],
});

graph.addNode("__start__", "supervisor");

const app = graph.compile();

const initState = createInitialState();
initState.userQuestion.push("explain the question Merge Intervals");

const run = async () => {

  for await (const chunk of await app.stream(initState, {
    streamMode: "values",
  })) {
    console.log(chunk);
  }
}

run();