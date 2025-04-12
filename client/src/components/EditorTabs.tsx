import { File } from "@shared/schema";
import { cn } from "@/lib/utils";

interface EditorTabsProps {
  files: File[];
  activeFileId: number | null;
  onSelect: (fileId: number) => void;
  onClose: (fileId: number) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  files,
  activeFileId,
  onSelect,
  onClose
}) => {
  const getFileIcon = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-400"><path d="M12 19c0-4.2-2.8-7-7-7"/><path d="M5 19V5h14v5"/><path d="M15 19c3.3 0 6-2.7 6-6"/></svg>;
      case 'jsx':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400"><path d="M12 19c0-4.2-2.8-7-7-7"/><path d="M5 19V5h14v5"/><path d="M15 19c3.3 0 6-2.7 6-6"/></svg>;
      case 'css':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600"><path d="M20.9 18.55c.57-.1 1.1-.43 1.1-1.28 0-1.17-1.63-1.34-1.63-1.34s.93-.21.93-1.12c0-.84-.68-1.12-1.3-1.12-1.34 0-1.53 1.24-1.53 1.24l-1.47-.24s.29-2.26 3.07-2.26c1.65 0 3.93.71 3.93 2.81 0 1.15-.88 1.8-1.4 2.09.82.27 1.5.99 1.5 2.05 0 1.33-.93 2.7-3.44 2.7s-3.93-1.5-4.1-2.7l1.5-.24c.13 1.16 1.22 1.62 2.44 1.62 1.43 0 2-1 2-1.45 0-1.15-1.13-1.36-1.13-1.36s-1.37.01-2.5.01v-1.96h2.5l.03 1.55zM1 2h14v2H1zm1 6h9v2H2zm1 6h5v2H3z"/></svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>;
    }
  };
  
  return (
    <div className="h-10 bg-background flex border-b border-border overflow-x-auto">
      <div className="flex">
        {files.map(file => (
          <div
            key={file.id}
            className={cn(
              "h-full flex items-center px-4 cursor-pointer relative",
              activeFileId === file.id 
                ? "bg-background border-b-2 border-primary text-primary"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
            onClick={() => onSelect(file.id)}
          >
            {getFileIcon(file)}
            <span className="text-sm whitespace-nowrap">{file.name}</span>
            <button 
              className="ml-2 p-1 rounded-sm hover:bg-muted/50"
              onClick={(e) => {
                e.stopPropagation();
                onClose(file.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorTabs;
