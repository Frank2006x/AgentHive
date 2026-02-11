"use client";

import { useState } from "react";
import { Search, Loader2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeStore } from "@/store/codeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProblemInputProps {
  className?: string;
}

export function ProblemInput({ className }: ProblemInputProps) {
  const {
    problemName,
    problemStatement,
    difficulty,
    category,
    setProblemName,
    setProblemData,
    isLoading,
    setLoading,
    setError,
  } = useCodeStore();

  const [inputValue, setInputValue] = useState(problemName);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchProblem = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a problem name");
      return;
    }

    setIsFetching(true);
    setLoading(true);
    setError(null);

    try {
      // Normalize the problem name (convert spaces to hyphens, lowercase)
      const normalizedName = inputValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      setProblemName(normalizedName);

      // Fetch problem data from our internal endpoint
      // For now, we'll just set the name and let the graph fetch the details
      // In a real implementation, you might want to fetch problem details immediately

      setProblemData({
        statement: "",
        difficulty: "",
        category: "",
      });

      // Simulate a brief loading for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch problem"
      );
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFetchProblem();
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-sm font-medium text-slate-300">
        Problem Name
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., two-sum or merge-intervals"
            className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
            disabled={isFetching || isLoading}
          />
        </div>
        <Button
          onClick={handleFetchProblem}
          disabled={isFetching || isLoading || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="ml-2 hidden sm:inline">Fetch</span>
        </Button>
      </div>

      {/* Problem Preview */}
      {problemName && (
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Selected:</span>
            <span className="font-mono text-blue-400">{problemName}</span>
          </div>
          {(difficulty || category) && (
            <div className="flex items-center gap-3 mt-2 text-xs">
              {difficulty && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-medium",
                    difficulty.toLowerCase() === "easy" &&
                      "bg-green-500/20 text-green-400",
                    difficulty.toLowerCase() === "medium" &&
                      "bg-yellow-500/20 text-yellow-400",
                    difficulty.toLowerCase() === "hard" &&
                      "bg-red-500/20 text-red-400"
                  )}
                >
                  {difficulty}
                </span>
              )}
              {category && (
                <span className="text-slate-500">{category}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Problem Statement Preview */}
      {problemStatement && (
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="text-xs text-slate-500 mb-1">Problem Statement</div>
          <p className="text-sm text-slate-300 line-clamp-3">
            {problemStatement}
          </p>
        </div>
      )}
    </div>
  );
}
