import { test, expect } from '@playwright/test';

test.describe('Card Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API to return consistent test data
    await page.route('**/dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          products: [
            {
              id: 1,
              title: 'Test iPhone',
              description: 'A test iPhone product',
              price: 100,
              discountPercentage: 20,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'smartphones',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            {
              id: 2,
              title: 'Test Laptop',
              description: 'A test laptop product',
              price: 500,
              discountPercentage: 0,
              rating: 4.0,
              stock: 25,
              brand: 'Test Brand',
              category: 'laptops',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
          ],
        }),
      });
    });

    // Mock auth context to simulate logged-in user
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));
    });
  });

  test.describe('Rendering', () => {
    test('should render product information correctly', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.goto('/');

      // Wait for products to load
      await page.waitForSelector('[data-testid="card-1"]');

      // Check first card
      const firstCard = page.locator('[data-testid="card-title-1"]').first();
      await expect(firstCard).toHaveText('Test iPhone');

      // Check price information
      await expect(page.locator('[data-testid="card-initial-price"]').first()).toHaveText('€100');
      await expect(page.locator('[data-testid="card-discount-percentage"]').first()).toHaveText(
        '-20%'
      );
      await expect(page.locator('[data-testid="card-discounted-price"]').first()).toHaveText(
        '€80.00'
      );

      // Check category
      await expect(page.locator('[data-testid="card-category"]').first()).toHaveText('smartphones');

      // Check image
      const image = page.locator('[data-testid="card-image"]').first();
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', 'Test iPhone');
    });

    test('should render favorite and cart buttons when authenticated', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-favorite-button-1"]');

      const favoriteButton = page.locator('[data-testid="card-favorite-button-1"]').first();
      const cartButton = page.locator('[data-testid="card-cart-button-1"]').first();

      await expect(favoriteButton).toBeVisible();
      await expect(cartButton).toBeVisible();
    });

    test('should render as a link to product details', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-link-1"]');

      const cardLink = page.locator('[data-testid="card-link-1"]').first();
      await expect(cardLink).toHaveAttribute('href', '/neore-shop/products/1');
    });

    test('should handle products without discount', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-2"]');

      // Find the laptop card (no discount)
      const laptopCard = page
        .locator('[data-testid="card-title-2"]')
        .filter({ hasText: 'Test Laptop' });
      const cardContainer = laptopCard.locator('xpath=ancestor::div[contains(@class, "card")]');

      // Should not show discount percentage when there's no discount
      await expect(
        cardContainer.locator('[data-testid="card-discount-percentage"]')
      ).not.toBeVisible();

      // Should show original price as discounted price
      await expect(cardContainer.locator('[data-testid="card-discounted-price"]')).toHaveText(
        '€500.00'
      );
    });
  });

  test.describe('Favorite functionality', () => {
    test('should add product to favorites when favorite button is clicked', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-favorite-button-1"]');

      const favoriteButton = page.locator('[data-testid="card-favorite-button-1"]').first();

      // Check initial state
      await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');

      // Click favorite button
      await favoriteButton.click();

      // Wait for state change
      await page.waitForTimeout(100);

      // Check that button state changed
      await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Remove from favorites');
    });

    test('should remove product from favorites when favorite button is clicked again', async ({
      page,
    }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-favorite-button-1"]');

      const favoriteButton = page.locator('[data-testid="card-favorite-button-1"]').first();

      // First click to add to favorites
      await favoriteButton.click();
      await page.waitForTimeout(100);

      // Second click to remove from favorites
      await favoriteButton.click();
      await page.waitForTimeout(100);

      // Check that button state changed back
      await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');
    });

    test('should show correct tooltip based on favorite status', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-favorite-button-1"]');

      const favoriteButton = page.locator('[data-testid="card-favorite-button-1"]').first();

      // Initial state
      await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Add to favorites');

      // After clicking
      await favoriteButton.click();
      await page.waitForTimeout(100);
      await expect(favoriteButton).toHaveAttribute('data-tooltip', 'Remove from favorites');
    });
  });

  test.describe('Cart functionality', () => {
    test('should add product to cart when cart button is clicked', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-cart-button-1"]');

      const cartButton = page.locator('[data-testid="card-cart-button-1"]').first();

      // Check initial state
      await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');

      // Click cart button
      await cartButton.click();

      // Wait for state change
      await page.waitForTimeout(100);

      // Check that button state changed
      await expect(cartButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    });

    test('should remove product from cart when cart button is clicked again', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-cart-button-1"]');

      const cartButton = page.locator('[data-testid="card-cart-button-1"]').first();

      // First click to add to cart
      await cartButton.click();
      await page.waitForTimeout(100);

      // Second click to remove from cart
      await cartButton.click();
      await page.waitForTimeout(100);

      // Check that button state changed back
      await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');
    });

    test('should show correct tooltip based on cart status', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-cart-button-1"]');

      const cartButton = page.locator('[data-testid="card-cart-button-1"]').first();

      // Initial state
      await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');

      // After clicking
      await cartButton.click();
      await page.waitForTimeout(100);
      await expect(cartButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    });
  });

  test.describe('Price calculations', () => {
    test('should calculate discounted price correctly', async ({ page }) => {
      await page.goto('/');

      await page.waitForSelector('[data-testid="card-discounted-price"]');

      const discountedPrice = page.locator('[data-testid="card-discounted-price"]').first();
      await expect(discountedPrice).toHaveText('€80.00');
    });

    test('should handle products with comma in price', async ({ page }) => {
      // Mock a product with comma price
      await page.route('**/dummyjson.com/products', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            products: [
              {
                id: 1,
                title: 'Test Product',
                description: 'A test product',
                price: '100,50',
                discountPercentage: 20,
                rating: 4.5,
                stock: 50,
                brand: 'Test Brand',
                category: 'test',
                thumbnail: 'https://via.placeholder.com/150',
                images: ['https://via.placeholder.com/150'],
              },
            ],
          }),
        });
      });

      await page.goto('/');

      await page.waitForSelector('[data-testid="card-initial-price"]');

      const price = page.locator('[data-testid="card-initial-price"]').first();
      await expect(price).toHaveText('€100,50');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to product details when card is clicked', async ({ page }) => {
      await page.goto('/neore-shop/');

      await page.waitForSelector('[data-testid="card-title-1"]');

      const cardTitle = page.locator('[data-testid="card-title-1"]').first();
      await cardTitle.click();

      // Should navigate to product details page
      await expect(page).toHaveURL(/\/products\/\d+/);
    });

    test('should prevent navigation when buttons are clicked', async ({ page }) => {
      await page.goto('/neore-shop/');

      await page.waitForSelector('[data-testid="card-favorite-button-1"]');

      const favoriteButton = page.locator('[data-testid="card-favorite-button-1"]').first();
      const cartButton = page.locator('[data-testid="card-cart-button-1"]').first();

      // Click buttons
      await favoriteButton.click();
      await cartButton.click();

      // Should still be on the same page
      await expect(page).toHaveURL('/neore-shop/');
    });
  });

  test.describe('Edge cases', () => {
    test('should handle missing product data gracefully', async ({ page }) => {
      // Mock incomplete product data
      await page.route('**/dummyjson.com/products', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            products: [
              {
                id: 1,
                title: '',
                description: '',
                price: 0,
                discountPercentage: undefined,
                rating: undefined,
                stock: 0,
                brand: '',
                category: '',
                thumbnail: '',
                images: [],
              },
            ],
          }),
        });
      });

      await page.goto('/neore-shop/');

      // Should not crash and should render something
      await page.waitForSelector('[data-testid="card-1"]');

      const card = page.locator('[data-testid="card-1"]').first();
      await expect(card).toBeVisible();
    });
  });
});
