# Wealthwise — Personal Finance Tracker

A premium, production-grade personal finance tracker built with React, Tailwind CSS, Chart.js, GSAP, and Framer Motion. Apple-inspired design with dark mode aesthetics.

## 🚀 Live Demo

> Deploy to Vercel/Netlify — see Setup below.

---

## ✨ Features

- **Transaction Entry** — Add income or expenses with title, amount, category, and type
- **Financial Summary** — Animated stat cards showing Total Income, Total Expenses, and Net Balance
- **Data Visualization** — Doughnut and horizontal Bar charts with live updates (Chart.js)
- **History Log** — Searchable, filterable transaction list with edit/delete
- **Persistent Storage** — LocalStorage with structured serialization
- **Empty State** — Friendly onboarding message
- **Animations** — GSAP entrance animations + Framer Motion list transitions
- **Responsive** — Optimized for mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Library | Version | Why |
|---|---|---|
| **React 18** | ^18.2 | Component model, hooks, concurrent features |
| **Vite** | ^4.5 | Lightning-fast dev server and build tool |
| **Tailwind CSS** | ^3.3 | Utility-first CSS — rapid design iteration |
| **Chart.js + react-chartjs-2** | ^4.4 / ^5.2 | Performant, well-maintained charting library |
| **GSAP** | ^3.12 | Professional-grade entrance/transition animations |
| **Framer Motion** | ^10.16 | React-first layout animations and AnimatePresence |
| **react-hot-toast** | ^2.4 | Minimal, beautiful toast notifications |
| **Lucide React** | ^0.290 | Consistent, lightweight icon set |
| **date-fns** | ^2.30 | Lightweight date formatting |
| **clsx** | ^2.0 | Conditional className utility |

---

## 📦 Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yourusername/wealthwise.git
cd wealthwise

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173` by default.

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop the dist/ folder to Netlify
```

---

## 🏗 Architecture

```
src/
├── context/
│   └── TransactionContext.jsx   # Global state with useReducer + localStorage
├── components/
│   ├── Header.jsx               # Sticky nav with blur
│   ├── StatCard.jsx             # Animated stat cards (income/expense/balance)
│   ├── TransactionForm.jsx      # Add/Edit form with validation
│   ├── Charts.jsx               # Doughnut + Bar chart (Chart.js)
│   └── TransactionList.jsx      # Searchable list with edit/delete
├── hooks/
│   └── useAnimatedNumber.js     # rAF-based number animation
├── utils/
│   └── format.js                # Currency formatting with edge case handling
├── App.jsx
├── main.jsx
└── index.css                    # Tailwind + custom design tokens
```

---

## 💡 Design Decisions

### Currency Formatting
- Uses `Intl.NumberFormat('en-IN', { currency: 'INR' })` for locale-correct formatting
- Compact notation: ₹1,20,00,000 → ₹1.2Cr (avoids UI overflow on large numbers)
- Always shows 2 decimal places (₹10.00, not ₹10)
- Safe max: ₹999,999,999,999 — beyond that, compact mode kicks in

### Validation
- Empty title/amount rejected with inline error messages (Framer Motion animated)
- Non-numeric amounts rejected
- Amounts ≤ 0 rejected
- Amounts > ₹999B shown in compact notation (UI doesn't break)

### Storage
- LocalStorage with JSON serialization
- Auto-saves on every mutation (add/update/delete)
- Graceful fallback if storage is unavailable

### Chart Updates
- Charts receive `expenseByCategory` / `incomeByCategory` as derived state from context
- Any transaction mutation triggers a re-render → chart updates instantly (Chart.js animation: 500ms)

---

## 🔧 Trade-offs & Future Improvements

### Shortcuts taken
- Used LocalStorage instead of IndexedDB (simpler API, sufficient for this scale)
- No authentication — purely client-side
- Single-page app without routing

### What I'd improve with more time
- **IndexedDB** for larger datasets (thousands of transactions)
- **Monthly budgeting** — set budget limits per category with progress bars
- **Export to CSV/PDF** — download transaction history
- **Recurring transactions** — mark a transaction as monthly/weekly
- **Multi-currency support** — USD, EUR, etc. with live exchange rates
- **Data backup/restore** — export and import JSON
- **Chart date ranges** — filter charts by this week / month / year
- **Category icons** — visual icons instead of initials
- **Dark/Light theme toggle**
- **PWA support** — installable, offline-capable

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 📄 License

MIT
