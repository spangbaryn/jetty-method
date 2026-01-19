/**
 * Parser Tests
 *
 * Run with: npx tsx src/lib/google-docs/parser.test.ts
 */

import {
  parseContent,
  parseChapter,
  parseBook,
  resetKeyCounter,
  type PTBlock,
  type BigQuote,
  type PainPoints,
  type MarginNote,
  type Sketch,
  type Divider,
} from './parser'

// Simple test utilities
let testsPassed = 0
let testsFailed = 0

function assert(condition: boolean, message: string): void {
  if (condition) {
    testsPassed++
    console.log(`  ✓ ${message}`)
  } else {
    testsFailed++
    console.log(`  ✗ ${message}`)
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  const passed = JSON.stringify(actual) === JSON.stringify(expected)
  if (passed) {
    testsPassed++
    console.log(`  ✓ ${message}`)
  } else {
    testsFailed++
    console.log(`  ✗ ${message}`)
    console.log(`    Expected: ${JSON.stringify(expected)}`)
    console.log(`    Actual:   ${JSON.stringify(actual)}`)
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n${name}`)
  resetKeyCounter()
  fn()
}

// Tests

describe('parseContent - headings', () => {
  const result = parseContent('# Chapter Title')
  assert(result.length === 1, 'parses single heading')
  assert((result[0] as PTBlock)._type === 'block', 'creates block type')
  assert((result[0] as PTBlock).style === 'h1', 'sets h1 style')
  assertEqual(
    (result[0] as PTBlock).children[0].text,
    'Chapter Title',
    'extracts heading text'
  )
})

describe('parseContent - section headings', () => {
  const result = parseContent('## Section Title')
  assert((result[0] as PTBlock).style === 'h2', 'sets h2 style for ##')

  resetKeyCounter()
  const result3 = parseContent('### Subsection Title')
  assert((result3[0] as PTBlock).style === 'h3', 'sets h3 style for ###')
})

describe('parseContent - highlights', () => {
  resetKeyCounter()
  const result = parseContent('This has $yellow$ highlight')
  const block = result[0] as PTBlock
  assert(block.children.length === 3, 'splits into 3 spans')
  assert(block.children[0].text === 'This has ', 'text before highlight')
  assert(block.children[1].text === 'yellow', 'highlighted text')
  assert(block.children[1].marks?.length === 1, 'has mark')
  assert(block.children[2].text === ' highlight', 'text after highlight')
  assert(block.markDefs?.[0].style === 'yellow', 'mark is yellow')
})

describe('parseContent - green highlight', () => {
  resetKeyCounter()
  const result = parseContent('This has $$green$$ highlight')
  const block = result[0] as PTBlock
  assert(block.markDefs?.[0].style === 'green', 'mark is green for $$')
})

describe('parseContent - blue highlight', () => {
  resetKeyCounter()
  const result = parseContent('This has $$$blue$$$ highlight')
  const block = result[0] as PTBlock
  assert(block.markDefs?.[0].style === 'blue', 'mark is blue for $$$')
})

describe('parseContent - BigQuote', () => {
  resetKeyCounter()
  const result = parseContent('>>> The quote text —Author Name')
  const quote = result[0] as BigQuote
  assert(quote._type === 'bigQuote', 'creates bigQuote type')
  assertEqual(quote.text, 'The quote text', 'extracts quote text')
  assertEqual(quote.attribution, 'Author Name', 'extracts attribution')
})

describe('parseContent - BigQuote without attribution', () => {
  resetKeyCounter()
  const result = parseContent('>>> Just a quote without attribution')
  const quote = result[0] as BigQuote
  assertEqual(quote.text, 'Just a quote without attribution', 'handles no attribution')
  assert(quote.attribution === undefined, 'attribution is undefined')
})

describe('parseContent - PainPoints', () => {
  resetKeyCounter()
  const content = `~~ Common Problems
~ First issue
~ Second issue
~ Third issue`
  const result = parseContent(content)
  const painPoints = result[0] as PainPoints
  assert(painPoints._type === 'painPoints', 'creates painPoints type')
  assertEqual(painPoints.label, 'Common Problems', 'extracts label')
  assertEqual(painPoints.items.length, 3, 'collects all items')
  assertEqual(painPoints.items[0], 'First issue', 'first item correct')
  assertEqual(painPoints.items[2], 'Third issue', 'third item correct')
})

describe('parseContent - MarginNote', () => {
  resetKeyCounter()
  const result = parseContent('[[ This is a side note ]]')
  const note = result[0] as MarginNote
  assert(note._type === 'marginNote', 'creates marginNote type')
  assertEqual(note.content, 'This is a side note', 'extracts content')
})

describe('parseContent - Sketch', () => {
  resetKeyCounter()
  const result = parseContent('![Alt text](image.png) Caption here')
  const sketch = result[0] as Sketch
  assert(sketch._type === 'sketch', 'creates sketch type')
  assertEqual(sketch.alt, 'Alt text', 'extracts alt text')
  assertEqual(sketch.image, 'image.png', 'extracts image url')
  assertEqual(sketch.caption, 'Caption here', 'extracts caption')
})

describe('parseContent - Divider', () => {
  resetKeyCounter()
  const result = parseContent('---')
  const divider = result[0] as Divider
  assert(divider._type === 'divider', 'creates divider type')
  assert(divider.symbol === undefined, 'no symbol for simple divider')
})

describe('parseContent - Divider with symbol', () => {
  resetKeyCounter()
  const result = parseContent('*** ❦ ***')
  const divider = result[0] as Divider
  assert(divider._type === 'divider', 'creates divider type')
  assertEqual(divider.symbol, '❦', 'extracts symbol')
})

describe('parseContent - mixed content', () => {
  resetKeyCounter()
  const content = `# Chapter

Some $highlighted$ text.

>>> A quote —Someone

~~ Problems
~ Issue one
~ Issue two

[[ A note ]]

---

More text.`

  const result = parseContent(content)
  assert(result.length === 7, 'parses all blocks')
  assert((result[0] as PTBlock).style === 'h1', 'first is h1')
  assert((result[1] as PTBlock).style === 'normal', 'second is paragraph')
  assert(result[2]._type === 'bigQuote', 'third is quote')
  assert(result[3]._type === 'painPoints', 'fourth is painPoints')
  assert(result[4]._type === 'marginNote', 'fifth is marginNote')
  assert(result[5]._type === 'divider', 'sixth is divider')
  assert((result[6] as PTBlock).style === 'normal', 'seventh is paragraph')
})

describe('parseChapter', () => {
  resetKeyCounter()
  const content = `# My Chapter

This is the intro paragraph.

## First Section

Some content here.

## Second Section

More content.`

  const chapter = parseChapter(content, 'my-chapter', 0)

  assertEqual(chapter.title, 'My Chapter', 'extracts title')
  assertEqual(chapter.slug.current, 'my-chapter', 'sets slug')
  assertEqual(chapter.order, 0, 'sets order')
  assertEqual(chapter.intro, 'This is the intro paragraph.', 'extracts intro')
  assertEqual(chapter.sections.length, 2, 'has 2 sections')
  assertEqual(chapter.sections[0].heading, 'First Section', 'first section heading')
  assertEqual(chapter.sections[0].anchor.current, 'first-section', 'first section anchor')
  assertEqual(chapter.sections[1].heading, 'Second Section', 'second section heading')
})

describe('parseBook', () => {
  resetKeyCounter()
  const content = `# Chapter One

## Intro Section

Content.

# Chapter Two

## Another Section

More content.`

  const chapters = parseBook(content)

  assertEqual(chapters.length, 2, 'parses 2 chapters')
  assertEqual(chapters[0].title, 'Chapter One', 'first chapter title')
  assertEqual(chapters[0].slug.current, 'chapter-one', 'first chapter slug')
  assertEqual(chapters[1].title, 'Chapter Two', 'second chapter title')
  assertEqual(chapters[1].order, 1, 'second chapter order')
})

// Summary
console.log('\n' + '='.repeat(40))
console.log(`Tests: ${testsPassed} passed, ${testsFailed} failed`)
console.log('='.repeat(40))

if (testsFailed > 0) {
  process.exit(1)
}
