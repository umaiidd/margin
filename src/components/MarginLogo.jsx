import React from 'react'

export default function MarginLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded square */}
      <rect width="32" height="32" rx="9" fill="#34D399" />

      {/* Chart bars — left short, mid tall, right mid */}
      <rect x="6"  y="18" width="4.5" height="8"  rx="1.5" fill="white" opacity="0.5" />
      <rect x="13.75" y="10" width="4.5" height="16" rx="1.5" fill="white" />
      <rect x="21.5" y="14" width="4.5" height="12" rx="1.5" fill="white" opacity="0.75" />

      {/* Upward trend line */}
      <polyline
        points="8.25,20 16,12 23.75,16"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />

      {/* Dot at peak */}
      <circle cx="16" cy="12" r="1.75" fill="white" />
    </svg>
  )
}
