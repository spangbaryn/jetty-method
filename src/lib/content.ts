/**
 * Unified Content Layer
 *
 * Provides a single interface for fetching content from either
 * Sanity CMS or Google Docs, based on configuration.
 *
 * Environment variables:
 * - CONTENT_SOURCE: 'sanity' (default) or 'google-docs'
 * - GOOGLE_DOCS_BOOK_ID: Single document ID containing entire book (H1s = chapters)
 */

import 'server-only'

import {
  getAllChapters as getAllChaptersSanity,
  getChapterBySlug as getChapterBySlugSanity,
  getChapterSlugs as getChapterSlugsSanity,
  type Chapter,
  type Section,
} from './sanity'

import {
  fetchBook,
  isConfigured as isGoogleDocsConfigured,
  type ParsedChapter,
} from './google-docs'

// Re-export types for consumers
export type { Chapter, Section }

/**
 * Content source configuration
 */
export type ContentSource = 'sanity' | 'google-docs'

export function getContentSource(): ContentSource {
  const source = process.env.CONTENT_SOURCE as ContentSource | undefined
  return source === 'google-docs' ? 'google-docs' : 'sanity'
}

/**
 * Get the book document ID from environment
 */
function getBookId(): string | undefined {
  return process.env.GOOGLE_DOCS_BOOK_ID
}

/**
 * Convert ParsedChapter to Chapter format expected by components
 */
function toChapter(parsed: ParsedChapter): Chapter {
  return {
    _id: `gdocs-${parsed.slug.current}`,
    title: parsed.title,
    slug: parsed.slug,
    intro: parsed.intro,
    order: parsed.order,
    sections: parsed.sections.map((s) => ({
      heading: s.heading,
      anchor: s.anchor,
      content: s.content as unknown[],
    })),
  }
}

// Cache for parsed chapters (avoids re-fetching on each request)
let chaptersCache: ParsedChapter[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 1000 // 1 minute

async function getGoogleDocsChapters(): Promise<ParsedChapter[]> {
  const bookId = getBookId()
  if (!bookId) {
    return []
  }

  // Check cache
  if (chaptersCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return chaptersCache
  }

  const chapters = await fetchBook(bookId)
  chaptersCache = chapters
  cacheTimestamp = Date.now()
  return chapters
}

/**
 * Get all chapters from configured content source
 */
export async function getAllChapters(): Promise<Chapter[]> {
  const source = getContentSource()

  if (source === 'google-docs' && isGoogleDocsConfigured()) {
    const bookId = getBookId()
    if (!bookId) {
      console.warn('No GOOGLE_DOCS_BOOK_ID configured, falling back to Sanity')
      return getAllChaptersSanity()
    }

    try {
      const chapters = await getGoogleDocsChapters()
      return chapters.map(toChapter)
    } catch (error) {
      console.error('Failed to fetch from Google Docs, falling back to Sanity:', error)
      return getAllChaptersSanity()
    }
  }

  return getAllChaptersSanity()
}

/**
 * Get a single chapter by slug from configured content source
 */
export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const source = getContentSource()

  if (source === 'google-docs' && isGoogleDocsConfigured()) {
    const bookId = getBookId()
    if (!bookId) {
      console.warn('No GOOGLE_DOCS_BOOK_ID configured, falling back to Sanity')
      return getChapterBySlugSanity(slug)
    }

    try {
      const chapters = await getGoogleDocsChapters()
      const chapter = chapters.find((c) => c.slug.current === slug)
      if (!chapter) {
        console.warn(`Chapter "${slug}" not found in Google Doc, falling back to Sanity`)
        return getChapterBySlugSanity(slug)
      }
      return toChapter(chapter)
    } catch (error) {
      console.error(`Failed to fetch from Google Docs, falling back to Sanity:`, error)
      return getChapterBySlugSanity(slug)
    }
  }

  return getChapterBySlugSanity(slug)
}

/**
 * Get chapter slugs only (for static generation)
 */
export async function getChapterSlugs(): Promise<{ slug: { current: string } }[]> {
  const source = getContentSource()

  if (source === 'google-docs' && isGoogleDocsConfigured()) {
    const bookId = getBookId()
    if (bookId) {
      try {
        const chapters = await getGoogleDocsChapters()
        return chapters.map((c) => ({ slug: { current: c.slug.current } }))
      } catch {
        // Fall through to Sanity
      }
    }
  }

  return getChapterSlugsSanity()
}

/**
 * Check if content system is properly configured
 */
export function getContentStatus(): {
  source: ContentSource
  configured: boolean
  fallbackAvailable: boolean
} {
  const source = getContentSource()
  const googleDocsConfigured = isGoogleDocsConfigured() && !!getBookId()

  return {
    source,
    configured: source === 'sanity' || googleDocsConfigured,
    fallbackAvailable: true, // Sanity is always available as fallback
  }
}

/**
 * Clear the chapters cache (useful for development)
 */
export function clearContentCache(): void {
  chaptersCache = null
  cacheTimestamp = 0
}
