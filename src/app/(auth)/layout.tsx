import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PipeFlow CRM",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0d1f33] px-4 py-12">
      {children}
    </div>
  )
}
