import React from "react"
import Link from "next/link"
import { WHATSAPP_PHONE_FORMATTED, SITE_NAME, ROUTES } from "@/lib/constants"
import { Icon } from "@/components/icons/Icons"
import { Button } from "@/components/common/Button"

/**
 * Footer Component
 * Simplified footer with only social media and developer credit
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Icon name="grid" size="lg" className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">التابلت التفاعلي</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              متجر متخصص في عرض أجهزة الرسم التفاعلي والأدوات التعليمية للمحترفين والطلاب.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="phone" size="base" variant="primary" />
              <a href={`tel:${WHATSAPP_PHONE_FORMATTED}`} className="hover:text-white transition">
                {WHATSAPP_PHONE_FORMATTED}
              </a>
            </div>
          </div>

          {/* Quick Links & Resources */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
              <div className="space-y-2">
                <a
                  href="https://casiocalculators-mea.com/product/casio-fx-991es-plus-2nd-edition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  دليل استخدام الحاسبة العلمية
                </a>
                <Link href={ROUTES.PRODUCTS} className="block text-gray-400 hover:text-white transition-colors">
                  تصفح المنتجات
                </Link>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="font-bold text-white mb-4">تابعنا</h4>
              <a
                href="https://www.facebook.com/ashraf.hassan.5099940"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Icon name="facebookBrand" size="lg" className="hover:scale-110 transition-transform" />
              </a>
            </div>
            
            {/* Developed by Omar */}
            <div>
              <h4 className="font-bold text-white mb-4">مطور الموقع</h4>
              <Link
                href="https://omar-flax.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Developed by Omar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom Footer */}
        <div className="border-t border-t-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} التابلت التفاعلي. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_FORMATTED.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Icon name="whatsapp" size="sm" />
              اطلب الآن
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
