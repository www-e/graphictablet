import React from "react"
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"
import {
  faShoppingCart,
  faHeart,
  faStar,
  faCheck,
  faTimes,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faSearch,
  faBars,
  faTh,
  faList,
  faFilter,
  faArrowRight,
  faArrowLeft,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faSpinner,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faTruck,
  faBox,
  faGift,
  faPercent,
  faEye,
  faDownload,
  faShare,
  faHome,
  faUser,
  faSignOut,
  faSignIn,
  faCog,
  faBell,
  faClock,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"
import {
  faWhatsapp,
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
  faFacebook as faFacebookBrand,
  faWhatsapp as faWhatsappBrand,
  faInstagram as faInstagramBrand,
  faTwitter as faTwitterBrand,
  faYoutube as faYoutubeBrand,
} from "@fortawesome/free-brands-svg-icons"

// ============================================
// ICON WRAPPER COMPONENT
// ============================================

interface IconProps extends Omit<FontAwesomeIconProps, "icon" | "size"> {
  name: keyof typeof ICON_MAP
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  variant?: "default" | "primary" | "success" | "error" | "warning" | "info"
  animated?: boolean
  className?: string
}

/**
 * Icon Map - All available icons
 * Maps human-readable names to Font Awesome icons
 */
export const ICON_MAP = {
  // Commerce
  shoppingCart: faShoppingCart,
  heart: faHeart,
  star: faStar,
  gift: faGift,
  percent: faPercent,

  // Actions
  check: faCheck,
  close: faTimes,
  search: faSearch,
  download: faDownload,
  share: faShare,
  eye: faEye,

  // Navigation
  chevronRight: faChevronRight,
  chevronLeft: faChevronLeft,
  chevronDown: faChevronDown,
  chevronUp: faChevronUp,
  arrowRight: faArrowRight,
  arrowLeft: faArrowLeft,
  home: faHome,

  // Menu
  menu: faBars,
  grid: faTh,
  list: faList,
  filter: faFilter,

  // Contact
  phone: faPhone,
  email: faEnvelope,
  location: faMapMarkerAlt,
  whatsapp: faWhatsapp,

  // Status
  spinner: faSpinner,
  warning: faExclamationTriangle,
  info: faInfoCircle,
  success: faCheckCircle,

  // Delivery
  truck: faTruck,
  box: faBox,

  // Account
  user: faUser,
  signOut: faSignOut,
  signIn: faSignIn,
  settings: faCog,
  notification: faBell,
  clock: faClock,

  // Social (Solid)
  facebook: faFacebook,
  instagram: faInstagram,
  twitter: faTwitter,
  linkedin: faLinkedin,
  youtube: faYoutube,

  // Social (Brands)
  facebookBrand: faFacebookBrand,
  whatsappBrand: faWhatsappBrand,
  instagramBrand: faInstagramBrand,
  twitterBrand: faTwitterBrand,
  youtubeBrand: faYoutubeBrand,
} as const

/**
 * Size mapping for icons
 */
const SIZE_MAP: Record<string, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  base: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
}

/**
 * Variant (color) mapping for icons
 */
const VARIANT_MAP: Record<string, string> = {
  default: "text-gray-600",
  primary: "text-blue-600",
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-500",
}

/**
 * Icon Component
 * Renders Font Awesome icons with proper styling
 *
 * @example
 * <Icon name="shoppingCart" size="lg" variant="primary" />
 * <Icon name="whatsapp" animated className="text-green-600" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = "base",
  variant = "default",
  animated = false,
  className,
  ...props
}) => {
  const icon = ICON_MAP[name]

  if (!icon) {
    console.warn(`Icon "${name}" not found in ICON_MAP`)
    return null
  }

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.base
  const variantClass = VARIANT_MAP[variant]
  const animationClass = animated ? "animate-spin" : ""

  const baseClasses = `${sizeClass} ${variantClass} ${animationClass} ${className || ""}`

  return (
    <FontAwesomeIcon
      icon={icon as IconDefinition}
      className={baseClasses}
      aria-hidden="true"
      {...props}
    />
  )
}

// ============================================
// CONVENIENCE ICON COMPONENTS
// ============================================

/**
 * WhatsApp Icon with brand color
 */
export const WhatsAppIcon: React.FC<{ size?: IconProps["size"] }> = ({ size = "base" }) => (
  <Icon name="whatsappBrand" size={size} className="text-green-600" />
)

/**
 * Loading Spinner Icon
 */
export const LoadingIcon: React.FC<{ size?: IconProps["size"] }> = ({ size = "lg" }) => (
  <Icon name="spinner" size={size} animated variant="primary" />
)

/**
 * Error Icon
 */
export const ErrorIcon: React.FC<{ size?: IconProps["size"] }> = ({ size = "lg" }) => (
  <Icon name="warning" size={size} variant="error" />
)

/**
 * Success Icon
 */
export const SuccessIcon: React.FC<{ size?: IconProps["size"] }> = ({ size = "lg" }) => (
  <Icon name="success" size={size} variant="success" />
)

/**
 * Info Icon
 */
export const InfoIcon: React.FC<{ size?: IconProps["size"] }> = ({ size = "base" }) => (
  <Icon name="info" size={size} variant="info" />
)

export default Icon
