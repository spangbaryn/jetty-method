const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const MOBILE_VIEWPORT = { width: 375, height: 667 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// STABLE MODE STEP DEFINITIONS - Edge Cases and Error Handling

// GIVEN STEPS

Given('I am on a chapter page with no sections on a mobile device', async function () {
  const page = this.page;
  await page.setViewportSize(MOBILE_VIEWPORT);
  // Use 'the-first-page' which likely has no sections or minimal content
  await page.goto(`${BASE_URL}/chapters/the-first-page`);
  await expect(page.locator('main')).toBeVisible();
});

Given('I am on the last chapter on a mobile device', async function () {
  const page = this.page;
  await page.setViewportSize(MOBILE_VIEWPORT);
  // Use 'the-last-page' which is the final chapter
  await page.goto(`${BASE_URL}/chapters/the-last-page`);
  await expect(page.locator('main')).toBeVisible();
});

// WHEN STEPS

When('I press the Escape key', async function () {
  const page = this.page;
  await page.keyboard.press('Escape');
});

When('the viewport is resized to desktop width', async function () {
  const page = this.page;
  await page.setViewportSize(DESKTOP_VIEWPORT);
  // Wait for responsive CSS to apply
  await page.waitForTimeout(100);
});

// THEN STEPS

Then('I see the navigation drawer', async function () {
  const page = this.page;
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  await expect(drawer).toBeVisible();
});

Then('I do not see any section links', async function () {
  const page = this.page;
  const sectionToc = page.locator('[data-testid="mobile-nav-drawer"] [data-testid="section-toc"]');
  // Section TOC should not be present when there are no sections
  await expect(sectionToc).not.toBeVisible();
});

Then('I do not see a next chapter link', async function () {
  const page = this.page;
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  // Look for any "Next:" text link in the drawer
  const nextLink = drawer.locator('a:has-text("Next:")');
  await expect(nextLink).not.toBeVisible();
});

Then('the hamburger menu is not visible', async function () {
  const page = this.page;
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await expect(hamburger).not.toBeVisible();
});

Then('the sidebar is visible normally', async function () {
  const page = this.page;
  const sidebar = page.locator('[data-testid="chapter-sidebar"]');
  await expect(sidebar).toBeVisible();
});
