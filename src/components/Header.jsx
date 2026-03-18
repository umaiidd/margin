import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MarginLogo from './MarginLogo'

export default function Header() {
  const headerRef = useRef(null)

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 opacity-0 border-b"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(240,253,250,0.95))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottomColor: 'rgba(52, 211, 153, 0.15)',
        boxShadow: '0 2px 12px rgba(52, 211, 153, 0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <MarginLogo size={34} />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-black text-base tracking-tight">
              Margin
            </span>
            <span className="text-accent-green/60 text-[10px] font-medium uppercase tracking-wider">
              Finance
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(52, 211, 153, 0.08)' }}
        >
          <span className="text-black/70 text-xs font-medium">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </span>
        </div>

      </div>
    </header>
  )
}