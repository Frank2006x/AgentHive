"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useCodeStore } from "@/store/codeStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ModeSelector } from "./ModeSelector";
import { ProblemInput } from "./ProblemInput";
import { Button } from "./ui/button";

const RightPanel: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    code,
    mode,
    problemName,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    flow,
    // Study mode state
    currentHintLevel,
    hints,
    // Power mode state
    strategies,
    selectedStrategy,
    generatedCode,
    complexityAnalysis,
    testResults,
    // Actions
    appendStreamingContent,
    setLoading,
    setStreaming,
    clearStreamingContent,
    setError,
    addFlowStep,
    resetSession,
  } = useCodeStore();

  const [question, setQuestion] = useState("");

  // Handle streaming response from API
  const handleStartSession = useCallback(async () => {
    if (!mode || !problemName) {
      setError("Please select a mode and enter a problem name");
      return;
    }

    setLoading(true);
    setStreaming(true);
    clearStreamingContent();
    setError(null);

    try {
      const response = await fetch("/api/leetcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          problemName,
          code,
          question: question || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));

              switch (event.type) {
                case "start":
                  console.log("Session started:", event);
                  break;

                case "update":
                  if (event.step) {
                    addFlowStep(event.step);
                  }
                  // Handle streaming content based on mode
                  if (mode === "study" && event.data?.currentHint) {
                    appendStreamingContent(event.data.currentHint);
                  } else if (mode === "power" && event.data?.fullExplanation) {
                    appendStreamingContent(event.data.fullExplanation);
                  }
                  break;

                case "complete":
                  console.log("Session completed:", event);
                  break;

                case "error":
                  setError(event.error);
                  break;
              }
            } catch (e) {
              console.error("Failed to parse event:", line);
            }
          }
        }
      }
    } catch (err) {
      console.error("Session error:", err);
      setError(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [
    mode,
    problemName,
    code,
    question,
    addFlowStep,
    appendStreamingContent,
    clearStreamingContent,
    setError,
    setLoading,
    setStreaming,
  ]);

  const handleReset = () => {
    resetSession();
    setQuestion("");
  };

  // Render study mode content
  const renderStudyMode = () => {
    if (!mode) return null;

    return (
      <div className="flex flex-col gap-4">
        {/* Hint Display */}
        {hints.length > 0 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-400">
                Hint {currentHintLevel - 1} of 5
              </span>
              {currentHintLevel > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartSession}
                  disabled={isLoading || currentHintLevel > 5}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Next Hint
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-300">{hints[hints.length - 1]}</p>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${Math.min((currentHintLevel - 1) * 20, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-slate-500">
            {Math.min(currentHintLevel - 1, 5)}/5
          </span>
        </div>
      </div>
    );
  };

  // Render power mode content
  const renderPowerMode = () => {
    if (!mode) return null;

    return (
      <div className="flex flex-col gap-4">
        {/* Strategy Selection */}
        {strategies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Strategies</h4>
            <div className="grid gap-2">
              {strategies.map((strategy, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStrategy?.name === strategy.name
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">
                      {strategy.name}
                    </span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-yellow-500">
                        {strategy.timeComplexity}
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-blue-500">
                        {strategy.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {strategy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Code */}
        {generatedCode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Solution</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(generatedCode)}
              >
                Copy Code
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto">
              <code className="text-sm font-mono text-slate-300">
                {generatedCode}
              </code>
            </pre>
          </div>
        )}

        {/* Complexity Analysis */}
        {(complexityAnalysis.time || complexityAnalysis.space) && (
          <div className="flex gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            {complexityAnalysis.time && (
              <div>
                <span className="text-xs text-slate-500">Time</span>
                <p className="text-sm font-medium text-yellow-500">
                  {complexityAnalysis.time}
                </p>
              </div>
            )}
            {complexityAnalysis.space && (
              <div>
                <span className="text-xs text-slate-500">Space</span>
                <p className="text-sm font-medium text-blue-500">
                  {complexityAnalysis.space}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Test Results */}
        {testResults.feedback && (
          <div
            className={`p-3 rounded-lg border ${
              testResults.passed
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  testResults.passed ? "text-green-400" : "text-red-400"
                }`}
              >
                {testResults.passed ? "Tests Passed" : "Issues Found"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {testResults.feedback.slice(0, 200)}...
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={panelRef} className="flex h-full flex-col p-6">
      {/* Multi-Mode Interface */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">
            LeetCode Assistant
          </h2>
          {(mode || problemName) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-200"
            >
              Reset
            </Button>
          )}
        </div>

        <ModeSelector />

        {mode && (
          <>
            <ProblemInput />

            {/* Start Button */}
            {problemName && (
              <Button
                onClick={handleStartSession}
                disabled={isLoading || isStreaming}
                className={`w-full ${
                  mode === "study"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white`}
              >
                {isLoading || isStreaming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isStreaming ? "Processing..." : "Starting..."}
                  </>
                ) : (
                  <>
                    {mode === "study"
                      ? "Start Study Session"
                      : "Generate Solution"}
                  </>
                )}
              </Button>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Flow Steps */}
            {flow.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {flow.map((step, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-slate-700 rounded text-slate-400"
                  >
                    {step}
                  </span>
                ))}
              </div>
            )}

            {/* Mode-specific Panels */}
            {mode === "study" ? renderStudyMode() : renderPowerMode()}
          </>
        )}
      </div>

      {/* Streaming Content Display */}
      {isStreaming && streamingContent && (
        <section className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            <span className="text-sm text-slate-400">Processing...</span>
          </div>
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {streamingContent}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
};

export default RightPanel;
