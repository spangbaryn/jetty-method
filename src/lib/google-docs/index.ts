/**
 * Google Docs Content Integration
 *
 * Provides an alternative content source to Sanity CMS.
 * Content is authored in Google Docs using custom markdown-like syntax
 * and parsed into Portable Text format.
 */

import 'server-only'

export {
  parseContent,
  parseChapter,
  parseBook,
  resetKeyCounter,
  type ParsedChapter,
  type ParsedSection,
  type PortableTextBlock,
  type PTBlock,
  type PTSpan,
  type BigQuote,
  type PainPoints,
  type MarginNote,
  type Sketch,
  type Divider,
} from './parser'

export {
  fetchDocument,
  fetchChapter,
  fetchAllChapters,
  fetchBook,
  fetchDocumentCached,
  clearCache,
  isConfigured,
  getConfig,
  type GoogleDocsConfig,
  type ChapterMapping,
} from './client'
