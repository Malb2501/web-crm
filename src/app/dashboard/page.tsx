import Link from "next/link"

export default function DashboardPlaceholderPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6F8]">
      <div className="text-center">
        <div className="mb-2 text-sm font-medium text-[#2563EB]">M3 — Auth UI ✓</div>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Dashboard</h1>
        <p className="mt-2 text-slate-500">Login realizado com sucesso. Esta página será implementada no M4.</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          ← Voltar ao login
        </Link>
        <Link
          href="/onboarding"
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
        >
          Ver onboarding
        </Link>
      </div>
    </main>
  )
}
