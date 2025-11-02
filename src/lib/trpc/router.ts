import { router } from "@/lib/trpc/init"
import { productsRouter } from "@/lib/trpc/routers/products.router"

/**
 * Main App Router
 * Combines all sub-routers
 */

export const appRouter = router({
  products: productsRouter,
})

/**
 * Export type of the router for type safety
 */
export type AppRouter = typeof appRouter
