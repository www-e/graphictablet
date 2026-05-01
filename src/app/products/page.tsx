"use client"

import React, { useState, useMemo } from "react"
import { trpc } from "@/lib/trpc/client"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Icon } from "@/components/icons/Icons"
import { FilterSidebar } from "@/components/products/FilterSidebar"

export default function ProductsPage() {
  const { data: allProducts, isLoading } = trpc.products.getAll.useQuery()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name")
  const [showFilters, setShowFilters] = useState(false)

  const brands = useMemo(
    () => [...new Set((allProducts ?? []).map((p) => p.brand))],
    [allProducts]
  )

  const filteredProducts = useMemo(() => {
    let products = [...(allProducts ?? [])]

    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory)
    }

    if (selectedBrand) {
      products = products.filter((p) => p.brand === selectedBrand)
    }

    if (sortBy === "price-asc") {
      products.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      products.sort((a, b) => b.price - a.price)
    } else {
      products.sort((a, b) => a.name.localeCompare(b.name, "ar"))
    }

    return products
  }, [allProducts, selectedCategory, selectedBrand, sortBy])

  const onClearFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-aqsa text-4xl md:text-5xl font-bold mb-3 text-gray-900">
            All Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our full range of graphic drawing tablets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            sortBy={sortBy}
            setSortBy={setSortBy}
            brands={brands}
            onClearFilters={onClearFilters}
          />

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                {filteredProducts.length} Products
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Icon name="filter" size="sm" />
                Filters
              </button>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
