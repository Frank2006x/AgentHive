import { START, StateGraph } from "@langchain/langgraph";
import { StudyStateSchema } from "./state";
import runProblemFetcher from "./problemFetcher";
import runProblemAnalyzer from "./problemAnalyzer";
import runChatTutor from "./chatTutor";
import runDialogueManager from "./dialogueManager";

console.log("🎓 Initializing Study Mode Graph...");

// Build the study mode graph
const studyGraph = new StateGraph(StudyStateSchema)
  // Add nodes
  .addNode("problemFetcher", runProblemFetcher)
  .addNode("problemAnalyzer", runProblemAnalyzer)
  .addNode("chatTutor", runChatTutor)
  .addNode("dialogueManager", runDialogueManager);

// Define edges for study mode flow
const app = studyGraph
  // Entry point -> problem fetcher
  .addEdge(START, "problemFetcher")

  // Problem flow
  .addEdge("problemFetcher", "problemAnalyzer")
  .addEdge("problemAnalyzer", "chatTutor")

  // Chat tutor -> dialogue manager
  .addEdge("chatTutor", "dialogueManager")

  // Dialogue manager: end if solution is complete, otherwise end and await user input
  .addConditionalEdges("dialogueManager", (state) => {
    if (state.isSolutionComplete) {
      console.log("✅ Study session completed!");
      return "__end__";
    }
    // End stream, awaiting user input (handled by UI)
    console.log("⏸️ Awaiting user input...");
    return "__end__";
  })

  .compile();

console.log("✅ Study Mode Graph compiled successfully!");

export default app;
