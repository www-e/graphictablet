# Sportology Admin Panel & Dynamic Store Migration Plan

## Overview
Migrate the static product store to a dynamic PostgreSQL-backed store using **Drizzle ORM** and **Neon**. Add a secure admin panel with username/password authentication for CRUD operations. All images stored in Neon DB as base64.

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | **Drizzle ORM** | Fast, type-safe, SQL-like, lightweight |
| DB Provider | **Neon PostgreSQL** | Already configured in `.env` |
| Auth | **Cookie-based sessions** | Simple, no external providers needed |
| Image Storage | **Base64 in DB** | Low scale (max 10 items, 40 images), user request |
| Admin Routes | `/admin/signin`, `/admin/panel` | Clean, intuitive |
| API | **tRPC 10** (existing) | Extend existing routers |

## Phase 1: Foundation
1. Uninstall Prisma, install Drizzle
2. Configure `drizzle.config.ts`
3. Design schema (`products`, `product_images`, `product_specifications`, `admins`)
4. Create DB client singleton (`src/server/db.ts`)
5. Run migration to Neon

## Phase 2: Backend
1. Seed admin user via TS script
2. Seed existing products into DB
3. Build auth middleware (`adminProcedure`)
4. Build admin tRPC router (create, update, delete, list)
5. Migrate public products router to query DB

## Phase 3: Frontend
1. Build `/admin/signin` — responsive, RTL Arabic, mobile-first
2. Build `/admin/panel` — responsive CRUD dashboard, card-list on mobile
3. Migrate homepage, products page, product detail to dynamic queries
4. Ensure image rendering supports base64 data URIs

## Phase 4: Verification
1. Type-check, lint, build
2. Test auth flow end-to-end
3. Test product CRUD
4. Test public store pages

## Performance & UX Notes
- Mobile-first admin dashboard (table → cards on small screens)
- Base64 images acceptable for <50 images total
- Drizzle relational queries with `with` for clean joins
- Zod validation on all inputs
- Toast notifications for admin actions
