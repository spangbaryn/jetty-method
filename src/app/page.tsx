import Image from 'next/image'
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
        <Image
          src="/jetty-method-logo.png"
          alt="The Jetty Method"
          width={200}
          height={200}
          className="mx-auto mb-8"
          priority
        />
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
      <nav data-testid="table-of-contents">
        <ul className="space-y-6">
          {chapters.map((chapter) => (
            <li key={chapter.slug.current} data-testid="toc-chapter">
              <Link
                href={`/chapters/${chapter.slug.current}`}
                className="text-xl font-serif text-gray-800 hover:text-blue-600 hover:underline transition-colors block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
              >
                {chapter.title}
              </Link>
              {chapter.sections && chapter.sections.length > 0 && (
                <ul className="mt-2 ml-8 space-y-1">
                  {chapter.sections.map((section) => (
                    <li key={section.anchor.current} data-testid="toc-section">
                      <Link
                        href={`/chapters/${chapter.slug.current}#${section.anchor.current}`}
                        className="text-sm text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                      >
                        {section.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
