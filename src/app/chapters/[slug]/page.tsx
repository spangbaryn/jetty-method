import { ChapterTitle, ChapterIntro, SectionHeading } from '@/components/chapter'

interface ChapterPageProps {
  params: Promise<{
    slug: string
  }>
}

// Static chapter data (will be replaced with CMS content later)
const chapters: Record<string, {
  title: string
  intro: string
  sections: Array<{
    id: string
    title: string
    content: string
  }>
}> = {
  introduction: {
    title: 'Introduction',
    intro: 'The Jetty Method is a structured approach to building software with AI assistance. This methodology helps non-engineers write production-quality code using Claude Code.',
    sections: [
      {
        id: 'why-jetty',
        title: 'Why The Jetty Method',
        content: 'Traditional software development requires years of experience to master. The Jetty Method bridges that gap by providing guardrails and structure that let you focus on what you want to build, not how to build it.'
      },
      {
        id: 'core-principles',
        title: 'Core Principles',
        content: 'The method is built on three core principles: structured workflows, incremental delivery, and quality gates. Each principle reinforces the others to create a reliable development process.'
      }
    ]
  },
  // Test chapter for edge case: empty sections
  'empty-test': {
    title: 'Empty Test Chapter',
    intro: 'This chapter has no sections for testing edge cases.',
    sections: []
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  const chapter = chapters[slug]

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

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-8 py-12" data-testid="chapter-content">
      <article>
        <ChapterTitle>{chapter.title}</ChapterTitle>
        <ChapterIntro>{chapter.intro}</ChapterIntro>

        {chapter.sections.map((section) => (
          <section key={section.id} className="mb-12">
            <SectionHeading id={section.id}>{section.title}</SectionHeading>
            <p className="leading-relaxed font-serif" data-testid="body-text">
              {section.content}
            </p>
          </section>
        ))}
      </article>
    </main>
  )
}

export function generateStaticParams() {
  return Object.keys(chapters).map((slug) => ({ slug }))
}
