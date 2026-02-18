import { NextRequest } from "next/server";
import powerGraph from "@/core/agents/powerGraph";
import { createPowerInitialState } from "@/core/agents/state";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { problemName, language } = await req.json();

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

    // Create a stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "start",
                mode: "power",
                problemName,
              })}\n\n`,
            ),
          );

          // Stream from the power graph
          for await (const state of await powerGraph.stream(initialState, {
            streamMode: "values",
          })) {
            // Extract relevant data from the state
            const event = {
              type: "update",
              step: state.flow[state.flow.length - 1],
              flow: state.flow,
              messages: state.messages,
              data: {
                // Common fields
                problemStatement: state.problemStatement,
                difficulty: state.difficulty,
                category: state.problemCategory,
                examples: state.examples,
                constraints: state.constraints,

                // Power mode specific fields
                strategies: state.strategies,
                selectedStrategy: state.selectedStrategy,
                finalCode: state.finalCode,
                complexityAnalysis: state.complexityAnalysis,
                fullExplanation: state.fullExplanation,
                testResults: state.testResults,
              },
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
            );
          }

          // Send completion event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "complete",
                message: "Power mode solution generated successfully",
              })}\n\n`,
            ),
          );
          controller.close();
        } catch (error) {
          console.error("Power mode streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: error instanceof Error ? error.message : "Unknown error",
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
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
