# Module 04 — Product Details

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/product-details`
> **Depends on:** Module 01 (Auth), Module 05 (Cart — Add to Cart action)

---

## Overview

Display full product information including images, description, stock availability, and quantity selection. The primary CTA is Add to Cart.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products/:id` | No | Get single product by ID |

---

## Dev Checklist

### Step 1 — Backend Controller
- [ ] `getProductById` — return full product document, populate `category` name
- [ ] Return `404` if product not found or `isActive: false`
- [ ] Add route `GET /products/:id` to `productRoutes.js`

### Step 2 — API Tests (Postman)
- [ ] `GET /products/:id` with valid ID → 200, full product object
- [ ] `GET /products/:id` with invalid ID → 404
- [ ] `GET /products/:id` for inactive product → 404

### Step 3 — Axios API Functions
- [ ] Add `getProductById(id)` to `/client/src/api/productApi.js`

### Step 4 — Redux Slice
- [ ] Add `selectedProduct`, `loading`, `error` to product slice
- [ ] Add `fetchProductById` async thunk

### Step 5 — React Components
- [ ] Product detail page (`/products/:id`)
- [ ] `ImageGallery` — main image with thumbnail strip, click to swap main image
- [ ] Product name, category breadcrumb, price
- [ ] Stock availability badge (In Stock / Low Stock / Out of Stock)
- [ ] `QuantitySelector` — increment/decrement with stock limit
- [ ] Add to Cart button — dispatches to cart slice with product + quantity
- [ ] Add to Wishlist button (optional, links to Module 17)
- [ ] Full product description section
- [ ] Related products section (same category, optional)

### Step 6 — Integration Check
- [ ] Page loads correct product from URL param `:id`
- [ ] Add to Cart button is disabled when `stock === 0`
- [ ] Quantity selector cannot exceed available stock
- [ ] Add to Cart dispatches correct product data to cart slice
- [ ] Breadcrumb links back to catalog with correct category filter

### Step 7 — Unit Tests (Jest)
- [ ] `getProductById` — success, not found, inactive product
- [ ] `QuantitySelector` — cannot go below 1 or above stock limit

### Step 8 — E2E Tests (Playwright)
- [ ] User navigates to a product page from the catalog
- [ ] User selects quantity 2 and clicks Add to Cart
- [ ] Cart icon count in header increments by 2
- [ ] Out-of-stock product shows disabled Add to Cart button

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: product details — image gallery, quantity selector, add to cart"`
- [ ] Push `feature/product-details` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-PROD-01 — Page Load
- **Given** a visitor navigates to `/products/:id` with a valid product ID
- **When** the page loads
- **Then** the product name, images, description, price, category, and stock status are all displayed

### AC-PROD-02 — Invalid Product ID
- **Given** a visitor navigates to `/products/:id` with an ID that does not exist
- **When** the page loads
- **Then** a 404 message is shown with a link back to the product catalog

### AC-PROD-03 — Image Gallery
- **Given** a product has multiple images
- **When** the product detail page loads
- **Then** the first image is shown as the main image and thumbnails for all images are shown below

### AC-PROD-04 — Thumbnail Click
- **Given** a visitor clicks a thumbnail image
- **When** the click is registered
- **Then** the clicked thumbnail becomes the main displayed image

### AC-PROD-05 — Stock Badge — In Stock
- **Given** a product has `stock > 10`
- **When** the product detail page loads
- **Then** a green "In Stock" badge is displayed

### AC-PROD-06 — Stock Badge — Low Stock
- **Given** a product has `stock` between 1 and 10
- **When** the product detail page loads
- **Then** an amber "Low Stock — only X left" badge is displayed

### AC-PROD-07 — Stock Badge — Out of Stock
- **Given** a product has `stock === 0`
- **When** the product detail page loads
- **Then** a red "Out of Stock" badge is displayed and the Add to Cart button is disabled

### AC-PROD-08 — Quantity Selector Minimum
- **Given** the quantity selector shows 1
- **When** the visitor clicks the decrement button
- **Then** the quantity does not go below 1

### AC-PROD-09 — Quantity Selector Maximum
- **Given** a product has a stock of 5
- **When** the visitor tries to set quantity above 5
- **Then** the quantity is capped at 5 and a message "Maximum available quantity reached" is shown

### AC-PROD-10 — Add to Cart Success
- **Given** a visitor selects a quantity and clicks Add to Cart
- **When** the button is clicked
- **Then** the product and selected quantity are added to the Redux cart state, the cart icon count in the header increments, and a success toast notification is shown

### AC-PROD-11 — Add to Cart Duplicate
- **Given** a product already exists in the cart and the visitor adds it again
- **When** the button is clicked
- **Then** the quantity in the cart is increased by the selected amount (not duplicated as a new line item)

### AC-PROD-12 — Breadcrumb Navigation
- **Given** a product detail page is open
- **When** the visitor clicks the category in the breadcrumb
- **Then** the visitor is navigated to the product catalog pre-filtered by that category

---

## Claude Prompts for This Module

**Controller:**
```
Write an Express controller function `getProductById` that finds a product by ID, populates the category name, and returns 404 if not found or if isActive is false. Stack: Node.js + Express + Mongoose.
```

**Image gallery:**
```
Create a React ImageGallery component using Tailwind CSS. It receives an array of image URLs. Display the first image as a large main image. Show all images as small clickable thumbnails below. Clicking a thumbnail swaps the main image. No external libraries.
```

**Quantity selector:**
```
Create a React QuantitySelector component using Tailwind CSS. Props: value, min (default 1), max (stock count), onChange. Display decrement button, current value, increment button. Disable decrement at min, disable increment at max. Show a message when max is reached.
```
