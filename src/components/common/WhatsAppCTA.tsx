import React from "react"
import Link from "next/link"
import { generateWhatsAppLink, formatPrice } from "@/lib/constants"
import { Button } from "@/components/common/Button"
import { Icon } from "@/components/icons/Icons"

interface WhatsAppCTAProps {
  productName: string
  productPrice: number
  productId?: string
  variant?: "button" | "link"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
}

/**
 * WhatsApp CTA Component
 * Generates pre-filled WhatsApp message link for product ordering
 *
 * @example
 * <WhatsAppCTA productName="Huion 1060P" productPrice={1500} />
 */
export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  productName,
  productPrice,
  productId,
  variant = "button",
  size = "md",
  fullWidth = false,
  className,
}) => {
  const whatsappLink = generateWhatsAppLink(productName, formatPrice(productPrice))

  if (variant === "link") {
    return (
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 font-medium ${className || ""}`}
      >
        <Icon name="whatsapp" size="sm" />
        اطلب الآن عبر واتساب
      </Link>
    )
  }

  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <Button
        variant="primary"
        size={size}
        icon="whatsappBrand"
        fullWidth={fullWidth}
        className={`bg-green-600 hover:bg-green-700 focus:ring-green-500 ${className || ""}`}
      >
        اطلب الآن عبر واتساب
      </Button>
    </a>
  )
}

export default WhatsAppCTA
