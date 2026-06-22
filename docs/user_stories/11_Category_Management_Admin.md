# Module 11 — Category Management (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-categories`
> **Depends on:** Module 08 (Admin Auth)

---

## Overview

Allow admins to create, update, and delete product categories used to organise the storefront catalog.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/categories` | No | Public |
| GET | `/admin/categories` | Yes | All admin |
| POST | `/admin/categories` | Yes | product_manager, super_admin |
| PUT | `/admin/categories/:id` | Yes | product_manager, super_admin |
| DELETE | `/admin/categories/:id` | Yes | super_admin only |

---

## Data Model — Category

| Field | Type | Rules |
|-------|------|-------|
| `name` | String | Required, unique |
| `slug` | String | Auto-generated from name |
| `description` | String | Optional |
| `image` | String | URL |
| `isActive` | Boolean | Default true |

---

## Acceptance Criteria

### AC-CAT-ADMIN-01 — Create Category
- **Given** an admin submits the category form with a unique name
- **When** the form is submitted
- **Then** the category is created, a slug is auto-generated, and it appears in the category list and on the storefront

### AC-CAT-ADMIN-02 — Duplicate Category Name
- **Given** an admin submits a category with a name that already exists
- **When** the form is submitted
- **Then** a `400` error is returned with "Category name already exists"

### AC-CAT-ADMIN-03 — Update Category
- **Given** an admin updates a category name or description
- **When** the form is saved
- **Then** the changes are reflected immediately on both the admin panel and the customer storefront

### AC-CAT-ADMIN-04 — Delete Category with Products
- **Given** a category has products assigned to it and a super_admin tries to delete it
- **When** the delete is attempted
- **Then** a `400` error is returned: "Cannot delete category with existing products. Reassign products first."

### AC-CAT-ADMIN-05 — Delete Empty Category
- **Given** a category has no products and a super_admin deletes it
- **When** confirmed
- **Then** the category is removed and no longer appears on the storefront

### AC-CAT-ADMIN-06 — Category Visibility Toggle
- **Given** an admin deactivates a category
- **When** saved
- **Then** the category and all its products are hidden from the customer catalog

---

## Dev Checklist

- [ ] Create `/server/models/Category.js`
- [ ] Auto-generate `slug` from `name` in pre-save hook
- [ ] `createCategory`, `updateCategory`, `deleteCategory` controllers
- [ ] Block delete if products reference the category
- [ ] Admin category list page (`/admin/categories`)
- [ ] Category form (create and edit)
- [ ] Delete confirmation with product count warning
- [ ] Jest tests: create, duplicate name, delete with products
- [ ] `git commit -m "feat: admin category management — CRUD, slug, delete guard"`

---

## Claude Prompts for This Module

**Category model:**
```
Create a Mongoose Category schema with fields: name (required, unique), slug (auto-generated from name using a pre-save hook), description, image (URL string), isActive (Boolean, default true). Include timestamps.
```

**Delete guard:**
```
Write an Express controller `deleteCategory` that first checks if any Product documents reference this category. If yes, return 400 with "Cannot delete category with existing products". If no products reference it, delete the category. Stack: Node.js + Express + Mongoose.
```
