import { Product } from "./types"

/**
 * Product Database (Static JSON)
 * All products displayed in the store
 */

export const PRODUCTS: Product[] = [
  {
    id: "huion-1060p",
    name: "Huion 1060P - جهاز الرسم التفاعلي",
    brand: "Huion",
    category: "display-tablets",
    price: 3650,
    description:
      "جهاز رسم تفاعلي رقيق 10 ملم مع مساحة عمل كبيرة، يدعم 8192 مستوى ضغط للرسم الدقيق والسلس للمحترفين والطلاب.",
    shortDescription: "جهاز رسم تفاعلي احترافي بسماكة 10 ملم",
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
      { label: "مساحة العمل", value: "254 × 158.8 ملم (10 × 6.25 بوصة)" },
      { label: "الأبعاد", value: "360 × 240 × 10 ملم" },
      { label: "الوزن", value: "770 جرام" },
      { label: "اللون", value: "أسود" },
      { label: "مستويات الضغط", value: "8192 مستوى" },
      { label: "دقة القلم", value: "5080 LPI" },
      { label: "معدل التقرير", value: ">220 تقرير في الثانية" },
      { label: "الاتصال", value: "Micro USB" },
      { label: "الأزرار المبرمجة", value: "12 زر صلب + 16 زر ناعم" },
      { label: "دعم الإمالة", value: "±60 درجة" },
      { label: "ارتفاع الاستشعار", value: "10 ملم" },
      { label: "الدقة", value: "±0.3 ملم" },
      { label: "القلم", value: "PW100 بدون بطارية" },
    ],
    keyFeatures: [
      "جهاز رقيق 10 ملم مع مساحة عمل كبيرة 254×158.8 ملم",
      "قلم ضغط 8192 مستوى بدون بطارية مع دعم الإمالة ±60°",
      "12 زر صلب + 16 زر ناعم مبرمجة للتنفيذ السريع",
      "دقة عالية 5080 LPI مع معدل تقرير >220 PPS",
      "تصميم أسود أنيق مع سطح مضاد للانزلاق",
      "دعم أنظمة التشغيل: Windows، macOS، Android",
      "متضمن مع الجهاز: قلم + رؤوس إضافية + كابل Micro USB",
      "مثالي للمحترفين والطلاب في التصميم والرسم",
    ],
    freeDelivery: true,
    deviceCompatibility: {
      computers: {
        windows: "Windows 7/8/10/11",
        mac: "macOS 10.12 Sierra وإصدارات أحدث",
        linux: "Ubuntu 16.04+ وCentOS 7+"
      },
      tablets: {
        android: "Android 4.4+ مع دعم OTG",
        ios: "iPad Pro مع محول Lightning to USB"
      },
      phones: {
        android: "Android 6.0+ مع كابل OTG",
        ios: "iPhone مع محول Lightning to USB (للشحن فقط)"
      }
    },
    usageScenarios: [
      "التصميم والرسم الاحترافي",
      "الرسم والتصميم الجرافيكي",
      "التوقيع الإلكتروني والمذكرات",
      "العمل من المنزل والمكاتب",
      "التعليم والرسم الأكاديمي"
    ],
    teacherFriendly: true,
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
      { label: "حجم سطح الرسم", value: "258.4 × 161.5 ملم (10.2 × 6.4 بوصة)" },
      { label: "الأبعاد", value: "333.4 × 218.4 × 7.3 ملم" },
      { label: "الوزن", value: "550 جرام" },
      { label: "الألوان المتاحة", value: "أحمر المرجاني، أزرق النجوم، رمادي الفضاء" },
      { label: "مستويات الضغط", value: "8192 مستوى" },
      { label: "دقة القلم", value: "5080 LPI" },
      { label: "معدل التقرير", value: ">233 تقرير في الثانية" },
      { label: "الاتصال", value: "USB-C" },
      { label: "الزرق المبرمجة", value: "10 أزرار + 1 شريط لمس" },
      { label: "مفاتيح الوسائط المتعددة", value: "8 مفاتيح للترفيه" },
      { label: "دعم الإمالة", value: "±60 درجة" },
      { label: "ارتفاع الاستشعار", value: "10 ملم" },
      { label: "الدقة", value: "±0.3 ملم" },
      { label: "القلم", value: "PW500 بدون بطارية" },
    ],
    keyFeatures: [
      "قلم ضغط 8192 مستوى بدون بطارية مع دعم الإمالة ±60°",
      "متوفر بثلاثة ألوان: الأحمر المرجاني، الأزرق النجمي، والرمادي الفضائي",
      "رفيع ومحمول بسماكة 7.3 ملم فقط",
      "10 أزرار مبرمجة + 1 شريط لمس + 8 مفاتيح وسائط متعددة",
      "معدل تقرير عالي >233 تقرير في الثانية للرسم السلس",
      "دعم أنظمة التشغيل: Windows، macOS، Android",
      "سطح رسم مريح مع تصميم حديث ومضاد للانزلاق",
      "متضمن مع الجهاز: قلم + 8 رؤوس إضافية + كابل USB-C",
    ],
    freeDelivery: true,
    deviceCompatibility: {
      computers: {
        windows: "Windows 7/8/10/11",
        mac: "macOS 10.12 Sierra وإصدارات أحدث",
      },
      tablets: {
        android: "Android 4.4+ مع دعم OTG",
        ios: "iPad Pro مع محول Lightning to USB"
      },
      phones: {
        android: "Android 6.0+ مع كابل OTG",
        ios: "iPhone مع محول Lightning to USB (للشحن فقط)"
      }
    },
    usageScenarios: [
      "التصميم والرسم الاحترافي",
      "التعليم عن بُعد والمحتوى الرقمي",
      "التوقيع الإلكتروني والوثائق",
      "الرسم السريع والمخططات",
      "استوديو متنقل للفنانين",
      "الاستخدام اليومي في المكتب والمنزل",
      "إنشاء المحتوى الرقمي والفيديوهات"
    ],
    teacherFriendly: true,
    inStock: true,
  },

  {
    id: "casio-fx991es-plus",
    name: "Casio FX-991ES Plus - الآلة الحاسبة العلمية",
    brand: "Casio",
    category: "calculators",
    price: 450,
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
    freeDelivery: false,
    deviceCompatibility: {},
    usageScenarios: [
      "الامتحانات والاختبارات المدرسية",
      "الحسابات الهندسية المعقدة",
      "الإحصاء والتحليل الرياضي",
      "البحوث العلمية والأكاديمية",
      "استخدام يومي للطلاب"
    ],
    teacherFriendly: true,
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
