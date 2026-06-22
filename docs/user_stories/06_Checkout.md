# Module 06 — Checkout

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/checkout`
> **Depends on:** Module 01 (Auth), Module 05 (Cart)

---

## Overview

Guide the customer through shipping address entry, order summary review, payment method selection, and order placement.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/checkout` | Yes | Place order — validate cart, create order, deduct stock |
| GET | `/orders/:id/confirmation` | Yes | Return order confirmation details |

---

## Dev Checklist

### Step 1 — Backend Controller
- [ ] `placeOrder` — validate all cart items still in stock
- [ ] Deduct ordered quantity from each product's stock
- [ ] Create Order document with items, totals, shipping address, payment method
- [ ] Clear the user's cart after successful order
- [ ] Apply coupon if provided (validate code, calculate discount)
- [ ] Return created order ID
- [ ] Return `400` if any item is out of stock (with specific product name)

### Step 2 — API Tests (Postman)
- [ ] `POST /checkout` with valid cart and address → 201, order created
- [ ] `POST /checkout` with out-of-stock item → 400
- [ ] `POST /checkout` with empty cart → 400
- [ ] `POST /checkout` without token → 401
- [ ] `POST /checkout` with valid coupon → discount applied to total

### Step 3 — Axios API Functions
- [ ] Create `/client/src/api/checkoutApi.js`
- [ ] Functions: `placeOrder(payload)`, `getOrderConfirmation(orderId)`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/checkoutSlice.js`
- [ ] State: `shippingAddress`, `paymentMethod`, `couponCode`, `discount`, `loading`, `error`, `orderId`
- [ ] Actions: `setShippingAddress`, `setPaymentMethod`, `applyCoupon`
- [ ] Thunk: `submitOrder`

### Step 5 — React Components
- [ ] Checkout page (`/checkout`) — multi-step layout
- [ ] Step 1 — `ShippingForm`: name, address line 1, city, state, zip, country; pre-fill from user profile
- [ ] Step 2 — `OrderSummary`: item list, subtotal, discount, total
- [ ] Step 3 — `PaymentMethod`: select card / PayPal / cash on delivery
- [ ] `CouponInput`: enter code, apply, show discount amount
- [ ] `PlaceOrderButton`: confirm and submit
- [ ] Order confirmation page (`/orders/:id/confirmation`)

### Step 6 — Integration Check
- [ ] Shipping form pre-fills from user profile address
- [ ] Order summary reflects current cart (pulled from Redux)
- [ ] Coupon applied updates total in real time
- [ ] On success: cart is cleared, user navigated to order confirmation
- [ ] On stock failure: specific out-of-stock product is highlighted

### Step 7 — Unit Tests (Jest)
- [ ] `placeOrder` — success, out of stock, empty cart, invalid coupon
- [ ] Checkout slice — `setShippingAddress`, `applyCoupon` reducers

### Step 8 — E2E Tests (Playwright)
- [ ] User with items in cart completes checkout with valid address and payment
- [ ] Order confirmation page shows correct order ID and total
- [ ] Cart is empty after successful checkout

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: checkout — shipping form, order placement, confirmation"`
- [ ] Push `feature/checkout` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-CHK-01 — Checkout Access
- **Given** an authenticated user with at least one item in the cart navigates to `/checkout`
- **When** the page loads
- **Then** the checkout page is displayed with the shipping form as the first step

### AC-CHK-02 — Unauthenticated Checkout
- **Given** a guest user navigates to `/checkout`
- **When** the page loads
- **Then** the user is redirected to `/login` with a message "Please log in to checkout"

### AC-CHK-03 — Empty Cart Checkout
- **Given** a user navigates to `/checkout` with an empty cart
- **When** the page loads
- **Then** the user is redirected to `/cart` with a message "Your cart is empty"

### AC-CHK-04 — Shipping Form Pre-fill
- **Given** a user has saved an address in their profile
- **When** the checkout shipping form loads
- **Then** the form fields are pre-filled with the saved address

### AC-CHK-05 — Shipping Form Validation
- **Given** a user submits the shipping form with missing required fields
- **When** the form is submitted
- **Then** inline validation errors are shown for each missing field and the order is not placed

### AC-CHK-06 — Order Summary Accuracy
- **Given** the user reaches the order summary step
- **When** the summary is displayed
- **Then** all cart items, quantities, unit prices, subtotal, any discount, and the final total are shown correctly

### AC-CHK-07 — Coupon Code — Valid
- **Given** a user enters a valid, unexpired coupon code
- **When** the Apply button is clicked
- **Then** the discount is calculated and the order total is updated to reflect the discount

### AC-CHK-08 — Coupon Code — Invalid
- **Given** a user enters an invalid or expired coupon code
- **When** the Apply button is clicked
- **Then** an error message is shown ("Invalid or expired coupon") and the total is unchanged

### AC-CHK-09 — Payment Method Selection
- **Given** the user reaches the payment step
- **When** the step renders
- **Then** at least two payment methods are available to select and one is pre-selected by default

### AC-CHK-10 — Successful Order Placement
- **Given** a user completes all checkout steps with valid data
- **When** the Place Order button is clicked
- **Then** the order is created in the database, stock is deducted for each item, the cart is cleared, and the user is redirected to the order confirmation page

### AC-CHK-11 — Out of Stock at Checkout
- **Given** an item in the cart has become out of stock since being added
- **When** the user clicks Place Order
- **Then** the order is rejected with an error identifying the out-of-stock product and the user is redirected back to the cart

### AC-CHK-12 — Order Confirmation Page
- **Given** an order has been placed successfully
- **When** the confirmation page loads
- **Then** the order ID, item list, total amount, shipping address, and estimated delivery info are displayed

### AC-CHK-13 — Stock Deduction
- **Given** an order is placed for 3 units of a product with 10 in stock
- **When** the order is confirmed
- **Then** the product's stock is reduced to 7 in the database

---

## Claude Prompts for This Module

**Place order controller:**
```
Write an Express controller `placeOrder` that: validates all cart items are in stock, creates an Order document, deducts stock from each product, clears the user's cart, and optionally applies a coupon discount. Return 400 with specific product name if any item is out of stock. Stack: Node.js + Express + Mongoose.
```

**Shipping form:**
```
Create a React ShippingForm component using Tailwind CSS and React Hook Form (or controlled components). Fields: fullName, addressLine1, addressLine2, city, state, zipCode, country. Pre-fill from a shippingAddress prop. Validate required fields on submit. Call onSubmit(data) callback when valid.
```

**Checkout slice:**
```
Write a Redux Toolkit checkoutSlice with state: shippingAddress, paymentMethod, couponCode, discount, loading, error, orderId. Include actions: setShippingAddress, setPaymentMethod, applyCoupon. Include async thunk submitOrder that calls POST /checkout and on success dispatches clearCart from cartSlice. Stack: React + Redux Toolkit + Axios.
```
