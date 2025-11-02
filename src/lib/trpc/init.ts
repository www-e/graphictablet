import { initTRPC } from "@trpc/server"

/**
 * TRPC Initialization
 * Sets up the tRPC server with error formatting
 */

export const t = initTRPC.create()

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router
export const publicProcedure = t.procedure

export default t
