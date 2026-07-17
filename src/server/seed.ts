import "dotenv/config"
import { db } from "./db"
import { admins, products, productImages, productSpecifications } from "./schema"
import bcrypt from "bcryptjs"
import { PRODUCTS } from "@/lib/data/products"

async function seed() {
  console.log("🌱 Seeding database...")

  // 1. Seed admin
  const adminPasswordHash = await bcrypt.hash("ashraf123", 12)
  await db
    .insert(admins)
    .values({
      username: "ashraf",
      passwordHash: adminPasswordHash,
    })
    .onConflictDoNothing({ target: admins.username })
  console.log("✅ Admin seeded (ashraf / ashraf123)")

  // 2. Seed products
  for (const p of PRODUCTS) {
    const [inserted] = await db
      .insert(products)
      .values({
        slug: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        description: p.description,
        shortDescription: p.shortDescription,
        freeDelivery: p.freeDelivery,
        teacherFriendly: p.teacherFriendly,
        inStock: p.inStock,
        deviceCompatibility: p.deviceCompatibility ?? {},
        keyFeatures: p.keyFeatures,
        usageScenarios: p.usageScenarios ?? [],
      })
      .returning()

    const productId = inserted.id

    // Insert images (store path as data for now, or fetch file and base64)
    // For initial seed, we keep paths in the `data` field prefixed with a marker
    // so the UI knows to use public paths for seeded products
    if (p.images?.length) {
      await db.insert(productImages).values(
        p.images.map((img) => ({
          productId,
          data: img.data,
          mimeType: img.mimeType,
          alt: img.alt,
          order: img.order ?? 1,
        }))
      )
    }

    // Insert specs
    if (p.specifications?.length) {
      await db.insert(productSpecifications).values(
        p.specifications.map((spec) => ({
          productId,
          label: spec.label,
          value: spec.value,
        }))
      )
    }

    console.log(`✅ Product seeded: ${p.name}`)
  }

  console.log("🎉 Seeding complete!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
