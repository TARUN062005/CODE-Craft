import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFileSchema, insertAiChatSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for files
  app.get("/api/files", async (req, res) => {
    try {
      const projectId = Number(req.query.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const files = await storage.getFilesByProjectId(projectId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      console.log("POST /api/files - Request body:", req.body);
      const fileData = insertFileSchema.parse(req.body);
      console.log("POST /api/files - Validated data:", fileData);
      
      const newFile = await storage.createFile(fileData);
      console.log("POST /api/files - Created file:", newFile);
      
      res.status(201).json(newFile);
    } catch (error) {
      console.error("POST /api/files - Error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid file data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create file" });
    }
  });

  app.put("/api/files/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const fileData = req.body;
      
      const updatedFile = await storage.updateFile(id, fileData);
      if (!updatedFile) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.json(updatedFile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteFile(id);
      
      if (!success) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const chatData = insertAiChatSchema.parse(req.body);
      const newChat = await storage.createAiChat(chatData);
      
      // Use OpenAI for generating AI responses
      let response;
      try {
        // Import OpenAI in a way compatible with ESM
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are an AI coding assistant integrated into a web-based code editor. Provide helpful, concise answers about programming concepts, debugging help, and coding best practices. When providing code examples, use markdown code blocks with appropriate language syntax highlighting."
            },
            { 
              role: "user", 
              content: chatData.message 
            }
          ],
          max_tokens: 1000,
        });
        
        response = completion.choices[0].message.content;
      } catch (error: any) {
        console.error("OpenAI API error:", error);
        const errorMessage = error?.message || 'Unknown error';
        response = `I apologize, but I couldn't process your request due to an API error. Please try again or check the API connection. Error details: ${errorMessage}`;
      }
      
      const updatedChat = await storage.updateAiChatResponse(newChat.id, response || 'No response received');
      res.status(201).json(updatedChat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process AI chat request" });
    }
  });

  app.get("/api/ai/chat", async (req, res) => {
    try {
      const projectId = req.query.projectId ? Number(req.query.projectId) : undefined;
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      
      if (projectId) {
        const chats = await storage.getAiChatsByProjectId(projectId);
        return res.json(chats);
      } else if (userId) {
        const chats = await storage.getAiChatsByUserId(userId);
        return res.json(chats);
      } else {
        return res.status(400).json({ message: "Missing projectId or userId parameter" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
