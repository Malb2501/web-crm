"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const router = useRouter()
  const [workspaceName, setWorkspaceName] = useState("")
  const [nameError, setNameError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspaceName.trim()) {
      setNameError("Nome do workspace é obrigatório")
      return
    }
    if (workspaceName.trim().length < 2) {
      setNameError("Nome deve ter ao menos 2 caracteres")
      return
    }
    setNameError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0d1f33] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-white">Pipe</span>
          <span className="text-3xl font-bold text-[#60a5fa]">Flow</span>
        </div>

        <div className="rounded-xl bg-white shadow-2xl">
          <div className="border-b border-slate-100 px-8 py-6">
            <div className="mb-4 flex items-center gap-1 text-xs font-medium text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-white">1</span>
              <span className="mx-1 h-px w-8 bg-slate-200" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">2</span>
              <span className="mx-1 h-px w-8 bg-slate-200" />
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">3</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
                <Building2 className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Crie seu workspace</h1>
                <p className="text-sm text-slate-500">Dê um nome para sua empresa ou time</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-8">
            <div>
              <label htmlFor="workspaceName" className="mb-1.5 block text-sm font-medium text-slate-700">
                Nome do workspace
              </label>
              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Ex: Acme Corp, Minha Empresa..."
                autoFocus
                className={cn(
                  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
                  "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20",
                  nameError ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
                )}
              />
              {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
              <p className="mt-2 text-xs text-slate-400">
                Este será o nome visível para todos os membros do seu time.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando workspace…
                </>
              ) : (
                "Continuar →"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Você poderá alterar essas informações depois nas configurações
        </p>
      </div>
    </div>
  )
}
