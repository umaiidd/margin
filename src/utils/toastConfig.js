import toast from 'react-hot-toast'

const baseStyle = {
  borderRadius: '10px',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: 'none',
}

export const toastConfig = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: '✓',
      duration: 3000,
      style: {
        ...baseStyle,
        background: '#ecfdf5',
        color: '#047857',
        borderLeft: '4px solid #10b981',
      },
      ...options,
    })
  },

  error: (message, options = {}) => {
    toast.error(message, {
      icon: '✕',
      duration: 3500,
      style: {
        ...baseStyle,
        background: '#fef2f2',
        color: '#991b1b',
        borderLeft: '4px solid #ef4444',
      },
      ...options,
    })
  },

  info: (message, options = {}) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      style: {
        ...baseStyle,
        background: '#eff6ff',
        color: '#1e40af',
        borderLeft: '4px solid #3b82f6',
      },
      ...options,
    })
  },

  warning: (message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      duration: 3000,
      style: {
        ...baseStyle,
        background: '#fffbeb',
        color: '#92400e',
        borderLeft: '4px solid #f59e0b',
      },
      ...options,
    })
  },

  custom: (message, icon, bgColor, textColor, options = {}) => {
    toast(message, {
      icon,
      duration: 3000,
      style: {
        ...baseStyle,
        background: bgColor,
        color: textColor,
      },
      ...options,
    })
  },

  loading: (message, options = {}) => {
    toast.loading(message, {
      style: {
        ...baseStyle,
        background: '#f3f4f6',
        color: '#374151',
      },
      ...options,
    })
  },

  // Specific transaction toasts
  transactionAdded: (type, amount) => {
    const message = type === 'income'
      ? `💰 Income of ₹${amount} added`
      : `💸 Expense of ₹${amount} recorded`
    const bgColor = type === 'income' ? '#ecfdf5' : '#fef2f2'
    const textColor = type === 'income' ? '#047857' : '#991b1b'
    const borderColor = type === 'income' ? '#10b981' : '#ef4444'

    toast(message, {
      duration: 3000,
      style: {
        ...baseStyle,
        background: bgColor,
        color: textColor,
        borderLeft: `4px solid ${borderColor}`,
      },
    })
  },

  transactionUpdated: () => {
    toast('✏️ Transaction updated successfully', {
      duration: 3000,
      style: {
        ...baseStyle,
        background: '#ecfdf5',
        color: '#047857',
        borderLeft: '4px solid #10b981',
      },
    })
  },

  transactionDeleted: (title) => {
    toast(`🗑️ "${title}" removed`, {
      duration: 2500,
      style: {
        ...baseStyle,
        background: '#fef2f2',
        color: '#991b1b',
        borderLeft: '4px solid #ef4444',
      },
    })
  },

  allCleared: () => {
    toast('✨ All transactions cleared', {
      duration: 3000,
      style: {
        ...baseStyle,
        background: '#fef2f2',
        color: '#991b1b',
        borderLeft: '4px solid #ef4444',
      },
    })
  },
}
