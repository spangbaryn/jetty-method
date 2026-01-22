Feature: Update Prompt component label
  Change the header text from PROMPT to EXAMPLE PROMPT

  Approach: Direct text change

  # Integration Contract:
  # Entry Point: Chapter pages with @@@ syntax
  # Caller Code: src/components/portable-text/index.tsx

Scenario: Prompt component displays EXAMPLE PROMPT label
  Given I am on a chapter page with a prompt block
  Then I see a prompt card with "EXAMPLE PROMPT" label
