import { defineType, defineField } from 'sanity'
import { MarginNotePreview } from '../../../components/previews/MarginNotePreview'

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
  components: {
    preview: MarginNotePreview,
  },
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
