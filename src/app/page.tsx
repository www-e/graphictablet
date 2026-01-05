import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@/lib/constants"
import { ProductGrid } from "@/components/products/ProductGrid"
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA"
import { Button } from "@/components/common/Button"
import { Icon } from "@/components/icons/Icons"
import { getAllProducts } from "@/lib/data/products"

/**
 * Homepage
 * Hero section + featured products
 */
export default function Home() {
  const allProducts = getAllProducts()
  const featuredProducts = allProducts.slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-transparent py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6 md:space-y-8 order-2 md:order-1">
              <div>
                <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                  عرض جديد
                </div>
                <h1 className="font-aqsa text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-2">
                  حامل لاب توب معدني
                </h1>
                <p className="text-xl md:text-2xl text-blue-600 font-lateef">
                  مثالي لتحسين الوضعية
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                حامل لاب توب معدني قوي ومتين مصمم خصيصًا لتحسين وضعية الجلوس أثناء العمل.
                يساعد في رفع شاشة اللابتوب إلى مستوى العين مما يقلل من إجهاد الرقبة والظهر.
              </p>

              {/* Price Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-red-600">
                    155 جنيه
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    200 جنيه
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">
                    خصم 22%
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  العرض لفترة محدودة!
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <Link href={ROUTES.PRODUCT_DETAIL("labtop-holder")}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon="shoppingCart"
                    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    اشتري الآن
                  </Button>
                </Link>
                <WhatsAppCTA
                  productName="حامل لاب توب معدني - مثالي لتحسين الوضعية"
                  productPrice={155}
                  variant="link"
                  className="w-full md:w-auto justify-center"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">
                    {allProducts.length}+
                  </p>
                  <p className="text-sm text-gray-600">منتج متوفر</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">100%</p>
                  <p className="text-sm text-gray-600">أصلي مضمون</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-600">دعم فني</p>
                </div>
              </div>
            </div>

            {/* Hero Image - Laptop Holder */}
            <div className="order-1 md:order-2">
              <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="h-full flex items-center justify-center p-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src="/labtopholder/first.jpg"
                      alt="حامل لاب توب معدني - الصورة الرئيسية"
                      width={400}
                      height={300}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                    />
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      جديد
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-lateef text-3xl md:text-4xl font-bold text-center mb-12">
            لماذا تختارنا؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="truck" size="lg" variant="primary" />
              </div>
              <h3 className="font-lateef text-xl font-bold mb-2">توصيل سريع</h3>
              <p className="text-gray-600">
                توصيل آمن وسريع لكل أنحاء مصر مع تتبع الطلب في الوقت الفعلي
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="star" size="lg" variant="primary" />
              </div>
              <h3 className="font-lateef text-xl font-bold mb-2">منتجات أصلية</h3>
              <p className="text-gray-600">
                ضمان 100% منتجات أصلية من الموزعين الرسميين مع شهادة ضمان
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="phone" size="lg" variant="primary" />
              </div>
              <h3 className="font-lateef text-xl font-bold mb-2">دعم متميز</h3>
              <p className="text-gray-600">
                فريق دعم فني متخصص جاهز للإجابة على كل استفساراتك 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-lateef text-3xl md:text-4xl font-bold">
              المنتجات المميزة
            </h2>
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline" size="sm" icon="arrowLeft">
                عرض الكل
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 md:py-16 text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="font-lateef text-3xl md:text-4xl font-bold">
            هل لديك استفسار؟
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            تواصل معنا عبر واتساب للاستفسار عن أي منتج أو الحصول على عروض خاصة
          </p>
          <WhatsAppCTA
            productName="استفسار عام"
            productPrice={0}
            variant="button"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 inline-block"
          />
        </div>
      </section>
    </>
  )
}
