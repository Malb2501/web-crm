export type WorkspacePlan = "free" | "pro"

export type WorkspaceRole = "admin" | "member"

export type LeadStatus =
  | "new"
  | "contacted"
  | "proposal"
  | "converted"
  | "lost"

export type DealStage =
  | "new_lead"
  | "contacted"
  | "proposal_sent"
  | "negotiation"
  | "closed_won"
  | "closed_lost"

export type ActivityType = "call" | "email" | "meeting" | "note"

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: WorkspacePlan
  onboardingCompleted: boolean
  createdAt: string
}

export interface WorkspaceMember {
  workspaceId: string
  userId: string
  role: WorkspaceRole
  joinedAt: string
  user?: {
    id: string
    email: string
    name: string
    avatarUrl?: string
  }
}

export interface Lead {
  id: string
  workspaceId: string
  name: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  status: LeadStatus
  ownerId: string
  owner?: WorkspaceMember["user"]
  createdAt: string
}

export interface Deal {
  id: string
  workspaceId: string
  leadId: string
  lead?: Pick<Lead, "id" | "name" | "company">
  title: string
  value: number
  stage: DealStage
  ownerId: string
  owner?: WorkspaceMember["user"]
  deadline?: string
  createdAt: string
}

export interface Activity {
  id: string
  leadId: string
  workspaceId: string
  type: ActivityType
  description: string
  authorId: string
  author?: WorkspaceMember["user"]
  createdAt: string
}

export interface Subscription {
  workspaceId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  plan: WorkspacePlan
  status: "active" | "past_due" | "canceled" | "trialing"
  updatedAt: string
}
