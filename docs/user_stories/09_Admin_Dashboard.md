# Module 09 — Admin Dashboard

> **Stack:** Node.js · Express · MongoDB · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-dashboard`
> **Depends on:** Module 08 (Admin Authentication)

---

## Overview

Provide a business metrics overview page that is the first thing admins see after login. Shows totals, recent orders, and low stock alerts.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/stats` | Yes | All admin roles |
| GET | `/admin/orders?limit=5&sort=newest` | Yes | All admin roles |
| GET | `/admin/inventory/low-stock` | Yes | All admin roles |

---

## Dev Checklist

### Step 1 — Backend
- [ ] `getAdminStats` — aggregate: totalOrders, totalCustomers, totalRevenue, totalProducts
- [ ] `getRecentOrders` — 5 most recent orders with customer name and total
- [ ] `getLowStockProducts` — products where stock < 10
- [ ] Register under `/admin/stats`

### Step 2 — API Tests (Postman)
- [ ] `GET /admin/stats` → 200, all four metrics present
- [ ] `GET /admin/stats` with customer token → 403

### Step 3 — Axios Functions
- [ ] Create `/client/src/api/adminApi.js`
- [ ] Function: `getAdminStats`

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/adminDashboardSlice.js`
- [ ] State: `stats`, `recentOrders`, `lowStockProducts`, `loading`, `error`

### Step 5 — React Components
- [ ] Admin dashboard page (`/admin/dashboard`)
- [ ] `StatCard` — icon, label, value (e.g. Total Orders: 142)
- [ ] `RecentOrdersTable` — order ID, customer, date, status, total
- [ ] `LowStockAlert` — product name, current stock, link to edit

### Step 6 — Integration Check
- [ ] All stats load on page mount
- [ ] Recent orders link to `/admin/orders/:id`
- [ ] Low stock items link to `/admin/products/:id/edit`

### Step 7 — Unit Tests (Jest)
- [ ] `getAdminStats` returns correct aggregated values

### Step 8 — E2E Tests (Playwright)
- [ ] Admin logs in and sees dashboard with all four stat cards
- [ ] Low stock alert is visible when a product has stock < 10

### Step 9 — PR & Merge
- [ ] `git commit -m "feat: admin dashboard — stats, recent orders, low stock alerts"`
- [ ] Push and merge into `develop`

---

## Acceptance Criteria

### AC-DASH-01 — Stats Cards
- **Given** an admin is logged in and navigates to `/admin/dashboard`
- **When** the page loads
- **Then** four stat cards are displayed: Total Orders, Total Customers, Total Revenue, and Total Products — each with the correct value from the database

### AC-DASH-02 — Recent Orders Table
- **Given** orders exist in the database
- **When** the dashboard loads
- **Then** the 5 most recent orders are shown in a table with order ID, customer name, date, status badge, and total

### AC-DASH-03 — Low Stock Alerts
- **Given** one or more products have stock less than 10
- **When** the dashboard loads
- **Then** those products are listed in the low stock alerts panel with their name and current stock count

### AC-DASH-04 — No Low Stock
- **Given** all products have stock of 10 or more
- **When** the dashboard loads
- **Then** the low stock panel shows "No low stock items" message

### AC-DASH-05 — Access Control
- **Given** a customer attempts to access `/admin/dashboard`
- **When** the page loads
- **Then** they are redirected to `/admin/login`

### AC-DASH-06 — Clickable Recent Orders
- **Given** the recent orders table is displayed
- **When** an admin clicks an order row
- **Then** the admin is navigated to the order detail page at `/admin/orders/:id`

### AC-DASH-07 — Clickable Low Stock Products
- **Given** the low stock panel is displayed
- **When** an admin clicks a product name
- **Then** the admin is navigated to the product edit page at `/admin/products/:id/edit`

---

## Claude Prompts for This Module

**Stats aggregation:**
```
Write an Express controller `getAdminStats` that uses Mongoose to aggregate: total order count, total customer count, total revenue (sum of all order totalAmounts), and total product count. Return as a single JSON object. Stack: Node.js + Express + Mongoose.
```

**Stat card:**
```
Create a React StatCard component using Tailwind CSS. Props: label (string), value (string or number), icon (Tabler icon class name), color (e.g. blue, green, amber). Display an icon, label, and formatted value in a clean card layout.
```
