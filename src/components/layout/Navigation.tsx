import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"

interface NavigationProps {
  isOpen?: boolean
  className?: string
  onItemClick?: () => void
}

/**
 * Navigation Links Component
 * Modern shadcn-inspired navigation with active states and enhanced styling
 */
export const NavigationLinks: React.FC<NavigationProps> = ({ isOpen = true, className, onItemClick }) => {
  const pathname = usePathname()
  
  const navItems = [
    { label: "الرئيسية", href: ROUTES.HOME },
    { label: "المنتجات", href: ROUTES.PRODUCTS },
  ]

  return (
    <nav
      className={cn(
        "flex flex-col md:flex-row md:items-center md:gap-1 lg:gap-2",
        !isOpen && "hidden md:flex",
        className
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "relative px-4 py-2.5 md:px-3 lg:px-4 md:py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-gray-50 hover:text-blue-600 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1",
              isActive
                ? "text-blue-600 bg-blue-50/80 shadow-sm"
                : "text-gray-700 hover:text-blue-600",
              "group"
            )}
          >
            <span className="relative z-10">{item.label}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full" />
            )}
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
          </Link>
        )
      })}
    </nav>
  )
}

export default NavigationLinks
