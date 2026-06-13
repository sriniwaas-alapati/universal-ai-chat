const { test, expect } = require('@playwright/test');

test.describe('Universal AI Chat UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads initial UI and wizard', async ({ page }) => {
    await expect(page).toHaveTitle(/Universal AI Chat/);
    const welcome = page.locator('.welcome-state');
    await expect(welcome).toBeVisible();
    await expect(page.locator('h2')).toContainText('Universal AI Chat');
  });

  test('can switch to Ollama provider', async ({ page }) => {
    // Click Ollama card in the sidebar provider grid
    await page.locator('.provider-card[data-id="ollama"]').click();
    
    // Verify wizard changes to Ollama
    await expect(page.locator('.topbar-subtitle')).toContainText('Ollama');
    
    // Check if Ollama fields are visible in the wizard
    const endpointInput = page.locator('#field-endpointUrl');
    await expect(endpointInput).toBeVisible();
  });

  test('sidebar mobile toggle works', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    const sidebar = page.locator('.sidebar');
    const toggleBtn = page.locator('.mobile-toggle');
    
    // Wait for initial render
    await page.waitForTimeout(500);

    // Sidebar should be initially collapsed (translateX -100%) or not have mobile-open class
    await expect(sidebar).not.toHaveClass(/mobile-open/);
    
    // Click toggle
    await toggleBtn.click();
    
    // Sidebar should now have mobile-open class
    await expect(sidebar).toHaveClass(/mobile-open/);
  });
});
