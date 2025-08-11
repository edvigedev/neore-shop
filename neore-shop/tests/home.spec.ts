import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  // This uses the baseURL configured in playwright.config.ts
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
});
