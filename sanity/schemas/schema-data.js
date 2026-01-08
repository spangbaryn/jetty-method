/**
 * Schema Data Export
 *
 * Plain JavaScript objects representing schema structure for testing.
 * These match the TypeScript schema definitions but without Sanity runtime dependencies.
 */

const chapter = {
  name: 'chapter',
  title: 'Chapter',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'intro', type: 'text' },
    { name: 'order', type: 'number' },
    { name: 'sections', type: 'array', of: [{ type: 'section' }] },
  ],
};

const section = {
  name: 'section',
  title: 'Section',
  type: 'object',
  fields: [
    { name: 'heading', type: 'string' },
    { name: 'anchor', type: 'slug' },
    { name: 'content', type: 'portableText' },
  ],
};

const portableText = {
  name: 'portableText',
  title: 'Content',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        annotations: [
          { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
          {
            name: 'highlight',
            type: 'object',
            fields: [
              {
                name: 'style',
                type: 'string',
                options: {
                  list: [
                    { title: 'Yellow', value: 'yellow' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
    { type: 'sketch' },
    { type: 'bigQuote' },
    { type: 'painPoints' },
    { type: 'marginNote' },
    { type: 'divider' },
  ],
};

const sketch = {
  name: 'sketch',
  title: 'Sketch',
  type: 'object',
  fields: [
    { name: 'image', type: 'image' },
    { name: 'alt', type: 'string' },
    { name: 'caption', type: 'string' },
  ],
};

const bigQuote = {
  name: 'bigQuote',
  title: 'Big Quote',
  type: 'object',
  fields: [
    { name: 'text', type: 'text' },
    { name: 'attribution', type: 'string' },
  ],
};

const painPoints = {
  name: 'painPoints',
  title: 'Pain Points',
  type: 'object',
  fields: [
    { name: 'label', type: 'string' },
    { name: 'items', type: 'array', of: [{ type: 'string' }] },
  ],
};

const marginNote = {
  name: 'marginNote',
  title: 'Margin Note',
  type: 'object',
  fields: [
    { name: 'content', type: 'text' },
  ],
};

const divider = {
  name: 'divider',
  title: 'Divider',
  type: 'object',
  fields: [
    { name: 'symbol', type: 'string' },
  ],
};

module.exports = {
  schemaTypes: [
    chapter,
    section,
    portableText,
    sketch,
    bigQuote,
    painPoints,
    marginNote,
    divider,
  ],
};
