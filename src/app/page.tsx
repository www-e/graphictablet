import Link from "next/link"
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
                <h1 className="font-aqsa text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                  أجهزة الرسم الجرافيكي
                </h1>
                <p className="text-xl md:text-2xl text-blue-600 font-lateef">
                  للمحترفين والطلاب
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                اكتشف أحدث أجهزة الرسم الجرافيكي والأدوات التعليمية من الماركات العالمية الموثوقة.
                جودة عالية، أسعار منافسة، وخدمة عملاء متميزة.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <Link href={ROUTES.PRODUCTS}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon="shoppingCart"
                    className="w-full md:w-auto"
                  >
                    تصفح المنتجات
                  </Button>
                </Link>
                <WhatsAppCTA
                  productName="استفسار عام"
                  productPrice={0}
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

            {/* Hero Image */}
            <div className="order-1 md:order-2">
              <div className="relative w-full aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-4">
                  <Icon name="grid" size="2xl" variant="primary" />
                  <p className="text-gray-600 font-medium">صورة توضيحية</p>
                  <p className="text-sm text-gray-500">استبدل بصورة حقيقية للمتجر</p>
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

          <ProductGrid products={featuredProducts} columns={3} />
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
