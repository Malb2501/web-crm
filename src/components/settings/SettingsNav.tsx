"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const SETTINGS_NAV = [
  { href: '/settings/workspace', label: 'Workspace', icon: Building2 },
  { href: '/settings/members',   label: 'Membros',   icon: Users },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 border-b border-border">
      {SETTINGS_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
