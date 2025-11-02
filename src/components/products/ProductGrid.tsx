import React from "react"
import { Product } from "@/lib/data/types"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils/cn"

interface ProductGridProps {
  products: Product[]
  className?: string
}

/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid