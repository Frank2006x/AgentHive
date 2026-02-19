"use client";
import { Toaster } from "sonner";
import { useCodeStore } from "@/store/codeStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const StudyLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { clearSession } = useCodeStore();

  const handleBackToHome = () => {
    clearSession();
    router.push("/home");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <nav className="flex-shrink-0 w-full h-[8vh] bg-sidebar border-b-2 border-sidebar-border">
        <div className="text-white p-4 flex justify-between items-center">
          <h1 className="font-mono text-xl">AgentHive - Study Mode</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            New Problem
          </Button>
        </div>
      </nav>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
};

export default StudyLayout;
