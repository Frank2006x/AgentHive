import { StateGraph } from "@langchain/langgraph";
import { agentStateSchema } from "./state";
import runExplainerAgent from "./explainer";
import runSupervisorAgent from "./supervisor";
import runProblemLoaderNode from "./problemLoader";
import runDebuggerAgent from "./debugger";
import {START} from "@langchain/langgraph";
const graph= new StateGraph(agentStateSchema);

graph.addNode("explainer", runExplainerAgent,{
  ends:["supervisor"]
})
graph.addNode("supervisor", runSupervisorAgent,{
  ends:["explainer","loadProblem","debugger","__end__"]
});
graph.addNode("loadProblem", runProblemLoaderNode,{
  ends:["supervisor"]
});
graph.addNode("debugger", runDebuggerAgent,{
  ends:["supervisor"]
});
graph.addEdge(START, "supervisor");


graph.compile();
const app=graph;


