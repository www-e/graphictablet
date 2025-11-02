import React from "react"
import Link from "next/link"
import { WHATSAPP_PHONE_FORMATTED, SITE_NAME } from "@/lib/constants"
import { Icon } from "@/components/icons/Icons"
import { Button } from "@/components/common/Button"

/**
 * Footer Component
 * Simplified footer with only social media and developer credit
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "فيسبوك",
      icon: "facebookBrand",
      href: "https://www.facebook.com/ashraf.hassan.5099940",
      color: "hover:text-blue-600",
    },
    {
      name: "يوتيوب",
      icon: "youtubeBrand", 
      href: "https://www.youtube.com/@mr.ashrafhassan-2365",
      color: "hover:text-red-600",
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Icon name="grid" size="lg" className="text-white" />
              </div>
              <h3 className="font-aqsa text-xl font-bold text-white">{SITE_NAME}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              متجر متخصص في عرض أجهزة الرسم الجرافيكي والأدوات التعليمية للمحترفين والطلاب.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="phone" size="base" variant="primary" />
              <a href={`tel:${WHATSAPP_PHONE_FORMATTED}`} className="hover:text-white transition">
                {WHATSAPP_PHONE_FORMATTED}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <div>
              <h4 className="font-lateef font-bold text-white mb-4">تابعنا</h4>
              <div className="flex items-center gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`text-gray-400 transition-colors duration-300 ${social.color}`}
                  >
                    <Icon
                      name={social.icon as "facebookBrand" | "youtubeBrand"}
                      size="lg"
                      className="hover:scale-110 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Developed by Omar */}
            <div>
              <h4 className="font-lateef font-bold text-white mb-4">مطور الموقع</h4>
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
            © {currentYear} {SITE_NAME}. جميع الحقوق محفوظة.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon="whatsapp"
            className="w-full md:w-auto"
          >
            اطلب الآن عبر واتساب
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
