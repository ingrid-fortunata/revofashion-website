# Feature-Based Architecture & Directory Restructuring Design

- **Date**: 2026-09-07
- **Topic**: Feature-Based Directory Architecture, Layouts, Modular Utils, and Route Groups
- **Status**: Approved by User

---

## 1. Overview & Objectives

Establish a modular, maintainable, and scalable directory structure for **RevoFashion** that follows modern Next.js 16 App Router best practices, featuring:
1. **Isolated UI Primitives**: 1 file per reusable component in `src/components/ui/`.
2. **Dedicated Layout Components**: 1 file per structural layout piece in `src/components/layouts/` (Navbar, Header, Sidebar, Footer).
3. **Modular Utilities**: Granular, single-responsibility functions in `src/lib/utils/` (`cn.ts`, `currency.ts`, `date.ts`, and `index.ts`).
4. **App Router Route Groups**: Clear separation of layout shells without altering URLs: `(auth)`, `(shop)`, and `(admin)`.
5. **Feature-Sliced Modules**: Self-contained business domains in `src/features/<feature>/` containing `components/`, `services/`, and `hooks/` with an explicit public API export in `index.ts`.

---

## 2. Directory Structure Specification

```text
src/
├── app/
│   ├── (admin)/                       # Admin portal route group
│   │   ├── dashboard/
│   │   │   ├── categories/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx                 # Admin shell with <Sidebar />
│   ├── (auth)/                        # Authentication route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx                 # Clean centered auth card shell
│   ├── (shop)/                        # Customer storefront route group
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx                 # Storefront shell with <Navbar /> & <Footer />
│   │   └── page.tsx                   # Landing / home page (moved from root app/page.tsx)
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx                     # Root HTML/Body layout with <AppProviders>
├── components/
│   ├── layouts/                       # Global structural layout pieces
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   ├── providers/
│   │   └── AppProviders.tsx
│   ├── routes/                        # Route guard components
│   │   ├── AdminRoute.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicOnlyRoute.tsx
│   │   └── index.ts
│   └── ui/                            # 1 file per reusable UI primitive
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       └── table.tsx
├── features/                          # Self-contained business domains
│   └── auth/                          # Authentication feature module
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── hooks/
│       │   ├── useLoginMutation.ts
│       │   └── useRegisterMutation.ts
│       ├── services/
│       │   └── auth.service.ts
│       └── index.ts                   # Public API barrel for feature consumers
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── error-codes.ts
│   ├── utils/                         # Modular single-responsibility utilities
│   │   ├── cn.ts
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   └── index.ts
│   ├── cookies.ts
│   └── toast.ts
├── stores/
│   ├── useAuthStore.ts
│   ├── useCartStore.ts
│   └── useUIStore.ts
└── types/
    ├── api.ts
    ├── auth.ts
    ├── cart.ts
    ├── category.ts
    ├── order.ts
    └── product.ts
```

---

## 3. Component Details & Boundaries

### A. Modular Utilities (`src/lib/utils/`)
* **`cn.ts`**: Implements `cn(...inputs: ClassValue[])` using `clsx` and `tailwind-merge`.
* **`currency.ts`**: Implements `formatCurrency(amount: number, currency: "IDR" | "USD" = "IDR")`.
* **`date.ts`**: Implements `formatDate(date, formatStr)` with `dayjs` instance re-exported.
* **`index.ts`**: Re-exports all utilities so imports can use either `@/lib/utils` or `@/utils` cleanly.

### B. Layout Components (`src/components/layouts/`)
* **`Navbar.tsx`**: Brand logo, navigation links (`/products`), search trigger, Cart Drawer trigger with badge count from `useCartStore`, and user profile/auth menu.
* **`Header.tsx`**: Announcement bar / sub-header wrapper.
* **`Sidebar.tsx`**: Collapsible admin navigation menu (Dashboard overview, Categories, Orders, Return to Storefront).
* **`Footer.tsx`**: Informational footer with brand statement, quick links, customer service contact, and copyright.
* **`index.ts`**: Clean export barrel.

### C. Route Guard Components (`src/components/routes/`)
* **`ProtectedRoute.tsx`**: Protects authenticated user routes (redirects guests to `/login`).
* **`AdminRoute.tsx`**: Protects back-office routes (redirects non-admins).
* **`PublicOnlyRoute.tsx`**: Protects guest routes (redirects authenticated users away from `/login`).
* **`index.ts`**: Clean export barrel.

### D. Route Groups (`src/app/`)
* **`(shop)`**: Wraps customer storefront routes. Its `layout.tsx` embeds `<Navbar />` and `<Footer />`. The main storefront `page.tsx` moves into `src/app/(shop)/page.tsx`.
* **`(auth)`**: Wraps `/login` and `/register`. Its `layout.tsx` is an isolated, focused layout without the shopping navbar, displaying a clean centered backdrop.
* **`(admin)`**: Wraps `/dashboard/*`. Its `layout.tsx` embeds the admin `<Sidebar />` and back-office navigation.

### E. Feature Modules (`src/features/auth/`)
* **`components/`**: Houses forms specific to the authentication lifecycle (`LoginForm.tsx`, `RegisterForm.tsx`).
* **`services/auth.service.ts`**: Encapsulates `loginUser(credentials)` and `registerUser(payload)` calls via `client` from `@/lib/api/client`.
* **`hooks/useLoginMutation.ts`**: TanStack Query mutation managing loading, onSuccess (setting cookies, updating `useAuthStore`, toast), and onError handling.
* **`index.ts`**: Public barrel exports for feature consumers:
  ```typescript
  export * from "./components/LoginForm";
  export * from "./components/RegisterForm";
  export * from "./services/auth.service";
  export * from "./hooks/useLoginMutation";
  ```

---

## 4. Path Aliasing & Migration Safeguards
1. Update [`tsconfig.json`](file:///Users/ingrid.fortunata/Desktop/Learning/Revou/RevoFashion/tsconfig.json) to support both:
   * `"@/*": ["./src/*"]`
   * `"@/utils": ["./src/lib/utils/index.ts"]`
   * `"@/utils/*": ["./src/lib/utils/*"]`
   * `"@/features/*": ["./src/features/*"]`
2. Ensure backward compatibility for any existing `@/lib/utils` imports by using `src/lib/utils/index.ts`.
3. Verify zero build regressions via `npx tsc --noEmit` and `npm run build`.
