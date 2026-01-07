import { defineType, defineField } from 'sanity'

/**
 * MarginNote block - Sidebar callout with handwritten style
 *
 * Renders as a cream-colored box with left border and Caveat font.
 * For tangential thoughts, tips, or asides.
 */
export const marginNote = defineType({
  name: 'marginNote',
  title: 'Margin Note',
  type: 'object',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'content',
      title: 'Note Content',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      return {
        title: content?.substring(0, 50) + (content?.length > 50 ? '...' : ''),
        subtitle: 'Margin Note',
      }
    },
  },
})
