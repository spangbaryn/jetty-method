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
  return (
    <aside
      data-testid="chapter-sidebar"
      className="w-full md:w-64 shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto p-6 md:py-12 md:pr-8 border-b md:border-b-0 border-gray-200"
    >
      <a
        href="/"
        data-testid="sidebar-book-title"
        className="inline-flex items-center gap-2.5 font-caveat text-2xl text-white bg-[#2c2c2c] px-5 py-3 rounded-lg no-underline mb-10 whitespace-nowrap"
      >
        <span className="text-lg">☰</span>
        {bookTitle}
      </a>

      <nav data-testid="chapter-list">
        <ul className="space-y-2">
          {chapters.map((chapter) => {
            const isActive = chapter.slug === currentSlug
            return (
              <li key={chapter.slug}>
                <a
                  href={`/chapters/${chapter.slug}`}
                  data-testid={isActive ? 'chapter-link-active' : undefined}
                  className={`block py-1 text-sm ${
                    isActive
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {chapter.title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {sections.length > 0 && (
        <nav data-testid="section-toc" className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">
            On this page
          </h3>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {nextChapter && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href={`/chapters/${nextChapter.slug}`}
            data-testid="next-chapter-link"
            className="block text-sm text-blue-600 hover:text-blue-800"
          >
            Next: {nextChapter.title} →
          </a>
        </div>
      )}
    </aside>
  )
}
