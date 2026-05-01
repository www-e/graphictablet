"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { getImageSrc } from "@/lib/image-utils"
import { Icon } from "@/components/icons/Icons"
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
  deviceCompatibility: {
    computers?: { windows?: string; mac?: string; linux?: string }
    tablets?: { android?: string; ios?: string }
    phones?: { android?: string; ios?: string }
  } | null
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
  deviceCompatibility?: {
    computers?: { windows?: string; mac?: string; linux?: string }
    tablets?: { android?: string; ios?: string }
    phones?: { android?: string; ios?: string }
  }
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

export default function AdminPanelPage() {
  const router = useRouter()
  const utils = trpc.useUtils()

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
      alert("تم إضافة المنتج بنجاح!")
    },
    onError: (err) => alert("خطأ: " + err.message),
  })

  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      setShowForm(false)
      setEditingId(null)
      setFormData({ ...emptyForm })
      setPreviewImages([])
      alert("تم تحديث المنتج بنجاح!")
    },
    onError: (err) => alert("خطأ: " + err.message),
  })

  const deleteMutation = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      alert("تم حذف المنتج!")
    },
    onError: (err) => alert("خطأ: " + err.message),
  })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({ ...emptyForm })
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    if (!adminLoading && !admin) {
      router.push("/admin/signin")
    }
  }, [adminLoading, admin, router])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/signin")
  }

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, currentImagesLength: number) => {
      const files = e.target.files
      if (!files) return

      const newImages: { data: string; mimeType: string; alt: string; order: number }[] = []
      const newPreviews: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
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
  }

  const startCreate = () => {
    setEditingId(null)
    setFormData({ ...emptyForm })
    setPreviewImages([])
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

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">إجمالي المنتجات</p>
            <p className="text-2xl font-bold text-blue-600">{products?.length || 0}</p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">المنتجات</h2>
          <button
            onClick={startCreate}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Icon name="plus" size="sm" />
            إضافة منتج
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "تعديل منتج" : "إضافة منتج جديد"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="close" size="base" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المعرف (slug)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العلامة التجارية</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="display-tablets">أجهزة عرض</option>
                    <option value="pen-tablets">أجهزة قلم</option>
                    <option value="calculators">آلات حاسبة</option>
                    <option value="accessories">إكسسوارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأصلي (اختياري)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, originalPrice: e.target.value ? Number(e.target.value) : undefined }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف مختصر</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.freeDelivery}
                    onChange={(e) => setFormData((p) => ({ ...p, freeDelivery: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">شحن مجاني</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teacherFriendly}
                    onChange={(e) => setFormData((p) => ({ ...p, teacherFriendly: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">مناسب للمعلمين</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData((p) => ({ ...p, inStock: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">متوفر في المخزون</span>
                </label>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الصور</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, formData.images.length)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex flex-wrap gap-3 mt-3">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={src} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">المواصفات</label>
                  <button type="button" onClick={addSpec} className="text-sm text-blue-600 hover:text-blue-700">
                    + إضافة
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="العنوان"
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="القيمة"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">المميزات الرئيسية</label>
                  <button type="button" onClick={addFeature} className="text-sm text-blue-600 hover:text-blue-700">
                    + إضافة
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Scenarios */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">سيناريوهات الاستخدام</label>
                  <button type="button" onClick={addScenario} className="text-sm text-blue-600 hover:text-blue-700">
                    + إضافة
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.usageScenarios.map((scenario, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={scenario}
                        onChange={(e) => updateScenario(i, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeScenario(i)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow-md disabled:opacity-50"
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
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images[0] && (
                          <Image
                            src={getImageSrc(product.images[0])}
                            alt={product.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.price} جنيه</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "متوفر" : "غير متوفر"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors text-sm"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors text-sm"
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
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "متوفر" : "غير متوفر"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
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
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Icon name="box" size="2xl" variant="muted" className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">لا توجد منتجات حالياً</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
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
