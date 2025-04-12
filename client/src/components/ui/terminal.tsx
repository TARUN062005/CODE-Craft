import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

interface XTerminalProps {
  initialText?: string;
}

const XTerminal: React.FC<XTerminalProps> = ({ initialText = '' }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    terminalInstance.current = new Terminal({
      cursorBlink: true,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc',
        cursor: '#ffffff',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#f44336',
        green: '#4caf50',
        yellow: '#ff9800',
        blue: '#2196f3',
        magenta: '#9c27b0',
        cyan: '#00bcd4',
        white: '#e0e0e0',
        brightBlack: '#757575',
        brightRed: '#f77066',
        brightGreen: '#7bc47f',
        brightYellow: '#ffc046',
        brightBlue: '#64b5f6',
        brightMagenta: '#ba68c8',
        brightCyan: '#4dd0e1',
        brightWhite: '#ffffff'
      }
    });

    // Add fit addon for responsive resizing
    fitAddon.current = new FitAddon();
    terminalInstance.current.loadAddon(fitAddon.current);

    // Open terminal in the div
    terminalInstance.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Display initial text
    if (initialText) {
      terminalInstance.current.writeln(initialText);
    }

    // Default prompt
    terminalInstance.current.write('$ ');

    // Handle input
    terminalInstance.current.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.key === 'Enter') {
        terminalInstance.current?.writeln('');
        terminalInstance.current?.write('$ ');
      } else if (domEvent.key === 'Backspace') {
        // Do not delete past the prompt
        const cursorX = terminalInstance.current?.buffer.active.cursorX;
        if (cursorX && cursorX > 2) {
          terminalInstance.current?.write('\b \b');
        }
      } else if (printable) {
        terminalInstance.current?.write(key);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.current?.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminalInstance.current?.dispose();
    };
  }, [initialText]);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default XTerminal;
