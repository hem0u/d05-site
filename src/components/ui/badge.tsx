import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-sakura-100 text-sakura-700 dark:bg-sakura-900 dark:text-sakura-200",
        secondary: "border-transparent bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200",
        lavender: "border-transparent bg-lavender-100 text-lavender-700 dark:bg-lavender-900 dark:text-lavender-200",
        outline: "text-foreground border-sakura-200 dark:border-sakura-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
