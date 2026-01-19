/**
 * Google Docs API Client
 *
 * Fetches content from Google Docs using the Google Docs API.
 * Requires a service account or OAuth credentials.
 *
 * Environment variables:
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key
 * - GOOGLE_DOCS_FOLDER_ID: Optional - folder containing chapter docs
 */

import 'server-only'

import { parseChapter, type ParsedChapter } from './parser'

// Google Docs API types
interface GoogleDocsTextRun {
  content?: string
  textStyle?: {
    bold?: boolean
    italic?: boolean
    link?: { url: string }
  }
}

interface GoogleDocsParagraphElement {
  textRun?: GoogleDocsTextRun
}

interface GoogleDocsParagraph {
  elements?: GoogleDocsParagraphElement[]
  paragraphStyle?: {
    namedStyleType?: string
  }
}

interface GoogleDocsStructuralElement {
  paragraph?: GoogleDocsParagraph
}

interface GoogleDocsBody {
  content?: GoogleDocsStructuralElement[]
}

interface GoogleDocsDocument {
  title: string
  body?: GoogleDocsBody
}

/**
 * Configuration for the Google Docs client
 */
export interface GoogleDocsConfig {
  serviceAccountEmail?: string
  privateKey?: string
  folderId?: string
}

/**
 * Get configuration from environment variables
 */
export function getConfig(): GoogleDocsConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    folderId: process.env.GOOGLE_DOCS_FOLDER_ID,
  }
}

/**
 * Check if Google Docs integration is configured
 */
export function isConfigured(): boolean {
  const config = getConfig()
  return !!(config.serviceAccountEmail && config.privateKey)
}

/**
 * Get an access token using service account credentials
 */
async function getAccessToken(config: GoogleDocsConfig): Promise<string> {
  if (!config.serviceAccountEmail || !config.privateKey) {
    throw new Error('Google Docs not configured: missing service account credentials')
  }

  // Create JWT for service account
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }
  const payload = {
    iss: config.serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  // Note: In production, use a proper JWT library like 'jsonwebtoken'
  // This is a simplified implementation for demonstration
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url')
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url')

  // For now, we'll use a simpler approach that works without crypto
  // In production, implement proper RS256 signing
  const crypto = await import('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${base64Header}.${base64Payload}`)
  const signature = sign.sign(config.privateKey, 'base64url')

  const jwt = `${base64Header}.${base64Payload}.${signature}`

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

/**
 * Extract plain text from a Google Docs document
 * Converts the structured document to our custom markdown syntax
 */
function extractTextFromDoc(doc: GoogleDocsDocument): string {
  const lines: string[] = []

  if (!doc.body?.content) {
    return ''
  }

  for (const element of doc.body.content) {
    if (element.paragraph) {
      const paragraph = element.paragraph
      let text = ''

      // Concatenate all text runs
      for (const elem of paragraph.elements || []) {
        if (elem.textRun?.content) {
          text += elem.textRun.content
        }
      }

      // Remove trailing newline that Google Docs adds
      text = text.replace(/\n$/, '')

      if (text.trim()) {
        // Check paragraph style for headings
        const style = paragraph.paragraphStyle?.namedStyleType
        if (style === 'HEADING_1') {
          lines.push(`# ${text}`)
        } else if (style === 'HEADING_2') {
          lines.push(`## ${text}`)
        } else if (style === 'HEADING_3') {
          lines.push(`### ${text}`)
        } else {
          lines.push(text)
        }
      } else {
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

/**
 * Fetch a document by ID and return its content as plain text
 */
export async function fetchDocument(documentId: string): Promise<string> {
  const config = getConfig()
  const accessToken = await getAccessToken(config)

  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch document: ${error}`)
  }

  const doc: GoogleDocsDocument = await response.json()
  return extractTextFromDoc(doc)
}

/**
 * Fetch a chapter from Google Docs by document ID
 */
export async function fetchChapter(
  documentId: string,
  slug: string,
  order: number
): Promise<ParsedChapter> {
  const content = await fetchDocument(documentId)
  return parseChapter(content, slug, order)
}

/**
 * Chapter mapping configuration
 * Maps chapter slugs to Google Docs document IDs
 */
export interface ChapterMapping {
  slug: string
  documentId: string
  order: number
}

/**
 * Fetch all chapters based on a mapping configuration
 */
export async function fetchAllChapters(
  mappings: ChapterMapping[]
): Promise<ParsedChapter[]> {
  const chapters = await Promise.all(
    mappings.map((m) => fetchChapter(m.documentId, m.slug, m.order))
  )
  return chapters.sort((a, b) => a.order - b.order)
}

/**
 * Simple in-memory cache for development
 */
const cache = new Map<string, { content: string; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

export async function fetchDocumentCached(documentId: string): Promise<string> {
  const cached = cache.get(documentId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.content
  }

  const content = await fetchDocument(documentId)
  cache.set(documentId, { content, timestamp: Date.now() })
  return content
}

export function clearCache(): void {
  cache.clear()
}
