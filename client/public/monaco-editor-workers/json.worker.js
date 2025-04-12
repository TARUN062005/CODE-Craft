/**
 * Monaco Editor JSON Web Worker
 * This provides JSON language services like validation and formatting.
 */
self.MonacoEnvironment = {
  baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
};

importScripts('https://unpkg.com/monaco-editor@latest/min/vs/language/json/jsonWorker.js');