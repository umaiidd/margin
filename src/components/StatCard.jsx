import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import clsx from 'clsx'

const CARD_CONFIGS = {
  income: {
    label: 'Total Income',
    Icon: TrendingUp,
    color: 'accent-green',
    textColor: 'text-accent-green',
    bgAccent: 'rgba(52, 211, 153, 0.06)',
    borderAccent: 'rgba(52, 211, 153, 0.15)',
    glowClass: 'glow-green',
    iconBg: 'rgba(52, 211, 153, 0.1)',
  },
  expense: {
    label: 'Total Expenses',
    Icon: TrendingDown,
    color: 'accent-red',
    textColor: 'text-accent-red',
    bgAccent: 'rgba(248, 113, 113, 0.06)',
    borderAccent: 'rgba(248, 113, 113, 0.15)',
    glowClass: 'glow-red',
    iconBg: 'rgba(248, 113, 113, 0.1)',
  },
  balance: {
    label: 'Net Balance',
    Icon: Wallet,
    color: 'accent-blue',
    textColor: 'text-accent-blue',
    bgAccent: 'rgba(96, 165, 250, 0.06)',
    borderAccent: 'rgba(96, 165, 250, 0.15)',
    glowClass: '',
    iconBg: 'rgba(96, 165, 250, 0.1)',
  },
}

export default function StatCard({ variant, amount, index = 0 }) {
  const config = CARD_CONFIGS[variant]
  const cardRef = useRef(null)
  const animated = useAnimatedNumber(amount, 700)

  const isBalance = variant === 'balance'
  const isNegativeBalance = isBalance && amount < 0

  const displayColor = isBalance
    ? amount >= 0 ? 'text-accent-green' : 'text-accent-red'
    : config.textColor

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power3.out',
      }
    )
  }, [])

  return (
    <div
      ref={cardRef}
      className="stat-card group cursor-default border-t-2"
      style={{
        background: `linear-gradient(135deg, ${config.bgAccent}, rgba(255,255,255,0.01))`,
        border: `1px solid ${isNegativeBalance ? 'rgba(248, 113, 113, 0.15)' : config.borderAccent}`,
        borderTop: `2px solid ${isNegativeBalance ? '#f87171' : config.color}`,
        opacity: 0,
      }}
    >
      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top left, ${config.bgAccent} 0%, transparent 70%)`,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <p className="text-black/40 text-xs font-display uppercase tracking-widest mb-1">
            {config.label}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: config.iconBg }}
        >
          <config.Icon
            size={16}
            className={clsx(displayColor, 'transition-colors duration-300')}
          />
        </div>
      </div>

      {/* Amount */}
      <div className="relative">
        <p className={clsx('stat-amount leading-none', displayColor, {
          'text-2xl': formatCurrency(animated, { compact: true }).length > 12,
          'text-3xl': formatCurrency(animated, { compact: true }).length <= 12,
        })}>
          {variant === 'balance' && amount < 0 ? '−' : ''}
          {formatCurrency(Math.abs(animated), { compact: true })}
        </p>

        {/* Transaction count badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isNegativeBalance ? '#f87171' : config.bgAccent.includes('52') ? '#34d399' : config.bgAccent.includes('96') ? '#f87171' : '#60a5fa' }}
          />
          <span className="currency-text text-black/40 text-xs">
            {formatCurrency(Math.abs(amount), { compact: false })}
          </span>
        </div>
      </div>
    </div>
  )
}
