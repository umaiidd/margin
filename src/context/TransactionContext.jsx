import React, { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'wealthwise_transactions'

const CATEGORY_COLORS = {
  Food: '#34d399',
  Rent: '#60a5fa',
  Salary: '#a78bfa',
  Transport: '#fbbf24',
  Shopping: '#f472b6',
  Health: '#2dd4bf',
  Entertainment: '#fb923c',
  Investment: '#818cf8',
  Utilities: '#94a3b8',
  Other: '#e2e8f0',
}

const CATEGORY_EMOJIS = {
  Food: '🍔',
  Rent: '🏠',
  Salary: '💰',
  Transport: '🚗',
  Shopping: '🛍️',
  Health: '⚕️',
  Entertainment: '🎬',
  Investment: '📈',
  Utilities: '💡',
  Other: '📌',
}

const CATEGORIES = Object.keys(CATEGORY_COLORS)

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (e) {
    console.error('Storage error:', e)
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const updated = [action.payload, ...state]
      saveToStorage(updated)
      return updated
    }
    case 'DELETE': {
      const updated = state.filter(t => t.id !== action.payload)
      saveToStorage(updated)
      return updated
    }
    case 'UPDATE': {
      const updated = state.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      )
      saveToStorage(updated)
      return updated
    }
    case 'CLEAR': {
      saveToStorage([])
      return []
    }
    default:
      return state
  }
}

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const [transactions, dispatch] = useReducer(reducer, [], loadFromStorage)

  const addTransaction = (data) => {
    const tx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: data.title.trim(),
      amount: parseFloat(parseFloat(data.amount).toFixed(2)),
      category: data.category,
      type: data.type,
      date: new Date().toISOString(),
    }
    dispatch({ type: 'ADD', payload: tx })
    return tx
  }

  const deleteTransaction = (id) => dispatch({ type: 'DELETE', payload: id })

  const updateTransaction = (updated) => dispatch({ type: 'UPDATE', payload: updated })

  const clearAll = () => dispatch({ type: 'CLEAR' })

  // Derived stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses

  // Expense breakdown by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  // Income breakdown by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      clearAll,
      totalIncome,
      totalExpenses,
      netBalance,
      expenseByCategory,
      incomeByCategory,
      CATEGORIES,
      CATEGORY_COLORS,
      CATEGORY_EMOJIS,
    }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactions = () => {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions must be used inside TransactionProvider')
  return ctx
}
