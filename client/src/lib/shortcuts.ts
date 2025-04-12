import { useEffect } from "react";

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: ShortcutHandler;
}

/**
 * Register keyboard shortcuts
 * @param shortcuts Array of shortcut configurations
 */
export const useShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !shortcut.ctrlKey || e.ctrlKey;
        const shiftMatches = !shortcut.shiftKey || e.shiftKey;
        const altMatches = !shortcut.altKey || e.altKey;
        const metaMatches = !shortcut.metaKey || e.metaKey;
        
        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          e.preventDefault();
          shortcut.handler(e);
          break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

// Common shortcut combinations
export const SHORTCUTS = {
  SAVE: { key: 's', ctrlKey: true },
  FIND: { key: 'f', ctrlKey: true },
  REPLACE: { key: 'h', ctrlKey: true },
  FORMAT: { key: 'f', altKey: true, shiftKey: true },
  COMMAND_PALETTE: { key: 'p', ctrlKey: true, shiftKey: true },
  QUICK_OPEN: { key: 'p', ctrlKey: true },
  NEW_TERMINAL: { key: '`', ctrlKey: true },
  OPEN_AI_CHAT: { key: 'a', ctrlKey: true, shiftKey: true },
  EXPLAIN_CODE: { key: 'e', ctrlKey: true, shiftKey: true },
  GENERATE_TESTS: { key: 't', ctrlKey: true, shiftKey: true },
};
