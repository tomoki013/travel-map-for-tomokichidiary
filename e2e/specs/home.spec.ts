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

    await expect(page.getByRole('link', { name: 'ともきちの旅行日記 →' })).toHaveAttribute(
      'href',
      'https://tomokichidiary.com/',
    );
  });

  test('should switch to Trip mode and show StoryPanel', async ({ page }) => {
    await page.goto('/');
    
    // Click Trip Mode
    await page.getByRole('button', { name: 'By Trip' }).click();
    
    // Verify StoryPanel appears
    await expect(page.getByText('アジアの熱気を感じて')).toBeVisible();
    await expect(page.getByText('西欧 芸術と美食の周遊')).toBeVisible();
    await expect(page.getByText('北海道の食を堪能する旅')).toBeVisible();
    await expect(page.getByText('インド 混沌と祈りの旅')).toBeVisible();
    await expect(page.getByText('大陸横断 古代文明を巡る冒険')).toBeVisible();
    await expect(page.getByText('上海 新旧が交錯する魔都')).toBeVisible();
    await expect(page.getByText('東南アジアをつないで巡る食と街歩きの旅')).toBeVisible();
  });

  test('should open trip list from mode parameter', async ({ page }) => {
    await page.goto('/?mode=trip');

    await expect(page.getByText('Select a Trip')).toBeVisible();
    await expect(page.getByText('北海道の食を堪能する旅')).toBeVisible();
  });

  test('should show coming soon state for listed regions without spots', async ({ page }) => {
    await page.goto('/?country=japan&region=osaka');

    await expect(page.getByText('Coming Soon')).toBeVisible();
    await expect(page.getByText('大阪')).toBeVisible();
  });
});
