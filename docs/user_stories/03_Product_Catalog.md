# Module 03 — Product Catalog

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/product-catalog`
> **Depends on:** Module 01 (Auth), Module 02 (Home Page — shared Header/Footer)

---

## Overview

Allow customers to browse, search, filter, and sort all products. This is the core discovery experience of the storefront.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | List products with filters, sort, pagination |
| GET | `/products/search` | No | Full-text search |

**Supported query params for `GET /products`:**

| Param | Type | Example |
|-------|------|---------|
| `category` | ObjectId | `?category=abc123` |
| `minPrice` | Number | `?minPrice=10` |
| `maxPrice` | Number | `?maxPrice=100` |
| `inStock` | Boolean | `?inStock=true` |
| `rating` | Number | `?rating=4` (min rating) |
| `sort` | String | `?sort=price_asc` / `price_desc` / `newest` / `rating` |
| `page` | Number | `?page=2` |
| `limit` | Number | `?limit=12` |

---

## Data Model

Uses the existing **Product** model (created in Module 10 — Admin). For now, seed the database with test products.

---

## Dev Checklist

### Step 1 — Backend Controller & Routes
- [ ] `getProducts` — apply all filters, sort, and paginate; return `{ products, total, page, totalPages }`
- [ ] `searchProducts` — full-text search on `name` and `description`
- [ ] Add MongoDB text index on `name` and `description` fields
- [ ] Create `/server/routes/productRoutes.js`
- [ ] Register routes in `app.js`

### Step 2 — API Tests (Postman)
- [ ] `GET /products` → 200, returns paginated list
- [ ] `GET /products?category=id` → filtered by category
- [ ] `GET /products?minPrice=10&maxPrice=50` → price filtered
- [ ] `GET /products?inStock=true` → only in-stock products
- [ ] `GET /products?sort=price_asc` → sorted correctly
- [ ] `GET /products?page=2&limit=12` → correct page returned
- [ ] `GET /products/search?q=lamp` → returns matching products

### Step 3 — Axios API Functions
- [ ] Create `/client/src/api/productApi.js`
- [ ] Functions: `getProducts(params)`, `searchProducts(query)`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/productSlice.js`
- [ ] State: `products`, `total`, `page`, `totalPages`, `filters`, `loading`, `error`
- [ ] Thunks: `fetchProducts`, `searchProducts`
- [ ] Actions: `setFilter`, `clearFilters`, `setPage`

### Step 5 — React Components
- [ ] Product catalog page (`/products`)
- [ ] `FilterSidebar` — category checkboxes, price range slider, availability toggle, min rating selector
- [ ] `SortDropdown` — sort options dropdown
- [ ] `ProductGrid` — responsive grid of `ProductCard` components
- [ ] `Pagination` — page controls with total count
- [ ] `SearchBar` — search input with debounce (reuse in Header)
- [ ] Active filters display with clear/remove per filter

### Step 6 — Integration Check
- [ ] Filters update URL query params (shareable/bookmarkable URLs)
- [ ] Changing filters resets to page 1
- [ ] Search results update on each keystroke (debounced 400ms)
- [ ] Product cards link to `/products/:id`
- [ ] Pagination navigates correctly

### Step 7 — Unit Tests (Jest)
- [ ] `getProducts` controller — filter, sort, and pagination logic
- [ ] Product slice `setFilter` and `clearFilters` reducers

### Step 8 — E2E Tests (Playwright)
- [ ] User visits `/products` and sees a grid of products
- [ ] User filters by category and the grid updates
- [ ] User searches for a product by name and sees relevant results
- [ ] User navigates to page 2 and sees different products

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: product catalog — listing, search, filters, sort, pagination"`
- [ ] Push `feature/product-catalog` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-CAT-01 — Product Listing
- **Given** a visitor navigates to `/products`
- **When** the page loads
- **Then** a grid of products is displayed, each showing image, name, price, and star rating

### AC-CAT-02 — Pagination
- **Given** there are more products than the page limit (default 12)
- **When** the page loads
- **Then** pagination controls are displayed showing current page, total pages, and next/previous buttons

### AC-CAT-03 — Category Filter
- **Given** a visitor selects one or more categories in the filter sidebar
- **When** the filter is applied
- **Then** only products belonging to the selected categories are shown and the total count updates

### AC-CAT-04 — Price Range Filter
- **Given** a visitor sets a minimum and maximum price
- **When** the filter is applied
- **Then** only products within the specified price range are shown

### AC-CAT-05 — Availability Filter
- **Given** a visitor toggles "In stock only"
- **When** the filter is applied
- **Then** only products with `stock > 0` are shown

### AC-CAT-06 — Rating Filter
- **Given** a visitor selects a minimum star rating (e.g. 4 stars and above)
- **When** the filter is applied
- **Then** only products with an average rating equal to or above the selected value are shown

### AC-CAT-07 — Sort by Price Ascending
- **Given** a visitor selects "Price: Low to High" from the sort dropdown
- **When** the sort is applied
- **Then** products are displayed in ascending order of price

### AC-CAT-08 — Sort by Newest
- **Given** a visitor selects "Newest" from the sort dropdown
- **When** the sort is applied
- **Then** products are displayed with the most recently added first

### AC-CAT-09 — Search Results
- **Given** a visitor types a search term in the search bar
- **When** at least 400ms have passed since the last keystroke
- **Then** the product grid updates to show only products matching the search term in name or description

### AC-CAT-10 — No Results State
- **Given** a visitor applies filters or searches for a term that matches no products
- **When** the grid updates
- **Then** an empty state message is shown ("No products found") with a button to clear all filters

### AC-CAT-11 — Filter Persistence in URL
- **Given** a visitor applies filters and sorts
- **When** they copy and share the URL
- **Then** the same filters and sort are applied when another user opens that URL

### AC-CAT-12 — Filter Reset
- **Given** a visitor has applied one or more filters
- **When** they click "Clear all filters"
- **Then** all filters are removed and the full product list is restored

### AC-CAT-13 — Responsive Grid
- **Given** a visitor views the catalog on mobile (< 768px)
- **When** the page renders
- **Then** the filter sidebar collapses into a slide-in drawer and the grid shows one or two columns

---

## Claude Prompts for This Module

**Controller:**
```
Write an Express controller function `getProducts` that supports query params: category, minPrice, maxPrice, inStock, rating, sort (price_asc, price_desc, newest, rating), page, limit. Use Mongoose to build the query dynamically and return { products, total, page, totalPages }. Stack: Node.js + Express + Mongoose.
```

**Redux slice:**
```
Write a Redux Toolkit productSlice with state: products, total, page, totalPages, filters (category, minPrice, maxPrice, inStock, rating, sort), loading, error. Include async thunks fetchProducts and searchProducts using Axios. Include actions setFilter, clearFilters, setPage. Stack: React + Redux Toolkit + Axios.
```

**Filter sidebar:**
```
Create a React FilterSidebar component using Tailwind CSS. It should include: category checkboxes (from Redux), price range inputs, an in-stock toggle, and a minimum rating selector (1-5 stars). Each change dispatches setFilter to the Redux productSlice and triggers a new fetchProducts thunk call.
```
