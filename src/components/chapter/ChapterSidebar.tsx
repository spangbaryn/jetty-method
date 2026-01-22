'use client'

import { useState } from 'react'
import { WaitlistCard } from '@/components/waitlist/WaitlistCard'

interface SectionInfo {
  id: string
  title: string
}

interface ChapterInfo {
  slug: string
  title: string
}

interface ChapterSidebarProps {
  bookTitle: string
  currentSlug: string
  chapters: ChapterInfo[]
  sections: SectionInfo[]
  nextChapter: ChapterInfo | null
}

export function ChapterSidebar({ bookTitle, currentSlug, chapters, sections, nextChapter }: ChapterSidebarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const currentChapter = chapters.find((c) => c.slug === currentSlug)

  const handleSectionClick = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      {/* Mobile menu button - toggles between hamburger and X */}
      <button
        data-testid="mobile-menu-button"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="md:hidden fixed top-4 right-4 z-[9999] w-10 h-10 flex items-center justify-center bg-[#2c2c2c] text-white rounded-lg shadow-lg"
        aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="text-xl leading-none">{isDrawerOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile drawer overlay */}
      {isDrawerOpen && (
        <div
          data-testid="mobile-nav-overlay"
          onClick={() => setIsDrawerOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Mobile navigation drawer - conditionally rendered */}
      {isDrawerOpen && (
        <div
          data-testid="mobile-nav-drawer"
          className="md:hidden fixed top-0 right-0 h-full w-72 bg-white z-50"
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Book title */}
            <a
              href="/"
              data-testid="sidebar-book-title"
              className="inline-flex items-center font-caveat text-2xl text-white bg-[#2c2c2c] px-5 py-3 rounded-lg no-underline mb-10 whitespace-nowrap"
            >
              {bookTitle}
            </a>

            {/* Current chapter title */}
            <div className="text-right">
              <h2 className="text-2xl font-bold text-[#1a3a4a] leading-tight mb-6 border-none p-0 m-0">
                {currentChapter?.title}
              </h2>
            </div>

            {/* Section links */}
            {sections.length > 0 && (
              <nav data-testid="section-toc" className="text-right">
                <ul className="space-y-1.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={handleSectionClick}
                        className="block py-0.5 text-base italic text-[#1a3a4a] hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {nextChapter && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                <a
                  href={`/chapters/${nextChapter.slug}`}
                  className="inline-flex items-center justify-end gap-2 text-base font-semibold text-[#1a3a4a] hover:underline"
                >
                  <span>Next: {nextChapter.title}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            )}

            <WaitlistCard />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        data-testid="chapter-sidebar"
        className="hidden md:block w-72 shrink-0 sticky top-0 h-screen overflow-y-auto py-12 pr-8 border-gray-200"
      >
      <a
        href="/"
        data-testid="sidebar-book-title"
        className="inline-flex items-center font-caveat text-2xl text-white bg-[#2c2c2c] px-5 py-3 rounded-lg no-underline mb-10 whitespace-nowrap"
      >
        {bookTitle}
      </a>

      {/* Current chapter title */}
      <div data-testid="chapter-list" className="text-right">
        <h2 className="text-2xl font-bold text-[#1a3a4a] leading-tight mb-6 border-none p-0 m-0">
          {currentChapter?.title}
        </h2>
      </div>

      {/* Section links - italicized, right-aligned */}
      {sections.length > 0 && (
        <nav data-testid="section-toc" className="text-right">
          <ul className="space-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block py-0.5 text-base italic text-[#1a3a4a] hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {nextChapter && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-right">
          <a
            href={`/chapters/${nextChapter.slug}`}
            data-testid="next-chapter-link"
            className="inline-flex items-center justify-end gap-2 text-base font-semibold text-[#1a3a4a] hover:underline"
          >
            <span>Next: {nextChapter.title}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}

      {/* JettyPod Waitlist */}
      <WaitlistCard />
    </aside>
    </>
  )
}
