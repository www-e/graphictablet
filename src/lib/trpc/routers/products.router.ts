import { router, publicProcedure } from "@/lib/trpc/init"
import { z } from "zod"
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
} from "@/lib/data/products"
import { ProductFilterSchema } from "@/lib/data/types"

/**
 * Products Router
 * All product-related queries for the e-commerce store
 */

export const productsRouter = router({
  /**
   * Get all products
   * @returns Array of all products
   */
  getAll: publicProcedure.query(() => {
    return getAllProducts()
  }),

  /**
   * Get single product by ID
   * @param id - Product ID
   * @returns Product details or null if not found
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID required"),
      })
    )
.query(({ input }) => {
      const product = getProductById(input.id)
      if (!product) {
        throw new Error(`Product with ID "${input.id}" not found`)
      }
      return product
    }),

  /**
   * Get products by category
   * @param category - Category name
   * @returns Array of products in category
   */
  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string().min(1, "Category required"),
      })
    )
    .query(({ input }) => {
      const products = getProductsByCategory(input.category)
      return products.length > 0
        ? products
        : { error: `No products found in category: ${input.category}`, data: [] }
    }),

  /**
   * Get products by brand
   * @param brand - Brand name
   * @returns Array of products from brand
   */
  getByBrand: publicProcedure
    .input(
      z.object({
        brand: z.string().min(1, "Brand required"),
      })
    )
    .query(({ input }) => {
      const products = getProductsByBrand(input.brand)
      return products.length > 0
        ? products
        : { error: `No products found from brand: ${input.brand}`, data: [] }
    }),

  /**
   * Filter products with multiple criteria
   * @param category - Optional category filter
   * @param brand - Optional brand filter
   * @param minPrice - Optional minimum price
   * @param maxPrice - Optional maximum price
   * @param inStock - Optional stock filter
   * @returns Filtered array of products
   */
  filter: publicProcedure
    .input(ProductFilterSchema)
    .query(({ input }) => {
      let products = getAllProducts()

      // Filter by category
      if (input.category) {
        products = products.filter((p) => p.category === input.category)
      }

      // Filter by brand
      if (input.brand) {
        products = products.filter((p) => p.brand === input.brand)
      }

      // Filter by price range
      if (input.minPrice !== undefined && input.maxPrice !== undefined) {
        products = products.filter(
          (p) => p.price >= input.minPrice! && p.price <= input.maxPrice!
        )
      } else if (input.minPrice !== undefined) {
        products = products.filter((p) => p.price >= input.minPrice!)
      } else if (input.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= input.maxPrice!)
      }

      // Filter by stock status
      if (input.inStock !== undefined) {
        products = products.filter((p) => p.inStock === input.inStock)
      }

      return products
    }),

  /**
   * Search products by name
   * @param query - Search query
   * @returns Array of matching products
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query required"),
      })
    )
    .query(({ input }) => {
      const query = input.query.toLowerCase()
      return getAllProducts().filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      )
    }),

  /**
   * Get featured products (in stock, for homepage)
   * @returns Limited array of featured products
   */
  getFeatured: publicProcedure.query(() => {
    return getAllProducts()
      .filter((p) => p.inStock)
      .slice(0, 6)
  }),

  /**
   * Get product statistics
   * @returns Total count, brands, categories, price range
   */
  getStats: publicProcedure.query(() => {
    const products = getAllProducts()
    const brands = [...new Set(products.map((p) => p.brand))]
    const categories = [...new Set(products.map((p) => p.category))]
    const prices = products.map((p) => p.price)

    return {
      totalProducts: products.length,
      inStock: products.filter((p) => p.inStock).length,
      brands: brands,
      categories: categories,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      },
    }
  }),
})
