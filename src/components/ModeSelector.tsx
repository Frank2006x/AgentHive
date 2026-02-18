"use client";

import { BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeStore, Mode } from "@/store/codeStore";

interface ModeSelectorProps {
  className?: string;
}

export function ModeSelector({ className }: ModeSelectorProps) {
  const { mode, setMode } = useCodeStore();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-slate-300">
        Select Learning Mode
      </label>
      <div className="grid grid-cols-2 gap-2">
        {/* Study Mode Button */}
        <button
          onClick={() => setMode("study")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
            mode === "study"
              ? "border-blue-500 bg-blue-500/10 text-blue-400"
              : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800",
          )}
        >
          <BookOpen className="w-6 h-6" />
          <div className="text-center">
            <div className="font-semibold text-sm">Study Mode</div>
            <div className="text-xs opacity-70 mt-1">
              Interactive chat tutoring
            </div>
          </div>
        </button>

        {/* Power Mode Button */}
        <button
          onClick={() => setMode("power")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
            mode === "power"
              ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
              : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800",
          )}
        >
          <Zap className="w-6 h-6" />
          <div className="text-center">
            <div className="font-semibold text-sm">Power Mode</div>
            <div className="text-xs opacity-70 mt-1">
              Direct solution generation
            </div>
          </div>
        </button>
      </div>

      {/* Mode Description */}
      {mode && (
        <div
          className={cn(
            "text-xs p-3 rounded-lg mt-2",
            mode === "study"
              ? "bg-blue-500/5 text-blue-300 border border-blue-500/20"
              : "bg-yellow-500/5 text-yellow-300 border border-yellow-500/20",
          )}
        >
          {mode === "study" ? (
            <>
              <strong>Study Mode:</strong> Learn through interactive chat-based
              tutoring and guided discovery. Perfect for understanding the
              problem deeply.
            </>
          ) : (
            <>
              <strong>Power Mode:</strong> Get complete solutions with multiple
              strategies, complexity analysis, and detailed explanations.
            </>
          )}
        </div>
      )}
    </div>
  );
}
