@REQ-002
Feature: Stroke Direction Arrows

  Scenario: Show direction arrow at start point
    Given the child is on the tracing screen for number 2
    When the tracing canvas loads
    Then an animated arrow shows the stroke direction
    Then the arrow points in the correct drawing direction

  Scenario: Arrow guides through multi-stroke numbers
    Given the child is tracing number 4
    Given the first stroke is completed
    When the child lifts their finger
    Then a new arrow appears for the next stroke
    Then the arrow indicates the new start position
