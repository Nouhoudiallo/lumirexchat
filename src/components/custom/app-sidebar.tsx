"use client"

import {
  Home
} from "lucide-react"

import { NavMain } from "@/src/components/custom/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/src/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <h1 className="text-4xl text-primary font-bold text-center">LumiChat</h1>
        <NavMain items={data.navMain} />
      </SidebarHeader>
     
      <SidebarRail />
    </Sidebar>
  )
}