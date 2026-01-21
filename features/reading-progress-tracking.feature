Feature: Reading Progress Tracking
  Track user's furthest read position and enable resuming from that point

  Approach: Intersection Observer tracking furthest read section

  # Integration Contract:
  # Entry Point: Homepage / and Chapter pages /chapters/[slug]
  # Caller Code: src/app/page.tsx renders ResumeReadingButton
  #              src/app/chapters/[slug]/page.tsx includes ReadingProgressTracker

# INTEGRATION SCENARIO
Scenario: Resume button appears on homepage when user has reading progress
  Given I have previously read to "the-jetty-method" section "what-is-a-jetty"
  When I visit the home page
  Then I see a "Pick up where you left off" button under the tagline
  And the button links to "/chapters/the-jetty-method#what-is-a-jetty"

# FEATURE SCENARIOS
Scenario: Clicking resume button navigates to furthest read position
  Given I have previously read to "the-jetty-method" section "what-is-a-jetty"
  And I am on the home page
  When I click the "Pick up where you left off" button
  Then I am on the chapter page for "the-jetty-method"
  And the page is scrolled to section "what-is-a-jetty"

Scenario: Reading progress is tracked as user scrolls through sections
  Given I am on the chapter page for "the-jetty-method"
  When I scroll past section "what-is-a-jetty"
  Then my reading progress is saved as "the-jetty-method" section "what-is-a-jetty"

Scenario: Reading progress only moves forward (never regresses)
  Given I have previously read to "the-jetty-method" section "building-the-jetty"
  And I am on the chapter page for "the-jetty-method"
  When I scroll to section "what-is-a-jetty"
  Then my reading progress remains "the-jetty-method" section "building-the-jetty"

Scenario: No resume button shown for first-time visitors
  Given I have no reading progress saved
  When I visit the home page
  Then I do not see a "Pick up where you left off" button

# SPEED MODE: All success scenarios above
# STABLE MODE: Will add edge cases (deleted sections, corrupted localStorage, etc.)
