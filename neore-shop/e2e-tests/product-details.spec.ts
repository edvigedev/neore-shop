import { test, expect } from '@playwright/test';
import type { Product } from '../src/types';

// Mock data for testing based on the actual component interfaces
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    thumbnail: 'https://picsum.photos/200/200?random=1',
    images: ['https://picsum.photos/400/400?random=1'],
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
    thumbnail: 'https://picsum.photos/200/200?random=2',
    images: ['https://picsum.photos/400/400?random=2'],
    category: 'smartphones',
    stock: 5,
  },
];

const mockProduct: Product = mockProducts[0];

const mockPayload = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  role: 'admin',
};
// FIX 1: Use Node.js's Buffer for Base64 encoding
const mockJwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;
const mockUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Smith',
  accessToken: mockJwtToken,
  refreshToken: 'fake-refresh-token',
  role: 'admin',
};

test.describe('Product Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for consistent testing
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', json: mockProduct });
    });

    // FIX 2: ADD THE MISSING MOCK FOR THE HOMEPAGE
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: mockProducts, total: 2, skip: 0, limit: 30 },
      });
    });

    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', json: mockUser });
    });

    await page.route('https://dummyjson.com/quotes/random', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { id: 1, quote: 'Test quote', author: 'Test Author' },
      });
    });

    // Login first and wait for the homepage to load successfully
    await page.goto('/neore-shop/login');
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');
  });

  test('should display product details correctly', async ({ page }) => {
    // Navigate to product details page
    await page.locator('[data-testid="card-link-1"]').click();
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="product-details-page-title"]')).toHaveText('iPhone 9');

    await expect(page.locator('[data-testid="product-details-description"]')).toHaveText(
      'An apple mobile which is nothing like apple'
    );

    const productImage = page.locator('[data-testid="product-details-image"]');
    await expect(productImage).toHaveAttribute('src', 'https://picsum.photos/400/400?random=1');
    await expect(productImage).toHaveAttribute('alt', 'iPhone 9');
  });

  test('should display product pricing information correctly', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="product-details-initial-price"]')).toHaveText('€549');
    await expect(page.locator('[data-testid="product-details-initial-price"]')).toHaveClass(/.*/);

    await expect(page.locator('[data-testid="product-details-discount-percentage"]')).toContainText(
      '-13%'
    );

    const expectedDiscountedPrice = (549 * (1 - 12.96 / 100)).toFixed(2);
    await expect(page.locator('[data-testid="product-details-discounted-price"]')).toContainText(
      `€${expectedDiscountedPrice}`
    );
  });

  test('should display product rating correctly', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    // Reference: ProductDetails component shows rating section
    await expect(page.locator('[data-testid="product-details-rating-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-details-rating-title"]')).toHaveText('Rating');

    // Reference: ProductDetails component shows star rating (4.69 rounded to 4.5 = ★★★★☆)
    await expect(page.locator('[data-testid="product-details-rating-stars"]')).toHaveText('★★★★☆');
  });

  test('should display action buttons correctly', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    // Reference: ProductDetails component shows action buttons container
    await expect(page.locator('[data-testid="product-details-buttons-container"]')).toBeVisible();

    // Reference: ProductDetails component shows favorite button
    const favoriteButton = page.locator('[data-testid="product-details-favorite-button"]');
    await expect(favoriteButton).toBeVisible();
    await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');

    // Reference: ProductDetails component shows add to cart button
    const cartButton = page.locator('[data-testid="product-action-btn"]');
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');
  });

  test('should handle favorite button interactions correctly', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    // Reference: ProductDetails component shows favorite button
    const favoriteButton = page.locator('[data-testid="product-details-favorite-button"]');
    await expect(favoriteButton).toBeVisible();

    // Click favorite button to add to favorites
    await favoriteButton.click();

    // Reference: ProductDetails component updates button state when favorited
    await expect(favoriteButton).toHaveClass(/favorited/);
    await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Remove from favorites');

    // Click again to remove from favorites
    await favoriteButton.click();

    // Reference: ProductDetails component updates button state when unfavorited
    await expect(favoriteButton).not.toHaveClass(/favorited/);
    await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');
  });

  test('should handle add to cart functionality correctly', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    const cartButton = page.locator('[data-testid="product-action-btn"]');
    await expect(cartButton).toBeVisible();

    // Click add to cart button
    await cartButton.click();

    await expect(page.locator('[data-testid="navbar-cart-button"]')).toBeVisible();

    // Navigate to cart page to verify item was added
    await page.locator('[data-testid="navbar-cart-button"]').click();
    await page.waitForURL(/.*\/cart/);

    await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-title-1"]')).toHaveText('iPhone 9');
  });

  test('should handle loading state correctly', async ({ page }) => {
    // Mock a slow API response to test loading state
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockProduct,
      });
    });

    // Navigate to product details page
    await page.goto('/neore-shop/products/1');

    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

    // Wait for loading to complete
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="product-details-page-title"]')).toHaveText('iPhone 9');
  });

  test('should handle error state correctly', async ({ page }) => {
    // Mock an API error
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        json: { message: 'Product not found' },
      });
    });

    // Navigate to product details page
    await page.goto('/neore-shop/products/1');
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="fetching-error"]')).toBeVisible();
  });

  test('should handle invalid product ID gracefully', async ({ page }) => {
    // Mock an API error for invalid product ID
    await page.route('https://dummyjson.com/products/999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        json: { message: 'Product not found' },
      });
    });

    // Navigate to invalid product details page
    await page.goto('/neore-shop/products/999');
    await page.waitForURL('/neore-shop/products/999');

    await expect(page.locator('[data-testid="fetching-error"]')).toBeVisible();
  });

  test('should handle different error scenarios gracefully', async ({ page }) => {
    // Test 1: Server error (500)
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        json: { message: 'Internal server error' },
      });
    });

    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="fetching-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="fetching-error-title"]')).toHaveText(
      'Oops! Something went wrong'
    );
    await expect(page.locator('[data-testid="fetching-error-message"]')).toHaveText(
      "We couldn't load the data. Please try again."
    );

    // Test 3: Malformed JSON response
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"invalid": json}', // Malformed JSON
      });
    });

    // Reload the page to trigger the new mock
    await page.reload();
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="fetching-error"]')).toBeVisible();

    // Test 4: Empty response
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {},
      });
    });

    // Reload the page to trigger the new mock
    await page.reload();
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="fetching-error-title"]')).toBeVisible();

    // Test 5: Retry functionality
    // Mock successful response for retry
    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockProduct,
      });
    });

    // Click retry button
    await page.click('[data-testid="fetching-error-retry-button"]');
    await page.waitForURL('/neore-shop/products/1');
    await page.waitForLoadState('networkidle');

    // Reference: ProductDetails component should load successfully after retry
    await expect(page.locator('[data-testid="product-details-page-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-details-page-title"]')).toHaveText('iPhone 9');

    // Wait for image to load and be visible
    const image = page.locator('[data-testid="product-details-image"]');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', 'https://picsum.photos/400/400?random=1');
  });

  test('should maintain favorite state across navigation', async ({ page }) => {
    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    // Add product to favorites
    const favoriteButton = page.locator('[data-testid="product-details-favorite-button"]');
    await favoriteButton.click();
    await expect(favoriteButton).toHaveClass(/favorited/);

    // Navigate to favorites page
    await page.click('text=Favorites');
    await page.waitForURL('/neore-shop/favorites');

    await expect(page.locator('[data-testid="favorites-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-title-1"]')).toHaveText('iPhone 9');

    // Navigate back to product details
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    // Reference: ProductDetails component should maintain favorite state
    await expect(favoriteButton).toHaveClass(/favorited/);
  });

  test('should handle product with maximum rating correctly', async ({ page }) => {
    // Mock product with maximum rating
    const productMaxRating = { ...mockProduct, rating: 5.0 };

    await page.route('https://dummyjson.com/products/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: productMaxRating,
      });
    });

    // Navigate to product details page
    await page.click('text=iPhone 9');
    await page.waitForURL('/neore-shop/products/1');

    await expect(page.locator('[data-testid="product-details-rating-stars"]')).toHaveText('★★★★★');
  });
});
