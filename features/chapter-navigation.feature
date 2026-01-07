Feature: Chapter Navigation
  Left sidebar with book title, chapter list, and section anchors for easy navigation

  Epic: Reader Experience
  Approach: Simple Sticky Sidebar

  # Integration Contract:
  # Entry Point: Sidebar on /chapters/[slug] pages
  # Caller Code: src/app/chapters/[slug]/page.tsx renders <ChapterSidebar>

# INTEGRATION SCENARIO
Scenario: User sees navigation sidebar on chapter page
  Given the app is running
  When I navigate to "/chapters/introduction"
  Then I see the navigation sidebar
  And the sidebar contains the book title

# FEATURE SCENARIOS
Scenario: Sidebar displays list of chapters
  Given I am on the chapter page for "introduction"
  Then I see a list of chapter links in the sidebar
  And the current chapter is highlighted

Scenario: User navigates to different chapter via sidebar
  Given I am on the chapter page for "introduction"
  When I click a different chapter link in the sidebar
  Then I am taken to that chapter page

Scenario: Sidebar displays section anchors for current chapter
  Given I am on the chapter page for "introduction"
  Then I see section anchor links in the sidebar
  When I click a section anchor
  Then the page scrolls to that section

Scenario: Sidebar shows Next Chapter link
  Given I am on the chapter page for "introduction"
  Then I see a "Next Chapter" link
  When I click the "Next Chapter" link
  Then I am taken to the next chapter

Scenario: Sidebar remains visible while scrolling
  Given I am on the chapter page for "introduction"
  When I scroll down the page
  Then the sidebar remains visible (sticky)

# SPEED MODE: All success scenarios above (completed)

# STABLE MODE SCENARIOS - Error Handling and Edge Cases

Scenario: Last chapter does not show Next Chapter link
  Given I am on the last chapter page
  Then I do not see a "Next Chapter" link

Scenario: Chapter with no sections hides section TOC
  Given I am on a chapter page with no sections
  Then I do not see the section TOC

Scenario: Sidebar handles chapter with empty title gracefully
  Given I am on the chapter page for "introduction"
  Then all chapter links in the sidebar have visible text
