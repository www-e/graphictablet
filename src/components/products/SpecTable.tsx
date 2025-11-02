import React from "react"
import { ProductSpec } from "@/lib/data/types"
import { cn } from "@/lib/utils/cn"

interface SpecTableProps {
  specifications: ProductSpec[]
  className?: string
}

/**
 * Specification Table Component
 * Displays product specifications in table format
 */
export const SpecTable: React.FC<SpecTableProps> = ({ specifications, className }) => {
  if (specifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد مواصفات متاحة
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <tbody>
          {specifications.map((spec, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b",
                idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                "hover:bg-blue-50 transition-colors"
              )}
            >
              <td className="px-4 py-3 font-medium text-gray-900 w-2/5 md:w-1/3">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-gray-700 text-right">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SpecTable
