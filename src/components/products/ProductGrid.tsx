import React from "react"
import { Product } from "@/lib/data/types"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils/cn"

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 3,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        {
          "grid-cols-2": columns === 2,
          "grid-cols-3": columns === 3,
          "grid-cols-4": columns === 4,
        },
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