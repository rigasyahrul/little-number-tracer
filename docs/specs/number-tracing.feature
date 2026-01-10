@REQ-001
Feature: Number Tracing with Dotted Path

  Scenario: Display dotted path for selected number
    Given the child is on the tracing screen
    Given number 3 is selected
    When the tracing canvas loads
    Then a dotted path for number 3 is displayed
    Then start point is clearly marked
    Then end point is visible

  Scenario: Trace number following the dotted path
    Given the child is viewing number 5 tracing screen
    Given the dotted path is displayed
    When the child traces along the dotted path with their finger
    Then a colored line follows the finger movement
    Then the line appears on top of the dotted path
