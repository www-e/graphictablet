import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ROUTES, formatPrice, SITE_NAME } from "@/lib/constants"
import { getProductById, getAllProducts } from "@/lib/data/products"
import { ImageGallery } from "@/components/products/ImageGallery"
import { SpecTable } from "@/components/products/SpecTable"
import { ProductGrid } from "@/components/products/ProductGrid"
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA"
import { Button } from "@/components/common/Button"
import { Badge } from "@/components/common/Badge"
import { Icon } from "@/components/icons/Icons"

interface ProductPageProps {
  params: {
    id: string
  }
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

/**
 * Generate metadata for product page
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id)

  if (!product) {
    return {
      title: "المنتج غير متوفر",
      description: "للأسف، هذا المنتج غير متوفر",
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0].url],
    },
  }
}

/**
 * Product Detail Page
 */
export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <Icon name="warning" size="2xl" variant="error" />
          <h1 className="text-2xl font-bold text-gray-900">المنتج غير متوفر</h1>
          <p className="text-gray-600">للأسف، المنتج الذي تبحث عنه غير متوفر</p>
          <Link href={ROUTES.PRODUCTS}>
            <Button variant="primary">العودة للمنتجات</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get related products (same category)
  const relatedProducts = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href={ROUTES.HOME} className="hover:text-blue-600">
            الرئيسية
          </Link>
          <Icon name="chevronLeft" size="sm" />
          <Link href={ROUTES.PRODUCTS} className="hover:text-blue-600">
            المنتجات
          </Link>
          <Icon name="chevronLeft" size="sm" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image Gallery */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-3">
              <Badge variant="primary" label={product.brand} />
              <Badge
                variant={product.inStock ? "success" : "error"}
                label={product.inStock ? "متوفر" : "غير متوفر"}
              />
            </div>

            {/* Name & Price */}
            <div>
              <h1 className="font-aqsa text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl md:text-5xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-500">السعر الحالي</p>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-lateef text-lg font-bold mb-3 text-gray-900">
                المميزات الرئيسية
              </h3>
              <ul className="space-y-2">
                {product.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <Icon name="check" size="base" variant="success" className="mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <WhatsAppCTA
                productName={product.name}
                productPrice={product.price}
                productId={product.id}
                variant="button"
                size="lg"
                fullWidth
              />
              <Button variant="outline" size="lg" icon="heart" fullWidth>
                أضف للمفضلة
              </Button>
            </div>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">هذا المنتج غير متوفر حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-16">
          <h2 className="font-lateef text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            المواصفات التفصيلية
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <SpecTable specifications={product.specifications} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-lateef text-2xl md:text-3xl font-bold mb-8 text-gray-900">
              منتجات ذات صلة
            </h2>
            <ProductGrid products={relatedProducts} columns={2} />
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-white mt-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="font-lateef text-3xl font-bold">
            هل لديك أي استفسارات حول هذا المنتج؟
          </h2>
          <WhatsAppCTA
            productName={product.name}
            productPrice={product.price}
            variant="button"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 inline-block"
          />
        </div>
      </section>
    </div>
  )
}
