import React from "react"
import { cn } from "@/lib/utils/cn"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  border?: boolean
}

/**
 * Card Component
 * Base card container for consistent styling
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, border = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg bg-white shadow-md",
          hover && "transition-all duration-300 hover:shadow-lg hover:scale-105",
          border && "border border-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Card Header
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("border-b border-gray-200 px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = "CardHeader"

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Card Body
 */
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
)

CardBody.displayName = "CardBody"

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Card Footer
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-gray-200 bg-gray-50 px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = "CardFooter"

export default Card
