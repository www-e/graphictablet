import { NextResponse } from "next/server"
import { serializeAdminCookie } from "@/server/auth"

export async function POST() {
  const cookie = serializeAdminCookie("", true)
  const response = NextResponse.json({ success: true })
  response.headers.set("Set-Cookie", cookie)
  return response
}
