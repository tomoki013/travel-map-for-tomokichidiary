import { test, expect } from '@playwright/test';

test.describe('Globe & Story App', () => {
  test('should load homepage and render Globe', async ({ page }) => {
    await page.goto('/');
    
    // Check Header
    await expect(page.getByText('Tomokichi Globe')).toBeVisible();
    
    // Check Mode Toggle
    await expect(page.getByRole('button', { name: 'By Region' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'By Trip' })).toBeVisible();
    
    // Check Map Canvas exists
    const mapCanvas = page.locator('.mapboxgl-canvas');
    await expect(mapCanvas).toBeAttached();
  });

  test('should switch to Trip mode and show StoryPanel', async ({ page }) => {
    await page.goto('/');
    
    // Click Trip Mode
    await page.getByRole('button', { name: 'By Trip' }).click();
    
    // Verify StoryPanel appears
    await expect(page.getByText('Autumn in Kyoto')).toBeVisible();
    await expect(page.getByText('Scroll to start the journey')).toBeVisible();
    
    // Verify Spot Cards
    // First spot: Kiyomizu-dera
    await expect(page.getByText('Kiyomizu-dera')).toBeVisible();
  });
});
