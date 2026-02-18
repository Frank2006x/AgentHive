import { NextRequest } from "next/server";
import app from "@/core/agents/graph";
import { createInitialState } from "@/core/agents/state";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { mode, problemName, code, language, question } = await req.json();

    if (!mode || !problemName) {
      return new Response(
        JSON.stringify({ error: "Mode and problem name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (mode !== "study" && mode !== "power") {
      return new Response(
        JSON.stringify({ error: "Mode must be 'study' or 'power'" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create initial state
    const initialState = createInitialState(mode, problemName);

    // Set language if provided (defaults to python in createInitialState)
    if (language) {
      initialState.language = language;
    }

    // Add user code and question based on mode
    if (code) {
      if (mode === "study") {
        initialState.studyMode.userCodeAttempts = [code];
      } else if (mode === "power") {
        initialState.powerMode.userCode = code;
      }
    }
    if (question) {
      initialState.studyMode.userQuestions = [question];
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
                mode,
                problemName,
              })}\n\n`,
            ),
          );

          // Stream from the graph
          for await (const state of await app.stream(initialState, {
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

                // Study mode fields
                ...(mode === "study" && {
                  conversationHistory: state.studyMode.conversationHistory,
                  isSolutionComplete: state.studyMode.isSolutionComplete,
                  awaitingUserInput: state.studyMode.awaitingUserInput,
                }),

                // Power mode fields
                ...(mode === "power" && {
                  strategies: state.powerMode.strategies,
                  selectedStrategy: state.powerMode.selectedStrategy,
                  finalCode: state.powerMode.finalCode,
                  complexityAnalysis: state.powerMode.complexityAnalysis,
                  fullExplanation: state.powerMode.fullExplanation,
                  testResults: state.powerMode.testResults,
                }),
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
                message: "Session completed successfully",
              })}\n\n`,
            ),
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
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
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
