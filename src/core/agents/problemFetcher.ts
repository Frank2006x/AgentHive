import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";
import { StudyStateType, PowerStateType } from "./state";
import loadProblemTool from "../tools/leetcode";

const runProblemFetcher = async (state: StudyStateType | PowerStateType) => {
  console.log("ProblemFetcher: Fetching problem data...");
  
  try {
    // Invoke the LeetCode tool
    const toolResponse = await loadProblemTool.invoke({
      slug: state.problemName,
    });
    
    console.log("ProblemFetcher: Got problem data");
    
    // Parse the HTML content to extract problem statement
    const htmlContent = toolResponse as string;
    const textContent = htmlContent
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    
    // Extract sections
    let problemStatement = textContent;
    let constraints: string[] = [];
    
    const constraintsMatch = textContent.match(/Constraints?:\s*([^]*?)(?=Example|$)/i);
    if (constraintsMatch) {
      constraints = constraintsMatch[1]
        .split(/\n|\.\s/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      problemStatement = textContent.split(/Constraints?:/i)[0].trim();
    }
    
    // Extract examples using regex
    const exampleMatches = textContent.match(/Example \d+:[^]*?(?=Example \d+:|Constraints?:|$)/gi);
    const examples = exampleMatches?.map(ex => ({
      input: ex.match(/Input:\s*([^\n]+)/)?.[1] || "",
      output: ex.match(/Output:\s*([^\n]+)/)?.[1] || "",
      explanation: ex.match(/Explanation:\s*([^\n]+)/)?.[1] || "",
    })) || [];
    
    return new Command({
      goto: "problemAnalyzer",
      update: {
        problemStatement: problemStatement.slice(0, 2000),
        constraints: constraints.slice(0, 10),
        examples: examples.slice(0, 5),
        messages: [`Fetched problem: ${state.problemName}`],
        flow: ["problemFetcher"],
      },
    });
  } catch (error) {
    console.error("ProblemFetcher: Error fetching problem", error);
    return new Command({
      goto: END,
      update: {
        errorMessages: [`Failed to fetch problem: ${error}`],
        messages: ["Error: Could not fetch problem from LeetCode"],
        flow: ["problemFetcher"],
      },
    });
  }
};

export default runProblemFetcher;
