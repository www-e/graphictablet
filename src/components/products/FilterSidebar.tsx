import React from 'react';
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils/cn";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

interface FilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  sortBy: string;
  setSortBy: (sort: "name" | "price-asc" | "price-desc") => void;
  brands: string[];
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  showFilters,
  setShowFilters,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  sortBy,
  setSortBy,
  brands,
  onClearFilters,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden',
          showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setShowFilters(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform -translate-x-full',
          showFilters && 'translate-x-0'
        )}
      >
        <div className="p-4">
          <Button onClick={() => setShowFilters(false)} className="lg:hidden mb-4">
            Close
          </Button>
          {/* Category Filter */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="font-lateef font-bold text-md text-gray-900">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'w-full text-right px-3 py-1.5 rounded-md transition-colors text-sm',
                  !selectedCategory
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                All
              </button>
              {Object.values(PRODUCT_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'w-full text-right px-3 py-1.5 rounded-md transition-colors text-sm',
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {category === 'display-tablets'
                    ? 'Display Tablets'
                    : category === 'pen-tablets'
                    ? 'Pen Tablets'
                    : 'Calculators'}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 border-b py-4">
            <h3 className="font-lateef font-bold text-md text-gray-900">Brand</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand(null)}
                className={cn(
                  'w-full text-right px-3 py-1.5 rounded-md transition-colors text-sm',
                  !selectedBrand
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                All
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={cn(
                    'w-full text-right px-3 py-1.5 rounded-md transition-colors text-sm',
                    selectedBrand === brand
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2 py-4">
            <h3 className="font-lateef font-bold text-md text-gray-900">Sort</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon name="chevronDown" size="sm" />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedBrand) && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </>
  );
};