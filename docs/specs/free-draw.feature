@REQ-008
Feature: Free Draw Mode

  Scenario: Access free draw canvas
    Given the child is on the home screen
    When the child taps the free draw button
    Then a blank canvas is displayed
    Then drawing tools are available

  Scenario: Draw with multiple colors
    Given the child is in free draw mode
    When the child selects a color and draws
    Then the drawing appears in the selected color
    Then multiple colors can be used in one drawing

  Scenario: Clear the canvas
    Given the child has drawn on the canvas
    When the child taps the clear button
    Then the canvas is cleared
    Then the child can start fresh
