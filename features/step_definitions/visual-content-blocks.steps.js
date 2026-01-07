const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Note: "Given the app is running" and "When I navigate to" are defined in chapter-layout.steps.js
// Note: "Given I am on the chapter page for" is defined in chapter-layout.steps.js

// INTEGRATION SCENARIO STEPS

Then('the page uses the cream background color', async function () {
  const body = this.page.locator('body');
  const bgColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);
  // Cream color #fffef9 = rgb(255, 254, 249)
  expect(bgColor).toMatch(/rgb\(255,\s*254,\s*249\)|rgb\(255,\s*255,\s*249\)|#fffef9/i);
});

Then('the page uses the Caveat handwritten font', async function () {
  // Check that Caveat font is loaded (used somewhere on page)
  const hasCaveat = await this.page.evaluate(() => {
    return document.fonts.check('16px Caveat') ||
           Array.from(document.querySelectorAll('*')).some(el =>
             window.getComputedStyle(el).fontFamily.toLowerCase().includes('caveat')
           );
  });
  expect(hasCaveat).toBeTruthy();
});

// HIGHLIGHT STEPS

Given('I am on a chapter page with highlighted text', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('the highlighted text has a yellow background gradient', async function () {
  const highlight = this.page.locator('.highlight, [data-testid="highlight"]').first();
  await expect(highlight).toBeVisible();

  const background = await highlight.evaluate(el => window.getComputedStyle(el).background);
  // Should contain yellow/gold color
  expect(background.toLowerCase()).toMatch(/yellow|#fff3a8|linear-gradient/i);
});

// MARGIN NOTE STEPS

Given('I am on a chapter page with a margin note', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('the margin note has a left border', async function () {
  const marginNote = this.page.locator('.margin-note, [data-testid="margin-note"]').first();
  await expect(marginNote).toBeVisible();

  const borderLeft = await marginNote.evaluate(el => window.getComputedStyle(el).borderLeftWidth);
  expect(parseInt(borderLeft)).toBeGreaterThan(0);
});

Then('the margin note uses the Caveat font', async function () {
  const marginNote = this.page.locator('.margin-note, [data-testid="margin-note"]').first();
  const fontFamily = await marginNote.evaluate(el => window.getComputedStyle(el).fontFamily);
  expect(fontFamily.toLowerCase()).toContain('caveat');
});

// SKETCH STEPS

Given('I am on a chapter page with a sketch', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('the sketch has a border and shadow', async function () {
  const sketch = this.page.locator('.sketch, [data-testid="sketch"]').first();
  await expect(sketch).toBeVisible();

  const styles = await sketch.evaluate(el => {
    const s = window.getComputedStyle(el);
    return {
      border: s.borderWidth,
      shadow: s.boxShadow
    };
  });

  expect(parseInt(styles.border)).toBeGreaterThan(0);
  expect(styles.shadow).not.toBe('none');
});

Then('the sketch is slightly rotated', async function () {
  const sketch = this.page.locator('.sketch, [data-testid="sketch"]').first();
  const transform = await sketch.evaluate(el => window.getComputedStyle(el).transform);
  // Should have a rotation transform (not 'none' or identity matrix)
  expect(transform).not.toBe('none');
});

// PAIN POINTS STEPS

Given('I am on a chapter page with pain points', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('the pain points box has {string} label', async function (labelText) {
  const painPoints = this.page.locator('.pain-points, [data-testid="pain-points"]').first();
  await expect(painPoints).toBeVisible();

  // Check for label via ::before pseudo-element content or visible text
  const hasLabel = await painPoints.evaluate((el, text) => {
    const before = window.getComputedStyle(el, '::before').content;
    return before.toLowerCase().includes(text.toLowerCase()) ||
           el.textContent.toLowerCase().includes(text.toLowerCase());
  }, labelText);

  expect(hasLabel).toBeTruthy();
});

Then('the pain points list uses tilde markers', async function () {
  const listItem = this.page.locator('.pain-points li, [data-testid="pain-points"] li').first();
  await expect(listItem).toBeVisible();

  // Check for tilde in ::before pseudo-element
  const marker = await listItem.evaluate(el => {
    return window.getComputedStyle(el, '::before').content;
  });

  expect(marker).toContain('~');
});

// BIG QUOTE STEPS

Given('I am on a chapter page with a big quote', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('the quote uses the Caveat font', async function () {
  const quote = this.page.locator('.big-quote, [data-testid="big-quote"]').first();
  await expect(quote).toBeVisible();

  const fontFamily = await quote.evaluate(el => window.getComputedStyle(el).fontFamily);
  expect(fontFamily.toLowerCase()).toContain('caveat');
});

Then('the quote has decorative quotation marks', async function () {
  const quote = this.page.locator('.big-quote, [data-testid="big-quote"]').first();

  // Check for quotation marks via ::before/::after pseudo-elements
  const hasDeco = await quote.evaluate(el => {
    const before = window.getComputedStyle(el, '::before').content;
    const after = window.getComputedStyle(el, '::after').content;
    return before.includes('"') || after.includes('"') ||
           before.includes('"') || after.includes('"');
  });

  expect(hasDeco).toBeTruthy();
});

// SECTION HEADER STEPS

Given('I am on a chapter page', async function () {
  await this.page.goto(`${BASE_URL}/chapters/introduction`);
  await expect(this.page.locator('main')).toBeVisible();
});

Then('section headers have a left border accent', async function () {
  const h2 = this.page.locator('main h2').first();
  await expect(h2).toBeVisible();

  const borderLeft = await h2.evaluate(el => {
    const s = window.getComputedStyle(el);
    return {
      width: s.borderLeftWidth,
      style: s.borderLeftStyle
    };
  });

  expect(parseInt(borderLeft.width)).toBeGreaterThan(0);
  expect(borderLeft.style).not.toBe('none');
});
