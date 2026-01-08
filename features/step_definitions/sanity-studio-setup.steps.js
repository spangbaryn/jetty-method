const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

/**
 * Sanity Studio Setup - Step Definitions
 *
 * These tests validate the Sanity Studio configuration by:
 * 1. Importing and inspecting the config exports
 * 2. Verifying desk structure definition
 * 3. Checking preview component registration
 * 4. Validating branding configuration
 */

let studioConfig;
let deskStructure;
let currentBlock;
let portableTextConfig;

// ============================================
// SETUP
// ============================================

Before(async function () {
  // Reset state before each scenario
  studioConfig = null;
  deskStructure = null;
  currentBlock = null;
  portableTextConfig = null;
});

// ============================================
// INTEGRATION SCENARIO
// ============================================

Given('I start the Sanity Studio', async function () {
  // Load the sanity config to verify it's valid
  try {
    studioConfig = require('../../../../sanity.config.ts');
  } catch (e) {
    // Try alternative path or default export
    const configModule = await import('../../../../sanity.config.ts');
    studioConfig = configModule.default || configModule;
  }
});

Then('I see the custom desk structure', async function () {
  // Verify desk structure is configured
  expect(studioConfig).toBeDefined();

  // Check for desk tool or structure configuration
  const hasStructure = studioConfig.plugins?.some(p =>
    p.name === 'structure' || p.name === 'desk'
  ) || studioConfig.structure;

  expect(hasStructure, 'Studio should have custom desk structure configured').toBeTruthy();
});

Then('I see the project branding', async function () {
  // Verify branding is configured
  expect(studioConfig.studio?.components?.logo ||
         studioConfig.title ||
         studioConfig.projectId).toBeDefined();
});

// ============================================
// DESK STRUCTURE
// ============================================

Given('I am in the Sanity Studio', async function () {
  // Load config and desk structure
  try {
    const configModule = await import('../../../../sanity.config.ts');
    studioConfig = configModule.default || configModule;

    // Get desk structure if defined separately
    try {
      const structureModule = await import('../../../../sanity/desk/structure.ts');
      deskStructure = structureModule.default || structureModule.structure;
    } catch {
      // Structure might be inline in config
      deskStructure = studioConfig.structure;
    }
  } catch (e) {
    throw new Error(`Failed to load studio config: ${e.message}`);
  }
});

Then('I see {string} in the sidebar', async function (itemName) {
  // Verify the desk structure contains the expected item
  expect(deskStructure, 'Desk structure should be defined').toBeDefined();

  // Check structure definition includes this item
  // Structure can be a function or an object
  const structureString = JSON.stringify(deskStructure) || deskStructure.toString();
  const itemLower = itemName.toLowerCase();

  expect(
    structureString.toLowerCase().includes(itemLower) ||
    structureString.toLowerCase().includes(itemLower.replace(' ', ''))
  ).toBeTruthy();
});

Then('I see {string} grouped separately', async function (groupName) {
  expect(deskStructure, 'Desk structure should be defined').toBeDefined();
  // Visual Blocks should be a separate group/list in the structure
  const structureString = JSON.stringify(deskStructure) || deskStructure.toString();
  expect(structureString.toLowerCase()).toContain('visual');
});

// ============================================
// BLOCK PREVIEWS
// ============================================

Given('I am editing a section with portable text', async function () {
  // Load portable text schema and preview components
  const schemaModule = await import('../../../../sanity/schemas/index.ts');
  const schemas = schemaModule.schemaTypes || schemaModule.default;

  portableTextConfig = schemas.find(s => s.name === 'portableText');
  expect(portableTextConfig, 'Portable text schema should exist').toBeDefined();
});

When('I insert a {string} block', async function (blockType) {
  currentBlock = blockType;

  // Load the block schema to check for preview configuration
  const schemaModule = await import('../../../../sanity/schemas/index.ts');
  const schemas = schemaModule.schemaTypes || schemaModule.default;

  const blockSchema = schemas.find(s => s.name === blockType);
  expect(blockSchema, `Block type "${blockType}" should exist`).toBeDefined();
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
  // Check for preview component registration
  try {
    const previewModule = await import(`../../../../sanity/components/previews/${blockType}Preview.tsx`);
    expect(previewModule.default || previewModule[`${blockType}Preview`]).toBeDefined();
  } catch {
    // Alternative: check if preview is defined in schema
    const schemaModule = await import('../../../../sanity/schemas/index.ts');
    const schemas = schemaModule.schemaTypes || schemaModule.default;
    const blockSchema = schemas.find(s => s.name === blockType);

    expect(
      blockSchema?.components?.preview || blockSchema?.preview,
      `Block "${blockType}" should have preview component`
    ).toBeDefined();
  }
}

// ============================================
// HIGHLIGHT ANNOTATION
// ============================================

Given('I am editing text in a section', async function () {
  // Same as portable text editing context
  const schemaModule = await import('../../../../sanity/schemas/index.ts');
  const schemas = schemaModule.schemaTypes || schemaModule.default;
  portableTextConfig = schemas.find(s => s.name === 'portableText');
});

When('I select text and apply highlight annotation', async function () {
  // Find highlight annotation in portable text config
  const portableTextSchema = await import('../../../../sanity/schemas/objects/portableText.ts');
  const ptConfig = portableTextSchema.portableText;

  // Navigate to annotations
  const blockMember = ptConfig.of.find(m => m.type === 'block');
  const annotations = blockMember?.marks?.annotations || [];
  const highlight = annotations.find(a => a.name === 'highlight');

  expect(highlight, 'Highlight annotation should exist').toBeDefined();
});

Then('I see color swatches for yellow, green, and blue', async function () {
  // Verify highlight has custom input component with color swatches
  try {
    const inputModule = await import('../../../../sanity/components/inputs/HighlightInput.tsx');
    expect(inputModule.default || inputModule.HighlightInput).toBeDefined();
  } catch {
    // Alternative: check for colorSwatches in schema options
    const portableTextSchema = await import('../../../../sanity/schemas/objects/portableText.ts');
    const ptConfig = portableTextSchema.portableText;
    const blockMember = ptConfig.of.find(m => m.type === 'block');
    const highlight = blockMember?.marks?.annotations?.find(a => a.name === 'highlight');

    // Check if it has component or visual options
    const styleField = highlight?.fields?.find(f => f.name === 'style');
    expect(
      styleField?.components?.input || highlight?.components?.input,
      'Highlight should have custom input component for color swatches'
    ).toBeDefined();
  }
});
