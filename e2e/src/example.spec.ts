import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect the page to have the correct title.
  await expect(page).toHaveTitle('angularek');
});
