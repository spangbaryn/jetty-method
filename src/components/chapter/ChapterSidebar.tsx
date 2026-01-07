'use client'

interface ChapterInfo {
  slug: string
  title: string
}

interface ChapterSidebarProps {
  bookTitle: string
  currentSlug: string
  chapters: ChapterInfo[]
}

export function ChapterSidebar({ bookTitle, currentSlug, chapters }: ChapterSidebarProps) {
  return (
    <aside
      data-testid="chapter-sidebar"
      className="w-64 shrink-0 sticky top-0 h-screen overflow-y-auto py-12 pr-8"
    >
      <h2
        data-testid="sidebar-book-title"
        className="font-serif text-lg font-bold mb-6"
      >
        {bookTitle}
      </h2>

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
    </aside>
  )
}
