import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Pencil, Trash2, Search, Filter, ChevronDown, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTransactions } from '../context/TransactionContext'
import { formatCurrency, formatDate, formatDateFull } from '../utils/format'
import { toastConfig } from '../utils/toastConfig'
import TransactionForm from './TransactionForm'
import clsx from 'clsx'

export default function TransactionList() {
  const { transactions, deleteTransaction, CATEGORIES, clearAll, CATEGORY_COLORS, CATEGORY_EMOJIS } = useTransactions()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [editingTx, setEditingTx] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [page, setPage] = useState(1)
  const listRef = useRef(null)
  const PER_PAGE = 10

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.3 }
      )
    }
  }, [])

  const filtered = transactions.filter(tx => {
    const matchSearch = tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || tx.type === filterType
    const matchCat = filterCategory === 'all' || tx.category === filterCategory
    return matchSearch && matchType && matchCat
  })

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < filtered.length

  const handleDelete = (id, title) => {
    deleteTransaction(id)
    toastConfig.transactionDeleted(title)
  }

  const handleClearAll = () => {
    if (transactions.length === 0) return
    if (window.confirm('Clear all transactions? This cannot be undone.')) {
      clearAll()
      toastConfig.allCleared()
    }
  }

  const hasFilters = search || filterType !== 'all' || filterCategory !== 'all'

  return (
    <div ref={listRef} className="opacity-0 space-y-4">
      {/* Edit modal */}
      <AnimatePresence>
        {editingTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setEditingTx(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-sm"
            >
              <TransactionForm editingTx={editingTx} onClose={() => setEditingTx(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="glass rounded-2xl p-6 border-l-2 border-accent-purple/40">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-black">History</h3>
            <p className="text-black/30 text-xs mt-0.5">
              {transactions.length === 0 ? 'No transactions yet' : `${filtered.length} of ${transactions.length} transactions`}
            </p>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-black/20 hover:text-accent-red text-xs font-medium transition-colors duration-200 flex items-center gap-1"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          )}
        </div>

        {/* Filters */}
        {transactions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search transactions…"
                className="input-field pl-8 py-2 text-xs"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); setPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black/60"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setPage(1) }}
              className="input-field py-2 text-xs w-auto min-w-[110px] cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '30px',
                appearance: 'none',
              }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
              className="input-field py-2 text-xs w-auto min-w-[120px] cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '30px',
                appearance: 'none',
              }}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Empty state */}
      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl py-16 text-center"
        >
          <div className="text-5xl mb-4">💰</div>
          <h3 className="font-display font-semibold text-black/80 text-lg mb-2">
            Get started by adding your first transaction
          </h3>
          <p className="text-black/30 text-sm max-w-xs mx-auto">
            Track your income and expenses to understand where your money goes.
          </p>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl py-12 text-center"
        >
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-black/40 text-sm">No transactions match your filters</p>
          <button
            onClick={() => { setSearch(''); setFilterType('all'); setFilterCategory('all') }}
            className="mt-3 text-accent-green text-xs hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        /* Transaction rows */
        <div className="glass rounded-2xl overflow-hidden">
          <AnimatePresence initial={false}>
            {paginated.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                index={i}
                isLast={i === paginated.length - 1}
                onEdit={() => setEditingTx(tx)}
                onDelete={() => handleDelete(tx.id, tx.title)}
                categoryColors={CATEGORY_COLORS}
                categoryEmojis={CATEGORY_EMOJIS}
              />
            ))}
          </AnimatePresence>

          {hasMore && (
            <div className="px-6 py-4 border-t border-black/[0.04]">
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full text-black/30 hover:text-black/60 text-xs flex items-center justify-center gap-1.5 transition-colors duration-200"
              >
                <ChevronDown size={13} />
                Load {Math.min(PER_PAGE, filtered.length - paginated.length)} more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TransactionRow({ tx, index, isLast, onEdit, onDelete, categoryColors, categoryEmojis }) {
  const color = categoryColors[tx.category] || '#94a3b8'
  const isIncome = tx.type === 'income'
  const rowRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <motion.div
      ref={rowRef}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.15) }}
      className={clsx(
        'group flex items-center gap-4 px-6 py-4 transition-all duration-150 hover:bg-white/[0.02] border-l-2',
        !isLast && 'border-b border-black/[0.04]'
      )}
      style={{ borderLeftColor: color + '40' }}
    >
      {/* Category dot */}
      <div
        className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-display font-bold"
        style={{ background: color + '18', color }}
      >
        {tx.category[0]}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-black/85 text-sm font-medium truncate">{tx.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="category-badge text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default"
            style={{ 
              background: color + '20',
              color,
              borderLeft: `3px solid ${color}`,
            }}
          >
            {categoryEmojis[tx.category]} {tx.category}
          </span>
          <span
            className="text-black/20 text-xs relative cursor-default"
            title={formatDateFull(tx.date)}
          >
            {formatDate(tx.date)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className={clsx(
          'transaction-amount text-sm',
          isIncome ? 'text-accent-green font-semibold' : 'text-black/80 font-semibold'
        )}>
          {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
        </p>
        <p className="text-black/20 text-xs capitalize">{tx.type}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-black/30 hover:text-black/80 hover:bg-black/[0.06] transition-all duration-150"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-black/30 hover:text-accent-red hover:bg-accent-red/10 transition-all duration-150"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  )
}
