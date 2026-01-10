@REQ-006
Feature: Number Gallery Selection

  Scenario: Display all numbers in gallery grid
    Given the child opens the number gallery
    When the gallery screen loads
    Then numbers 0 through 9 are displayed in a grid
    Then each number has a large tap target
    Then completed numbers show a checkmark

  Scenario: Select number from gallery
    Given the child is on the gallery screen
    When the child taps on number 9
    Then the app navigates to number 9 tracing screen
    Then the tracing canvas is ready
