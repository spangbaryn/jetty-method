# Prototype: Hybrid Schema (Option 3)

Feature: Content Schema Definition
Option: Hybrid - Portable Text + Custom Block Types
Created: 2026-01-07
Purpose: Demonstrate schema structure for Sanity CMS with inline annotations AND block-level custom types

## Decision: (to be filled after testing)

## Schema Structure

```
schemas/
├── documents/
│   └── chapter.ts        # Main chapter document type
├── objects/
│   ├── section.ts        # Section with portable text content
│   ├── portableText.ts   # Custom portable text with annotations
│   └── blocks/           # Block-level custom types
│       ├── sketch.ts
│       ├── bigQuote.ts
│       ├── painPoints.ts
│       ├── marginNote.ts
│       └── divider.ts
└── index.ts              # Schema exports
```

## Key Concepts

### Inline Annotations (in portable text)
- **Highlight** - Marks text with yellow highlight (like a highlighter pen)

### Block Types (standalone blocks in content)
- **Sketch** - Card container for diagrams with optional caption
- **BigQuote** - Large decorative block quote
- **PainPoints** - List with "Sound familiar?" label and tilde markers
- **MarginNote** - Sidebar callout with handwritten style
- **Divider** - Section separator with decorative symbol

## Authoring Experience

Authors write prose in rich text (portable text) with:
1. Standard formatting (bold, italic, links, headings)
2. Inline highlight annotation (select text → apply highlight)
3. Insert block-level components where needed (+ button → choose block type)

## Querying

```groq
*[_type == "chapter" && slug.current == $slug][0] {
  title,
  intro,
  sections[] {
    _key,
    heading,
    content[] {
      // Portable text blocks with custom types
      _type == "sketch" => {
        _type,
        image,
        caption
      },
      _type == "bigQuote" => {
        _type,
        text
      },
      // ... etc
    }
  }
}
```
