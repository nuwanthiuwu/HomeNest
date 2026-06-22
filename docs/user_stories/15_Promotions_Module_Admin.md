# Module 15 — Promotions Module (Admin)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/admin-promotions`
> **Depends on:** Module 08 (Admin Auth), Module 06 (Checkout — coupon validation)

---

## Overview

Allow admins to create discount coupons, define rules, and manage promotional campaigns shown on the home page.

---

## Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/admin/coupons` | Yes | product_manager, super_admin |
| POST | `/admin/coupons` | Yes | product_manager, super_admin |
| PUT | `/admin/coupons/:id` | Yes | product_manager, super_admin |
| DELETE | `/admin/coupons/:id` | Yes | super_admin |
| POST | `/coupons/validate` | Yes | Customer |
| GET | `/admin/campaigns` | Yes | product_manager, super_admin |
| POST | `/admin/campaigns` | Yes | product_manager, super_admin |

---

## Data Model — Coupon

| Field | Type | Rules |
|-------|------|-------|
| `code` | String | Required, unique, uppercase |
| `discountType` | String | Enum: `percentage`, `fixed` |
| `discountValue` | Number | Required, min 0 |
| `minOrderAmount` | Number | Optional |
| `usageLimit` | Number | Max times usable |
| `usageCount` | Number | Current usage count |
| `expiresAt` | Date | Expiry date |
| `isActive` | Boolean | Default true |

---

## Acceptance Criteria

### AC-PROMO-01 — Create Coupon
- **Given** an admin creates a coupon with a unique code, discount type, value, and expiry
- **When** saved
- **Then** the coupon is active and can be used by customers at checkout

### AC-PROMO-02 — Coupon Code Uniqueness
- **Given** an admin creates a coupon with a code that already exists
- **When** saved
- **Then** a `400` error is returned: "Coupon code already exists"

### AC-PROMO-03 — Percentage Discount
- **Given** a valid percentage coupon (e.g. 20% off) is applied at checkout
- **When** the coupon is validated
- **Then** 20% is deducted from the order subtotal

### AC-PROMO-04 — Fixed Discount
- **Given** a valid fixed coupon (e.g. €10 off) is applied at checkout with a subtotal above the minimum order amount
- **When** the coupon is validated
- **Then** €10 is deducted from the subtotal

### AC-PROMO-05 — Minimum Order Not Met
- **Given** a coupon requires a minimum order of €50 and the cart subtotal is €30
- **When** the coupon is validated
- **Then** a validation error is returned: "Minimum order amount of €50 required"

### AC-PROMO-06 — Expired Coupon
- **Given** a coupon's expiry date has passed
- **When** a customer tries to apply it
- **Then** a `400` error is returned: "This coupon has expired"

### AC-PROMO-07 — Usage Limit Reached
- **Given** a coupon has been used the maximum number of times
- **When** a customer tries to apply it
- **Then** a `400` error is returned: "This coupon is no longer available"

### AC-PROMO-08 — Deactivate Coupon
- **Given** an admin deactivates a coupon
- **When** a customer tries to use it
- **Then** a `400` error is returned: "Invalid coupon code"

### AC-PROMO-09 — Campaign Banner
- **Given** an admin creates a campaign with an image, title, and link
- **When** saved as active
- **Then** the campaign appears in the home page hero banner

---

## Dev Checklist

- [ ] Create `Coupon` and `Campaign` models
- [ ] `validateCoupon` controller — check active, not expired, usage limit, min order
- [ ] Increment `usageCount` on successful order with coupon
- [ ] Coupon list page with active/expired filter
- [ ] Coupon create/edit form
- [ ] Campaign manager with image URL, title, CTA link, active toggle
- [ ] Jest: all coupon validation edge cases
- [ ] `git commit -m "feat: admin promotions — coupons, validation, campaigns"`

---

## Claude Prompts for This Module

**Coupon validation:**
```
Write an Express controller `validateCoupon` that accepts a coupon code and order subtotal. Checks: coupon exists, isActive, not expired (expiresAt > now), usageCount < usageLimit, subtotal >= minOrderAmount. Return the discount amount if valid, or a descriptive error. Stack: Node.js + Express + Mongoose.
```
