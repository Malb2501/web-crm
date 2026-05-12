"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { cn } from "@/lib/utils"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type FormErrors = { email?: string; password?: string }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!email) e.email = "E-mail é obrigatório"
    else if (!isValidEmail(email)) e.email = "Informe um e-mail válido"
    if (!password) e.password = "Senha é obrigatória"
    else if (password.length < 6) e.password = "Senha deve ter ao menos 6 caracteres"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push("/dashboard")
  }

  return (
    <AuthCard>
      <div className="p-8">
        <div className="mb-8 text-center">
          <div className="mb-5">
            <span className="text-2xl font-bold text-[#1E3A5F]">Pipe</span>
            <span className="text-2xl font-bold text-[#2563EB]">Flow</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-slate-500">Entre na sua conta para continuar</p>
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
                errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
                "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20",
                errors.password ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
              )}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            <div className="mt-1.5 text-right">
              <Link href="/forgot-password" className="text-xs text-[#2563EB] hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando…
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem uma conta?{" "}
          <Link href="/signup" className="font-medium text-[#2563EB] hover:underline">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
