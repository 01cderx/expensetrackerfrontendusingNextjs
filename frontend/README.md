# Ledger — Expense Tracker (Next.js frontend)

A Next.js 14 (App Router) + TypeScript + Tailwind frontend for the Spring Boot Expense Tracker API.

## Features
- Email/password auth (JWT stored in a cookie), with route protection via middleware
- Dashboard with totals, this-month spend, and a category breakdown pie chart (Recharts)
- Full CRUD for expenses and categories
- Clean, distinctive "ledger" visual design — forest green + warm paper palette, serif display type, hairline dividers

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The app runs at **http://localhost:3000**. Make sure the Spring Boot backend is running at
`http://localhost:8080` (or update `NEXT_PUBLIC_API_URL` in `.env.local`).

## Structure
```
app/
├── layout.tsx          # Root layout, fonts, AuthProvider
├── page.tsx            # Redirects to /dashboard
├── login/page.tsx
├── register/page.tsx
├── dashboard/page.tsx   # Stats + chart
├── expenses/page.tsx    # Expense CRUD
└── categories/page.tsx  # Category CRUD

components/
├── Navbar.tsx
├── ExpenseForm.tsx
├── ExpenseList.tsx
├── CategoryManager.tsx
└── StatCard.tsx

context/AuthContext.tsx  # Global auth state (login/register/logout)
lib/api.ts                # Axios instance with JWT interceptor
lib/types.ts               # Shared TypeScript types
middleware.ts               # Redirects unauthenticated users to /login
```

## Notes
- JWT is stored in a cookie (`token`) so `middleware.ts` can read it on the edge for route protection.
- On a 401 response the API client clears the session and redirects to `/login` automatically.
- Swap the color palette in `tailwind.config.ts` under `theme.extend.colors` if you want a different look.
