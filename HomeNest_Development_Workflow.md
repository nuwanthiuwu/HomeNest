# HomeNest – Development Workflow

> **Approach:** One module at a time, full stack — backend API → frontend UI → integration → tests → done. Move to the next module only when the current one is complete and working end-to-end.

---

## How to work with Claude on each module

Before starting any module, paste this context into Claude:

```
Project: HomeNest shopping website
Stack: React + Tailwind CSS + Redux Toolkit + React Router + Axios (frontend)
       Node.js + Express + JWT + Joi (backend)
       MongoDB + Mongoose (database)
Testing: Jest (unit) | Postman (API) | Playwright (E2E)
Module I am working on: [MODULE NAME]
```

---

## Phase 1 — Planning & Architecture

Complete this phase once before writing any code.

- [ ] Define all customer module specs (see Customer Modules doc)
- [ ] Define all admin module specs (see Admin Modules doc)
- [ ] Design REST API contracts (endpoints, request/response shapes)
- [ ] Define MongoDB schemas: User, Product, Order, Category
- [ ] Sketch key screen wireframes: home, product, cart, checkout, admin dashboard
- [ ] Set up GitHub repo with branching strategy: `main` / `develop` / `feature/*`
- [ ] Create `.env` file with required variables (never commit to Git)

**Required `.env` variables:**
```
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=development
```

---

## Phase 2 — Project Setup

Complete this phase once before starting modules.

### Frontend (`/client`)
- [ ] Scaffold with Vite + React
- [ ] Install and configure Tailwind CSS
- [ ] Install Redux Toolkit and configure store
- [ ] Install React Router and define route structure
- [ ] Install Axios and create base API instance
- [ ] Create folder structure: `components/`, `pages/`, `store/`, `api/`, `hooks/`, `utils/`

### Backend (`/server`)
- [ ] Initialise Node.js + Express app
- [ ] Connect to MongoDB Atlas via Mongoose
- [ ] Install and configure Joi for validation
- [ ] Install and configure Winston for logging
- [ ] Create folder structure: `routes/`, `controllers/`, `models/`, `middleware/`, `config/`, `utils/`
- [ ] Add global error handler middleware
- [ ] Add CORS configuration pointing to `CLIENT_URL`

---

## Module Development Order

Work through modules in this sequence. Each module must be fully complete — backend, frontend, integrated, and tested — before moving to the next.

```
1  → Authentication
2  → Home Page
3  → Product Catalog
4  → Product Details
5  → Shopping Cart
6  → Checkout
7  → Orders (Customer)
8  → Admin Authentication
9  → Admin Dashboard
10 → Product Management (Admin)
11 → Category Management (Admin)
12 → Order Management (Admin)
13 → Customer Management (Admin)
14 → Inventory Module (Admin)
15 → Promotions Module (Admin)
16 → Reports Module (Admin)
17 → Wishlist (Optional)
18 → Reviews & Ratings (Optional)
```

---

## Module Template — Full Flow Checklist

Use this checklist for every module. Replace `[Module]` with the module name.

### Branch
```bash
git checkout develop
git checkout -b feature/[module-name]
```

---

### Step 1 — Mongoose Model (if new model needed)

- [ ] Create `/server/models/[Model].js`
- [ ] Define all fields with correct types, required flags, and defaults
- [ ] Add `timestamps: true`
- [ ] Add any indexes needed (e.g. `email` unique index on User)

**Claude prompt:**
```
Create a Mongoose schema for [Model] with these fields: [list fields].
Include timestamps, validation, and any relevant indexes.
Stack: Node.js + Mongoose + MongoDB.
```

---

### Step 2 — Backend Controller & Routes

- [ ] Create `/server/controllers/[module]Controller.js`
- [ ] Implement each function with async/await and try/catch
- [ ] Return correct HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Create `/server/routes/[module]Routes.js`
- [ ] Register routes in `app.js`
- [ ] Add auth middleware (`verifyToken`) to protected routes
- [ ] Add role middleware (`requireRole`) to admin routes

**Claude prompt:**
```
Write an Express controller for [module] that handles [list actions].
Use async/await, proper HTTP status codes, and Joi validation.
Stack: Node.js + Express + Mongoose + JWT.
Module: [module name]
```

---

### Step 3 — API Test (Postman)

- [ ] Create a Postman collection for the module
- [ ] Test every endpoint: happy path, missing fields, unauthorised access
- [ ] Verify correct status codes are returned
- [ ] Save working requests to the collection

**Claude prompt:**
```
Create Postman test cases for these endpoints: [list endpoints].
Cover happy path, validation errors, and auth errors.
```

---

### Step 4 — Redux Slice (if state needed)

- [ ] Create `/client/src/store/[module]Slice.js`
- [ ] Define initial state
- [ ] Write async thunks for each API call using Axios
- [ ] Handle `pending`, `fulfilled`, and `rejected` states
- [ ] Register slice in the Redux store

**Claude prompt:**
```
Write a Redux Toolkit slice for [module] with these actions: [list].
Include async thunks using Axios for API calls.
Handle loading, success, and error states.
Stack: React + Redux Toolkit + Axios.
```

---

### Step 5 — Axios API Functions

- [ ] Create or update `/client/src/api/[module]Api.js`
- [ ] Write one function per endpoint
- [ ] Attach JWT token from Redux state via Axios interceptors

**Claude prompt:**
```
Write Axios API functions for [module] covering these endpoints: [list].
Use a base Axios instance with JWT auth header attached via interceptor.
```

---

### Step 6 — React Components & Pages

- [ ] Create page component in `/client/src/pages/`
- [ ] Break page into smaller components in `/client/src/components/[module]/`
- [ ] Connect to Redux store with `useSelector` and `useDispatch`
- [ ] Add loading states and error messages
- [ ] Style with Tailwind CSS
- [ ] Add route in React Router

**Claude prompt:**
```
Create a React functional component for [ComponentName].
Use Tailwind CSS for styling, Redux Toolkit for state, and Axios for API calls.
It should: [describe behaviour and what data it displays].
Stack: React + Tailwind + Redux Toolkit.
```

---

### Step 7 — Integration Check

- [ ] Run backend and frontend together
- [ ] Confirm data flows correctly from UI → API → database → back to UI
- [ ] Check JWT token is sent on all protected requests
- [ ] Confirm correct redirects on auth failure (401 → login page)
- [ ] Test edge cases: empty states, out of stock, invalid inputs

---

### Step 8 — Unit Tests (Jest)

- [ ] Write tests for controller functions in `/server/tests/`
- [ ] Write tests for Redux slice reducers in `/client/src/tests/`
- [ ] Cover: happy path, missing data, error handling
- [ ] Run: `npm test`

**Claude prompt:**
```
Write Jest unit tests for this function: [paste code].
Cover the happy path, edge cases, and error cases.
```

---

### Step 9 — E2E Test (Playwright)

- [ ] Write a Playwright test for the key user journey in this module
- [ ] Run: `npx playwright test`

**Claude prompt:**
```
Write a Playwright E2E test for [module] covering this user journey:
[describe the steps the user takes].
Stack: Playwright + React frontend running on localhost:3000.
```

---

### Step 10 — PR & Merge

- [ ] Commit all changes with a clear message
- [ ] Push `feature/[module-name]` branch
- [ ] Open PR into `develop`
- [ ] Review code (use Claude to help if needed)
- [ ] Merge on approval

```bash
git add .
git commit -m "feat: [module name] — backend, frontend, tests"
git push origin feature/[module-name]
```

---

## Module-by-Module Reference

### Module 1 — Authentication

**Endpoints:** `POST /register` · `POST /login` · `POST /logout` · `POST /forgot-password` · `GET /profile`

**Backend tasks:**
- User model (name, email, password hash, role, isActive)
- bcrypt password hashing before save
- JWT token generation on login
- `verifyToken` middleware for protected routes
- Forgot password: generate reset token, send email

**Frontend tasks:**
- Register page
- Login page
- Forgot password page
- My profile page
- Store JWT in Redux auth slice
- Axios interceptor to attach token to all requests
- Protected route wrapper component

---

### Module 2 — Home Page

**Endpoints:** Uses `GET /products` (featured, new arrivals) · `GET /categories`

**Frontend tasks:**
- Hero banner section
- Featured products section
- Category navigation menu
- New arrivals section
- Active promotions section
- Header and footer components (shared, reused across all pages)

---

### Module 3 — Product Catalog

**Endpoints:** `GET /products` · `GET /products/search`

**Backend tasks:**
- Query params: `category`, `minPrice`, `maxPrice`, `inStock`, `rating`, `sort`, `page`, `limit`
- Full-text search on name and description
- Pagination with total count

**Frontend tasks:**
- Product listing grid
- Search bar
- Filter sidebar: category, price range, availability, rating
- Sort dropdown
- Pagination controls

---

### Module 4 — Product Details

**Endpoints:** `GET /products/:id`

**Frontend tasks:**
- Image gallery
- Product name, description, price
- Stock availability badge
- Quantity selector
- Add to cart button (dispatches to cart slice)
- Add to wishlist button (optional)

---

### Module 5 — Shopping Cart

**Endpoints:** `POST /cart` · `PUT /cart` · `DELETE /cart`

**Backend tasks:**
- Cart model or cart stored in session/Redux
- Add item, update quantity, remove item
- Calculate and return total

**Frontend tasks:**
- Cart page with item list
- Quantity update controls
- Remove item button
- Order total display
- Proceed to checkout button
- Empty cart state

---

### Module 6 — Checkout

**Endpoints:** `POST /checkout`

**Backend tasks:**
- Validate cart items still in stock
- Create order document
- Deduct stock from product inventory
- Return order confirmation

**Frontend tasks:**
- Shipping address form
- Order summary panel
- Payment method selection
- Place order button
- Order confirmation page with order ID

---

### Module 7 — Orders (Customer)

**Endpoints:** `GET /orders` · `GET /orders/:id`

**Frontend tasks:**
- Order history list
- Order detail page
- Order status display: Pending → Processing → Delivered
- Cancel order button (where eligible)

---

### Module 8 — Admin Authentication

**Endpoints:** `POST /admin/login` · `POST /admin/logout`

**Backend tasks:**
- Separate admin login or role check on standard login
- Role middleware: `requireRole('super_admin')`, `requireRole('product_manager')`, etc.
- Admin-only route guards

**Frontend tasks:**
- Admin login page (separate from customer login)
- Admin layout wrapper with sidebar navigation
- Role-based menu visibility

---

### Module 9 — Admin Dashboard

**Endpoints:** `GET /admin/stats`

**Backend tasks:**
- Aggregate: total orders, total customers, total revenue, product count

**Frontend tasks:**
- Stats cards: orders, customers, revenue, products
- Recent orders table
- Low stock alerts panel

---

### Module 10 — Product Management (Admin)

**Endpoints:** `POST /admin/products` · `PUT /admin/products/:id` · `DELETE /admin/products/:id`

**Backend tasks:**
- Create product with all fields
- Update product fields
- Soft delete (set `isActive: false`)
- Image upload handling

**Frontend tasks:**
- Product list table with search
- Add product form
- Edit product form
- Delete confirmation dialog
- Stock level display with low-stock highlight

---

### Module 11 — Category Management (Admin)

**Endpoints:** `POST /admin/categories` · `PUT /admin/categories/:id` · `DELETE /admin/categories/:id`

**Frontend tasks:**
- Category list
- Create / edit category form
- Delete confirmation

---

### Module 12 — Order Management (Admin)

**Endpoints:** `GET /admin/orders` · `PUT /admin/orders/:id/status`

**Backend tasks:**
- Status workflow: Pending → Processing → Shipped → Delivered
- Cancel order and restore stock
- Refund tracking field

**Frontend tasks:**
- Orders table with status filter
- Order detail view
- Status update dropdown
- Cancel and refund actions

---

### Module 13 — Customer Management (Admin)

**Endpoints:** `GET /admin/customers` · `PUT /admin/customers/:id/status`

**Frontend tasks:**
- Customer list with search
- Customer detail view
- Activate / deactivate toggle

---

### Module 14 — Inventory Module (Admin)

**Endpoints:** `GET /admin/inventory` · `PUT /admin/inventory/:productId`

**Backend tasks:**
- Low stock threshold check (e.g. stock < 10)
- Manual stock adjustment

**Frontend tasks:**
- Inventory list with stock levels
- Low stock alert badges
- Manual adjustment form

---

### Module 15 — Promotions Module (Admin)

**Endpoints:** `POST /admin/coupons` · `PUT /admin/coupons/:id` · `DELETE /admin/coupons/:id`

**Backend tasks:**
- Coupon model: code, discount type (% or fixed), value, expiry, usage limit
- Validate coupon at checkout
- Campaign management

**Frontend tasks:**
- Coupon list
- Create / edit coupon form
- Active campaigns display

---

### Module 16 — Reports Module (Admin)

**Endpoints:** `GET /admin/reports/sales` · `GET /admin/reports/customers` · `GET /admin/reports/products`

**Backend tasks:**
- Aggregate sales by date range
- Top products by revenue
- New customers over time

**Frontend tasks:**
- Sales report with date filter
- Charts for revenue over time
- Product performance table
- Customer growth summary

---

### Module 17 — Wishlist (Optional)

**Endpoints:** `POST /wishlist` · `DELETE /wishlist/:productId` · `GET /wishlist`

**Frontend tasks:**
- Wishlist page
- Save / remove product
- Move to cart button

---

### Module 18 — Reviews & Ratings (Optional)

**Endpoints:** `POST /products/:id/reviews` · `GET /products/:id/reviews`

**Backend tasks:**
- Review model: user, product, rating (1–5), comment
- Recalculate product average rating on new review

**Frontend tasks:**
- Review form on product detail page
- Star rating input
- Review list display

---

## Phase 7 — Deployment

Complete after all modules are done and tested.

- [ ] Set all production env vars in Vercel and Render dashboards
- [ ] Deploy frontend to Vercel — connect GitHub repo, set `main` as production branch
- [ ] Deploy backend to Render — Node.js web service, connect GitHub repo
- [ ] Confirm MongoDB Atlas connection from Render backend
- [ ] Add Atlas indexes for `email`, `product name`, `order status`
- [ ] Verify CORS `CLIENT_URL` points to production Vercel URL
- [ ] Install Google Analytics on frontend
- [ ] Confirm Winston logging is writing to log files in production
- [ ] Run full Playwright E2E suite against production URL

---

## Git Commit Convention

```
feat:    new feature
fix:     bug fix
test:    adding or updating tests
refactor: code change that doesn't add a feature or fix a bug
docs:    documentation changes
chore:   build process or tooling changes
```

**Examples:**
```bash
git commit -m "feat: authentication — register, login, JWT middleware"
git commit -m "feat: shopping cart — add, remove, update quantity"
git commit -m "test: checkout — Playwright E2E order placement flow"
git commit -m "fix: product catalog — pagination total count off by one"
```

---

*HomeNest Development Workflow · v1.0 · One module at a time, full stack.*
