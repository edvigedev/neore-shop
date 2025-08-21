import { test, expect } from '@playwright/test';
import type { Product, User } from '../src/types';

// Mock data for testing
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
    maidenName: '',
    age: 30,
    gender: 'male',
    email: 'john@example.com',
    phone: '+1234567890',
    username: 'johndoe',
    password: 'password123',
    birthDate: '1993-01-01',
    image: 'https://picsum.photos/200/200',
    bloodGroup: 'A+',
    height: 180,
    weight: 75,
    eyeColor: 'brown',
    hair: { color: 'brown', type: 'straight' },
    ip: '192.168.1.1',
    address: {
      address: '123 Main St',
      city: 'New York',
      coordinates: { lat: 40.7128, lng: -74.006 },
      postalCode: '10001',
      state: 'NY',
      stateCode: 'NY',
      country: 'USA',
    },
    macAddress: '00:11:22:33:44:55',
    university: 'University of Example',
    bank: {
      cardExpire: '12/25',
      cardNumber: '1234-5678-9012-3456',
      cardType: 'visa',
      currency: 'USD',
      iban: 'US12345678901234567890',
    },
    company: {
      address: {
        address: '456 Business Ave',
        city: 'Business City',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '12345',
        state: 'BC',
        stateCode: 'BC',
        country: 'USA',
      },
      department: 'Engineering',
      name: 'Tech Corp',
      title: 'Software Engineer',
    },
    ein: '12-3456789',
    ssn: '123-45-6789',
    userAgent: 'Mozilla/5.0',
    crypto: { coin: 'Bitcoin', wallet: 'wallet123', network: 'Bitcoin' },
    role: 'user',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    maidenName: '',
    age: 25,
    gender: 'female',
    email: 'jane@example.com',
    phone: '+0987654321',
    username: 'janesmith',
    password: 'password456',
    birthDate: '1998-05-15',
    image: 'https://picsum.photos/200/200',
    bloodGroup: 'O+',
    height: 165,
    weight: 60,
    eyeColor: 'blue',
    hair: { color: 'blonde', type: 'wavy' },
    ip: '192.168.1.2',
    address: {
      address: '789 Oak St',
      city: 'Los Angeles',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      postalCode: '90001',
      state: 'CA',
      stateCode: 'CA',
      country: 'USA',
    },
    macAddress: 'AA:BB:CC:DD:EE:FF',
    university: 'University of California',
    bank: {
      cardExpire: '06/26',
      cardNumber: '9876-5432-1098-7654',
      cardType: 'mastercard',
      currency: 'USD',
      iban: 'US09876543210987654321',
    },
    company: {
      address: {
        address: '321 Corporate Blvd',
        city: 'Corporate City',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '54321',
        state: 'CC',
        stateCode: 'CC',
        country: 'USA',
      },
      department: 'Marketing',
      name: 'Marketing Inc',
      title: 'Marketing Manager',
    },
    ein: '98-7654321',
    ssn: '987-65-4321',
    userAgent: 'Mozilla/5.0',
    crypto: { coin: 'Ethereum', wallet: 'wallet456', network: 'Ethereum' },
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
    // Mock API calls
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

    // Login as admin with proper waits
    await page.goto('/neore-shop/login');

    // Wait for login form to be ready
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.waitForSelector('#password', { timeout: 10000 });
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

    // Fill and submit form
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');

    // Wait for successful login
    await page.waitForURL('/neore-shop/', { timeout: 15000 });
  });

  test('should access admin dashboard after login', async ({ page }) => {
    // Wait for authentication to complete and verify we're logged in
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');

    // Verify admin link is visible
    const adminLink = page.getByRole('link', { name: 'Admin Dashboard' });
    await expect(adminLink).toBeVisible();

    // Navigate to admin dashboard
    await adminLink.click();
    await page.waitForURL('/neore-shop/admin');

    // Verify admin page content
    await expect(page.locator('.admin-page-title')).toHaveText('Admin Dashboard');
    await expect(page.locator('.admin-page-description')).toContainText(
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
    await expect(page.locator('.admin-page-products-section')).toBeVisible();
    await expect(page.locator('.admin-page-products-list')).toBeVisible();

    // Verify products are displayed
    const productItems = page.locator('.admin-page-products-list-item');
    await expect(productItems).toHaveCount(2);

    // Verify product details (products show as "1. iPhone 9", "2. iPhone X")
    await expect(productItems.nth(0)).toContainText('1. iPhone 9');
    await expect(productItems.nth(1)).toContainText('2. iPhone X');

    // Test navigation to edit product page
    const firstProductLink = page.locator('.admin-page-products-list-item').first().locator('a');
    await firstProductLink.click();

    // Verify edit page loads
    await page.waitForURL(/.*\/admin\/products\/\d+/);
    await expect(page.locator('.edit-product-page-title')).toHaveText('Edit: iPhone 9');
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
    await expect(page.locator('.users-page-title')).toHaveText('All users');
    await expect(page.locator('.users-list-section')).toBeVisible();

    // Verify users are displayed
    const userItems = page.locator('.users-list-items');
    await expect(userItems).toHaveCount(2);

    // Verify user details (users show as "1. John Doe", "2. Jane Smith")
    await expect(userItems.nth(0)).toContainText('1. John Doe');
    await expect(userItems.nth(1)).toContainText('2. Jane Smith');

    // Test navigation to user details page
    const firstUserLink = page.locator('.users-list-items').first().locator('a');
    await firstUserLink.click();

    // Verify user details page loads
    await page.waitForURL(/.*\/admin\/users\/\d+/);
    await expect(page.locator('.user-details-page-title')).toContainText('John Doe');
  });

  test('should block access to admin routes when not authenticated', async ({ page }) => {
    // First logout to clear authentication state
    await page.locator('.nav-bar-links').getByText('Logout').click();
    await page.waitForURL(/.*\/login/);

    // Now try to access admin route without authentication
    await page.goto('/neore-shop/admin');

    // Should be redirected to login page since not authenticated
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('.login-header')).toBeVisible();
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
    await expect(page.locator('.fetching-error-container')).toBeVisible();
  });
});
