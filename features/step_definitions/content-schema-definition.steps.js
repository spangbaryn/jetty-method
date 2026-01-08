const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const path = require('path');

// Schema storage for test context
let schemaTypes;
let currentSchema;
let validationErrors = [];

// Helper to find a schema by name
function findSchema(name) {
  return schemaTypes.find(s => s.name === name);
}

// Helper to find a field in a schema
function findField(schema, fieldName) {
  return schema.fields?.find(f => f.name === fieldName);
}

// Helper to find block types in portableText
function findBlockType(schema, typeName) {
  const ofArray = schema.of || [];
  return ofArray.find(item => item.type === typeName || item.name === typeName);
}

// Helper to find annotation in block marks
function findAnnotation(schema, annotationName) {
  const blockDef = schema.of?.find(item => item.type === 'block');
  const annotations = blockDef?.marks?.annotations || [];
  return annotations.find(a => a.name === annotationName);
}

// INTEGRATION SCENARIO STEPS

Given('the Sanity schema configuration exists', async function () {
  // Import schema types from the prototype location (will be moved to sanity/ in implementation)
  const schemaPath = path.resolve(__dirname, '../../sanity/schemas/index');

  try {
    const schemaModule = require(schemaPath);
    schemaTypes = schemaModule.schemaTypes;
    expect(schemaTypes).toBeDefined();
    expect(Array.isArray(schemaTypes)).toBe(true);
  } catch (error) {
    // If sanity/schemas doesn't exist yet, check prototype location
    const prototypePath = path.resolve(__dirname, '../../prototypes/feature-26-hybrid-schema/schemas/index');
    const schemaModule = require(prototypePath);
    schemaTypes = schemaModule.schemaTypes;
    expect(schemaTypes).toBeDefined();
  }
});

When('the schemas are validated', async function () {
  validationErrors = [];

  // Basic validation: check each schema has required properties
  for (const schema of schemaTypes) {
    if (!schema.name) {
      validationErrors.push(`Schema missing 'name' property`);
    }
    if (!schema.type) {
      validationErrors.push(`Schema '${schema.name}' missing 'type' property`);
    }
  }
});

Then('all schema types are registered', async function () {
  const expectedTypes = ['chapter', 'section', 'portableText', 'sketch', 'bigQuote', 'painPoints', 'marginNote', 'divider'];

  for (const typeName of expectedTypes) {
    const found = findSchema(typeName);
    expect(found, `Schema '${typeName}' should be registered`).toBeDefined();
  }
});

Then('no schema validation errors occur', async function () {
  expect(validationErrors).toHaveLength(0);
});

// SCHEMA DEFINITION STEPS

Given('a chapter schema definition', async function () {
  currentSchema = findSchema('chapter');
  expect(currentSchema, 'Chapter schema should exist').toBeDefined();
});

Given('a section schema definition', async function () {
  currentSchema = findSchema('section');
  expect(currentSchema, 'Section schema should exist').toBeDefined();
});

Given('a portableText schema definition', async function () {
  currentSchema = findSchema('portableText');
  expect(currentSchema, 'PortableText schema should exist').toBeDefined();
});

Given('a sketch schema definition', async function () {
  currentSchema = findSchema('sketch');
  expect(currentSchema, 'Sketch schema should exist').toBeDefined();
});

Given('a bigQuote schema definition', async function () {
  currentSchema = findSchema('bigQuote');
  expect(currentSchema, 'BigQuote schema should exist').toBeDefined();
});

Given('a painPoints schema definition', async function () {
  currentSchema = findSchema('painPoints');
  expect(currentSchema, 'PainPoints schema should exist').toBeDefined();
});

Given('a marginNote schema definition', async function () {
  currentSchema = findSchema('marginNote');
  expect(currentSchema, 'MarginNote schema should exist').toBeDefined();
});

// FIELD VALIDATION STEPS

Then('it has a {string} field of type {string}', async function (fieldName, fieldType) {
  const field = findField(currentSchema, fieldName);
  expect(field, `Field '${fieldName}' should exist`).toBeDefined();
  expect(field.type).toBe(fieldType);
});

Then('it has an {string} field of type {string}', async function (fieldName, fieldType) {
  const field = findField(currentSchema, fieldName);
  expect(field, `Field '${fieldName}' should exist`).toBeDefined();
  expect(field.type).toBe(fieldType);
});

Then('it has a {string} field that is an array of {string} objects', async function (fieldName, itemType) {
  const field = findField(currentSchema, fieldName);
  expect(field, `Field '${fieldName}' should exist`).toBeDefined();
  expect(field.type).toBe('array');

  const ofArray = field.of || [];
  const hasItemType = ofArray.some(item => item.type === itemType);
  expect(hasItemType, `Array should contain '${itemType}' items`).toBe(true);
});

Then('it has an {string} field that is an array of strings', async function (fieldName) {
  const field = findField(currentSchema, fieldName);
  expect(field, `Field '${fieldName}' should exist`).toBeDefined();
  expect(field.type).toBe('array');

  const ofArray = field.of || [];
  const hasStringType = ofArray.some(item => item.type === 'string');
  expect(hasStringType, 'Array should contain string items').toBe(true);
});

// BLOCK TYPE VALIDATION STEPS

Then('it includes the {string} block type', async function (blockTypeName) {
  const blockType = findBlockType(currentSchema, blockTypeName);
  expect(blockType, `Block type '${blockTypeName}' should be included`).toBeDefined();
});

// ANNOTATION VALIDATION STEPS

Then('it includes a {string} annotation', async function (annotationName) {
  const annotation = findAnnotation(currentSchema, annotationName);
  expect(annotation, `Annotation '${annotationName}' should exist`).toBeDefined();
});

Then('the {string} annotation has a {string} field with color options', async function (annotationName, fieldName) {
  const annotation = findAnnotation(currentSchema, annotationName);
  expect(annotation, `Annotation '${annotationName}' should exist`).toBeDefined();

  const field = annotation.fields?.find(f => f.name === fieldName);
  expect(field, `Field '${fieldName}' should exist on annotation`).toBeDefined();

  // Check it has options with a list
  expect(field.options?.list, 'Field should have color options list').toBeDefined();
  expect(field.options.list.length).toBeGreaterThan(0);
});
