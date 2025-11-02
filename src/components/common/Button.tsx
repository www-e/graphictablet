import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"
import { Icon, ICON_MAP } from "@/components/icons/Icons"

/**
 * Button variants using CVA (Class Variance Authority)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: keyof typeof ICON_MAP
  iconPosition?: "left" | "right"
  children: React.ReactNode
}

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 *
 * @example
 * <Button variant="primary" size="lg">تحميل</Button>
 * <Button icon="whatsapp" variant="primary">اطلب عبر واتساب</Button>
 * <Button isLoading>جاري...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      icon,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Icon name="spinner" size="sm" animated />
            {children}
          </>
        ) : icon && iconPosition === "left" ? (
          <>
            <Icon name={icon} size="sm" />
            {children}
          </>
        ) : icon && iconPosition === "right" ? (
          <>
            {children}
            <Icon name={icon} size="sm" />
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
