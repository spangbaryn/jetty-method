import { defineType, defineField } from 'sanity'
import { BigQuotePreview } from '../../../components/previews/BigQuotePreview'

/**
 * BigQuote block - Large decorative block quote
 *
 * Renders with large decorative quotation marks and Caveat font.
 * For impactful standalone quotes.
 */
export const bigQuote = defineType({
  name: 'bigQuote',
  title: 'Big Quote',
  type: 'object',
  icon: () => '💬',
  components: {
    preview: BigQuotePreview,
  },
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Optional source or author',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      attribution: 'attribution',
    },
    prepare({ text, attribution }) {
      return {
        title: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''),
        subtitle: attribution ? `— ${attribution}` : undefined,
      }
    },
  },
})
