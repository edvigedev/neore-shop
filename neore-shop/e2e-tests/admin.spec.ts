import { test, expect } from '@playwright/test';
import type { Product, User } from '../src/types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    thumbnail: 'https://picsum.photos/200/200',
    images: ['https://picsum.photos/200/200'],
    category: 'smartphones',
    stock: 1,
  },
  {
    id: 2,
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display',
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    thumbnail: 'https://picsum.photos/200/200',
    images: ['https://picsum.photos/200/200'],
    category: 'smartphones',
    stock: 5,
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    role: 'admin',
  },
];

const mockPayload = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  role: 'admin',
};
const mockJwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.signature`;

const mockAdminUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  accessToken: mockJwtToken,
  refreshToken: 'fake-refresh-token-67890',
  role: 'admin',
};

test.describe('Admin Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: mockProducts, total: 2, skip: 0, limit: 30 },
      });
    });

    await page.route('https://dummyjson.com/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { users: mockUsers, total: 2, skip: 0, limit: 30 },
      });
    });

    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockAdminUser,
      });
    });

    await page.goto('/neore-shop/login');

    await page.waitForSelector('#username', { timeout: 10000 });
    await page.waitForSelector('#password', { timeout: 10000 });
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');

    await page.waitForURL('/neore-shop/', { timeout: 15000 });
  });

  test('should access admin dashboard after login', async ({ page }) => {
    await expect(page.locator('[data-testid="navbar-logout-li"]')).toHaveText('Logout');

    // Verify admin link is visible
    const adminLink = page.locator('[data-testid="navbar-admin-link"]');
    await expect(adminLink).toBeVisible();

    // Navigate to admin dashboard
    await adminLink.click();
    await page.waitForURL('/neore-shop/admin');

    // Verify admin page content
    await expect(page.locator('[data-testid="admin-page-title"]')).toHaveText('Admin Dashboard');
    await expect(page.locator('[data-testid="admin-page-description"]')).toContainText(
      'This is where you will manage products'
    );
  });

  test('should manage products in admin dashboard', async ({ page }) => {
    // Mock individual product API calls for edit page
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockProducts[0], // iPhone 9
      });
    });

    await page.route('https://dummyjson.com/products/2', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockProducts[1], // iPhone X
      });
    });

    // Navigate to admin dashboard
    await page.goto('/neore-shop/admin');

    // Verify products section
    await expect(page.locator('[data-testid="admin-page-products-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="admin-page-products-list"]')).toBeVisible();

    // Verify products are displayed
    const productItems = page.locator('[data-testid="admin-page-products-list-item"]');
    await expect(productItems).toHaveCount(2);

    // Verify product details (products show as "1. iPhone 9", "2. iPhone X")
    await expect(productItems.nth(0)).toContainText('1. iPhone 9');
    await expect(productItems.nth(1)).toContainText('2. iPhone X');

    // Test navigation to edit product page
    const firstProductLink = page
      .locator('[data-testid="admin-page-products-list-item"]')
      .first()
      .locator('a');
    await firstProductLink.click();

    // Verify edit page loads
    await page.waitForURL(/.*\/admin\/products\/\d+/);
    await expect(page.locator('[data-testid="edit-product-page-title"]')).toHaveText(
      'Edit: iPhone 9'
    );
  });

  test('should manage users in admin dashboard', async ({ page }) => {
    // Mock user details API
    await page.route('https://dummyjson.com/users/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockUsers[0],
      });
    });

    await page.route('https://dummyjson.com/carts/user/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { carts: [], total: 0, skip: 0, limit: 30 },
      });
    });

    // Navigate to users page
    await page.goto('/neore-shop/admin/users');

    // Verify users page content
    await expect(page.locator('[data-testid="users-page-title"]')).toHaveText('All users');
    await expect(page.locator('[data-testid="users-list-section"]')).toBeVisible();

    // Verify users are displayed
    const userItems = page.locator('[data-testid="users-list-items"]');
    await expect(userItems).toHaveCount(2);

    // Verify user details (users show as "1. John Doe", "2. Jane Smith")
    await expect(userItems.nth(0)).toContainText('1. John Doe');
    await expect(userItems.nth(1)).toContainText('2. Jane Smith');

    // Test navigation to user details page
    const firstUserLink = page.locator('[data-testid="users-list-items"]').first().locator('a');
    await firstUserLink.click();

    // Verify user details page loads
    await page.waitForURL(/.*\/admin\/users\/\d+/);
    await expect(page.locator('[data-testid="user-details-page-title"]')).toContainText('John Doe');
  });

  test('should block access to admin routes when not authenticated', async ({ page }) => {
    // First logout to clear authentication state
    await page.locator('[data-testid="navbar-logout-li"]').click();
    await page.waitForURL(/.*\/login/);

    // Now try to access admin route without authentication
    await page.goto('/neore-shop/admin');

    // Should be redirected to login page since not authenticated
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('[data-testid="login-header"]')).toBeVisible();
  });

  test('should handle admin page loading errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        json: { message: 'Internal Server Error' },
      });
    });

    // Navigate to admin dashboard
    await page.goto('/neore-shop/admin');

    // Should show error state
    await expect(page.locator('[data-testid="fetching-error"]')).toBeVisible();
  });
});
