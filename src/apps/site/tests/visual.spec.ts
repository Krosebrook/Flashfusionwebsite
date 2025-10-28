import { test, expect } from '@playwright/test';

test.describe('FlashFusion Site Visual Regression', () => {
  test('homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check critical elements are present
    await expect(page.getByText('FlashFusion')).toBeVisible();
    await expect(page.getByPlaceholder('you@company.com')).toBeVisible();
    await expect(page.getByText('Join Waitlist')).toBeVisible();
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('consent banner appears and functions', async ({ page }) => {
    await page.goto('/');
    
    // Clear localStorage to ensure banner shows
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Check consent banner appears
    await expect(page.getByText('Cookie Consent')).toBeVisible();
    
    // Click accept
    await page.getByRole('button', { name: 'Accept' }).click();
    
    // Banner should disappear
    await expect(page.getByText('Cookie Consent')).not.toBeVisible();
  });

  test('waitlist form is functional', async ({ page }) => {
    await page.goto('/');
    
    // Fill in email
    const emailInput = page.getByPlaceholder('you@company.com');
    await emailInput.fill('test@example.com');
    
    // Submit form
    await page.getByRole('button', { name: 'Join Waitlist' }).click();
    
    // Form should submit (we're not testing the actual DB here)
    // Just verify the action doesn't throw errors
    await page.waitForTimeout(1000);
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Check mobile layout
    await expect(page.getByText('FlashFusion')).toBeVisible();
    await expect(page.getByPlaceholder('you@company.com')).toBeVisible();
    
    // Screenshot mobile view
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('CTA tracking attributes present', async ({ page }) => {
    await page.goto('/');
    
    // Check data-cta attributes for analytics
    const heroCTA = page.getByRole('button', { name: 'Join Waitlist' }).first();
    await expect(heroCTA).toHaveAttribute('data-cta', 'hero_primary');
    
    const footerCTA = page.getByRole('button', { name: 'Get Early Access' });
    await expect(footerCTA).toHaveAttribute('data-cta', 'footer_cta');
  });
});
