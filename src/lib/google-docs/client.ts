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

import { SignJWT, importPKCS8 } from 'jose'
import { parseChapter, parseBook, type ParsedChapter } from './parser'

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

// Cached access token
let cachedToken: { token: string; expiry: number } | null = null

/**
 * Reformat a PEM key to ensure it's in the exact format jose expects
 * - Strips and rebuilds PEM structure
 * - Removes any hidden characters (carriage returns, etc.)
 * - Ensures proper 64-character line breaks
 * - Adds final newline
 */
function reformatPem(key: string): string {
  // First normalize escaped newlines from env vars
  let normalized = key.replace(/\\n/g, '\n')

  // Debug logging
  console.log('[GDocs Key] Input length:', key.length)
  console.log('[GDocs Key] Has escaped newlines:', key.includes('\\n'))

  // Extract the key type and base64 content
  const pkcs8Match = normalized.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/)
  const pkcs1Match = normalized.match(/-----BEGIN RSA PRIVATE KEY-----([\s\S]*?)-----END RSA PRIVATE KEY-----/)

  if (pkcs8Match) {
    // Extract base64 content, remove ALL whitespace and non-base64 characters
    const base64Content = pkcs8Match[1].replace(/[^A-Za-z0-9+/=]/g, '')

    console.log('[GDocs Key] Format: PKCS#8')
    console.log('[GDocs Key] Base64 length:', base64Content.length)

    // Rebuild with proper 64-char line breaks
    const lines: string[] = []
    for (let i = 0; i < base64Content.length; i += 64) {
      lines.push(base64Content.slice(i, i + 64))
    }

    const reformatted = `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`
    console.log('[GDocs Key] Reformatted length:', reformatted.length)
    console.log('[GDocs Key] First 80 chars:', reformatted.substring(0, 80))

    return reformatted
  }

  if (pkcs1Match) {
    // PKCS#1 format - jose doesn't support this directly
    // For now, log and return as-is (will fail, but with clear error)
    console.log('[GDocs Key] Format: PKCS#1 (not supported by jose)')
    console.log('[GDocs Key] You need to convert your key to PKCS#8 format')
    return normalized
  }

  // Unknown format
  console.log('[GDocs Key] Unknown format - first 60 chars:', normalized.substring(0, 60))
  return normalized
}

/**
 * Create a signed JWT for Google service account authentication
 * Uses jose library which uses WebCrypto (works on Vercel/OpenSSL 3.0)
 */
async function createSignedJwt(config: GoogleDocsConfig): Promise<string> {
  if (!config.serviceAccountEmail || !config.privateKey) {
    throw new Error('Google Docs not configured: missing service account credentials')
  }

  const now = Math.floor(Date.now() / 1000)
  const expiry = now + 3600 // 1 hour

  // Reformat key to ensure proper PEM structure for jose
  const pkcs8Key = reformatPem(config.privateKey)

  // Import the private key using jose (WebCrypto-based, no OpenSSL)
  const privateKey = await importPKCS8(pkcs8Key, 'RS256')

  // Create and sign the JWT
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(config.serviceAccountEmail)
    .setSubject(config.serviceAccountEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(expiry)
    .sign(privateKey)

  return jwt
}

/**
 * Exchange a signed JWT for an access token from Google
 */
async function exchangeJwtForToken(jwt: string): Promise<{ token: string; expiry: number }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange JWT for token: ${error}`)
  }

  const data = await response.json()
  return {
    token: data.access_token,
    expiry: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute for safety
  }
}

/**
 * Get an access token using service account credentials
 * Uses jose for JWT signing (WebCrypto-based, works on Vercel)
 */
async function getAccessToken(config: GoogleDocsConfig): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiry) {
    return cachedToken.token
  }

  // Create a signed JWT and exchange it for an access token
  const jwt = await createSignedJwt(config)
  cachedToken = await exchangeJwtForToken(jwt)

  return cachedToken.token
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
 * Fetch entire book from a single Google Doc
 * Splits on H1 headings - each H1 becomes a chapter
 */
export async function fetchBook(documentId: string): Promise<ParsedChapter[]> {
  const content = await fetchDocument(documentId)
  return parseBook(content)
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
