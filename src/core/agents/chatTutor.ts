import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { StudyStateType } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const runChatTutor = async (state: StudyStateType) => {
  console.log("ChatTutor: Analyzing user input and providing guidance...");

  // Check if solution is already complete
  if (state.isSolutionComplete) {
    console.log("ChatTutor: Session already complete");
    return new Command({
      goto: END,
      update: {
        messages: ["Tutoring session completed!"],
        flow: ["chatTutor"],
      },
    });
  }

  // If user has asked questions, answer them
  if (state.userQuestions.length > 0) {
    const lastQuestion = state.userQuestions[state.userQuestions.length - 1];

    return await answerUserQuestion(state, lastQuestion);
  }

  // If no specific input, provide a welcoming guidance to start
  return await provideInitialGuidance(state);
};

const answerUserQuestion = async (state: StudyStateType, question: string) => {
  const conversationContext = state.conversationHistory
    .slice(-5)
    .map((entry) => `${entry.role}: ${entry.message}`)
    .join("\n");

  const prompt = `You are answering a student's question about this LeetCode problem. Guide them with Socratic questioning.

Problem: ${state.problemName}
Statement: ${state.problemStatement}

Student's Question: "${question}"

Recent Conversation:
${conversationContext}

Provide a helpful response that:
1. Addresses their question without giving the solution
2. Asks follow-up questions to make them think deeper
3. Provides hints about concepts they should consider
4. Encourages them to explore the problem further

Be educational and supportive.`;

  try {
    const response = await llm.invoke([
      new SystemMessage(
        "You are a helpful tutor who answers questions through guided discovery. Never give direct solutions.",
      ),
      new HumanMessage(prompt),
    ]);

    const answer = response.content as string;

    const newEntry = {
      role: "assistant" as const,
      message: answer,
      timestamp: Date.now(),
    };

    console.log("ChatTutor: Answered user question");

    return new Command({
      goto: "dialogueManager",
      update: {
        conversationHistory: [newEntry],
        awaitingUserInput: true,
        messages: ["Answered user question"],
        flow: ["chatTutor"],
      },
    });
  } catch (error) {
    console.error("ChatTutor: Error answering question", error);
    return new Command({
      goto: "dialogueManager",
      update: {
        messages: ["Error answering question"],
        flow: ["chatTutor"],
      },
    });
  }
};

const provideInitialGuidance = async (state: StudyStateType) => {
  const prompt = `You are starting a tutoring session for this LeetCode problem. Provide initial guidance.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Difficulty: ${state.difficulty}
Category: ${state.problemCategory}

Provide an encouraging introduction that:
1. Welcomes them to the tutoring session
2. Suggests they start by understanding the problem
3. Asks them what their initial thoughts are
4. Encourages them to think about examples
5. Invites them to share their approach or ask questions

Don't give any hints about the solution yet.`;

  try {
    const response = await llm.invoke([
      new SystemMessage(
        "You are a welcoming programming tutor starting a new session.",
      ),
      new HumanMessage(prompt),
    ]);

    const guidance = response.content as string;

    const newEntry = {
      role: "assistant" as const,
      message: guidance,
      timestamp: Date.now(),
    };

    console.log("ChatTutor: Provided initial guidance");

    return new Command({
      goto: "dialogueManager",
      update: {
        conversationHistory: [newEntry],
        awaitingUserInput: true,
        messages: ["Provided initial tutoring guidance"],
        flow: ["chatTutor"],
      },
    });
  } catch (error) {
    console.error("ChatTutor: Error providing guidance", error);
    return new Command({
      goto: "dialogueManager",
      update: {
        messages: ["Error providing initial guidance"],
        flow: ["chatTutor"],
      },
    });
  }
};

export default runChatTutor;
