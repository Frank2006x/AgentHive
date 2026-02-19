import { NextRequest } from "next/server";
import studyGraph from "@/core/agents/studyGraph";
import { createStudyInitialState } from "@/core/agents/state";
import runChatTutor from "@/core/agents/chatTutor";
import runDialogueManager from "@/core/agents/dialogueManager";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {
      problemName,
      language,
      question,
      // Existing problem data for follow-up messages
      problemStatement,
      difficulty,
      category,
      examples,
      constraints,
      conversationHistory,
      topicsCovered,
      userUnderstandingLevel,
    } = await req.json();

    if (!problemName) {
      return new Response(
        JSON.stringify({ error: "Problem name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check if this is a follow-up message (problem data already exists)
    const isFollowUp = !!problemStatement;

    if (isFollowUp) {
      console.log("🔄 Follow-up message detected, skipping problem fetch");

      // Create state with existing problem data
      const state = createStudyInitialState(problemName);
      state.problemStatement = problemStatement;
      state.difficulty = difficulty;
      state.problemCategory = category;
      state.examples = examples || [];
      state.constraints = constraints || [];
      state.conversationHistory = conversationHistory || [];
      state.topicsCovered = topicsCovered || [];
      state.userUnderstandingLevel = userUnderstandingLevel || "beginner";

      if (language) {
        state.language = language;
      }

      if (question) {
        state.userQuestions = [question];
      }

      // Directly invoke chatTutor and dialogueManager
      console.log("💬 Running chatTutor for follow-up...");
      const tutorResult = await runChatTutor(state);
      const updatedState = {
        ...state,
        ...(tutorResult.update || {}),
      };

      if (
        tutorResult.update &&
        "flow" in tutorResult.update &&
        Array.isArray(tutorResult.update.flow)
      ) {
        updatedState.flow = [...state.flow, ...tutorResult.update.flow];
      }

      console.log("🗣️ Running dialogueManager...");
      const dialogueResult = await runDialogueManager(updatedState);
      const finalState = {
        ...updatedState,
        ...(dialogueResult.update || {}),
      };

      if (
        dialogueResult.update &&
        "flow" in dialogueResult.update &&
        Array.isArray(dialogueResult.update.flow)
      ) {
        finalState.flow = [...updatedState.flow, ...dialogueResult.update.flow];
      }

      console.log("✅ Follow-up completed");

      // Return the final state
      return new Response(
        JSON.stringify({
          success: true,
          mode: "study",
          data: {
            problemName: finalState.problemName,
            problemStatement: finalState.problemStatement,
            difficulty: finalState.difficulty,
            category: finalState.problemCategory,
            examples: finalState.examples,
            constraints: finalState.constraints,
            conversationHistory: finalState.conversationHistory,
            isSolutionComplete: finalState.isSolutionComplete,
            awaitingUserInput: finalState.awaitingUserInput,
            topicsCovered: finalState.topicsCovered,
            userUnderstandingLevel: finalState.userUnderstandingLevel,
            flow: finalState.flow,
            messages: finalState.messages,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // First message - run full graph with problem fetching
    console.log("🆕 First message, fetching problem data");

    // Create initial state for study mode
    const initialState = createStudyInitialState(problemName);

    // Set language if provided
    if (language) {
      initialState.language = language;
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
