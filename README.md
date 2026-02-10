<div align="center">

![alt text](/frontend/public/electro-store.png)

# ⚡ Electro Store

### Modern Full-Stack E-Commerce Platform for Electronics

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Electro Store** is a production-ready, full-stack e-commerce web application built for buying and selling electronics. It features a sleek, responsive storefront powered by **Vue 3** and a robust RESTful API backend powered by **NestJS**, with **Stripe** payment integration, **JWT** authentication, role-based access control, and full **Docker** containerization for effortless deployment.

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API Reference](#-api-reference) · [Environment Variables](#-environment-variables) · [Troubleshooting](#-troubleshooting) · [Developers](#-developers)

</div>

---

## 🎯 Project Goal

To deliver a **complete, modern e-commerce experience** — from product browsing and cart management to secure online payments — using industry-standard technologies and best practices. The project demonstrates full-stack development skills including authentication, authorization, payment processing, file uploads, responsive UI design, and containerized deployment.

---

## ✨ Features

### 🛒 Storefront & Shopping
- **Product Catalog** — Browse, search, filter by category, price range, and pagination
- **Product Details** — Detailed view with specs, images, ratings, and discount badges
- **Shopping Cart** — Persistent client-side cart with quantity management (localStorage)
- **Wishlist** — Save favorite products for later (localStorage)
- **Deals Section** — Dedicated page for discounted products
- **Brand Showcase** — Browse products by brand with brand detail pages

### 💳 Checkout & Payments
- **Stripe Integration** — Secure payment processing with Stripe Payment Elements
- **Payment Intent Flow** — Server-side PaymentIntent creation with client-side confirmation
- **Webhook Support** — Real-time payment status updates via Stripe webhooks
- **3D Secure** — Support for additional authentication when required
- **Order Confirmation** — Post-payment success/cancellation pages

### 🔐 Authentication & Authorization
- **JWT Authentication** — Secure token-based auth with Passport.js
- **Role-Based Access Control** — `USER` and `ADMIN` roles with route guards
- **Password Hashing** — bcrypt with salt rounds for secure storage
- **Protected Routes** — Frontend and backend route protection

### 📦 Order Management
- **Order Creation** — Cart-to-order conversion with item snapshots
- **Order History** — Users can view their past orders with pagination
- **Order Status Tracking** — `PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `COMPLETED`
- **Order Cancellation** — Cancel pending orders
- **Admin Order Management** — View, update status, and manage all orders

### 🛠️ Admin Dashboard
- **Dashboard Home** — Stats overview with charts and key metrics
- **Product Management** — Create, edit, delete products with image uploads
- **Order Management** — View and update all customer orders
- **User Management** — View and manage registered users
- **Deals Management** — Configure product deals and discounts

### 🎨 User Experience
- **Responsive Design** — Mobile-first layout with Tailwind CSS
- **Splash Screen** — Animated loading screen on first visit
- **Scroll Animations** — GSAP-powered animations on scroll
- **Skeleton Loaders** — Smooth loading states throughout
- **Toast Notifications** — Real-time feedback on user actions
- **Hero Section & Carousels** — Dynamic homepage with featured content

### 📰 Other
- **Newsletter Subscription** — Email subscription system
- **Brand Seeder** — Pre-populate brands with logos from Wikipedia
- **File Uploads** — Product images & brand logos with Multer
- **Static File Serving** — Uploaded assets served directly by NestJS

---

## 🧰 Tech Stack

### Backend

| Technology | Purpose |
|:---|:---|
| 🟥 **NestJS 11** | API framework (TypeScript) |
| 🐘 **PostgreSQL 16** | Relational database |
| 🔗 **TypeORM** | Object-Relational Mapping |
| 🔑 **Passport + JWT** | Authentication |
| 🔒 **bcrypt** | Password hashing |
| 💰 **Stripe SDK** | Payment processing |
| 📁 **Multer** | File upload handling |
| ✅ **class-validator** | DTO validation |
| 🧪 **Jest + Supertest** | Testing |

### Frontend

| Technology | Purpose |
|:---|:---|
| 💚 **Vue 3** | Reactive UI framework |
| 🧭 **Vue Router** | Client-side routing |
| 🍍 **Pinia** | State management |
| ⚡ **Vite 7** | Build tool & dev server |
| 🎨 **Tailwind CSS 4** | Utility-first styling |
| 🧩 **shadcn-vue + reka-ui** | UI component library |
| 📡 **Axios** | HTTP client |
| 💳 **@stripe/stripe-js** | Stripe Elements (frontend) |
| 🎬 **GSAP** | Scroll & page animations |
| 🔷 **Lucide Icons** | Icon set |
| 🧰 **@vueuse/core** | Vue composition utilities |

### Infrastructure

| Technology | Purpose |
|:---|:---|
| 🐳 **Docker & Docker Compose** | Containerization |
| 🟢 **Node.js 20** | Runtime environment |
| 📦 **npm** | Package management |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

| Requirement | Version | Check Command |
|:---|:---|:---|
| 🐳 **Docker Desktop** | Latest | `docker --version` |
| 🐳 **Docker Compose** | v2+ | `docker compose version` |
| 🟢 **Node.js** *(optional, for local dev)* | 20.x+ | `node --version` |
| 📦 **npm** *(optional, for local dev)* | 9.x+ | `npm --version` |
| 🔧 **Git** | Latest | `git --version` |

> 💡 **Docker is the recommended way to run this project** — it handles PostgreSQL, backend, and frontend for you automatically.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/electro-store.git
cd electro-store
```

### 2️⃣ Configure Environment Variables

**Create root `.env`** for Docker Compose (PostgreSQL):

```bash
# .env (project root)
DB_NAME=electro_store
DB_USER=postgres
DB_PASSWORD=postgres
```

**Create `backend/.env`** for the NestJS API:

```bash
# backend/.env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/electro_store
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Create `frontend/.env`** *(optional — defaults work for local dev)*:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

> 🔑 Get your Stripe test keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

### 3️⃣ Run with Docker Compose

```bash
docker compose up --build
```

This will start **3 services**:

| Service | URL | Description |
|:---|:---|:---|
| 🖥️ **Frontend** | http://localhost:5173 | Vue 3 storefront |
| 🔧 **Backend** | http://localhost:3000 | NestJS REST API |
| 🐘 **PostgreSQL** | `localhost:5434` | Database (mapped from container port 5432) |

### 4️⃣ Seed Sample Data *(optional)*

Populate the database with brand data (logos + inventor images pulled from Wikipedia):

```bash
docker exec -it electro_backend sh -c "npm run seed:brands"
```

### 5️⃣ Access the Application

- 🌐 **Storefront:** http://localhost:5173
- 🔧 **API:** http://localhost:3000
- 📖 **Register** a new user at `/auth/register` or create an admin through the API

---

### 🖥️ Run Locally (Without Docker)

If you prefer running without Docker, you'll need PostgreSQL installed locally.

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

> ⚠️ Make sure to update `DATABASE_URL` in `backend/.env` to point to your local PostgreSQL instance.

---

## 📁 Project Structure

```
electro-store/
├── 📄 docker-compose.yml          # Container orchestration (3 services)
├── 📄 .env                        # Root env vars (DB credentials)
├── 📄 README.md
├── 📄 STRIPE_TESTING.md           # Stripe payment testing guide
│
├── 🔧 backend/                    # NestJS REST API
│   ├── 📄 Dockerfile              # Multi-stage production build
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📁 public/uploads/         # Uploaded files (products, brands)
│   └── 📁 src/
│       ├── 📄 main.ts             # App bootstrap (port 3000, CORS, validation)
│       ├── 📄 app.module.ts       # Root module (imports all feature modules)
│       ├── 📁 config/             # Database configuration
│       ├── 📁 seeds/              # Database seeders (brands)
│       └── 📁 modules/
│           ├── 🔐 auth/           # Register, login, JWT, guards, roles
│           ├── 👤 users/          # User management & profile
│           ├── 📦 products/       # CRUD, search, filter, image upload
│           ├── 🏷️ categories/     # Product categories CRUD
│           ├── 🏢 brands/         # Brands with logo/inventor uploads
│           ├── 🛒 orders/         # Order lifecycle & status management
│           ├── 💳 payments/       # Stripe PaymentIntent & webhooks
│           └── 📰 newsletter/     # Email subscriptions
│
└── 💚 frontend/                   # Vue 3 SPA
    ├── 📄 package.json
    ├── 📄 vite.config.js
    ├── 📄 index.html
    ├── 📁 public/                 # Static assets (images, icons)
    └── 📁 src/
        ├── 📄 App.vue             # Root component
        ├── 📄 main.js             # App entry (plugins, directives)
        ├── 📁 assets/             # CSS, images
        ├── 📁 components/         # Shared/global components (25+)
        ├── 📁 composables/        # Vue composables (useToast)
        ├── 📁 directives/         # Custom directives (v-aos)
        ├── 📁 lib/                # Axios, fetch wrapper, auth utils
        ├── 📁 router/             # Vue Router configuration
        ├── 📁 views/              # Layout views (Dashboard, Home)
        └── 📁 modules/            # Feature modules
            ├── 🔐 auth/           # Login & register pages
            ├── 🛍️ product/        # Product list, detail, filters
            ├── 🏢 brand/          # Brand listing & detail
            ├── 🛒 cart/           # Cart with localStorage
            ├── 💳 checkout/       # Checkout form & Stripe payments
            ├── 📦 order/          # Order history & confirmation
            ├── 📊 dashboard/      # Admin panel (stats, CRUD)
            ├── 🏷️ deal/           # Deals page
            ├── 📁 category/       # Category views
            ├── 👤 profile/        # User profile
            └── ❤️ wishlist/       # Wishlist with localStorage
```

---

## 🔌 API Reference

### 🔐 Auth

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login → returns JWT | ❌ |

### 📦 Products

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/products` | List products (paginated, filterable) | ❌ |
| `GET` | `/products/deals` | Get deal products | ❌ |
| `GET` | `/products/:id` | Get product details | ❌ |
| `POST` | `/products` | Create product (with image) | 🔒 Admin |
| `PATCH` | `/products/:id` | Update product | 🔒 Admin |
| `DELETE` | `/products/:id` | Delete product | 🔒 Admin |

**Query Parameters:** `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`

### 🏢 Brands

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/brands` | List all brands | ❌ |
| `GET` | `/brands/:id` | Get brand details | ❌ |
| `POST` | `/brands` | Create brand (logo + inventor image) | 🔒 Admin |
| `PATCH` | `/brands/:id` | Update brand | 🔒 Admin |
| `DELETE` | `/brands/:id` | Delete brand | 🔒 Admin |

### 🏷️ Categories

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/categories` | List all categories | ❌ |
| `GET` | `/categories/:id` | Get category details | ❌ |
| `POST` | `/categories` | Create category | ❌ |
| `PATCH` | `/categories/:id` | Update category | ❌ |
| `DELETE` | `/categories/:id` | Delete category | ❌ |

### 🛒 Orders

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/orders` | Create order | 🔒 User |
| `GET` | `/orders/me` | Get my orders (paginated) | 🔒 User |
| `GET` | `/orders/:id` | Get specific order | 🔒 User |
| `POST` | `/orders/:id/pay` | Mark order as paid | 🔒 User |
| `POST` | `/orders/:id/cancel` | Cancel order | 🔒 User |
| `GET` | `/orders` | List all orders | 🔒 Admin |
| `PATCH` | `/orders/:id/status` | Update order status | 🔒 Admin |
| `DELETE` | `/orders/:id` | Delete order | 🔒 Admin |

### 💳 Payments

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/payments/create-intent/:orderId` | Create Stripe PaymentIntent | 🔒 User |
| `POST` | `/payments/verify/:orderId` | Verify payment status | 🔒 User |
| `POST` | `/payments/webhook` | Stripe webhook handler | ❌ |

### 👤 Users

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/users/me` | Get current user profile | 🔒 User |
| `GET` | `/users` | List all users | ❌ |
| `GET` | `/users/:id` | Get user by ID | ❌ |
| `POST` | `/users` | Create user | ❌ |

### 📰 Newsletter

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/newsletter` | Subscribe email | ❌ |

---

## 🔑 Environment Variables

### Root `.env` (Docker Compose)

| Variable | Description | Example |
|:---|:---|:---|
| `DB_NAME` | PostgreSQL database name | `electro_store` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |

### `backend/.env`

| Variable | Description | Example |
|:---|:---|:---|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@postgres:5432/electro_store` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |

### `frontend/.env`

| Variable | Description | Example |
|:---|:---|:---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_API_URL` | Backend URL for images/assets | `http://localhost:3000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

---

## 💳 Stripe Test Cards

For testing payments in development, use these [Stripe test cards](https://docs.stripe.com/testing):

| Card Number | Scenario |
|:---|:---|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

> Use any future expiry date, any 3-digit CVC, and any ZIP code.

---

## 🐛 Troubleshooting

### 🐳 Docker Issues

| Problem | Solution |
|:---|:---|
| **Port already in use** | Stop conflicting services: `docker compose down` then retry, or change ports in `docker-compose.yml` |
| **Database connection refused** | Ensure PostgreSQL container is running: `docker ps`. Wait a few seconds for DB startup |
| **Containers fail to start** | Check logs: `docker compose logs -f backend` or `docker compose logs -f frontend` |
| **Volume permission errors** | Try `docker compose down -v` to remove volumes, then `docker compose up --build` |
| **`node_modules` conflicts** | Remove local `node_modules`: `rm -rf backend/node_modules frontend/node_modules` then restart containers |

### 🔧 Backend Issues

| Problem | Solution |
|:---|:---|
| **`DATABASE_URL` errors** | Ensure `backend/.env` exists and the connection string is correct. Inside Docker, the host is `postgres` (service name), not `localhost` |
| **Stripe webhook fails** | For local dev, use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks: `stripe listen --forward-to localhost:3000/payments/webhook` |
| **File upload errors** | Ensure `backend/public/uploads/products/` and `backend/public/uploads/brands/` directories exist |
| **TypeORM sync issues** | The app uses `synchronize: true` in dev — restart the backend to apply entity changes |

### 💚 Frontend Issues

| Problem | Solution |
|:---|:---|
| **API requests fail** | Ensure backend is running on port 3000. Check CORS settings in `main.ts` |
| **Blank page** | Check browser console for errors. Ensure `VITE_API_BASE_URL` is set correctly |
| **Stripe form not loading** | Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set in `frontend/.env` |
| **Hot reload not working** | Docker: Ensure `CHOKIDAR_USEPOLLING=true` is set. Local: restart `npm run dev` |

### 🔄 Common Commands

```bash
# Rebuild all containers from scratch
docker compose down -v && docker compose up --build

# View real-time logs
docker compose logs -f

# Enter backend container shell
docker exec -it electro_backend sh

# Enter frontend container shell
docker exec -it electro_frontend sh

# Reset database (destroys all data)
docker compose down -v
```

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users      │     │   products   │     │  categories  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (UUID)     │     │ id (UUID)    │     │ id (UUID)    │
│ email         │     │ name         │     │ name         │
│ password      │     │ description  │     │ createdAt    │
│ role          │     │ price        │     │ updatedAt    │
│ createdAt     │     │ stock        │     └──────┬───────┘
│ updatedAt     │     │ rating       │            │
└──────┬───────┘     │ imageUrl     │     ┌──────┴───────┐
       │              │ discountPct  │◄────│  categoryId  │
       │              │ specs (JSON) │     └──────────────┘
       │              │ createdAt    │
       │              │ updatedAt    │     ┌──────────────┐
       │              └──────┬───────┘     │    brands    │
       │                     │             ├──────────────┤
       │              ┌──────┴───────┐     │ id (UUID)    │
       │              │   brandId    │◄────│ name         │
       │              └──────────────┘     │ logoUrl      │
       │                                   │ inventorName │
┌──────┴───────┐     ┌──────────────┐     │ inventorImage│
│   orders      │     │ order_items  │     │ createdAt    │
├──────────────┤     ├──────────────┤     │ updatedAt    │
│ id (UUID)     │◄───│ orderId      │     └──────────────┘
│ userId        │     │ productId    │
│ totalAmount   │     │ quantity     │     ┌──────────────┐
│ status        │     │ priceAtTime  │     │ subscribers  │
│ stripeIntentId│     └──────────────┘     ├──────────────┤
│ createdAt     │                          │ id (UUID)    │
└──────────────┘                           │ email        │
                                           │ createdAt    │
                                           └──────────────┘
```

---

## 🧑‍💻 Developers

<div align="center">

| Developer | Role |
|:---|:---|
| 👨‍💻 **Do Davin ID: p20230018** | Full-Stack Developer |
| 👨‍💻 **Tat Chansereyvong ID: p20230021** | Full-Stack Developer |

</div>

---

## 📄 License

This project is for **educational purposes** — built as an IP (Individual/Integration Project).

---

<div align="center">

**⚡ Built with passion for modern web development ⚡**

Made with ❤️ using Vue 3 + NestJS + PostgreSQL

</div>
