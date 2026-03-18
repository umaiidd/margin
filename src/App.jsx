import React, { useRef, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { gsap } from 'gsap'
import { TransactionProvider, useTransactions } from './context/TransactionContext'
import Header from './components/Header'
import StatCard from './components/StatCard'
import TransactionForm from './components/TransactionForm'
import Charts from './components/Charts'
import TransactionList from './components/TransactionList'

function Dashboard() {
  const { totalIncome, totalExpenses, netBalance } = useTransactions()
  const heroRef = useRef(null)

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hero-line'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
        }
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-mesh">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* Hero Section */}
        <div ref={heroRef} className="pt-12 pb-10 border-b border-accent-green/8">
          <p className="hero-line opacity-0 text-accent-green/70 text-xs font-display uppercase tracking-[0.2em] mb-3">
            Personal Finance
          </p>
          <h1 className="hero-line opacity-0 font-display font-bold text-black text-4xl sm:text-5xl leading-[1.1] tracking-tight">
            Your money,
            <br />
            <span className="text-accent-green/50">clearly visualized.</span>
          </h1>
          <p className="hero-line opacity-0 text-black/40 text-base mt-4 max-w-sm leading-relaxed">
            Track every rupee. Understand your financial health at a glance.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard variant="income" amount={totalIncome} index={0} />
          <StatCard variant="expense" amount={totalExpenses} index={1} />
          <StatCard variant="balance" amount={netBalance} index={2} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* Left column — Form + Chart */}
          <div className="space-y-6 lg:sticky lg:top-20">
            <TransactionForm />
            <Charts />
          </div>

          {/* Right column — Transaction History */}
          <div>
            <TransactionList />
          </div>
        </div>
      </main>

      {/* Ambient orbs with animation */}
      <div className="fixed top-0 left-1/4 w-96 h-96 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)',
          transform: 'translateY(-50%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div className="fixed bottom-20 right-1/3 w-80 h-80 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite 1s',
        }}
      />
      <div className="fixed top-1/3 right-0 w-96 h-96 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />
      <div className="fixed -top-40 -left-40 w-96 h-96 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 14s ease-in-out infinite 1.5s',
        }}
      />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}

export default function App() {
  return (
    <TransactionProvider>
      <Dashboard />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3000 }}
      />
    </TransactionProvider>
  )
}
