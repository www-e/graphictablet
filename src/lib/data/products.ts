import { Product } from "./types"

/**
 * Product Database (Static JSON)
 * All products displayed in the store
 */

export const PRODUCTS: Product[] = [
  {
    id: "huion-1060p",
    name: "Huion 1060P - جهاز الرسم التعليمي",
    brand: "Huion",
    category: "display-tablets",
    price: 3650,
    description:
      "جهاز رسم تفاعلي متقدم مع شاشة عرض ملونة واضحة، مثالي للطلاب والمحترفين. يدعم 8192 مستوى ضغط للرسم الدقيق والسلس.",
    shortDescription: "جهاز رسم تعليمي احترافي بشاشة عرض",
    images: [
      {
        url: "/huion1060p/first.jpg",
        alt: "Huion 1060P - جهاز الرسم الرئيسي",
        order: 1,
      },
      {
        url: "/huion1060p/second.png",
        alt: "Huion 1060P - منظور جانبي",
        order: 2,
      },
      {
        url: "/huion1060p/third.jpeg",
        alt: "Huion 1060P - تفاصيل الجهاز",
        order: 3,
      },
    ],
    specifications: [
      { label: "حجم الشاشة", value: "10.6 بوصة" },
      { label: "دقة الدقة", value: "1920 × 1200 بكسل" },
      { label: "مستويات الضغط", value: "8192 مستوى" },
      { label: "معدل الاستجابة", value: "5.08 مللي ثانية" },
      { label: "الاتصال", value: "USB-C / HDMI" },
      { label: "الوزن", value: "1.2 كجم" },
      { label: "البطارية", value: "لا تحتاج - متصلة بالتيار" },
    ],
    keyFeatures: [
      "شاشة عرض ملونة IPS بزوايا عرض واسعة",
      "دعم نظامي Windows و macOS والأجهزة اللوحية",
      "قلم ضغط متقدم مع 8192 مستوى حساسية",
      "مثالي للرسم الرقمي والتصميم والتعليم",
    ],
    inStock: true,
  },

  {
    id: "huion-hs611",
    name: "Huion HS611 - جهاز الرسم المحمول",
    brand: "Huion",
    category: "pen-tablets",
    price: 4250,
    description:
      "جهاز رسم محمول خفيف الوزن مثالي للطلاب والفنانين المحترفين. يتميز بحساسية عالية وتوافق كامل مع جميع برامج الرسم الاحترافية.",
    shortDescription: "جهاز رسم محمول بحساسية عالية",
    images: [
      {
        url: "/hs611/first.jpg",
        alt: "Huion HS611 - جهاز الرسم الرئيسي",
        order: 1,
      },
      {
        url: "/hs611/second.jpeg",
        alt: "Huion HS611 - منظور جانبي",
        order: 2,
      },
      {
        url: "/hs611/third.jpeg",
        alt: "Huion HS611 - الاستخدام الفعلي",
        order: 3,
      },
    ],
    specifications: [
      { label: "حجم سطح الرسم", value: "6.3 × 3.9 بوصة" },
      { label: "دقة الضغط", value: "4096 مستوى" },
      { label: "معدل الاستجابة", value: "3 مللي ثانية" },
      { label: "معدل التقرير", value: "200 تقرير في الثانية" },
      { label: "الاتصال", value: "USB 2.0" },
      { label: "الوزن", value: "400 جرام فقط" },
      { label: "التوافقية", value: "Windows و macOS و Linux" },
    ],
    keyFeatures: [
      "خفيف الوزن وسهل الحمل في الحقيبة",
      "سطح رسم مريح مع تصميم حديث",
      "توافق كامل مع برامج Adobe و Clip Studio",
      "مثالي للمبتدئين والمحترفين",
    ],
    inStock: true,
  },

  {
    id: "casio-fx991es-plus",
    name: "Casio FX-991ES Plus - الآلة الحاسبة العلمية",
    brand: "Casio",
    category: "calculators",
    price: 500,
    description:
      "آلة حاسبة علمية متقدمة مع 417 دالة رياضية، مثالية لطلاب الهندسة والعلوم. تدعم العمليات الحسابية المعقدة والمصفوفات والإحصاء.",
    shortDescription: "آلة حاسبة علمية متقدمة للطلاب",
    images: [
      {
        url: "/991es/first.jpg",
        alt: "Casio FX-991ES Plus - الآلة الحاسبة الرئيسية",
        order: 1,
      },
      {
        url: "/991es/second.jpg",
        alt: "Casio FX-991ES Plus - شاشة العرض",
        order: 2,
      },
      {
        url: "/991es/third.jpg",
        alt: "Casio FX-991ES Plus - لوحة المفاتيح",
        order: 3,
      },
    ],
    specifications: [
      { label: "عدد الدوال", value: "417 دالة رياضية" },
      { label: "نوع الشاشة", value: "LCD بسطرين" },
      { label: "نطاق الحساب", value: "±99 إلى ±10^±99" },
      { label: "الذاكرة", value: "متغيرات متعددة للتخزين" },
      { label: "المطاريات", value: "AAA × 2 أو بطارية شمسية" },
      { label: "الأبعاد", value: "77 × 161 × 11 ملم" },
      { label: "الوزن", value: "91 جرام" },
    ],
    keyFeatures: [
      "417 دالة علمية مدمجة",
      "حسابات المصفوفات والإحصاء المتقدمة",
      "جدول البيانات والحسابات الجداول",
      "موثوقة ومستخدمة في المدارس والجامعات",
    ],
    inStock: true,
  },
]

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return PRODUCTS
}

/**
 * Get single product by ID
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((product) => product.category === category)
}

/**
 * Get products by brand
 */
export function getProductsByBrand(brand: string): Product[] {
  return PRODUCTS.filter((product) => product.brand === brand)
}

/**
 * Filter products by price range
 */
export function filterByPriceRange(minPrice: number, maxPrice: number): Product[] {
  return PRODUCTS.filter((product) => product.price >= minPrice && product.price <= maxPrice)
}
