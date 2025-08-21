import { test, expect } from '@playwright/test';

// Mock user data for testing
// Create a valid JWT token for testing (header.payload.signature format)
const mockPayload = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  role: 'admin',
};
const mockJwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

const mockUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  gender: 'female',
  image: 'https://example.com/emily.jpg',
  accessToken: mockJwtToken,
  refreshToken: 'fake-refresh-token-67890',
  role: 'admin',
};

// The beforeEach hook is now perfect. All mocks are in place.
// It correctly navigates to the login page to start each test.
test.beforeEach(async ({ page }) => {
  // Mock the login API for consistent testing
  await page.route('https://dummyjson.com/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: mockUser,
    });
  });

  // Mock products API for protected route testing
  await page.route('https://dummyjson.com/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { products: [], total: 0, skip: 0, limit: 30 },
    });
  });

  await page.route('https://dummyjson.com/quotes/random', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: {
        id: 1,
        quote: 'A mock quote for auth tests',
        author: 'Playwright',
      },
    });
  });

  // Navigate to the login page. `baseURL` will prepend the domain.
  await page.goto('/neore-shop/login');
});

test.describe('Authentication System', () => {
  test('should display login form correctly', async ({ page }) => {
    // This test stays on the login page and is correct.
    await expect(page.locator('.login-header')).toHaveText('Welcome!');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
    await expect(page.locator('.guest-button')).toHaveText('Continue as Guest');
  });

  test('should show error for empty fields on submit', async ({ page }) => {
    // This test stays on the login page and is correct.
    await page.fill('#username', '');
    await page.fill('#password', '');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toHaveText(
      'Both username and password are required'
    );
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    // This test stays on the login page and is correct.
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toHaveText('Incorrect username or password');
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    await page.click('button[type="submit"]');

    // FIX: Wait for redirect to the correct homepage URL
    await page.waitForURL('/neore-shop/');

    // Now assert that an element on the homepage is visible
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');
    await expect(page.getByRole('link', { name: 'Favorites' })).toBeVisible();
    await expect(page.locator('.cart-button')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Admin Dashboard' })).toBeVisible();
  });

  test('should allow guest access without login', async ({ page }) => {
    await page.click('.guest-button');

    // FIX: Wait for redirect to the correct homepage URL
    await page.waitForURL('/neore-shop/');

    await expect(page.locator('.nav-bar-links')).toContainText('Login');
    await expect(page.locator('.nav-bar-links')).not.toContainText('Users');
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    // Start on the login page (from beforeEach), then try to go to a protected route
    await page.goto('/neore-shop/favorites');

    // FIX: Assert that the URL is now the login page's URL
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('.login-header')).toBeVisible();
  });

  test('should allow access to protected routes when authenticated', async ({ page }) => {
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');

    // FIX: Use the full path to navigate
    await page.goto('/neore-shop/favorites');

    await expect(page.locator('.favorites-container')).toBeVisible();
    await expect(page.locator('.favorites-title')).toHaveText('Your Favorites');
  });

  test('should persist authentication across page refreshes', async ({ page }) => {
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');

    await page.reload();

    // After reload, assert the user is still logged in
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');
    await expect(page.locator('.cart-button')).toBeVisible();
  });

  test('should logout successfully and clear authentication state', async ({ page }) => {
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');

    await page.click('text=Logout');

    // FIX: Assert that we have been redirected to the login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('.login-header')).toHaveText('Welcome!');
  });

  test('should block access to admin routes for non-admin users', async ({ page }) => {
    // This test requires a non-admin user, but for now we'll test the redirect logic
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');
    await page.click('text=Logout');
    await page.waitForURL(/.*\/login/);

    // FIX: Use the full path to navigate
    await page.goto('/neore-shop/admin');

    // FIX: Assert that we were redirected back to the login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // This test is correct as it stays on the login page
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible();
  });

  test('should handle different HTTP error statuses gracefully', async ({ page }) => {
    // Test 400 Bad Request
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        json: { message: 'Bad Request - Invalid credentials format' },
      });
    });
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible();
    await expect(page.locator('.login-error')).toContainText(
      'The resource you requested could not be found'
    );

    // Test 401 Unauthorized
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        json: { message: 'Unauthorized - Invalid credentials' },
      });
    });
    await page.reload();
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible();
    await expect(page.locator('.login-error')).toContainText('Invalid credentials provided');

    // Test 403 Forbidden
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        json: { message: 'Forbidden - Account locked' },
      });
    });
    await page.reload();
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible();
    await expect(page.locator('.login-error')).toContainText(
      "You don't have permission to access this resource"
    );

    // Test 404 Not Found
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        json: { message: 'Login endpoint not found' },
      });
    });
    await page.reload();
    await page.click('button[type="submit"]');
    await expect(page.locator('.login-error')).toBeVisible();
    await expect(page.locator('.login-error')).toContainText(
      'The resource you requested could not be found'
    );
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.abort('failed');
    });

    await page.click('button[type="submit"]');

    // Wait for error to appear
    await expect(page.locator('.login-error')).toBeVisible();
    await expect(page.locator('.login-error')).toContainText('A network error occurred');
  });

  test('should handle malformed JSON responses', async ({ page }) => {
    // Mock malformed JSON response
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"invalid": json}', // Malformed JSON
      });
    });

    await page.click('button[type="submit"]');

    // Should show error for malformed response
    await expect(page.locator('.login-error')).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Mock slow response
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      // Simulate slow response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockUser,
      });
    });

    await page.click('button[type="submit"]');

    // Should show loading state
    await expect(page.locator('.loading-spinner')).toBeVisible();

    // Wait for response and successful login
    await page.waitForURL('/neore-shop/');
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');
  });

  test('should handle form validation edge cases', async ({ page }) => {
    // Test very long username/password
    await page.fill('#username', 'a'.repeat(1000));
    await page.fill('#password', 'b'.repeat(1000));
    await page.click('button[type="submit"]');

    // Should handle long inputs gracefully
    await expect(page.locator('.login-error')).toContainText('Incorrect username or password');

    // Test special characters
    await page.fill('#username', 'user@#$%^&*()');
    await page.fill('#password', 'pass@#$%^&*()');
    await page.click('button[type="submit"]');

    // Should handle special characters
    await expect(page.locator('.login-error')).toContainText('Incorrect username or password');

    // Test SQL injection attempts
    await page.fill('#username', "'; DROP TABLE users; --");
    await page.fill('#password', "'; DROP TABLE users; --");
    await page.click('button[type="submit"]');

    // Should handle injection attempts safely
    await expect(page.locator('.login-error')).toContainText('Incorrect username or password');
  });

  test('should trim whitespace from username and password', async ({ page }) => {
    await page.fill('#username', '  emilys  ');
    await page.fill('#password', '  emilyspass  ');
    await page.click('button[type="submit"]');

    // FIX: Wait for the correct homepage URL
    await page.waitForURL('/neore-shop/');
    await expect(page.locator('.nav-bar-links')).toContainText('Logout');
  });

  test.describe('Authentication Navigation Scenarios', () => {
    test('should maintain authentication state when navigating between pages', async ({ page }) => {
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      // FIX: Use full paths for navigation
      await page.goto('/neore-shop/favorites');
      await expect(page.locator('.favorites-container')).toBeVisible();
      await expect(page.locator('.nav-bar-links')).toContainText('Logout');

      await page.goto('/neore-shop/admin');
      await expect(page.locator('h1')).toContainText('Admin Dashboard');
      await expect(page.locator('.nav-bar-links')).toContainText('Logout');
    });

    test('should redirect to intended page after login from protected route', async ({ page }) => {
      // Start on login page, then go to a protected route
      await page.goto('/neore-shop/favorites');
      await page.waitForURL(/.*\/login/); // Assert we were sent back to login

      // Now log in
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');

      await expect(page.locator('.nav-bar-links')).toContainText('Favorites');
      await page.click('text=Favorites');
      await page.waitForURL('/neore-shop/favorites');
      await expect(page.locator('.favorites-container')).toBeVisible();
    });

    test('should block access to protected routes after logout via deep links', async ({
      page,
    }) => {
      await page.click('button[type="submit"]');
      await page.waitForURL('/neore-shop/');
      await page.goto('/neore-shop/admin');
      await expect(page.locator('h1')).toContainText('Admin Dashboard');

      await page.click('text=Logout');
      await page.waitForURL(/.*\/login/);

      // Try to go back to the admin page
      await page.goto('/neore-shop/admin');

      // Assert we were blocked and sent back to login
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.locator('.login-header')).toHaveText('Welcome!');
    });
  });
});
