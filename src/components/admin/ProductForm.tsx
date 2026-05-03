"use client"

import React, { useReducer, useRef, useState } from "react"
import { Icon, ICON_MAP } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

// ============================================
// TYPES
// ============================================

export interface ProductFormData {
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
  deviceCompatibility: Record<string, unknown>
  images: { data: string; mimeType: string; alt: string; order: number }[]
  specifications: { label: string; value: string }[]
}

export interface ProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  isSubmitting: boolean
}

// ============================================
// CONSTANTS & HELPERS
// ============================================

const KNOWN_BRANDS = ["Huion", "Casio", "Generic", "Wacom", "XP-Pen"]

const CATEGORY_OPTIONS = [
  { value: "display-tablets", label: "أجهزة عرض تفاعلية" },
  { value: "pen-tablets", label: "أجهزة قلم للرسم" },
  { value: "calculators", label: "آلات حاسبة" },
  { value: "accessories", label: "إكسسوارات" },
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u0621-\u064A\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60)
    .replace(/-+$/, "")
}

// ============================================
// REDUCER
// ============================================

interface State {
  data: ProductFormData
  customBrand: string
  slugTouched: boolean
  errors: Record<string, string | undefined>
}

type Action =
  | { type: "SET_FIELD"; field: keyof ProductFormData; value: unknown }
  | { type: "SET_CUSTOM_BRAND"; value: string }
  | { type: "SET_SLUG_TOUCHED"; touched: boolean }
  | { type: "ADD_TAG"; field: "keyFeatures" | "usageScenarios"; tag: string }
  | { type: "REMOVE_TAG"; field: "keyFeatures" | "usageScenarios"; index: number }
  | { type: "ADD_IMAGE"; image: ProductFormData["images"][number] }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "ADD_SPEC" }
  | { type: "UPDATE_SPEC"; index: number; key: "label" | "value"; value: string }
  | { type: "REMOVE_SPEC"; index: number }
  | { type: "SET_DEVICE_OS"; device: string; os: string; value: string }
  | { type: "SET_ERRORS"; errors: Record<string, string | undefined> }
  | { type: "RESET_ERRORS" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD": {
      const { field, value } = action
      return {
        ...state,
        data: { ...state.data, [field]: value },
        errors: { ...state.errors, [field]: undefined },
      }
    }
    case "SET_CUSTOM_BRAND":
      return {
        ...state,
        customBrand: action.value,
        errors: { ...state.errors, customBrand: undefined, brand: undefined },
      }
    case "SET_SLUG_TOUCHED":
      return { ...state, slugTouched: action.touched }
    case "ADD_TAG": {
      const arr = [...state.data[action.field], action.tag]
      return {
        ...state,
        data: { ...state.data, [action.field]: arr },
        errors: { ...state.errors, [action.field]: undefined },
      }
    }
    case "REMOVE_TAG": {
      const arr = state.data[action.field].filter((_, i) => i !== action.index)
      return { ...state, data: { ...state.data, [action.field]: arr } }
    }
    case "ADD_IMAGE":
      return {
        ...state,
        data: { ...state.data, images: [...state.data.images, action.image] },
        errors: { ...state.errors, images: undefined },
      }
    case "REMOVE_IMAGE":
      return {
        ...state,
        data: {
          ...state.data,
          images: state.data.images.filter((_, i) => i !== action.index),
        },
      }
    case "ADD_SPEC":
      return {
        ...state,
        data: {
          ...state.data,
          specifications: [
            ...state.data.specifications,
            { label: "", value: "" },
          ],
        },
        errors: { ...state.errors, specifications: undefined },
      }
    case "UPDATE_SPEC": {
      const specs = state.data.specifications.map((s, i) =>
        i === action.index ? { ...s, [action.key]: action.value } : s
      )
      return { ...state, data: { ...state.data, specifications: specs } }
    }
    case "REMOVE_SPEC":
      return {
        ...state,
        data: {
          ...state.data,
          specifications: state.data.specifications.filter(
            (_, i) => i !== action.index
          ),
        },
      }
    case "SET_DEVICE_OS": {
      const { device, os, value } = action
      const nextDevices = { ...state.data.deviceCompatibility }
      const nextDevice = {
        ...((nextDevices[device] as Record<string, string>) || {}),
      }
      if (value.trim()) {
        nextDevice[os] = value
      } else {
        delete nextDevice[os]
      }
      nextDevices[device] = nextDevice
      return { ...state, data: { ...state.data, deviceCompatibility: nextDevices } }
    }
    case "SET_ERRORS":
      return { ...state, errors: action.errors }
    case "RESET_ERRORS":
      return { ...state, errors: {} }
    default:
      return state
  }
}

function createInitialState(initialData?: ProductFormData): State {
  const base: ProductFormData = initialData ?? {
    slug: "",
    name: "",
    brand: "",
    category: "",
    price: 0,
    originalPrice: undefined,
    description: "",
    shortDescription: "",
    freeDelivery: false,
    teacherFriendly: false,
    inStock: true,
    keyFeatures: [],
    usageScenarios: [],
    deviceCompatibility: {},
    images: [],
    specifications: [],
  }

  let customBrand = ""
  let brand = base.brand

  if (brand && !KNOWN_BRANDS.includes(brand)) {
    customBrand = brand
    brand = "other"
  }

  return {
    data: { ...base, brand },
    customBrand,
    slugTouched: !!initialData,
    errors: {},
  }
}

// ============================================
// SHARED STYLES
// ============================================

const inputBase =
  "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900 transition-colors"
const inputError =
  "border-red-500 focus:border-red-500 focus:ring-red-500"

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({
  title,
  icon,
}: {
  title: string
  icon: keyof typeof ICON_MAP
}) {
  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
      <Icon name={icon} size="lg" variant="primary" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  )
}

// ============================================
// FORM FIELD (accessible wrapper)
// ============================================

interface AriaFieldProps {
  id: string
  "aria-invalid": boolean
  "aria-describedby": string | undefined
}

function FormField({
  id,
  label,
  error,
  helperText,
  children,
}: {
  id: string
  label: string
  error?: string
  helperText?: string
  children: (props: AriaFieldProps) => React.ReactNode
}) {
  const props: AriaFieldProps = {
    id,
    "aria-invalid": !!error,
    "aria-describedby": error
      ? `${id}-error`
      : helperText
        ? `${id}-helper`
        : undefined,
  }

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {children(props)}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-gray-500 mt-1">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================
// TAG INPUT
// ============================================

function TagInput({
  id,
  label,
  tags,
  onAdd,
  onRemove,
  error,
  helperText,
}: {
  id: string
  label: string
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
  error?: string
  helperText?: string
}) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const trimmed = input.trim()
      if (trimmed && !tags.includes(trimmed)) {
        onAdd(trimmed)
        setInput("")
      }
    }
  }

  return (
    <FormField id={id} label={label} error={error} helperText={helperText}>
      {({ id: fieldId, ...ariaProps }) => (
        <>
          <input
            {...ariaProps}
            id={fieldId}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(inputBase, error && inputError)}
            placeholder="اكتب ثم اضغط Enter"
          />
          <div className="flex flex-wrap gap-2 mt-2" role="list">
            {tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                role="listitem"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`إزالة ${tag}`}
                >
                  <Icon name="close" size="xs" />
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </FormField>
  )
}

// ============================================
// IMAGE UPLOADER
// ============================================

function ImageUploader({
  images,
  onAdd,
  onRemove,
  error,
}: {
  images: ProductFormData["images"]
  onAdd: (image: ProductFormData["images"][number]) => void
  onRemove: (index: number) => void
  error?: string
}) {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setFileError("حجم الملف يجب ألا يتجاوز 2 ميجابايت")
      return
    }
    setFileError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.includes(",") ? result.split(",")[1]! : result
      onAdd({
        data: base64,
        mimeType: file.type,
        alt: file.name,
        order: images.length,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    Array.from(e.dataTransfer.files).forEach(processFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const displayError = fileError || error

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="رفع الصور"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-blue-500",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        )}
      >
        <Icon name="plus" size="lg" className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">اضغط أو اسحب الصور هنا</p>
        <p className="text-xs text-gray-400 mt-1">
          الحد الأقصى 2 ميجابايت لكل صورة
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files || []).forEach(processFile)
            e.target.value = ""
          }}
        />
      </div>
      {displayError && (
        <p className="text-sm text-red-600 mt-1">{displayError}</p>
      )}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
          {images.map((img, i) => {
            const imgSrc = img.data.startsWith("path:")
              ? img.data.replace("path:", "")
              : `data:${img.mimeType};base64,${img.data}`
            return (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden border border-gray-200 bg-white"
              >
                <img
                  src={imgSrc}
                  alt={img.alt}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="إزالة الصورة"
                >
                  <Icon name="close" size="xs" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// SPEC INPUT
// ============================================

function SpecInput({
  specs,
  onAdd,
  onUpdate,
  onRemove,
  error,
}: {
  specs: ProductFormData["specifications"]
  onAdd: () => void
  onUpdate: (index: number, key: "label" | "value", value: string) => void
  onRemove: (index: number) => void
  error?: string
}) {
  return (
    <div className="space-y-3">
      {specs.map((spec, i) => (
        <div key={i} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder="المواصفة"
            value={spec.label}
            onChange={(e) => onUpdate(i, "label", e.target.value)}
            className={cn(inputBase, "flex-1", error && inputError)}
          />
          <input
            type="text"
            placeholder="القيمة"
            value={spec.value}
            onChange={(e) => onUpdate(i, "value", e.target.value)}
            className={cn(inputBase, "flex-1", error && inputError)}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="mt-2 p-1 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label="إزالة المواصفة"
          >
            <Icon name="close" size="sm" variant="error" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Icon name="plus" size="sm" />
        إضافة مواصفة
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

// ============================================
// DEVICE COMPATIBILITY SECTION
// ============================================

function DeviceCompatibilitySection({
  data,
  onChange,
}: {
  data: Record<string, unknown>
  onChange: (device: string, os: string, value: string) => void
}) {
  const sections = [
    {
      key: "computers",
      label: "أجهزة الكمبيوتر",
      osList: [
        { key: "windows", label: "Windows" },
        { key: "mac", label: "macOS" },
        { key: "linux", label: "Linux" },
      ],
    },
    {
      key: "tablets",
      label: "الأجهزة اللوحية",
      osList: [
        { key: "android", label: "Android" },
        { key: "ios", label: "iOS" },
      ],
    },
    {
      key: "phones",
      label: "الهواتف",
      osList: [
        { key: "android", label: "Android" },
        { key: "ios", label: "iOS" },
      ],
    },
  ] as const

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const deviceObj = (data[section.key] as Record<string, string>) || {}
        return (
          <fieldset
            key={section.key}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <legend className="text-sm font-semibold text-gray-900 px-2">
              {section.label}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {section.osList.map((os) => {
                const inputId = `${section.key}-${os.key}`
                return (
                  <div key={os.key}>
                    <label
                      htmlFor={inputId}
                      className="block text-xs font-medium text-gray-600 mb-1"
                    >
                      {os.label}
                    </label>
                    <input
                      id={inputId}
                      type="text"
                      value={deviceObj[os.key] || ""}
                      onChange={(e) =>
                        onChange(section.key, os.key, e.target.value)
                      }
                      className={inputBase}
                      placeholder={`مثال: ${os.label} 10+`}
                    />
                  </div>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const [state, dispatch] = useReducer(reducer, createInitialState(initialData))

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    dispatch({ type: "SET_FIELD", field: "name", value: name })
    if (!initialData && !state.slugTouched) {
      dispatch({ type: "SET_FIELD", field: "slug", value: generateSlug(name) })
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FIELD", field: "slug", value: e.target.value })
    dispatch({ type: "SET_SLUG_TOUCHED", touched: true })
  }

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value
    dispatch({ type: "SET_FIELD", field: "brand", value: brand })
    if (brand !== "other") {
      dispatch({ type: "SET_CUSTOM_BRAND", value: "" })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalBrand =
      state.data.brand === "other"
        ? state.customBrand.trim()
        : state.data.brand

    const cleanedSpecs = state.data.specifications.filter(
      (s) => s.label.trim() || s.value.trim()
    )

    const validationErrors: Record<string, string> = {}

    if (!state.data.slug.trim())
      validationErrors.slug = "الرابط المختصر مطلوب"
    if (!state.data.name.trim())
      validationErrors.name = "اسم المنتج مطلوب"
    if (!finalBrand) {
      if (state.data.brand === "other") {
        validationErrors.customBrand = "العلامة التجارية المخصصة مطلوبة"
      } else {
        validationErrors.brand = "العلامة التجارية مطلوبة"
      }
    }
    if (!state.data.category)
      validationErrors.category = "التصنيف مطلوب"
    if (!state.data.price || state.data.price <= 0)
      validationErrors.price = "السعر يجب أن يكون أكبر من صفر"
    if (
      !state.data.description.trim() ||
      state.data.description.trim().length < 10
    )
      validationErrors.description = "الوصف يجب أن يكون 10 أحرف على الأقل"
    if (
      !state.data.shortDescription.trim() ||
      state.data.shortDescription.trim().length < 5
    )
      validationErrors.shortDescription =
        "الوصف المختصر يجب أن يكون 5 أحرف على الأقل"
    if (state.data.images.length === 0)
      validationErrors.images = "يجب إضافة صورة واحدة على الأقل"
    if (state.data.keyFeatures.length === 0)
      validationErrors.keyFeatures = "يجب إضافة ميزة واحدة على الأقل"
    if (cleanedSpecs.length === 0)
      validationErrors.specifications = "يجب إضافة مواصفة واحدة على الأقل"

    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: validationErrors })
      return
    }

    const finalData: ProductFormData = {
      ...state.data,
      brand: finalBrand,
      specifications: cleanedSpecs,
    }

    onSubmit(finalData)
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="space-y-8">
      {/* Basic Info */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="المعلومات الأساسية" icon="info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="name" label="اسم المنتج" error={state.errors.name}>
            {({ id, ...aria }) => (
              <input
                {...aria}
                id={id}
                type="text"
                value={state.data.name}
                onChange={handleNameChange}
                className={cn(inputBase, state.errors.name && inputError)}
                placeholder="اسم المنتج"
              />
            )}
          </FormField>

          <FormField id="slug" label="الرابط المختصر" error={state.errors.slug}>
            {({ id, ...aria }) => (
              <input
                {...aria}
                id={id}
                type="text"
                value={state.data.slug}
                onChange={handleSlugChange}
                className={cn(inputBase, state.errors.slug && inputError)}
                placeholder="slug-name"
              />
            )}
          </FormField>

          <FormField
            id="brand"
            label="العلامة التجارية"
            error={state.errors.brand}
          >
            {({ id, ...aria }) => (
              <select
                {...aria}
                id={id}
                value={state.data.brand}
                onChange={handleBrandChange}
                className={cn(inputBase, state.errors.brand && inputError)}
              >
                <option value="">اختر العلامة التجارية</option>
                {KNOWN_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="other">أخرى</option>
              </select>
            )}
          </FormField>

          {state.data.brand === "other" && (
            <FormField
              id="customBrand"
              label="علامة تجارية مخصصة"
              error={state.errors.customBrand}
            >
              {({ id, ...aria }) => (
                <input
                  {...aria}
                  id={id}
                  type="text"
                  value={state.customBrand}
                  onChange={(e) =>
                    dispatch({ type: "SET_CUSTOM_BRAND", value: e.target.value })
                  }
                  className={cn(
                    inputBase,
                    state.errors.customBrand && inputError
                  )}
                  placeholder="أدخل العلامة التجارية"
                />
              )}
            </FormField>
          )}

          <FormField
            id="category"
            label="التصنيف"
            error={state.errors.category}
          >
            {({ id, ...aria }) => (
              <select
                {...aria}
                id={id}
                value={state.data.category}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "category",
                    value: e.target.value,
                  })
                }
                className={cn(inputBase, state.errors.category && inputError)}
              >
                <option value="">اختر التصنيف</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>
      </section>

      {/* Pricing & Delivery */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="السعر والتوصيل" icon="truck" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="price" label="السعر" error={state.errors.price}>
            {({ id, ...aria }) => (
              <input
                {...aria}
                id={id}
                type="number"
                min={0}
                step={1}
                value={state.data.price || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "price",
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                className={cn(inputBase, state.errors.price && inputError)}
                placeholder="0.00"
              />
            )}
          </FormField>

          <FormField
            id="originalPrice"
            label="السعر الأصلي (اختياري)"
            error={state.errors.originalPrice}
          >
            {({ id, ...aria }) => (
              <input
                {...aria}
                id={id}
                type="number"
                min={0}
                step={1}
                value={state.data.originalPrice ?? ""}
                onChange={(e) => {
                  const val = e.target.value
                  dispatch({
                    type: "SET_FIELD",
                    field: "originalPrice",
                    value: val ? parseFloat(val) : undefined,
                  })
                }}
                className={cn(
                  inputBase,
                  state.errors.originalPrice && inputError
                )}
                placeholder="0.00"
              />
            )}
          </FormField>
        </div>

        <div className="flex flex-wrap gap-6 mt-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.data.freeDelivery}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "freeDelivery",
                  value: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              توصيل مجاني
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.data.teacherFriendly}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "teacherFriendly",
                  value: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              مناسب للمعلمين
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.data.inStock}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "inStock",
                  value: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              متوفر في المخزن
            </span>
          </label>
        </div>
      </section>

      {/* Descriptions */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="الوصف" icon="list" />
        <FormField
          id="description"
          label="الوصف الكامل"
          error={state.errors.description}
        >
          {({ id, ...aria }) => (
            <textarea
              {...aria}
              id={id}
              rows={4}
              value={state.data.description}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
              className={cn(inputBase, state.errors.description && inputError)}
              placeholder="أدخل وصفاً تفصيلياً للمنتج..."
            />
          )}
        </FormField>

        <FormField
          id="shortDescription"
          label="الوصف المختصر"
          error={state.errors.shortDescription}
          helperText="وصف مختصر يظهر في قوائم المنتجات"
        >
          {({ id, ...aria }) => (
            <textarea
              {...aria}
              id={id}
              rows={2}
              value={state.data.shortDescription}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "shortDescription",
                  value: e.target.value,
                })
              }
              className={cn(
                inputBase,
                state.errors.shortDescription && inputError
              )}
              placeholder="وصف مختصر..."
            />
          )}
        </FormField>
      </section>

      {/* Tags */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="المميزات وسيناريوهات الاستخدام" icon="star" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TagInput
            id="keyFeatures"
            label="المميزات الرئيسية"
            tags={state.data.keyFeatures}
            onAdd={(tag) =>
              dispatch({ type: "ADD_TAG", field: "keyFeatures", tag })
            }
            onRemove={(index) =>
              dispatch({ type: "REMOVE_TAG", field: "keyFeatures", index })
            }
            error={state.errors.keyFeatures}
            helperText="اكتب الميزة ثم اضغط Enter"
          />
          <TagInput
            id="usageScenarios"
            label="سيناريوهات الاستخدام"
            tags={state.data.usageScenarios}
            onAdd={(tag) =>
              dispatch({ type: "ADD_TAG", field: "usageScenarios", tag })
            }
            onRemove={(index) =>
              dispatch({ type: "REMOVE_TAG", field: "usageScenarios", index })
            }
            error={state.errors.usageScenarios}
            helperText="اكتب السيناريو ثم اضغط Enter"
          />
        </div>
      </section>

      {/* Images */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="الصور" icon="eye" />
        <ImageUploader
          images={state.data.images}
          onAdd={(image) => dispatch({ type: "ADD_IMAGE", image })}
          onRemove={(index) => dispatch({ type: "REMOVE_IMAGE", index })}
          error={state.errors.images}
        />
      </section>

      {/* Specifications */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="المواصفات التقنية" icon="settings" />
        <SpecInput
          specs={state.data.specifications}
          onAdd={() => dispatch({ type: "ADD_SPEC" })}
          onUpdate={(index, key, value) =>
            dispatch({ type: "UPDATE_SPEC", index, key, value })
          }
          onRemove={(index) => dispatch({ type: "REMOVE_SPEC", index })}
          error={state.errors.specifications}
        />
      </section>

      {/* Device Compatibility */}
      <section className="bg-gray-50 rounded-lg p-6">
        <SectionHeader title="توافق الأجهزة" icon="phone" />
        <DeviceCompatibilitySection
          data={state.data.deviceCompatibility}
          onChange={(device, os, value) =>
            dispatch({ type: "SET_DEVICE_OS", device, os, value })
          }
        />
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Icon name="spinner" size="sm" animated />}
          {initialData ? "تحديث المنتج" : "إنشاء المنتج"}
        </button>
      </div>
    </form>
  )
}
