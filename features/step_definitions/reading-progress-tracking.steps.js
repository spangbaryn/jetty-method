const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const STORAGE_KEY = 'jetty-reading-progress';

// SETUP STEPS

Given('I have previously read to {string} section {string}', async function (chapter, section) {
  // Navigate to page first to set localStorage in correct origin
  await this.page.goto(BASE_URL);
  await this.page.evaluate(({ key, chapter, section }) => {
    localStorage.setItem(key, JSON.stringify({ chapter, section }));
  }, { key: STORAGE_KEY, chapter, section });
});

Given('I have no reading progress saved', async function () {
  await this.page.goto(BASE_URL);
  await this.page.evaluate((key) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
});

Given('I am on the home page', async function () {
  await this.page.goto(BASE_URL);
  await expect(this.page.locator('main')).toBeVisible();
});

// Note: "Given I am on the chapter page for {string}" is defined in chapter-layout.steps.js

// NAVIGATION STEPS

When('I visit the home page', async function () {
  await this.page.goto(BASE_URL);
  await expect(this.page.locator('main')).toBeVisible();
});

When('I click the {string} button', async function (buttonText) {
  const button = this.page.locator(`[data-testid="resume-reading-button"]`);
  await expect(button).toBeVisible();
  await button.click();
});

When('I scroll past section {string}', async function (sectionId) {
  const section = this.page.locator(`#${sectionId}`);
  await section.scrollIntoViewIfNeeded();
  // Wait for intersection observer to fire
  await this.page.waitForTimeout(500);
});

When('I scroll to section {string}', async function (sectionId) {
  const section = this.page.locator(`#${sectionId}`);
  await section.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
});

// ASSERTION STEPS

Then('I see a {string} button under the tagline', async function (buttonText) {
  const button = this.page.locator('[data-testid="resume-reading-button"]');
  await expect(button).toBeVisible();
  await expect(button).toContainText(buttonText);
});

Then('I do not see a {string} button', async function (buttonText) {
  const button = this.page.locator('[data-testid="resume-reading-button"]');
  await expect(button).not.toBeVisible();
});

Then('the button links to {string}', async function (href) {
  const button = this.page.locator('[data-testid="resume-reading-button"]');
  const link = button.locator('a').first();
  // Button might be a link itself or contain a link
  const buttonHref = await button.getAttribute('href') || await link.getAttribute('href');
  expect(buttonHref).toBe(href);
});

// Note: "Then I am on the chapter page for {string}" reuses chapter-layout.steps.js definition

Then('the page is scrolled to section {string}', async function (sectionId) {
  // Check URL hash or scroll position
  const url = this.page.url();
  expect(url).toContain(`#${sectionId}`);
});

Then('my reading progress is saved as {string} section {string}', async function (chapter, section) {
  const progress = await this.page.evaluate((key) => {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }, STORAGE_KEY);
  expect(progress.chapter).toBe(chapter);
  expect(progress.section).toBe(section);
});

Then('my reading progress remains {string} section {string}', async function (chapter, section) {
  const progress = await this.page.evaluate((key) => {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }, STORAGE_KEY);
  expect(progress.chapter).toBe(chapter);
  expect(progress.section).toBe(section);
});
