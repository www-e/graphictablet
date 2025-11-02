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
    setSelectedIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1
      console.log('Previous clicked:', prev, '->', newIndex)
      return newIndex
    })
  }

  const handleNext = () => {
    setSelectedIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1
      console.log('Next clicked:', prev, '->', newIndex)
      return newIndex
    })
  }

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group shadow-sm">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
        />

        {/* Navigation Arrows - Enhanced for Mobile */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2.5 sm:p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm active:scale-95 border border-gray-200"
              aria-label="الصورة السابقة"
              type="button"
            >
              <Icon name="chevronLeft" size="base" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2.5 sm:p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm active:scale-95 border border-gray-200"
              aria-label="الصورة التالية"
              type="button"
            >
              <Icon name="chevronRight" size="base" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm backdrop-blur-sm z-10">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Progress Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedIndex(idx)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200 hover:scale-110",
                  selectedIndex === idx
                    ? "bg-blue-600 w-6"
                    : "bg-white/60 hover:bg-white/80 border border-gray-300"
                )}
                aria-label={`اذهب إلى صورة ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip - Enhanced Mobile Experience */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-1">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelectedIndex(idx)
              }}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                selectedIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-300 shadow-lg"
                  : "border-gray-300 hover:border-gray-400 hover:shadow-md"
              )}
              aria-label={`اختر صورة ${idx + 1}`}
              type="button"
            >
              <Image
                src={image.url}
                alt={`${productName} - صورة ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Touch Swipe Support */}
      {images.length > 1 && (
        <div className="sr-only">
          <p>استخدم الأسهم للتنقل بين الصور أو انقر على الصور المصغرة</p>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
