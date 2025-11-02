"use client"

import React, { useState, useMemo } from "react"
import { getAllProducts } from "@/lib/data/products"
import { PRODUCT_CATEGORIES } from "@/lib/constants"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Button } from "@/components/common/Button"
import { Icon } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

/**
 * Products Listing Page
 * Display all products with filtering and sorting
 */
export default function ProductsPage() {
  const allProducts = getAllProducts()

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name")
  const [showFilters, setShowFilters] = useState(true)

  // Get unique brands
  const brands = [...new Set(allProducts.map((p) => p.brand))]

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory)
    }

    // Filter by brand
    if (selectedBrand) {
      products = products.filter((p) => p.brand === selectedBrand)
    }

    // Sort
    if (sortBy === "price-asc") {
      products.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      products.sort((a, b) => b.price - a.price)
    } else {
      products.sort((a, b) => a.name.localeCompare(b.name, "ar"))
    }

    return products
  }, [selectedCategory, selectedBrand, sortBy])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-aqsa text-4xl md:text-5xl font-bold mb-3 text-gray-900">
            جميع المنتجات
          </h1>
          <p className="text-lg text-gray-600">
            اكتشف مجموعتنا الكاملة من أجهزة الرسم الجرافيكي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <div
            className={cn(
              "lg:col-span-1",
              !showFilters && "hidden lg:block"
            )}
          >
            <div className="sticky top-20 space-y-6">
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icon name="filter" size="sm" />
                {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
              </button>

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="font-lateef font-bold text-lg text-gray-900">
                  الفئة
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full text-right px-4 py-2 rounded-lg transition-colors",
                      !selectedCategory
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    الكل
                  </button>
                  {Object.values(PRODUCT_CATEGORIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full text-right px-4 py-2 rounded-lg transition-colors",
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {category === "display-tablets"
                        ? "أجهزة عرض"
                        : category === "pen-tablets"
                          ? "أجهزة أقلام"
                          : "آلات حاسبة"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3">
                <h3 className="font-lateef font-bold text-lg text-gray-900">
                  الماركة
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={cn(
                      "w-full text-right px-4 py-2 rounded-lg transition-colors",
                      !selectedBrand
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    الكل
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={cn(
                        "w-full text-right px-4 py-2 rounded-lg transition-colors",
                        selectedBrand === brand
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="space-y-3">
                <h3 className="font-lateef font-bold text-lg text-gray-900">
                  الترتيب
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "price-asc" | "price-desc")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">الاسم (أ-ي)</option>
                  <option value="price-asc">السعر (الأقل أولاً)</option>
                  <option value="price-desc">السعر (الأعلى أولاً)</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedBrand) && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedBrand(null)
                  }}
                >
                  مسح الفلاتر
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                {filteredProducts.length} منتج
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Icon name="filter" size="sm" />
                فلاتر
              </button>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} columns={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
