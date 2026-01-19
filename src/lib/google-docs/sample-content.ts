/**
 * Sample content demonstrating all syntax types
 *
 * This can be used for testing the parser and as documentation
 * for the custom syntax format.
 */

export const SAMPLE_CHAPTER = `# The Problem With Traditional Planning

Planning feels productive. You make lists, set deadlines, create roadmaps. But here's the uncomfortable truth: $most plans fail not because of bad execution, but because they solved the wrong problem$.

## Why We Over-Plan

~~ Common Planning Traps
~ Confusing activity with progress
~ Optimizing for predictability over learning
~ Treating unknowns as risks instead of opportunities

Planning gives us the $$illusion of control$$ in an inherently uncertain world. We mistake the map for the territory.

>>> The best laid plans of mice and men often go awry. —Robert Burns

[[ Side note: This doesn't mean don't plan. It means hold plans loosely and update them as you learn. ]]

## The Alternative: Adaptive Execution

Instead of planning everything upfront, $$$what if you planned just enough to take the next meaningful step$$$?

This is the core insight behind iterative methods. You don't need to know the whole path—you need to know:

~~ What You Actually Need
~ Where you're trying to go (vision)
~ What's the next experiment to run
~ How you'll know if it worked

---

![A simple diagram showing plan-do-learn cycle](sketch-cycle.png) The iterative cycle: Plan small, do, learn, repeat.

## When Traditional Planning Works

To be fair, traditional planning works great when:

~~ Good Use Cases
~ The problem is well-understood
~ The solution space is constrained
~ Variability is low

Building a house? Plan it out. Building a startup? $$Plan to learn$$.

*** ❦ ***

That's the key insight. Now let's look at how to apply it.
`

/**
 * Run this file to see the parsed output
 *
 * npx tsx src/lib/google-docs/sample-content.ts
 */
if (require.main === module) {
  const { parseChapter } = require('./parser')

  console.log('Parsing sample content...\n')

  const chapter = parseChapter(SAMPLE_CHAPTER, 'planning-problem', 0)

  console.log('='.repeat(60))
  console.log('PARSED CHAPTER')
  console.log('='.repeat(60))
  console.log('\nTitle:', chapter.title)
  console.log('Slug:', chapter.slug.current)
  console.log('Intro:', chapter.intro)
  console.log('Sections:', chapter.sections.length)

  chapter.sections.forEach((section: { heading: string; content: unknown[] }, i: number) => {
    console.log(`\n--- Section ${i + 1}: ${section.heading} ---`)
    console.log(`Content blocks: ${section.content.length}`)
    section.content.forEach((block: unknown, j: number) => {
      const b = block as { _type: string }
      console.log(`  [${j}] ${b._type}`)
    })
  })

  console.log('\n' + '='.repeat(60))
  console.log('Full JSON output:')
  console.log('='.repeat(60))
  console.log(JSON.stringify(chapter, null, 2))
}
