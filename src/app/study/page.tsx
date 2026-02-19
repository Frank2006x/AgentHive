"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RightPanel from "@/components/RightPanel";
import LeftPanel from "@/components/LeftPanel";
import { useCodeStore } from "@/store/codeStore";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const StudyPage = () => {
  const router = useRouter();
  const { problemName, mode, setMode } = useCodeStore();

  useEffect(() => {
    // Redirect to home if no problem is selected
    if (!problemName) {
      router.push("/home");
      return;
    }

    // Set mode to study if not already set
    if (mode !== "study") {
      setMode("study");
    }
  }, [problemName, mode, setMode, router]);

  // Show loading state while checking/redirecting
  if (!problemName) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-w-md rounded-lg border md:min-w-screen"
    >
      <ResizablePanel defaultSize={60} className="overflow-hidden">
        <LeftPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={40}
        minSize={25}
        maxSize={50}
        className="overflow-hidden"
      >
        <RightPanel hideMode={true} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default StudyPage;
