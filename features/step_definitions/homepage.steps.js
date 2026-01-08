const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// INTEGRATION SCENARIO STEPS

Given('I open the app', async function () {
  await this.page.goto(BASE_URL);
  await expect(this.page.locator('main')).toBeVisible();
});

Given('I am on the homepage', async function () {
  await this.page.goto(BASE_URL);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('I see the book title {string}', async function (title) {
  const titleElement = this.page.locator('[data-testid="book-title"], h1');
  await expect(titleElement).toContainText(title);
});

Then('I see the book tagline', async function () {
  const tagline = this.page.locator('[data-testid="book-tagline"]');
  await expect(tagline).toBeVisible();
});

// TABLE OF CONTENTS STEPS

Then('I see the table of contents', async function () {
  const toc = this.page.locator('[data-testid="table-of-contents"]');
  await expect(toc).toBeVisible();
});

Then('I see parts organized hierarchically', async function () {
  const parts = this.page.locator('[data-testid="toc-part"]');
  const count = await parts.count();
  expect(count).toBeGreaterThan(0);
});

When('I look at a part section', async function () {
  this.partSection = this.page.locator('[data-testid="toc-part"]').first();
  await expect(this.partSection).toBeVisible();
});

Then('I see the chapters listed under that part', async function () {
  const chapters = this.partSection.locator('[data-testid="toc-chapter"]');
  const count = await chapters.count();
  expect(count).toBeGreaterThan(0);
});

// NAVIGATION STEPS

When('I click on a chapter title', async function () {
  const chapterLink = this.page.locator('[data-testid="toc-chapter"] a').first();
  this.clickedChapterHref = await chapterLink.getAttribute('href');
  await chapterLink.click();
});

Then('I am taken to that chapter\'s page', async function () {
  await this.page.waitForURL(`**${this.clickedChapterHref}`);
  expect(this.page.url()).toContain(this.clickedChapterHref);
});
