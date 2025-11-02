import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/trpc/router"

/**
 * tRPC HTTP Handler
 * Handles all tRPC requests at /api/trpc/[trpc]
 */

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({}),
    onError: ({ path, error }) => {
      console.error(`❌ tRPC Error on '${path}': ${error.message}`)
    },
  })

export { handler as GET, handler as POST }
