import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/trpc/router"
import { getAdminFromCookie } from "@/server/auth"

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => {
      const cookieHeader = request.headers.get("cookie") || ""
      const admin = await getAdminFromCookie(cookieHeader)
      return { admin }
    },
    onError: ({ path, error }) => {
      console.error(`❌ tRPC Error on '${path}': ${error.message}`)
    },
  })

export { handler as GET, handler as POST }
