# 👗 Minimalist Clothing Brand Application

A modern, full-stack e-commerce web application tailored for a fashion/clothing brand. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Node.js/Express**, and **PostgreSQL with Prisma ORM**.

---

## 🌟 Key Features

### 🛍️ Storefront & Shopping Experience
- **Minimalist Aesthetic**: Clean white/neutral palette, refined typography, and high-quality product imagery.
- **Hero & Curated Collections**: Engaging homepage hero with CTA, featured products, categories, and new arrivals.
- **Product Catalog with Dynamic Filters**: Category selection, price range filtering, size selectors, and instant search.
- **Product Detail Page**: Multi-angle image gallery, size and color variant selector, live stock validation, customer reviews, and wishlist toggle.
- **Persistent Cart**: Zustand store with client persistence and automatic syncing to backend when logged in.
- **Multi-Step Checkout**: 3-step checkout (Shipping Address, Delivery Method, Review & Place Order).

### 👤 Customer Account & Orders
- **Authentication**: JWT authentication with access & refresh tokens, password hashing with `bcryptjs`.
- **Order Tracking**: Visual step-by-step order progress timeline (`PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
- **Wishlist**: Save favorite items and manage them in a dedicated wishlist dashboard.
- **Order History**: Detailed view of past orders, pricing breakdown, and fulfillment tracking.
- **Customer Reviews**: Verified customer ratings (1-5 stars) and feedback.

### ⚡ Admin Dashboard (`/admin`)
- **Real-Time Analytics**: Lifetime revenue, total orders, active products, and customer counts.
- **Order Management**: View all incoming orders, customer details, and update fulfillment status in one click.
- **Product Management**: Full CRUD capability — add new clothing items, manage sizes, colors, stock counts, and upload images.
- **Category Management**: Create and edit product categories and collections.
- **Admin Guard**: Protected layout preventing unauthorized access.

---

## 📁 Project Architecture

```
clothing-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Product, Category, Order, Cart, Review, etc.)
│   │   └── seed.ts             # Seeds 3 categories, 10 products with variants, and admin/customer accounts
│   ├── src/
│   │   ├── controllers/        # Auth, Products, Categories, Cart, Orders, Reviews, Admin controllers
│   │   ├── middleware/         # JWT Auth & Admin role guards
│   │   ├── routes/             # Express API routes mounted under /api
│   │   └── index.ts            # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── (store)/            # Storefront routes (products, cart, checkout)
    │   ├── (auth)/             # Login and Signup pages
    │   ├── (account)/          # User profile, orders, order tracking, wishlist
    │   ├── admin/              # Admin dashboard, products, orders, categories
    │   ├── layout.tsx          # Root layout with Navbar and Footer
    │   ├── page.tsx            # Homepage
    │   └── providers.tsx       # React Query provider
    ├── components/
    │   ├── admin/              # StatsCard, OrderTable, ProductTable, Sidebar
    │   ├── cart/               # CartItem
    │   ├── checkout/           # AddressForm, StepIndicator, OrderSummary
    │   ├── layout/             # Navbar, Footer
    │   ├── orders/             # OrderTracking, OrderCard
    │   ├── products/           # ProductCard, ProductGrid, ProductFilters, AddToCartButton, ReviewCard
    │   └── ui/                 # Button, Input, Modal, Badge, Skeleton, StarRating
    ├── hooks/                  # React Query hooks (useProducts, useCart, useOrders, useCategories, etc.)
    ├── store/                  # Zustand stores (authStore, cartStore)
    ├── lib/                    # Axios API client, types, utility functions
    ├── .env.local.example
    ├── package.json
    └── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Local PostgreSQL instance, or a cloud database (e.g. Supabase, Neon, Railway)

---

### 1. Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd clothing-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your PostgreSQL connection string:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://username:password@localhost:5432/clothing_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   ```

5. Push the Prisma schema to create database tables:
   ```bash
   npx prisma db push
   ```

6. Seed the database with sample categories, products, and default accounts:
   ```bash
   npm run seed
   ```

7. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on **`http://localhost:4000`**.

---

### 2. Frontend Setup

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd clothing-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Ensure it points to your backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend store will run on **`http://localhost:3000`**.

---

## 🔑 Default Accounts (from Seed)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@store.com` | `Admin123!` |
| **Customer** | `jane@example.com` | `Customer123!` |
| **Customer** | `john@example.com` | `Customer123!` |

- Logging in with `admin@store.com` automatically unlocks the `/admin` navigation and dashboard.
- Logging in with customer accounts allows adding items to cart, placing orders, writing reviews, and tracking deliveries.

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register customer | Public |
| `POST` | `/api/auth/login` | Login user & issue tokens | Public |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `GET` | `/api/products` | Filtered product catalog & pagination | Public |
| `GET` | `/api/products/:slug` | Product detail with reviews & variants | Public |
| `POST` | `/api/products` | Create product with variants & images | Admin |
| `PUT` | `/api/products/:id` | Update product | Admin |
| `DELETE` | `/api/products/:id` | Delete product | Admin |
| `GET` | `/api/categories` | List categories with product count | Public |
| `POST` | `/api/categories` | Create category | Admin |
| `GET` | `/api/cart` | Get current user's cart | Authenticated |
| `POST` | `/api/cart/items` | Add item to cart | Authenticated |
| `POST` | `/api/orders` | Place new order | Authenticated |
| `GET` | `/api/orders` | List customer's orders | Authenticated |
| `GET` | `/api/orders/all` | List all orders across store | Admin |
| `PUT` | `/api/orders/:id/status` | Update fulfillment status | Admin |
| `GET` | `/api/admin/analytics` | Overview statistics & pipeline data | Admin |

---

## 🎨 Rebranding & Customization

1. **Brand Name**: Update `BRAND` text in `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, and `components/admin/Sidebar.tsx`.
2. **Colors & Theme**: Adjust Tailwind classes in `frontend/tailwind.config.ts`.
3. **Product Images**: Upload your own lookbook and product photos via the `/admin/products/new` dashboard.
