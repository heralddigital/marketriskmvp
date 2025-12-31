import React from 'react'

/**
 * MarketRisk Logo Component
 * 
 * The logo represents credit risk monitoring SaaS:
 * 1. Shield shape - represents protection and security
 * 2. Alert/warning triangle - represents risk alerts and early warnings
 * 3. Chart/graph lines - represents credit data and risk trends
 * 
 * This creates a visual metaphor for "protecting your business through intelligent credit risk monitoring"
 */
export default function Logo({ size = 32, variant = 'default', className = '' }) {
  const isDark = variant === 'dark' || variant === 'inverse'
  const primaryColor = isDark ? '#DCE7DC' : 'var(--brand-mughal-green)'
  const secondaryColor = isDark ? '#A3B18A' : 'var(--brand-pistachio)'
  const accentColor = isDark ? '#588157' : 'var(--brand-mughal-green-2)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="marketrisk Logo"
    >
      {/* Shield Base - Protection */}
      <path
        d="M16 2L6 6V14C6 20.5 10.5 26.5 16 30C21.5 26.5 26 20.5 26 14V6L16 2Z"
        fill={primaryColor}
        fillOpacity="0.15"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner Shield - Core Protection */}
      <path
        d="M16 4.5L8.5 7.5V14C8.5 19 12 23.5 16 26.5C20 23.5 23.5 19 23.5 14V7.5L16 4.5Z"
        fill={primaryColor}
        fillOpacity="0.1"
        stroke={primaryColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Alert/Warning Triangle - Risk Alerts */}
      <path
        d="M16 8L20 16H12L16 8Z"
        fill={secondaryColor}
        fillOpacity="0.9"
      />
      <path
        d="M16 8L20 16H12L16 8Z"
        stroke={primaryColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Exclamation Mark - Alert Symbol */}
      <line
        x1="16"
        y1="11"
        x2="16"
        y2="13.5"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="15.5"
        r="0.8"
        fill={primaryColor}
      />

      {/* Credit Risk Chart Lines - Bottom */}
      <path
        d="M9 22L11.5 20.5L14 22L16.5 19.5L19 21L21.5 19.5L23 21"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
      
      {/* Data points on chart */}
      <circle cx="9" cy="22" r="1.2" fill={accentColor} opacity="0.8" />
      <circle cx="14" cy="22" r="1.2" fill={accentColor} opacity="0.8" />
      <circle cx="19" cy="21" r="1.2" fill={accentColor} opacity="0.8" />
      <circle cx="23" cy="21" r="1.2" fill={accentColor} opacity="0.8" />
    </svg>
  )
}

/**
 * Logo with Text - Full brand mark
 * "market" is normal weight, "risk" is bold
 */
export function LogoWithText({ size = 32, variant = 'default', showText = true, className = '' }) {
  const isDark = variant === 'dark' || variant === 'inverse'
  const textColor = isDark ? '#DCE7DC' : 'var(--text-primary)'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={size} variant={variant} />
      {showText && (
        <span
          className="text-lg"
          style={{ color: textColor }}
        >
          <span>market</span><span className="font-bold">risk</span>
        </span>
      )}
    </div>
  )
}

/**
 * Compact Logo - Icon only, optimized for small spaces
 */
export function LogoCompact({ size = 24, variant = 'default', className = '' }) {
  const isDark = variant === 'dark' || variant === 'inverse'
  const primaryColor = isDark ? '#DCE7DC' : 'var(--brand-mughal-green)'
  const secondaryColor = isDark ? '#A3B18A' : 'var(--brand-pistachio)'
  const accentColor = isDark ? '#588157' : 'var(--brand-mughal-green-2)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="marketrisk Logo"
    >
      {/* Simplified Shield */}
      <path
        d="M12 2L5 5V11C5 15.5 8.5 19.5 12 22C15.5 19.5 19 15.5 19 11V5L12 2Z"
        fill={primaryColor}
        fillOpacity="0.15"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Alert/Warning Triangle */}
      <path
        d="M12 6L14.5 11H9.5L12 6Z"
        fill={secondaryColor}
        fillOpacity="0.9"
      />
      <path
        d="M12 6L14.5 11H9.5L12 6Z"
        stroke={primaryColor}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Exclamation Mark */}
      <line
        x1="12"
        y1="8.5"
        x2="12"
        y2="10"
        stroke={primaryColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="11"
        r="0.6"
        fill={primaryColor}
      />
      
      {/* Credit Risk Chart Line */}
      <path
        d="M7 16L9 15L11 15.5L13 14L15 14.5L17 13.5"
        stroke={primaryColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  )
}

