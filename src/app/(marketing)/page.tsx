import Navbar from "@/components/marketing/Navbar"
import HeroSection from "@/components/marketing/HeroSection"
import FeaturesSection from "@/components/marketing/FeaturesSection"
import PricingSection from "@/components/marketing/PricingSection"
import CtaSection from "@/components/marketing/CtaSection"
import FooterSection from "@/components/marketing/FooterSection"

export const metadata = {
  title: "PipeFlow CRM — Feche mais negócios com menos esforço",
  description:
    "Pipeline Kanban, gestão de leads e dashboard de métricas para times de vendas. Comece grátis hoje.",
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <FooterSection />
    </>
  )
}
