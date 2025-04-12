import { useState, useRef } from "react";
import { File } from "@shared/schema";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface FileExplorerProps {
  files: File[];
  onFileOpen: (file: File) => void;
  activeFileId: number | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileOpen, activeFileId }) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  // Toggle folder collapsed state
  const toggleFolder = (path: string) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Get file icon based on file type
  const getFileIcon = (file: File) => {
    if (file.isFolder) {
      return collapsedFolders[file.path] 
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-500"><path d="m9 14 6-6"/><path d="m4 4 16 16"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-500"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-400"><path d="M12 19c0-4.2-2.8-7-7-7"/><path d="M5 19V5h14v5"/><path d="M15 19c3.3 0 6-2.7 6-6"/></svg>;
      case 'jsx':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-400"><path d="M12 19c0-4.2-2.8-7-7-7"/><path d="M5 19V5h14v5"/><path d="M15 19c3.3 0 6-2.7 6-6"/></svg>;
      case 'css':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-600"><path d="M20.9 18.55c.57-.1 1.1-.43 1.1-1.28 0-1.17-1.63-1.34-1.63-1.34s.93-.21.93-1.12c0-.84-.68-1.12-1.3-1.12-1.34 0-1.53 1.24-1.53 1.24l-1.47-.24s.29-2.26 3.07-2.26c1.65 0 3.93.71 3.93 2.81 0 1.15-.88 1.8-1.4 2.09.82.27 1.5.99 1.5 2.05 0 1.33-.93 2.7-3.44 2.7s-3.93-1.5-4.1-2.7l1.5-.24c.13 1.16 1.22 1.62 2.44 1.62 1.43 0 2-1 2-1.45 0-1.15-1.13-1.36-1.13-1.36s-1.37.01-2.5.01v-1.96h2.5l.03 1.55zM1 2h14v2H1zm1 6h9v2H2zm1 6h5v2H3z"/></svg>;
      case 'json':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-600"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 .56-1.37l5.57-5.56A2 2 0 0 1 9.62 1h4.76a2 2 0 0 1 1.49.62l5.57 5.56a2 2 0 0 1 .56 1.37Z"/><path d="M12 18v-7"/><path d="M8 15v3"/><path d="M16 15v3"/></svg>;
      case 'md':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-300"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2zm-7-8h2m-2 4h6"/></svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>;
    }
  };
  
  // Helper to organize files into a tree structure
  const organizeFiles = () => {
    const root: Record<string, any> = {};
    
    // First pass: create folder structure
    files.forEach(file => {
      if (file.isFolder) {
        root[file.path] = {
          ...file,
          children: {}
        };
      }
    });
    
    // Ensure "/" root exists
    if (!root['/']) {
      root['/'] = {
        id: 0,
        name: "my-project",
        path: '/',
        isFolder: true,
        children: {}
      };
    }
    
    // Second pass: populate files into folders
    files.forEach(file => {
      if (!file.isFolder) {
        // Extract parent path
        const pathParts = file.path.split('/');
        pathParts.pop(); // Remove filename
        const parentPath = pathParts.join('/') || '/';
        
        if (root[parentPath]) {
          root[parentPath].children[file.id] = file;
        } else {
          // If parent doesn't exist, add to root
          root['/'].children[file.id] = file;
        }
      }
    });
    
    return root;
  };
  
  const renderFileTree = (node: any, depth = 0) => {
    // If this is a file, render it
    if (!node.isFolder) {
      return (
        <div
          key={node.id}
          className={cn(
            "flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer",
            activeFileId === node.id && "bg-accent/30"
          )}
          style={{ paddingLeft: `${(depth + 1) * 8}px` }}
          onClick={() => onFileOpen(node)}
        >
          {getFileIcon(node)}
          <span className={cn(activeFileId === node.id ? "font-medium" : "font-normal")}>
            {node.name}
          </span>
        </div>
      );
    }
    
    // For folders, render folder and its children
    const isCollapsed = collapsedFolders[node.path];
    
    return (
      <div key={node.id || node.path}>
        <div
          className="flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer"
          style={{ paddingLeft: `${depth * 8}px` }}
          onClick={() => toggleFolder(node.path)}
        >
          {node.isFolder && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1 text-muted-foreground"
            >
              {isCollapsed ? (
                <path d="m9 18 6-6-6-6" />
              ) : (
                <path d="m6 9 6 6 6-6" />
              )}
            </svg>
          )}
          {getFileIcon(node)}
          <span className="font-medium">{node.name}</span>
        </div>
        
        {!isCollapsed && node.children && (
          <div>
            {Object.values(node.children).map((child: any) => renderFileTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // Handle creating a new file
  const handleCreateFile = async () => {
    setIsCreatingFile(true);
    setIsCreatingFolder(false);
    setCurrentPath("/");
    setNewItemName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Handle creating a new folder
  const handleCreateFolder = async () => {
    setIsCreatingFolder(true);
    setIsCreatingFile(false);
    setCurrentPath("/");
    setNewItemName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Handle canceling file/folder creation
  const handleCancelCreate = () => {
    setIsCreatingFile(false);
    setIsCreatingFolder(false);
    setNewItemName("");
  };

  // Handle submitting the file/folder creation
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim()) return;
    
    try {
      const newPath = currentPath === "/" 
        ? `/${newItemName}` 
        : `${currentPath}/${newItemName}`;
      
      const fileData = {
        name: newItemName,
        path: newPath,
        content: isCreatingFile ? "" : null,
        isFolder: isCreatingFolder,
        parentId: null, // We'll handle this properly in a production app
        projectId: 1 // Using a fixed project ID for simplicity
      };
      
      const response = await apiRequest("POST", "/api/files", fileData);
      
      if (response.ok) {
        // Invalidate the files query to refetch
        queryClient.invalidateQueries({ queryKey: ["/api/files?projectId=1"] });
        
        // Reset state
        setIsCreatingFile(false);
        setIsCreatingFolder(false);
        setNewItemName("");
      }
    } catch (error) {
      console.error("Error creating file/folder:", error);
    }
  };

  // Handle refreshing the file list
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/files?projectId=1"] });
  };

  // Handle collapsing all folders
  const handleCollapseAll = () => {
    const allPaths: Record<string, boolean> = {};
    files.forEach(file => {
      if (file.isFolder) {
        allPaths[file.path] = true;
      }
    });
    setCollapsedFolders(allPaths);
  };

  const fileTree = organizeFiles();
  
  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      <div className="p-3 text-sm font-semibold flex items-center justify-between">
        <span>EXPLORER</span>
        <div className="flex space-x-1">
          <button 
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-xs" 
            title="New File"
            onClick={handleCreateFile}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
          </button>
          <button 
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-xs" 
            title="New Folder"
            onClick={handleCreateFolder}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>
          </button>
          <button 
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-xs" 
            title="Refresh"
            onClick={handleRefresh}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </button>
          <button 
            className="p-1 hover:bg-accent hover:text-accent-foreground rounded text-xs" 
            title="Collapse All"
            onClick={handleCollapseAll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
          </button>
        </div>
      </div>
      
      {/* Create file/folder form */}
      {(isCreatingFile || isCreatingFolder) && (
        <div className="px-4 py-2 border-t border-border">
          <form onSubmit={handleSubmitCreate} className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 text-xs px-2 py-1 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={isCreatingFile ? "File name" : "Folder name"}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <button
              type="submit"
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Create
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 border border-border rounded hover:bg-accent hover:text-accent-foreground"
              onClick={handleCancelCreate}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-2 py-1 text-xs">
        {renderFileTree(fileTree['/'])}
      </div>
      
      <div className="mt-4 p-3 text-sm font-semibold border-t border-border">
        <span>OUTLINE</span>
      </div>
      
      <div className="px-2 py-1 text-xs">
        <div className="flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          <span>initApp()</span>
        </div>
        <div className="flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          <span>handleUserInput()</span>
        </div>
        <div className="flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          <span>renderUI()</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
