# Module 14 — Inventory Module (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-inventory`
> **Depends on:** Module 10 (Product Management), Module 08 (Admin Auth)

---

## Overview

Allow admins to monitor stock levels across all products, receive low-stock alerts, and make manual inventory adjustments.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/inventory` | Yes | product_manager, super_admin |
| GET | `/admin/inventory/low-stock` | Yes | All admin |
| PUT | `/admin/inventory/:productId` | Yes | product_manager, super_admin |

---

## Acceptance Criteria

### AC-INV-01 — Inventory List
- **Given** an admin navigates to `/admin/inventory`
- **When** the page loads
- **Then** all products are listed with name, category, current stock, and stock status (OK / Low / Out)

### AC-INV-02 — Low Stock Filter
- **Given** an admin clicks "Show low stock only"
- **When** the filter is applied
- **Then** only products with stock less than the defined threshold (default 10) are shown

### AC-INV-03 — Out of Stock Alert
- **Given** a product's stock reaches 0
- **When** the inventory list renders
- **Then** the product is highlighted in red with an "Out of Stock" badge

### AC-INV-04 — Manual Stock Adjustment — Increase
- **Given** an admin enters a positive adjustment value for a product
- **When** saved
- **Then** the product's stock is increased by the entered amount and an audit note records the adjustment

### AC-INV-05 — Manual Stock Adjustment — Decrease
- **Given** an admin enters a negative adjustment value
- **When** saved and the result would not go below 0
- **Then** the product's stock is decreased by the entered amount

### AC-INV-06 — Stock Below Zero Prevention
- **Given** an admin tries to decrease stock below 0
- **When** saved
- **Then** a `400` error is returned: "Stock cannot go below zero"

### AC-INV-07 — Adjustment Audit Log
- **Given** an admin makes a manual stock adjustment
- **When** saved
- **Then** the adjustment is recorded with: admin name, timestamp, product, amount changed, and optional reason note

---

## Dev Checklist

- [ ] `getInventory` — all products with stock levels and status
- [ ] `getLowStockProducts` — products with stock < threshold
- [ ] `adjustInventory` — add or subtract stock, validate >= 0, log adjustment
- [ ] Create `InventoryLog` model: productId, adminId, change, reason, timestamp
- [ ] Inventory list page with sort by stock level
- [ ] Stock adjustment modal with reason input
- [ ] Low stock badge and colour coding
- [ ] Jest: stock adjustment, below-zero prevention, audit log creation
- [ ] `git commit -m "feat: admin inventory — monitoring, low stock alerts, manual adjustments"`

---

## Claude Prompts for This Module

**Adjust inventory:**
```
Write an Express controller `adjustInventory` that accepts a productId and a `change` value (positive or negative). Validate that the resulting stock will not go below 0. Update the product stock. Create an InventoryLog document with: product, admin user, change amount, reason (optional), timestamp. Stack: Node.js + Express + Mongoose.
```
