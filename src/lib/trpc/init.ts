import { initTRPC, TRPCError } from "@trpc/server"
import type { Admin } from "@/server/schema"

interface Context {
  admin: Admin | null
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const adminProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.admin) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول كمسؤول" })
    }
    return next({ ctx: { admin: ctx.admin } })
  })
)

export default t
