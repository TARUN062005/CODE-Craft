import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  userId: number;
  projectId: number;
}

const AIChat: React.FC<AIChatProps> = ({ userId, projectId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI coding assistant. How can I help you with your project today?"
    }
  ]);
  
  const queryClient = useQueryClient();
  
  // Chat history query
  const { data: chatHistory } = useQuery({
    queryKey: [`/api/ai/chat?projectId=${projectId}`],
  });
  
  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        userId,
        projectId
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add the AI response to the chat
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response
        }
      ]);
      
      // Clear the input field
      setInput("");
      
      // Invalidate chat history query
      queryClient.invalidateQueries({ queryKey: [`/api/ai/chat?projectId=${projectId}`] });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isPending) return;
    
    // Add the user message to the chat
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: input
      }
    ]);
    
    // Send the message to the API
    sendMessage(input);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start ${message.role === "assistant" ? "" : "justify-end"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
              )}
              
              <div className={`p-3 rounded-lg max-w-[85%] ${
                message.role === "assistant" 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Code snippets in assistant messages */}
                {message.role === "assistant" && message.content.includes("```") && (
                  <pre className="bg-background p-2 rounded mt-2 text-xs overflow-x-auto">
                    {message.content
                      .split("```")
                      .filter((_, i) => i % 2 === 1)
                      .join("\n")}
                  </pre>
                )}
              </div>
              
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
          ))}
          
          {isPending && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </div>
              <div className="p-3 rounded-lg bg-accent text-accent-foreground">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input 
            type="text" 
            placeholder="Ask something about your code..." 
            className="flex-1 bg-background border border-border rounded-l p-2 text-sm focus:outline-none focus:border-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPending}
          />
          <button 
            type="submit"
            className="bg-primary text-primary-foreground p-2 rounded-r flex items-center justify-center"
            disabled={isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
