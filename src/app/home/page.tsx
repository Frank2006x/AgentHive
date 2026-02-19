"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCodeStore } from "@/store/codeStore";
import { BookOpen, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LanguageKey =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "cpp"
  | "rust"
  | "go";

const HomePage = () => {
  const router = useRouter();
  const { setProblemName, setLanguage, lockProblem, setProblemData, setMode } =
    useCodeStore();

  const [inputValue, setInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>("python");
  const [isValidating, setIsValidating] = useState(false);

  const languages: { value: LanguageKey; label: string }[] = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "rust", label: "Rust" },
    { value: "go", label: "Go" },
  ];

  const normalizeProblemName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const validateProblem = async (problemName: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/leetcode/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemName,
          code: "",
          language: selectedLanguage,
          question: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data?.problemStatement) {
        throw new Error("Problem not found");
      }

      // Store problem data
      setProblemData({
        statement: result.data.problemStatement,
        difficulty: result.data.difficulty,
        category: result.data.category,
        examples: result.data.examples,
        constraints: result.data.constraints,
      });

      return true;
    } catch (error) {
      console.error("Problem validation error:", error);
      return false;
    }
  };

  const handleModeSelect = async (mode: "study" | "power") => {
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
      const isValid = await validateProblem(normalized);

      if (!isValid) {
        toast.error("Problem not found. Check the name and try again.");
        return;
      }

      // Set problem details and navigate
      setProblemName(normalized);
      setLanguage(selectedLanguage);
      lockProblem();
      setMode(mode);

      toast.success(`Problem loaded: ${normalized}`);

      if (mode === "study") {
        router.push("/study");
      } else {
        // Power mode - coming soon
        toast.info("Power mode coming soon!");
      }
    } catch (error) {
      console.error("Error selecting mode:", error);
      toast.error("Failed to load problem. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Select Your Learning Mode
          </h1>
          <p className="text-slate-400">
            Enter a LeetCode problem and choose how you want to learn
          </p>
        </div>

        {/* Problem Input Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
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
              placeholder='e.g., "two-sum", "reverse-linked-list"'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isValidating}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Use the LeetCode problem slug (lowercase with hyphens)
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="language"
              className="text-sm font-medium text-slate-300"
            >
              Programming Language
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) =>
                setSelectedLanguage(value as LanguageKey)
              }
              disabled={isValidating}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Study Mode Card */}
          <button
            onClick={() => handleModeSelect("study")}
            disabled={isValidating}
            className="group bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/30 hover:border-blue-500 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                {isValidating ? (
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                ) : (
                  <BookOpen className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-semibold text-slate-100">
                  Study Mode
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Interactive chat-based tutoring with guided discovery. Ask
                  questions, get hints, and learn at your own pace.
                </p>
              </div>
            </div>
          </button>

          {/* Power Mode Card */}
          <button
            onClick={() => handleModeSelect("power")}
            disabled={isValidating}
            className="group bg-slate-800/50 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/30 transition-colors">
                {isValidating ? (
                  <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                ) : (
                  <Zap className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-semibold text-slate-100">
                  Power Mode
                  <span className="ml-2 text-xs text-yellow-400 font-normal">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Instant solution generation with strategy comparison,
                  complexity analysis, and optimized code.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-center text-sm text-slate-500">
          <p>
            New to LeetCode?{" "}
            <a
              href="https://leetcode.com/problemset/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Browse problems
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
