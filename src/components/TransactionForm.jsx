import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Plus, X, Check, AlertCircle, DollarSign, Tag, Layers, ArrowUpDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTransactions } from '../context/TransactionContext'
import { validateAmount } from '../utils/format'
import { toastConfig } from '../utils/toastConfig'
import CategorySelect from './CategorySelect'
import clsx from 'clsx'

const FIELD_ICONS = {
  title: Tag,
  amount: DollarSign,
  category: Layers,
  type: ArrowUpDown,
}

export default function TransactionForm({ editingTx, onClose }) {
  const { addTransaction, updateTransaction, CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS } = useTransactions()
  const isEditing = Boolean(editingTx)

  const [form, setForm] = useState({
    title: editingTx?.title || '',
    amount: editingTx?.amount?.toString() || '',
    category: editingTx?.category || 'Food',
    type: editingTx?.type || 'expense',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [])

  const validate = () => {
    const newErrors = {}

    if (!form.title.trim()) {
      newErrors.title = 'Title is required'
      toastConfig.error('Please enter a transaction title')
    } else if (form.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
      toastConfig.error('Title must be at least 2 characters')
    }

    const amountResult = validateAmount(form.amount)
    if (!amountResult.valid) {
      newErrors.amount = amountResult.error
      toastConfig.error(amountResult.error)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      // Shake animation on error
      if (btnRef.current) {
        gsap.to(btnRef.current, {
          x: [-4, 4, -4, 4, 0],
          duration: 0.3,
          ease: 'power2.out',
        })
      }
      return
    }

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 200)) // micro-delay for UX

    try {
      if (isEditing) {
        updateTransaction({
          ...editingTx,
          ...form,
          amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        })
        toastConfig.transactionUpdated()
        onClose()
      } else {
        addTransaction(form)
        toastConfig.transactionAdded(form.type, parseFloat(form.amount).toFixed(2))
        setForm({ title: '', amount: '', category: 'Food', type: 'expense' })
        setErrors({})

        // Celebration on income
        if (form.type === 'income' && btnRef.current) {
          gsap.to(btnRef.current, {
            scale: 1.05,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
          })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={formRef} className="glass rounded-2xl p-6 opacity-0 border-l-2 border-accent-green/40">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-black text-lg">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <p className="text-black/30 text-xs mt-0.5">
            {isEditing ? 'Update the details below' : 'Record your income or expense'}
          </p>
        </div>
        {isEditing && (
          <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-black/40 hover:text-black hover:bg-black/10 transition-all duration-200">
            <X size={14} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-white rounded-lg border border-black/[0.08]">
          {['expense', 'income'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleChange('type', type)}
              className={clsx(
                'flex-1 py-2.5 rounded-md text-sm font-display font-semibold transition-all duration-200 capitalize',
                form.type === type
                  ? type === 'income'
                    ? 'bg-accent-green text-white shadow-sm'
                    : 'bg-accent-red text-white shadow-sm'
                  : 'text-black/40 hover:text-black/60 hover:bg-black/[0.02]'
              )}
            >
              {type === 'income' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-black/40 text-xs font-display uppercase tracking-wider">
            Title
          </label>
          <div className="relative">
            <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" />
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g., Grocery run, Freelance payment…"
              className={clsx('input-field pl-9', errors.title && 'border-accent-red/40 focus:border-accent-red/60')}
              maxLength={80}
            />
          </div>
          <AnimatePresence>
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-accent-red text-xs"
              >
                <AlertCircle size={11} /> {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-black/40 text-xs font-display uppercase tracking-wider">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 text-sm font-display pointer-events-none select-none">
              ₹
            </span>
            <input
              type="number"
              value={form.amount}
              onChange={e => handleChange('amount', e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={clsx('input-field pl-8', errors.amount && 'border-accent-red/40 focus:border-accent-red/60')}
            />
          </div>
          <AnimatePresence>
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-accent-red text-xs"
              >
                <AlertCircle size={11} /> {errors.amount}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-black/40 text-xs font-display uppercase tracking-wider block">
            Category
          </label>
          <select
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-black/90 font-medium focus:outline-none focus:border-accent-green/60 focus:ring-2 focus:ring-accent-green/20 transition-all duration-200 cursor-pointer appearance-none shadow-sm hover:shadow-md hover:border-black/[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2334d399' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '32px',
            }}
          >
            {CATEGORIES.map(cat => (
              <option 
                key={cat} 
                value={cat} 
                style={{ 
                  color: CATEGORY_COLORS[cat], 
                  paddingLeft: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '10px 12px'
                }}
              >
                {CATEGORY_EMOJIS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          ref={btnRef}
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-3 bg-accent-green text-white"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            <>
              {isEditing ? <Check size={15} /> : <Plus size={15} />}
              {isEditing ? 'Save Changes' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
