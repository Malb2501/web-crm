"use client"

import { LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_USER = {
  name: "Marco Silva",
  email: "marco@empresa.com",
  avatarUrl: "",
}

export function UserMenu() {
  const initials = MOCK_USER.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-sidebar-accent transition-colors focus-visible:outline-none">
          <Avatar className="h-8 w-8 shrink-0">
            {MOCK_USER.avatarUrl && <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground leading-none">
              {MOCK_USER.name}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60 mt-0.5">{MOCK_USER.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="top" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm">{MOCK_USER.name}</span>
            <span className="text-xs text-muted-foreground">{MOCK_USER.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings className="h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
