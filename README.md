# RevoFashion — Contemporary Minimalist Storefront

An e-commerce web application engineered with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Base UI**, **TanStack Query v5**, and **Zustand**. Designed with a minimalist lifestyle aesthetic inspired by Japanese contemporary fashion (Uniqlo/Muji), tailored for elegance, everyday comfort, and high-performance server-rendered shopping journeys.

---

## 🌟 Key Features

### 1. Uniqlo-Inspired Storefront Home (`/`)
- **Lifestyle Hero Carousel**: Interactive banner showcasing contemporary lifestyle imagery with smooth transitions, left/right navigation controls, accessible indicators, and hover-pause autoplay.
- **Featured Collection (SSR)**: Pure Server Component prefetching that renders the first 5 featured garments as read-only `ProductCard` components.
- **Catalog CTA**: Prominent "View All Products" button routing seamlessly to the full catalog.

### 2. Product Catalog, Search & Filtering (`/products`)
- **Server Component Prefetching**: Initial products pre-rendered via Server Component fetch using unified isomorphic services.
- **TanStack Query State Coordination**: Zero-`useEffect` client coordination powered by TanStack Query (`useProductsQuery`), providing instant cache hits and background revalidation.
- **Live Search**: Controlled search bar that reads URL query parameters and navigates to `/products?search=${query}` upon pressing Enter.
- **Category Filter**: Accessible category dropdown and horizontal quick-filter pills that update URL queries and dynamically refetch results.
- **Fashion Attribute Filters**: Toolbar for filtering by **Gender** (`Men`, `Women`, `Unisex`, `Kids`), **Size** (`XS`–`XXL`, `Free Size`), and **Sort Order** (`Newest`, `Oldest`, `Price: Low to High`, `Price: High to Low`).
- **Active Filter Chips**: Removable chips for active filters with an instant "Clear all" reset trigger.
- **Pagination**: Accessible pagination bar with previous, next, and numbered page controls.

### 3. ProductCard with Multi-Image Carousel & Fallback
- **Image Priority**: Automatically prioritizes `primary_image` as the first image.
- **Interactive Mini-Carousel**: When multiple photos exist (up to 3 images), renders subtle left/right floating arrows and indicator dots directly on the image container.
- **Cute Fallback Placeholder**: If a product has no image or if the image fails to load (`onError`), it automatically falls back to `/images/no-photo.png` centered with non-distorting `object-contain p-6` styling.
- **Stock Badges & Price**: Displays "In Stock" (emerald green) or "Out of Stock" (rose) badges, formatted USD currency, category names, and fashion tags.
- **Conditional Actions**:
  - *Home page*: Displays clean, read-only cards (`readOnly={true}`).
  - *Unauthenticated*: Renders "Sign In to Buy" button redirecting to `/login?redirect=/products`.
  - *Authenticated*: Renders active "Add to Cart" button integrating with `useCartStore` with Sonner toast feedback (disabled when stock is 0).

### 4. Authentication & Protected User Profile
- **Registration (`/register`)**: Strict client-side validation (RFC email regex, trimmed whitespace, 8+ character passwords), 409 conflict interceptor translation, and auto-redirect to `/login`.
- **Login (`/login`)**: Secure JWT cookie storage (`revofashion_token`) with server-safe cookie utilities and role-based redirecting.
- **User Profile (`/profile`)**: Protected view and edit form (`PUT /users/:id`) with dirty-state detection, instant session synchronization with `useAuthStore`, and accessible desktop/mobile navigation dropdowns.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.4 (App Router) | Hybrid Server Components (SSR) & Client Components (CSR) |
| **Language** | TypeScript 5 | End-to-end type safety across API models, stores, and components |
| **Styling** | Tailwind CSS v4 & PostCSS | Custom Rose minimalist palette, CSS variables, modern responsive grids |
| **Primitives** | Base UI (`@base-ui/react`) | Accessible, unstyled UI primitives (Button, Input, Dialog, etc.) |
| **Server State** | TanStack Query v5 | Data fetching, background caching, and query synchronization |
| **Client State** | Zustand v5 | Persistent client-side stores (`useAuthStore`, `useCartStore`) |
| **Feedback** | Sonner | Toasts integrated with automated backend error code translation |
| **Icons** | Lucide React | Modern minimalist icons |

---

## 📁 Project Directory Structure

```
RevoFashion/
├── docs/
│   ├── guideline/               # API documentation, error codes, and rubric requirements
│   ├── plans/                   # Implementation plans (Plans 01 through 14)
│   └── track-progress/          # Completed milestone tracking and verification notes
├── public/
│   └── images/
│       ├── no-photo.png         # Cute placeholder illustration for missing images
│       └── homepage/            # 4 lifestyle carousel banner images (image1.png - image4.png)
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication route group (/login, /register)
│   │   ├── (shop)/              # Public storefront route group
│   │   │   ├── page.tsx         # Home page (HeroCarousel + 5 featured read-only cards)
│   │   │   └── products/        # Product catalog (/products, layout, loading, error)
│   │   ├── globals.css          # Tailwind CSS v4 theme variables and base styles
│   │   └── layout.tsx           # Root application layout with providers and Sonner toaster
│   ├── components/
│   │   ├── common/              # Shared general components (SearchBar)
│   │   ├── layouts/             # Header, Navbar, UserDropdown, Footer
│   │   ├── providers/           # QueryProvider and global React context providers
│   │   ├── routes/              # ProtectedRoute, PublicOnlyRoute
│   │   └── ui/                  # Atomic UI primitives (Badge, Button, Card, Skeleton, etc.)
│   ├── features/
│   │   ├── auth/                # Login and registration forms, hooks, and services
│   │   ├── profile/             # Profile summary, edit form, hooks, and services
│   │   └── products/            # Product catalog components, hooks, and services
│   ├── lib/
│   │   ├── cookies.ts           # Isomorphic server-safe JWT cookie utilities
│   │   ├── toast.ts             # Centralized toast utility with error translations
│   │   └── api/
│   │       ├── client.ts        # Isomorphic HTTP client using native fetch
│   │       ├── interceptors.ts  # Request, response, and error interceptor pipeline
│   │       ├── error-codes.ts   # Human-friendly translations for all backend error codes
│   │       └── error-interceptor.ts # Error interceptor translating codes on SSR and CSR
│   ├── stores/
│   │   ├── useAuthStore.ts      # Authentication Zustand store with cookie sync
│   │   └── useCartStore.ts      # Persistent shopping cart store (localStorage)
│   └── types/                   # TypeScript interfaces (Product, Category, User, Api, Cart)
├── .env.example                 # Example environment variables
├── .env.local                   # Local environment configuration
├── package.json                 # Project dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

---

## ⚡ Unified Isomorphic Architecture (SSR + CSR)

Our HTTP client (`src/lib/api/client.ts`), services (`productService`, `categoryService`), and error interceptors are designed to run isomorphically across **both Server-Side Rendering and Client-Side Rendering**:

1. **Native `fetch` Under the Hood**: `client.get()` delegates to native `fetch()`, ensuring full compatibility with Next.js Server Components and server-side caching.
2. **Central Error Translation**: When the backend returns an error code (e.g. `PRODUCT_NOT_FOUND`, `USER_CONFLICT`), `defaultErrorInterceptor` automatically translates it using `translateApiError()`:
   - On the **Server**: Sets `apiError.message = "${title}: ${description}"` so server error boundaries (`error.tsx`) receive clean, human-readable text.
   - On the **Client**: Automatically displays a Sonner error toast.
3. **Server-Safe Cookies**: `cookies.ts` safely guards all `document.cookie` operations with `typeof window !== 'undefined'` checks.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18 or higher
- npm 9 or higher

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd RevoFashion
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://revofashion-shop.onrender.com
```

### 4. Running the Development Server
Start the local Next.js dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

---

## 🧪 Quality Assurance & Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on port 3000 |
| `npm run build` | Builds the optimized production bundle with full typechecking |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint across all source files |
| `npx tsc --noEmit` | Validates TypeScript types across the entire codebase |

---

## 📖 Documentation & References

- **Implementation Plans**: Detailed roadmap and architectural specifications are maintained in [`/docs/plans/`](./docs/plans/).
- **Progress Tracking**: Milestone logs and validation outcomes are recorded in [`/docs/track-progress/`](./docs/track-progress/).
- **Backend API & Rubric**: Endpoints and requirements are detailed in [`/docs/guideline/`](./docs/guideline/).
