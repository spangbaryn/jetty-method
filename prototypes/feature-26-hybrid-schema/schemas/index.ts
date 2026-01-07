/**
 * Sanity Schema Index
 *
 * Hybrid approach: Portable Text with inline annotations + block-level custom types
 */

// Documents
import { chapter } from './documents/chapter'

// Objects
import { section } from './objects/section'
import { portableText } from './objects/portableText'

// Block types
import { sketch } from './objects/blocks/sketch'
import { bigQuote } from './objects/blocks/bigQuote'
import { painPoints } from './objects/blocks/painPoints'
import { marginNote } from './objects/blocks/marginNote'
import { divider } from './objects/blocks/divider'

export const schemaTypes = [
  // Documents
  chapter,

  // Objects
  section,
  portableText,

  // Block types (must be registered for portable text to reference them)
  sketch,
  bigQuote,
  painPoints,
  marginNote,
  divider,
]
