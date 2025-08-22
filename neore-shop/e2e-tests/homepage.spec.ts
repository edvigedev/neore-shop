import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title', async ({ page }) => {
    // Check for the main heading on the page.
    const mainTitle = page.getByRole('heading', {
      name: /Explore high-quality products and exclusive offers!/i,
    });
    await expect(mainTitle).toBeVisible();
  });

  test('should load and display the quote from the aside component', async ({ page }) => {
    // The AsideHomePage component fetches a quote. We need to wait for it to appear.
    // Playwright's web-first assertions will automatically wait.
    const asideTitle = page.getByRole('heading', { name: 'THINK BEFORE YOU SHOP!' });
    await expect(asideTitle).toBeVisible();

    const quoteText = page.locator('.home-page-aside p');
    await expect(quoteText).not.toBeEmpty(); // Ensures the quote content has loaded
  });

  test('should load and display the product cards', async ({ page }) => {
    // The CardsContainer fetches a list of products.
    const cardList = page.locator('.cards-container-list');
    await expect(cardList).toBeVisible();

    // This confirms the API call was successful and the products were rendered.
    const cards = cardList.locator('li');
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);

    await expect(cards.first()).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure for products
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        json: { message: 'Internal server error' },
      });
    });

    // Reload page to trigger the new mock
    await page.reload();

    // First, wait for loading spinner to disappear
    await page.waitForSelector('.loading-spinner', { state: 'hidden', timeout: 10000 });

    // Then wait for error to appear
    await page.waitForSelector('.fetching-error-container', { timeout: 10000 });

    // Reference: CardsContainer should show FetchingError when API fails
    await expect(page.locator('.fetching-error-container')).toBeVisible();
    await expect(page.locator('.fetching-error-content h1')).toHaveText(
      'Oops! Something went wrong'
    );
    await expect(page.locator('.fetching-error-content p')).toHaveText(
      "We couldn't load the data. Please try again."
    );
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.abort('failed');
    });

    // Reload page to trigger the new mock
    await page.reload();

    // Reference: CardsContainer should show FetchingError for network failures
    await expect(page.locator('.fetching-error-container')).toBeVisible();
  });

  test('should handle malformed JSON responses', async ({ page }) => {
    // Mock malformed JSON response
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"invalid": json}', // Malformed JSON
      });
    });

    // Reload page to trigger the new mock
    await page.reload();

    // Reference: CardsContainer should handle malformed JSON gracefully
    await expect(page.locator('.fetching-error-container')).toBeVisible();
  });

  test('should handle empty product responses', async ({ page }) => {
    // Mock empty products response
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { products: [], total: 0, skip: 0, limit: 30 },
      });
    });

    // Reload page to trigger the new mock
    await page.reload();

    // Reference: CardsContainer should handle empty responses gracefully
    await expect(page.locator('.cards-container-list-item-empty')).toBeVisible();
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    // Mock 404 error
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        json: { message: 'Products not found' },
      });
    });

    // Reload page to trigger the new mock
    await page.reload();

    // Reference: CardsContainer should show FetchingError for 404
    await expect(page.locator('.fetching-error-container')).toBeVisible();
  });

  test('should handle retry functionality', async ({ page }) => {
    // First, mock an error
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        json: { message: 'Internal server error' },
      });
    });

    // Reload page to trigger the error
    await page.reload();
    await expect(page.locator('.fetching-error-container')).toBeVisible();

    // Now mock a successful response for retry
    await page.route('https://dummyjson.com/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          products: [
            {
              id: 1,
              title: 'Test Product',
              description: 'Test Description',
              price: 100,
              discountPercentage: 10,
              rating: 4.5,
              thumbnail: 'https://picsum.photos/200/200?random=1',
              images: ['https://picsum.photos/400/400?random=1'],
              category: 'test',
              stock: 10,
            },
          ],
          total: 1,
          skip: 0,
          limit: 30,
        },
      });
    });

    // Click retry button
    await page.click('.fetching-error-content button');

    // Reference: CardsContainer should load successfully after retry
    await expect(page.locator('.cards-container-list')).toBeVisible();
    await expect(page.locator('.cards-container-list li')).toHaveCount(1);
    await expect(page.locator('.card-title')).toHaveText('Test Product');
  });

  test('should handle quote API failures gracefully', async ({ page }) => {
    // Mock quote API failure
    await page.route('https://dummyjson.com/quotes/random', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        json: { message: 'Quote service unavailable' },
      });
    });

    // Reload page to trigger the new mock
    await page.reload();

    // Reference: AsideHomePage should show error message without breaking the page
    await expect(page.locator('.aside-home-page')).not.toBeVisible();

    // Reference: Main page content should still work despite quote failure
    await expect(page.locator('.cards-container-list')).toBeVisible();
    const productCards = page.locator('.cards-container-list li');
    await expect(productCards).toHaveCount(await productCards.count());
    expect(await productCards.count()).toBeGreaterThan(0);
  });
});
