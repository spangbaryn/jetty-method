Feature: Homepage
  Classic book table of contents with title, tagline, and hierarchical chapter listings

  Epic: Reader Experience
  Approach: Classic Book TOC

  # Integration Contract:
  # Entry Point: / route (root URL)
  # Caller Code: src/app/page.tsx (self-contained)

# INTEGRATION SCENARIO
Scenario: User sees book homepage when opening the app
  Given I open the app
  Then I see the book title "The Jetty Method"
  And I see the book tagline

# FEATURE SCENARIOS
Scenario: Homepage displays table of contents with parts
  Given I am on the homepage
  Then I see the table of contents
  And I see parts organized hierarchically

Scenario: Homepage lists chapters within each part
  Given I am on the homepage
  When I look at a part section
  Then I see the chapters listed under that part

Scenario: User navigates to a chapter from homepage
  Given I am on the homepage
  When I click on a chapter title
  Then I am taken to that chapter's page

# SPEED MODE: All success scenarios above

# STABLE MODE: Edge cases and error handling
Scenario: Homepage handles long chapter titles gracefully
  Given I am on the homepage
  Then chapter titles do not overflow their containers
  And the layout remains intact

Scenario: Homepage is keyboard navigable
  Given I am on the homepage
  When I navigate using the Tab key
  Then I can reach all chapter links
  And each link has visible focus styling

Scenario: Homepage remains usable at narrow viewport
  Given I am on the homepage
  And the viewport width is 320 pixels
  Then the table of contents is still readable
  And chapter links are still clickable
