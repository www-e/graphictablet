import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

// Neon HTTP client — ideal for serverless (Vercel)
// Uses HTTP fetch instead of WebSocket connections
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
