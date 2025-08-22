import { test, expect } from '@playwright/test';
import type { Product } from '../src/types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    thumbnail: '...',
    images: ['...'],
    category: 'smartphones',
    stock: 1,
  },
  {
    id: 2,
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology',
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    thumbnail: '...',
    images: ['...'],
    category: 'smartphones',
    stock: 5,
  },
];

test.describe('Favorites Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: mockProducts, total: 2, skip: 0, limit: 30 },
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
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          id: 1,
          username: 'emilys',
          email: 'emily@example.com',
          firstName: 'Emily',
          lastName: 'Smith',
          accessToken: mockJwtToken,
          refreshToken: 'fake-refresh-token',
          role: 'admin',
        },
      });
    });

    await page.goto('/neore-shop/login');
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');

    await page.waitForURL('/neore-shop/');
  });

  test('should add and remove a product from favorites, updating UI and local storage', async ({
    page,
  }) => {
    const productToFavorite = mockProducts[0];
    const FAVORITES_KEY = 'neoreShopFavorites';

    // --- 1. ADD TO FAVORITES ---
    const productCard = page.locator('.card', { hasText: productToFavorite.title });

    // Use favorite button
    const favoriteButton = productCard.locator('.card-action-btn').first();
    await expect(favoriteButton).toBeVisible();

    // Check initial state (not favorited)
    await expect(favoriteButton).not.toHaveClass(/favorited/);

    // Click to add to favorites
    await favoriteButton.click();

    // --- 2. VERIFY IT WAS ADDED ---

    // Button should now have favorited class
    await expect(favoriteButton).toHaveClass(/favorited/);

    // Check tooltip text
    await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Remove from favorites');

    // Verify localStorage
    const lsDataAfterAdd = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      FAVORITES_KEY
    );
    const favoritesInStorage = JSON.parse(lsDataAfterAdd!);
    expect(favoritesInStorage).toEqual([productToFavorite]);

    // --- 3. REMOVE FROM FAVORITES ---
    await favoriteButton.click();

    // --- 4. VERIFY IT WAS REMOVED ---

    // Button should no longer have favorited class
    await expect(favoriteButton).not.toHaveClass(/favorited/);

    // Check tooltip text
    await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');

    // Verify localStorage is empty
    const lsDataAfterRemove = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      FAVORITES_KEY
    );
    const favoritesAfterRemove = JSON.parse(lsDataAfterRemove!);
    expect(favoritesAfterRemove).toEqual([]);
  });

  test('should display favorited products on favorites page and remove them when unfavorited', async ({
    page,
  }) => {
    const productToFavorite = mockProducts[0];

    // --- 1. ADD TO FAVORITES FROM HOMEPAGE ---
    const productCard = page.locator('.card', { hasText: productToFavorite.title });
    const favoriteButton = productCard.locator('.card-action-btn').first();
    await favoriteButton.click();

    // --- 2. NAVIGATE TO FAVORITES PAGE ---
    await page.goto('/neore-shop/favorites');

    // --- 3. VERIFY PRODUCT APPEARS ON FAVORITES PAGE ---
    const favoritesContainer = page.locator('.favorites-container');
    await expect(favoritesContainer).toBeVisible();

    const favoritesTitle = page.locator('.favorites-title');
    await expect(favoritesTitle).toHaveText('Your Favorites');

    const favoritedProduct = page.locator('.card', { hasText: productToFavorite.title });
    await expect(favoritedProduct).toBeVisible();

    // --- 4. REMOVE FROM FAVORITES ON FAVORITES PAGE ---
    const removeButton = favoritedProduct.locator('.card-action-btn').first();

    // Should be favorited initially
    await expect(removeButton).toHaveClass(/favorited/);

    await removeButton.click();

    // --- 5. VERIFY PRODUCT DISAPPEARS ---
    await expect(favoritedProduct).not.toBeVisible();

    // --- 6. VERIFY EMPTY STATE ---
    const emptyState = page.locator('p');
    await expect(emptyState).toHaveText('You have not added any favorite yet');
  });
});

test.describe('Favorites Navigation Flow', () => {
  test('should navigate from homepage to favorites page', async ({ page }) => {
    // Login first
    await page.goto('/neore-shop/login');
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');

    // Navigate to favorites page
    await page.goto('/neore-shop/favorites');

    // Should be on favorites page
    await expect(page).toHaveURL(/.*\/favorites/);
    await expect(page.locator('.favorites-title')).toHaveText('Your Favorites');
  });

  test('should navigate back to homepage from favorites', async ({ page }) => {
    // Login first
    await page.goto('/neore-shop/login');
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');

    // Go to favorites
    await page.goto('/neore-shop/favorites');
    await expect(page).toHaveURL(/.*\/favorites/);

    // Navigate back to homepage using navbar logo
    await page.locator('[data-testid="navbar-logo-link"]').click();
    await expect(page).toHaveURL(/.*\/neore-shop\/?$/);
  });

  test('should handle browser back/forward navigation between homepage and favorites', async ({
    page,
  }) => {
    // Login first
    await page.goto('/neore-shop/login');
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');

    // Navigate to favorites
    await page.goto('/neore-shop/favorites');
    await expect(page).toHaveURL(/.*\/favorites/);

    // Go back to homepage
    await page.goBack();
    await expect(page).toHaveURL(/.*\/neore-shop\/?$/);

    // Go forward to favorites
    await page.goForward();
    await expect(page).toHaveURL(/.*\/favorites/);
  });
});
