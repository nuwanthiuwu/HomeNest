# Module 07 — Orders (Customer)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/customer-orders`
> **Depends on:** Module 01 (Auth), Module 06 (Checkout — creates orders)

---

## Overview

Allow customers to view their order history, check order details and status, and cancel eligible orders.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | Yes | Get all orders for current user |
| GET | `/orders/:id` | Yes | Get single order details |
| PUT | `/orders/:id/cancel` | Yes | Cancel a pending order |

---

## Dev Checklist

### Step 1 — Backend Controller
- [ ] `getMyOrders` — return all orders for authenticated user, sorted by `createdAt` desc
- [ ] `getOrderById` — return single order, verify it belongs to requesting user (403 if not)
- [ ] `cancelOrder` — only allow cancel if status is `pending`; restore stock on cancel
- [ ] Create `/server/routes/orderRoutes.js` with `verifyToken`
- [ ] Register routes in `app.js`

### Step 2 — API Tests (Postman)
- [ ] `GET /orders` → 200, array of user's orders
- [ ] `GET /orders/:id` with own order → 200
- [ ] `GET /orders/:id` with another user's order → 403
- [ ] `PUT /orders/:id/cancel` on pending order → 200, status updated
- [ ] `PUT /orders/:id/cancel` on shipped order → 400, cannot cancel

### Step 3 — Axios API Functions
- [ ] Create `/client/src/api/orderApi.js`
- [ ] Functions: `getMyOrders`, `getOrderById`, `cancelOrder`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/orderSlice.js`
- [ ] State: `orders`, `selectedOrder`, `loading`, `error`
- [ ] Thunks: `fetchMyOrders`, `fetchOrderById`, `cancelOrder`

### Step 5 — React Components
- [ ] Orders list page (`/orders`)
- [ ] `OrderCard` — order ID, date, status badge, total, view button
- [ ] Order detail page (`/orders/:id`)
- [ ] `OrderStatusBadge` — colour-coded: Pending (amber), Processing (blue), Shipped (purple), Delivered (green), Cancelled (red)
- [ ] `OrderItemsList` — product image, name, quantity, price per item
- [ ] Cancel Order button (visible only if status is `pending`)
- [ ] Cancel confirmation dialog

### Step 6 — Integration Check
- [ ] Orders list shows most recent orders first
- [ ] Clicking an order navigates to detail page
- [ ] Cancel button is hidden for non-pending orders
- [ ] Cancelling an order updates the status badge immediately
- [ ] Cancelled order shows stock restored (verify in DB)

### Step 7 — Unit Tests (Jest)
- [ ] `getMyOrders` — returns only current user's orders
- [ ] `cancelOrder` — pending → success; shipped → error
- [ ] `getOrderById` — own order success; other user's order 403

### Step 8 — E2E Tests (Playwright)
- [ ] User navigates to `/orders` and sees their order history
- [ ] User clicks an order and sees full details
- [ ] User cancels a pending order and status updates to Cancelled

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: customer orders — history, detail, cancel"`
- [ ] Push `feature/customer-orders` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-ORD-01 — Order History
- **Given** a logged-in user who has placed at least one order navigates to `/orders`
- **When** the page loads
- **Then** all their orders are listed in reverse chronological order showing order ID, date, status, and total

### AC-ORD-02 — No Orders State
- **Given** a logged-in user has never placed an order
- **When** they navigate to `/orders`
- **Then** a message "You haven't placed any orders yet" is shown with a link to the product catalog

### AC-ORD-03 — Order Detail
- **Given** a user clicks on an order from their history
- **When** the order detail page loads
- **Then** the full order is shown including: order ID, date, status, items (image, name, qty, price), shipping address, payment method, and total

### AC-ORD-04 — Order Ownership
- **Given** a user tries to access another user's order via direct URL (`/orders/:id`)
- **When** the request is made
- **Then** a `403` error is returned and the user sees an "Access denied" message

### AC-ORD-05 — Status Badge — Pending
- **Given** an order with status `pending`
- **When** displayed in the list or detail view
- **Then** an amber "Pending" badge is shown

### AC-ORD-06 — Status Badge — Delivered
- **Given** an order with status `delivered`
- **When** displayed
- **Then** a green "Delivered" badge is shown

### AC-ORD-07 — Cancel Order — Eligible
- **Given** an order with status `pending`
- **When** the user clicks Cancel Order and confirms
- **Then** the order status is updated to `cancelled`, the stock for each item is restored, and the status badge updates immediately in the UI

### AC-ORD-08 — Cancel Order — Ineligible
- **Given** an order with status `processing`, `shipped`, or `delivered`
- **When** the order detail page loads
- **Then** no Cancel Order button is visible

### AC-ORD-09 — Cancel Confirmation Dialog
- **Given** a user clicks Cancel Order on an eligible order
- **When** the button is clicked
- **Then** a confirmation dialog appears asking "Are you sure you want to cancel this order?" with Confirm and Go Back buttons

### AC-ORD-10 — Stock Restoration on Cancel
- **Given** a user cancels a pending order containing 2 units of product A
- **When** the cancellation is confirmed
- **Then** product A's stock count increases by 2 in the database

---

## Claude Prompts for This Module

**Controller:**
```
Write Express controllers: getMyOrders (all orders for authenticated user, sorted newest first), getOrderById (verify order belongs to user, return 403 if not), cancelOrder (only if status is pending; restore stock for each item). Stack: Node.js + Express + Mongoose.
```

**Order status badge:**
```
Create a React OrderStatusBadge component using Tailwind CSS. Props: status (string). Display a colour-coded pill badge: pending=amber, processing=blue, shipped=purple, delivered=green, cancelled=red. Use Tailwind utility classes only.
```

**Redux slice:**
```
Write a Redux Toolkit orderSlice with state: orders (array), selectedOrder (object), loading, error. Async thunks: fetchMyOrders (GET /orders), fetchOrderById (GET /orders/:id), cancelOrder (PUT /orders/:id/cancel). Stack: React + Redux Toolkit + Axios.
```
