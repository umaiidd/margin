export function formatCurrency(amount, options = {}) {
  const { compact = false, showSign = false } = options

  if (!isFinite(amount)) return '₹0.00'

  // Clamp to safe display range
  const safeAmount = Math.min(Math.abs(amount), 999_999_999_999)

  if (compact && safeAmount >= 10_000_000) {
    const crore = safeAmount / 10_000_000
    const formatted = crore >= 100
      ? crore.toFixed(0)
      : crore >= 10
        ? crore.toFixed(1)
        : crore.toFixed(2)
    const sign = showSign && amount > 0 ? '+' : amount < 0 ? '−' : ''
    return `${sign}₹${formatted}Cr`
  }

  if (compact && safeAmount >= 100_000) {
    const lakh = safeAmount / 100_000
    const formatted = lakh >= 10 ? lakh.toFixed(1) : lakh.toFixed(2)
    const sign = showSign && amount > 0 ? '+' : amount < 0 ? '−' : ''
    return `${sign}₹${formatted}L`
  }

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount)

    if (showSign && amount > 0) return `+${formatted}`
    if (amount < 0) return formatted.replace('₹', '−₹')
    return formatted
  } catch {
    const sign = showSign && amount > 0 ? '+' : amount < 0 ? '−' : ''
    return `${sign}₹${safeAmount.toFixed(2)}`
  }
}

/**
 * Parse a currency input string to a float
 * Returns NaN if invalid
 */
export function parseCurrencyInput(value) {
  if (!value || typeof value !== 'string') return NaN
  const cleaned = value.replace(/[₹,\s]/g, '').trim()
  if (!cleaned) return NaN
  const num = parseFloat(cleaned)
  return isNaN(num) ? NaN : num
}

/**
 * Validate an amount input
 */
export function validateAmount(value) {
  const num = parseCurrencyInput(String(value))
  if (isNaN(num)) return { valid: false, error: 'Please enter a valid number' }
  if (num <= 0) return { valid: false, error: 'Amount must be greater than 0' }
  if (num > 999_999_999_999) return { valid: false, error: 'Amount is too large' }
  return { valid: true, value: num }
}

/**
 * Format a percentage
 */
export function formatPercent(value, decimals = 1) {
  if (!isFinite(value)) return '0%'
  return `${Math.abs(value).toFixed(decimals)}%`
}

/**
 * Format a date for display
 */
export function formatDate(isoString) {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now - date

    if (diff < 60_000) return 'Just now'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return 'Unknown'
  }
}

/**
 * Format date for detailed display
 */
export function formatDateFull(isoString) {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}
