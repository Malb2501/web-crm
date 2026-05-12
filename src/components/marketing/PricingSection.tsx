import Link from "next/link"
import { Check, Zap } from "lucide-react"

const plans = [
  {
    name: "Grátis",
    price: "R$0",
    period: "para sempre",
    description: "Perfeito para começar e validar seu processo de vendas.",
    cta: "Criar conta grátis",
    href: "/signup",
    highlight: false,
    features: [
      "Até 2 colaboradores",
      "Até 50 leads",
      "Pipeline Kanban completo",
      "Registro de atividades",
      "Dashboard de métricas",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro",
    price: "R$49",
    period: "por mês",
    description: "Para times em crescimento que precisam de escala e colaboração.",
    cta: "Começar 14 dias grátis",
    href: "/signup",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Colaboradores ilimitados",
      "Leads ilimitados",
      "Pipeline Kanban completo",
      "Registro de atividades",
      "Dashboard de métricas",
      "Multi-workspace",
      "Convites por e-mail",
      "Busca e filtros avançados",
      "Suporte prioritário",
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Preços
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight mb-4">
            Simples e transparente
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Sem taxas escondidas. Cancele quando quiser.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-[#1E3A5F] text-white shadow-2xl shadow-blue-900/30 scale-[1.02]"
                  : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                    <Zap className="w-3 h-3 fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    plan.highlight ? "text-blue-300" : "text-[#2563EB]"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      plan.highlight ? "text-white" : "text-[#1E3A5F]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      plan.highlight ? "text-blue-300" : "text-slate-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    plan.highlight ? "text-blue-200" : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? "text-blue-300" : "text-[#16A34A]"
                      }`}
                    />
                    <span
                      className={plan.highlight ? "text-blue-100" : "text-slate-600"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block text-center font-semibold py-3 rounded-xl transition-all text-sm ${
                  plan.highlight
                    ? "bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-700/40 hover:shadow-blue-700/60 hover:-translate-y-0.5"
                    : "bg-[#F4F6F8] hover:bg-slate-200 text-[#1E3A5F]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-slate-400 mt-10">
          Sem cartão de crédito para o plano grátis · Cancele quando quiser
        </p>
      </div>
    </section>
  )
}
