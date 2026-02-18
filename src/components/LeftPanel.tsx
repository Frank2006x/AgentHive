"use client";

import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import type { Extension } from "@codemirror/state";
import { Search, Loader2, Code2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCodeStore } from "@/store/codeStore";

type LanguageKey =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "cpp"
  | "rust"
  | "go";

const languageExtensions: Record<LanguageKey, Extension> = {
  python: python(),
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  java: java(),
  cpp: cpp(),
  rust: rust(),
  go: go(),
};

const LeftPanel: React.FC = () => {
  const [lang, setLang] = useState<LanguageKey>("python");
  const [inputValue, setInputValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const {
    code,
    setCode,
    setLanguage,
    problemName,
    problemLocked,
    difficulty,
    category,
    setProblemName,
    setProblemData,
    isLoading,
    setLoading,
    setError,
  } = useCodeStore();

  const extensions = useMemo(() => {
    return [languageExtensions[lang]];
  }, [lang]);

  const languages: LanguageKey[] = [
    "python",
    "javascript",
    "typescript",
    "java",
    "cpp",
    "rust",
    "go",
  ];

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
      setProblemData({
        statement: "",
        difficulty: "",
        category: "",
      });

      // Simulate a brief loading for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch problem");
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isFetching && !isLoading) {
      handleFetchProblem();
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      {/* Header: Problem Input + Language Selector */}
      <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
        {/* Problem Input */}
        <div className="flex-1 min-w-[200px] flex gap-2">
          <div className="relative flex-1">
            <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={problemLocked ? problemName : inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., two-sum"
              className="pl-10 h-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
              disabled={problemLocked || isFetching || isLoading}
            />
          </div>
          {problemLocked ? (
            <div className="h-10 px-3 flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-md text-slate-400 text-sm">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Locked</span>
            </div>
          ) : (
            <Button
              onClick={handleFetchProblem}
              disabled={isFetching || isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-3"
              size="sm"
            >
              {isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-700" />

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400 whitespace-nowrap">
            Language
          </label>
          <Select
            value={lang}
            onValueChange={(value) => {
              setLang(value as LanguageKey);
              setLanguage(value as LanguageKey);
            }}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problem Preview */}
      {problemName && (
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Problem:</span>
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
                      "bg-red-500/20 text-red-400",
                  )}
                >
                  {difficulty}
                </span>
              )}
              {category && <span className="text-slate-500">{category}</span>}
            </div>
          )}
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 min-h-0 rounded-lg overflow-y-auto [scrollbar-color:lightblue_#111] scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-[#222]">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={(val: string) => setCode(val)}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
