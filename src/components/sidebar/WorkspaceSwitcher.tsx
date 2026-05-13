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
import type { WorkspaceWithPlan } from "@/lib/data/workspaces"

const AVATAR_COLORS = [
  "#2563EB", "#16A34A", "#D97706", "#7C3AED", "#DB2777", "#0891B2",
]

function workspaceColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function WorkspaceAvatar({ name, id }: { name: string; id: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
      style={{ backgroundColor: workspaceColor(id) }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceWithPlan[]
}

export function WorkspaceSwitcher({ workspaces }: WorkspaceSwitcherProps) {
  const [activeId, setActiveId] = useState(workspaces[0]?.id ?? "")
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0]

  if (!active) return null

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
          <WorkspaceAvatar name={active.name} id={active.id} />
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

        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => setActiveId(ws.id)}
            className="gap-2.5 cursor-pointer"
          >
            <WorkspaceAvatar name={ws.name} id={ws.id} />
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
