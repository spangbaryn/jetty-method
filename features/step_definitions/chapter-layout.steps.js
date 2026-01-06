const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

let page;
let browser;
let context;

Before(async function () {
  const { chromium } = require('playwright');
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await browser.close();
});

// Base URL for the app
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// INTEGRATION SCENARIO STEPS

Given('the app is running', async function () {
  // Verify the app is accessible
  const response = await page.goto(BASE_URL);
  expect(response.status()).toBeLessThan(500);
});

When('I navigate to {string}', async function (path) {
  await page.goto(`${BASE_URL}${path}`);
});

Then('I see the chapter page', async function () {
  // Page should load without error - check for main content
  await expect(page.locator('main')).toBeVisible();
});

Then('the page has a main content area', async function () {
  await expect(page.locator('main .content, main article, [class*="content"]')).toBeVisible();
});

// CHAPTER CONTENT STEPS

Given('I am on the chapter page for {string}', async function (slug) {
  await page.goto(`${BASE_URL}/chapters/${slug}`);
  await expect(page.locator('main')).toBeVisible();
});

Then('I see the chapter title {string}', async function (title) {
  await expect(page.locator('h1')).toContainText(title);
});

Then('I see the chapter intro paragraph', async function () {
  // Look for intro/lead paragraph - typically first paragraph or .intro class
  await expect(page.locator('.chapter-intro, .intro, main p').first()).toBeVisible();
});

Then('the intro is styled in italic', async function () {
  const intro = page.locator('.chapter-intro, .intro').first();
  const fontStyle = await intro.evaluate(el => window.getComputedStyle(el).fontStyle);
  expect(fontStyle).toBe('italic');
});

// SECTION HEADING STEPS

Then('I see section headings', async function () {
  const headings = page.locator('main h2');
  await expect(headings.first()).toBeVisible();
});

Then('each section heading has an anchor link', async function () {
  const headings = await page.locator('main h2').all();
  expect(headings.length).toBeGreaterThan(0);

  for (const heading of headings) {
    // Check heading has an id or contains an anchor link
    const id = await heading.getAttribute('id');
    const anchor = await heading.locator('a[href^="#"]').count();
    expect(id || anchor > 0).toBeTruthy();
  }
});

When('I click a section heading anchor', async function () {
  // Click the first section heading anchor
  const anchor = page.locator('main h2 a[href^="#"], main h2[id]').first();
  const href = await anchor.getAttribute('href');

  if (href) {
    await anchor.click();
  } else {
    // If heading has id but no anchor, click it to potentially trigger navigation
    const id = await anchor.getAttribute('id');
    await page.goto(`${page.url()}#${id}`);
  }
});

Then('the URL contains the section anchor', async function () {
  const url = page.url();
  expect(url).toContain('#');
});

// TYPOGRAPHY STEPS

Then('the body text uses Georgia font', async function () {
  const body = page.locator('main p').first();
  const fontFamily = await body.evaluate(el => window.getComputedStyle(el).fontFamily);
  expect(fontFamily.toLowerCase()).toContain('georgia');
});

Then('the UI elements use system sans-serif font', async function () {
  // Check UI elements like buttons, nav items use system font
  const uiElement = page.locator('header, nav, button, .ui').first();

  if (await uiElement.count() > 0) {
    const fontFamily = await uiElement.evaluate(el => window.getComputedStyle(el).fontFamily);
    // System fonts include -apple-system, BlinkMacSystemFont, Segoe UI, etc.
    const isSystemFont = fontFamily.includes('system') ||
                         fontFamily.includes('Segoe') ||
                         fontFamily.includes('apple') ||
                         fontFamily.includes('sans-serif');
    expect(isSystemFont).toBeTruthy();
  }
});

Then('the text has proper line height for readability', async function () {
  const body = page.locator('main p').first();
  const lineHeight = await body.evaluate(el => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const lh = parseFloat(style.lineHeight);
    return lh / fontSize;
  });

  // Good readability typically requires line-height between 1.4 and 2.0
  expect(lineHeight).toBeGreaterThanOrEqual(1.4);
  expect(lineHeight).toBeLessThanOrEqual(2.2);
});
