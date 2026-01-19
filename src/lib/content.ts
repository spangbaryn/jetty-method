/**
 * Unified Content Layer
 *
 * Provides a single interface for fetching content from either
 * Sanity CMS or Google Docs, based on configuration.
 *
 * Environment variables:
 * - CONTENT_SOURCE: 'sanity' (default) or 'google-docs'
 * - GOOGLE_DOCS_CHAPTER_MAP: JSON mapping of slug -> documentId
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
  fetchChapter,
  isConfigured as isGoogleDocsConfigured,
  type ParsedChapter,
  type ChapterMapping,
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
 * Chapter mapping for Google Docs
 * Configure via GOOGLE_DOCS_CHAPTER_MAP env var as JSON
 * Example: [{"slug":"intro","documentId":"1abc...","order":0}]
 */
function getChapterMappings(): ChapterMapping[] {
  const mapJson = process.env.GOOGLE_DOCS_CHAPTER_MAP
  if (!mapJson) {
    return []
  }

  try {
    return JSON.parse(mapJson) as ChapterMapping[]
  } catch {
    console.error('Invalid GOOGLE_DOCS_CHAPTER_MAP JSON')
    return []
  }
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

/**
 * Get all chapters from configured content source
 */
export async function getAllChapters(): Promise<Chapter[]> {
  const source = getContentSource()

  if (source === 'google-docs' && isGoogleDocsConfigured()) {
    const mappings = getChapterMappings()
    if (mappings.length === 0) {
      console.warn('No Google Docs chapter mappings configured, falling back to Sanity')
      return getAllChaptersSanity()
    }

    try {
      const chapters = await Promise.all(
        mappings.map((m) => fetchChapter(m.documentId, m.slug, m.order))
      )
      return chapters.sort((a, b) => a.order - b.order).map(toChapter)
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
    const mappings = getChapterMappings()
    const mapping = mappings.find((m) => m.slug === slug)

    if (!mapping) {
      console.warn(`No Google Docs mapping for slug "${slug}", falling back to Sanity`)
      return getChapterBySlugSanity(slug)
    }

    try {
      const chapter = await fetchChapter(mapping.documentId, mapping.slug, mapping.order)
      return toChapter(chapter)
    } catch (error) {
      console.error(`Failed to fetch "${slug}" from Google Docs, falling back to Sanity:`, error)
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
    const mappings = getChapterMappings()
    if (mappings.length > 0) {
      return mappings.map((m) => ({ slug: { current: m.slug } }))
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
  const googleDocsConfigured = isGoogleDocsConfigured() && getChapterMappings().length > 0

  return {
    source,
    configured: source === 'sanity' || googleDocsConfigured,
    fallbackAvailable: true, // Sanity is always available as fallback
  }
}
