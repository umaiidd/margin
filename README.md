# 💰 Margin --- Personal Wealth & Expense Tracker

A modern, client-side personal finance tracker built with **React** that
helps users manage income and expenses with real-time insights, clean
UI, and interactive visualizations.

🔗 **Live Demo:** https://margin-two.vercel.app/

------------------------------------------------------------------------

## ✨ Features

### 🧾 Transaction Management

-   Add transactions with Title, Amount, Category, and Type
-   Edit and delete transactions
-   Persistent storage using LocalStorage

### 📊 Financial Overview

-   Total Income
-   Total Expenses
-   Net Balance
-   Animated UI updates

### 📈 Data Visualization

-   Doughnut & Bar charts
-   Category-wise breakdown
-   Real-time updates

### 📜 Transaction History

-   Search and filter transactions
-   Pagination support
-   Clear all functionality

### 🎯 UX Enhancements

-   Smooth animations (GSAP, Framer Motion)
-   Toast notifications
-   Responsive design

------------------------------------------------------------------------

## 🛠 Tech Stack

- React
Chosen for its component-based architecture, fast rendering with Virtual DOM, and strong ecosystem for building scalable UI.

- Context API + useReducer
Used for lightweight global state management without introducing external libraries like Redux.
useReducer ensures predictable state transitions for transaction operations (add, delete, update).

- Tailwind CSS
Enables rapid UI development with utility-first styling, reducing custom CSS and ensuring consistent design.

- Headless UI
Provides fully accessible, unstyled components (like Listbox) that integrate seamlessly with custom UI design.

- Chart.js + react-chartjs-2
Used for rendering responsive and customizable charts.
Chosen for simplicity, performance, and good React integration.

- GSAP (GreenSock Animation Platform)
Handles complex animations and micro-interactions with high performance and smooth timing control.

- Framer Motion
Used for declarative animations, especially for layout transitions, modals, and component entry/exit states.

- Lucide React (Icons)
Lightweight and consistent icon library with clean SVG-based icons.

- LocalStorage
Used for client-side persistence to keep the app fully frontend-only.
Eliminates backend dependency while maintaining user data between sessions.

- clsx
Simplifies conditional className handling, improving readability and maintainability of styled components.

- Intl.NumberFormat
Ensures accurate and locale-aware currency formatting (₹), avoiding manual formatting bugs.
------------------------------------------------------------------------

## ⚙️ Setup Instructions

1.  Clone the repository git clone
    https://github.com/your-username/margin-finance-tracker.git

2.  Install dependencies npm install

3.  Run the app npm run dev

------------------------------------------------------------------------

## ⚖️ Trade-offs

-   Used LocalStorage instead of backend
-   Context API instead of Redux
-   Focused on UI/UX over scalability

------------------------------------------------------------------------

## 🚀 Future Improvements

-   Backend integration
-   Export data
-   Dark mode
-   Budget tracking

------------------------------------------------------------------------

Author: Umaid
