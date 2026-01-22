Feature: Prompt component with copy button
  A content component using @@@ syntax that displays formatted prompt text
  with a working click-to-copy button

  Approach: Prominent Prompt Card

  # Integration Contract:
  # Entry Point: @@@ prompt text @@@ syntax in Google Doc
  # Caller Code: src/lib/google-docs/parser.ts, src/components/portable-text/index.tsx

# INTEGRATION SCENARIO
Scenario: Parser recognizes prompt syntax
  Given content with "@@@ Copy this text @@@"
  When the content is parsed
  Then a prompt block is created with text "Copy this text"

# FEATURE SCENARIOS
Scenario: Prompt component renders with formatted text
  Given I am on a chapter page with a prompt block
  Then I see a prompt card with "PROMPT" label
  And I see the prompt text displayed
  And I see a copy button

Scenario: Copy button copies text to clipboard
  Given I am on a chapter page with a prompt block
  When I click the copy button
  Then the prompt text is copied to the clipboard
  And the button shows "Copied" feedback
