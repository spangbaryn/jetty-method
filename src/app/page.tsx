import Link from 'next/link'
import { getAllChapters } from '@/lib/content'

const BOOK_TITLE = 'The Jetty Method'
const BOOK_TAGLINE = 'A practical framework for building real software with AI—without an engineering background.'

export default async function Home() {
  const chapters = await getAllChapters()

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16">
      {/* Book Header */}
      <header className="mb-16 text-center">
        <h1
          className="text-5xl font-bold mb-6 font-serif"
          data-testid="book-title"
        >
          {BOOK_TITLE}
        </h1>
        <p
          className="text-xl text-gray-600 font-serif italic"
          data-testid="book-tagline"
        >
          {BOOK_TAGLINE}
        </p>
      </header>

      {/* Table of Contents */}
      <nav data-testid="table-of-contents" className="space-y-10">
        <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wide text-gray-500">
          Contents
        </h2>

        <ul className="space-y-4">
          {chapters.map((chapter, index) => (
            <li key={chapter.slug.current} data-testid="toc-chapter" className="overflow-hidden">
              <Link
                href={`/chapters/${chapter.slug.current}`}
                className="text-xl font-serif text-gray-800 hover:text-blue-600 hover:underline transition-colors block truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded flex items-baseline gap-4"
              >
                <span className="text-gray-400 text-sm font-sans">{index + 1}</span>
                <span>{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {chapters.length === 0 && (
          <p className="text-center text-gray-500 italic">
            No chapters found. Check your content source configuration.
          </p>
        )}
      </nav>
    </main>
  )
}
