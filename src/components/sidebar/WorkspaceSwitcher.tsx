"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_WORKSPACES = [
  { id: "1", name: "Acme Corp",       plan: "pro"  as const, color: "#2563EB" },
  { id: "2", name: "Freelance",       plan: "free" as const, color: "#16A34A" },
  { id: "3", name: "Consultoria XYZ", plan: "free" as const, color: "#D97706" },
]

function WorkspaceAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {name.charAt(0)}
    </div>
  )
}

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState("1")
  const active = MOCK_WORKSPACES.find((w) => w.id === activeId)!

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
            "text-sidebar-foreground transition-colors",
            "hover:bg-sidebar-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          )}
        >
          <WorkspaceAvatar name={active.name} color={active.color} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold leading-none text-sidebar-foreground">
              {active.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-sidebar-foreground/50">
              {active.plan === "pro" ? (
                <>
                  <Zap className="h-2.5 w-2.5 text-accent" />
                  <span className="text-accent font-medium">Pro</span>
                </>
              ) : (
                "Free"
              )}
            </span>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start" side="bottom" sideOffset={6}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Seus workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {MOCK_WORKSPACES.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => setActiveId(ws.id)}
            className="gap-2.5 cursor-pointer"
          >
            <WorkspaceAvatar name={ws.name} color={ws.color} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{ws.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{ws.plan}</span>
            </div>
            <Check
              className={cn("h-4 w-4 shrink-0 text-accent", activeId === ws.id ? "opacity-100" : "opacity-0")}
            />
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2.5 cursor-pointer text-muted-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Criar workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
