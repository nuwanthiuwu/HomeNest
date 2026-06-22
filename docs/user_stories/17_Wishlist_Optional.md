# Module 17 — Wishlist (Optional)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/wishlist`
> **Depends on:** Module 01 (Auth), Module 04 (Product Details — Add to Wishlist button)

---

## Overview

Allow logged-in customers to save products to a personal wishlist and move them to the cart when ready to purchase.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wishlist` | Yes | Get current user's wishlist |
| POST | `/wishlist/:productId` | Yes | Add product to wishlist |
| DELETE | `/wishlist/:productId` | Yes | Remove product from wishlist |

---

## Acceptance Criteria

### AC-WISH-01 — Add to Wishlist
- **Given** a logged-in user clicks "Add to Wishlist" on a product
- **When** the action is triggered
- **Then** the product is added to the wishlist and the wishlist icon on the product fills/changes to indicate it is saved

### AC-WISH-02 — Duplicate Prevention
- **Given** a product is already in the user's wishlist
- **When** the user clicks "Add to Wishlist" again
- **Then** the product is not duplicated and the action toggles to "Remove from Wishlist"

### AC-WISH-03 — Wishlist Page
- **Given** a logged-in user navigates to `/wishlist`
- **When** the page loads
- **Then** all saved products are displayed with image, name, price, and availability

### AC-WISH-04 — Remove from Wishlist
- **Given** a user clicks "Remove" on a wishlist item
- **When** the action is triggered
- **Then** the product is removed from the wishlist immediately

### AC-WISH-05 — Move to Cart
- **Given** a user clicks "Move to Cart" on a wishlist item
- **When** the action is triggered
- **Then** the product is added to the cart and removed from the wishlist

### AC-WISH-06 — Unauthenticated Access
- **Given** a guest user clicks "Add to Wishlist"
- **When** the action is triggered
- **Then** the user is redirected to `/login` with a message "Log in to save to your wishlist"

### AC-WISH-07 — Out of Stock in Wishlist
- **Given** a wishlisted product goes out of stock
- **When** the wishlist page renders
- **Then** the product is shown with an "Out of Stock" badge and the Move to Cart button is disabled

---

## Dev Checklist

- [ ] Create `Wishlist` model: user (ObjectId), products ([ObjectId])
- [ ] `getWishlist`, `addToWishlist`, `removeFromWishlist` controllers
- [ ] Prevent duplicates in addToWishlist
- [ ] `wishlistSlice` — state, thunks
- [ ] Wishlist page (`/wishlist`)
- [ ] Wishlist icon/button on ProductCard and ProductDetail
- [ ] "Move to Cart" dispatches addItem to cartSlice and removes from wishlist
- [ ] Jest: add, remove, duplicate prevention
- [ ] `git commit -m "feat: wishlist — save products, remove, move to cart"`

---

## Claude Prompts for This Module

**Wishlist controller:**
```
Write Express controllers for a wishlist: getWishlist (return user's wishlist with populated product details), addToWishlist (add productId if not already present), removeFromWishlist (remove productId). Use $addToSet to prevent duplicates. Stack: Node.js + Express + Mongoose.
```
