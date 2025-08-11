import { test, expect } from '@playwright/test';
import type { Product } from '../src/types'; // Adjust the path to your types file

// We define mock data to have a predictable test environment.
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
  },
];

test.describe('Favorites Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Before each test, we mock the API call to ensure our tests are fast and reliable.
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: mockProducts, total: 2, skip: 0, limit: 30 },
      });
    });

    // Navigate to the homepage AFTER setting up the mock.
    await page.goto('/');
  });

  test('should add and remove a product from favorites, updating UI and local storage', async ({
    page,
  }) => {
    const productToFavorite = mockProducts[0]; // We'll test with the iPhone 9
    const FAVORITES_KEY = 'neoreShopFavorites'; // Use the actual key from your useFavorites hook

    // --- 1. ADD TO FAVORITES ---

    // Find the specific card for the iPhone 9.
    const productCard = page.locator('.card', { hasText: productToFavorite.title });

    // Find the favorite button within that card. It should initially be in the "add" state.
    const favoriteButton = productCard.locator('.favorite-btn');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveText('🤍');

    // Click the button to add it to favorites.
    await favoriteButton.click();

    // --- 2. VERIFY IT WAS ADDED ---

    // The button's appearance and label should immediately change.
    await expect(favoriteButton).toHaveText('💜');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');

    // Verify that the product was correctly saved to local storage.
    const lsDataAfterAdd = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      FAVORITES_KEY
    );
    const favoritesInStorage = JSON.parse(lsDataAfterAdd!);
    expect(favoritesInStorage).toEqual([productToFavorite]);

    // --- 3. REMOVE FROM FAVORITES ---

    // Click the same button again to remove it from favorites.
    await favoriteButton.click();

    // --- 4. VERIFY IT WAS REMOVED ---

    // The button should revert to its original state.
    await expect(favoriteButton).toHaveText('🤍');
    await expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorites');

    // Verify that local storage is now an empty array.
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
    const productToFavorite = mockProducts[0]; // iPhone 9

    // --- 1. ADD TO FAVORITES FROM HOMEPAGE ---
    const productCard = page.locator('.card', { hasText: productToFavorite.title });
    const favoriteButton = productCard.locator('.favorite-btn');
    await favoriteButton.click();

    // --- 2. NAVIGATE TO FAVORITES PAGE ---
    await page.goto('/favorites');

    // --- 3. VERIFY PRODUCT APPEARS ON FAVORITES PAGE ---
    const favoritesPage = page.locator('.favorites-page');
    await expect(favoritesPage).toBeVisible();

    const favoritesTitle = page.locator('.favorites-page h1');
    await expect(favoritesTitle).toHaveText('My Favorites (1)');

    const favoritedProduct = page.locator('.card', { hasText: productToFavorite.title });
    await expect(favoritedProduct).toBeVisible();

    // --- 4. REMOVE FROM FAVORITES ON FAVORITES PAGE ---
    const removeButton = favoritedProduct.locator('.favorite-btn');
    await expect(removeButton).toHaveText('💜');
    await removeButton.click();

    // --- 5. VERIFY PRODUCT DISAPPEARS ---
    await expect(favoritedProduct).not.toBeVisible();

    // --- 6. VERIFY EMPTY STATE ---
    const emptyState = page.locator('.favorites-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText('No favorites yet');
  });
});
