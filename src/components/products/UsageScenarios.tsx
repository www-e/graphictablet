import React from "react"
import { Icon } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

interface UsageScenariosProps {
  scenarios: string[]
  teacherFriendly?: boolean
  className?: string
}

/**
 * Usage Scenarios Component
 * Shows different ways to use the product, especially helpful for teachers
 */
export const UsageScenarios: React.FC<UsageScenariosProps> = ({
  scenarios,
  teacherFriendly = false,
  className
}) => {
  const scenarioIcons: Array<keyof typeof import('@/components/icons/Icons').ICON_MAP> = [
    "star",     // Education/Teaching
    "heart",    // Personal use
    "check",    // Professional work
    "box",      // Office/Studio use
    "download", // Digital content creation
    "eye",      // Presentation/Display
    "settings", // Technical use
    "phone"     // Mobile use
  ]

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          سيناريوهات الاستخدام
        </h3>
        <p className="text-gray-600">
          اكتشف الطرق المختلفة لاستخدام هذا المنتج
        </p>
        {teacherFriendly && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Icon name="check" size="sm" />
            مناسب جداً للمعلمين والطلاب
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => {
          const icon = scenarioIcons[index % scenarioIcons.length]
          const colors = [
            "bg-blue-50 border-blue-200 text-blue-700",
            "bg-green-50 border-green-200 text-green-700",
            "bg-purple-50 border-purple-200 text-purple-700",
            "bg-orange-50 border-orange-200 text-orange-700",
            "bg-pink-50 border-pink-200 text-pink-700",
            "bg-indigo-50 border-indigo-200 text-indigo-700",
            "bg-yellow-50 border-yellow-200 text-yellow-700",
            "bg-teal-50 border-teal-200 text-teal-700"
          ]
          
          const colorClass = colors[index % colors.length]

          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-105 group cursor-pointer",
                colorClass
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Icon name={icon} size="base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    {scenario}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Support Information */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-xl p-6">
          <h4 className="font-bold text-blue-900 mb-2">دعم تركيب مجاني</h4>
          <p className="text-blue-700 text-sm">
            فريق الدعم متوفر لمساعدتك في استخدام الجهاز والحل السريع لأي مشاكل
          </p>
        </div>
      </div>
    </div>
  )
}

export default UsageScenarios