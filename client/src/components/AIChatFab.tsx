import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import AIChat from "./AIChat";

interface AIChatFabProps {
  userId: number;
  projectId: number;
}

const AIChatFab: React.FC<AIChatFabProps> = ({ userId, projectId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="fixed right-6 bottom-20 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={() => setIsOpen(true)}
        title="AI Chat Assistant"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </button>

      {/* AI Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] h-[600px] p-0">
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>AI Chat Assistant</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100" />
          </DialogHeader>
          <div className="flex-1 overflow-hidden h-[calc(600px-54px)]">
            <AIChat userId={userId} projectId={projectId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatFab;