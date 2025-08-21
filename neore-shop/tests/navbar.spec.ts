import { test, expect } from '@playwright/test';

test.describe('NavBar Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the products API for search functionality
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          products: [
            {
              id: 1,
              title: 'iPhone 9',
              description: 'An apple mobile which is nothing like apple',
              category: 'smartphones',
              price: 549,
              stock: 94,
              rating: 4.69,
              brand: 'Apple',
              thumbnail: 'https://picsum.photos/200/300',
              images: ['https://picsum.photos/200/300'],
            },
            {
              id: 2,
              title: 'MacBook Pro',
              description: 'MacBook Pro 2021 with mini-LED display',
              category: 'laptops',
              price: 1749,
              stock: 83,
              rating: 4.57,
              brand: 'Apple',
              thumbnail: 'https://picsum.photos/200/300',
              images: ['https://picsum.photos/200/300'],
            },
            {
              id: 3,
              title: 'Samsung Galaxy',
              description: 'Samsung Galaxy smartphone with great features',
              category: 'smartphones',
              price: 899,
              stock: 50,
              rating: 4.3,
              brand: 'Samsung',
              thumbnail: 'https://picsum.photos/200/300',
              images: ['https://picsum.photos/200/300'],
            },
          ],
        }),
      });
    });

    // Mock the users API for admin functionality
    await page.route('https://dummyjson.com/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          users: [
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
          ],
        }),
      });
    });

    const mockPayload = {
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'admin',
    };

    const mockJwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

    // Mock the login API
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: 'emilys',
          email: 'emily@example.com',
          firstName: 'Emily',
          lastName: 'Smith',
          role: 'admin',
          accessToken: mockJwtToken,
          refreshToken: 'fake-refresh-token',
        }),
      });
    });

    await page.goto('/neore-shop/');
    await page.waitForTimeout(1000);
  });

  test.describe('Navigation and Branding', () => {
    test('should display Neore logo and navigate to homepage', async ({ page }) => {
      const logo = page.locator('.neore-logo');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveText('Neore');

      // Click logo and verify navigation
      await logo.click();
      await expect(page).toHaveURL('/neore-shop/');
    });
  });

  test.describe('Authentication States', () => {
    test('should show Login when not authenticated', async ({ page }) => {
      const loginButton = page.locator('.nav-bar-links li').first();
      await expect(loginButton).toHaveText('Login');
    });

    test('should show Logout when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Check logout is visible
      const logoutButton = page.locator('.nav-bar-links li').first();
      await expect(logoutButton).toHaveText('Logout');
    });

    test('should handle logout correctly', async ({ page }) => {
      // Login first
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Logout
      const logoutButton = page.locator('.nav-bar-links li').first();
      await logoutButton.click();
      await page.waitForURL(/.*\/login/);
    });
  });

  test.describe('Admin Features', () => {
    test('should show admin links when user has admin role', async ({ page }) => {
      // Login as admin
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Check admin links are visible
      await expect(page.locator('.nav-bar-links')).toContainText('Admin Dashboard');
      await expect(page.locator('.nav-bar-links')).toContainText('Users');
    });

    test('should navigate to admin pages correctly', async ({ page }) => {
      // Login as admin
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Navigate to Users
      await page.getByRole('link', { name: 'Users' }).click();
      await expect(page).toHaveURL('/neore-shop/admin/users');

      // Navigate to Admin Dashboard
      await page.getByRole('link', { name: 'Admin Dashboard' }).click();
      await expect(page).toHaveURL('/neore-shop/admin');
    });
  });

  test.describe('Cart Functionality', () => {
    test('should display cart button and count when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Check cart elements
      const cartButton = page.locator('.cart-button');
      const cartCount = page.locator('.cart-count');

      await expect(cartButton).toBeVisible();
      await expect(cartCount).toBeVisible();
      await expect(cartCount).toHaveText('0');
    });

    test('should navigate to cart page when clicked', async ({ page }) => {
      // Login first
      await page.goto('/neore-shop/login');
      await page.fill('#username', 'emilys');
      await page.fill('#password', 'emilyspass');
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // Click cart and verify navigation
      await page.locator('.cart-button').click();
      await expect(page).toHaveURL('/neore-shop/cart');
    });
  });

  test.describe('Search Functionality', () => {
    test('should display search input', async ({ page }) => {
      const searchInput = page.locator('.nav-search-input');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search');
    });

    test('should filter products in real-time', async ({ page }) => {
      // Type in search
      const searchInput = page.locator('.nav-search-input');
      await searchInput.fill('iPhone');

      // Wait for filtering to take effect
      await page.waitForTimeout(100);

      // Check that only iPhone product is visible
      const productCards = page.locator('.cards-container-list li');
      await expect(productCards).toHaveCount(1);
      await expect(productCards.first()).toContainText('iPhone 9');
    });

    test('should filter products by category', async ({ page }) => {
      // Type in search
      const searchInput = page.locator('.nav-search-input');
      await searchInput.fill('smartphones');

      // Wait for filtering to take effect
      await page.waitForTimeout(100);

      // Check that only smartphone products are visible
      const productCards = page.locator('.cards-container-list li');
      await expect(productCards).toHaveCount(2); // iPhone and Samsung Galaxy
    });

    test('should show no results message for non-matching search', async ({ page }) => {
      // Type in search
      const searchInput = page.locator('.nav-search-input');
      await searchInput.fill('NonExistentProduct');

      // Wait for filtering to take effect
      await page.waitForTimeout(100);

      // Check no results message
      const noResultsMessage = page.locator('.cards-container-list-item-empty');
      await expect(noResultsMessage).toBeVisible();
      await expect(noResultsMessage).toContainText(
        'No products found matching "NonExistentProduct"'
      );
    });

    test('should clear search and show all products', async ({ page }) => {
      // Type in search
      const searchInput = page.locator('.nav-search-input');
      await searchInput.fill('iPhone');

      // Wait for filtering
      await page.waitForTimeout(100);

      // Clear search
      await searchInput.clear();

      // Wait for all products to show
      await page.waitForTimeout(100);

      // Check all products are visible
      const productCards = page.locator('.cards-container-list li');
      await expect(productCards).toHaveCount(3);
    });

    test('should filter case-insensitively', async ({ page }) => {
      // Type in search with different cases
      const searchInput = page.locator('.nav-search-input');
      await searchInput.fill('IPHONE');

      // Wait for filtering
      await page.waitForTimeout(100);

      // Check that iPhone product is still visible
      const productCards = page.locator('.cards-container-list li');
      await expect(productCards).toHaveCount(1);
      await expect(productCards.first()).toContainText('iPhone 9');
    });
  });
});
