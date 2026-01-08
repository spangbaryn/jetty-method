import { ChapterTitle, ChapterIntro, SectionHeading, ChapterSidebar } from '@/components/chapter'
import { PortableText } from '@/components/portable-text'
import { getAllChapters, getChapterBySlug, getChapterSlugs, type Chapter } from '@/lib/sanity'

const BOOK_TITLE = 'The Jetty Method'

interface ChapterPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  const chapter = await getChapterBySlug(slug)

  if (!chapter) {
    return (
      <main className="min-h-screen max-w-3xl mx-auto px-8 py-12" data-testid="not-found-page">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4 font-serif">Chapter not found</h1>
          <p className="text-gray-600 mb-8">
            The chapter you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            data-testid="back-to-home"
          >
            Back to Home
          </a>
        </div>
      </main>
    )
  }

  // Fetch all chapters for sidebar navigation
  const allChapters = await getAllChapters()

  // Build chapter list for sidebar
  const chapterList = allChapters.map((c) => ({
    slug: c.slug.current,
    title: c.title,
  }))

  // Get sections for current chapter TOC
  const sectionList = (chapter.sections || []).map((s) => ({
    id: s.anchor?.current || s.heading.toLowerCase().replace(/\s+/g, '-'),
    title: s.heading,
  }))

  // Find next chapter
  const currentIndex = allChapters.findIndex((c) => c.slug.current === slug)
  const nextChapter = allChapters[currentIndex + 1]
    ? { slug: allChapters[currentIndex + 1].slug.current, title: allChapters[currentIndex + 1].title }
    : null

  return (
    <div className="min-h-screen flex max-w-5xl mx-auto px-8">
      <ChapterSidebar
        bookTitle={BOOK_TITLE}
        currentSlug={slug}
        chapters={chapterList}
        sections={sectionList}
        nextChapter={nextChapter}
      />
      <main className="flex-1 py-12 pl-8" data-testid="chapter-content">
        <article>
          <ChapterTitle>{chapter.title}</ChapterTitle>
          {chapter.intro && <ChapterIntro>{chapter.intro}</ChapterIntro>}

          {(chapter.sections || []).map((section, index) => {
            const sectionId = section.anchor?.current || section.heading.toLowerCase().replace(/\s+/g, '-')
            return (
              <section key={sectionId || index} className="mb-12">
                <SectionHeading id={sectionId}>{section.heading}</SectionHeading>
                {section.content && (
                  <div data-testid="body-text">
                    <PortableText value={section.content} />
                  </div>
                )}
              </section>
            )
          })}
        </article>
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await getChapterSlugs()
  return slugs.map((item) => ({ slug: item.slug.current }))
}
