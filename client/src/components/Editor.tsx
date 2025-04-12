import { useState, useEffect } from "react";
import { File } from "@shared/schema";
import EditorTabs from "./EditorTabs";
import MonacoEditor from "./ui/monaco-editor";
import StatusBar from "./StatusBar";

interface EditorProps {
  files: File[];
  activeFileId: number | null;
  onFileSelect: (fileId: number) => void;
  onFileClose: (fileId: number) => void;
  onContentChange: (fileId: number, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onFileClose,
  onContentChange
}) => {
  const [position, setPosition] = useState({ line: 1, column: 1 });
  const [language, setLanguage] = useState("javascript");
  
  const activeFile = files.find(file => file.id === activeFileId);
  
  useEffect(() => {
    if (activeFile) {
      // Determine language based on file extension
      const extension = activeFile.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'js':
          setLanguage('javascript');
          break;
        case 'jsx':
          setLanguage('javascript');
          break;
        case 'ts':
          setLanguage('typescript');
          break;
        case 'tsx':
          setLanguage('typescript');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'html':
          setLanguage('html');
          break;
        case 'json':
          setLanguage('json');
          break;
        case 'md':
          setLanguage('markdown');
          break;
        default:
          setLanguage('plaintext');
      }
    }
  }, [activeFile]);
  
  const handlePositionChange = (line: number, column: number) => {
    setPosition({ line, column });
  };
  
  return (
    <div className="h-full flex flex-col bg-background">
      <EditorTabs 
        files={files} 
        activeFileId={activeFileId} 
        onSelect={onFileSelect} 
        onClose={onFileClose} 
      />
      
      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <MonacoEditor
            value={activeFile.content}
            language={language}
            onChange={(value) => onContentChange(activeFile.id, value)}
            onPositionChange={handlePositionChange}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No file is open</p>
              <p className="text-sm mt-2">Open a file from the file explorer</p>
            </div>
          </div>
        )}
      </div>
      
      <StatusBar 
        position={position}
        language={language}
        indentation="Spaces: 2"
        encoding="UTF-8"
      />
    </div>
  );
};

export default Editor;
