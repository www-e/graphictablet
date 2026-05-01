import { router } from "@/lib/trpc/init"
import { productsRouter } from "@/lib/trpc/routers/products.router"
import { adminRouter } from "@/lib/trpc/routers/admin.router"

export const appRouter = router({
  products: productsRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
