import { redirect } from "next/navigation"
import { getUserWorkspaces, getCurrentUser } from "@/lib/data/workspaces"
import { DashboardShell } from "@/components/layout/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, workspaces] = await Promise.all([getCurrentUser(), getUserWorkspaces()])

  if (!user) redirect("/login")

  const userName = user.user_metadata?.full_name ?? user.email ?? "Usuário"
  const userEmail = user.email ?? ""

  return (
    <DashboardShell
      workspaces={workspaces}
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </DashboardShell>
  )
}
