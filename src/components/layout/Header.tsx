"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ROUTES, SITE_NAME } from "@/lib/constants"
import { Icon } from "@/components/icons/Icons"
import { NavigationLinks } from "./Navigation"
import { Button } from "@/components/common/Button"

/**
 * Header Component
 * Top navigation with logo, menu, and mobile burger
 */
export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Desktop & Mobile Layout */}
        <div className="flex items-center justify-between">
          {/* Logo/Site Name */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Icon name="grid" size="lg" className="text-white" />
            </div>
            <div className="hidden md:flex flex-col">
              <h1 className="font-aqsa text-xl md:text-2xl font-bold text-blue-600">
                {SITE_NAME}
              </h1>
              <p className="text-xs text-gray-500">أجهزة الرسم الاحترافية</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationLinks />
          </div>

          {/* Right Section - Search & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              icon="search"
              className="hidden md:flex"
              aria-label="بحث"
            >
              بحث
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="قائمة"
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} size="lg" variant="primary" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
            <NavigationLinks isOpen={true} className="flex-col gap-2" />
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon="search"
                className="w-full"
              >
                بحث
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
