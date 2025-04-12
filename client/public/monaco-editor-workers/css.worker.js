/**
 * Monaco Editor CSS Web Worker
 * This provides CSS language services like validation and formatting.
 */
self.MonacoEnvironment = {
  baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
};

importScripts('https://unpkg.com/monaco-editor@latest/min/vs/language/css/cssWorker.js');