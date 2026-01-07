const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

let page;
let browser;
let context;

// Viewport sizes
const MOBILE_VIEWPORT = { width: 375, height: 667 };  // iPhone SE
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const VERY_NARROW_VIEWPORT = { width: 320, height: 568 };  // iPhone 5/SE (old)
const TABLET_VIEWPORT = { width: 767, height: 1024 };  // iPad portrait (just below md: breakpoint)
const LARGE_VIEWPORT = { width: 1920, height: 1080 };  // Full HD

Before(async function () {
  const { chromium } = require('playwright');
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function () {
  await browser.close();
});

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// NAVIGATION STEPS

Given('I am on the introduction chapter', async function () {
  await page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(page.locator('main')).toBeVisible();
});

// VIEWPORT STEPS

When('I view the page on a mobile viewport', async function () {
  await page.setViewportSize(MOBILE_VIEWPORT);
  // Give layout time to reflow
  await page.waitForTimeout(100);
});

When('I view the page on a desktop viewport', async function () {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.waitForTimeout(100);
});

Given('I am viewing on a mobile viewport', async function () {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.waitForTimeout(100);
});

// MOBILE LAYOUT ASSERTIONS

Then('the sidebar appears above the main content', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"], aside, .sidebar').first();
  const content = page.locator('[data-testid="chapter-content"], main article, .content').first();

  const sidebarBox = await sidebar.boundingBox();
  const contentBox = await content.boundingBox();

  // Sidebar should be above content (lower Y value or same X with lower Y)
  expect(sidebarBox.y).toBeLessThanOrEqual(contentBox.y);
});

Then('the layout is single-column', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"], aside, .sidebar').first();
  const content = page.locator('[data-testid="chapter-content"], main article, .content').first();

  const sidebarBox = await sidebar.boundingBox();
  const contentBox = await content.boundingBox();

  // In single column, sidebar and content should not be side-by-side
  // Either sidebar is above content, or they overlap horizontally
  const sidebarRight = sidebarBox.x + sidebarBox.width;
  const contentLeft = contentBox.x;

  // Content should not start to the right of sidebar (would indicate side-by-side)
  // Allow for small overlap in mobile stacked layout
  const isSingleColumn = contentBox.y > sidebarBox.y || Math.abs(contentLeft - sidebarBox.x) < 50;
  expect(isSingleColumn).toBeTruthy();
});

Then('the sidebar is not fixed to the side', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"], aside, .sidebar').first();

  const position = await sidebar.evaluate(el => window.getComputedStyle(el).position);

  // On mobile, sidebar should not be sticky/fixed to side
  // It should flow with content (relative/static) or be at top
  expect(['relative', 'static', 'sticky']).toContain(position);
});

Then('I can scroll past the sidebar to reach content', async function () {
  const content = page.locator('[data-testid="chapter-content"], main article').first();

  // Scroll to content area
  await content.scrollIntoViewIfNeeded();

  // Content should be visible after scroll
  await expect(content).toBeVisible();
});

Then('the body text has appropriate padding', async function () {
  const content = page.locator('[data-testid="chapter-content"], main article, main').first();

  const padding = await content.evaluate(el => {
    const style = window.getComputedStyle(el);
    return {
      left: parseFloat(style.paddingLeft),
      right: parseFloat(style.paddingRight)
    };
  });

  // Should have some padding on mobile (at least 16px)
  expect(padding.left).toBeGreaterThanOrEqual(16);
  expect(padding.right).toBeGreaterThanOrEqual(16);
});

Then('no horizontal scrolling is required', async function () {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

  // Scroll width should not exceed viewport width (or only by a tiny margin)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
});

// DESKTOP LAYOUT ASSERTIONS

Then('the sidebar is fixed on the left', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"], aside, .sidebar').first();
  const content = page.locator('[data-testid="chapter-content"], main article').first();

  const sidebarBox = await sidebar.boundingBox();
  const contentBox = await content.boundingBox();

  // Sidebar should be to the left of content
  expect(sidebarBox.x).toBeLessThan(contentBox.x);

  // Sidebar should be at roughly the same Y as content (side-by-side)
  expect(Math.abs(sidebarBox.y - contentBox.y)).toBeLessThan(100);
});

Then('the content appears beside the sidebar', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"], aside, .sidebar').first();
  const content = page.locator('[data-testid="chapter-content"], main article').first();

  const sidebarBox = await sidebar.boundingBox();
  const contentBox = await content.boundingBox();

  // Content should start after sidebar ends (with some gap)
  const sidebarRight = sidebarBox.x + sidebarBox.width;
  expect(contentBox.x).toBeGreaterThanOrEqual(sidebarRight - 10);

  // They should be roughly at the same vertical level
  expect(Math.abs(sidebarBox.y - contentBox.y)).toBeLessThan(100);
});

// STABLE MODE - EDGE CASE VIEWPORT STEPS

When('I view the page on a very narrow viewport', async function () {
  await page.setViewportSize(VERY_NARROW_VIEWPORT);
  await page.waitForTimeout(100);
});

When('I view the page on a tablet viewport', async function () {
  await page.setViewportSize(TABLET_VIEWPORT);
  await page.waitForTimeout(100);
});

When('I view the page on a large viewport', async function () {
  await page.setViewportSize(LARGE_VIEWPORT);
  await page.waitForTimeout(100);
});

Then('the content width is constrained', async function () {
  const container = page.locator('.max-w-5xl').first();
  const containerBox = await container.boundingBox();

  // max-w-5xl = 64rem = 1024px max width
  // Content should be constrained even on large viewport
  expect(containerBox.width).toBeLessThanOrEqual(1024);
});
