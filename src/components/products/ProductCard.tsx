import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/data/types"
import { ROUTES, formatPrice } from "@/lib/constants"
import { Card, CardBody, CardFooter } from "@/components/common/Card"
import { Badge } from "@/components/common/Badge"
import { Icon } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

interface ProductCardProps {
  product: Product
  className?: string
}

/**
 * Product Card Component
 * Displays product in card format (for grid)
 *
 * @example
 * <ProductCard product={product} />
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const mainImage = product.images[0]

  return (
    <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
      <Card
        hover
        className={cn("h-full cursor-pointer overflow-hidden flex flex-col", className)}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={product.inStock ? "success" : "error"}
              label={product.inStock ? "متوفر" : "غير متوفر"}
            />
          </div>

          {/* Brand Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="primary" label={product.brand} />
          </div>
        </div>

        {/* Content */}
        <CardBody className="flex-1">
          <h3 className="font-lateef text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Key Features */}
          <div className="space-y-1 mb-4">
            {product.keyFeatures.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                <Icon name="check" size="sm" variant="success" className="mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardBody>

        {/* Footer with Price */}
        <CardFooter className="bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">السعر</p>
              <p className="font-bold text-lg md:text-2xl text-blue-600">
                {formatPrice(product.price)}
              </p>
            </div>
            <Icon
              name="arrowLeft"
              size="lg"
              variant="primary"
              className="hover:translate-x-1 transition-transform"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ProductCard
