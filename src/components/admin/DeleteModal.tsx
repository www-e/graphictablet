"use client"

import React, { useEffect, useRef } from "react"
import { Icon } from "@/components/icons/Icons"

interface DeleteModalProps {
  productName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export default function DeleteModal({
  productName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Focus the cancel button on mount
    cancelButtonRef.current?.focus()

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4 mx-4"
      >
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="warning" size="lg" variant="error" />
        </div>
        <h3
          id="delete-modal-title"
          className="text-lg font-bold text-gray-900"
        >
          تأكيد الحذف
        </h3>
        <p className="text-gray-500 text-sm">
          هل أنت متأكد من حذف {productName}؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            حذف
          </button>
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
