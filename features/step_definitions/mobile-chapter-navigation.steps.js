const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

let page;
let browser;
let context;

const MOBILE_VIEWPORT = { width: 375, height: 667 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

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

// GIVEN STEPS

Given('I am on a chapter page on a mobile device', async function () {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(page.locator('main')).toBeVisible();
});

Given('I am on a chapter page on a desktop device', async function () {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(page.locator('main')).toBeVisible();
});

Given('the navigation drawer is open', async function () {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(page.locator('main')).toBeVisible();

  // Open the drawer
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await hamburger.click();

  // Wait for drawer to be visible
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  await expect(drawer).toBeVisible();
});

// WHEN STEPS

When('I tap the hamburger menu icon', async function () {
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await hamburger.click();
});

When('I tap a section link', async function () {
  const sectionLink = page.locator('[data-testid="mobile-nav-drawer"] a[href^="#"]').first();
  await sectionLink.click();
});

When('I tap outside the drawer', async function () {
  const overlay = page.locator('[data-testid="mobile-nav-overlay"]');
  await overlay.click();
});

When('I tap the close button', async function () {
  const closeButton = page.locator('[data-testid="mobile-nav-close"]');
  await closeButton.click();
});

// THEN STEPS

Then('I see the navigation drawer slide in from the left', async function () {
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  await expect(drawer).toBeVisible();
});

Then('I see the book title', async function () {
  const bookTitle = page.locator('[data-testid="mobile-nav-drawer"] [data-testid="sidebar-book-title"]');
  await expect(bookTitle).toBeVisible();
});

Then('I see the current chapter title', async function () {
  const chapterTitle = page.locator('[data-testid="mobile-nav-drawer"] h2');
  await expect(chapterTitle).toBeVisible();
});

Then('I see links to all sections in the current chapter', async function () {
  const sectionLinks = page.locator('[data-testid="mobile-nav-drawer"] [data-testid="section-toc"] a');
  const count = await sectionLinks.count();
  expect(count).toBeGreaterThan(0);
});

Then('the drawer closes', async function () {
  const drawer = page.locator('[data-testid="mobile-nav-drawer"]');
  await expect(drawer).not.toBeVisible();
});

Then('I scroll to that section', async function () {
  // After clicking section link, URL should have hash
  const url = page.url();
  expect(url).toContain('#');
});

Then('I see the sidebar visible without a hamburger menu', async function () {
  const sidebar = page.locator('[data-testid="chapter-sidebar"]');
  await expect(sidebar).toBeVisible();

  // Hamburger should not be visible on desktop
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await expect(hamburger).not.toBeVisible();
});
