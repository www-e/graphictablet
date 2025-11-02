import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/lib/trpc/router"

/**
 * tRPC React Client
 * Type-safe client for all frontend queries
 */

export const trpc = createTRPCReact<AppRouter>()
