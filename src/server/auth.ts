import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { admins } from "./schema"
import { eq } from "drizzle-orm"

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "sportology-admin-secret-key-2026"
)

const COOKIE_NAME = "admin_session"

export async function verifyAdmin(username: string, password: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.username, username))
  if (!admin) return null
  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return null
  return admin
}

export async function createAdminToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 })
    return payload.username as string
  } catch {
    return null
  }
}

export async function getAdminFromCookie(cookieHeader: string) {
  const token = parseCookie(cookieHeader, COOKIE_NAME)
  if (!token) return null
  const username = await verifyAdminToken(token)
  if (!username) return null
  const [admin] = await db.select().from(admins).where(eq(admins.username, username))
  return admin ?? null
}

export function parseCookie(header: string, name: string) {
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return match ? match[1] : null
}

export function serializeAdminCookie(token: string, clear = false) {
  const value = clear ? "" : token
  const maxAge = clear ? 0 : 60 * 60 * 24 // 24 hours
  const options = [
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ")
  return `${COOKIE_NAME}=${value}; ${options}`
}
