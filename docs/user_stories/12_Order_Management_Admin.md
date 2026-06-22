# Module 12 — Order Management (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-orders`
> **Depends on:** Module 08 (Admin Auth), Module 06 (Checkout — creates orders)

---

## Overview

Allow admins to view all orders, update their status through the fulfilment workflow, cancel orders, and track refunds.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/orders` | Yes | order_manager, super_admin |
| GET | `/admin/orders/:id` | Yes | order_manager, super_admin |
| PUT | `/admin/orders/:id/status` | Yes | order_manager, super_admin |
| PUT | `/admin/orders/:id/cancel` | Yes | order_manager, super_admin |
| PUT | `/admin/orders/:id/refund` | Yes | super_admin only |

---

## Status Workflow

```
Pending → Processing → Shipped → Delivered
                ↘
              Cancelled
```

---

## Acceptance Criteria

### AC-AORD-01 — All Orders List
- **Given** an order_manager or super_admin navigates to `/admin/orders`
- **When** the page loads
- **Then** all orders across all customers are listed with order ID, customer name, date, status, and total

### AC-AORD-02 — Filter by Status
- **Given** an admin selects a status filter (e.g. "Pending")
- **When** the filter is applied
- **Then** only orders with that status are displayed

### AC-AORD-03 — Order Detail
- **Given** an admin clicks on an order
- **When** the detail page loads
- **Then** full order details are shown: customer info, items, shipping address, payment method, status history, and total

### AC-AORD-04 — Update Status — Valid Transition
- **Given** an order is in `pending` status and admin updates to `processing`
- **When** saved
- **Then** the status is updated in the database and the new status badge is displayed in both admin and customer views

### AC-AORD-05 — Update Status — Invalid Transition
- **Given** an order is in `delivered` status
- **When** an admin attempts to set it back to `pending`
- **Then** a `400` error is returned: "Invalid status transition"

### AC-AORD-06 — Cancel Order (Admin)
- **Given** an order is in `pending` or `processing` status
- **When** an admin cancels it
- **Then** the status is set to `cancelled` and stock is restored for all items

### AC-AORD-07 — Refund Tracking
- **Given** an admin marks an order as refunded
- **When** saved
- **Then** the order shows a "Refunded" flag and the refund amount is recorded

### AC-AORD-08 — Search Orders
- **Given** an admin types in the order search box
- **When** the search updates
- **Then** orders are filtered by order ID or customer name

---

## Dev Checklist

- [ ] `getAllOrders` with filters (status, search, date range, pagination)
- [ ] `updateOrderStatus` with transition validation
- [ ] `cancelOrderAdmin` — restore stock on cancel
- [ ] `markRefund` — record refund details
- [ ] Admin orders list page with status filter tabs
- [ ] Order detail page with status update dropdown
- [ ] Status history timeline
- [ ] Jest: valid/invalid status transitions, cancel + stock restore
- [ ] Playwright: admin updates order status and customer sees updated status
- [ ] `git commit -m "feat: admin order management — status workflow, cancel, refund tracking"`

---

## Claude Prompts for This Module

**Status transition validation:**
```
Write an Express controller `updateOrderStatus` that validates status transitions. Allowed transitions: pending→processing, processing→shipped, shipped→delivered. Any other transition returns 400 "Invalid status transition". On valid update, save the new status. Stack: Node.js + Express + Mongoose.
```
