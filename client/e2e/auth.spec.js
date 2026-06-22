// /client/e2e/auth.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

async function loginAs(page, email, password) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
}

test.describe('Authentication', () => {
  test('user registers with valid data and is redirected', async ({ page }) => {
    const email = `testuser+${Date.now()}@example.com`;

    await page.goto(`${BASE_URL}/register`);
    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email Address').fill(email);
    await page.getByLabel('Password').fill('Password123');
    await page.getByRole('button', { name: 'Register' }).click();

    // After register → auto-login → redirected away from /register
    await expect(page).not.toHaveURL(`${BASE_URL}/register`);
  });

  test('registration fails with duplicate email', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email Address').fill('existing@example.com');
    await page.getByLabel('Password').fill('Password123');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Email already in use')).toBeVisible();
  });

  test('user logs in with valid credentials', async ({ page }) => {
    await loginAs(page, 'jane@example.com', 'Password123');
    await expect(page).not.toHaveURL(`${BASE_URL}/login`);
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel('Email Address').fill('jane@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('unauthenticated user visiting /profile is redirected to /login', async ({ page }) => {
    // Clear any stored state
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto(`${BASE_URL}/profile`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('user completes forgot password flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/forgot-password`);
    await page.getByLabel('Email Address').fill('jane@example.com');
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    await expect(
      page.getByText('If that email exists, a reset link has been sent')
    ).toBeVisible();
  });
});
