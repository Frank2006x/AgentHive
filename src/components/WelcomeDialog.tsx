"use client";

import { useState } from "react";
import { useCodeStore } from "@/store/codeStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function WelcomeDialog() {
  const { problemName, problemLocked, setProblemName, lockProblem } =
    useCodeStore();
  const [inputValue, setInputValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Dialog is open when there's no problem name and it's not locked
  const isOpen = problemName === "" && !problemLocked;

  const normalizeProblemName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error("Please enter a problem name");
      return;
    }

    const normalized = normalizeProblemName(inputValue);

    if (!normalized) {
      toast.error("Invalid problem name format");
      return;
    }

    setIsValidating(true);

    try {
      // Validate by trying to fetch the problem
      const response = await fetch("/api/leetcode/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemName: normalized,
          code: "",
          language: "python",
          question: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load problem");
      }

      // Check if problem was actually fetched successfully
      // If problemStatement is missing or empty, the fetch failed
      if (
        !result.data?.problemStatement ||
        result.data.problemStatement.trim() === ""
      ) {
        throw new Error("Problem not found or invalid problem name");
      }

      // Check for error messages in the response
      if (result.data?.messages?.some((msg: string) => msg.includes("Error"))) {
        throw new Error("Problem not found on LeetCode");
      }

      // Success - update store and lock problem
      setProblemName(normalized);
      lockProblem();
      toast.success(`Problem loaded: ${normalized}`);
      setInputValue("");
    } catch (error) {
      console.error("Problem validation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Problem not found. Check the name and try again.";
      toast.error(errorMessage);
      // Keep dialog open and clear the input so user can try again
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isValidating) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to AgentHive! 🐝
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Enter a LeetCode problem name to begin your learning session.
            <br />
            <span className="text-slate-500 text-sm mt-2 block">
              Example: &quot;two-sum&quot;, &quot;reverse linked list&quot;, or
              &quot;valid parentheses&quot;
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label
              htmlFor="problem-name"
              className="text-sm font-medium text-slate-300"
            >
              Problem Name
            </label>
            <Input
              id="problem-name"
              type="text"
              placeholder="Enter problem name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isValidating}
              className="w-full"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!inputValue.trim() || isValidating}
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Start Session"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
