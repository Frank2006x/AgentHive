"use client";

import { useState } from "react";
import { Zap, Loader2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCodeStore } from "@/store/codeStore";
import { toast } from "sonner";

interface CodeComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CodeComparisonDialog({
  open,
  onOpenChange,
}: CodeComparisonDialogProps) {
  const {
    code,
    language,
    problemName,
    generatedCode,
    complexityAnalysis,
    explanation,
    isLoading,
    setLoading,
    setGeneratedCode,
    setComplexityAnalysis,
    setExplanation,
    setError,
  } = useCodeStore();

  const [copied, setCopied] = useState(false);

  const handleGeneratePowerSolution = async () => {
    if (!problemName) {
      toast.error("Please select a problem first");
      return;
    }

    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leetcode/power", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemName,
          userCode: code,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate solution");
      }

      setGeneratedCode(result.data.finalCode || "");
      setComplexityAnalysis(
        result.data.complexityAnalysis || { time: "", space: "" },
      );
      setExplanation(result.data.fullExplanation || "");

      toast.success("Solution generated successfully!");
    } catch (error) {
      console.error("Power mode error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate solution",
      );
      toast.error("Failed to generate solution");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOptimized = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success("Optimized code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const beforeCode = code || "# Write your code here";
  const afterCode = generatedCode || "# Generating optimized solution...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Code Optimization - Power Mode
          </DialogTitle>
          <DialogDescription>
            Compare your code with an AI-generated optimized solution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Generate Button */}
          {!generatedCode && !isLoading && (
            <div className="flex justify-center py-4">
              <Button
                onClick={handleGeneratePowerSolution}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Optimized Solution
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
              <p className="text-sm text-slate-400">
                Analyzing your code and generating optimized solution...
              </p>
            </div>
          )}

          {/* Code Comparison */}
          {generatedCode && !isLoading && (
            <>
              {/* Simple side-by-side comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Before (User Code) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-semibold text-slate-300">
                      Your Code
                    </h3>
                    <span className="text-xs text-slate-500">Before</span>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900">
                    <pre className="p-4 overflow-x-auto text-xs font-mono">
                      <code className="text-slate-300">{beforeCode}</code>
                    </pre>
                  </div>
                </div>

                {/* After (Optimized Code) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-semibold text-yellow-400">
                      Optimized Solution
                    </h3>
                    <span className="text-xs text-slate-500">After</span>
                  </div>
                  <div className="rounded-lg border border-yellow-500/30 bg-slate-900">
                    <pre className="p-4 overflow-x-auto text-xs font-mono">
                      <code className="text-slate-300">{afterCode}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Complexity Analysis */}
              {(complexityAnalysis.time || complexityAnalysis.space) && (
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3">
                    ⚡ Complexity Analysis
                  </h3>
                  <div className="flex gap-6">
                    {complexityAnalysis.time && (
                      <div>
                        <span className="text-xs text-slate-500">
                          Time Complexity
                        </span>
                        <p className="text-sm font-medium text-yellow-400">
                          {complexityAnalysis.time}
                        </p>
                      </div>
                    )}
                    {complexityAnalysis.space && (
                      <div>
                        <span className="text-xs text-slate-500">
                          Space Complexity
                        </span>
                        <p className="text-sm font-medium text-blue-400">
                          {complexityAnalysis.space}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {explanation && (
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">
                    📖 Explanation
                  </h3>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {explanation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCopyOptimized}
                  className="border-slate-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Optimized Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
