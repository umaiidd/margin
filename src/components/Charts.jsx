import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  DoughnutController,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { gsap } from 'gsap'
import { PieChart, BarChart2 } from 'lucide-react'
import { useTransactions } from '../context/TransactionContext'
import { formatCurrency, formatPercent } from '../utils/format'
import clsx from 'clsx'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  DoughnutController
)

const CHART_FONT = 'DM Sans'

const tooltipPlugin = {
  backgroundColor: '#f3f3f3',
  borderColor: 'rgba(0,0,0,0.08)',
  borderWidth: 1,
  titleColor: 'rgba(0,0,0,0.9)',
  bodyColor: 'rgba(0,0,0,0.6)',
  titleFont: { family: CHART_FONT, size: 12, weight: '600' },
  bodyFont: { family: CHART_FONT, size: 12 },
  padding: 12,
  cornerRadius: 10,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
  boxPadding: 4,
}

export default function Charts() {
  const { expenseByCategory, incomeByCategory, CATEGORY_COLORS, CATEGORY_EMOJIS, transactions } = useTransactions()
  const [chartType, setChartType] = useState('doughnut')
  const [view, setView] = useState('expense')
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      )
    }
  }, [])

  const dataSource = view === 'expense' ? expenseByCategory : incomeByCategory
  const categories = Object.keys(dataSource)
  const values = Object.values(dataSource)
  const total = values.reduce((s, v) => s + v, 0)
  const isEmpty = categories.length === 0

  const colors = categories.map(cat => CATEGORY_COLORS[cat] || '#94a3b8')
  const alphaColors = colors.map(c => c + '33')

  const doughnutData = {
    labels: categories,
    datasets: [{
      data: values,
      backgroundColor: alphaColors,
      borderColor: colors,
      borderWidth: 1.5,
      hoverBackgroundColor: colors.map(c => c + '55'),
      hoverBorderColor: colors,
      hoverOffset: 6,
    }],
  }

  const barData = {
    labels: categories,
    datasets: [{
      label: view === 'expense' ? 'Expenses' : 'Income',
      data: values,
      backgroundColor: alphaColors,
      borderColor: colors,
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipPlugin,
        callbacks: {
          label: ctx => {
            const val = ctx.raw
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0
            return `  ${formatCurrency(val)} · ${pct}%`
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 600,
      easing: 'easeInOutQuart',
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipPlugin,
        callbacks: {
          label: ctx => `  ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
        ticks: {
          color: 'rgba(0,0,0,0.25)',
          font: { family: CHART_FONT, size: 10 },
          callback: v => formatCurrency(v, { compact: true }),
        },
        border: { color: 'transparent' },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: 'rgba(0,0,0,0.5)',
          font: { family: CHART_FONT, size: 11 },
        },
        border: { color: 'transparent' },
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuart',
    },
  }

  return (
    <div ref={containerRef} className="glass rounded-2xl p-6 opacity-0 border-l-2 border-accent-blue/40">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-black">Breakdown</h3>
          <p className="text-black/30 text-xs mt-0.5">Visualize your spending patterns</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 p-0.5 bg-surface-2 rounded-lg">
            {['expense', 'income'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={clsx(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 capitalize',
                  view === v ? 'bg-accent-green/20 text-accent-green' : 'text-black/30 hover:text-black/50'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Chart type toggle */}
          <div className="flex gap-1 p-0.5 bg-surface-2 rounded-lg">
            <button
              onClick={() => setChartType('doughnut')}
              className={clsx(
                'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150',
                chartType === 'doughnut' ? 'bg-accent-green/20 text-accent-green' : 'text-black/30 hover:text-black/50'
              )}
            >
              <PieChart size={13} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={clsx(
                'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150',
                chartType === 'bar' ? 'bg-accent-green/20 text-accent-green' : 'text-black/30 hover:text-black/50'
              )}
            >
              <BarChart2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-3">
            <PieChart size={24} className="text-black/20" />
          </div>
          <p className="text-black/30 text-sm">No {view} data yet</p>
          <p className="text-black/15 text-xs mt-1">Add transactions to see your breakdown</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className={clsx('relative', chartType === 'doughnut' ? 'max-w-[220px] mx-auto' : 'w-full')}>
            {chartType === 'doughnut' ? (
              <div className="relative">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-black/30 text-[10px] uppercase tracking-wider font-display">Total</p>
                  <p className="currency-display text-black text-base leading-tight">
                    {formatCurrency(total, { compact: true })}
                  </p>
                </div>
              </div>
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>

          {/* Legend */}
          <div className="mt-5 space-y-2">
            {categories.map((cat, i) => {
              const val = values[i]
              const pct = total > 0 ? (val / total) * 100 : 0
              return (
                <div key={cat} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: colors[i] }}
                    />
                    <span className="text-black/75 text-xs font-bold transition-colors group-hover:text-black">
                      {CATEGORY_EMOJIS[cat]} {cat}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: colors[i] }}
                      />
                    </div>
                    <span className="text-black/40 text-xs w-8 text-right">{formatPercent(pct)}</span>
                    <span className="transaction-amount text-black/70 text-xs w-20 text-right">
                      {formatCurrency(val, { compact: true })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
