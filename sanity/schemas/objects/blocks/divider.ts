import { defineType, defineField } from 'sanity'

/**
 * Divider block - Section separator with decorative symbol
 *
 * Renders as horizontal lines with a centered symbol.
 * Supports custom symbols (default: ✦)
 */
export const divider = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: () => '✦',
  fields: [
    defineField({
      name: 'symbol',
      title: 'Symbol',
      type: 'string',
      initialValue: '✦',
      description: 'Decorative symbol in the center',
      options: {
        list: [
          { title: '✦ (Star)', value: '✦' },
          { title: '◆ (Diamond)', value: '◆' },
          { title: '● (Circle)', value: '●' },
          { title: '§ (Section)', value: '§' },
          { title: '~ (Tilde)', value: '~' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      symbol: 'symbol',
    },
    prepare({ symbol }) {
      return {
        title: `─── ${symbol || '✦'} ───`,
      }
    },
  },
})
