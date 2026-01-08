const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// STABLE MODE: Edge cases and error handling

// Long content handling
Then('chapter titles do not overflow their containers', async function () {
  const chapters = this.page.locator('[data-testid="toc-chapter"]');
  const count = await chapters.count();

  for (let i = 0; i < count; i++) {
    const chapter = chapters.nth(i);
    const box = await chapter.boundingBox();
    const parentBox = await chapter.locator('..').boundingBox();

    // Chapter should not extend beyond its parent
    expect(box.x + box.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + 1);
  }
});

Then('the layout remains intact', async function () {
  // Verify main structure is present and visible
  const toc = this.page.locator('[data-testid="table-of-contents"]');
  await expect(toc).toBeVisible();

  const parts = this.page.locator('[data-testid="toc-part"]');
  const partsCount = await parts.count();
  expect(partsCount).toBeGreaterThan(0);
});

// Keyboard navigation
When('I navigate using the Tab key', async function () {
  // Focus on the page and start tabbing
  await this.page.keyboard.press('Tab');
  this.focusedElements = [];

  // Tab through all focusable elements (up to 20)
  for (let i = 0; i < 20; i++) {
    const focused = await this.page.evaluate(() => {
      const el = document.activeElement;
      return el ? {
        tagName: el.tagName,
        href: el.getAttribute('href'),
        testId: el.getAttribute('data-testid')
      } : null;
    });

    if (focused && focused.href && focused.href.includes('/chapters/')) {
      this.focusedElements.push(focused);
    }

    await this.page.keyboard.press('Tab');
  }
});

Then('I can reach all chapter links', async function () {
  const chapterLinks = this.page.locator('[data-testid="toc-chapter"] a');
  const expectedCount = await chapterLinks.count();

  expect(this.focusedElements.length).toBeGreaterThanOrEqual(expectedCount);
});

Then('each link has visible focus styling', async function () {
  // Focus the first chapter link
  const firstLink = this.page.locator('[data-testid="toc-chapter"] a').first();
  await firstLink.focus();

  // Check that focus is visible (outline or other focus indicator)
  const outlineStyle = await firstLink.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      outline: styles.outline,
      outlineWidth: styles.outlineWidth,
      boxShadow: styles.boxShadow
    };
  });

  // Should have some focus indication (default browser outline or custom)
  const hasFocusIndicator =
    outlineStyle.outlineWidth !== '0px' ||
    outlineStyle.boxShadow !== 'none';

  expect(hasFocusIndicator).toBe(true);
});

// Narrow viewport handling
Given('the viewport width is {int} pixels', async function (width) {
  await this.page.setViewportSize({ width: width, height: 800 });
});

Then('the table of contents is still readable', async function () {
  const toc = this.page.locator('[data-testid="table-of-contents"]');
  await expect(toc).toBeVisible();

  // Check that text is not clipped (TOC should be within viewport)
  const tocBox = await toc.boundingBox();
  const viewport = this.page.viewportSize();

  expect(tocBox.width).toBeLessThanOrEqual(viewport.width);
});

Then('chapter links are still clickable', async function () {
  const firstLink = this.page.locator('[data-testid="toc-chapter"] a').first();
  await expect(firstLink).toBeVisible();

  // Verify the link is clickable (has reasonable size)
  const box = await firstLink.boundingBox();
  expect(box.width).toBeGreaterThan(20);
  expect(box.height).toBeGreaterThan(10);
});
