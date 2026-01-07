import { defineType, defineField } from 'sanity'

export const section = defineType({
  name: 'section',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Section heading (becomes an anchor link)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor ID',
      type: 'slug',
      description: 'URL anchor for this section (auto-generated from heading)',
      options: {
        source: 'heading',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
  },
})
