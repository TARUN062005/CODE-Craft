interface StatusBarProps {
  position: { line: number; column: number };
  language: string;
  indentation: string;
  encoding: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  position,
  language,
  indentation,
  encoding
}) => {
  return (
    <div className="h-6 bg-muted/30 text-xs font-mono flex items-center px-3 text-muted-foreground border-t border-border">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        <span>main</span>
      </div>
      <div className="flex items-center ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
        <span>0 ↓ 0 ↑</span>
      </div>
      <div className="flex items-center ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-500"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
        <span>0</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 mr-1 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <span>0</span>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div>Ln {position.line}, Col {position.column}</div>
        <div>{indentation}</div>
        <div>{encoding}</div>
        <div className="capitalize">{language}</div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m8 14 1.5-1.5c.83-.83 2.17-.83 3 0 .83.83.83 2.17 0 3L11 17"/><path d="m16 10-1.5 1.5c-.83.83-2.17.83-3 0-.83-.83-.83-2.17 0-3L13 7"/></svg>
          <span>AI Assistant</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
