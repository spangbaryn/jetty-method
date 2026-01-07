import { defineType, defineField } from 'sanity'

/**
 * Sketch block - Card container for diagrams/illustrations
 *
 * Renders as a tilted card with border and optional caption.
 * Uses Caveat font for handwritten-style caption.
 */
export const sketch = defineType({
  name: 'sketch',
  title: 'Sketch',
  type: 'object',
  icon: () => '🎨',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the image',
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      media: 'image',
    },
    prepare({ caption, media }) {
      return {
        title: caption || 'Sketch',
        media,
      }
    },
  },
})
