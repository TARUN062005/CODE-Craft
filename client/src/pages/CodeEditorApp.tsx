import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import FileExplorer from "@/components/FileExplorer";
import Editor from "@/components/Editor";
import Sidebar from "@/components/Sidebar";
import ShortcutHelp from "@/components/ShortcutHelp";
import AIChatFab from "@/components/AIChatFab";
import { useQuery } from "@tanstack/react-query";
import { File } from "@shared/schema";

export default function CodeEditorApp() {
  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [openFiles, setOpenFiles] = useState<File[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal");

  // Fetch all files
  const { data: files, isLoading } = useQuery<File[]>({
    queryKey: ["/api/files?projectId=1"],
    initialData: [] // Initialize with empty array to avoid type errors
  });
  
  // Log files when they change
  useEffect(() => {
    console.log("Files from query:", files);
  }, [files]);

  useEffect(() => {
    if (files && files.length > 0 && !activeFileId) {
      // Find index.js file and set it as active by default
      const indexFile = files.find((file: File) => file.name === "index.js" && !file.isFolder);
      if (indexFile) {
        handleFileOpen(indexFile);
      }
    }
  }, [files, activeFileId]);

  // Handle file opening
  const handleFileOpen = (file: File) => {
    if (file.isFolder) return;
    
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    
    setActiveFileId(file.id);
  };

  // Handle file close
  const handleFileClose = (fileId: number) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (activeFileId === fileId) {
      setActiveFileId(openFiles.length > 1 ? 
        openFiles[openFiles.findIndex(f => f.id === fileId) - 1]?.id || null : 
        null);
    }
  };

  // Handle file content change
  const handleFileContentChange = (fileId: number, content: string) => {
    // Update file content - would be connected to API in a full implementation
    console.log(`File ${fileId} content changed`);
  };

  const toggleShortcuts = () => {
    setShowShortcuts(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-editor-bg text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header/Menu Bar */}
      <header className="flex items-center h-10 bg-muted/50 px-4 border-b border-border">
        <div className="flex items-center space-x-2 text-sm">
          <button className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" title="File">File</button>
          <button className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" title="Edit">Edit</button>
          <button className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" title="View">View</button>
          <button className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" title="Run">Run</button>
          <button className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" title="Terminal">Terminal</button>
          <button 
            className="px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded" 
            title="Help"
            onClick={toggleShortcuts}
          >
            Help
          </button>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded" title="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded" title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer files={files || []} onFileOpen={handleFileOpen} activeFileId={activeFileId} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Main Editor with Terminal at bottom */}
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor Area */}
              <ResizablePanel defaultSize={75} minSize={30}>
                <Editor 
                  files={openFiles}
                  activeFileId={activeFileId} 
                  onFileSelect={setActiveFileId} 
                  onFileClose={handleFileClose}
                  onContentChange={handleFileContentChange}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Terminal Panel at Bottom */}
              <ResizablePanel defaultSize={25} minSize={10} maxSize={50}>
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userId={1} projectId={1} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Shortcut help dialog */}
      {showShortcuts && <ShortcutHelp onClose={() => setShowShortcuts(false)} />}
      
      {/* AI Chat FAB */}
      <AIChatFab userId={1} projectId={1} />
    </div>
  );
}
