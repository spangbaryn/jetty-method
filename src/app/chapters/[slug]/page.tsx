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
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  const chapter = chapters[slug]

  if (!chapter) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Chapter not found</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-8 py-12" data-testid="chapter-content">
      <article>
        <h1 className="text-4xl font-bold mb-6" data-testid="chapter-title">
          {chapter.title}
        </h1>

        <p className="text-xl italic text-gray-600 mb-12" data-testid="chapter-intro">
          {chapter.intro}
        </p>

        {chapter.sections.map((section) => (
          <section key={section.id} className="mb-12">
            <h2 id={section.id} className="text-2xl font-semibold mb-4">
              <a
                href={`#${section.id}`}
                className="hover:underline"
                data-testid="section-anchor"
              >
                {section.title}
              </a>
            </h2>
            <p className="leading-relaxed">
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
