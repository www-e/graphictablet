/**
 * Global Application Constants
 * Used across the entire application
 */

// ============================================
// SITE CONFIGURATION
// ============================================

export const SITE_NAME = "عرض الأجهزة الرسومية"
export const SITE_DESCRIPTION = "متجر متخصص في عرض أجهزة الرسم الجرافيكي والأدوات التعليمية"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

// ============================================
// WHATSAPP CONFIGURATION
// ============================================

export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "201227278084"
export const WHATSAPP_PHONE_FORMATTED = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_FORMATTED || "+201227278084"

/**
 * Generate WhatsApp message link
 * @param productName - Product name in Arabic
 * @param productPrice - Product price
 * @returns WhatsApp API link with pre-filled message
 */
export function generateWhatsAppLink(productName: string, productPrice: string): string {
  const message = encodeURIComponent(
    `السلام عليكم ورحمة الله وبركاته\n\nأود الاستفسار عن: ${productName}\nالسعر: ${productPrice} جنيه\n\nهل متوفر حالياً؟`
  )
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`
}

// ============================================
// CURRENCY & FORMATTING
// ============================================

export const CURRENCY = "EGP"
export const CURRENCY_SYMBOL = "جنيه"
export const CURRENCY_FORMAT = "ar-EG"

/**
 * Format price to Egyptian Pounds
 * @param price - Price as number
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat(CURRENCY_FORMAT, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ============================================
// NAVIGATION ROUTES
// ============================================

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  WELCOME: "/welcome",
} as const

// ============================================
// CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = {
  DISPLAY_TABLETS: "display-tablets",
  PEN_TABLETS: "pen-tablets",
  CALCULATORS: "calculators",
} as const

// ============================================
// IMAGE PATHS
// ============================================

export const IMAGE_PATHS = {
  PRODUCTS_HUION: "/images/products/huion",
  PRODUCTS_CASIO: "/images/products/casio",
  HERO: "/images/hero",
  ICONS: "/images/icons",
} as const

// ============================================
// ANIMATION TIMINGS
// ============================================

export const ANIMATION = {
  DURATION_FAST: 150,
  DURATION_BASE: 300,
  DURATION_SLOW: 500,
} as const
