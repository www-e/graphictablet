import React from "react"
import { DeviceCompatibility as DeviceCompatibilityType } from "@/lib/data/types"
import { Icon } from "@/components/icons/Icons"
import { cn } from "@/lib/utils/cn"

interface DeviceCompatibilityProps {
  compatibility: DeviceCompatibilityType
  className?: string
}

/**
 * Device Compatibility Component
 * Shows what devices the product works with in an easy-to-understand format
 */
export const DeviceCompatibility: React.FC<DeviceCompatibilityProps> = ({
  compatibility,
  className
}) => {
  const compatibilitySections = [
    {
      title: "أجهزة الكمبيوتر",
      icon: "grid" as const,
      systems: compatibility.computers,
      color: "blue"
    },
    {
      title: "الأجهزة اللوحية",
      icon: "box" as const,
      systems: compatibility.tablets,
      color: "green"
    },
    {
      title: "الهواتف الذكية",
      icon: "phone" as const,
      systems: compatibility.phones,
      color: "purple"
    }
  ]

  const colorVariants = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      icon: "text-purple-600"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          متوافق مع جميع أجهزتك
        </h3>
        <p className="text-gray-600">
          يعمل مع مجموعة واسعة من الأجهزة والأنظمة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compatibilitySections.map((section, index) => {
          if (!section.systems) return null
          
          const variants = colorVariants[section.color as keyof typeof colorVariants]
          
          return (
            <div
              key={index}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:scale-105",
                variants.bg,
                variants.border
              )}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-3">
                  <Icon name={section.icon} size="lg" className={variants.icon} />
                </div>
                <h4 className={cn("font-bold text-lg", variants.text)}>
                  {section.title}
                </h4>
              </div>

              <div className="space-y-3">
                {Object.entries(section.systems).map(([device, version]) => (
                  <div key={device} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 capitalize">
                      {device === 'windows' && 'Windows'}
                      {device === 'mac' && 'macOS'}
                      {device === 'linux' && 'Linux'}
                      {device === 'android' && 'Android'}
                      {device === 'ios' && 'iOS'}
                    </span>
                    <span className="text-gray-600 text-right max-w-[120px]">
                      {version}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Compatibility Badge */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <Icon name="check" size="sm" />
          متوافق تماماً مع جميع الأنظمة
        </div>
      </div>
    </div>
  )
}

export default DeviceCompatibility