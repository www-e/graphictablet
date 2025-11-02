import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

/**
 * Badge variants
 */
const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "bg-blue-100 text-blue-800 border border-blue-300",
        secondary: "bg-gray-100 text-gray-800 border border-gray-300",
        success: "bg-green-100 text-green-800 border border-green-300",
        error: "bg-red-100 text-red-800 border border-red-300",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
        info: "bg-sky-100 text-sky-800 border border-sky-300",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  label: string
}

/**
 * Badge Component
 * Small label component for status/tags
 *
 * @example
 * <Badge label="متوفر" variant="success" />
 * <Badge label="Huion" variant="primary" />
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, label, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        {label}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export default Badge
