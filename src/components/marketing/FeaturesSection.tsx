import {
  KanbanSquare,
  Users,
  BarChart3,
  Building2,
  CalendarClock,
  Search,
} from "lucide-react"

const features = [
  {
    icon: KanbanSquare,
    title: "Pipeline Kanban",
    description:
      "Visualize cada etapa da venda em colunas arrastáveis. Mova negócios com drag-and-drop e veja o funil em tempo real.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Users,
    title: "Gestão de Leads",
    description:
      "Cadastre contatos, registre interações e acompanhe o histórico completo de cada lead em um único lugar.",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Métricas",
    description:
      "KPIs de conversão, valor total do pipeline e gráfico de funil para decisões baseadas em dados.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description:
      "Crie múltiplos workspaces e convide colaboradores. Cada time tem seu pipeline isolado com controle de acesso.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: CalendarClock,
    title: "Prazos e Atividades",
    description:
      "Registre ligações, reuniões e e-mails com timeline cronológica. Alertas de prazo para não perder oportunidades.",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    icon: Search,
    title: "Busca e Filtros",
    description:
      "Encontre qualquer lead ou negócio em segundos. Filtre por status, responsável, prazo ou valor do contrato.",
    color: "#0891B2",
    bg: "#ECFEFF",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#F4F6F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight mb-4">
            Tudo que seu time de vendas precisa
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Do primeiro contato ao fechamento — sem planilhas, sem e-mails perdidos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: f.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-[#1E3A5F] mb-2 text-base">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
