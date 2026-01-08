import Link from 'next/link'

const BOOK_TITLE = 'The Jetty Method'
const BOOK_TAGLINE = 'A practical framework for building real software with AI—without an engineering background.'

// Book structure: Parts containing chapters
const bookStructure = [
  {
    title: 'Foundations',
    chapters: [
      { slug: 'introduction', title: 'Introduction' },
    ],
  },
  {
    title: 'The Method',
    chapters: [
      { slug: 'discovery', title: 'Discovery' },
      { slug: 'implementation', title: 'Implementation' },
    ],
  },
  {
    title: 'Advanced Topics',
    chapters: [
      { slug: 'scaling', title: 'Scaling Your Project' },
      { slug: 'collaboration', title: 'Working with Teams' },
    ],
  },
]

export default function Home() {
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

        {bookStructure.map((part, partIndex) => (
          <section key={partIndex} data-testid="toc-part" className="mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
              Part {partIndex + 1}: {part.title}
            </h3>
            <ul className="space-y-3 pl-4">
              {part.chapters.map((chapter) => (
                <li key={chapter.slug} data-testid="toc-chapter" className="overflow-hidden">
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="text-xl font-serif text-gray-800 hover:text-blue-600 hover:underline transition-colors block truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                  >
                    {chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </main>
  )
}
