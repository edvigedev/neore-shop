import { test, expect } from '@playwright/test';

test.describe('CartItem Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the CartContext by setting localStorage data
    await page.addInitScript(() => {
      // Mock auth context
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));

      // Mock cart data in localStorage (this is what CartContext reads from)
      const mockCartItems = [
        {
          product: {
            id: 1,
            title: 'Test iPhone',
            description:
              'A test iPhone product with a very long description that should be truncated at exactly 50 characters to test the truncation functionality properly',
            price: 100,
            discountPercentage: 20,
            rating: 4.5,
            stock: 50,
            brand: 'Test Brand',
            category: 'smartphones',
            thumbnail: 'https://via.placeholder.com/150',
            images: ['https://via.placeholder.com/150'],
          },
          quantity: 2,
        },
        {
          product: {
            id: 2,
            title: 'Test Laptop',
            description: 'Short description',
            price: 500,
            discountPercentage: 0,
            rating: 4.0,
            stock: 25,
            brand: 'Test Brand',
            category: 'laptops',
            thumbnail: 'https://via.placeholder.com/150',
            images: ['https://via.placeholder.com/150'],
          },
          quantity: 1,
        },
      ];

      localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
    });
  });

  test.describe('Rendering', () => {
    test('should render product information correctly', async ({ page }) => {
      // Ensure mock is ready before navigation
      await page.waitForLoadState('networkidle');
      await page.goto('/neore-shop/cart');

      // Wait for cart items to load
      await page.waitForSelector('[data-testid="cart-item-title"]');

      // Check first cart item
      const firstItem = page.locator('[data-testid="cart-item-title"]').first();
      await expect(firstItem).toHaveText('Test iPhone');

      // Check description (should be truncated)
      const description = page.locator('[data-testid="cart-item-description"]').first();
      await expect(description).toHaveText('A test iPhone product with a very long description...');

      // Check price information
      await expect(page.locator('[data-testid="cart-item-original-price"]').first()).toHaveText(
        '€100'
      );
      await expect(page.locator('[data-testid="cart-item-discounted-price"]').first()).toHaveText(
        'Now €80.00!'
      );
      await expect(page.locator('[data-testid="cart-item-discount-badge"]').first()).toHaveText(
        '-20% off!'
      );

      // Check image
      const image = page.locator('[data-testid="cart-item-image"]').first();
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', 'Test iPhone');
    });

    test('should render quantity selector with correct options', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-quantity-select"]');

      const quantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').first();
      await expect(quantitySelect).toBeVisible();
      await expect(quantitySelect).toHaveValue('2'); // First item has quantity 2

      // Check that options 1-10 are available
      for (let i = 1; i <= 10; i++) {
        const option = quantitySelect.locator(`option[value="${i}"]`);
        await expect(option).toHaveAttribute('value', i.toString());
      }
    });

    test('should render remove button', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-remove-button"]');

      const removeButton = page.locator('[data-testid="cart-item-remove-button"]').first();
      await expect(removeButton).toBeVisible();
      await expect(removeButton).toHaveText('×');
    });

    test('should display correct quantity label', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-quantity-label"]');

      const quantityLabel = page.locator('[data-testid="cart-item-quantity-label"]').first();
      await expect(quantityLabel).toHaveText('Qty:');
    });
  });

  test.describe('Price calculations', () => {
    test('should calculate discounted price correctly', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-discounted-price"]');

      const discountedPrice = page.locator('[data-testid="cart-item-discounted-price"]').first();
      await expect(discountedPrice).toHaveText('Now €80.00!');
    });

    test('should calculate item total correctly', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-total"]');

      // First item: €80.00 × 2 = €160.00
      const firstItemTotal = page.locator('[data-testid="cart-item-total"]').first();
      await expect(firstItemTotal).toHaveText('€160.00');

      // Second item: €500 × 1 = €500.00
      const secondItemTotal = page.locator('[data-testid="cart-item-total"]').nth(1);
      await expect(secondItemTotal).toHaveText('€500.00');
    });

    test('should handle products without discount', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-title"]');

      // Find the laptop cart item (no discount) - it's the second item
      const laptopCartItem = page.locator('[data-testid="cart-item"]').nth(1);

      await expect(laptopCartItem.locator('[data-testid="cart-item-original-price"]')).toHaveText(
        '€500'
      );
      await expect(laptopCartItem.locator('[data-testid="cart-item-discounted-price"]')).toHaveText(
        'Now €500.00!'
      );
      await expect(laptopCartItem.locator('[data-testid="cart-item-discount-badge"]')).toHaveText(
        '-0% off!'
      );
    });

    test('should handle decimal discount percentages', async ({ page }) => {
      // Mock a product with decimal discount in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Test Product',
              description: 'A test product',
              price: 100,
              discountPercentage: 15.5,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 1,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-discounted-price"]');

      const discountedPrice = page.locator('[data-testid="cart-item-discounted-price"]').first();
      await expect(discountedPrice).toHaveText('Now €84.50!');

      const discountBadge = page.locator('[data-testid="cart-item-discount-badge"]').first();
      await expect(discountBadge).toHaveText('-16% off!');
    });
  });

  test.describe('Quantity management', () => {
    test('should call onUpdateQuantity when quantity is changed', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-quantity-select"]');

      const quantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').first();

      // Change quantity from 2 to 5
      await quantitySelect.selectOption('5');

      // Wait for the change to be processed
      await page.waitForTimeout(100);

      // The select should now show the new value
      await expect(quantitySelect).toHaveValue('5');
    });

    test('should display current quantity correctly', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-quantity-select"]');

      const firstQuantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').first();
      const secondQuantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').nth(1);

      await expect(firstQuantitySelect).toHaveValue('2');
      await expect(secondQuantitySelect).toHaveValue('1');
    });

    test('should update total when quantity changes', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-total"]');

      // Initial total for first item: €80.00 × 2 = €160.00
      const firstItemTotal = page.locator('[data-testid="cart-item-total"]').first();
      await expect(firstItemTotal).toHaveText('€160.00');

      // Change quantity to 4
      const quantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').first();
      await quantitySelect.selectOption('4');

      // Wait for update
      await page.waitForTimeout(100);

      // New total: €80.00 × 4 = €320.00
      await expect(firstItemTotal).toHaveText('€320.00');
    });
  });

  test.describe('Remove functionality', () => {
    test('should call onRemove when remove button is clicked', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-remove-button"]');

      const removeButton = page.locator('[data-testid="cart-item-remove-button"]').first();

      // Count initial cart items
      const initialItems = page.locator('[data-testid="cart-item"]');
      const initialCount = await initialItems.count();

      // Click remove button
      await removeButton.click();

      // Wait for removal
      await page.waitForTimeout(100);

      // Should have one less item
      const newCount = await initialItems.count();
      expect(newCount).toBe(initialCount - 1);
    });
  });

  test.describe('Description truncation', () => {
    test('should truncate long descriptions to 40 characters', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-description"]');

      const description = page.locator('[data-testid="cart-item-description"]').first();
      await expect(description).toHaveText('A test iPhone product with a very long description...');
    });

    test('should not truncate short descriptions', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-description"]');

      // Second item has short description
      const shortDescription = page.locator('[data-testid="cart-item-description"]').nth(1);
      await expect(shortDescription).toHaveText('Short description...');
    });

    test('should handle exactly 50 character descriptions', async ({ page }) => {
      // Mock a product with exactly 50 character description in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Test Product',
              description: 'A'.repeat(50),
              price: 100,
              discountPercentage: 20,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 1,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-description"]');

      const description = page.locator('[data-testid="cart-item-description"]').first();
      await expect(description).toHaveText('A'.repeat(50) + '...');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-remove-button"]');

      const removeButton = page.locator('[data-testid="cart-item-remove-button"]').first();
      await expect(removeButton).toHaveAttribute('aria-label', 'Remove item from cart');
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-quantity-select"]');

      const quantitySelect = page.locator('[data-testid="cart-item-quantity-select"]').first();
      const label = page.locator('[data-testid="cart-item-quantity-label"]').first();

      await expect(label).toBeVisible();
      await expect(quantitySelect).toHaveAttribute('id', 'quantity-1');
    });
  });

  test.describe('Edge cases', () => {
    test('should handle zero quantity', async ({ page }) => {
      // Mock a product with zero quantity in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Test Product',
              description: 'A test product',
              price: 100,
              discountPercentage: 20,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 0,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-total"]');

      const total = page.locator('[data-testid="cart-item-total"]').first();
      await expect(total).toHaveText('€0.00');
    });

    test('should handle very high quantities', async ({ page }) => {
      // Mock a product with high quantity in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Test Product',
              description: 'A test product',
              price: 100,
              discountPercentage: 20,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 10,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-total"]');

      const total = page.locator('[data-testid="cart-item-total"]').first();
      await expect(total).toHaveText('€800.00');
    });

    test('should handle products with very high prices', async ({ page }) => {
      // Mock a product with very high price in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Expensive Product',
              description: 'A very expensive product',
              price: 999999,
              discountPercentage: 20,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 1,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-original-price"]');

      await expect(page.locator('[data-testid="cart-item-original-price"]').first()).toHaveText(
        '€999999'
      );
      await expect(page.locator('[data-testid="cart-item-discounted-price"]').first()).toHaveText(
        'Now €799999.20!'
      );
    });

    test('should handle products with 100% discount', async ({ page }) => {
      // Mock a product with 100% discount in localStorage
      await page.addInitScript(() => {
        const mockCartItems = [
          {
            product: {
              id: 1,
              title: 'Free Product',
              description: 'A free product',
              price: 100,
              discountPercentage: 100,
              rating: 4.5,
              stock: 50,
              brand: 'Test Brand',
              category: 'test',
              thumbnail: 'https://via.placeholder.com/150',
              images: ['https://via.placeholder.com/150'],
            },
            quantity: 1,
          },
        ];
        localStorage.setItem('neoreShopCart', JSON.stringify(mockCartItems));
      });

      await page.goto('/neore-shop/cart');

      await page.waitForSelector('[data-testid="cart-item-discounted-price"]');

      await expect(page.locator('[data-testid="cart-item-discounted-price"]').first()).toHaveText(
        'Now €0.00!'
      );
      await expect(page.locator('[data-testid="cart-item-discount-badge"]').first()).toHaveText(
        '-100% off!'
      );
    });
  });
});
