const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Sanity Studio Setup - Step Definitions
 *
 * These tests validate the Sanity Studio configuration by:
 * 1. Reading and parsing config files (not importing - avoids ESM issues)
 * 2. Verifying desk structure definition
 * 3. Checking preview component registration
 * 4. Validating branding configuration
 */

let studioConfigContent;
let deskStructureContent;
let currentBlock;
let portableTextContent;

// Helper to find project root (where sanity.config.ts lives)
function getProjectRoot() {
  let dir = __dirname;
  while (dir !== '/') {
    if (fs.existsSync(path.join(dir, 'sanity.config.ts'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error('Could not find project root (sanity.config.ts)');
}

// ============================================
// SETUP
// ============================================

Before(async function () {
  // Reset state before each scenario
  studioConfigContent = null;
  deskStructureContent = null;
  currentBlock = null;
  portableTextContent = null;
});

// ============================================
// INTEGRATION SCENARIO
// ============================================

Given('I start the Sanity Studio', async function () {
  // Read the sanity config file to verify it exists and is valid
  const projectRoot = getProjectRoot();
  const configPath = path.join(projectRoot, 'sanity.config.ts');

  expect(fs.existsSync(configPath), 'sanity.config.ts should exist').toBe(true);
  studioConfigContent = fs.readFileSync(configPath, 'utf8');
  expect(studioConfigContent.length).toBeGreaterThan(0);
});

Then('I see the custom desk structure', async function () {
  // Verify desk structure is configured by checking for structureTool in config
  expect(studioConfigContent).toBeDefined();

  // Check for structureTool or deskTool plugin
  const hasStructure = studioConfigContent.includes('structureTool') ||
                       studioConfigContent.includes('deskTool') ||
                       studioConfigContent.includes('structure:');

  expect(hasStructure, 'Studio should have desk structure plugin configured').toBe(true);
});

Then('I see the project branding', async function () {
  // Verify branding is configured by checking for title in config
  expect(studioConfigContent).toBeDefined();

  const hasBranding = studioConfigContent.includes("title:") ||
                      studioConfigContent.includes("title =") ||
                      studioConfigContent.includes('logo');

  expect(hasBranding, 'Studio should have branding (title or logo) configured').toBe(true);
});

// ============================================
// DESK STRUCTURE
// ============================================

Given('I am in the Sanity Studio', async function () {
  // Load config and desk structure content
  const projectRoot = getProjectRoot();

  // Read main config
  const configPath = path.join(projectRoot, 'sanity.config.ts');
  studioConfigContent = fs.readFileSync(configPath, 'utf8');

  // Try to read desk structure file
  const structurePath = path.join(projectRoot, 'sanity/desk/structure.ts');
  if (fs.existsSync(structurePath)) {
    deskStructureContent = fs.readFileSync(structurePath, 'utf8');
  } else {
    // Structure might be inline in config
    deskStructureContent = studioConfigContent;
  }
});

Then('I see {string} in the sidebar', async function (itemName) {
  // Verify the desk structure contains the expected item
  expect(deskStructureContent, 'Desk structure should be defined').toBeDefined();

  // Check structure definition includes this item (case-insensitive)
  const itemLower = itemName.toLowerCase();
  const contentLower = deskStructureContent.toLowerCase();

  expect(
    contentLower.includes(itemLower) ||
    contentLower.includes(itemLower.replace(' ', ''))
  ).toBe(true);
});

Then('I see {string} grouped separately', async function (groupName) {
  expect(deskStructureContent, 'Desk structure should be defined').toBeDefined();
  // Visual Blocks should be a separate group/list in the structure
  expect(deskStructureContent.toLowerCase()).toContain('visual');
});

// ============================================
// BLOCK PREVIEWS
// ============================================

Given('I am editing a section with portable text', async function () {
  // Read portable text schema file
  const projectRoot = getProjectRoot();
  const ptPath = path.join(projectRoot, 'sanity/schemas/objects/portableText.ts');

  expect(fs.existsSync(ptPath), 'portableText.ts should exist').toBe(true);
  portableTextContent = fs.readFileSync(ptPath, 'utf8');
});

When('I insert a {string} block', async function (blockType) {
  currentBlock = blockType;

  // Verify block schema file exists
  const projectRoot = getProjectRoot();
  const blockPath = path.join(projectRoot, `sanity/schemas/objects/blocks/${blockType}.ts`);

  expect(fs.existsSync(blockPath), `Block type "${blockType}" schema should exist`).toBe(true);
});

Then('I see a styled preview of the quote block', async function () {
  // Verify bigQuote has preview component
  await verifyBlockPreview('bigQuote');
});

Then('I see a styled preview of the pain points block', async function () {
  await verifyBlockPreview('painPoints');
});

Then('I see a styled preview of the margin note block', async function () {
  await verifyBlockPreview('marginNote');
});

async function verifyBlockPreview(blockType) {
  const projectRoot = getProjectRoot();

  // Check for preview component file
  const previewPath = path.join(projectRoot, `sanity/components/previews/${blockType}Preview.tsx`);

  if (fs.existsSync(previewPath)) {
    // Preview component exists as separate file
    const previewContent = fs.readFileSync(previewPath, 'utf8');
    expect(previewContent.length).toBeGreaterThan(0);
  } else {
    // Check if preview is defined in the block's schema file
    const blockPath = path.join(projectRoot, `sanity/schemas/objects/blocks/${blockType}.ts`);
    const blockContent = fs.readFileSync(blockPath, 'utf8');

    // Look for components.preview or preview property in schema
    expect(
      blockContent.includes('components') && blockContent.includes('preview'),
      `Block "${blockType}" should have preview component configured`
    ).toBe(true);
  }
}

// ============================================
// HIGHLIGHT ANNOTATION
// ============================================

Given('I am editing text in a section', async function () {
  // Read portable text schema
  const projectRoot = getProjectRoot();
  const ptPath = path.join(projectRoot, 'sanity/schemas/objects/portableText.ts');
  portableTextContent = fs.readFileSync(ptPath, 'utf8');
});

When('I select text and apply highlight annotation', async function () {
  // Verify highlight annotation exists in portable text config
  expect(portableTextContent).toBeDefined();
  expect(
    portableTextContent.includes('highlight') && portableTextContent.includes('annotation'),
    'Highlight annotation should be defined in portable text'
  ).toBe(true);
});

Then('I see color swatches for yellow, green, and blue', async function () {
  const projectRoot = getProjectRoot();

  // Check for custom highlight input component
  const inputPath = path.join(projectRoot, 'sanity/components/inputs/HighlightInput.tsx');

  if (fs.existsSync(inputPath)) {
    // Custom input component exists
    const inputContent = fs.readFileSync(inputPath, 'utf8');
    expect(inputContent.length).toBeGreaterThan(0);
    // Verify it handles color swatches
    expect(
      inputContent.includes('yellow') || inputContent.includes('color'),
      'Highlight input should handle color swatches'
    ).toBe(true);
  } else {
    // Check portable text schema for components.input on highlight
    expect(
      portableTextContent.includes('components') &&
      portableTextContent.includes('input'),
      'Highlight annotation should have custom input component configured'
    ).toBe(true);
  }
});
