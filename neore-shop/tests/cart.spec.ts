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
    thumbnail: 'https://example.com/iphone9.jpg',
    images: ['https://example.com/iphone9.jpg'],
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
    thumbnail: 'https://example.com/iphonex.jpg',
    images: ['https://example.com/iphonex.jpg'],
    category: 'smartphones',
    stock: 5,
  },
  {
    id: 3,
    title: 'Samsung Galaxy',
    description: 'Latest Samsung smartphone with advanced features',
    price: 699,
    discountPercentage: 8.5,
    rating: 4.2,
    thumbnail: 'https://example.com/samsung.jpg',
    images: ['https://example.com/samsung.jpg'],
    category: 'smartphones',
    stock: 3,
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

test.describe('Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for consistent testing
    // Reference: CardsContainer component makes this call
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: mockProducts, total: 3, skip: 0, limit: 30 },
      });
    });

    // Reference: AsideHomePage component makes this call
    await page.route('https://dummyjson.com/quotes/random', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          id: 1,
          quote: 'Test quote for cart tests',
          author: 'Test Author',
        },
      });
    });

    // Reference: Login component makes this call
    await page.route('https://dummyjson.com/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockUser,
      });
    });

    // Login first since cart functionality requires authentication
    await page.goto('/neore-shop/login');
    await page.click('button[type="submit"]');
    await page.waitForURL('/neore-shop/');
  });

  test('should add items to cart from product cards', async ({ page }) => {
    // Reference: HomePage component with CardsContainer and Card components
    // beforeEach already navigated to homepage after login, so we start here

    // Reference: Card component uses .card class and .card-action-btn for cart button
    const firstProductCard = page.locator('.card').first();
    await expect(firstProductCard).toBeVisible();

    // Reference: Card component has cart button with PlusIcon and "Add to cart" tooltip
    const cartButton = firstProductCard.locator('.card-action-btn').last();
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');

    // Add first product to cart
    await cartButton.click();

    // Reference: NavBar component shows cart button with cart count
    // Check that cart button is visible (indicating item was added)
    await expect(page.locator('.cart-button')).toBeVisible();

    // Navigate to cart page to verify item was added
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: Cart page uses .cart-page-container and h1 with "My Cart" text
    await expect(page.locator('.cart-page-container h1')).toHaveText('My Cart');

    // Reference: CartSummary component shows cart items in .cart-items-list
    await expect(page.locator('.cart-items-list')).toBeVisible();

    // Reference: CartItem component displays product title in h3
    const firstCartItem = page.locator('.cart-item').first();
    await expect(firstCartItem.locator('h3')).toHaveText('iPhone 9');
  });

  test('should add multiple items to cart and update quantities', async ({ page }) => {
    // Reference: HomePage component with product cards
    // beforeEach already navigated to homepage after login, so we start here

    // Add first product to cart
    const firstProductCard = page.locator('.card').first();
    await firstProductCard.locator('.card-action-btn').last().click();

    // Add second product to cart
    const secondProductCard = page.locator('.card').nth(1);
    await secondProductCard.locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component shows total quantity in header
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(2 items)');

    // Reference: CartItem component shows quantity selector with options 1-10
    const firstCartItem = page.locator('.cart-item').first();
    const quantitySelect = firstCartItem.locator('select');
    await expect(quantitySelect).toBeVisible();

    // Update quantity of first item
    await quantitySelect.selectOption('3');

    // Reference: CartItem component shows updated total price for the item
    const itemTotal = firstCartItem.locator('.cart-item-total span');
    await expect(itemTotal).toBeVisible();

    // Reference: CartSummary component shows updated total quantity
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(4 items)');
  });

  test('should remove items from cart', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add product to cart
    await page.locator('.card').first().locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartItem component has remove button with × symbol and .remove-item-btn class
    const removeButton = page.locator('.remove-item-btn');
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText('×');

    // Remove the item
    await removeButton.click();

    // Reference: CartSummary component shows empty state when no items
    await expect(page.locator('.cart-summary-empty')).toBeVisible();
    await expect(page.locator('.cart-summary-empty h2')).toHaveText('Your cart is empty');
    await expect(page.locator('.cart-summary-empty p')).toHaveText(
      'Add some products to get started!'
    );
  });

  test('should clear entire cart', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add multiple products to cart
    await page.locator('.card').first().locator('.card-action-btn').last().click();
    await page.locator('.card').nth(1).locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component shows clear cart button with .clear-cart-btn class
    const clearCartButton = page.locator('.clear-cart-btn');
    await expect(clearCartButton).toBeVisible();
    await expect(clearCartButton).toHaveText('Clear Cart');

    // Clear the cart
    await clearCartButton.click();

    // Reference: CartSummary component shows empty state
    await expect(page.locator('.cart-summary-empty')).toBeVisible();
    await expect(page.locator('.cart-summary-empty h2')).toHaveText('Your cart is empty');
  });

  test('should calculate cart totals correctly with discounts', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add first product to cart (iPhone 9: €549 with 12.96% discount)
    await page.locator('.card').first().locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartItem component shows original and discounted prices
    const firstCartItem = page.locator('.cart-item').first();
    await expect(firstCartItem.locator('.cart-item-original-price')).toHaveText('€549');
    await expect(firstCartItem.locator('.cart-item-discounted-price')).toContainText('Now €');
    await expect(firstCartItem.locator('#cart-item-discount-badge')).toContainText('-13% off!');

    // Reference: CartItem component shows item total
    const itemTotal = firstCartItem.locator('.cart-item-total span');
    await expect(itemTotal).toBeVisible();

    // Reference: CartSummary component shows cart total in footer
    const cartTotal = page.locator('.cart-total .total-price');
    await expect(cartTotal).toBeVisible();

    // Verify the total calculation (€549 * (1 - 0.1296) = €477.85)
    const expectedTotal = (549 * (1 - 12.96 / 100)).toFixed(2);
    await expect(cartTotal).toContainText(`€${expectedTotal}`);
  });

  test('should enforce quantity limits per product', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add product to cart
    await page.locator('.card').first().locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartItem component shows quantity selector with options 1-10
    const quantitySelect = page.locator('select').first();
    await expect(quantitySelect).toBeVisible();

    // Verify quantity options are limited to 1-10
    const options = await quantitySelect.locator('option').all();
    expect(options.length).toBe(10);

    // Try to set quantity to maximum (10)
    await quantitySelect.selectOption('10');

    // Reference: CartSummary component shows updated total quantity
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(10 items)');

    // Go back to homepage and try to add more of the same product
    // Use the cart button to navigate back instead of direct page.goto
    await page.locator('.neore-logo').click();
    await page.waitForURL('/neore-shop/');

    // Add more of the same product (should be capped at 10)
    await page.locator('.card').first().locator('.card-action-btn').last().click();

    // Navigate back to cart to verify quantity is still capped at 10
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component should still show 10 items (not 11)
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(10 items)');
  });

  test('should persist cart data across page refreshes', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add product to cart
    await page.locator('.card').first().locator('.card-action-btn').last().click();

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component shows the item
    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(1 items)');

    // Refresh the page - use a more reliable approach
    await page.evaluate(() => window.location.reload());
    await page.waitForSelector('.cart-item', { timeout: 10000 });

    // Reference: CartSummary component should still show the item after refresh
    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(1 items)');

    // Reference: CartItem component should show correct product details
    await expect(page.locator('.cart-item h3')).toHaveText('iPhone 9');
  });

  test('should handle cart operations with multiple product types', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add different products to cart
    await page.locator('.card').first().locator('.card-action-btn').last().click(); // iPhone 9
    await page.locator('.card').nth(1).locator('.card-action-btn').last().click(); // iPhone X
    await page.locator('.card').nth(2).locator('.card-action-btn').last().click(); // Samsung Galaxy

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component shows correct total items
    await expect(page.locator('.cart-summary-header h3')).toHaveText('(3 items)');

    // Reference: CartItem components show all three products
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(3);

    // Verify each product is displayed correctly
    await expect(cartItems.nth(0).locator('h3')).toHaveText('iPhone 9');
    await expect(cartItems.nth(1).locator('h3')).toHaveText('iPhone X');
    await expect(cartItems.nth(2).locator('h3')).toHaveText('Samsung Galaxy');

    // Reference: CartSummary component shows checkout button
    const checkoutButton = page.locator('.checkout-btn');
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toHaveText('Proceed to Checkout');
  });

  test('should display empty cart state correctly', async ({ page }) => {
    // Navigate directly to cart page (should be empty after login)
    await page.goto('/neore-shop/cart');

    // Reference: CartSummary component shows empty state when no items
    await expect(page.locator('.cart-summary-empty')).toBeVisible();
    await expect(page.locator('.cart-summary-empty h2')).toHaveText('Your cart is empty');
    await expect(page.locator('.cart-summary-empty p')).toHaveText(
      'Add some products to get started!'
    );

    // Reference: Cart page shows correct title
    await expect(page.locator('.cart-page-container h1')).toHaveText('My Cart');
  });
});
