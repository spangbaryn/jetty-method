Feature: Responsive Design
  Mobile layout where sidebar stacks on top, content adapts, touch-friendly navigation

  Epic: Reader Experience
  Approach: Mobile-First Tailwind

  # Integration Contract:
  # Entry Point: /chapters/introduction viewed on mobile viewport
  # Caller Code: ChapterSidebar.tsx and page layouts

  # INTEGRATION SCENARIO
  Scenario: Chapter page adapts to mobile viewport
    Given I am on the introduction chapter
    When I view the page on a mobile viewport
    Then the sidebar appears above the main content
    And the layout is single-column

  # FEATURE SCENARIOS
  Scenario: Sidebar stacks on mobile
    Given I am on the introduction chapter
    And I am viewing on a mobile viewport
    Then the sidebar is not fixed to the side
    And I can scroll past the sidebar to reach content

  Scenario: Content is readable on mobile
    Given I am on the introduction chapter
    And I am viewing on a mobile viewport
    Then the body text has appropriate padding
    And no horizontal scrolling is required

  Scenario: Desktop layout remains unchanged
    Given I am on the introduction chapter
    When I view the page on a desktop viewport
    Then the sidebar is fixed on the left
    And the content appears beside the sidebar

  # STABLE MODE SCENARIOS - Edge Cases
  Scenario: Very narrow viewport still readable
    Given I am on the introduction chapter
    When I view the page on a very narrow viewport
    Then no horizontal scrolling is required
    And the body text has appropriate padding

  Scenario: Tablet viewport uses mobile layout
    Given I am on the introduction chapter
    When I view the page on a tablet viewport
    Then the sidebar appears above the main content
    And the layout is single-column

  Scenario: Large viewport is constrained
    Given I am on the introduction chapter
    When I view the page on a large viewport
    Then the content width is constrained
    And the sidebar is fixed on the left
