import { useEffect, useRef } from "react";
import monaco from "@/lib/monaco-setup";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onPositionChange?: (line: number, column: number) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onPositionChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      try {
        // Initialize Monaco editor with simplified options
        editorRef.current = monaco.editor.create(containerRef.current, {
          value,
          language,
          theme: 'vs-dark-custom',
          automaticLayout: true,
          minimap: {
            enabled: true
          },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'off'
        });
        
        // Set up event listeners
        editorRef.current.onDidChangeModelContent(() => {
          onChange(editorRef.current?.getValue() || '');
        });
        
        if (onPositionChange) {
          editorRef.current.onDidChangeCursorPosition(e => {
            onPositionChange(e.position.lineNumber, e.position.column);
          });
        }
      } catch (err) {
        console.error("Failed to create editor:", err);
      }
    }
    
    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  // Update value when it changes from outside
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Update language when it changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default MonacoEditor;
