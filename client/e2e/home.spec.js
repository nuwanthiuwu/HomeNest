// /client/e2e/home.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

test.describe('Home Page', () => {
  test('home page loads with hero banner visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('heading', { name: /welcome|home/i })).toBeVisible({ timeout: 3000 });
  });

  test('header displays with navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('HomeNest')).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('header shows login and register links when not authenticated', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
  });

  test('category menu is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Shop by Category')).toBeVisible({ timeout: 3000 });
  });

  test('featured products section is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('Featured Products')).toBeVisible({ timeout: 3000 });
  });

  test('new arrivals section is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('New Arrivals')).toBeVisible({ timeout: 3000 });
  });

  test('footer is visible at bottom', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByText('HomeNest. All rights reserved')).toBeVisible();
  });

  test('clicking products link navigates to products page', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL(/\/products/);
  });
});
