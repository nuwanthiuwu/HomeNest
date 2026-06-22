# Module 02 — Home Page

> **Stack:** React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/home-page`
> **Depends on:** Module 01 (Authentication) — header needs auth state

---

## Overview

The home page is the customer's entry point. It showcases featured products, new arrivals, active promotions, and category navigation to drive product discovery.

---

## Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products?featured=true&limit=8` | Featured products |
| GET | `/products?sort=newest&limit=8` | New arrivals |
| GET | `/categories` | All active categories |
| GET | `/promotions/active` | Active promotions / banners |

---

## Dev Checklist

### Step 1 — Backend (Supporting Endpoints)
- [ ] Ensure `GET /products` supports `?featured=true` query param
- [ ] Ensure `GET /products` supports `?sort=newest` query param
- [ ] Create `GET /categories` endpoint returning all active categories
- [ ] Create `GET /promotions/active` endpoint returning active banners

### Step 2 — API Tests (Postman)
- [ ] `GET /products?featured=true` → 200, returns array
- [ ] `GET /products?sort=newest` → 200, sorted by `createdAt` desc
- [ ] `GET /categories` → 200, returns category list
- [ ] `GET /promotions/active` → 200, returns active promotions

### Step 3 — Axios API Functions
- [ ] Create `/client/src/api/homeApi.js`
- [ ] Functions: `getFeaturedProducts`, `getNewArrivals`, `getCategories`, `getActivePromotions`

### Step 4 — Redux Slice
- [ ] Create or update `/client/src/store/homeSlice.js`
- [ ] State: `featuredProducts`, `newArrivals`, `categories`, `promotions`, `loading`, `error`
- [ ] Thunks: fetch each data section independently

### Step 5 — React Components
- [ ] `Header` component — logo, navigation, search bar, cart icon, auth links (shared)
- [ ] `Footer` component — links, copyright (shared)
- [ ] `HeroBanner` — full-width promotional banner with CTA button
- [ ] `CategoryMenu` — horizontal scrollable category icons/cards
- [ ] `FeaturedProducts` — grid of product cards
- [ ] `NewArrivals` — grid of product cards
- [ ] `PromotionBanner` — inline promotional strip or card
- [ ] `ProductCard` — reusable card (image, name, price, rating, add to cart)
- [ ] Home page (`/`) assembles all sections

### Step 6 — Integration Check
- [ ] All sections load data from API on page mount
- [ ] Loading skeletons shown while fetching
- [ ] Product cards link to `/products/:id`
- [ ] Category cards link to `/products?category=:id`
- [ ] Header shows correct auth state (Login/Register vs user name)

### Step 7 — Unit Tests (Jest)
- [ ] Home slice reducers — loading, success, error states
- [ ] `ProductCard` renders name, price, and image correctly

### Step 8 — E2E Tests (Playwright)
- [ ] Home page loads with hero banner visible
- [ ] Featured products section displays at least one product
- [ ] Clicking a product card navigates to the correct product detail page
- [ ] Clicking a category navigates to the catalog with that category filter applied

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: home page — hero, featured products, categories, new arrivals"`
- [ ] Push `feature/home-page` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-HOME-01 — Page Load
- **Given** any visitor navigates to the home page (`/`)
- **When** the page loads
- **Then** the hero banner, category menu, featured products, and new arrivals sections are all visible within 3 seconds

### AC-HOME-02 — Hero Banner
- **Given** there is at least one active promotion in the database
- **When** the home page loads
- **Then** the hero banner displays the promotion image, title, and a CTA button linking to the correct destination

### AC-HOME-03 — Category Navigation
- **Given** categories exist in the database
- **When** the home page loads
- **Then** all active categories are displayed in the category menu and each one is clickable

### AC-HOME-04 — Category Filter Link
- **Given** a visitor clicks a category on the home page
- **When** the click is registered
- **Then** the visitor is navigated to the product catalog page pre-filtered by that category

### AC-HOME-05 — Featured Products
- **Given** products are marked as featured in the database
- **When** the home page loads
- **Then** up to 8 featured products are shown in a grid, each displaying image, name, price, and rating

### AC-HOME-06 — New Arrivals
- **Given** products have been added recently
- **When** the home page loads
- **Then** up to 8 of the most recently added products are shown in the new arrivals section

### AC-HOME-07 — Product Card Navigation
- **Given** a visitor clicks a product card anywhere on the home page
- **When** the click is registered
- **Then** the visitor is navigated to the correct product detail page (`/products/:id`)

### AC-HOME-08 — Loading State
- **Given** the home page is fetching data from the API
- **When** data has not yet loaded
- **Then** skeleton placeholders are shown in place of product cards and banners

### AC-HOME-09 — Empty State
- **Given** no featured products exist in the database
- **When** the home page loads
- **Then** the featured products section is hidden or shows a "No featured products" message rather than crashing

### AC-HOME-10 — Header Auth State
- **Given** a user is logged in
- **When** the home page loads
- **Then** the header displays the user's name and a cart icon; the Login and Register links are hidden

### AC-HOME-11 — Header Guest State
- **Given** no user is logged in
- **When** the home page loads
- **Then** the header displays Login and Register links; the user name is not shown

### AC-HOME-12 — Responsive Layout
- **Given** a visitor views the home page on a mobile screen (< 768px)
- **When** the page renders
- **Then** the product grid collapses to a single column and the category menu scrolls horizontally

---

## Claude Prompts for This Module

**Hero Banner component:**
```
Create a React HeroBanner component using Tailwind CSS. It receives props: imageUrl, title, subtitle, ctaText, ctaLink. It should display a full-width banner with overlay text and a CTA button that links to ctaLink using React Router Link.
```

**ProductCard component:**
```
Create a reusable React ProductCard component using Tailwind CSS. It receives: id, name, price, image, rating, stockCount. Display the image, name, formatted price, star rating, and an Add to Cart button. Clicking the card navigates to /products/:id. The Add to Cart button dispatches to the Redux cart slice.
```

**Home page Redux slice:**
```
Write a Redux Toolkit homeSlice with async thunks to fetch: featuredProducts, newArrivals, categories, activePromotions using Axios. Handle loading and error states for each. Stack: React + Redux Toolkit + Axios.
```
