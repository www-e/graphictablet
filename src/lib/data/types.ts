import { z } from "zod"

/**
 * Product Specification
 * Individual spec item (e.g., "Pressure Levels: 8192")
 */
export const ProductSpecSchema = z.object({
  label: z.string().min(1, "Label required"), // e.g., "الدقة"
  value: z.string().min(1, "Value required"), // e.g., "1920x1080"
})

export type ProductSpec = z.infer<typeof ProductSpecSchema>

/**
 * Product Image
 * Stores image path and alt text
 */
export const ProductImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().min(1, "Alt text required"),
  order: z.number().int().positive().optional(),
})

export type ProductImage = z.infer<typeof ProductImageSchema>

/**
 * Device Compatibility Schema
 */
export const DeviceCompatibilitySchema = z.object({
  computers: z.object({
    windows: z.string(),
    mac: z.string(),
    linux: z.string().optional(),
  }).optional(),
  tablets: z.object({
    android: z.string(),
    ios: z.string(),
  }).optional(),
  phones: z.object({
    android: z.string(),
    ios: z.string(),
  }).optional(),
})

export type DeviceCompatibility = z.infer<typeof DeviceCompatibilitySchema>

/**
 * Main Product Schema
 * Validates product data structure
 */
export const ProductSchema = z.object({
  id: z.string().min(1, "ID required"),
  name: z.string().min(1, "Product name required"), // Arabic name
  brand: z.string().min(1, "Brand required"), // e.g., "Huion"
  category: z.string().min(1, "Category required"), // e.g., "display-tablets"
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive("Original price must be positive").optional(),
  description: z.string().min(10, "Description too short"), // 1-2 sentences Arabic
  shortDescription: z.string().min(5, "Short description too short"), // For product cards
  images: z.array(ProductImageSchema).min(1, "At least 1 image required"),
  specifications: z.array(ProductSpecSchema).min(3, "At least 3 specs required"),
  keyFeatures: z.array(z.string()).min(2, "At least 2 key features"), // Max 3 bullets
  freeDelivery: z.boolean().default(false),
  deviceCompatibility: DeviceCompatibilitySchema.optional(),
  usageScenarios: z.array(z.string()).optional(),
  teacherFriendly: z.boolean().default(false),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
})

export type Product = z.infer<typeof ProductSchema>

/**
 * Product Filter/Sort Options
 */
export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
})

export type ProductFilter = z.infer<typeof ProductFilterSchema>

/**
 * Validation helper
 */
export function validateProduct(data: unknown): Product {
  return ProductSchema.parse(data)
}
