# Module 18 — Reviews & Ratings (Optional)

> **Stack:** Node.js · Express · MongoDB · Mongoose · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/reviews-ratings`
> **Depends on:** Module 01 (Auth), Module 07 (Orders — only allow reviews for purchased products)

---

## Overview

Allow customers who have purchased a product to submit a written review and star rating. Average ratings are displayed on product cards and detail pages.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products/:id/reviews` | No | Get all reviews for a product |
| POST | `/products/:id/reviews` | Yes | Submit a review |
| DELETE | `/products/:id/reviews/:reviewId` | Yes | Delete own review (or admin) |

---

## Data Model — Review

| Field | Type | Rules |
|-------|------|-------|
| `product` | ObjectId | Ref: Product |
| `user` | ObjectId | Ref: User |
| `rating` | Number | Required, 1–5 |
| `comment` | String | Required, min 10 chars |
| `createdAt` | Date | Auto |

---

## Acceptance Criteria

### AC-REV-01 — Submit Review — Eligible
- **Given** a logged-in user has a delivered order containing the product
- **When** they submit a review with a rating and comment
- **Then** the review is saved and the product's average rating is recalculated and updated

### AC-REV-02 — Submit Review — Not Purchased
- **Given** a user has not purchased the product
- **When** they attempt to submit a review
- **Then** a `403` error is returned: "You can only review products you have purchased"

### AC-REV-03 — Duplicate Review Prevention
- **Given** a user has already submitted a review for this product
- **When** they attempt to submit another
- **Then** a `400` error is returned: "You have already reviewed this product"

### AC-REV-04 — Review Validation
- **Given** a user submits a review with a comment shorter than 10 characters
- **When** the form is submitted
- **Then** a validation error is shown: "Review must be at least 10 characters"

### AC-REV-05 — Rating Required
- **Given** a user submits the review form without selecting a star rating
- **When** the form is submitted
- **Then** a validation error is shown: "Please select a rating"

### AC-REV-06 — Display Reviews
- **Given** a product has reviews
- **When** the product detail page loads
- **Then** all reviews are displayed with reviewer name, rating (stars), date, and comment

### AC-REV-07 — Average Rating Update
- **Given** a new review is submitted for a product with existing reviews
- **When** saved
- **Then** the product's `ratings.average` is recalculated as the mean of all reviews and `ratings.count` increments by 1

### AC-REV-08 — Delete Own Review
- **Given** a user has submitted a review
- **When** they click Delete on their own review
- **Then** the review is removed and the product's average rating is recalculated

### AC-REV-09 — Star Display
- **Given** a product has an average rating of 3.7
- **When** the rating is displayed
- **Then** 3 full stars, 1 partial star (70% filled), and 1 empty star are shown

---

## Dev Checklist

- [ ] Create `Review` model (unique index on product + user pair)
- [ ] `getProductReviews` — return reviews with populated user name
- [ ] `submitReview` — verify purchased, prevent duplicate, save review, recalculate product average
- [ ] `deleteReview` — only owner or admin can delete
- [ ] Recalculate product `ratings.average` and `ratings.count` after every add/delete
- [ ] `reviewSlice` — state, thunks
- [ ] Star rating input component (1–5 clickable stars)
- [ ] Review list on product detail page
- [ ] Review form (star picker + textarea) shown only if user has purchased
- [ ] Jest: eligible purchase check, duplicate prevention, average recalculation
- [ ] Playwright: user with delivered order submits review, rating appears on product page
- [ ] `git commit -m "feat: reviews and ratings — submit, display, average recalculation"`

---

## Claude Prompts for This Module

**Submit review controller:**
```
Write an Express controller `submitReview` that: checks the authenticated user has a delivered order containing the product (return 403 if not), checks they haven't already reviewed it (return 400 if duplicate), validates rating (1-5) and comment (min 10 chars), saves the review, then recalculates and updates the product's ratings.average and ratings.count using Mongoose aggregation. Stack: Node.js + Express + Mongoose.
```

**Star rating input:**
```
Create a React StarRatingInput component using Tailwind CSS. Props: value (0-5), onChange. Display 5 clickable star icons. Hovering highlights stars up to the hovered star. Clicking sets the value. Selected stars are filled gold, unselected are grey. No external libraries.
```

**Review list:**
```
Create a React ReviewList component using Tailwind CSS. Props: reviews (array of { user: { name }, rating, comment, createdAt }). Display each review as a card with the reviewer's name, star rating (display only), formatted date, and comment. Show "No reviews yet" if empty.
```
