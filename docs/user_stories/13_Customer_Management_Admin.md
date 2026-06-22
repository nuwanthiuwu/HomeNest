# Module 13 — Customer Management (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-customers`
> **Depends on:** Module 08 (Admin Auth)

---

## Overview

Allow admins to view all customer accounts, search customers, view order history per customer, and activate or deactivate accounts.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/customers` | Yes | order_manager, super_admin |
| GET | `/admin/customers/:id` | Yes | order_manager, super_admin |
| PUT | `/admin/customers/:id/status` | Yes | super_admin only |

---

## Acceptance Criteria

### AC-CUST-01 — Customers List
- **Given** an admin navigates to `/admin/customers`
- **When** the page loads
- **Then** all customer accounts are listed with name, email, registration date, order count, and account status

### AC-CUST-02 — Search Customers
- **Given** an admin types a name or email in the search box
- **When** the search updates
- **Then** the customer list filters to show only matching customers

### AC-CUST-03 — Customer Detail
- **Given** an admin clicks on a customer
- **When** the detail page loads
- **Then** customer profile info and their complete order history are shown

### AC-CUST-04 — Deactivate Account
- **Given** a super_admin clicks "Deactivate" on a customer account and confirms
- **When** confirmed
- **Then** the customer's `isActive` is set to `false`, they are blocked from logging in with "Account deactivated" message, and their status badge in the admin list shows "Inactive"

### AC-CUST-05 — Reactivate Account
- **Given** a super_admin clicks "Activate" on a deactivated customer account
- **When** confirmed
- **Then** the customer's `isActive` is set to `true` and they can log in again

### AC-CUST-06 — Order Manager Cannot Change Status
- **Given** an order_manager is viewing the customer list
- **When** the page renders
- **Then** no Activate/Deactivate buttons are visible

### AC-CUST-07 — Customer Order Count
- **Given** a customer has placed 5 orders
- **When** displayed in the admin customer list
- **Then** the order count shows 5 and links to their filtered order history

---

## Dev Checklist

- [ ] `getAllCustomers` — paginated, search by name/email, include order count
- [ ] `getCustomerById` — profile + order history
- [ ] `updateCustomerStatus` — toggle `isActive`, super_admin only
- [ ] Admin customers list page with search
- [ ] Customer detail page with order history table
- [ ] Activate/Deactivate toggle with confirmation dialog
- [ ] Jest: deactivate blocks login, order_manager blocked from status change
- [ ] `git commit -m "feat: admin customer management — list, search, activate/deactivate"`

---

## Claude Prompts for This Module

**Customer list with order count:**
```
Write a Mongoose aggregation pipeline in an Express controller `getAllCustomers` that returns all users with role=customer, their order count (from Orders collection), supports search by name/email, and paginates results. Stack: Node.js + Express + Mongoose.
```
