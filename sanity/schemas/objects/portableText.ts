import { defineType, defineArrayMember } from 'sanity'
import { HighlightInput } from '../components/inputs/HighlightInput'

/**
 * Custom Portable Text configuration
 *
 * Features:
 * - Standard block formatting (headings, paragraphs)
 * - Inline annotations: highlight (marks text with color swatches)
 * - Block types: sketch, bigQuote, painPoints, marginNote, divider
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Content',
  type: 'array',
  of: [
    // Standard text blocks
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          // Standard link
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
          // Custom: Highlight annotation (inline) with color swatch input
          {
            name: 'highlight',
            type: 'object',
            title: 'Highlight',
            icon: () => '🖍️',
            fields: [
              {
                name: 'style',
                type: 'string',
                title: 'Style',
                initialValue: 'yellow',
                components: {
                  input: HighlightInput,
                },
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
    }),

    // Block-level custom types
    defineArrayMember({ type: 'sketch' }),
    defineArrayMember({ type: 'bigQuote' }),
    defineArrayMember({ type: 'painPoints' }),
    defineArrayMember({ type: 'marginNote' }),
    defineArrayMember({ type: 'divider' }),
  ],
})
