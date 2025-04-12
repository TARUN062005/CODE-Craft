import * as monaco from 'monaco-editor';

// Monaco editor can function without web workers for basic use
// We'll disable the workers warnings and use the simpler built-in features
// This eliminates the errors while still allowing the editor to be functional

// Setup Monaco themes
monaco.editor.defineTheme('vs-dark-custom', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editor.lineHighlightBackground': '#2a2a2a',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#c6c6c6',
    'editorCursor.foreground': '#aeafad',
    'editor.selectionBackground': '#264f78',
    'editor.inactiveSelectionBackground': '#3a3d41',
    'editorWhitespace.foreground': '#3B3B3B',
  }
});

// Set default theme
monaco.editor.setTheme('vs-dark-custom');

export default monaco;