import React from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"

interface NavigationProps {
  isOpen?: boolean
  className?: string
}

/**
 * Navigation Links Component
 * Renders main navigation menu (used in Header)
 */
export const NavigationLinks: React.FC<NavigationProps> = ({ isOpen = true, className }) => {
  const navItems = [
    { label: "الرئيسية", href: ROUTES.HOME },
    { label: "المنتجات", href: ROUTES.PRODUCTS },
    { label: "عن المتجر", href: ROUTES.ABOUT },
    { label: "اتصل بنا", href: ROUTES.CONTACT },
  ]

  return (
    <nav
      className={cn(
        "flex flex-col md:flex-row md:items-center md:gap-8",
        !isOpen && "hidden md:flex",
        className
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-4 py-2 md:px-0 md:py-0 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium text-lg md:text-base"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default NavigationLinks
