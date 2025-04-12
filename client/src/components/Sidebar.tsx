import TerminalPanel from "./TerminalPanel";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userId: number;
  projectId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  return (
    <div className="h-full flex flex-col bg-background border-t border-border">
      <div className="flex text-sm border-b border-border">
        <button 
          className={`py-2 px-4 ${activeTab === "terminal" ? "bg-primary/10 border-b-2 border-primary text-primary font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}
          onClick={() => onTabChange("terminal")}
        >
          Terminal
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === "problems" ? "bg-primary/10 border-b-2 border-primary text-primary font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}
          onClick={() => onTabChange("problems")}
        >
          Problems
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === "output" ? "bg-primary/10 border-b-2 border-primary text-primary font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}
          onClick={() => onTabChange("output")}
        >
          Output
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === "terminal" && <TerminalPanel />}
        {activeTab === "problems" && (
          <div className="p-4 text-sm">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
              <span>No problems detected in workspace</span>
            </div>
          </div>
        )}
        {activeTab === "output" && (
          <div className="p-4 text-sm">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>No output to display</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
