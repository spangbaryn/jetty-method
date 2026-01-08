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

# ============================================================
# STABLE MODE SCENARIOS - Error Handling and Edge Cases
# ============================================================

Scenario: Schema validation detects missing name property
  Given a schema object without a name property
  When the schema is validated
  Then a validation error is reported for missing name

Scenario: Schema validation detects missing type property
  Given a schema object without a type property
  When the schema is validated
  Then a validation error is reported for missing type

Scenario: Schema validation handles empty fields array
  Given a schema with an empty fields array
  When the schema fields are checked
  Then no field lookup errors occur

Scenario: Field lookup returns undefined for non-existent field
  Given a chapter schema definition
  When I look up a field named "nonexistent"
  Then the field lookup returns undefined

Scenario: Block type lookup returns undefined for non-existent block
  Given a portableText schema definition
  When I look up a block type named "nonexistent"
  Then the block type lookup returns undefined

Scenario: Annotation lookup returns undefined for non-existent annotation
  Given a portableText schema definition
  When I look up an annotation named "nonexistent"
  Then the annotation lookup returns undefined
