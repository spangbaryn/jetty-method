import { client } from './client'

// Types for chapter data
export interface Section {
  heading: string
  anchor: { current: string } | null
  content: unknown[] // Portable Text blocks
}

export interface Chapter {
  _id: string
  title: string
  slug: { current: string }
  intro: string | null
  order: number
  sections: Section[] | null
}

// Get all chapters (for generateStaticParams and navigation)
export async function getAllChapters(): Promise<Chapter[]> {
  return client.fetch(`
    *[_type == "chapter"] | order(order asc) {
      _id,
      title,
      slug,
      intro,
      order,
      sections[] {
        heading,
        anchor,
        content
      }
    }
  `)
}

// Get a single chapter by slug
export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  return client.fetch(`
    *[_type == "chapter" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      intro,
      order,
      sections[] {
        heading,
        anchor,
        content
      }
    }
  `, { slug })
}

// Get chapter slugs only (lightweight query for static params)
export async function getChapterSlugs(): Promise<{ slug: { current: string } }[]> {
  return client.fetch(`
    *[_type == "chapter"] | order(order asc) {
      slug
    }
  `)
}
