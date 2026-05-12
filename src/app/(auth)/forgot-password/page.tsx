"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, MailCheck } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { cn } from "@/lib/utils"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setEmailError("E-mail é obrigatório")
      return
    }
    if (!isValidEmail(email)) {
      setEmailError("Informe um e-mail válido")
      return
    }
    setEmailError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard>
        <div className="p-8 text-center">
          <div className="mb-5">
            <span className="text-2xl font-bold text-[#1E3A5F]">Pipe</span>
            <span className="text-2xl font-bold text-[#2563EB]">Flow</span>
          </div>
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <MailCheck className="h-7 w-7 text-green-500" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">E-mail enviado!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enviamos um link de recuperação para{" "}
            <span className="font-medium text-slate-700">{email}</span>.
            Verifique sua caixa de entrada.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Não recebeu? Verifique a pasta de spam ou{" "}
            <button
              onClick={() => setSent(false)}
              className="font-medium text-[#2563EB] hover:underline"
            >
              tente novamente
            </button>
            .
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
          >
            ← Voltar ao login
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <div className="p-8">
        <div className="mb-8 text-center">
          <div className="mb-5">
            <span className="text-2xl font-bold text-[#1E3A5F]">Pipe</span>
            <span className="text-2xl font-bold text-[#2563EB]">Flow</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Recuperar senha</h1>
          <p className="mt-1 text-sm text-slate-500">
            Informe seu e-mail e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
                "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20",
                emailError ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
              )}
            />
            {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              "Enviar link de recuperação"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
