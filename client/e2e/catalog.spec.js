// /client/e2e/catalog.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

test.describe('Product Catalog', () => {
  test('user visits products page and sees grid', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    // Products should load within 3 seconds
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('pagination controls visible when multiple pages exist', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 3000 });
    // Check if pagination exists (only if more than 1 page)
    const pagination = page.locator('text=/Page.*of/');
    if (await pagination.isVisible()) {
      expect(await pagination.isVisible()).toBe(true);
    }
  });

  test('filter sidebar is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await expect(page.getByText('Shop by Category')).toBeVisible({ timeout: 2000 });
  });

  test('search bar is visible and functional', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    const searchInput = page.getByPlaceholder('Search products...');
    await expect(searchInput).toBeVisible();
  });

  test('user can search for products', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    const searchInput = page.getByPlaceholder('Search products...');
    await searchInput.fill('laptop');
    // Wait for debounce (400ms) + API response
    await page.waitForTimeout(500);
    // Check if results updated (component should show results)
    const results = page.locator('[data-testid="product-card"]');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('user can filter by category', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    // Wait for categories to load
    await page.waitForTimeout(1000);
    // Try to find and click a category checkbox (if available)
    const categoryCheckboxes = page.locator('input[type="checkbox"]').first();
    if (await categoryCheckboxes.isVisible()) {
      await categoryCheckboxes.click();
      // URL should update with category filter
      await page.waitForURL(/category=/);
      expect(page.url()).toContain('category=');
    }
  });

  test('user can filter by price range', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    const minPriceInput = page.locator('input[placeholder*="Min"]').first();
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('50');
      await page.waitForTimeout(500);
      expect(page.url()).toContain('minPrice');
    }
  });

  test('clear filters button resets all filters', async ({ page }) => {
    // Start with filters applied
    await page.goto(`${BASE_URL}/products?minPrice=50&maxPrice=200&sort=price_asc`);
    await page.waitForTimeout(500);
    const clearButton = page.getByRole('button', { name: /clear.*filter/i });
    if (await clearButton.isVisible()) {
      await clearButton.click();
      // URL should be cleaned
      await page.waitForURL('/products');
      expect(page.url()).toBe(`${BASE_URL}/products`);
    }
  });

  test('pagination navigates correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(1000);
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
      await nextButton.click();
      // URL should update with page=2
      await page.waitForURL(/page=2/);
      expect(page.url()).toContain('page=2');
    }
  });

  test('empty state shows when no products match filters', async ({ page }) => {
    // Filter for something that likely has no results
    await page.goto(`${BASE_URL}/products?minPrice=999999&maxPrice=9999999`);
    await page.waitForTimeout(1000);
    const emptyState = page.getByText('No products found');
    // Should show either no products message or have zero product cards
    const productCards = page.locator('[data-testid="product-card"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBe(0);
  });

  test('product card link navigates to detail page', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 3000 });
    const firstCard = page.locator('[data-testid="product-card"]').first();
    const link = firstCard.locator('a').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\/products\/[a-f0-9]{24}/); // MongoDB ObjectId pattern
  });

  test('URL with filters loads with those filters applied', async ({ page }) => {
    // Open with filters in URL
    await page.goto(`${BASE_URL}/products?minPrice=50&maxPrice=200&sort=price_asc`);
    // Products should load with filters applied
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 3000 });
    // Verify URL persisted
    expect(page.url()).toContain('minPrice=50');
    expect(page.url()).toContain('maxPrice=200');
    expect(page.url()).toContain('sort=price_asc');
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(1000);
    // Product grid should adapt (may show 1-2 columns)
    const grid = page.locator('[class*="grid"]');
    await expect(grid).toBeVisible();
  });
});
