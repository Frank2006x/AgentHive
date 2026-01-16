import { tool } from "langchain";
import { z } from "zod";

 const loadProblemTool = tool(
  async (input: { slug: string }) => {
    const { slug } = input;
    const normalizedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              title
              content
              difficulty
            }
          }
        `,
        variables: { titleSlug: normalizedSlug },
      }),
    });

    const json = await res.json();

    if (!json.data?.question) {
      throw new Error("Problem not found or access blocked");
    }

    return json.data.question.content.slice(0, 8000);
  },
  {
    name: "load_leetcode_problem",
    description:
      "Load full LeetCode problem statement using GraphQL (expects slug)",
    schema: z.object({
      slug: z.string().describe("LeetCode problem slug, e.g. 'two-sum'"),
    }),
  }
);


export default loadProblemTool;
