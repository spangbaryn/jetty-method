const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// INTEGRATION SCENARIO STEPS
// Note: Browser setup is handled by chapter-layout.steps.js

Then('I see the navigation sidebar', async function () {
  const sidebar = await this.page.locator('[data-testid="chapter-sidebar"]');
  await expect(sidebar).toBeVisible();
});

Then('the sidebar contains the book title', async function () {
  const bookTitle = await this.page.locator('[data-testid="sidebar-book-title"]');
  await expect(bookTitle).toBeVisible();
});

// CHAPTER LIST STEPS

Then('I see a list of chapter links in the sidebar', async function () {
  const chapterList = await this.page.locator('[data-testid="chapter-list"]');
  await expect(chapterList).toBeVisible();

  const links = await this.page.locator('[data-testid="chapter-list"] a').count();
  expect(links).toBeGreaterThan(0);
});

Then('the current chapter is highlighted', async function () {
  const activeChapter = await this.page.locator('[data-testid="chapter-link-active"]');
  await expect(activeChapter).toBeVisible();
});

When('I click a different chapter link in the sidebar', async function () {
  // Find a chapter link that is not the current one
  const otherChapter = await this.page.locator('[data-testid="chapter-list"] a:not([data-testid="chapter-link-active"])').first();
  this.clickedChapterHref = await otherChapter.getAttribute('href');
  await otherChapter.click();
});

Then('I am taken to that chapter page', async function () {
  await this.page.waitForURL(`**${this.clickedChapterHref}`);
  expect(this.page.url()).toContain(this.clickedChapterHref);
});

// SECTION ANCHOR STEPS

Then('I see section anchor links in the sidebar', async function () {
  const sectionAnchors = await this.page.locator('[data-testid="section-toc"]');
  await expect(sectionAnchors).toBeVisible();

  const anchors = await this.page.locator('[data-testid="section-toc"] a').count();
  expect(anchors).toBeGreaterThan(0);
});

When('I click a section anchor', async function () {
  const anchor = await this.page.locator('[data-testid="section-toc"] a').first();
  this.anchorHref = await anchor.getAttribute('href');
  await anchor.click();
});

Then('the page scrolls to that section', async function () {
  // Check URL contains the anchor
  expect(this.page.url()).toContain(this.anchorHref);
});

// NEXT CHAPTER STEPS

Then('I see a {string} link', async function (linkText) {
  const link = await this.page.locator(`[data-testid="next-chapter-link"]`);
  await expect(link).toBeVisible();
});

When('I click the {string} link', async function (linkText) {
  const link = await this.page.locator(`[data-testid="next-chapter-link"]`);
  this.nextChapterHref = await link.getAttribute('href');
  await link.click();
});

Then('I am taken to the next chapter', async function () {
  await this.page.waitForURL(`**${this.nextChapterHref}`);
  expect(this.page.url()).toContain(this.nextChapterHref);
});

// STICKY SIDEBAR STEPS

When('I scroll down the page', async function () {
  await this.page.evaluate(() => window.scrollBy(0, 500));
});

Then('the sidebar remains visible \\(sticky\\)', async function () {
  const sidebar = await this.page.locator('[data-testid="chapter-sidebar"]');
  await expect(sidebar).toBeVisible();

  // Check sidebar is still in viewport after scroll
  const isVisible = await sidebar.isVisible();
  expect(isVisible).toBe(true);
});
