"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import type { WorkspaceWithPlan } from "@/lib/data/workspaces"

interface DashboardShellProps {
  children: React.ReactNode
  workspaces: WorkspaceWithPlan[]
  userName: string
  userEmail: string
}

export function DashboardShell({ children, workspaces, userName, userEmail }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dark flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        workspaces={workspaces}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="isolate flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
