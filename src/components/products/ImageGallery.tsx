"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ProductImage } from "@/lib/data/types"
import { Icon } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
}

/**
 * Image Gallery Component
 * Multi-image viewer with thumbnail navigation
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <Icon name="box" size="2xl" variant="error" />
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
              aria-label="الصورة السابقة"
            >
              <Icon name="chevronRight" size="lg" />
            </button>
            <button
              onClick={handleNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors"
              aria-label="الصورة التالية"
            >
              <Icon name="chevronLeft" size="lg" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                selectedIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-300"
                  : "border-gray-300 hover:border-gray-400"
              )}
              aria-label={`اختر صورة ${idx + 1}`}
            >
              <Image
                src={image.url}
                alt={`${productName} - صورة ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
