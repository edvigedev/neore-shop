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
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(2 items)');

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
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(4 items)');
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

  test('should toggle cart button state on product cards', async ({ page }) => {
    // Reference: HomePage component with CardsContainer and Card components
    // beforeEach already navigated to homepage after login, so we start here

    // Reference: Card component shows "+" button initially
    const firstProductCard = page.locator('.card').first();
    const cartButton = firstProductCard.locator('.card-action-btn').last();

    // Initially shows "+" button for adding to cart
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');
    await expect(cartButton.locator('svg')).toBeVisible(); // PlusIcon

    // Add product to cart
    await cartButton.click();

    // Button should now show "-" for removing from cart
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await expect(cartButton).toHaveClass(/in-cart/);

    // Verify cart count increased
    await expect(page.locator('.cart-button')).toBeVisible();

    // Remove product from cart using the same button
    await cartButton.click();

    // Button should return to "+" state
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Add to cart');
    await expect(cartButton).not.toHaveClass(/in-cart/);
  });

  test('should remove items from cart using product card toggle', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add first product to cart
    const firstProductCard = page.locator('.card').first();
    await firstProductCard.locator('.card-action-btn').last().click();

    // Add second product to cart
    const secondProductCard = page.locator('.card').nth(1);
    await secondProductCard.locator('.card-action-btn').last().click();

    // Verify both products are in cart
    await expect(page.locator('.cart-button')).toBeVisible();

    // Navigate to cart page to confirm items are there
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);
    await expect(page.locator('.cart-item')).toHaveCount(2);

    // Go back to homepage
    await page.locator('.neore-logo').click();
    await page.waitForURL('/neore-shop/');

    // Remove first product using the toggle button (should now show "-")
    const firstCardButton = page.locator('.card').first().locator('.card-action-btn').last();
    await expect(firstCardButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await firstCardButton.click();

    // Remove second product using the toggle button
    const secondCardButton = page.locator('.card').nth(1).locator('.card-action-btn').last();
    await expect(secondCardButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await secondCardButton.click();

    // Navigate back to cart to verify items were removed
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component should show empty state
    await expect(page.locator('.cart-summary-empty')).toBeVisible();
    await expect(page.locator('.cart-summary-empty h2')).toHaveText('Your cart is empty');
  });

  test('should maintain cart button state across navigation', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    // Add product to cart
    const firstProductCard = page.locator('.card').first();
    const cartButton = firstProductCard.locator('.card-action-btn').last();
    await cartButton.click();

    // Verify button shows "-" state
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await expect(cartButton).toHaveClass(/in-cart/);

    // Navigate to product details page
    await firstProductCard.click();
    await page.waitForURL(/.*\/products\/1/);

    // Reference: ProductDetails page should also show "-" button
    const productDetailsButton = page.locator('.product-action-btn').last();
    await expect(productDetailsButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await expect(productDetailsButton).toHaveClass(/in-cart/);

    // Remove product from cart using product details button
    await productDetailsButton.click();

    // Button should now show "+" state
    await expect(productDetailsButton).toHaveAttribute('data-tooltip', 'Add to cart');
    await expect(productDetailsButton).not.toHaveClass(/in-cart/);

    // Go back to homepage
    await page.goBack();
    await page.waitForURL('/neore-shop/');

    // Homepage button should also reflect the removed state
    const homeButton = page.locator('.card').first().locator('.card-action-btn').last();
    await expect(homeButton).toHaveAttribute('data-tooltip', 'Add to cart');
    await expect(homeButton).not.toHaveClass(/in-cart/);
  });

  test('should handle rapid add/remove operations', async ({ page }) => {
    // Reference: HomePage component
    // beforeEach already navigated to homepage after login, so we start here

    const firstProductCard = page.locator('.card').first();
    const cartButton = firstProductCard.locator('.card-action-btn').last();

    // Rapidly click add/remove multiple times
    await cartButton.click(); // Add
    await cartButton.click(); // Remove
    await cartButton.click(); // Add again
    await cartButton.click(); // Remove again
    await cartButton.click(); // Final add

    // Final state should be added
    await expect(cartButton).toHaveAttribute('data-tooltip', 'Remove 1 from cart');
    await expect(cartButton).toHaveClass(/in-cart/);

    // Verify in cart
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);
    await expect(page.locator('.cart-item')).toBeVisible();
    await expect(page.locator('.cart-item h3')).toHaveText('iPhone 9');
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
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(3 items)');

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

  test('should decrease cart quantities with toggle button instead of removing everything', async ({
    page,
  }) => {
    // Add first product to cart
    const firstProductCard = page.locator('.card').first();
    const firstProductButton = firstProductCard.locator('.card-action-btn').last();

    // Add product to cart (should show "+" button initially)
    await firstProductButton.click();

    // Verify button shows "-" and "in-cart" class
    await expect(firstProductButton).toHaveClass(/in-cart/);
    await expect(firstProductButton.locator('svg')).toBeVisible(); // MinusIcon should be visible

    // Navigate to cart page
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component shows correct total items
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(1 items)');

    // Reference: CartItem component shows quantity selector with value 1
    const firstCartItem = page.locator('.cart-item').first();
    const quantitySelect = firstCartItem.locator('select');
    await expect(quantitySelect).toHaveValue('1');

    // Increase quantity to 3 using the cart page selector
    await quantitySelect.selectOption('3');

    // Verify quantity increased
    await expect(quantitySelect).toHaveValue('3');
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(3 items)');

    // Go back to homepage
    await page.locator('.neore-logo').click();
    await page.waitForURL('/neore-shop/');

    // Now click the "-" button to decrease quantity by 1
    await firstProductButton.click(); // Should decrease from 3 to 2

    // Navigate back to cart to verify quantity decreased
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component should show 2 items now
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(2 items)');

    // Reference: CartItem component should show quantity 2
    await expect(firstCartItem.locator('select')).toHaveValue('2');

    // Go back to homepage again
    await page.locator('.neore-logo').click();
    await page.waitForURL('/neore-shop/');

    // Click "-" button again to decrease from 2 to 1
    await firstProductButton.click();

    // Navigate to cart to verify quantity is now 1
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component should show 1 item
    await expect(page.locator('.cart-summary-header-title')).toHaveText('(1 items)');

    // Reference: CartItem component should show quantity 1
    await expect(firstCartItem.locator('select')).toHaveValue('1');

    // Go back to homepage one more time
    await page.locator('.neore-logo').click();
    await page.waitForURL('/neore-shop/');

    // Click "-" button one final time - this should remove the item completely
    await firstProductButton.click();

    // Button should change back to "+" and lose "in-cart" class
    await expect(firstProductButton).not.toHaveClass(/in-cart/);

    // Navigate to cart to verify item is completely removed
    await page.locator('.cart-button').click();
    await page.waitForURL(/.*\/cart/);

    // Reference: CartSummary component should show empty state
    await expect(page.locator('.cart-summary-empty')).toBeVisible();
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
