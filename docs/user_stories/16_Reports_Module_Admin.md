# Module 16 — Reports Module (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios · Recharts
> **Branch:** `feature/admin-reports`
> **Depends on:** Module 08 (Admin Auth), Module 06 (Checkout), Module 10 (Products)

---

## Overview

Provide super admins with data-driven sales, customer, and product performance reports with date filtering and charts.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/reports/sales` | Yes | super_admin |
| GET | `/admin/reports/customers` | Yes | super_admin |
| GET | `/admin/reports/products` | Yes | super_admin |

**Query params:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

---

## Acceptance Criteria

### AC-REP-01 — Sales Report
- **Given** a super_admin views the sales report with a date range
- **When** the report loads
- **Then** total revenue, total orders, and average order value for the period are shown along with a revenue-over-time line chart

### AC-REP-02 — Customer Report
- **Given** a super_admin views the customer report
- **When** the report loads
- **Then** total customers, new customers in the period, and a customer growth chart are displayed

### AC-REP-03 — Product Report
- **Given** a super_admin views the product report
- **When** the report loads
- **Then** a table of top 10 products by revenue is shown with product name, units sold, and total revenue

### AC-REP-04 — Date Range Filter
- **Given** a super_admin selects a custom date range
- **When** applied
- **Then** all report data updates to reflect only the selected period

### AC-REP-05 — Access Control
- **Given** a product_manager or order_manager attempts to access `/admin/reports`
- **When** the page loads
- **Then** a 403 Access Denied page is shown

### AC-REP-06 — Empty Period
- **Given** the selected date range has no orders
- **When** the report loads
- **Then** metrics show zero and charts display an empty state message

---

## Dev Checklist

- [ ] `getSalesReport` — group orders by date, sum revenue, count orders
- [ ] `getCustomerReport` — count new users by registration date
- [ ] `getProductReport` — aggregate order items, sum revenue per product
- [ ] All reports filtered by `startDate` / `endDate`
- [ ] Reports page with date range picker
- [ ] Revenue line chart (Recharts)
- [ ] Top products table
- [ ] Customer growth bar chart
- [ ] Jest: aggregation returns correct values for a known data set
- [ ] `git commit -m "feat: admin reports — sales, customer, product charts"`

---

## Claude Prompts for This Module

**Sales report aggregation:**
```
Write an Express controller `getSalesReport` that accepts startDate and endDate query params. Use Mongoose aggregation to: group orders by date (YYYY-MM-DD), sum totalAmount per day, count orders per day, calculate overall total revenue and average order value. Return daily data array and summary totals. Stack: Node.js + Express + Mongoose.
```

**Revenue chart:**
```
Create a React RevenueChart component using Recharts LineChart. Props: data (array of { date: string, revenue: number }). Show a responsive line chart with date on X axis and revenue on Y axis. Use Tailwind for the wrapper. Label axes clearly.
```
