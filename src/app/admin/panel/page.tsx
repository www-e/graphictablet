"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { getImageSrc } from "@/lib/image-utils"
import { Icon } from "@/components/icons/Icons"
import { useToast } from "@/components/common/Toast"
import Image from "next/image"

interface AdminProduct {
  id: number
  slug: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number | null
  description: string
  shortDescription: string
  freeDelivery: boolean
  teacherFriendly: boolean
  inStock: boolean
  keyFeatures: string[]
  usageScenarios: string[] | null
  deviceCompatibility: Record<string, unknown> | null
  images: { data: string; mimeType: string; alt: string; order: number }[]
  specifications: { label: string; value: string }[]
}

interface ProductFormData {
  slug: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  description: string
  shortDescription: string
  freeDelivery: boolean
  teacherFriendly: boolean
  inStock: boolean
  keyFeatures: string[]
  usageScenarios: string[]
  images: { data: string; mimeType: string; alt: string; order: number }[]
  specifications: { label: string; value: string }[]
}

const MAX_IMAGE_SIZE_MB = 2

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0621-\u064A\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60)
    .replace(/-+$/, "")
}

const emptyForm: ProductFormData = {
  slug: "",
  name: "",
  brand: "",
  category: "display-tablets",
  price: 0,
  originalPrice: undefined,
  description: "",
  shortDescription: "",
  freeDelivery: false,
  teacherFriendly: false,
  inStock: true,
  keyFeatures: [""],
  usageScenarios: [""],
  images: [],
  specifications: [{ label: "", value: "" }],
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-4">
      <Icon name={icon as any} size="sm" variant="primary" />
      <h4 className="font-bold text-gray-800">{title}</h4>
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
  )
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-400 mt-1">{children}</p>
}

export default function AdminPanelPage() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const { showToast } = useToast()

  const { data: admin, isLoading: adminLoading } = trpc.admin.me.useQuery()
  const { data: products, isLoading: productsLoading } = trpc.admin.listProducts.useQuery(undefined, {
    enabled: !!admin,
  })

  const createMutation = trpc.admin.createProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      setShowForm(false)
      setFormData({ ...emptyForm })
      setPreviewImages([])
      showToast("تم إضافة المنتج بنجاح!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      setShowForm(false)
      setEditingId(null)
      setFormData({ ...emptyForm })
      setPreviewImages([])
      showToast("تم تحديث المنتج بنجاح!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const deleteMutation = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      showToast("تم حذف المنتج!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({ ...emptyForm })
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [imageError, setImageError] = useState("")

  useEffect(() => {
    if (!adminLoading && !admin) {
      router.push("/admin/signin")
    }
  }, [adminLoading, admin, router])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/signin")
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name),
    }))
  }

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, currentImagesLength: number) => {
      const files = e.target.files
      if (!files) return
      setImageError("")

      const newImages: { data: string; mimeType: string; alt: string; order: number }[] = []
      const newPreviews: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          setImageError(`الصورة "${file.name}" أكبر من ${MAX_IMAGE_SIZE_MB} ميجا. الرجاء اختيار صورة أصغر.`)
          continue
        }

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        const mimeType = file.type
        const data = base64.split(",")[1]
        newImages.push({
          data,
          mimeType,
          alt: file.name,
          order: currentImagesLength + i + 1,
        })
        newPreviews.push(base64)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
      setPreviewImages((prev) => [...prev, ...newPreviews])
    },
    []
  )

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }))
  }

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ""] }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((f, i) => (i === index ? value : f)),
    }))
  }

  const addScenario = () => {
    setFormData((prev) => ({ ...prev, usageScenarios: [...prev.usageScenarios, ""] }))
  }

  const removeScenario = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      usageScenarios: prev.usageScenarios.filter((_, i) => i !== index),
    }))
  }

  const updateScenario = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      usageScenarios: prev.usageScenarios.map((s, i) => (i === index ? value : s)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.slug.trim()) {
      showToast("المعرف (slug) مطلوب. اكتب اسم المنتج أولاً.", "error")
      return
    }

    const payload = {
      ...formData,
      keyFeatures: formData.keyFeatures.filter(Boolean),
      usageScenarios: formData.usageScenarios.filter(Boolean),
      specifications: formData.specifications.filter((s) => s.label && s.value),
    }

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: payload })
    } else {
      createMutation.mutate(payload as Parameters<typeof createMutation.mutate>[0])
    }
  }

  const startEdit = (product: AdminProduct) => {
    setEditingId(product.id)
    setFormData({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      description: product.description,
      shortDescription: product.shortDescription,
      freeDelivery: product.freeDelivery,
      teacherFriendly: product.teacherFriendly,
      inStock: product.inStock,
      keyFeatures: product.keyFeatures?.length ? product.keyFeatures : [""],
      usageScenarios: product.usageScenarios?.length ? product.usageScenarios : [""],
      images:
        product.images?.map((img) => ({
          data: img.data,
          mimeType: img.mimeType,
          alt: img.alt,
          order: img.order,
        })) || [],
      specifications: product.specifications?.length
        ? product.specifications.map((s) => ({ label: s.label, value: s.value }))
        : [{ label: "", value: "" }],
      deviceCompatibility: product.deviceCompatibility || {},
    })
    setPreviewImages(
      product.images?.map((img) =>
        img.data.startsWith("path:") ? img.data.replace("path:", "") : `data:${img.mimeType};base64,${img.data}`
      ) || []
    )
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const startCreate = () => {
    setEditingId(null)
    setFormData({ ...emptyForm })
    setPreviewImages([])
    setImageError("")
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (adminLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Icon name="grid" size="base" className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">{admin?.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">إجمالي المنتجات</p>
            <p className="text-2xl font-bold text-blue-600">{products?.length || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">متوفر</p>
            <p className="text-2xl font-bold text-green-600">
              {products?.filter((p) => p.inStock).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">غير متوفر</p>
            <p className="text-2xl font-bold text-red-600">
              {products?.filter((p) => !p.inStock).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">تصنيفات</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(products?.map((p) => p.category)).size || 0}
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">المنتجات</h2>
          <button
            onClick={startCreate}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Icon name="plus" size="sm" />
            إضافة منتج
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "تعديل منتج" : "إضافة منتج جديد"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <Icon name="close" size="base" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* SECTION: Basic Info */}
              <section>
                <SectionHeader title="المعلومات الأساسية" icon="info" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FieldLabel required>اسم المنتج</FieldLabel>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                      placeholder="مثال: جهاز رسم تفاعلي Huion"
                      required
                    />
                    <HelperText>اسم المنتج بالعربي أو الإنجليزي</HelperText>
                  </div>

                  <div>
                    <FieldLabel required>المعرف (رابط المنتج)</FieldLabel>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base font-mono text-sm"
                      placeholder="huion-1060p"
                      required
                    />
                    <HelperText>يتم توليده تلقائياً من الاسم. يمكنك تعديله.</HelperText>
                  </div>

                  <div>
                    <FieldLabel required>العلامة التجارية</FieldLabel>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      placeholder="Huion, Casio, ..."
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel required>التصنيف</FieldLabel>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base bg-white"
                    >
                      <option value="display-tablets">أجهزة عرض تفاعلية</option>
                      <option value="pen-tablets">أجهزة قلم للرسم</option>
                      <option value="calculators">آلات حاسبة</option>
                      <option value="accessories">إكسسوارات</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION: Pricing */}
              <section>
                <SectionHeader title="السعر" icon="percent" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>السعر الحالي (جنيه)</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={formData.price || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      placeholder="3800"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>السعر قبل الخصم (اختياري)</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      placeholder="4500"
                    />
                    <HelperText>اكتب السعر الأصلي لإظهار الخصم على المنتج</HelperText>
                  </div>
                </div>
              </section>

              {/* SECTION: Description */}
              <section>
                <SectionHeader title="الوصف" icon="file" />
                <div className="space-y-4">
                  <div>
                    <FieldLabel required>وصف كامل</FieldLabel>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
                      placeholder="وصف تفصيلي للمنتج..."
                      required
                    />
                    <HelperText>وصف طويل يظهر في صفحة المنتج</HelperText>
                  </div>
                  <div>
                    <FieldLabel required>وصف مختصر</FieldLabel>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      placeholder="جملة واحدة تلخص المنتج"
                      required
                    />
                    <HelperText>جملة قصيرة تظهر في بطاقة المنتج</HelperText>
                  </div>
                </div>
              </section>

              {/* SECTION: Settings */}
              <section>
                <SectionHeader title="الإعدادات" icon="settings" />
                <div className="flex flex-wrap gap-6 bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.freeDelivery}
                      onChange={(e) => setFormData((p) => ({ ...p, freeDelivery: e.target.checked }))}
                      className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">شحن مجاني</span>
                      <HelperText>يظهر شعار شحن مجاني على المنتج</HelperText>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.teacherFriendly}
                      onChange={(e) => setFormData((p) => ({ ...p, teacherFriendly: e.target.checked }))}
                      className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">مناسب للمعلمين</span>
                      <HelperText>يظهر شارة مناسب للمعلمين</HelperText>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData((p) => ({ ...p, inStock: e.target.checked }))}
                      className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">متوفر في المخزون</span>
                      <HelperText>ألغِ التحديد إذا نفذت الكمية</HelperText>
                    </div>
                  </label>
                </div>
              </section>

              {/* SECTION: Images */}
              <section>
                <SectionHeader title="الصور" icon="image" />
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, formData.images.length)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Icon name="download" size="lg" variant="primary" />
                      <span className="text-sm font-medium text-gray-700">اضغط لاختيار صور المنتج</span>
                      <span className="text-xs text-gray-400">PNG, JPG, JPEG — بحد أقصى 2 ميجا لكل صورة</span>
                    </label>
                  </div>

                  {imageError && (
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{imageError}</div>
                  )}

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {previewImages.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                          <Image src={src} alt="preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1.5 left-1.5 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors"
                            title="حذف الصورة"
                          >
                            <Icon name="close" size="xs" />
                          </button>
                          <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                            {i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION: Specifications */}
              <section>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="list" size="sm" variant="primary" />
                    <h4 className="font-bold text-gray-800">المواصفات التقنية</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    + إضافة مواصفة
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.specifications.map((spec, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="العنوان (مثال: مساحة العمل)"
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      />
                      <input
                        type="text"
                        placeholder="القيمة (مثال: 254 × 158 ملم)"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
                        title="حذف"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: Key Features */}
              <section>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="star" size="sm" variant="primary" />
                    <h4 className="font-bold text-gray-800">المميزات الرئيسية</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    + إضافة ميزة
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`ميزة ${i + 1}`}
                        value={feature}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
                        title="حذف"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: Usage Scenarios */}
              <section>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="box" size="sm" variant="primary" />
                    <h4 className="font-bold text-gray-800">سيناريوهات الاستخدام</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addScenario}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    + إضافة سيناريو
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.usageScenarios.map((scenario, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`سيناريو ${i + 1}`}
                        value={scenario}
                        onChange={(e) => updateScenario(i, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                      />
                      <button
                        type="button"
                        onClick={() => removeScenario(i)}
                        className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
                        title="حذف"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md disabled:opacity-50 transition-all text-base"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "جاري الحفظ..."
                    : editingId
                    ? "تحديث المنتج"
                    : "حفظ المنتج"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-base"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">المنتج</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">السعر</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">المخزون</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {product.images[0] && (
                          <Image
                            src={getImageSrc(product.images[0])}
                            alt={product.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{product.price} جنيه</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "متوفر" : "غير متوفر"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(product as unknown as AdminProduct)}
                        className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {products?.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  {product.images[0] && (
                    <Image
                      src={getImageSrc(product.images[0])}
                      alt={product.images[0].alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">{product.price} جنيه</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                    product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "متوفر" : "غير متوفر"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(product as unknown as AdminProduct)}
                    className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Icon name="box" size="2xl" className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 text-lg">لا توجد منتجات حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط "إضافة منتج" لإضافة أول منتج</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4 mx-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="warning" size="lg" variant="error" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">تأكيد الحذف</h3>
            <p className="text-gray-500 text-sm">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteMutation.mutate({ id: deleteConfirm })
                  setDeleteConfirm(null)
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
