import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

const stats = [
  { value: "+47%", label: "Conversão de leads" },
  { value: "3.2×", label: "Leads qualificados" },
  { value: "−62%", label: "Ciclo de venda" },
  { value: "1.200+", label: "Times usando" },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.12) 0%, transparent 70%), linear-gradient(180deg, #F4F6F8 0%, #ffffff 100%)",
        }}
      />
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-3xl -z-10"
        style={{ background: "#2563EB" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10 blur-3xl -z-10"
        style={{ background: "#1E3A5F" }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1d4ed8] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 animate-in fade-in duration-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block" />
          CRM moderno para times de vendas
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A5F] leading-[1.1] tracking-tight max-w-3xl mx-auto mb-6">
          Feche mais negócios,{" "}
          <span
            className="relative inline-block"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
              backgroundClip: "text",
            }}
          >
            com menos esforço
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          PipeFlow organiza seu pipeline de vendas, centraliza contatos e revela
          quais negócios merecem atenção agora — tudo em uma plataforma simples.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 text-white bg-[#2563EB] hover:bg-[#1d4ed8] font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base"
          >
            Começar grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#1E3A5F] bg-white hover:bg-slate-50 font-semibold px-7 py-3.5 rounded-xl transition-all border border-slate-200 hover:border-slate-300 text-base"
          >
            <Play className="w-4 h-4 fill-current opacity-70" />
            Ver demonstração
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-w-3xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white px-6 py-5 flex flex-col items-center gap-0.5 hover:bg-[#F4F6F8] transition-colors"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-slate-500 font-medium text-center leading-snug">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
