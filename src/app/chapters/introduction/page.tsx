import { ChapterTitle, ChapterIntro, SectionHeading, ChapterSidebar } from '@/components/chapter'
import { Highlight, MarginNote, PainPoints, PainPointItem, BigQuote, Divider } from '@/components/content'

const BOOK_TITLE = 'The Jetty Method'

const sections = [
  { id: 'the-breakthrough', title: 'The Breakthrough' },
  { id: 'what-more-people-in-means', title: 'What "More People In" Actually Means' },
  { id: 'one-person-real-software', title: 'One Person, Real Software' },
  { id: 'from-meetings-to-artifacts', title: 'From Meetings to Artifacts' },
  { id: 'the-solo-builder-advantage', title: 'The Solo Builder Advantage' },
  { id: 'the-paradox-of-power', title: 'The Paradox of Power' },
  { id: 'why-a-new-method-is-needed', title: 'Why a New Method Is Needed' },
  { id: 'the-jetty-method', title: 'The Jetty Method' },
]

const chapters = [
  { slug: 'introduction', title: 'Introduction' },
]

export default function IntroductionPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-5xl mx-auto px-4 md:px-8">
      <ChapterSidebar
        bookTitle={BOOK_TITLE}
        currentSlug="introduction"
        chapters={chapters}
        sections={sections}
        nextChapter={null}
      />
      <main className="flex-1 py-12 px-4 md:pl-8 md:pr-0" data-testid="chapter-content">
        <article>
          <ChapterTitle>Introduction</ChapterTitle>
          <ChapterIntro>
            Something happened in 2023 that most people missed. AI got good at writing code. Actually good. The kind of good where a clear prompt produces software you can use today and iterate on tomorrow.
          </ChapterIntro>

          {/* The Breakthrough */}
          <section className="mb-12">
            <SectionHeading id="the-breakthrough">The Breakthrough</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              This moment was sixty years in the making. We started with machine code: raw ones and zeros, readable only by specialists. Assembly gave us words for numbers. Languages like Python let us write code that almost looked like English.
            </p>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Each step lowered the barrier and let more people in. <Highlight>Interfacing with code through natural language is the final step.</Highlight> The barrier is now almost gone. Computers have finally learned to speak human.
            </p>
          </section>

          {/* What "More People In" Actually Means */}
          <section className="mb-12">
            <SectionHeading id="what-more-people-in-means">What "More People In" Actually Means</SectionHeading>
            <MarginNote>
              The people closest to the work can now build the tools they wish existed.
            </MarginNote>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Letting more people in doesn't mean more engineers. It means people who already understand problems, often better than anyone else, can now turn that understanding directly into software. No translation layer. No waiting. No gatekeepers.
            </p>
            <PainPoints>
              <PainPointItem>A product marketer can build a tool that pulls customer language from sales calls, support tickets, and surveys—then continuously updates positioning based on how customers actually talk.</PainPointItem>
              <PainPointItem>A salesperson can create a lightweight internal app that tracks deal patterns, surfaces objections by segment, and generates tailored follow-ups based on what's worked before.</PainPointItem>
              <PainPointItem>A CEO can test product–market fit expansion by directly extending what customers already use.</PainPointItem>
              <PainPointItem>A solo founder can go from idea to usable product in weeks, not months.</PainPointItem>
            </PainPoints>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              In each case, the breakthrough isn't technical skill. It's proximity to the problem. <Highlight>Software stops being something you request and becomes something you do.</Highlight> That's what it means to let more people in.
            </p>
          </section>

          <Divider />

          {/* One Person, Real Software */}
          <section className="mb-12">
            <SectionHeading id="one-person-real-software">One Person, Real Software</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              For most of the history of software, the limiting factor wasn't ideas. It was coordination. Building something real required teams, funding, approval, planning cycles, and careful negotiation over how precious engineering time should be spent.
            </p>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Even small ideas had to justify themselves in advance. Discussion often replaced action, and momentum died long before reality ever had a chance to weigh in.
            </p>
            <BigQuote>
              That constraint is gone.
            </BigQuote>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Today, a single person can bring something real into the world with software. Not a prototype. Not a mockup. Not a slide deck. A thing that actually works. This changes more than how fast we build. It changes the leverage a single person can wield.
            </p>
          </section>

          {/* From Meetings to Artifacts */}
          <section className="mb-12">
            <SectionHeading id="from-meetings-to-artifacts">From Meetings to Artifacts</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Inside companies, this shift is already visible. Instead of proposing ideas through meetings, documents, and alignment rituals, individuals are building working tools that solve their own operational problems.
            </p>
            <MarginNote>
              Software becomes the proposal. Execution replaces persuasion.
            </MarginNote>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              A workflow that once required buy-in can now be created quietly, used immediately, and judged on a single criterion: does it help?
            </p>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              This reverses a long-standing dynamic. Instead of asking for permission to spend time, people can spend time creating value and then let reality do the arguing. <Highlight>The fastest path to clarity is no longer consensus. It is contact with reality.</Highlight>
            </p>
          </section>

          {/* The Solo Builder Advantage */}
          <section className="mb-12">
            <SectionHeading id="the-solo-builder-advantage">The Solo Builder Advantage</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              Outside of companies, the implications are even more profound. For the first time, solo builders are structurally advantaged.
            </p>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              A single person can identify a problem they deeply understand, build a functional solution in days or weeks, put it in front of real users, and iterate without ceremony or delay. There's no consensus tax. No roadmap theater. No organizational gravity pulling decisions away from reality.
            </p>
            <BigQuote>
              What might take a well-funded startup months to align around, one person can test in a weekend.
            </BigQuote>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              This isn't about replacing teams. It's about not needing one too early. Speed here isn't about output for its own sake. It's about learning. The faster something exists, the faster it can be proven wrong or right. And the sooner you're wrong, the sooner you can adjust. That feedback loop is the real advantage.
            </p>
          </section>

          <Divider symbol="◆" />

          {/* The Paradox of Power */}
          <section className="mb-12">
            <SectionHeading id="the-paradox-of-power">The Paradox of Power</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              But this new power comes with a problem. If you've tried building software with AI-driven tools like Lovable, Claude Code, or Bolt, you've probably felt it.
            </p>
            <PainPoints>
              <PainPointItem>Things that look simple aren't.</PainPointItem>
              <PainPointItem>Small changes break working code.</PainPointItem>
              <PainPointItem>Logic that used to be obvious becomes opaque.</PainPointItem>
              <PainPointItem>Progress feels fast until it suddenly isn't.</PainPointItem>
            </PainPoints>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              You can build more than ever before. But you can also get lost faster than ever before. The old constraints are gone. The old practices don't work either.
            </p>
          </section>

          {/* Why a New Method Is Needed */}
          <section className="mb-12">
            <SectionHeading id="why-a-new-method-is-needed">Why a New Method Is Needed</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              When I first started building software this way, I ran into these problems again and again. Not because I lacked ideas, but because I lacked a way of working that fit this new reality.
            </p>
            <MarginNote>
              10+ years in product management taught me how to build features the right way. Just not how to build them myself.
            </MarginNote>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              I wasn't starting from zero. I'd spent over a decade in product management at venture-funded startups, working closely with engineering teams and helping ship complex systems through disciplined principles and workflows.
            </p>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              What became clear very quickly was this: <Highlight>Natural-language coding doesn't eliminate the need for rigor. It changes where rigor lives.</Highlight> The challenge isn't writing code anymore. It's steering it.
            </p>
          </section>

          {/* The Jetty Method */}
          <section className="mb-12">
            <SectionHeading id="the-jetty-method">The Jetty Method</SectionHeading>
            <p className="leading-relaxed font-serif mb-6" data-testid="body-text">
              The Jetty Method is a practical framework for building real software without an engineering background. It is designed for a world where individuals can move fast, but need structure to avoid chaos.
            </p>
            <BigQuote>
              It's not about becoming an engineer. It's about thinking clearly, building intentionally, and staying in control as you move from idea to reality.
            </BigQuote>
          </section>
        </article>
      </main>
    </div>
  )
}
