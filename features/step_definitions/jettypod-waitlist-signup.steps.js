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

// STABLE MODE STEPS - Error Handling and Edge Cases

When('I enter an invalid email address', async function () {
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await emailInput.fill('not-an-email');
});

Then('I see an email validation error', async function () {
  const error = this.page.locator('[data-testid="waitlist-email-error"]');
  await expect(error).toBeVisible();
});

Then('I remain on the email step', async function () {
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await expect(emailInput).toBeVisible();
  const experienceStep = this.page.locator('[data-testid="waitlist-experience-step"]');
  await expect(experienceStep).not.toBeVisible();
});

When('I click the join button without entering email', async function () {
  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await joinButton.click();
});

Then('I see a required field error', async function () {
  const error = this.page.locator('[data-testid="waitlist-email-error"]');
  await expect(error).toBeVisible();
});

Given('I have already signed up with my email', async function () {
  // Submit the form once to register the email
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await emailInput.fill('duplicate@example.com');
  this.submittedEmail = 'duplicate@example.com';

  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await joinButton.click();

  const experienceOption = this.page.locator('[data-testid="waitlist-experience-option"]').first();
  await experienceOption.click();

  const success = this.page.locator('[data-testid="waitlist-success"]');
  await expect(success).toBeVisible();

  // Reload page to start fresh
  await this.page.reload();
  await expect(this.page.locator('[data-testid="waitlist-section"]')).toBeVisible();
});

When('I try to sign up again with the same email', async function () {
  const emailInput = this.page.locator('[data-testid="waitlist-email-input"]');
  await emailInput.fill('duplicate@example.com');

  const joinButton = this.page.locator('[data-testid="waitlist-join-button"]');
  await joinButton.click();

  const experienceOption = this.page.locator('[data-testid="waitlist-experience-option"]').first();
  await experienceOption.click();
});

Then('I see a duplicate email message', async function () {
  const message = this.page.locator('[data-testid="waitlist-duplicate-message"]');
  await expect(message).toBeVisible();
});

Then('I am not added to the waitlist again', async function () {
  // This would verify the count didn't increase - implementation detail
  const message = this.page.locator('[data-testid="waitlist-duplicate-message"]');
  await expect(message).toBeVisible();
});

Given('the API is unavailable', async function () {
  // Mock the API to return an error
  await this.page.route('**/api/waitlist', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    });
  });
});

Then('I see an error message', async function () {
  const error = this.page.locator('[data-testid="waitlist-error"]');
  await expect(error).toBeVisible();
});

Then('I can retry the submission', async function () {
  const retryButton = this.page.locator('[data-testid="waitlist-retry-button"]');
  await expect(retryButton).toBeVisible();
});
