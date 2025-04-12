interface ShortcutHelpProps {
  onClose: () => void;
}

const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-xl w-2/3 max-w-xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button className="text-muted-foreground hover:text-foreground" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">General</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Command Palette</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+P</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Quick Open</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+P</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Save File</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Editor</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Format Document</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift+Alt+F</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Find</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+F</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Replace</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+H</kbd>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Open AI Chat</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+A</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Explain Code</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+E</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Generate Tests</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+T</kbd>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Terminal</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>New Terminal</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+`</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Clear Terminal</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutHelp;
