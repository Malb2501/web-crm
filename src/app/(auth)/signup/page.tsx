"use client"

import { Suspense, useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthCard } from "@/components/auth/AuthCard"
import { signUp } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type FormErrors = {
  name?: string
  email?: string
  password?: string
  terms?: string
}

function SignupForm() {
  const searchParams = useSearchParams()
  const serverError = searchParams.get("error")
  const success = searchParams.get("success")
  const inviteToken = searchParams.get("invite") ?? ""
  const inviteEmail = searchParams.get("email") ?? ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState(inviteEmail)
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!name.trim()) e.name = "Nome é obrigatório"
    else if (name.trim().length < 2) e.name = "Nome deve ter ao menos 2 caracteres"
    if (!email) e.email = "E-mail é obrigatório"
    else if (!isValidEmail(email)) e.email = "Informe um e-mail válido"
    if (!password) e.password = "Senha é obrigatória"
    else if (password.length < 6) e.password = "Senha deve ter ao menos 6 caracteres"
    if (!terms) e.terms = "Você precisa aceitar os termos para continuar"
    return e
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    const formData = new FormData(e.currentTarget)
    startTransition(() => signUp(formData))
  }

  const passwordStrength =
    password.length === 0 ? null
    : password.length < 6 ? "fraca"
    : password.length < 10 ? "média"
    : "forte"

  const strengthColor =
    passwordStrength === "fraca" ? "bg-red-400"
    : passwordStrength === "média" ? "bg-yellow-400"
    : "bg-green-500"

  const strengthWidth =
    passwordStrength === "fraca" ? "w-1/3"
    : passwordStrength === "média" ? "w-2/3"
    : "w-full"

  if (success === "check_email") {
    return (
      <AuthCard>
        <div className="p-8 text-center">
          <div className="mb-5">
            <span className="text-2xl font-bold text-[#1E3A5F]">Pipe</span>
            <span className="text-2xl font-bold text-[#2563EB]">Flow</span>
          </div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-slate-800">Verifique seu e-mail</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enviamos um link de confirmação para o seu e-mail.
            Clique no link para ativar sua conta.
          </p>
          <Link href="/login" className="mt-6 block text-sm font-medium text-[#2563EB] hover:underline">
            Voltar ao login
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
          <h1 className="text-xl font-semibold text-slate-800">Crie sua conta grátis</h1>
          <p className="mt-1 text-sm text-slate-500">Comece a gerenciar seus clientes hoje</p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {inviteToken && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Crie sua conta para aceitar o convite.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <input type="hidden" name="inviteToken" value={inviteToken} />
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="João Silva"
              className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
                "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20",
                errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
              )}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
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
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400",
                "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20",
                errors.password ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
              )}
            />
            {passwordStrength && (
              <div className="mt-1.5">
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full transition-all", strengthColor, strengthWidth)} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  Força da senha: <span className="font-medium text-slate-600">{passwordStrength}</span>
                </p>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#2563EB]"
              />
              <span className="text-sm text-slate-600">
                Li e aceito os{" "}
                <span className="font-medium text-[#2563EB]">Termos de Serviço</span>
                {" "}e a{" "}
                <span className="font-medium text-[#2563EB]">Política de Privacidade</span>
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando conta…
              </>
            ) : (
              "Criar conta grátis"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthCard><div className="p-8 h-48" /></AuthCard>}>
      <SignupForm />
    </Suspense>
  )
}
