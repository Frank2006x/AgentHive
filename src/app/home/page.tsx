import RightPanel from "@/components/RightPanel";
import LeftPanel from "@/components/LeftPanel";
import WelcomeDialog from "@/components/WelcomeDialog";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const HomePage = () => {
  return (
    <>
      <WelcomeDialog />
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
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default HomePage;
