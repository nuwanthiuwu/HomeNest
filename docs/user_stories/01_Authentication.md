# Module 01 — Authentication

> **Stack:** Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · Joi · React · Tailwind CSS · Redux Toolkit · Axios
> **Branch:** `feature/auth`
> **Depends on:** None — complete this first

---

## Overview

Allow users to securely register, log in, manage their profile, and reset their password. This module provides the JWT authentication layer that all other protected modules depend on.

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new customer account |
| POST | `/login` | No | Log in and receive JWT |
| POST | `/logout` | Yes | Invalidate session |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password` | No | Reset password via token |
| GET | `/profile` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update profile details |

---

## Data Model

**User**

| Field | Type | Rules |
|-------|------|-------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, hashed with bcrypt |
| `role` | String | Enum: `customer`, `admin`. Default: `customer` |
| `isActive` | Boolean | Default: `true` |
| `address` | Object | street, city, state, zip, country |
| `resetToken` | String | Hashed reset token |
| `resetTokenExpiry` | Date | Expiry timestamp |
| `createdAt` | Date | Auto via timestamps |

---

## Dev Checklist

### Step 1 — Model
- [ ] Create `/server/models/User.js`
- [ ] Hash password with bcrypt in pre-save hook
- [ ] Add unique index on `email`
- [ ] Add `timestamps: true`

### Step 2 — Controller & Routes
- [ ] `registerUser` — validate input, check duplicate email, hash password, create user, return JWT
- [ ] `loginUser` — find user by email, compare password, return JWT
- [ ] `logoutUser` — clear token on client (stateless JWT)
- [ ] `forgotPassword` — generate reset token, hash and store, send email
- [ ] `resetPassword` — validate token, hash new password, clear token
- [ ] `getProfile` — return authenticated user (exclude password)
- [ ] `updateProfile` — update allowed fields only
- [ ] Create `/server/routes/authRoutes.js`
- [ ] Add `verifyToken` middleware
- [ ] Register routes in `app.js`

### Step 3 — API Tests (Postman)
- [ ] Register with valid data → 201
- [ ] Register with duplicate email → 400
- [ ] Register with missing fields → 400
- [ ] Login with correct credentials → 200 + token
- [ ] Login with wrong password → 401
- [ ] Get profile with valid token → 200
- [ ] Get profile with no token → 401

### Step 4 — Redux Slice
- [ ] Create `/client/src/store/authSlice.js`
- [ ] State: `user`, `token`, `loading`, `error`
- [ ] Thunks: `registerUser`, `loginUser`, `logoutUser`, `fetchProfile`
- [ ] Persist token to localStorage

### Step 5 — Axios
- [ ] Create `/client/src/api/authApi.js`
- [ ] Create base Axios instance with JWT interceptor
- [ ] Functions: `register`, `login`, `logout`, `forgotPassword`, `resetPassword`, `getProfile`, `updateProfile`

### Step 6 — React Components
- [ ] Register page (`/register`)
- [ ] Login page (`/login`)
- [ ] Forgot password page (`/forgot-password`)
- [ ] Reset password page (`/reset-password`)
- [ ] My profile page (`/profile`)
- [ ] `ProtectedRoute` wrapper component (redirects to login if no token)

### Step 7 — Integration Check
- [ ] Register → auto login → redirect to home
- [ ] Login → JWT stored in Redux + localStorage
- [ ] All protected pages redirect to `/login` when unauthenticated
- [ ] Profile page shows correct user data

### Step 8 — Unit Tests (Jest)
- [ ] `registerUser` — success, duplicate email, missing fields
- [ ] `loginUser` — success, wrong password, user not found
- [ ] `verifyToken` middleware — valid token, expired token, no token
- [ ] Auth slice reducers — pending, fulfilled, rejected states

### Step 9 — E2E Tests (Playwright)
- [ ] User registers with valid data and is redirected to home
- [ ] User logs in and sees profile name in header
- [ ] User visits protected page without login and is redirected to `/login`
- [ ] User completes forgot password flow

### Step 10 — PR & Merge
- [ ] `git commit -m "feat: authentication — register, login, JWT, profile, password reset"`
- [ ] Push `feature/auth` → open PR into `develop`
- [ ] Merge after review

---

## Acceptance Criteria

### AC-AUTH-01 — User Registration
- **Given** a visitor submits the registration form with a unique email, valid password (min 8 chars), and name
- **When** the form is submitted
- **Then** a new user account is created, a JWT is returned, and the user is redirected to the home page

### AC-AUTH-02 — Duplicate Email Rejected
- **Given** a visitor submits the registration form with an email already in the database
- **When** the form is submitted
- **Then** a `400` error is returned with the message "Email already in use" and no account is created

### AC-AUTH-03 — Registration Validation
- **Given** a visitor submits the registration form with missing or invalid fields (e.g. weak password, missing name)
- **When** the form is submitted
- **Then** inline validation errors are shown for each invalid field and the request is not sent to the server

### AC-AUTH-04 — User Login Success
- **Given** a registered user submits the login form with correct email and password
- **When** the form is submitted
- **Then** a JWT token is returned, stored in Redux state, and the user is redirected to the home page

### AC-AUTH-05 — User Login Failure
- **Given** a user submits the login form with an incorrect password or unregistered email
- **When** the form is submitted
- **Then** a `401` error is returned with the message "Invalid credentials" and the user remains on the login page

### AC-AUTH-06 — Protected Route Guard
- **Given** an unauthenticated user attempts to access a protected page (e.g. `/profile`, `/orders`)
- **When** the page loads
- **Then** the user is immediately redirected to `/login`

### AC-AUTH-07 — JWT Attached to Requests
- **Given** a logged-in user makes a request to a protected endpoint
- **When** the Axios request is sent
- **Then** the `Authorization: Bearer <token>` header is automatically attached via the Axios interceptor

### AC-AUTH-08 — Profile View
- **Given** an authenticated user navigates to `/profile`
- **When** the page loads
- **Then** the user's name, email, and address are displayed correctly

### AC-AUTH-09 — Profile Update
- **Given** an authenticated user updates their name or address on the profile page
- **When** the form is submitted
- **Then** the updated data is saved to the database and the UI reflects the changes without a page reload

### AC-AUTH-10 — Forgot Password Email
- **Given** a user submits the forgot password form with a registered email
- **When** the form is submitted
- **Then** a password reset email is sent and a success message is shown (even if the email is not registered, to prevent enumeration)

### AC-AUTH-11 — Password Reset
- **Given** a user clicks the reset link in the email and submits a new valid password
- **When** the form is submitted
- **Then** the password is updated, the reset token is cleared, and the user is redirected to the login page

### AC-AUTH-12 — Expired Reset Token
- **Given** a user attempts to use a password reset link that has expired (>1 hour)
- **When** the reset form is submitted
- **Then** a `400` error is returned with "Reset link has expired" and the user is prompted to request a new one

### AC-AUTH-13 — Logout
- **Given** a logged-in user clicks logout
- **When** the action is triggered
- **Then** the JWT is removed from Redux state and localStorage, and the user is redirected to `/login`

### AC-AUTH-14 — Inactive Account
- **Given** an admin has deactivated a user account and that user attempts to log in
- **When** the login form is submitted
- **Then** a `403` error is returned with "Account has been deactivated"

---

## Claude Prompts for This Module

**Model:**
```
Create a Mongoose User schema with fields: name, email (unique), password (bcrypt hashed in pre-save hook), role (enum: customer/admin, default: customer), isActive (boolean, default: true), address (object), resetToken, resetTokenExpiry. Include timestamps. Stack: Node.js + Mongoose.
```

**Controller:**
```
Write Express controllers for user authentication: registerUser, loginUser, forgotPassword, resetPassword, getProfile, updateProfile. Use async/await, Joi validation, bcrypt, and JWT. Return proper HTTP status codes. Stack: Node.js + Express + Mongoose + JWT.
```

**Redux slice:**
```
Write a Redux Toolkit authSlice with state: user, token, loading, error. Include async thunks for registerUser, loginUser, logoutUser, fetchProfile using Axios. Persist token to localStorage. Stack: React + Redux Toolkit + Axios.
```

**Playwright E2E:**
```
Write Playwright E2E tests for: user registration with valid data, login with correct credentials, redirect to /login when accessing a protected page unauthenticated. Frontend runs on localhost:3000.
```
