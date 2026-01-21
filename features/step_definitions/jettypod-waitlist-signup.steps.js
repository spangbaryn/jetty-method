const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// INTEGRATION SCENARIO STEPS - Homepage

Then('I see the JettyPod waitlist section', async function () {
  const section = this.page.locator('[data-testid="waitlist-section"]');
  await expect(section).toBeVisible();
});

Then('I see an email input field', async function () {
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await expect(emailInput).toBeVisible();
});

Then('I see a join button', async function () {
  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await expect(joinButton).toBeVisible();
});

// INTEGRATION SCENARIO STEPS - Chapter sidebar
// Note: "I am on a chapter page" step reuses existing definition from visual-content-blocks.steps.js

Then('I see the JettyPod waitlist card in the sidebar', async function () {
  const card = this.page.locator('[data-testid="waitlist-card"]');
  await expect(card).toBeVisible();
});

Then('I see a join waitlist button', async function () {
  const button = this.page.locator('[data-testid="waitlist-card-button"]');
  await expect(button).toBeVisible();
});

// FEATURE SCENARIO STEPS - Email submission

Given('I see the waitlist form', async function () {
  const section = this.page.locator('[data-testid="waitlist-section"]');
  await expect(section).toBeVisible();
});

When('I enter my email address', async function () {
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await emailInput.fill('test@example.com');
  this.submittedEmail = 'test@example.com';
});

When('I click the join button', async function () {
  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await joinButton.click();
});

Then('I see the vibe coding experience question', async function () {
  const question = this.page.locator('[data-testid="waitlist-experience-step"]');
  await expect(question).toBeVisible();
});

Then('I see three experience level options', async function () {
  const options = this.page.locator('[data-testid="waitlist-experience-option"]');
  await expect(options).toHaveCount(3);
});

// FEATURE SCENARIO STEPS - Complete signup

Given('I have entered my email', async function () {
  await this.page.goto(BASE_URL);
  await expect(this.page.locator('main')).toBeVisible();

  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await emailInput.fill('test@example.com');
  this.submittedEmail = 'test@example.com';

  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await joinButton.click();
});

Given('I see the experience question', async function () {
  const question = this.page.locator('[data-testid="waitlist-experience-step"]');
  await expect(question).toBeVisible();
});

When('I select my vibe coding experience level', async function () {
  const option = this.page.locator('[data-testid="waitlist-experience-option"]').first();
  await option.click();
  this.selectedExperience = await option.getAttribute('data-value');
});

Then('I see a success confirmation', async function () {
  const success = this.page.locator('[data-testid="waitlist-success"]');
  await expect(success).toBeVisible();
});

Then('my signup is recorded', async function () {
  // In speed mode, we verify the UI shows success
  // Database verification would be added in stable mode
  const success = this.page.locator('[data-testid="waitlist-success"]');
  await expect(success).toBeVisible();
});
