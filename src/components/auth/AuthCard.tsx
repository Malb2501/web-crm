import { cn } from "@/lib/utils"

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-md rounded-xl bg-white shadow-2xl", className)}>
      {children}
    </div>
  )
}
