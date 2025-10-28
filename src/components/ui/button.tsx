import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ff-text-sm font-semibold transition-all ff-focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "ff-btn-primary ff-hover-glow",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 ff-hover-scale",
        outline:
          "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground ff-hover-scale",
        secondary:
          "ff-btn-secondary ff-hover-glow",
        ghost: "hover:bg-accent hover:text-accent-foreground ff-hover-scale",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "ff-btn-accent ff-hover-glow",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 ff-text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-12 ff-text-lg",
        icon: "h-9 w-9",
        responsive: "min-h-[3rem] sm:min-h-[3.5rem] px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl whitespace-normal",
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