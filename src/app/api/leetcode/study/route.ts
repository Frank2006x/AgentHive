import { NextRequest } from "next/server";
import studyGraph from "@/core/agents/studyGraph";
import { createStudyInitialState } from "@/core/agents/state";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { problemName, code, language, question } = await req.json();

    if (!problemName) {
      return new Response(
        JSON.stringify({ error: "Problem name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create initial state for study mode
    const initialState = createStudyInitialState(problemName);

    // Set language if provided
    if (language) {
      initialState.language = language;
    }

    // Add user code attempt if provided
    if (code) {
      initialState.userCodeAttempts = [code];
    }

    // Add user question if provided
    if (question) {
      initialState.userQuestions = [question];
    }

    // Execute the graph and wait for completion
    console.log("🎓 Starting study mode for:", problemName);

    let finalState = initialState; // Initialize with initial state
    for await (const state of await studyGraph.stream(initialState, {
      streamMode: "values",
    })) {
      finalState = state;
      console.log("📊 Step completed:", state.flow[state.flow.length - 1]);
    }

    console.log("✅ Study mode completed");

    // Return the final state as JSON
    return new Response(
      JSON.stringify({
        success: true,
        mode: "study",
        data: {
          // Common fields
          problemName: finalState.problemName,
          problemStatement: finalState.problemStatement,
          difficulty: finalState.difficulty,
          category: finalState.problemCategory,
          examples: finalState.examples,
          constraints: finalState.constraints,

          // Study mode specific fields
          conversationHistory: finalState.conversationHistory,
          isSolutionComplete: finalState.isSolutionComplete,
          awaitingUserInput: finalState.awaitingUserInput,
          topicsCovered: finalState.topicsCovered,
          userUnderstandingLevel: finalState.userUnderstandingLevel,

          // Metadata
          flow: finalState.flow,
          messages: finalState.messages,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Study mode API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
