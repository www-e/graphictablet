import { router, publicProcedure } from "@/lib/trpc/init"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { db } from "@/server/db"
import { products } from "@/server/schema"
import { eq, and, gte, lte, desc } from "drizzle-orm"

export const productsRouter = router({
  getAll: publicProcedure.query(() => {
    return db.query.products.findMany({
      with: { images: true, specifications: true },
      orderBy: desc(products.createdAt),
    })
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1, "معرف المنتج مطلوب") }))
    .query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.slug, input.id),
        with: { images: true, specifications: true },
      })
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: `المنتج "${input.id}" غير موجود` })
      }
      return product
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string().min(1, "التصنيف مطلوب") }))
    .query(async ({ input }) => {
      const list = await db.query.products.findMany({
        where: eq(products.category, input.category),
        with: { images: true, specifications: true },
      })
      return list.length > 0
        ? list
        : { error: `لا توجد منتجات في التصنيف: ${input.category}`, data: [] }
    }),

  getByBrand: publicProcedure
    .input(z.object({ brand: z.string().min(1, "العلامة التجارية مطلوبة") }))
    .query(async ({ input }) => {
      const list = await db.query.products.findMany({
        where: eq(products.brand, input.brand),
        with: { images: true, specifications: true },
      })
      return list.length > 0
        ? list
        : { error: `لا توجد منتجات من العلامة: ${input.brand}`, data: [] }
    }),

  filter: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        brand: z.string().optional(),
        minPrice: z.number().nonnegative().optional(),
        maxPrice: z.number().positive().optional(),
        inStock: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = []
      if (input.category) conditions.push(eq(products.category, input.category))
      if (input.brand) conditions.push(eq(products.brand, input.brand))
      if (input.minPrice !== undefined) conditions.push(gte(products.price, input.minPrice))
      if (input.maxPrice !== undefined) conditions.push(lte(products.price, input.maxPrice))
      if (input.inStock !== undefined) conditions.push(eq(products.inStock, input.inStock))

      const where = conditions.length > 0 ? and(...conditions) : undefined

      return db.query.products.findMany({
        where,
        with: { images: true, specifications: true },
      })
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1, "كلمة البحث مطلوبة") }))
    .query(async ({ input }) => {
      const q = `%${input.query}%`
      return db.query.products.findMany({
        where: (products, { or, like }) =>
          or(
            like(products.name, q),
            like(products.description, q),
            like(products.brand, q)
          ),
        with: { images: true, specifications: true },
      })
    }),

  getFeatured: publicProcedure.query(() => {
    return db.query.products.findMany({
      where: eq(products.inStock, true),
      with: { images: true, specifications: true },
      limit: 6,
      orderBy: desc(products.createdAt),
    })
  }),

  getStats: publicProcedure.query(async () => {
    const all = await db.query.products.findMany({
      columns: { price: true, inStock: true, brand: true, category: true },
    })
    const prices = all.map((p) => p.price)
    const brands = [...new Set(all.map((p) => p.brand))]
    const categories = [...new Set(all.map((p) => p.category))]

    return {
      totalProducts: all.length,
      inStock: all.filter((p) => p.inStock).length,
      brands,
      categories,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      },
    }
  }),
})
