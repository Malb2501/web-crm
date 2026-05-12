import Link from "next/link"
import { Zap } from "lucide-react"

const links = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Preços", href: "#pricing" },
  { label: "Entrar", href: "/login" },
  { label: "Privacidade", href: "#" },
  { label: "Termos", href: "#" },
]

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-[#1E3A5F] tracking-tight">PipeFlow</span>
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-slate-400 hover:text-[#1E3A5F] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
