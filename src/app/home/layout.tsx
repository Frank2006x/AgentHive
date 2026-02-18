import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <nav className="flex-shrink-0 w-full h-[8vh] bg-sidebar border-b-2 border-sidebar-border">
        <div className="text-white p-4">
          <h1 className="font-mono text-xl">AgentHive</h1>
        </div>
      </nav>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
};

export default Layout;
