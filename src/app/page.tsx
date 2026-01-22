import Image from 'next/image'
import Link from 'next/link'
import { getAllChapters } from '@/lib/content'
import { WaitlistSection } from '@/components/waitlist/WaitlistSection'
import { ResumeReadingButton } from '@/components/reading-progress'
import { Highlight } from '@/components/content/Highlight'

const BOOK_TITLE = 'The Jetty Method'

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
          A practical framework for building real software with AI—<Highlight>without an engineering background</Highlight>.
        </p>
        <p className="mt-4 text-gray-500 font-sans">
          by{' '}
          <a
            href="https://www.linkedin.com/in/espangenberg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900"
          >
            Erik Spangenberg
          </a>
        </p>
        <ResumeReadingButton chapterSlugs={chapters.map(c => c.slug.current)} />
      </header>

      {/* Table of Contents */}
      <nav data-testid="table-of-contents">
        <ul className="space-y-6">
          {chapters.map((chapter) => {
            const isPart = chapter.title.toUpperCase().startsWith('PART')
            return (
              <li key={chapter.slug.current} data-testid="toc-chapter" className={isPart ? 'mt-10 first:mt-0' : ''}>
                <Link
                  href={`/chapters/${chapter.slug.current}`}
                  className={`font-serif font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded ${isPart ? 'text-2xl' : 'text-xl'}`}
                >
                  {chapter.title}
                </Link>
                {chapter.sections && chapter.sections.length > 0 && (
                  <ul className="mt-2 ml-8 space-y-1">
                    {chapter.sections.map((section) => (
                      <li key={section.anchor.current} data-testid="toc-section">
                        <Link
                          href={`/chapters/${chapter.slug.current}#${section.anchor.current}`}
                          className="text-base text-gray-700 hover:text-blue-600 hover:underline transition-colors"
                        >
                          {section.heading}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>

        {chapters.length === 0 && (
          <p className="text-center text-gray-500 italic">
            No chapters found. Check your content source configuration.
          </p>
        )}
      </nav>

      {/* JettyPod Waitlist */}
      <WaitlistSection />
    </main>
  )
}
