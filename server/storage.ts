import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  files, type File, type InsertFile,
  aiChats, type AiChat, type InsertAiChat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.count > 0;
  }

  // File methods
  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFilesByProjectId(projectId: number): Promise<File[]> {
    return await db.select().from(files).where(eq(files.projectId, projectId));
  }

  async getFilesByParentId(parentId: number | null): Promise<File[]> {
    if (parentId === null) {
      return await db.select().from(files).where(eq(files.parentId, null));
    }
    return await db.select().from(files).where(eq(files.parentId, parentId));
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }

  async updateFile(id: number, fileUpdate: Partial<File>): Promise<File | undefined> {
    const [updatedFile] = await db
      .update(files)
      .set(fileUpdate)
      .where(eq(files.id, id))
      .returning();
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return result.count > 0;
  }

  // AI Chat methods
  async getAiChat(id: number): Promise<AiChat | undefined> {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.id, id));
    return chat;
  }

  async getAiChatsByUserId(userId: number): Promise<AiChat[]> {
    return await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.userId, userId))
      .orderBy(desc(aiChats.createdAt));
  }

  async getAiChatsByProjectId(projectId: number): Promise<AiChat[]> {
    return await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.projectId, projectId))
      .orderBy(desc(aiChats.createdAt));
  }

  async createAiChat(insertChat: InsertAiChat): Promise<AiChat> {
    const [chat] = await db.insert(aiChats).values(insertChat).returning();
    return chat;
  }

  async updateAiChatResponse(id: number, response: string): Promise<AiChat | undefined> {
    const [updatedChat] = await db
      .update(aiChats)
      .set({ response })
      .where(eq(aiChats.id, id))
      .returning();
    return updatedChat;
  }
}

// Initialize the database storage as the default storage provider
export const storage = new DatabaseStorage();
