"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { Icon } from "@/components/icons/Icons"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto mx-auto max-w-sm w-full rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-blue-50 border border-blue-200 text-blue-800"
            }`}
            dir="rtl"
          >
            <Icon
              name={toast.type === "success" ? "check" : toast.type === "error" ? "warning" : "info"}
              size="sm"
              className={
                toast.type === "success"
                  ? "text-green-600"
                  : toast.type === "error"
                  ? "text-red-600"
                  : "text-blue-600"
              }
            />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
