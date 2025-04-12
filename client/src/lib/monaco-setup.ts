import * as monaco from 'monaco-editor';

// This is needed to prevent the error with monaco editor workers
self.MonacoEnvironment = {
  getWorkerUrl: function(_moduleId: string, label: string) {
    if (label === 'json') {
      return '/monaco-editor-workers/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/monaco-editor-workers/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/monaco-editor-workers/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco-editor-workers/ts.worker.js';
    }
    return '/monaco-editor-workers/editor.worker.js';
  }
};

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