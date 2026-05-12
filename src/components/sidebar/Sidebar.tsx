"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, KanbanSquare, Users, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { UserMenu } from "./UserMenu"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline",  label: "Pipeline",  icon: KanbanSquare },
  { href: "/leads",     label: "Leads",     icon: Users },
]

const BOTTOM_ITEMS = [
  { href: "/settings", label: "Configurações", icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  onClick?: () => void
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        {/* Active indicator — left accent bar */}
        <span
          className={cn(
            "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-all",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
          )}
          aria-hidden="true"
        />
        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80")} />
        {label}
      </Link>
    </li>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Painel da sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col",
          "bg-[var(--sidebar-background)] border-r border-sidebar-border",
          "transition-transform duration-200 ease-in-out",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ── Cabeçalho: logo + fechar (mobile) ── */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <span className="text-xs font-bold text-white">PF</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              PipeFlow
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Workspace Switcher ── */}
        <div className="border-b border-sidebar-border px-3 py-3">
          <WorkspaceSwitcher />
        </div>

        {/* ── Navegação principal ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
            Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={isActive(item.href)}
                onClick={onClose}
              />
            ))}
          </ul>

          {/* Seção inferior de nav */}
          <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
            Conta
          </p>
          <ul className="flex flex-col gap-0.5">
            {BOTTOM_ITEMS.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={isActive(item.href)}
                onClick={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* ── Rodapé: usuário ── */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <UserMenu />
        </div>
      </aside>
    </>
  )
}
