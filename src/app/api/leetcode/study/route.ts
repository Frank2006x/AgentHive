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
                mode: "study",
                problemName,
              })}\n\n`,
            ),
          );

          // Stream from the study graph
          for await (const state of await studyGraph.stream(initialState, {
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

                // Study mode specific fields
                conversationHistory: state.conversationHistory,
                isSolutionComplete: state.isSolutionComplete,
                awaitingUserInput: state.awaitingUserInput,
                topicsCovered: state.topicsCovered,
                userUnderstandingLevel: state.userUnderstandingLevel,
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
                message: "Study session completed successfully",
              })}\n\n`,
            ),
          );
          controller.close();
        } catch (error) {
          console.error("Study mode streaming error:", error);
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
