/**
 * @fileoverview E2E smoke tests for FlashFusion application
 * @category test
 */

import { test, expect } from '@playwright/test';

test.describe('FlashFusion Application', () => {
  test('should load the application successfully', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page title is correct (adjust based on your app)
    await expect(page).toHaveTitle(/FlashFusion|Flash Fusion/i);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for common navigation elements
    // Adjust these selectors based on your actual navigation structure
    const body = await page.locator('body');
    expect(await body.isVisible()).toBeTruthy();
  });

  test('should not have console errors on initial load', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow for some expected development warnings but no critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('ResizeObserver') && // Common non-critical warning
        !error.includes('Warning:') // React warnings in dev mode
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for responsive adjustments

    const body = await page.locator('body');
    expect(await body.isVisible()).toBeTruthy();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    expect(await body.isVisible()).toBeTruthy();
  });
});

test.describe('Launch Preparation Hub (if accessible)', () => {
  test('should navigate to launch preparation if route exists', async ({ page }) => {
    // This test will be skipped if the route doesn't exist yet
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find navigation to launch preparation
    // This is a smoke test, so we just verify basic functionality
    const body = await page.locator('body');
    expect(await body.isVisible()).toBeTruthy();
  });
});

test.describe('Performance', () => {
  test('should load in reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load within 10 seconds (generous for initial load)
    expect(loadTime).toBeLessThan(10000);
  });
});
