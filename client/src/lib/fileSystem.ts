import { File } from "@shared/schema";
import { apiRequest } from "./queryClient";

export interface FileSystem {
  getFiles: (projectId: number) => Promise<File[]>;
  getFile: (fileId: number) => Promise<File>;
  createFile: (file: Partial<File>) => Promise<File>;
  updateFile: (fileId: number, content: string) => Promise<File>;
  deleteFile: (fileId: number) => Promise<boolean>;
  getProjectFiles: (projectId: number) => Promise<File[]>;
}

export const fileSystem: FileSystem = {
  async getFiles(projectId: number): Promise<File[]> {
    const response = await fetch(`/api/files?projectId=${projectId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  },
  
  async getFile(fileId: number): Promise<File> {
    const response = await fetch(`/api/files/${fileId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }
    
    return response.json();
  },
  
  async createFile(file: Partial<File>): Promise<File> {
    const response = await apiRequest('POST', '/api/files', file);
    return response.json();
  },
  
  async updateFile(fileId: number, content: string): Promise<File> {
    const response = await apiRequest('PUT', `/api/files/${fileId}`, { content });
    return response.json();
  },
  
  async deleteFile(fileId: number): Promise<boolean> {
    await apiRequest('DELETE', `/api/files/${fileId}`);
    return true;
  },
  
  async getProjectFiles(projectId: number): Promise<File[]> {
    return this.getFiles(projectId);
  }
};

export const getFileLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    default:
      return 'plaintext';
  }
};
