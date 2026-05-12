"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { TopBar } from "@/components/layout/TopBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dark flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área de conteúdo — isolate cria stacking context sem z-index explícito */}
      <div className="isolate flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
