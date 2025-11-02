"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ROUTES} from "@/lib/constants"
import { Icon } from "@/components/icons/Icons"
import { NavigationLinks } from "./Navigation"

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Site Name - Simplified Design */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Icon name="grid" size="lg" className="text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-blue-700 leading-tight">
                التابلت التفاعلي
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <NavigationLinks />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="قائمة"
          >
            <Icon
              name={mobileMenuOpen ? "close" : "menu"}
              size="lg"
              className="text-gray-700"
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-200">
            <NavigationLinks
              isOpen={true}
              className="flex-col gap-2"
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>
      
      {/* Subtle Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
    </header>
  )
}

export default Header
