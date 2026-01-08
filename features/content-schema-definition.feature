Feature: Content Schema Definition
  Sanity schemas for chapters, sections, and visual content blocks that
  power the ebook content management system.

  Epic: Content Management
  Approach: Hybrid Schema (Portable Text + Custom Block Types)

  # Integration Contract:
  # Entry Point: sanity.config.ts imports schemaTypes
  # Caller Code: Sanity Studio loads schemas on startup
  # Data Consumer: Frontend queries via GROQ, renders with components

# INTEGRATION SCENARIO
Scenario: Sanity schemas load without errors
  Given the Sanity schema configuration exists
  When the schemas are validated
  Then all schema types are registered
  And no schema validation errors occur

# FEATURE SCENARIOS - Document Types
Scenario: Chapter document has required fields
  Given a chapter schema definition
  Then it has a "title" field of type "string"
  And it has a "slug" field of type "slug"
  And it has an "intro" field of type "text"
  And it has an "order" field of type "number"
  And it has a "sections" field that is an array of "section" objects

# FEATURE SCENARIOS - Object Types
Scenario: Section object has heading and content
  Given a section schema definition
  Then it has a "heading" field of type "string"
  And it has an "anchor" field of type "slug"
  And it has a "content" field of type "portableText"

Scenario: Portable text supports visual block types
  Given a portableText schema definition
  Then it includes the "sketch" block type
  And it includes the "bigQuote" block type
  And it includes the "painPoints" block type
  And it includes the "marginNote" block type
  And it includes the "divider" block type

Scenario: Portable text supports highlight annotation
  Given a portableText schema definition
  Then it includes a "highlight" annotation
  And the "highlight" annotation has a "style" field with color options

# FEATURE SCENARIOS - Block Types
Scenario: Sketch block has image and caption fields
  Given a sketch schema definition
  Then it has an "image" field of type "image"
  And it has a "caption" field of type "string"

Scenario: BigQuote block has text field
  Given a bigQuote schema definition
  Then it has a "text" field of type "text"

Scenario: PainPoints block has items array
  Given a painPoints schema definition
  Then it has an "items" field that is an array of strings

Scenario: MarginNote block has content field
  Given a marginNote schema definition
  Then it has a "content" field of type "text"

# SPEED MODE: All schema validation scenarios above
# STABLE MODE: Will add error handling for missing schemas, invalid content
