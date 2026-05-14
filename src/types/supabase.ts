export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          plan: "free" | "pro"
          onboarding_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: "free" | "pro"
          onboarding_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: "free" | "pro"
          onboarding_completed?: boolean
          created_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: "admin" | "member"
          joined_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role?: "admin" | "member"
          joined_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: "admin" | "member"
          joined_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          status: "new" | "contacted" | "proposal" | "converted" | "lost"
          owner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          status?: "new" | "contacted" | "proposal" | "converted" | "lost"
          owner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          status?: "new" | "contacted" | "proposal" | "converted" | "lost"
          owner_id?: string | null
          created_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          workspace_id: string
          lead_id: string | null
          title: string
          value: number
          stage:
            | "new_lead"
            | "contacted"
            | "proposal_sent"
            | "negotiation"
            | "closed_won"
            | "closed_lost"
          owner_id: string | null
          deadline: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          lead_id?: string | null
          title: string
          value?: number
          stage?:
            | "new_lead"
            | "contacted"
            | "proposal_sent"
            | "negotiation"
            | "closed_won"
            | "closed_lost"
          owner_id?: string | null
          deadline?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          lead_id?: string | null
          title?: string
          value?: number
          stage?:
            | "new_lead"
            | "contacted"
            | "proposal_sent"
            | "negotiation"
            | "closed_won"
            | "closed_lost"
          owner_id?: string | null
          deadline?: string | null
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          lead_id: string
          workspace_id: string
          type: "call" | "email" | "meeting" | "note"
          description: string
          author_id: string | null
          scheduled_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          workspace_id: string
          type: "call" | "email" | "meeting" | "note"
          description: string
          author_id?: string | null
          scheduled_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          workspace_id?: string
          type?: "call" | "email" | "meeting" | "note"
          description?: string
          author_id?: string | null
          scheduled_date?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          workspace_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: "free" | "pro"
          status: "active" | "past_due" | "canceled" | "trialing"
          updated_at: string
        }
        Insert: {
          workspace_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: "free" | "pro"
          status?: "active" | "past_due" | "canceled" | "trialing"
          updated_at?: string
        }
        Update: {
          workspace_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: "free" | "pro"
          status?: "active" | "past_due" | "canceled" | "trialing"
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      workspace_plan: "free" | "pro"
      workspace_role: "admin" | "member"
      lead_status: "new" | "contacted" | "proposal" | "converted" | "lost"
      deal_stage:
        | "new_lead"
        | "contacted"
        | "proposal_sent"
        | "negotiation"
        | "closed_won"
        | "closed_lost"
      activity_type: "call" | "email" | "meeting" | "note"
      subscription_status: "active" | "past_due" | "canceled" | "trialing"
    }
  }
}

// ── Helpers de linha (conveniência para uso no app)
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type InsertDTO<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type UpdateDTO<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

// ── Tipos concretos derivados (prontos para importar no app)
export type WorkspaceRow        = Tables<"workspaces">
export type WorkspaceMemberRow  = Tables<"workspace_members">
export type LeadRow             = Tables<"leads">
export type DealRow             = Tables<"deals">
export type ActivityRow         = Tables<"activities">
export type SubscriptionRow     = Tables<"subscriptions">
