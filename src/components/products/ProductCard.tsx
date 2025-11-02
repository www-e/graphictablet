"use client"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const hasMultipleImages = product.images.length > 1
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const isImageControl = target.closest('[data-image-control="true"]')
    
    if (!isImageControl) {
      // Navigate to product detail page using Next.js router
      router.push(ROUTES.PRODUCT_DETAIL(product.id))
    }
  }

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedImageIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedImageIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageIndicatorClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedImageIndex(index)
  }

  return (
    <Card
      hover
      className={cn("h-full cursor-pointer overflow-hidden flex flex-col", className)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden">
        <Image
          src={product.images[selectedImageIndex].url}
          alt={product.images[selectedImageIndex].alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            <button
              data-image-control="true"
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm active:scale-95 opacity-70 hover:opacity-100"
              aria-label="الصورة السابقة"
              type="button"
            >
              <Icon name="chevronLeft" size="sm" />
            </button>
            <button
              data-image-control="true"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm active:scale-95 opacity-70 hover:opacity-100"
              aria-label="الصورة التالية"
              type="button"
            >
              <Icon name="chevronRight" size="sm" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm z-10">
            {selectedImageIndex + 1} / {product.images.length}
          </div>
        )}

        {/* Progress Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-2 flex gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                data-image-control="true"
                key={idx}
                onClick={(e) => handleImageIndicatorClick(e, idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200 hover:scale-110",
                  selectedImageIndex === idx
                    ? "bg-white"
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`اذهب إلى صورة ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant={product.inStock ? "success" : "error"}
            label={product.inStock ? "متوفر" : "غير متوفر"}
          />
        </div>

        {/* Brand Badge */}
        <div className="absolute top-3 left-3 z-10">
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
  )
}

export default ProductCard
