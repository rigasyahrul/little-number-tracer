@REQ-007
Feature: Practice Mode

  Scenario: Retry tracing the same number
    Given the child has completed tracing number 3
    When the child taps the retry button
    Then the canvas clears
    Then the dotted path reappears
    Then the child can trace again

  Scenario: No penalty for multiple attempts
    Given the child is practicing number 5
    When the child retries multiple times
    Then no negative feedback is shown
    Then the mascot remains encouraging
    Then best attempt score is saved
