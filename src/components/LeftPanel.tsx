
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const { code, setCode, setLanguage } = useCodeStore();

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

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex items-center gap-3 flex-shrink-0">
        <label className="text-sm text-muted-foreground">Language</label>
        <Select
          value={lang}
          onValueChange={(value) => {
            setLang(value as LanguageKey);
            setLanguage(value as LanguageKey);
          }}
        >
          <SelectTrigger className="w-[180px]">
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
