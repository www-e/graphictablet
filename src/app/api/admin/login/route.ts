import { NextResponse } from "next/server"
import { verifyAdmin, createAdminToken, serializeAdminCookie } from "@/server/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      )
    }

    const admin = await verifyAdmin(username, password)
    if (!admin) {
      return NextResponse.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    const token = await createAdminToken(admin.username)
    const cookie = serializeAdminCookie(token)

    const response = NextResponse.json({ success: true, admin: { username: admin.username } })
    response.headers.set("Set-Cookie", cookie)
    return response
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
