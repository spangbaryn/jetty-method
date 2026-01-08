Feature: Sanity Studio Setup
  Customized Sanity Studio with desk structure, block previews, and branding

  Epic: Content Management
  Approach: Full Studio Customization

  # Integration Contract:
  # Entry Point: /studio route or sanity dev
  # Caller Code: sanity.config.ts, sanity.cli.ts

# INTEGRATION SCENARIO
Scenario: Studio loads with custom configuration
  Given I start the Sanity Studio
  Then I see the custom desk structure
  And I see the project branding

# DESK STRUCTURE
Scenario: Desk structure organizes content for ebook authoring
  Given I am in the Sanity Studio
  Then I see "Chapters" in the sidebar
  And I see "Pages" in the sidebar
  And I see "Visual Blocks" grouped separately

# BLOCK PREVIEWS
Scenario: Big Quote block shows visual preview
  Given I am editing a section with portable text
  When I insert a "bigQuote" block
  Then I see a styled preview of the quote block

Scenario: Pain Points block shows visual preview
  Given I am editing a section with portable text
  When I insert a "painPoints" block
  Then I see a styled preview of the pain points block

Scenario: Margin Note block shows visual preview
  Given I am editing a section with portable text
  When I insert a "marginNote" block
  Then I see a styled preview of the margin note block

# HIGHLIGHT ANNOTATION
Scenario: Highlight annotation shows color options visually
  Given I am editing text in a section
  When I select text and apply highlight annotation
  Then I see color swatches for yellow, green, and blue

# SPEED MODE: All success scenarios above
# STABLE MODE: Will add error handling, fallbacks for missing previews
