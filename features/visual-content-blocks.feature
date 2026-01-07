Feature: Visual Content Blocks
  Rich visual elements for an engaging reading experience: sketches, highlights,
  margin notes, pain points boxes, big quotes, and dividers.

  Epic: Reader Experience
  Approach: Rich Visual Narrative (from prototype)

  # Integration Contract:
  # Entry Point: /chapters/[slug] pages
  # Caller Code: Chapter content renders visual components

# INTEGRATION SCENARIO
Scenario: Chapter page displays visual content blocks
  Given the app is running
  When I navigate to "/chapters/introduction"
  Then the page uses the cream background color
  And the page uses the Caveat handwritten font

# FEATURE SCENARIOS
Scenario: Highlight text renders with yellow marker effect
  Given I am on a chapter page with highlighted text
  Then the highlighted text has a yellow background gradient

Scenario: Margin note renders with handwritten style
  Given I am on a chapter page with a margin note
  Then the margin note has a left border
  And the margin note uses the Caveat font

Scenario: Sketch box renders with tilted card style
  Given I am on a chapter page with a sketch
  Then the sketch has a border and shadow
  And the sketch is slightly rotated

Scenario: Pain points box renders with label
  Given I am on a chapter page with pain points
  Then the pain points box has "Sound familiar?" label
  And the pain points list uses tilde markers

Scenario: Big quote renders with decorative style
  Given I am on a chapter page with a big quote
  Then the quote uses the Caveat font
  And the quote has decorative quotation marks

Scenario: Section headers have left border accent
  Given I am on a chapter page
  Then section headers have a left border accent

# SPEED MODE: All success scenarios above
# STABLE MODE: Will add fallback handling, missing content gracefully
