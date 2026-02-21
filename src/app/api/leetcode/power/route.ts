import { NextRequest } from "next/server";
import powerGraph from "@/core/agents/powerGraph";
import { createPowerInitialState } from "@/core/agents/state";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { problemName, language, userCode } = await req.json();

    if (!problemName) {
      return new Response(
        JSON.stringify({ error: "Problem name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create initial state for power mode
    const initialState = createPowerInitialState(problemName);

    // Set language if provided
    if (language) {
      initialState.language = language;
    }

    // Set user code if provided
    if (userCode) {
      initialState.userCode = userCode;
    }

    // Execute the graph and wait for completion
    console.log("⚡ Starting power mode for:", problemName);

    let finalState = initialState; // Initialize with initial state
    for await (const state of await powerGraph.stream(initialState, {
      streamMode: "values",
    })) {
      finalState = state;
      console.log("📊 Step completed:", state.flow[state.flow.length - 1]);
    }

    console.log("✅ Power mode completed");

    // Return the final state as JSON
    return new Response(
      JSON.stringify({
        success: true,
        mode: "power",
        data: {
          // Common fields
          problemName: finalState.problemName,
          problemStatement: finalState.problemStatement,
          difficulty: finalState.difficulty,
          category: finalState.problemCategory,
          examples: finalState.examples,
          constraints: finalState.constraints,

          // Power mode specific fields
          strategies: finalState.strategies,
          selectedStrategy: finalState.selectedStrategy,
          finalCode: finalState.finalCode,
          complexityAnalysis: finalState.complexityAnalysis,
          fullExplanation: finalState.fullExplanation,
          testResults: finalState.testResults,

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
    console.error("Power mode API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
