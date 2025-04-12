/**
 * Monaco Editor Web Worker
 * This is a pre-built worker file for the Monaco Editor.
 * It provides editor services for scenarios where dynamic loading
 * of workers isn't possible.
 */
self.MonacoEnvironment = {
  baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
};

importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');