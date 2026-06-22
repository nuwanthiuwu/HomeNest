# Module 10 — Product Management (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-products`
> **Depends on:** Module 08 (Admin Auth), Module 11 (Categories — needed for category dropdown)

---

## Overview

Allow admins to create, edit, delete, and manage all products and their inventory levels.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/products` | Yes | All admin |
| GET | `/admin/products/:id` | Yes | All admin |
| POST | `/admin/products` | Yes | product_manager, super_admin |
| PUT | `/admin/products/:id` | Yes | product_manager, super_admin |
| DELETE | `/admin/products/:id` | Yes | super_admin only |

---

## Data Model — Product

| Field | Type | Rules |
|-------|------|-------|
| `name` | String | Required |
| `price` | Number | Required, min 0 |
| `description` | String | Required |
| `category` | ObjectId | Ref: Category |
| `images` | [String] | Array of image URLs |
| `stock` | Number | Default 0 |
| `ratings` | Object | `{ average: Number, count: Number }` |
| `featured` | Boolean | Default false |
| `isActive` | Boolean | Default true (soft delete flag) |
| `createdAt` | Date | Auto |

---

## Dev Checklist

### Step 1 — Model & Controller
- [ ] Create `/server/models/Product.js`
- [ ] Add text index on `name` and `description`
- [ ] `getAllProducts` (admin) — all products including inactive, with pagination and search
- [ ] `getProductByIdAdmin` — full product detail for edit form
- [ ] `createProduct` — validate all required fields
- [ ] `updateProduct` — partial update allowed
- [ ] `deleteProduct` — soft delete (`isActive: false`), super_admin only
- [ ] Create `/server/routes/adminProductRoutes.js`

### Step 2 — API Tests (Postman)
- [ ] `POST /admin/products` with valid data → 201
- [ ] `POST /admin/products` with missing name → 400
- [ ] `PUT /admin/products/:id` → 200, updated product
- [ ] `DELETE /admin/products/:id` with super_admin → 200
- [ ] `DELETE /admin/products/:id` with product_manager → 403

### Step 3 — Axios Functions
- [ ] Add to `/client/src/api/adminApi.js`: `getAdminProducts`, `createProduct`, `updateProduct`, `deleteProduct`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/adminProductSlice.js`
- [ ] State: `products`, `selectedProduct`, `loading`, `error`
- [ ] Thunks: `fetchAdminProducts`, `createProduct`, `updateProduct`, `deleteProduct`

### Step 5 — React Components
- [ ] Admin products list page (`/admin/products`)
- [ ] Products table with: image thumbnail, name, category, price, stock, status, actions
- [ ] Search input at top of table
- [ ] Add Product button → modal or `/admin/products/new`
- [ ] `ProductForm` — fields for all product attributes, category dropdown, image URL inputs
- [ ] Edit product page (`/admin/products/:id/edit`)
- [ ] Delete confirmation dialog

### Step 6 — Integration Check
- [ ] Product form pre-fills on edit
- [ ] Deleting a product soft-deletes (not hard delete) — verify `isActive: false` in DB
- [ ] Deleted products disappear from customer catalog immediately
- [ ] `product_manager` cannot see delete button

### Step 7 — Unit Tests (Jest)
- [ ] `createProduct` — success, missing fields, duplicate name
- [ ] `deleteProduct` — super_admin succeeds, product_manager blocked

### Step 8 — E2E Tests (Playwright)
- [ ] Admin creates a new product and it appears in the products list
- [ ] Admin edits a product price and change is reflected in the customer catalog

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: admin product management — CRUD, soft delete, product form"`
- [ ] Push and merge into `develop`

---

## Acceptance Criteria

### AC-APROD-01 — Products List
- **Given** an admin navigates to `/admin/products`
- **When** the page loads
- **Then** all products (including inactive) are listed in a table with image, name, category, price, stock, and status

### AC-APROD-02 — Create Product
- **Given** an admin fills the product form with all required fields and submits
- **When** the form is submitted
- **Then** the product is created, appears in the products list, and is visible to customers on the storefront

### AC-APROD-03 — Create Product Validation
- **Given** an admin submits the product form with missing required fields
- **When** the form is submitted
- **Then** validation errors are shown for each missing field and the product is not created

### AC-APROD-04 — Edit Product
- **Given** an admin clicks Edit on a product
- **When** the edit page loads
- **Then** the form is pre-filled with the product's current data

### AC-APROD-05 — Update Product
- **Given** an admin changes the price and clicks Save
- **When** the form is submitted
- **Then** the updated price is saved and immediately reflected on the customer-facing product page

### AC-APROD-06 — Soft Delete — Super Admin
- **Given** a super_admin clicks Delete on a product and confirms
- **When** the confirmation is accepted
- **Then** the product's `isActive` is set to `false`, it is removed from the customer catalog, and it remains visible (as inactive) in the admin products list

### AC-APROD-07 — Delete Restricted — Product Manager
- **Given** a product_manager is viewing the products list
- **When** the page renders
- **Then** no Delete button is visible for any product

### AC-APROD-08 — Product Search (Admin)
- **Given** an admin types in the search box on the products page
- **When** the search updates
- **Then** the table filters to show only products matching the search term in their name

### AC-APROD-09 — Stock Display
- **Given** a product has stock less than 10
- **When** displayed in the admin products table
- **Then** the stock count is highlighted in amber to indicate low stock

---

## Claude Prompts for This Module

**Product model:**
```
Create a Mongoose Product schema with fields: name (required), price (required, min 0), description (required), category (ObjectId ref Category), images ([String]), stock (Number, default 0), ratings ({ average: Number, count: Number }), featured (Boolean, default false), isActive (Boolean, default true). Add a text index on name and description. Include timestamps.
```

**Product form:**
```
Create a React ProductForm component using Tailwind CSS. Fields: name, price (number), description (textarea), category (dropdown from Redux), images (up to 5 URL inputs), stock (number), featured (checkbox). Pre-fill from a `product` prop when editing. Call onSubmit(formData) on valid submission. Validate required fields.
```
