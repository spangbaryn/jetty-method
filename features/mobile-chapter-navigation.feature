Feature: Mobile responsive chapter navigation
  Hamburger slide-out drawer for chapter navigation on mobile devices

  Approach: Hamburger Slide-Out Drawer

  # Integration Contract:
  # Entry Point: /chapters/[slug] on mobile viewport
  # Caller Code: src/app/chapters/[slug]/page.tsx renders ChapterSidebar

# INTEGRATION SCENARIO
Scenario: User can access navigation drawer on mobile
  Given I am on a chapter page on a mobile device
  When I tap the hamburger menu icon
  Then I see the navigation drawer slide in from the left

# FEATURE SCENARIOS
Scenario: Navigation drawer shows chapter sections
  Given the navigation drawer is open
  Then I see the book title
  And I see the current chapter title
  And I see links to all sections in the current chapter

Scenario: User navigates to a section via drawer
  Given the navigation drawer is open
  When I tap a section link
  Then the drawer closes
  And I scroll to that section

Scenario: User closes drawer by tapping outside
  Given the navigation drawer is open
  When I tap outside the drawer
  Then the drawer closes

Scenario: User closes drawer with close button
  Given the navigation drawer is open
  When I tap the close button
  Then the drawer closes

Scenario: Sidebar shows normally on desktop
  Given I am on a chapter page on a desktop device
  Then I see the sidebar visible without a hamburger menu

# STABLE MODE SCENARIOS - Error Handling and Edge Cases

Scenario: Drawer handles chapter with no sections
  Given I am on a chapter page with no sections on a mobile device
  When I tap the hamburger menu icon
  Then I see the navigation drawer
  And I see the book title
  And I see the current chapter title
  But I do not see any section links

Scenario: Drawer handles last chapter without next chapter link
  Given I am on the last chapter on a mobile device
  When I tap the hamburger menu icon
  Then I see the navigation drawer
  But I do not see a next chapter link

Scenario: Drawer closes when pressing Escape key
  Given the navigation drawer is open
  When I press the Escape key
  Then the drawer closes

Scenario: Drawer state resets on viewport resize to desktop
  Given the navigation drawer is open
  When the viewport is resized to desktop width
  Then the hamburger menu is not visible
  And the sidebar is visible normally
