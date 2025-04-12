import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  files, type File, type InsertFile,
  aiChats, type AiChat, type InsertAiChat
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // File methods
  getFile(id: number): Promise<File | undefined>;
  getFilesByProjectId(projectId: number): Promise<File[]>;
  getFilesByParentId(parentId: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, file: Partial<File>): Promise<File | undefined>;
  deleteFile(id: number): Promise<boolean>;
  
  // AI Chat methods
  getAiChat(id: number): Promise<AiChat | undefined>;
  getAiChatsByUserId(userId: number): Promise<AiChat[]>;
  getAiChatsByProjectId(projectId: number): Promise<AiChat[]>;
  createAiChat(chat: InsertAiChat): Promise<AiChat>;
  updateAiChatResponse(id: number, response: string): Promise<AiChat | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private files: Map<number, File>;
  private aiChats: Map<number, AiChat>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private fileIdCounter: number;
  private aiChatIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.files = new Map();
    this.aiChats = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.fileIdCounter = 1;
    this.aiChatIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Sample user
    const user: User = {
      id: this.userIdCounter++,
      username: "demo",
      password: "password"
    };
    this.users.set(user.id, user);
    
    // Sample project
    const project: Project = {
      id: this.projectIdCounter++,
      name: "my-project",
      description: "A sample project",
      userId: user.id
    };
    this.projects.set(project.id, project);
    
    // Sample folder structure
    const rootFolder: File = {
      id: this.fileIdCounter++,
      name: "src",
      content: "",
      path: "/src",
      isFolder: true,
      parentId: null,
      projectId: project.id
    };
    this.files.set(rootFolder.id, rootFolder);
    
    const files = [
      {
        id: this.fileIdCounter++,
        name: "index.js",
        content: `// Import modules
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Initialize application
function initApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
}

function handleUserInput(event) {
  // Implementation
}`,
        path: "/src/index.js",
        isFolder: false,
        parentId: rootFolder.id,
        projectId: project.id
      },
      {
        id: this.fileIdCounter++,
        name: "App.jsx",
        content: `import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="app">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;`,
        path: "/src/App.jsx",
        isFolder: false,
        parentId: rootFolder.id,
        projectId: project.id
      },
      {
        id: this.fileIdCounter++,
        name: "styles.css",
        content: `body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.app {
  padding: 20px;
}`,
        path: "/src/styles.css",
        isFolder: false,
        parentId: rootFolder.id,
        projectId: project.id
      }
    ];
    
    files.forEach(file => {
      this.files.set(file.id, file);
    });
    
    // Create components folder
    const componentsFolder: File = {
      id: this.fileIdCounter++,
      name: "components",
      content: "",
      path: "/components",
      isFolder: true,
      parentId: null,
      projectId: project.id
    };
    this.files.set(componentsFolder.id, componentsFolder);
    
    // Create utils folder
    const utilsFolder: File = {
      id: this.fileIdCounter++,
      name: "utils",
      content: "",
      path: "/utils",
      isFolder: true,
      parentId: null,
      projectId: project.id
    };
    this.files.set(utilsFolder.id, utilsFolder);
    
    // Add package.json
    const packageJson: File = {
      id: this.fileIdCounter++,
      name: "package.json",
      content: `{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}`,
      path: "/package.json",
      isFolder: false,
      parentId: null,
      projectId: project.id
    };
    this.files.set(packageJson.id, packageJson);
    
    // Add README.md
    const readme: File = {
      id: this.fileIdCounter++,
      name: "README.md",
      content: `# My Project

This is a sample project generated by AI Code Editor.`,
      path: "/README.md",
      isFolder: false,
      parentId: null,
      projectId: project.id
    };
    this.files.set(readme.id, readme);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // File methods
  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.projectId === projectId
    );
  }

  async getFilesByParentId(parentId: number | null): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.parentId === parentId
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileIdCounter++;
    const file: File = { ...insertFile, id };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: number, fileUpdate: Partial<File>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...fileUpdate };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }

  // AI Chat methods
  async getAiChat(id: number): Promise<AiChat | undefined> {
    return this.aiChats.get(id);
  }

  async getAiChatsByUserId(userId: number): Promise<AiChat[]> {
    return Array.from(this.aiChats.values())
      .filter((chat) => chat.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAiChatsByProjectId(projectId: number): Promise<AiChat[]> {
    return Array.from(this.aiChats.values())
      .filter((chat) => chat.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAiChat(insertChat: InsertAiChat): Promise<AiChat> {
    const id = this.aiChatIdCounter++;
    const chat: AiChat = { 
      ...insertChat, 
      id, 
      response: null, 
      createdAt: new Date() 
    };
    this.aiChats.set(id, chat);
    return chat;
  }

  async updateAiChatResponse(id: number, response: string): Promise<AiChat | undefined> {
    const chat = this.aiChats.get(id);
    if (!chat) return undefined;
    
    const updatedChat = { ...chat, response };
    this.aiChats.set(id, updatedChat);
    return updatedChat;
  }
}

export const storage = new MemStorage();
