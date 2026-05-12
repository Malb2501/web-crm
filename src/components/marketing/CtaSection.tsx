import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F4F6F8]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight mb-4">
          Pronto para fechar mais negócios?
        </h2>
        <p className="text-slate-500 text-lg mb-10">
          Comece hoje sem cartão de crédito. Configure em menos de 5 minutos.
        </p>
        <Link
          href="/signup"
          className="group inline-flex items-center gap-2 text-white bg-[#2563EB] hover:bg-[#1d4ed8] font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base"
        >
          Criar conta grátis
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
