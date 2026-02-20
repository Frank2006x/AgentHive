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

  const codeContext = state.userCode
    ? `\n\nStudent's Current Code:\n\`\`\`${state.language}\n${state.userCode}\n\`\`\`\n\nConsider their code when providing guidance, but don't give the solution directly.`
    : "";

  const prompt = `You are answering a student's question about this LeetCode problem. Be SHORT and CONCISE.

Problem: ${state.problemName}
Statement: ${state.problemStatement}${codeContext}

Student's Question: "${question}"

Recent Conversation:
${conversationContext}

Provide a brief response (2-3 sentences max):
- Address their question directly
- If they have code, give ONE specific insight
- Ask ONE focused question to guide their thinking
- Use bullet points if listing multiple points

Keep it SHORT and actionable. No fluff.`;

  try {
    const response = await llm.invoke([
      new SystemMessage(
        "You are a concise tutor. Keep responses under 50 words. Be direct and effective. Never give solutions.",
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
  const prompt = `You are starting a tutoring session for this LeetCode problem. Be SHORT and welcoming.

Problem: ${state.problemName}
Statement: ${state.problemStatement}
Difficulty: ${state.difficulty}
Category: ${state.problemCategory}

Provide a brief welcome (2-3 sentences max):
- Brief greeting with problem difficulty
- ONE key question to start their thinking
- Invite them to share their initial approach

Keep it SHORT. No lengthy explanations.`;

  try {
    const response = await llm.invoke([
      new SystemMessage(
        "You are a concise tutor. Keep welcome messages under 40 words. Be friendly but brief.",
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
