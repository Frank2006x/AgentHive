import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { LeetCodeState } from "./state";

// Initialize Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

const runDialogueManager = async (state: LeetCodeState) => {
  console.log("DialogueManager: Managing conversation...");
  
  // For now, simulate a conversation step
  // In a real implementation, this would wait for user input
  // Since we can't wait in the graph, we'll check if we should continue or end
  
  const shouldContinue = state.studyMode.hintLevel <= 5 && !state.studyMode.isSolutionComplete;
  
  if (!shouldContinue) {
    console.log("DialogueManager: Study session complete");
    
    return new Command({
      goto: END,
      update: {
        studyMode: {
          ...state.studyMode,
          isSolutionComplete: true,
        },
        messages: [...state.messages, "Study session completed!"],
        flow: [...state.flow, "dialogueManager"],
      },
    });
  }
  
  // Check if user has provided code to review
  if (state.studyMode.userCodeAttempts.length > 0) {
    const lastCode = state.studyMode.userCodeAttempts[state.studyMode.userCodeAttempts.length - 1];
    
    const prompt = `Review this code attempt for the problem "${state.problemName}".

Problem: ${state.problemStatement}

User's Code:
\`\`\`
${lastCode}
\`\`\`

Provide constructive feedback:
1. What's correct about the approach?
2. What's missing or could be improved?
3. Should they continue or have they solved it?

Be encouraging and educational.`;

    try {
      const response = await llm.invoke([
        new SystemMessage("You are a code reviewer helping a student learn."),
        new HumanMessage(prompt),
      ]);
      
      const feedback = response.content as string;
      
      // Check if solution is correct (simple heuristic)
      const isCorrect = feedback.toLowerCase().includes("correct") && 
                       !feedback.toLowerCase().includes("incorrect") &&
                       !feedback.toLowerCase().includes("missing");
      
      if (isCorrect) {
        console.log("DialogueManager: User solution is correct!");
        
        return new Command({
          goto: END,
          update: {
            studyMode: {
              ...state.studyMode,
              isSolutionComplete: true,
              conversationHistory: [
                ...state.studyMode.conversationHistory,
                { role: "assistant", message: "Congratulations! Your solution is correct!", timestamp: Date.now() },
              ],
            },
            messages: [...state.messages, "User solution verified as correct!"],
            flow: [...state.flow, "dialogueManager"],
          },
        });
      }
      
      console.log("DialogueManager: Providing feedback, user should try again");
      
      return new Command({
        goto: "hintGenerator",
        update: {
          studyMode: {
            ...state.studyMode,
            conversationHistory: [
              ...state.studyMode.conversationHistory,
              { role: "assistant", message: feedback, timestamp: Date.now() },
            ],
          },
          messages: [...state.messages, "Provided code feedback"],
          flow: [...state.flow, "dialogueManager"],
        },
      });
    } catch (error) {
      console.error("DialogueManager: Error reviewing code", error);
    }
  }
  
  // Continue with next hint
  console.log("DialogueManager: Continuing to next hint");
  
  return new Command({
    goto: "hintGenerator",
    update: {
      messages: [...state.messages, "Continuing with next hint..."],
      flow: [...state.flow, "dialogueManager"],
    },
  });
};

export default runDialogueManager;
