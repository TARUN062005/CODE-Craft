/**
 * Monaco Editor TypeScript Web Worker
 * This provides TypeScript/JavaScript language services like validation,
 * code completion, and type checking.
 */
self.MonacoEnvironment = {
  baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
};

importScripts('https://unpkg.com/monaco-editor@latest/min/vs/language/typescript/tsWorker.js');