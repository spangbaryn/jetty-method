import { ChapterTitle, ChapterIntro, SectionHeading, ChapterSidebar } from '@/components/chapter'

const BOOK_TITLE = 'The Jetty Method'

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
    intro: 'Something happened in 2023 that most people missed. AI got good at writing code. Actually good. The kind of good where a clear prompt produces software you can use today and iterate on tomorrow.',
    sections: [
      {
        id: 'the-breakthrough',
        title: 'The Breakthrough',
        content: 'This moment was sixty years in the making. We started with machine code: raw ones and zeros, readable only by specialists. Assembly gave us words for numbers. Languages like Python let us write code that almost looked like English. Each step lowered the barrier and let more people in. Interfacing with code through natural language is the final step. The barrier is now almost gone. Computers have finally learned to speak human.'
      },
      {
        id: 'what-more-people-in-means',
        title: 'What "More People In" Actually Means',
        content: 'Letting more people in doesn\'t mean more engineers. It means people who already understand problems, often better than anyone else, can now turn that understanding directly into software. No translation layer. No waiting. No gatekeepers. A product marketer can build a tool that pulls customer language from sales calls, support tickets, and surveys—then continuously updates positioning based on how customers actually talk. A salesperson can create a lightweight internal app that tracks deal patterns, surfaces objections by segment, and generates tailored follow-ups based on what\'s worked before. A CEO can test product–market fit expansion by directly extending what customers already use. A solo founder can go from idea to usable product in weeks, not months. In each case, the breakthrough isn\'t technical skill. It\'s proximity to the problem. The people closest to the work can now build the tools they wish existed. Software stops being something you request and becomes something you do. That\'s what it means to let more people in.'
      },
      {
        id: 'one-person-real-software',
        title: 'One Person, Real Software',
        content: 'For most of the history of software, the limiting factor wasn\'t ideas. It was coordination. Building something real required teams, funding, approval, planning cycles, and careful negotiation over how precious engineering time should be spent. Even small ideas had to justify themselves in advance. Discussion often replaced action, and momentum died long before reality ever had a chance to weigh in. That constraint is gone. Today, a single person can bring something real into the world with software. Not a prototype. Not a mockup. Not a slide deck. A thing that actually works. This changes more than how fast we build. It changes the leverage a single person can wield.'
      },
      {
        id: 'from-meetings-to-artifacts',
        title: 'From Meetings to Artifacts',
        content: 'Inside companies, this shift is already visible. Instead of proposing ideas through meetings, documents, and alignment rituals, individuals are building working tools that solve their own operational problems. A workflow that once required buy-in can now be created quietly, used immediately, and judged on a single criterion: does it help? Software becomes the proposal. This reverses a long-standing dynamic. Instead of asking for permission to spend time, people can spend time creating value and then let reality do the arguing. Execution replaces persuasion. The fastest path to clarity is no longer consensus. It is contact with reality.'
      },
      {
        id: 'the-solo-builder-advantage',
        title: 'The Solo Builder Advantage',
        content: 'Outside of companies, the implications are even more profound. For the first time, solo builders are structurally advantaged. A single person can identify a problem they deeply understand, build a functional solution in days or weeks, put it in front of real users, and iterate without ceremony or delay. There\'s no consensus tax. No roadmap theater. No organizational gravity pulling decisions away from reality. What might take a well-funded startup months to align around, one person can test in a weekend. This isn\'t about replacing teams. It\'s about not needing one too early. Speed here isn\'t about output for its own sake. It\'s about learning. The faster something exists, the faster it can be proven wrong or right. And the sooner you\'re wrong, the sooner you can adjust. That feedback loop is the real advantage.'
      },
      {
        id: 'the-paradox-of-power',
        title: 'The Paradox of Power',
        content: 'But this new power comes with a problem. If you\'ve tried building software with AI-driven tools like Lovable, Claude Code, or Bolt, you\'ve probably felt it. Things that look simple aren\'t. Small changes break working code. Logic that used to be obvious becomes opaque. Progress feels fast until it suddenly isn\'t. You can build more than ever before. But you can also get lost faster than ever before. The old constraints are gone. The old practices don\'t work either.'
      },
      {
        id: 'why-a-new-method-is-needed',
        title: 'Why a New Method Is Needed',
        content: 'When I first started building software this way, I ran into these problems again and again. Not because I lacked ideas, but because I lacked a way of working that fit this new reality. I wasn\'t starting from zero. I\'d spent over a decade in product management at venture-funded startups, working closely with engineering teams and helping ship complex systems through disciplined principles and workflows. What became clear very quickly was this: Natural-language coding doesn\'t eliminate the need for rigor. It changes where rigor lives. The challenge isn\'t writing code anymore. It\'s steering it.'
      },
      {
        id: 'the-jetty-method',
        title: 'The Jetty Method',
        content: 'The Jetty Method is a practical framework for building real software without an engineering background. It is designed for a world where individuals can move fast, but need structure to avoid chaos. It\'s not about becoming an engineer. It\'s about thinking clearly, building intentionally, and staying in control as you move from idea to reality.'
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

  // Build chapter list for sidebar
  const chapterSlugs = Object.keys(chapters)
  const chapterList = chapterSlugs.map((s) => ({
    slug: s,
    title: chapters[s].title,
  }))

  // Get sections for current chapter TOC
  const sectionList = chapter.sections.map((s) => ({
    id: s.id,
    title: s.title,
  }))

  // Find next chapter
  const currentIndex = chapterSlugs.indexOf(slug)
  const nextSlug = chapterSlugs[currentIndex + 1]
  const nextChapter = nextSlug ? { slug: nextSlug, title: chapters[nextSlug].title } : null

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
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(chapters).map((slug) => ({ slug }))
}
