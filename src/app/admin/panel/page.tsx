"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { Icon } from "@/components/icons/Icons"
import { useToast } from "@/components/common/Toast"
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm"
import ProductList, { AdminProduct } from "@/components/admin/ProductList"
import DeleteModal from "@/components/admin/DeleteModal"

function adminProductToFormData(product: AdminProduct): ProductFormData {
  return {
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
    keyFeatures: product.keyFeatures ?? [],
    usageScenarios: product.usageScenarios ?? [],
    deviceCompatibility: product.deviceCompatibility ?? {},
    images: product.images.map((img) => ({
      data: img.data,
      mimeType: img.mimeType,
      alt: img.alt,
      order: img.order,
    })),
    specifications: product.specifications.map((s) => ({
      label: s.label,
      value: s.value,
    })),
  }
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
      setEditingProduct(null)
      showToast("تم إضافة المنتج بنجاح!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      setShowForm(false)
      setEditingProduct(null)
      showToast("تم تحديث المنتج بنجاح!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const deleteMutation = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      utils.admin.listProducts.invalidate()
      setDeleteConfirmId(null)
      showToast("تم حذف المنتج!", "success")
    },
    onError: (err) => showToast("خطأ: " + err.message, "error"),
  })

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  useEffect(() => {
    if (!adminLoading && !admin) {
      router.push("/admin/signin")
    }
  }, [adminLoading, admin, router])

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/signin")
  }, [router])

  const handleCreate = useCallback(() => {
    setEditingProduct(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleEdit = useCallback((product: AdminProduct) => {
    setEditingProduct(product)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleCancel = useCallback(() => {
    setShowForm(false)
    setEditingProduct(null)
  }, [])

  const handleSubmit = useCallback(
    (data: ProductFormData) => {
      if (editingProduct) {
        updateMutation.mutate({ id: editingProduct.id, data })
      } else {
        createMutation.mutate(data)
      }
    },
    [editingProduct, updateMutation, createMutation]
  )

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId !== null) {
      deleteMutation.mutate({ id: deleteConfirmId })
    }
  }, [deleteConfirmId, deleteMutation])

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmId(null)
  }, [])

  const deletingProduct = products?.find((p) => p.id === deleteConfirmId)

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
          {!showForm && (
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Icon name="plus" size="sm" />
              إضافة منتج
            </button>
          )}
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="إغلاق النموذج"
              >
                <Icon name="close" size="base" />
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                initialData={editingProduct ? adminProductToFormData(editingProduct) : undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </div>
        )}

        {/* Product List */}
        <ProductList
          products={products ?? []}
          onEdit={handleEdit}
          onDelete={setDeleteConfirmId}
        />
      </main>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteModal
          productName={deletingProduct.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  )
}
