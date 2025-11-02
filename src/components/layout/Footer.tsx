import React from "react"
import Link from "next/link"
import { ROUTES, WHATSAPP_PHONE_FORMATTED, SITE_NAME } from "@/lib/constants"
import { Icon} from "@/components/icons/Icons"
import { Button } from "@/components/common/Button"

/**
 * Footer Component
 * Bottom section with links, contact, and social media
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "الروابط السريعة",
      links: [
        { label: "الرئيسية", href: ROUTES.HOME },
        { label: "المنتجات", href: ROUTES.PRODUCTS },
        { label: "عن المتجر", href: ROUTES.ABOUT },
        { label: "اتصل بنا", href: ROUTES.CONTACT },
      ],
    },
    {
      title: "الفئات",
      links: [
        { label: "أجهزة العرض", href: `${ROUTES.PRODUCTS}?category=display-tablets` },
        { label: "أجهزة الأقلام", href: `${ROUTES.PRODUCTS}?category=pen-tablets` },
        { label: "الآلات الحاسبة", href: `${ROUTES.PRODUCTS}?category=calculators` },
      ],
    },
    {
      title: "المساعدة",
      links: [
        { label: "شروط الاستخدام", href: "#" },
        { label: "سياسة الخصوصية", href: "#" },
        { label: "سياسة الإرجاع", href: "#" },
        { label: "الأسئلة الشائعة", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    {
      name: "واتساب",
      icon: "whatsappBrand",
      href: `https://wa.me/${WHATSAPP_PHONE_FORMATTED}`,
      color: "hover:text-green-600",
    },
    {
      name: "فيسبوك",
      icon: "facebookBrand",
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "انستجرام",
      icon: "instagramBrand",
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "تويتر",
      icon: "twitterBrand",
      href: "https://twitter.com",
      color: "hover:text-sky-500",
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16 md:mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-lateef font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Contact & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-lateef font-bold text-white">اتصل بنا</h4>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="phone" size="base" variant="primary" />
              <a href={`tel:${WHATSAPP_PHONE_FORMATTED}`} className="hover:text-white transition">
                {WHATSAPP_PHONE_FORMATTED}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="email" size="base" variant="primary" />
              <a href="mailto:info@example.com" className="hover:text-white transition">
                info@example.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="location" size="base" variant="primary" />
              <span>بنها، القليوبية، مصر</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-lateef font-bold text-white">تابعنا</h4>
            <div className="flex items-center gap-4">
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
                    name={social.icon as "whatsappBrand" | "facebookBrand" | "instagramBrand" | "twitterBrand"}
                    size="lg"
                    className="hover:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
