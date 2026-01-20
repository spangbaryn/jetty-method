'use client'

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
  // Find current chapter index for chapter number
  const currentChapterIndex = chapters.findIndex((c) => c.slug === currentSlug)
  const currentChapter = chapters[currentChapterIndex]
  const chapterNumber = currentChapterIndex + 1

  return (
    <aside
      data-testid="chapter-sidebar"
      className="w-full md:w-72 shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto p-6 md:py-12 md:pr-8 border-b md:border-b-0 border-gray-200"
    >
      <a
        href="/"
        data-testid="sidebar-book-title"
        className="inline-flex items-center gap-2.5 font-caveat text-2xl text-white bg-[#2c2c2c] px-5 py-3 rounded-lg no-underline mb-10 whitespace-nowrap"
      >
        <span className="text-lg">☰</span>
        {bookTitle}
      </a>

      {/* Current chapter info - Shape Up style */}
      <div data-testid="chapter-list" className="text-right">
        <p className="text-sm tracking-widest text-gray-500 mb-2">
          CHAPTER {chapterNumber}:
        </p>
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
        <div className="mt-8 text-right">
          <a
            href={`/chapters/${nextChapter.slug}`}
            data-testid="next-chapter-link"
            className="block text-base text-[#1a3a4a] hover:underline"
          >
            Next: {nextChapter.title}
          </a>
        </div>
      )}
    </aside>
  )
}
