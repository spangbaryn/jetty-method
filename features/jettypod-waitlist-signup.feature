Feature: JettyPod Waitlist Signup
  Two-step form to capture email and vibe coding experience for JettyPod waitlist.
  Appears as inline section on homepage and compact card in chapter sidebar.

  Approach: Both inline section + sidebar card

  # Integration Contract:
  # Entry Point 1: Homepage (/) - inline section below TOC
  # Entry Point 2: Chapter pages (/chapters/[slug]) - sidebar card
  # Caller Code: src/app/page.tsx, src/components/chapter/ChapterSidebar.tsx

# INTEGRATION SCENARIOS
Scenario: User sees waitlist form on homepage
  Given I am on the homepage
  Then I see the JettyPod waitlist section
  And I see an email input field
  And I see a join button

Scenario: User sees waitlist card in chapter sidebar
  Given I am on a chapter page
  Then I see the JettyPod waitlist card in the sidebar
  And I see a join waitlist button

# FEATURE SCENARIOS (success paths)
Scenario: User submits email and sees experience question
  Given I am on the homepage
  And I see the waitlist form
  When I enter my email address
  And I click the join button
  Then I see the vibe coding experience question
  And I see three experience level options

Scenario: User completes waitlist signup
  Given I have entered my email
  And I see the experience question
  When I select my vibe coding experience level
  Then I see a success confirmation
  And my signup is recorded

# SPEED MODE: All scenarios above (integration + success paths)
# STABLE MODE: Will add validation errors, duplicate email handling, network failures
