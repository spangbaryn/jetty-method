import { ChapterTitle, ChapterIntro, SectionHeading, ChapterSidebar } from '@/components/chapter'
import { Highlight, MarginNote, Sketch, PainPoints, PainPointItem, BigQuote, Divider } from '@/components/content'
import { Prompt } from '@/components/portable-text/blocks/Prompt'

const BOOK_TITLE = 'The Jetty Method'

const chapters = [
  { slug: 'introduction', title: 'Introduction' },
  { slug: 'visual-blocks-demo', title: 'Visual Blocks Demo' },
]

const sections = [
  { id: 'highlights-and-notes', title: 'Highlights and Notes' },
  { id: 'sketches', title: 'Sketches' },
  { id: 'pain-points', title: 'Pain Points' },
  { id: 'quotes', title: 'Quotes' },
  { id: 'prompts', title: 'Prompts' },
]

export default function VisualBlocksDemoPage() {
  return (
    <div className="min-h-screen flex max-w-5xl mx-auto px-8">
      <ChapterSidebar
        bookTitle={BOOK_TITLE}
        currentSlug="visual-blocks-demo"
        chapters={chapters}
        sections={sections}
        nextChapter={null}
      />
      <main className="flex-1 py-12 pl-8" data-testid="chapter-content">
        <article>
          <ChapterTitle>Visual Content Blocks</ChapterTitle>
          <ChapterIntro>
            This chapter demonstrates the visual content blocks available for rich,
            expressive content. These elements help create a more engaging reading experience.
          </ChapterIntro>

          <section className="mb-12">
            <SectionHeading id="highlights-and-notes">Highlights and Notes</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Use <Highlight>highlighted text</Highlight> to draw attention to key concepts.
              This creates a subtle yellow marker effect that helps important ideas stand out
              without disrupting the reading flow.
            </p>

            <MarginNote>
              Margin notes are perfect for asides, personal observations, or supplementary
              thoughts that enrich the main content.
            </MarginNote>

            <p className="leading-relaxed font-serif" data-testid="body-text">
              Margin notes appear as callout boxes with a handwritten feel. They&apos;re great for
              when you want to add context or a personal touch without interrupting the
              main narrative.
            </p>
          </section>

          <Divider />

          <section className="mb-12">
            <SectionHeading id="sketches">Sketches</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Sketches provide a visual container for diagrams, illustrations, or any
              visual content with an optional caption.
            </p>

            <Sketch caption="A simple workflow diagram">
              <div className="text-center py-8 font-caveat text-2xl text-[#555]">
                <div className="flex items-center justify-center gap-4">
                  <span className="border-2 border-[#2c2c2c] rounded-lg px-4 py-2">Input</span>
                  <span>→</span>
                  <span className="border-2 border-[#2c2c2c] rounded-lg px-4 py-2">Process</span>
                  <span>→</span>
                  <span className="border-2 border-[#2c2c2c] rounded-lg px-4 py-2">Output</span>
                </div>
              </div>
            </Sketch>
          </section>

          <Divider symbol="◆" />

          <section className="mb-12">
            <SectionHeading id="pain-points">Pain Points</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Pain point boxes help enumerate problems or challenges in a visually distinct way.
            </p>

            <PainPoints>
              <PainPointItem>Manual deployments are error-prone and time-consuming</PainPointItem>
              <PainPointItem>Lack of visibility into system health and performance</PainPointItem>
              <PainPointItem>Inconsistent environments between development and production</PainPointItem>
            </PainPoints>
          </section>

          <Divider symbol="✦" />

          <section className="mb-12">
            <SectionHeading id="quotes">Quotes</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Big quotes provide emphasis for important statements or memorable phrases.
            </p>

            <BigQuote>
              The best code is no code at all. Every new line of code you write
              is code that has to be debugged and maintained.
            </BigQuote>

            <p className="leading-relaxed font-serif" data-testid="body-text">
              Use quotes sparingly to maintain their impact. They work best for
              key insights or principles that readers should remember.
            </p>
          </section>

          <Divider symbol="●" />

          <section className="mb-12">
            <SectionHeading id="prompts">Prompts</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Prompt blocks display copyable text that readers can use directly.
              Perfect for code snippets, commands, or templates.
            </p>

            <Prompt text="Write a function that validates email addresses using a regular expression." />

            <p className="leading-relaxed font-serif mt-6" data-testid="body-text">
              Click the Copy button to copy the prompt text to your clipboard.
              The button will briefly show &quot;Copied ✓&quot; as confirmation.
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
