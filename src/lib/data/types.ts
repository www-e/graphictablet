import { z } from "zod"

export const ProductImageSchema = z.object({
  data: z.string().min(1, "صورة مطلوبة"),
  mimeType: z.string().default("image/jpeg"),
  alt: z.string().min(1, "وصف الصورة مطلوب"),
  order: z.number().int().positive().optional(),
})

export type ProductImage = z.infer<typeof ProductImageSchema>

export const ProductSpecSchema = z.object({
  label: z.string().min(1, "اسم المواصفة مطلوب"),
  value: z.string().min(1, "قيمة المواصفة مطلوبة"),
})

export type ProductSpec = z.infer<typeof ProductSpecSchema>

export const DeviceCompatibilitySchema = z.object({
  computers: z.object({
    windows: z.string().optional(),
    mac: z.string().optional(),
    linux: z.string().optional(),
  }).optional(),
  tablets: z.object({
    android: z.string().optional(),
    ios: z.string().optional(),
  }).optional(),
  phones: z.object({
    android: z.string().optional(),
    ios: z.string().optional(),
  }).optional(),
})

export type DeviceCompatibility = z.infer<typeof DeviceCompatibilitySchema>

export const ProductSchema = z.object({
  id: z.number(),
  slug: z.string().min(1, "المعرف مطلوب"),
  name: z.string().min(1, "اسم المنتج مطلوب"),
  brand: z.string().min(1, "العلامة التجارية مطلوبة"),
  category: z.string().min(1, "التصنيف مطلوب"),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  originalPrice: z.number().positive().nullable().optional(),
  description: z.string().min(10, "الوصف قصير جداً"),
  shortDescription: z.string().min(5, "الوصف المختصر قصير جداً"),
  images: z.array(ProductImageSchema).min(1, "صورة واحدة على الأقل"),
  specifications: z.array(ProductSpecSchema).min(1, "مواصفة واحدة على الأقل"),
  keyFeatures: z.array(z.string()).min(1, "ميزة واحدة على الأقل"),
  freeDelivery: z.boolean().default(false),
  deviceCompatibility: DeviceCompatibilitySchema.nullable().optional(),
  usageScenarios: z.array(z.string()).nullable().optional(),
  teacherFriendly: z.boolean().default(false),
  inStock: z.boolean().default(true),
  createdAt: z.union([z.date(), z.string()]).optional(),
})

export type Product = z.infer<typeof ProductSchema>

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
})

export type ProductFilter = z.infer<typeof ProductFilterSchema>

export function validateProduct(data: unknown): Product {
  return ProductSchema.parse(data)
}
