import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * DEPRECATED: This route is deprecated.
 * Please use:
 * - /api/leetcode/study for study mode
 * - /api/leetcode/power for power mode
 */
export async function POST(req: NextRequest) {
  try {
    const { mode } = await req.json();

    // Redirect to the appropriate endpoint
    return new Response(
      JSON.stringify({
        error: "This endpoint is deprecated",
        message: mode === "study"
          ? "Please use /api/leetcode/study instead"
          : mode === "power"
          ? "Please use /api/leetcode/power instead"
          : "Please specify mode: 'study' or 'power' and use the appropriate endpoint",
        redirectTo: mode === "study" ? "/api/leetcode/study" : mode === "power" ? "/api/leetcode/power" : null,
      }),
      {
        status: 410, // Gone
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: "Bad request",
        message: "This endpoint is deprecated. Use /api/leetcode/study or /api/leetcode/power",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

