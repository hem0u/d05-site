import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-bubble text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-sakura-400 text-white hover:bg-sakura-500 shadow-lg shadow-sakura-200 dark:shadow-sakura-900",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-2 border-sakura-200 dark:border-sakura-700 bg-transparent hover:bg-sakura-50 dark:hover:bg-sakura-950",
        secondary: "bg-lavender-200 dark:bg-lavender-800 text-lavender-900 dark:text-lavender-100 hover:bg-lavender-300 dark:hover:bg-lavender-700",
        ghost: "hover:bg-sakura-50 dark:hover:bg-sakura-950",
        link: "text-sakura-500 underline-offset-4 hover:underline",
        kawaii: "bg-gradient-to-r from-sakura-400 to-sky-400 text-white hover:from-sakura-500 hover:to-sky-500 shadow-lg shadow-sakura-200/50",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-12 rounded-bubble px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
