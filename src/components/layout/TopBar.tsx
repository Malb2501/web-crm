"use client"

import { usePathname } from "next/navigation"
import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pipeline": "Pipeline",
  "/leads": "Leads",
  "/settings": "Configurações",
  "/settings/workspace": "Configurações do Workspace",
  "/settings/members": "Membros",
  "/settings/billing": "Plano e Cobrança",
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const parent = "/" + pathname.split("/")[1]
  return PAGE_TITLES[parent] ?? "PipeFlow"
}

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
      {/* Hamburguer — mobile only */}
      <button
        onClick={onMenuClick}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "lg:hidden"
        )}
        aria-label="Abrir menu de navegação"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Título da página */}
      <h1 className="text-sm font-semibold text-foreground lg:text-base">{title}</h1>

      {/* Ações à direita */}
      <div className="ml-auto flex items-center gap-1">
        {/* Sino de notificações */}
        <button
          className={cn(
            "relative rounded-md p-2 text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          {/* Badge de notificação não lida */}
          <span
            className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-accent ring-2 ring-card"
            aria-hidden="true"
          />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        {/* Avatar do usuário */}
        <button
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          aria-label="Menu do usuário"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold">MS</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
