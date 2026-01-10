@REQ-003
Feature: Touch Tracing Detection

  Scenario: Detect accurate tracing on path
    Given the child is tracing number 0
    When the child traces within the dotted path boundaries
    Then the traced line appears in success color green
    Then accuracy percentage increases

  Scenario: Detect off-path tracing with tolerance
    Given the child is tracing number 1
    When the child traces slightly outside the path within tolerance
    Then the tracing is still accepted
    Then gentle visual feedback is provided

  Scenario: Show feedback for significant deviation
    Given the child is tracing number 7
    When the child traces far outside the dotted path
    Then the line appears in a different color
    Then the mascot provides encouraging guidance
