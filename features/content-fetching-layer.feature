Feature: Content Fetching Layer
  Fetch and display Sanity CMS content on Next.js pages using Pure SSG

  Epic: N/A (standalone feature)
  Approach: Pure Static Generation (SSG)

  # Integration Contract:
  # Entry Point: /chapters/[slug] route
  # Caller Code: src/app/chapters/[slug]/page.tsx imports Sanity client and queries

# INTEGRATION SCENARIO (REQUIRED - proves feature is reachable)
Scenario: User can view chapter content from Sanity
  Given a chapter "introduction" exists in Sanity
  When I navigate to "/chapters/introduction"
  Then I see the chapter title from Sanity
  And I see the chapter introduction text

# FEATURE SCENARIOS (required functionality)
Scenario: Chapter page renders Portable Text content
  Given a chapter with rich text content exists in Sanity
  When I view that chapter page
  Then I see formatted text with headings
  And I see styled block quotes
  And I see custom blocks rendered correctly

Scenario: Static paths are generated from Sanity chapters
  Given multiple chapters exist in Sanity
  When Next.js builds the site
  Then static pages are generated for each chapter slug

Scenario: Chapter sections are fetched and rendered
  Given a chapter with multiple sections exists in Sanity
  When I view that chapter page
  Then I see all sections in order
  And each section displays its title and content

# SPEED MODE: All success scenarios above
# STABLE MODE: Will add error handling (missing chapters, failed queries, invalid content)
