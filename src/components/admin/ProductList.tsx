"use client"

import React from "react"
import Image from "next/image"
import { getImageSrc } from "@/lib/image-utils"
import { Icon } from "@/components/icons/Icons"

export interface AdminProduct {
  id: number
  slug: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number | null
  description: string
  shortDescription: string
  freeDelivery: boolean
  teacherFriendly: boolean
  inStock: boolean
  keyFeatures: string[]
  usageScenarios: string[] | null
  deviceCompatibility: Record<string, unknown> | null
  images: { data: string; mimeType: string; alt: string; order: number }[]
  specifications: { label: string; value: string }[]
}

interface ProductListProps {
  products: AdminProduct[]
  onEdit: (product: AdminProduct) => void
  onDelete: (id: number) => void
}

interface TableRowProps {
  product: AdminProduct
  onEdit: (product: AdminProduct) => void
  onDelete: (id: number) => void
}

const TableRow = React.memo(function TableRow({
  product,
  onEdit,
  onDelete,
}: TableRowProps) {
  const firstImage = product.images[0]
  const imageSrc = firstImage ? getImageSrc(firstImage) : null

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={firstImage?.alt || product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{product.name}</p>
            <p className="text-xs text-gray-500">{product.brand}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {product.price} جنيه
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
            product.inStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.inStock ? "متوفر" : "غير متوفر"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            aria-label={`تعديل المنتج: ${product.name}`}
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            aria-label={`حذف المنتج: ${product.name}`}
          >
            حذف
          </button>
        </div>
      </td>
    </tr>
  )
})

interface MobileCardProps {
  product: AdminProduct
  onEdit: (product: AdminProduct) => void
  onDelete: (id: number) => void
}

const MobileCard = React.memo(function MobileCard({
  product,
  onEdit,
  onDelete,
}: MobileCardProps) {
  const firstImage = product.images[0]
  const imageSrc = firstImage ? getImageSrc(firstImage) : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={firstImage?.alt || product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{product.name}</p>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="text-sm font-bold text-blue-600 mt-1">
            {product.price} جنيه
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
            product.inStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.inStock ? "متوفر" : "غير متوفر"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            aria-label={`تعديل المنتج: ${product.name}`}
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            aria-label={`حذف المنتج: ${product.name}`}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  )
})

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: ProductListProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                المنتج
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                السعر
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                المخزون
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-gray-700"
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <TableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <MobileCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Icon name="box" size="2xl" className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-500 text-lg">لا توجد منتجات حالياً</p>
          <p className="text-gray-400 text-sm mt-1">
            اضغط &quot;إضافة منتج&quot; لإضافة أول منتج
          </p>
        </div>
      )}
    </div>
  )
}
