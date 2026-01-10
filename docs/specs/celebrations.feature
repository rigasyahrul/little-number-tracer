@REQ-005
Feature: Celebration Animations

  Scenario: Celebrate successful number completion
    Given the child has traced number 8 completely
    When the tracing reaches the end point
    Then confetti animation plays on screen
    Then celebration sound effect plays
    Then the mascot dances happily

  Scenario: Show stars based on accuracy
    Given the child completes tracing number 6
    When the accuracy score is calculated
    Then stars are awarded based on accuracy
    Then 3 stars for excellent accuracy
    Then encouraging message is displayed
