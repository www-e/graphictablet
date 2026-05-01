import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

/* ------------------------------------------------------------------ */
/*  ADMINS                                                            */
/* ------------------------------------------------------------------ */
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  PRODUCTS                                                          */
/* ------------------------------------------------------------------ */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 500 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  freeDelivery: boolean("free_delivery").default(false).notNull(),
  teacherFriendly: boolean("teacher_friendly").default(false).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  deviceCompatibility: jsonb("device_compatibility").$type<{
    computers?: { windows?: string; mac?: string; linux?: string }
    tablets?: { android?: string; ios?: string }
    phones?: { android?: string; ios?: string }
  }>(),
  keyFeatures: jsonb("key_features").$type<string[]>().default([]).notNull(),
  usageScenarios: jsonb("usage_scenarios").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  PRODUCT IMAGES  (base64 stored in DB)                             */
/* ------------------------------------------------------------------ */
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // base64 string
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  alt: varchar("alt", { length: 500 }).notNull(),
  order: integer("order").default(1).notNull(),
})

/* ------------------------------------------------------------------ */
/*  PRODUCT SPECIFICATIONS                                            */
/* ------------------------------------------------------------------ */
export const productSpecifications = pgTable("product_specifications", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 500 }).notNull(),
})

/* ------------------------------------------------------------------ */
/*  RELATIONS                                                         */
/* ------------------------------------------------------------------ */
export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  specifications: many(productSpecifications),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productSpecificationsRelations = relations(
  productSpecifications,
  ({ one }) => ({
    product: one(products, {
      fields: [productSpecifications.productId],
      references: [products.id],
    }),
  })
)

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */
export type Admin = typeof admins.$inferSelect
export type NewAdmin = typeof admins.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert

export type ProductSpecification = typeof productSpecifications.$inferSelect
export type NewProductSpecification = typeof productSpecifications.$inferInsert
