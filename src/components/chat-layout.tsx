import Sidebar from "@/src/components/sidebar";
import ChatHeader from "@/src/components/chat-header";
import ChatArea from "@/src/components/chat-area";
import ChatInput from "@/src/components/chat-input";
import type { Message } from "@/types/chat";

interface ChatLayoutProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function ChatLayout({
  messages,
  onSendMessage,
  toggleSidebar,
  isSidebarOpen,
}: ChatLayoutProps) {
  return (
    <div className="flex h-screen bg-[#343541] text-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader toggleSidebar={toggleSidebar} />
        <ChatArea messages={messages} />
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
