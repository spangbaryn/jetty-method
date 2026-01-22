/**
 * Google Docs Content Parser
 *
 * Converts custom markdown-like syntax from Google Docs into
 * Portable Text format compatible with existing components.
 *
 * Syntax Reference:
 * - # Chapter Title
 * - ## Section Heading
 * - $ text $ → yellow highlight
 * - $$ text $$ → green highlight
 * - $$$ text $$$ → blue highlight
 * - >>> quote —Attribution → BigQuote
 * - ~~ Label\n~ item → PainPoints
 * - [[ content ]] → MarginNote
 * - ![alt](url) caption → Sketch
 * - --- or *** symbol *** → Divider
 * - @@@ text @@@ → Prompt (copyable text block)
 */

// Portable Text block types
export interface PTSpan {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

export interface PTBlock {
  _type: 'block'
  _key: string
  style: 'h1' | 'h2' | 'h3' | 'normal'
  children: PTSpan[]
  markDefs?: MarkDef[]
}

export interface MarkDef {
  _type: string
  _key: string
  style?: 'yellow' | 'green' | 'blue'
  href?: string
}

export interface BigQuote {
  _type: 'bigQuote'
  _key: string
  text: string
  attribution?: string
}

export interface PainPoints {
  _type: 'painPoints'
  _key: string
  label: string
  items: string[]
}

export interface MarginNote {
  _type: 'marginNote'
  _key: string
  content: string
}

export interface Sketch {
  _type: 'sketch'
  _key: string
  alt: string
  image: string
  caption: string
}

export interface Divider {
  _type: 'divider'
  _key: string
  symbol?: string
}

export interface Prompt {
  _type: 'prompt'
  _key: string
  text: string
}

export type PortableTextBlock = PTBlock | BigQuote | PainPoints | MarginNote | Sketch | Divider | Prompt

export interface ParsedSection {
  heading: string
  anchor: { current: string }
  content: PortableTextBlock[]
}

export interface ParsedChapter {
  title: string
  slug: { current: string }
  intro: string | null
  order: number
  sections: ParsedSection[]
}

let keyCounter = 0
function generateKey(): string {
  return `key-${++keyCounter}`
}

export function resetKeyCounter(): void {
  keyCounter = 0
}

/**
 * Parse inline content for highlights and links
 */
function parseInline(text: string): { children: PTSpan[], markDefs: MarkDef[] } {
  const children: PTSpan[] = []
  const markDefs: MarkDef[] = []

  // Regex to match highlights: $$$ (blue), $$ (green), $ (yellow)
  // Order matters: match longer patterns first
  const highlightRegex = /(\$\$\$[^$]+\$\$\$|\$\$[^$]+\$\$|\$[^$]+\$)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = highlightRegex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: text.slice(lastIndex, match.index),
      })
    }

    const raw = match[0]
    let style: 'yellow' | 'green' | 'blue'
    let content: string

    if (raw.startsWith('$$$')) {
      style = 'blue'
      content = raw.slice(3, -3)
    } else if (raw.startsWith('$$')) {
      style = 'green'
      content = raw.slice(2, -2)
    } else {
      style = 'yellow'
      content = raw.slice(1, -1)
    }

    const markKey = generateKey()
    markDefs.push({
      _type: 'highlight',
      _key: markKey,
      style,
    })

    children.push({
      _type: 'span',
      _key: generateKey(),
      text: content,
      marks: [markKey],
    })

    lastIndex = highlightRegex.lastIndex
  }

  // Remaining text
  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: text.slice(lastIndex),
    })
  }

  // If no matches, return the whole text as a single span
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text,
    })
  }

  return { children, markDefs }
}

/**
 * Parse a Google Doc content string into Portable Text blocks
 */
export function parseContent(raw: string): PortableTextBlock[] {
  const lines = raw.split('\n')
  const blocks: PortableTextBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }

    // Chapter heading (# but not ##)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const { children, markDefs } = parseInline(line.slice(2))
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h1',
        children,
        markDefs: markDefs.length > 0 ? markDefs : undefined,
      })
      i++
      continue
    }

    // Section heading (##)
    if (line.startsWith('## ')) {
      const { children, markDefs } = parseInline(line.slice(3))
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children,
        markDefs: markDefs.length > 0 ? markDefs : undefined,
      })
      i++
      continue
    }

    // Subsection heading (###)
    if (line.startsWith('### ')) {
      const { children, markDefs } = parseInline(line.slice(4))
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h3',
        children,
        markDefs: markDefs.length > 0 ? markDefs : undefined,
      })
      i++
      continue
    }

    // BigQuote: >>> text —Attribution
    if (line.startsWith('>>> ')) {
      const content = line.slice(4)
      const match = content.match(/^(.+?)\s*—(.+)$/)
      blocks.push({
        _type: 'bigQuote',
        _key: generateKey(),
        text: match ? match[1].trim() : content,
        attribution: match ? match[2].trim() : undefined,
      })
      i++
      continue
    }

    // PainPoints: ~~ Label followed by ~ items
    if (line.startsWith('~~ ')) {
      const label = line.slice(3)
      const items: string[] = []
      i++
      while (i < lines.length && lines[i].startsWith('~ ')) {
        items.push(lines[i].slice(2))
        i++
      }
      blocks.push({
        _type: 'painPoints',
        _key: generateKey(),
        label,
        items,
      })
      continue
    }

    // MarginNote: [[ content ]]
    if (line.startsWith('[[ ') && line.endsWith(' ]]')) {
      blocks.push({
        _type: 'marginNote',
        _key: generateKey(),
        content: line.slice(3, -3),
      })
      i++
      continue
    }

    // Multi-line MarginNote: [[ content
    // more content ]]
    if (line.startsWith('[[ ') && !line.endsWith(' ]]')) {
      let content = line.slice(3)
      i++
      while (i < lines.length && !lines[i].endsWith(' ]]')) {
        content += '\n' + lines[i]
        i++
      }
      if (i < lines.length) {
        content += '\n' + lines[i].slice(0, -3)
        i++
      }
      blocks.push({
        _type: 'marginNote',
        _key: generateKey(),
        content: content.trim(),
      })
      continue
    }

    // Divider: --- or *** symbol ***
    if (line === '---') {
      blocks.push({
        _type: 'divider',
        _key: generateKey(),
      })
      i++
      continue
    }

    const symbolMatch = line.match(/^\*\*\* (.+) \*\*\*$/)
    if (symbolMatch) {
      blocks.push({
        _type: 'divider',
        _key: generateKey(),
        symbol: symbolMatch[1],
      })
      i++
      continue
    }

    // Sketch: ![alt](url) caption
    if (line.startsWith('![')) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*(.*)$/)
      if (match) {
        blocks.push({
          _type: 'sketch',
          _key: generateKey(),
          alt: match[1],
          image: match[2],
          caption: match[3] || '',
        })
      }
      i++
      continue
    }

    // Prompt: @@@ text @@@
    if (line.startsWith('@@@ ') && line.endsWith(' @@@')) {
      blocks.push({
        _type: 'prompt',
        _key: generateKey(),
        text: line.slice(4, -4),
      })
      i++
      continue
    }

    // Multi-line Prompt: @@@ text
    // more text @@@
    if (line.startsWith('@@@ ') && !line.endsWith(' @@@')) {
      let content = line.slice(4)
      i++
      while (i < lines.length && !lines[i].endsWith(' @@@')) {
        content += '\n' + lines[i]
        i++
      }
      if (i < lines.length) {
        content += '\n' + lines[i].slice(0, -4)
        i++
      }
      blocks.push({
        _type: 'prompt',
        _key: generateKey(),
        text: content.trim(),
      })
      continue
    }

    // Regular paragraph
    const { children, markDefs } = parseInline(line)
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children,
      markDefs: markDefs.length > 0 ? markDefs : undefined,
    })
    i++
  }

  return blocks
}

/**
 * Parse a full Google Doc into a Chapter structure
 *
 * Expected format:
 * # Chapter Title
 *
 * Optional intro paragraph (first paragraph after title, before any ## section)
 *
 * ## Section 1
 * Content...
 *
 * ## Section 2
 * Content...
 */
export function parseChapter(raw: string, slug: string, order: number): ParsedChapter {
  const lines = raw.split('\n')
  let title = ''
  let intro: string | null = null
  const sections: ParsedSection[] = []

  let i = 0

  // Find chapter title
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      title = line.slice(2).trim()
      i++
      break
    }
    i++
  }

  // Collect intro (everything between title and first section)
  const introLines: string[] = []
  while (i < lines.length && !lines[i].startsWith('## ')) {
    if (lines[i].trim()) {
      introLines.push(lines[i])
    }
    i++
  }
  if (introLines.length > 0) {
    intro = introLines.join(' ').trim()
  }

  // Parse sections
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim()
      const anchor = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      // Collect section content until next section or end
      const sectionLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('## ')) {
        sectionLines.push(lines[i])
        i++
      }

      const sectionContent = sectionLines.join('\n')
      const content = parseContent(sectionContent)

      sections.push({
        heading,
        anchor: { current: anchor },
        content,
      })
    } else {
      i++
    }
  }

  return {
    title,
    slug: { current: slug },
    intro,
    order,
    sections,
  }
}

/**
 * Parse multiple chapters from a document that contains all chapters
 * separated by # headings
 */
export function parseBook(raw: string): ParsedChapter[] {
  const chapters: ParsedChapter[] = []
  const lines = raw.split('\n')

  let currentChapterLines: string[] = []
  let chapterCount = 0

  for (const line of lines) {
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      // New chapter starting
      if (currentChapterLines.length > 0) {
        const title = currentChapterLines[0].slice(2).trim()
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        chapters.push(parseChapter(currentChapterLines.join('\n'), slug, chapterCount))
        chapterCount++
      }
      currentChapterLines = [line]
    } else {
      currentChapterLines.push(line)
    }
  }

  // Don't forget the last chapter
  if (currentChapterLines.length > 0 && currentChapterLines[0].startsWith('# ')) {
    const title = currentChapterLines[0].slice(2).trim()
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    chapters.push(parseChapter(currentChapterLines.join('\n'), slug, chapterCount))
  }

  return chapters
}
