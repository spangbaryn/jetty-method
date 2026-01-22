const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
// Parser will be imported dynamically to avoid module resolution issues in dry-run
let parseContent;

let page;
let browser;
let context;
let parsedContent;
let testContent;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

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

// INTEGRATION SCENARIO STEPS (Parser)

Given('content with {string}', function (content) {
  testContent = content;
});

When('the content is parsed', function () {
  // Dynamic import to handle worktree path
  const path = require('path');
  const parserPath = path.join(__dirname, '../../src/lib/google-docs/parser');
  const parser = require(parserPath);
  parsedContent = parser.parseContent(testContent);
});

Then('a prompt block is created with text {string}', function (expectedText) {
  const promptBlock = parsedContent.find(block => block._type === 'prompt');
  expect(promptBlock).toBeDefined();
  expect(promptBlock.text).toBe(expectedText);
});

// FEATURE SCENARIO STEPS (UI)

Given('I am on a chapter page with a prompt block', async function () {
  // Navigate to a chapter that has a prompt block
  // For testing, we'll use a test page or the introduction which we can add a prompt to
  await page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(page.locator('main')).toBeVisible();
});

Then('I see a prompt card with {string} label', async function (label) {
  const promptCard = page.locator('[data-testid="prompt-component"]');
  await expect(promptCard).toBeVisible();
  const labelElement = promptCard.locator('[data-testid="prompt-label"]');
  await expect(labelElement).toHaveText(label);
});

Then('I see the prompt text displayed', async function () {
  const promptText = page.locator('[data-testid="prompt-text"]');
  await expect(promptText).toBeVisible();
});

Then('I see a copy button', async function () {
  const copyButton = page.locator('[data-testid="prompt-copy-button"]');
  await expect(copyButton).toBeVisible();
});

When('I click the copy button', async function () {
  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  const copyButton = page.locator('[data-testid="prompt-copy-button"]');
  await copyButton.click();
});

Then('the prompt text is copied to the clipboard', async function () {
  // Read clipboard and verify content
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText.length).toBeGreaterThan(0);
});

Then('the button shows {string} feedback', async function (feedbackText) {
  const copyButton = page.locator('[data-testid="prompt-copy-button"]');
  await expect(copyButton).toContainText(feedbackText);
});
