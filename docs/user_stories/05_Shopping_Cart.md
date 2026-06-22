# Module 05 — Shopping Cart

> **Stack:** Node.js · Express · MongoDB · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/shopping-cart`
> **Depends on:** Module 01 (Auth), Module 04 (Product Details — Add to Cart action)

---

## Overview

Manage the customer's selected items before checkout. The cart persists in Redux state and syncs with the backend for logged-in users.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Yes | Get current user's cart |
| POST | `/cart` | Yes | Add item to cart |
| PUT | `/cart/:productId` | Yes | Update item quantity |
| DELETE | `/cart/:productId` | Yes | Remove item from cart |
| DELETE | `/cart` | Yes | Clear entire cart |

---

## Data Model

**Cart** (stored per user in DB for persistence)

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref: User |
| `items` | Array | `[{ product: ObjectId, quantity: Number, price: Number }]` |
| `updatedAt` | Date | Auto via timestamps |

---

## Dev Checklist

### Step 1 — Model & Controller
- [ ] Create `/server/models/Cart.js`
- [ ] `getCart` — return cart with populated product details
- [ ] `addToCart` — add item or increment quantity if already exists
- [ ] `updateCartItem` — set specific quantity, validate against stock
- [ ] `removeCartItem` — remove single item
- [ ] `clearCart` — remove all items (used after order placed)
- [ ] Create `/server/routes/cartRoutes.js` with `verifyToken` middleware
- [ ] Register routes in `app.js`

### Step 2 — API Tests (Postman)
- [ ] Add item to cart → 200, updated cart
- [ ] Add same item again → quantity increments
- [ ] Add item with quantity > stock → 400 error
- [ ] Update item quantity → 200, updated cart
- [ ] Remove item → 200, item removed
- [ ] Access cart without token → 401

### Step 3 — Axios API Functions
- [ ] Create `/client/src/api/cartApi.js`
- [ ] Functions: `getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/cartSlice.js`
- [ ] State: `items`, `totalItems`, `totalPrice`, `loading`, `error`
- [ ] Thunks: `fetchCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`
- [ ] Computed: `totalItems` and `totalPrice` derived from `items`
- [ ] Sync with backend on every change (logged-in users)
- [ ] For guests: store cart in localStorage only

### Step 5 — React Components
- [ ] Cart page (`/cart`)
- [ ] `CartItem` — product image, name, unit price, quantity selector, remove button, line total
- [ ] `CartSummary` — subtotal, estimated tax, order total, proceed to checkout button
- [ ] Cart icon in header with item count badge
- [ ] Empty cart state with "Continue Shopping" link

### Step 6 — Integration Check
- [ ] Cart loads from backend when user logs in
- [ ] Guest cart in localStorage is merged with backend cart on login
- [ ] Item count badge in header updates in real time
- [ ] Quantity update recalculates totals immediately
- [ ] Removing last item shows empty cart state
- [ ] Proceed to checkout redirects to `/checkout`

### Step 7 — Unit Tests (Jest)
- [ ] `addToCart` — new item, existing item (quantity increment)
- [ ] `updateCartItem` — quantity above stock rejected
- [ ] Cart slice — `totalItems` and `totalPrice` computed correctly

### Step 8 — E2E Tests (Playwright)
- [ ] User adds a product from the product detail page
- [ ] Cart page shows the correct item with correct price
- [ ] User updates quantity and total price updates
- [ ] User removes item and cart shows empty state

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: shopping cart — add, update, remove, cart summary"`
- [ ] Push `feature/shopping-cart` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-CART-01 — Add to Cart
- **Given** a logged-in user clicks Add to Cart on a product with stock available
- **When** the action is triggered
- **Then** the product is added to the cart, the header cart count increments, and a success notification is shown

### AC-CART-02 — Add Duplicate Item
- **Given** a product already exists in the cart and the user adds it again
- **When** the action is triggered
- **Then** the quantity of the existing cart item is increased (not added as a second line)

### AC-CART-03 — Exceed Stock Limit
- **Given** a user tries to add more of a product than is available in stock
- **When** the action is triggered
- **Then** the quantity is capped at the available stock and an error message is shown

### AC-CART-04 — Cart Page Load
- **Given** a logged-in user navigates to `/cart`
- **When** the page loads
- **Then** all cart items are displayed with image, name, unit price, quantity, and line total

### AC-CART-05 — Update Quantity
- **Given** a user changes the quantity of a cart item
- **When** the new quantity is set
- **Then** the line total and order total update immediately and the change is saved to the backend

### AC-CART-06 — Remove Item
- **Given** a user clicks the remove button on a cart item
- **When** the button is clicked
- **Then** the item is removed from the cart, the totals update, and the backend is updated

### AC-CART-07 — Empty Cart State
- **Given** all items have been removed from the cart
- **When** the cart page renders
- **Then** an empty cart message is shown with a "Continue Shopping" button linking to `/products`

### AC-CART-08 — Order Total Calculation
- **Given** the cart contains multiple items
- **When** the cart page renders
- **Then** the subtotal is correctly calculated as the sum of all line totals

### AC-CART-09 — Guest Cart
- **Given** a guest (unauthenticated) user adds a product to the cart
- **When** the action is triggered
- **Then** the cart is stored in localStorage and the header count badge reflects the item count

### AC-CART-10 — Cart Merge on Login
- **Given** a guest user has items in their localStorage cart and then logs in
- **When** the login completes
- **Then** the guest cart items are merged with the user's backend cart and no items are lost

### AC-CART-11 — Proceed to Checkout
- **Given** the cart contains at least one item
- **When** the user clicks "Proceed to Checkout"
- **Then** the user is navigated to `/checkout`

### AC-CART-12 — Proceed to Checkout — Empty Cart
- **Given** the cart is empty
- **When** the user attempts to access `/checkout` directly
- **Then** the user is redirected back to `/cart` with a message "Your cart is empty"

---

## Claude Prompts for This Module

**Cart model:**
```
Create a Mongoose Cart schema with fields: user (ObjectId ref User), items (array of { product: ObjectId ref Product, quantity: Number, price: Number }). Include timestamps. Stack: Node.js + Mongoose.
```

**Cart controller:**
```
Write Express controllers for a shopping cart: getCart, addToCart, updateCartItem, removeCartItem, clearCart. addToCart should increment quantity if item exists. updateCartItem should validate quantity against product stock. Use async/await and return proper status codes. Stack: Node.js + Express + Mongoose.
```

**Cart Redux slice:**
```
Write a Redux Toolkit cartSlice. State: items (array), totalItems (number), totalPrice (number). Include async thunks: fetchCart, addItem, updateItem, removeItem, clearCart using Axios. Derive totalItems and totalPrice from items array. For guests, fall back to localStorage. Stack: React + Redux Toolkit + Axios.
```
