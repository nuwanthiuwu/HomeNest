# Module 08 — Admin Authentication

> **Stack:** Node.js · Express · JWT · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-auth`
> **Depends on:** Module 01 (Auth — base JWT middleware)

---

## Overview

Provide role-based access to the admin panel. Admins log in via a separate portal and see only the menu items their role permits.

---

## Roles

| Role | Access |
|------|--------|
| `super_admin` | Full access to all admin modules |
| `product_manager` | Products, Categories, Inventory, Promotions |
| `order_manager` | Orders, Customers |

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/admin/login` | No | Admin login — returns JWT with role |
| POST | `/admin/logout` | Yes | Admin logout |
| GET | `/admin/me` | Yes | Get current admin user |

---

## Dev Checklist

### Step 1 — Middleware
- [ ] Create `requireRole(...roles)` middleware — check `req.user.role` against allowed roles, return `403` if not authorised
- [ ] Existing `verifyToken` middleware already covers JWT validation — reuse it
- [ ] Seed at least one admin user in the database for testing

### Step 2 — Controller & Routes
- [ ] `adminLogin` — find user by email, verify password, confirm role is not `customer`, return JWT
- [ ] `adminLogout` — clear token on client
- [ ] `getAdminMe` — return admin user details
- [ ] Create `/server/routes/adminAuthRoutes.js`
- [ ] Register under `/admin` prefix in `app.js`

### Step 3 — API Tests (Postman)
- [ ] `POST /admin/login` with admin credentials → 200 + JWT
- [ ] `POST /admin/login` with customer credentials → 403 "Not authorised"
- [ ] `POST /admin/login` with wrong password → 401
- [ ] `GET /admin/me` with admin token → 200
- [ ] `GET /admin/orders` with `order_manager` token → 200
- [ ] `DELETE /admin/products/:id` with `order_manager` token → 403

### Step 4 — Axios API Functions
- [ ] Create `/client/src/api/adminAuthApi.js`
- [ ] Functions: `adminLogin`, `adminLogout`, `getAdminMe`

### Step 5 — Redux Slice
- [ ] Create `/client/src/store/adminAuthSlice.js`
- [ ] State: `admin`, `token`, `role`, `loading`, `error`
- [ ] Thunks: `adminLogin`, `adminLogout`

### Step 6 — React Components
- [ ] Admin login page (`/admin/login`)
- [ ] `AdminLayout` — sidebar, top bar, content area (shared wrapper for all admin pages)
- [ ] `AdminSidebar` — navigation links filtered by role
- [ ] `AdminProtectedRoute` — redirect to `/admin/login` if not authenticated
- [ ] `RoleProtectedRoute` — redirect to 403 page if role insufficient

### Step 7 — Integration Check
- [ ] `/admin/*` routes all redirect to `/admin/login` when unauthenticated
- [ ] Sidebar shows only links the admin's role can access
- [ ] `product_manager` cannot access `/admin/orders` (403 page shown)
- [ ] `super_admin` can access all admin routes

### Step 8 — Unit Tests (Jest)
- [ ] `requireRole` middleware — correct role passes, wrong role returns 403
- [ ] `adminLogin` — success, customer attempting login returns 403

### Step 9 — E2E Tests (Playwright)
- [ ] Admin navigates to `/admin` and is redirected to `/admin/login`
- [ ] Admin logs in and is redirected to admin dashboard
- [ ] Sidebar shows correct menu items for the logged-in role

### Step 10 — PR & Merge
- [ ] `git commit -m "feat: admin auth — login, role middleware, admin layout"`
- [ ] Push `feature/admin-auth` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-ADMIN-AUTH-01 — Admin Login Success
- **Given** a user with role `super_admin`, `product_manager`, or `order_manager` submits the admin login form with correct credentials
- **When** the form is submitted
- **Then** a JWT is returned, stored in Redux, and the user is redirected to the admin dashboard

### AC-ADMIN-AUTH-02 — Customer Blocked from Admin
- **Given** a user with role `customer` submits the admin login form
- **When** the form is submitted
- **Then** a `403` error is returned with "You are not authorised to access the admin panel"

### AC-ADMIN-AUTH-03 — Wrong Password
- **Given** an admin user submits the login form with an incorrect password
- **When** the form is submitted
- **Then** a `401` error is returned with "Invalid credentials"

### AC-ADMIN-AUTH-04 — Protected Admin Routes
- **Given** an unauthenticated user attempts to access any `/admin/*` page
- **When** the page loads
- **Then** the user is redirected to `/admin/login`

### AC-ADMIN-AUTH-05 — Role-Based Sidebar
- **Given** a `product_manager` is logged in to the admin panel
- **When** the sidebar renders
- **Then** only Products, Categories, Inventory, and Promotions links are visible; Orders and Customer Management links are hidden

### AC-ADMIN-AUTH-06 — Role-Based Route Guard
- **Given** an `order_manager` is logged in and tries to access `/admin/products`
- **When** the page loads
- **Then** a 403 "Access Denied" page is shown

### AC-ADMIN-AUTH-07 — Super Admin Full Access
- **Given** a `super_admin` is logged in
- **When** the sidebar renders
- **Then** all admin module links are visible and accessible

### AC-ADMIN-AUTH-08 — Admin Logout
- **Given** an admin is logged in and clicks logout
- **When** the logout action is triggered
- **Then** the JWT is cleared from Redux and localStorage, and the admin is redirected to `/admin/login`

### AC-ADMIN-AUTH-09 — Token Expiry
- **Given** an admin's JWT has expired
- **When** the admin makes a request to any protected admin endpoint
- **Then** a `401` response is received and the admin is redirected to `/admin/login`

---

## Claude Prompts for This Module

**Role middleware:**
```
Write an Express middleware `requireRole(...roles)` that checks req.user.role (set by verifyToken middleware) against the allowed roles array. Return 403 with "Insufficient permissions" if the role is not in the allowed list. Stack: Node.js + Express + JWT.
```

**Admin sidebar:**
```
Create a React AdminSidebar component using Tailwind CSS. Accept a `role` prop. Show navigation links based on role: super_admin sees all links; product_manager sees Products, Categories, Inventory, Promotions; order_manager sees Orders, Customers. Use React Router NavLink for active state styling.
```

**Admin protected route:**
```
Create a React AdminProtectedRoute component that reads admin auth state from Redux. If no admin token, redirect to /admin/login. If token exists but role is insufficient for the route, show a 403 Access Denied page. Stack: React + Redux Toolkit + React Router.
```
