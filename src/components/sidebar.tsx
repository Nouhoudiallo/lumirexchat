import { Plus } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  if (!isOpen) return null

  return (
    <div className="w-[260px] bg-[#202123] h-full md:flex md:flex-col border-r border-gray-800 hidden ">
      {/* New chat button */}
      <div className="p-3">
        <button className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors">
          <div className="flex items-center">
            <Plus size={16} className="mr-2" />
            <span className="text-sm">Nouveau chat</span>
          </div>
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-medium text-gray-500 px-3 py-2">Aujourd'hui</div>

        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors text-left">
          <span className="truncate">Dissertation sur l'indépendance africaine</span>
        </button>

        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors text-left">
          <span className="truncate">Analyse des conséquences du colonialisme</span>
        </button>
      </div>

      {/* User info */}
      <div className="p-3 border-t border-gray-800">
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors">
          <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center mr-2">N</div>
          <span>Nom d'utilisateur</span>
        </button>
      </div>
    </div>
  )
}
