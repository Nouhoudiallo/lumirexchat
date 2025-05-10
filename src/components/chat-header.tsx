"use client"

import { Menu, Share2, MoreVertical } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface ChatHeaderProps {
  toggleSidebar: () => void
}

export default function ChatHeader({ toggleSidebar }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:flex text-gray-400 hover:text-gray-300"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center ml-2">
          <span className="font-medium">LumiRexCHAT</span>
        </div>
      </div>

      <div>

        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
          <span className="text-sm font-medium">N</span>
        </div>
      </div>
    </header>
  )
}
