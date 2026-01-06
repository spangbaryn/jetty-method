Feature: Chapter Layout
  Main content area for reading chapters with proper typography and structure

  Epic: Reader Experience
  Approach: Simple Scrolling Page

  # Integration Contract:
  # Entry Point: /chapters/[slug] route
  # Caller Code: src/app/chapters/[slug]/page.tsx

# INTEGRATION SCENARIO (REQUIRED - proves feature is reachable)
Scenario: User can access a chapter page by URL
  Given the app is running
  When I navigate to "/chapters/introduction"
  Then I see the chapter page
  And the page has a main content area

# FEATURE SCENARIOS (required functionality)
Scenario: Chapter displays title and intro
  Given I am on the chapter page for "introduction"
  Then I see the chapter title "Introduction"
  And I see the chapter intro paragraph
  And the intro is styled in italic

Scenario: Chapter displays section headings with anchors
  Given I am on the chapter page for "introduction"
  Then I see section headings
  And each section heading has an anchor link
  When I click a section heading anchor
  Then the URL contains the section anchor

Scenario: Chapter uses correct typography
  Given I am on the chapter page for "introduction"
  Then the body text uses Georgia font
  And the UI elements use system sans-serif font
  And the text has proper line height for readability

# SPEED MODE: All success scenarios above
# STABLE MODE: Will add 404 handling, missing content, loading states
