# Feature-Based Architecture & Directory Restructuring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform RevoFashion's directory structure into a modular, feature-based architecture featuring modular utilities, dedicated layout components, route guard wrappers, Next.js App Router route groups, and an authentication feature module.

**Architecture:** Split utilities into single-responsibility files under `src/lib/utils/`, build site-wide layouts in `src/components/layouts/`, house route guards in `src/components/routes/`, partition `src/app/` into `(shop)`, `(auth)`, and `(admin)` route groups, and scaffold domain feature modules under `src/features/`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Zustand 5, TanStack Query v5, Sonner 2, Base UI primitives.

## Global Constraints
- All imports must maintain backwards compatibility (e.g. `@/lib/utils` and `@/utils` both resolve cleanly).
- Zero `any` types; strict TypeScript typing throughout.
- Sensitive JWT tokens are managed strictly through cookies (`src/lib/cookies.ts`) and never stored in `localStorage`.
- Production build (`npm run build`) and type check (`npx tsc --noEmit`) must compile with 0 errors and 0 warnings.

---

### Task 1: Modularize Utilities & Configure Path Aliases

**Files:**
- Create: `src/lib/utils/cn.ts`
- Create: `src/lib/utils/currency.ts`
- Create: `src/lib/utils/date.ts`
- Create: `src/lib/utils/index.ts`
- Delete: `src/lib/utils.ts`
- Modify: `tsconfig.json`

**Interfaces:**
- `cn(...inputs: ClassValue[]): string`
- `formatCurrency(amount: number, currency?: "IDR" | "USD"): string`
- `formatDate(date: string | number | Date | null | undefined, formatStr?: string): string`

- [ ] **Step 1: Create `src/lib/utils/cn.ts`**
  ```typescript
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
  }
  ```

- [ ] **Step 2: Create `src/lib/utils/currency.ts`**
  ```typescript
  export function formatCurrency(amount: number, currency: "IDR" | "USD" = "IDR"): string {
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  ```

- [ ] **Step 3: Create `src/lib/utils/date.ts`**
  ```typescript
  import dayjs from "dayjs";

  export function formatDate(
    date: string | number | Date | null | undefined,
    formatStr: string = "DD MMM YYYY, HH:mm"
  ): string {
    if (!date) return "-";
    const parsed = dayjs(date);
    if (!parsed.isValid()) return "-";
    return parsed.format(formatStr);
  }

  export { dayjs };
  ```

- [ ] **Step 4: Create `src/lib/utils/index.ts` and delete old `src/lib/utils.ts`**
  ```typescript
  export * from "./cn";
  export * from "./currency";
  export * from "./date";
  ```

- [ ] **Step 5: Update `tsconfig.json` to alias `@/utils` and `@/features`**
  ```json
  "paths": {
    "@/*": ["./src/*"],
    "@/utils": ["./src/lib/utils/index.ts"],
    "@/utils/*": ["./src/lib/utils/*"],
    "@/features/*": ["./src/features/*"]
  }
  ```

- [ ] **Step 6: Verify utility compilation with TypeScript**
  Run `npx tsc --noEmit` and confirm 0 errors.

- [ ] **Step 7: Commit Task 1**
  ```bash
  git add src/lib/utils/ tsconfig.json
  git rm src/lib/utils.ts
  git commit -m "refactor(utils): modularize utils and add path aliases"
  ```

---

### Task 2: Implement Global Layout Components

**Files:**
- Create: `src/components/layouts/Navbar.tsx`
- Create: `src/components/layouts/Header.tsx`
- Create: `src/components/layouts/Sidebar.tsx`
- Create: `src/components/layouts/Footer.tsx`
- Create: `src/components/layouts/index.ts`

**Interfaces:**
- `Navbar`: Displays Brand, navigation links, cart badge count, and user login/profile action.
- `Header`: Announcement banner for promotions or news.
- `Sidebar`: Collapsible sidebar for back-office admin dashboard.
- `Footer`: Clean storefront footer with copyright and links.

- [ ] **Step 1: Create `src/components/layouts/Navbar.tsx`**
  Includes links to Home `/`, Catalog `/products`, Cart trigger with item count from `useCartStore`, and user session status from `useAuthStore`.

- [ ] **Step 2: Create `src/components/layouts/Header.tsx`**
  Top bar for notifications/announcements (e.g. "Free shipping on orders over Rp 500,000!").

- [ ] **Step 3: Create `src/components/layouts/Sidebar.tsx`**
  Navigation drawer/sidebar with links to `/dashboard` (Overview), `/dashboard/categories`, `/dashboard/orders`, and button to return to Storefront.

- [ ] **Step 4: Create `src/components/layouts/Footer.tsx`**
  Storefront footer with Brand info, customer service, and copyright.

- [ ] **Step 5: Create `src/components/layouts/index.ts`**
  ```typescript
  export * from "./Navbar";
  export * from "./Header";
  export * from "./Sidebar";
  export * from "./Footer";
  ```

- [ ] **Step 6: Commit Task 2**
  ```bash
  git add src/components/layouts/
  git commit -m "feat(layouts): implement Navbar, Header, Sidebar, and Footer layout components"
  ```

---

### Task 3: Implement Route Guard Components

**Files:**
- Create: `src/components/routes/ProtectedRoute.tsx`
- Create: `src/components/routes/AdminRoute.tsx`
- Create: `src/components/routes/PublicOnlyRoute.tsx`
- Create: `src/components/routes/index.ts`

**Interfaces:**
- `ProtectedRoute({ children }: { children: React.ReactNode })`: Renders children if authenticated; otherwise redirects to `/login`.
- `AdminRoute({ children }: { children: React.ReactNode })`: Renders children if user has `role === 'admin'` or `'superadmin'`; redirects customers to `/` and guests to `/login`.
- `PublicOnlyRoute({ children }: { children: React.ReactNode })`: Renders children if guest; redirects authenticated users to `/` (or `/dashboard` if admin).

- [ ] **Step 1: Create `src/components/routes/ProtectedRoute.tsx`**
  Uses `useAuthStore` hydration and `useRouter` for client redirection.

- [ ] **Step 2: Create `src/components/routes/AdminRoute.tsx`**
  Checks `user.role` from `useAuthStore`.

- [ ] **Step 3: Create `src/components/routes/PublicOnlyRoute.tsx`**
  Prevents logged-in users from viewing auth screens.

- [ ] **Step 4: Create `src/components/routes/index.ts`**
  ```typescript
  export * from "./ProtectedRoute";
  export * from "./AdminRoute";
  export * from "./PublicOnlyRoute";
  ```

- [ ] **Step 5: Commit Task 3**
  ```bash
  git add src/components/routes/
  git commit -m "feat(routes): implement ProtectedRoute, AdminRoute, and PublicOnlyRoute guards"
  ```

---

### Task 4: Restructure App Router into Route Groups

**Files:**
- Create: `src/app/(shop)/layout.tsx`
- Move: `src/app/page.tsx` ➔ `src/app/(shop)/page.tsx`
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/(admin)/dashboard/page.tsx`

- [ ] **Step 1: Create `src/app/(shop)/layout.tsx`**
  Wraps storefront pages with `<Header />`, `<Navbar />`, main container, and `<Footer />`.

- [ ] **Step 2: Move root `src/app/page.tsx` to `src/app/(shop)/page.tsx`**
  Preserves landing hero and technology showcase inside the storefront shell.

- [ ] **Step 3: Create `src/app/(auth)/layout.tsx`**
  Minimalist centered container with brand logo for `/login` and `/register`.

- [ ] **Step 4: Create `src/app/(admin)/layout.tsx` and `src/app/(admin)/dashboard/page.tsx`**
  Wraps admin routes with `<AdminRoute>` and `<Sidebar />`.

- [ ] **Step 5: Verify route group routing and build**
  Run `npm run build` to confirm static generation across `(shop)` and `(admin)`.

- [ ] **Step 6: Commit Task 4**
  ```bash
  git add src/app/
  git commit -m "refactor(app): organize App Router into (shop), (auth), and (admin) route groups"
  ```

---

### Task 5: Scaffold Feature Module for Auth

**Files:**
- Create: `src/features/auth/services/auth.service.ts`
- Create: `src/features/auth/hooks/useLoginMutation.ts`
- Create: `src/features/auth/components/LoginForm.tsx`
- Create: `src/features/auth/components/RegisterForm.tsx`
- Create: `src/features/auth/index.ts`
- Create: `src/app/(auth)/login/page.tsx`

**Interfaces:**
- `authService.login(credentials: LoginCredentials): Promise<AuthResponse>`
- `useLoginMutation()`: TanStack Query mutation with cookie storage, store update, and toast notification.
- `LoginForm`: Controlled form component with username/email and password inputs.

- [ ] **Step 1: Create `src/features/auth/services/auth.service.ts`**
  Encapsulates API call to `POST /auth/login`.

- [ ] **Step 2: Create `src/features/auth/hooks/useLoginMutation.ts`**
  TanStack Query mutation invoking `authService.login`, setting token cookie via `setAuthToken()`, calling `login()` on `useAuthStore`, and showing success toast.

- [ ] **Step 3: Create `src/features/auth/components/LoginForm.tsx`**
  Uses `<Input>`, `<Button>`, and `<Label>` from `@/components/ui/`, manages loading state, and handles redirects based on user role.

- [ ] **Step 4: Create `src/features/auth/components/RegisterForm.tsx`**
  Form placeholder ready for customer registration.

- [ ] **Step 5: Create `src/features/auth/index.ts`**
  ```typescript
  export * from "./components/LoginForm";
  export * from "./components/RegisterForm";
  export * from "./services/auth.service";
  export * from "./hooks/useLoginMutation";
  ```

- [ ] **Step 6: Create `src/app/(auth)/login/page.tsx`**
  Renders `<PublicOnlyRoute>` containing `<LoginForm />`.

- [ ] **Step 7: Commit Task 5**
  ```bash
  git add src/features/auth/ src/app/(auth)/login/
  git commit -m "feat(auth): scaffold auth feature module and login route"
  ```

---

### Task 6: Final Verification & Type Safety Audit

- [ ] **Step 1: Full TypeScript verification**
  Run `npx tsc --noEmit` and confirm 0 errors.

- [ ] **Step 2: Next.js Production Build**
  Run `npm run build` and confirm all route groups compile cleanly.

- [ ] **Step 3: Update documentation progress**
  Update `docs/track-progress/` and architecture notes.
