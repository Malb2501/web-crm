import { redirect } from "next/navigation"
import { getUserWorkspaces, getCurrentUser, getActiveWorkspaceId } from "@/lib/data/workspaces"
import { DashboardShell } from "@/components/layout/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, workspaces, activeWorkspaceId] = await Promise.all([
    getCurrentUser(),
    getUserWorkspaces(),
    getActiveWorkspaceId(),
  ])

  if (!user) redirect("/login")

  const userName = user.user_metadata?.full_name ?? user.email ?? "Usuário"
  const userEmail = user.email ?? ""

  return (
    <DashboardShell
      workspaces={workspaces}
      userName={userName}
      userEmail={userEmail}
      activeWorkspaceId={activeWorkspaceId ?? undefined}
    >
      {children}
    </DashboardShell>
  )
}
