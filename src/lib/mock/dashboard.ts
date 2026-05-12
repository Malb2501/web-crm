import { MOCK_DEALS } from "./deals"
import { MOCK_LEADS } from "./leads"
import type { DealStage } from "@/types"

const ACTIVE_STAGES: DealStage[] = ["new_lead", "contacted", "proposal_sent", "negotiation"]

const activeDeals  = MOCK_DEALS.filter(d => ACTIVE_STAGES.includes(d.stage))
const wonDeals     = MOCK_DEALS.filter(d => d.stage === "closed_won")
const lostDeals    = MOCK_DEALS.filter(d => d.stage === "closed_lost")

const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0)
const conversionRate = wonDeals.length / (wonDeals.length + lostDeals.length)

export const DASHBOARD_METRICS = {
  totalLeads:     { current: MOCK_LEADS.length,     previous: 13,    delta: +15.4 },
  openDeals:      { current: activeDeals.length,    previous: 12,    delta: +16.7 },
  pipelineValue:  { current: pipelineValue,          previous: 98400, delta: +33.4 },
  conversionRate: { current: Math.round(conversionRate * 100), previous: 38, delta: -5.3 },
}

export const FUNNEL_DATA = (
  [
    "new_lead",
    "contacted",
    "proposal_sent",
    "negotiation",
    "closed_won",
    "closed_lost",
  ] as DealStage[]
).map(stage => {
  const deals = MOCK_DEALS.filter(d => d.stage === stage)
  return {
    stage,
    count: deals.length,
    value: deals.reduce((s, d) => s + d.value, 0),
  }
})

const today   = new Date("2026-05-12")
const in7days = new Date("2026-05-19")

export const UPCOMING_DEALS = MOCK_DEALS
  .filter(d => {
    if (!d.deadline) return false
    const dl = new Date(d.deadline)
    return dl >= today && dl <= in7days
  })
  .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
