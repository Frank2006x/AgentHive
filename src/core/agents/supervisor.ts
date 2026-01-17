import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, providerStrategy, SystemMessage } from "langchain";
import { z } from "zod";
import { AgentState } from "./state";
import { END } from "@langchain/langgraph";
import { Command } from "@langchain/langgraph";

// Initialize Gemini LLM for supervisor
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.1,
});

const outputSchema = z.object({
  nextAgent: z.enum(["explainer", "loadProblem", "debugger", "END"]),
  msg2Agent: z.string(),
});

const agent = createAgent({
  model: llm,
  systemPrompt: `You are the Supervisor agent in a multi-agent coding assistant system.
        Your role is to analyze the user's input and determine which specialized agent is best suited to handle the request.
        if the problem is not loaded yet, you must choose loadProblem agent.
        If the user needs an explanation of code or a programming concept, choose the explainer agent.
        If the user needs debugging help, choose the debugger agent.
        if the user request is not clear, ask clarifying questions to understand their needs better and end.
        if the user request is satisfied, end the process.
        The available agents are: explainer, loadProblem, debugger.`,
  responseFormat: providerStrategy(outputSchema),
});

const runSupervisorAgent = async (state: AgentState) => {
  if (state.problem.problemStatement === "") {
    return {
      nextAgent: "loadProblem",
      msg2Agent: `The problem is not loaded yet. Please load the problem first.`,
    };
  }

  const response = await agent.invoke({
    messages: [
      new SystemMessage(
        `User Question: ${state.userQuestion[state.userQuestion.length - 1]}`,
      ),
    ],
  });
  state.flow.push("supervisor");
  state.messages.push(response.structuredResponse.msg2Agent);
  if (response.structuredResponse.nextAgent === "END") {
    state.messages.push("Thank you for using the coding assistant. Goodbye!");
    return new Command({
      goto: END,
      update: {
        flow: state.flow,
        messages: state.messages,
        userQuestion: state.userQuestion,
      },
    });
  }

  return new Command({
    goto: response.structuredResponse.nextAgent,
    update: {
      flow: state.flow,
      messages: state.messages,
      userQuestion: [
        ...state.userQuestion,
        response.structuredResponse.msg2Agent,
      ],
    },
  });
};

export default runSupervisorAgent;
