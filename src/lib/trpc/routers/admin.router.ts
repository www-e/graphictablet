import { router, publicProcedure, adminProcedure } from "@/lib/trpc/init"
import { z } from "zod"
import { db } from "@/server/db"
import { products, productImages, productSpecifications } from "@/server/schema"
import { eq, desc } from "drizzle-orm"

const ProductImageInput = z.object({
  data: z.string().min(1, "صورة مطلوبة"),
  mimeType: z.string().default("image/jpeg"),
  alt: z.string().min(1, "وصف الصورة مطلوب"),
  order: z.number().int().default(1),
})

const ProductSpecInput = z.object({
  label: z.string().min(1, "اسم المواصفة مطلوب"),
  value: z.string().min(1, "قيمة المواصفة مطلوبة"),
})

const BaseProductInput = z.object({
  slug: z.string().min(1, "المعرف مطلوب"),
  name: z.string().min(1, "اسم المنتج مطلوب"),
  brand: z.string().min(1, "العلامة التجارية مطلوبة"),
  category: z.string().min(1, "التصنيف مطلوب"),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  originalPrice: z.number().positive().optional(),
  description: z.string().min(10, "الوصف قصير جداً"),
  shortDescription: z.string().min(5, "الوصف المختصر قصير جداً"),
  freeDelivery: z.boolean().default(false),
  teacherFriendly: z.boolean().default(false),
  inStock: z.boolean().default(true),
  deviceCompatibility: z
    .object({
      computers: z.object({ windows: z.string().optional(), mac: z.string().optional(), linux: z.string().optional() }).optional(),
      tablets: z.object({ android: z.string().optional(), ios: z.string().optional() }).optional(),
      phones: z.object({ android: z.string().optional(), ios: z.string().optional() }).optional(),
    })
    .optional(),
  keyFeatures: z.array(z.string()).min(1, "ميزة واحدة على الأقل"),
  usageScenarios: z.array(z.string()).optional(),
})

export const adminRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.admin ? { username: ctx.admin.username } : null
  }),

  listProducts: adminProcedure.query(async () => {
    return db.query.products.findMany({
      with: { images: true, specifications: true },
      orderBy: desc(products.createdAt),
    })
  }),

  createProduct: adminProcedure
    .input(
      BaseProductInput.extend({
        images: z.array(ProductImageInput).min(1, "صورة واحدة على الأقل"),
        specifications: z.array(ProductSpecInput).min(1, "مواصفة واحدة على الأقل"),
      })
    )
    .mutation(async ({ input }) => {
      const { images, specifications, ...productData } = input

      const [product] = await db
        .insert(products)
        .values(productData)
        .returning()

      if (images.length) {
        await db.insert(productImages).values(
          images.map((img) => ({ ...img, productId: product.id }))
        )
      }

      if (specifications.length) {
        await db.insert(productSpecifications).values(
          specifications.map((spec) => ({ ...spec, productId: product.id }))
        )
      }

      return db.query.products.findFirst({
        where: eq(products.id, product.id),
        with: { images: true, specifications: true },
      })
    }),

  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: BaseProductInput.partial().extend({
          images: z.array(ProductImageInput).optional(),
          specifications: z.array(ProductSpecInput).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input
      const { images, specifications, ...productData } = data

      if (Object.keys(productData).length > 0) {
        await db.update(products).set(productData).where(eq(products.id, id))
      }

      if (images) {
        await db.delete(productImages).where(eq(productImages.productId, id))
        if (images.length) {
          await db.insert(productImages).values(
            images.map((img) => ({ ...img, productId: id }))
          )
        }
      }

      if (specifications) {
        await db.delete(productSpecifications).where(eq(productSpecifications.productId, id))
        if (specifications.length) {
          await db.insert(productSpecifications).values(
            specifications.map((spec) => ({ ...spec, productId: id }))
          )
        }
      }

      return db.query.products.findFirst({
        where: eq(products.id, id),
        with: { images: true, specifications: true },
      })
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input.id))
      return { success: true }
    }),
})
