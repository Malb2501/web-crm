import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-accent/10 text-accent ring-accent/20",
        secondary:   "bg-muted text-muted-foreground ring-border",
        success:     "bg-success/10 text-success ring-success/20",
        destructive: "bg-destructive/10 text-destructive ring-destructive/20",
        warning:     "bg-warning/10 text-warning ring-warning/20",
        outline:     "bg-transparent text-foreground ring-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
