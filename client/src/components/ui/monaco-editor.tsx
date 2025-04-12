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
      // Initialize Monaco editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: true
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, monospace',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        renderLineHighlight: 'all',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10
        },
        lineNumbersMinChars: 3,
        renderValidationDecorations: "on",
        wordWrap: 'off',
        contextmenu: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        snippetSuggestions: 'inline',
        bracketPairColorization: {
          enabled: true
        }
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
      
      // Set up intellisense
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          
          // Very basic suggestions
          return {
            suggestions: [
              {
                label: 'function',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'function ${1:name}(${2:params}) {\n\t${0}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range
              },
              {
                label: 'if',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'if (${1:condition}) {\n\t${0}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range
              },
              {
                label: 'console.log',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'console.log(${1:value});',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range
              },
              {
                label: 'import',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'import ${2:{ $3 }} from \'${1:module}\';',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range
              },
              {
                label: 'const',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'const ${1:name} = ${2:value};',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range
              }
            ]
          };
        }
      });
      
      // Set up keyboard shortcuts
      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        console.log('Save command triggered');
        // Implement save functionality
      });
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
