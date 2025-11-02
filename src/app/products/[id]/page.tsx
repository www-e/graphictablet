"use client"

import Link from "next/link"
import { use } from "react"
import { ROUTES, formatPrice} from "@/lib/constants"
import { getProductById, getAllProducts } from "@/lib/data/products"
import { ImageGallery } from "@/components/products/ImageGallery"
import { SpecTable } from "@/components/products/SpecTable"
import { ProductGrid } from "@/components/products/ProductGrid"
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA"
import { DeviceCompatibility } from "@/components/products/DeviceCompatibility"
import { UsageScenarios } from "@/components/products/UsageScenarios"
import { Button } from "@/components/common/Button"
import { Badge } from "@/components/common/Badge"
import { Icon } from "@/components/icons/Icons"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Product Detail Page - Client Component
 */
export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = getProductById(id)

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert("تم نسخ الرابط!")
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("تم نسخ الرابط!")
    }
  }

  // Get related products (same category)
  const relatedProducts = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href={ROUTES.HOME} className="hover:text-blue-600 transition-colors">
            الرئيسية
          </Link>
          <Icon name="chevronLeft" size="sm" />
          <Link href={ROUTES.PRODUCTS} className="hover:text-blue-600 transition-colors">
            المنتجات
          </Link>
          <Icon name="chevronLeft" size="sm" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                {/* Badges Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="primary" label={product.brand} />
                  <Badge
                    variant={product.inStock ? "success" : "error"}
                    label={product.inStock ? "متوفر" : "غير متوفر"}
                  />
                  {product.freeDelivery && (
                    <Badge
                      variant="info"
                      label="شحن مجاني لجميع أنحاء مصر"
                      className="bg-green-100 text-green-800 border-green-300"
                    />
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl lg:text-4xl font-bold text-blue-700">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">السعر الحالي</p>
                  </div>
                  {product.freeDelivery && (
                    <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                      <Icon name="truck" size="sm" />
                      شحن مجاني لجميع أنحاء مصر
                    </p>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  المميزات الرئيسية
                </h3>
                <ul className="space-y-3">
                  {product.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <Icon name="check" size="xs" variant="success" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <WhatsAppCTA
                  productName={product.name}
                  productPrice={product.price}
                  productId={product.id}
                  variant="button"
                  size="lg"
                  fullWidth
                />
                <Button
                  variant="outline"
                  size="lg"
                  icon="share"
                  fullWidth
                  onClick={handleShare}
                >
                  مشاركة المنتج
                </Button>
              </div>

              {/* Teacher Friendly Badge */}
              {product.teacherFriendly && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon name="star" size="lg" variant="success" />
                    <div>
                      <p className="font-bold text-green-800">مناسب للمعلمين</p>
                      <p className="text-sm text-green-600">
                        تم تصميمه خصيصاً للاستخدام في البيئة التعليمية
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Warning */}
              {!product.inStock && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-800 font-medium">هذا المنتج غير متوفر حالياً</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">
        {/* Usage Scenarios */}
        {product.usageScenarios && product.usageScenarios.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <UsageScenarios
              scenarios={product.usageScenarios}
              teacherFriendly={product.teacherFriendly}
            />
          </section>
        )}

        {/* Device Compatibility */}
        {product.deviceCompatibility && (
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <DeviceCompatibility compatibility={product.deviceCompatibility} />
          </section>
        )}

        {/* Specifications */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              المواصفات التفصيلية
            </h2>
            <p className="text-gray-600">
              جميع التفاصيل التقنية التي تحتاج لمعرفتها
            </p>
          </div>
          <div className="p-6 lg:p-8">
            <SpecTable specifications={product.specifications} />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                منتجات ذات صلة
              </h2>
              <p className="text-gray-600">
                منتجات أخرى قد تهمك
              </p>
            </div>
            <ProductGrid products={relatedProducts} columns={2} />
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            هل لديك أي استفسارات حول هذا المنتج؟
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            فريقنا جاهز لمساعدتك في اختيار المنتج المناسب لاحتياجاتك
          </p>
          <div className="pt-4">
            <WhatsAppCTA
              productName={product.name}
              productPrice={product.price}
              variant="button"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center gap-2 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
