'use client'

interface ChapterSidebarProps {
  bookTitle: string
  currentSlug: string
}

export function ChapterSidebar({ bookTitle, currentSlug }: ChapterSidebarProps) {
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
    </aside>
  )
}
