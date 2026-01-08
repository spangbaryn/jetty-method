import { defineType, defineField } from 'sanity'
import { PainPointsPreview } from '../../components/previews/PainPointsPreview'

/**
 * PainPoints block - List with "Sound familiar?" label
 *
 * Renders as a labeled list with tilde (~) markers in red.
 * Uses Caveat font for the label.
 */
export const painPoints = defineType({
  name: 'painPoints',
  title: 'Pain Points',
  type: 'object',
  icon: () => '😫',
  components: {
    preview: PainPointsPreview,
  },
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      initialValue: 'Sound familiar?',
      description: 'Header text above the list',
    }),
    defineField({
      name: 'items',
      title: 'Pain Points',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      items: 'items',
    },
    prepare({ label, items }) {
      return {
        title: label || 'Pain Points',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})
