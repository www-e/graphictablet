# JIRA Tickets — Admin Panel & Dynamic Store

## DB-1: Install & Configure Drizzle ORM + Neon
- [ ] Uninstall `@prisma/client` and `prisma`
- [ ] Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `postgres`
- [ ] Create `drizzle.config.ts`
- [ ] Create `src/server/db.ts` singleton with Neon connection
- [ ] Verify DB connection works

## DB-2: Design Database Schema
- [ ] Create `src/server/schema.ts`
- [ ] `admins` table: id, username (unique), passwordHash, createdAt
- [ ] `products` table: id, name, brand, category, price, originalPrice, description, shortDescription, freeDelivery, teacherFriendly, inStock, deviceCompatibility (jsonb), keyFeatures (jsonb), usageScenarios (jsonb), createdAt, updatedAt
- [ ] `product_images` table: id, productId (fk), data (text/base64), mimeType, alt, order
- [ ] `product_specifications` table: id, productId (fk), label, value
- [ ] Set up Drizzle relational query config
- [ ] Generate and run migration

## DB-3: Seed Data
- [ ] Create `src/server/seed.ts`
- [ ] Seed admin user: `admin` / `admin123` (hashed with bcrypt)
- [ ] Migrate all products from `src/lib/data/products.ts` into DB
- [ ] Verify seed data in Neon

## AUTH-1: Admin Authentication Flow
- [ ] Install `bcryptjs` and `@types/bcryptjs`
- [ ] Create `src/server/auth.ts` with verifyAdmin and session cookie helpers
- [ ] Create tRPC context that reads admin session cookie
- [ ] Create `adminProcedure` middleware (returns 401 if not admin)
- [ ] Create `admin.login` tRPC mutation
- [ ] Create `admin.logout` tRPC mutation
- [ ] Create `admin.me` tRPC query

## API-1: Admin CRUD Router
- [ ] Create `src/lib/trpc/routers/admin.router.ts`
- [ ] `admin.createProduct` — Zod validation, insert product + images + specs
- [ ] `admin.updateProduct` — Zod validation, update product + relations
- [ ] `admin.deleteProduct` — delete by id with cascade
- [ ] `admin.listProducts` — return all products with relations
- [ ] Register router in app router

## API-2: Public Store Migration
- [ ] Rewrite `src/lib/trpc/routers/products.router.ts` to use Drizzle queries
- [ ] `products.getAll` — select all with images/specs
- [ ] `products.getById` — select by slug/id
- [ ] `products.getByCategory` — filter by category
- [ ] `products.getByBrand` — filter by brand
- [ ] `products.filter` — multi-criteria filter
- [ ] `products.search` — text search on name/description/brand
- [ ] `products.getFeatured` — in-stock products limited
- [ ] `products.getStats` — aggregation query

## UI-1: Admin Sign-In Page (`/admin/signin`)
- [ ] Create `src/app/admin/signin/page.tsx`
- [ ] Mobile-first, responsive, RTL Arabic layout
- [ ] Username + password form with validation
- [ ] Error messages in Arabic
- [ ] Loading states
- [ ] Redirect to `/admin/panel` on success
- [ ] Redirect away if already logged in
- [ ] Match existing site styling (rounded cards, shadows, blue/red accents)

## UI-2: Admin Dashboard (`/admin/panel`)
- [ ] Create `src/app/admin/panel/page.tsx`
- [ ] Route guard: redirect to signin if not authenticated
- [ ] Desktop: clean data table with all products
- [ ] Mobile: card list layout for products
- [ ] "إضافة منتج جديد" button → collapsible form
- [ ] Product form: all fields matching Product schema
- [ ] Image upload: file input → base64 conversion
- [ ] Specifications: dynamic add/remove rows
- [ ] Key features & usage scenarios: dynamic tags
- [ ] Save / Cancel actions
- [ ] Delete with confirmation dialog
- [ ] Toast notifications for success/error
- [ ] Responsive, RTL, Arabic labels

## UI-3: Frontend Store Migration
- [ ] Update `src/app/page.tsx` to use `products.getFeatured` tRPC query
- [ ] Update `src/app/products/page.tsx` to use `products.getAll`
- [ ] Update `src/app/products/[id]/page.tsx` to use `products.getById`
- [ ] Update `ProductGrid` and `ProductCard` to handle base64 images
- [ ] Remove static `getAllProducts` imports from pages
- [ ] Ensure SSR/SSG still works where possible

## QA-1: Verification & Build
- [ ] `pnpm run type-check` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run build` passes
- [ ] Admin login works end-to-end
- [ ] Product creation works
- [ ] Product deletion works
- [ ] Public homepage loads products from DB
- [ ] Product detail page loads correctly
- [ ] Images render correctly on all pages
- [ ] Mobile responsiveness verified

---

## Agent Assignment
| Ticket | Agent | Status |
|--------|-------|--------|
| DB-1, DB-2, DB-3 | database-architect | 🟡 In Progress |
| AUTH-1, API-1, API-2 | backend-developer | 🟡 In Progress |
| UI-1, UI-2, UI-3 | react-specialist + ui-designer | 🟡 In Progress |
| QA-1 | testing-qa-expert | 🔴 Pending |
