# RevoFashion — Contemporary Minimalist Storefront & Admin Portal

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://revofashion-website.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query%20v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)

An enterprise-grade, full-featured fashion e-commerce storefront and administrative back-office portal engineered with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Base UI**, **TanStack Query v5**, and **Zustand**. Designed with a contemporary minimalist aesthetic inspired by Japanese lifestyle apparel brands (Uniqlo & Muji), built for performance, seamless responsiveness, and an effortless shopping experience.

---

## 🌐 Live Deployments & Endpoints

| Resource | URL | Description |
| :--- | :--- | :--- |
| 🛍️ **Storefront & Admin Web App** | [**`https://revofashion-website.vercel.app`**](https://revofashion-website.vercel.app) | Live production build hosted on Vercel |
| ⚙️ **RESTful API Backend** | [**`https://revofashion-shop.onrender.com`**](https://revofashion-shop.onrender.com) | Flask backend hosted on Render |
| 📖 **Interactive Swagger UI** | [**`https://revofashion-shop.onrender.com/swagger-ui`**](https://revofashion-shop.onrender.com/swagger-ui) | OpenAPI 3.0 API documentation |
| 🩺 **Backend Health Check** | [**`https://revofashion-shop.onrender.com/health`**](https://revofashion-shop.onrender.com/health) | API service health verification |

---

## 🔑 Demo & Test Credentials

For quick evaluation of the customer storefront and the back-office admin portal, use the pre-configured accounts below:

| Role | Email | Password | Accessible Areas |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@revofashion.com` | `admin_password` | Full access to `/dashboard` (Catalog, Categories, Orders) & Storefront |
| **Superadmin** | `superadmin@revofashion.com` | `superadmin_password` | Full system access across all storefront & admin features, including **User Management & RBAC** (`/dashboard/users`) |
| **Customer** | `alice@example.com` | `alice_password` | Storefront browsing, Cart, Checkout, Order History (`/orders`), Profile |

> 💡 *You can also create a brand-new customer account directly via [`/register`](https://revofashion-website.vercel.app/register).*

---

## ✨ Key Features & User Journeys

### 1. 🛍️ Customer Storefront Experience
- **Uniqlo-Inspired Lifestyle Homepage (`/`)**:
  - High-resolution hero carousel featuring contemporary lifestyle banners with automatic playback, pause-on-hover, and smooth hardware-accelerated transitions.
  - Featured collection rendered via **Next.js Server-Side Rendering (SSR)** for instant Largest Contentful Paint (LCP) and zero layout shifts.
- **Product Catalog, Instant Search & Filters (`/products`)**:
  - URL-synchronized live search and filtering with zero-lag background cache hits via TanStack Query.
  - Multi-faceted fashion attributes: filter by **Category**, **Gender** (*Men, Women, Unisex, Kids*), **Size** (*XS, S, M, L, XL, XXL, Free Size*), and **Sort Order** (*Price Low/High, Newest, Oldest*).
  - Removable active filter chips and one-click "Clear all" filter reset.
  - Server-driven pagination with accessible navigation controls.
- **Interactive Multi-Image Product Cards**:
  - Primary image prioritization with floating navigation arrows and indicators for products with multiple gallery shots (up to 3 photos).
  - Automatic cute fallback illustration (`/images/no-photo.png`) on broken or missing image links.
  - Real-time stock status pills (*"In Stock"* vs. *"Out of Stock"*), currency formatting, and category tags.
- **Category Directory (`/categories`)**:
  - Browse apparel lines categorized by seasonal collections and product types.
- **Cart & Order Checkout Flow (`/cart`, `/checkout`)**:
  - Persistent shopping cart backed by Zustand and `localStorage`.
  - Real-time inventory boundary checks (prevents adding more units than available in stock).
  - Checkout form with address input, payment method selection, line-item summary, and immediate order creation.
- **Order Tracking & History (`/orders`, `/orders/:id`)**:
  - Comprehensive order history table with status badges (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
  - Dedicated order detail page displaying ordered items, shipping information, and order timeline.

### 2. 🛠️ Back-Office Admin Dashboard (`/dashboard`)
- **Role-Based Access Control (RBAC)**:
  - Route-level security ensuring only authenticated users with `admin` or `superadmin` roles can access management pages.
- **Product Inventory Management (`/dashboard`)**:
  - Inventory KPI metric cards: total products, low stock alerts, catalog valuation, and category distribution.
  - Searchable, sortable inventory table with direct stock indicator pills.
  - **Create Product Modal**: Multi-field form with fashion attribute configuration and Supabase CDN image uploader.
  - **Edit & Delete Modals**: Full catalog updates with instant query invalidation and optimistic UI feedback.
- **Category Management (`/dashboard/categories`)**:
  - Category list with active product count indicators.
  - Modal-driven CRUD operations (Add new category, edit name/description, delete empty categories).
- **Order Fulfillment & Status Transitions (`/dashboard/orders`)**:
  - Status filter tabs: quickly isolate orders that are *Pending*, *Processing*, *Shipped*, or *Delivered*.
  - Order status change modal enabling one-click order fulfillment updates that reflect immediately in customer order trackers.
- **User Accounts & Role-Based Access Control (`/dashboard/users`)**:
  - **Superadmin Guarded**: Strictly enforces role elevation boundaries; displays an informative security clearance banner when accessed by standard Admin accounts.
  - **Account Metrics Overview**: Live KPI cards for Total Accounts, Admins & Staff, Active Regular Shoppers, and Deactivated accounts.
  - **Search & Multi-Facet Filtering**: Real-time username and email filtering, role selection (`superadmin`, `admin`, `customer`), and account state filtering (`active`, `inactive`).
  - **Create User Modal**: Account creation form supporting credential validation, instant RBAC role assignment, and active status configuration.
  - **Edit User & Privileges Modal**: Pre-populated modal allowing Superadmins to update usernames, email addresses, assigned roles, and active statuses.
  - **Account Deactivation & Activation Safeguards**: Dedicated confirmation dialog for toggling active account status, with self-protection preventing admins from locking out their own active session.

### 3. 🔐 Authentication & Profile Management
- **Strict Client-Side Validation**:
  - RFC-compliant email regex, trimmed inputs, and minimum 8-character password enforcement.
- **Secure Token Management**:
  - JWT token storage handled via isomorphic cookie utilities (`src/lib/cookies.ts`), maintaining synchronization between Client Components and Server Components.
- **Profile Management (`/profile`)**:
  - Protected account view with dirty-state detection, instant form editing (`PUT /users/:id`), and session synchronization.

---

## 🏛️ Architecture & Engineering Highlights

```
┌────────────────────────────────────────────────────────┐
│               Client-Side Browser (CSR)                │
│    Next.js Client Components + Zustand + TanStack Query │
└───────────────────────────▲────────────────────────────┘
                            │  Hydration & Client Fetches
┌───────────────────────────▼────────────────────────────┐
│              Server-Side Rendering (SSR)               │
│          Next.js 16 App Router Server Components       │
└───────────────────────────▲────────────────────────────┘
                            │  Isomorphic Native fetch()
┌───────────────────────────▼────────────────────────────┐
│           Unified API Client & Interceptors            │
│  src/lib/api/client.ts + Central Error Translation     │
└───────────────────────────▲────────────────────────────┘
                            │  HTTPS / REST / JSON
┌───────────────────────────▼────────────────────────────┐
│              RevoFashion Backend (Render)              │
│    Flask REST API + Supabase PostgreSQL & Storage CDN  │
└────────────────────────────────────────────────────────┘
```

1. **Unified Isomorphic Architecture**:
   - The API client (`src/lib/api/client.ts`) delegates directly to native `fetch()`, enabling identical service calls to run seamlessly inside both Server Components (SSR) and Client Components (CSR).
2. **Centralized Error Translation Pipeline**:
   - Backend error codes (e.g. `PRODUCT_NOT_FOUND`, `USER_CONFLICT`, `AUTH_INVALID_CREDENTIALS`) are caught by `defaultErrorInterceptor` and mapped to human-friendly English descriptions.
   - On the **Server**, errors format cleanly for Next.js error boundaries (`error.tsx`).
   - On the **Client**, errors trigger toast notifications via **Sonner**.
3. **Zero-`useEffect` Server State Coordination**:
   - All dynamic catalog and admin queries use TanStack Query v5 keys (`['products', filters]`, `['admin-orders']`, etc.) for automatic caching, background revalidation, and zero race conditions.

---

## 💻 Technology Stack

| Layer | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `16.3.4` | React framework with App Router, SSR, and Turbopack/Webpack support |
| **Library** | [React](https://react.dev/) | `19.2.8` | Component architecture and concurrent rendering |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.0.0` | End-to-end static typing across models, props, and API contracts |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.0.0` | Modern utility-first CSS engine with custom Rose minimalist theme |
| **UI Primitives** | [Base UI](https://base-ui.com/) | `^1.8.0` | Headless, accessible UI primitives (`@base-ui/react`) |
| **Server State** | [TanStack Query](https://tanstack.com/query) | `^5.102.8` | Asynchronous state management, intelligent caching & prefetching |
| **Client State** | [Zustand](https://zustand.docs.pmnd.rs/) | `^5.0.15` | Lightweight client state for auth sessions and persistent cart |
| **Carousel** | [Embla Carousel](https://www.embla-carousel.com/) | `^8.6.0` | Smooth, touch-friendly carousel engine with autoplay |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.42.0` | Consistent, lightweight vector icons |
| **Notifications**| [Sonner](https://sonner.emilkowal.ski/) | `^2.0.8` | High-performance, accessible toast notifications |
| **Deployment** | [Vercel](https://vercel.com/) | Edge/Serverless | Global CDN hosting and serverless Next.js runtime |

---

## 📂 Project Directory Structure

```
RevoFashion/
├── docs/
│   ├── guideline/               # API specs, backend error code mappings, and rubric requirements
│   ├── plans/                   # Architectural plans and technical specs
│   └── track-progress/          # Milestone tracking and QA checklists
├── public/
│   └── images/
│       ├── no-photo.png         # Fallback placeholder for missing/broken product images
│       └── homepage/            # Lifestyle hero carousel banner assets
├── src/
│   ├── app/
│   │   ├── (admin)/             # Protected admin route group
│   │   │   └── dashboard/
│   │   │       ├── categories/  # Category management page
│   │   │       ├── orders/      # Admin order fulfillment dashboard
│   │   │       ├── users/       # User management & RBAC dashboard
│   │   │       └── page.tsx     # Admin product inventory & metrics overview
│   │   ├── (auth)/              # Authentication route group (/login, /register)
│   │   ├── (shop)/              # Customer storefront route group
│   │   │   ├── cart/            # Interactive shopping cart
│   │   │   ├── categories/      # Category showcase
│   │   │   ├── checkout/        # Order placement and checkout
│   │   │   ├── orders/          # Customer order history & tracking ([id])
│   │   │   ├── products/        # Product catalog with search & filters
│   │   │   ├── profile/         # User profile management
│   │   │   └── page.tsx         # Storefront landing page (SSR)
│   │   ├── globals.css          # Tailwind CSS v4 design tokens and base styles
│   │   └── layout.tsx           # Root HTML layout, React Query provider & Sonner toaster
│   ├── components/
│   │   ├── common/              # Reusable widgets (SearchBar, Breadcrumbs)
│   │   ├── layouts/             # Header, Navbar, UserDropdown, Footer, AdminSidebar
│   │   ├── providers/           # QueryProvider and context wrappers
│   │   ├── routes/              # Route guards (ProtectedRoute, PublicOnlyRoute)
│   │   └── ui/                  # Atomic primitives (Button, Modal, Input, Badge, Skeleton)
│   ├── features/
│   │   ├── admin/               # Admin dashboards (products, categories, orders, users), tables, and CRUD modals
│   │   ├── auth/                # Login & register forms, auth hooks, and services
│   │   ├── categories/          # Category services, hooks, and cards
│   │   ├── checkout/            # Checkout form, order review, payment confirmation, and services
│   │   ├── orders/              # Order listing, timeline, detail cards, status badges, and services
│   │   ├── products/            # Product catalog, carousels, cards, and query hooks
│   │   └── profile/             # Profile forms and user update hooks
│   ├── lib/
│   │   ├── api/                 # Isomorphic HTTP client, interceptors, error translators, and domain services (orders, users)
│   │   ├── cookies.ts           # Server-safe JWT cookie helper
│   │   └── toast.ts             # Centralized toast notification dispatcher
│   ├── stores/
│   │   ├── useAuthStore.ts      # Authentication session store (Zustand)
│   │   └── useCartStore.ts      # Persistent cart store with local storage sync
│   └── types/                   # TypeScript interfaces (Product, Category, Order, User, etc.)
├── .env.example                 # Template for required environment variables
├── .env.local                   # Local development environment overrides
├── next.config.ts               # Next.js compiler & asset optimization configuration
├── package.json                 # Project dependencies, engines, and run scripts
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: `18.18.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm` (v9 or v10) or `pnpm`

### 2. Clone the Repository
```bash
git clone https://github.com/ingrid-fortunata/revofashion-website.git
cd revofashion-website
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and verify the configuration:
```bash
cp .env.example .env.local
```

Inside `.env.local`:
```env
# RevoFashion Backend REST API Base URL
NEXT_PUBLIC_API_BASE_URL=https://revofashion-shop.onrender.com
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [**`http://localhost:3000`**](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Next.js development server on port 3000 |
| **Production Build** | `npm run build` | Compiles the production bundle with strict TypeScript checking |
| **Production Start** | `npm run start` | Runs the compiled production server |
| **Linting** | `npm run lint` | Runs ESLint analysis across all TS/TSX source files |
| **Type Check** | `npx tsc --noEmit` | Performs TypeScript type-checking without emitting files |
| **E2E Tests (Live)** | `npm run test:e2e` | Runs complete Playwright E2E test suite against live Vercel URL |
| **E2E Tests (UI)** | `npx playwright test --ui` | Opens interactive Playwright UI mode for live test debugging |
| **E2E HTML Report** | `npm run test:e2e:report` | Opens the Playwright HTML test report |

---

## 🧪 End-to-End (E2E) Testing with Playwright

The project includes an enterprise-grade automated Playwright test suite that verifies critical customer and administrative flows against the live production Vercel deployment:

### Test Specs Breakdown (`tests/`)

1. **`tests/global-setup.ts`**:
   - Programmatically provisions or authenticates a test customer via the REST API (`POST /users` / `POST /auth/login`), stores `{ id, username, email }` in `localStorage`, attaches JWT session cookie, and writes the session to `playwright/.auth/user.json`.
2. **`tests/navigation.spec.ts`**:
   - First real Playwright test asserting homepage headings, navigating to Products, asserting URL changes, and refactored with `getByTestId()` locators.
3. **`tests/register.spec.ts`**:
   - Full form validation suite (empty fields, email regex, minimum password length, password confirmation mismatch, spaces in username) and successful registration flow.
4. **`tests/auth.spec.ts`**:
   - Customer and admin credential login flows, invalid credential feedback, session restoration, and role-based route protection guards (`/orders`, `/checkout`, `/dashboard`).
5. **`tests/catalog.spec.ts`**:
   - Homepage featured product showcase, product catalog grid, URL query live search (`/products?search=...`), and dynamic SEO metadata on product detail views (`/products/[id]`).
6. **`tests/cart-checkout.spec.ts`**:
   - Multi-page customer journey: catalog browsing -> add to cart -> empty cart checkout button disablement -> `localStorage` cart state persistence across page refresh -> shipping address entry -> order submission.
7. **`tests/admin-crud.spec.ts`**:
   - Complete back-office CRUD lifecycle: admin login -> create product with modal -> assert new table row -> edit product price -> assert updated price -> delete product with confirmation dialog -> verify row removal -> category management navigation.
8. **`tests/api-mock.spec.ts`**:
   - Network interception and API mocking using `page.route()` to demonstrate isolated client-side testing without live backend side effects.

### Running the Tests

```bash
# Run the complete test suite against the live Vercel production deployment
npm run test:e2e

# Run with interactive UI runner
npx playwright test --ui

# Run against a local development server (http://localhost:3000)
BASE_URL=http://localhost:3000 npm run test:e2e

# View the generated HTML test report
npm run test:e2e:report
```

---

## ☁️ Deployment on Vercel

This application is deployed and optimized for **Vercel**:

1. **Import Project**: Connect the GitHub repository `ingrid-fortunata/revofashion-website` in the [Vercel Dashboard](https://vercel.com/new).
2. **Framework Preset**: Select **Next.js**.
3. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`
4. **Environment Variables**:
   Add the following production environment variable:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://revofashion-shop.onrender.com`
5. **Deploy**: Every push to the `main` branch triggers an automated preview and production deployment.

Production Domain: [**`https://revofashion-website.vercel.app`**](https://revofashion-website.vercel.app)

---

## 📄 License & Attribution

This project is maintained by **Ingrid Fortunata** as part of the RevoU Full Stack Software Engineering curriculum.  
All brand imagery and design aesthetics are curated for educational and portfolio demonstration purposes.
