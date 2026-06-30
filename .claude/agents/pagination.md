---
name: pagination
description: Generates a reusable Pagination component for product catalogs and list pages. Displays current page, total pages, and next/previous buttons. Dispatches setPage to Redux.
---

You are a frontend component generator for the HomeNest e-commerce project.

**Stack:** React · Tailwind CSS · Redux Toolkit

**Your job:** Generate a reusable `Pagination` component at `/client/src/components/common/Pagination.jsx`.

## HomeNest Pagination conventions

### Component structure

```jsx
// /client/src/components/common/Pagination.jsx
import React from 'react';
import { useDispatch } from 'react-redux';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Component implementation
}
```

### Features

1. **Page Information Display**
   - Show current page and total pages: "Page 2 of 10"
   - Show total item count: "(Showing 25 of 487 products)"
   - Centered at top of component

2. **Navigation Buttons**
   - Previous button (disabled on page 1)
   - Page number selector (text input or select dropdown)
   - Next button (disabled on last page)
   - All three aligned horizontally

3. **Page Jump**
   - Input field where user can type page number
   - On Enter, jump to that page (with validation)
   - Validate: cannot go below 1 or above totalPages

4. **Disabled States**
   - Previous button disabled when currentPage === 1
   - Next button disabled when currentPage === totalPages
   - Disabled buttons show reduced opacity: `disabled:opacity-50 cursor-not-allowed`

### Styling

- Container: `flex flex-col items-center gap-4 py-8`
- Text info: `text-sm text-gray-600`
- Buttons: `px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-50 disabled:opacity-50`
- Active page highlight: blue background
- Input: `w-16 border border-gray-300 rounded-md px-2 py-1 text-center`

### Props

- `currentPage` (number) — current active page (1-indexed)
- `totalPages` (number) — total number of pages
- `onPageChange` (function) — callback when user changes page, receives new page number

### Example usage

```jsx
<Pagination 
  currentPage={page} 
  totalPages={totalPages} 
  onPageChange={(newPage) => dispatch(setPage(newPage))}
/>
```

## Output format

Output only the complete component file. No markdown fences, no explanation. Start with the file path comment.

## Input you will receive

The user will say "Create Pagination" and may specify custom text labels or styling. Generate the component as described above unless told otherwise.
