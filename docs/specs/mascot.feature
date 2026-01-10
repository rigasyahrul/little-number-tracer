@REQ-004
Feature: Animated Mascot Companion

  Scenario: Mascot greets child on app launch
    Given the app is launched
    When the home screen loads
    Then the pencil mascot waves hello
    Then a friendly greeting sound plays

  Scenario: Mascot encourages during tracing
    Given the child is actively tracing a number
    When the child is tracing correctly
    Then the mascot shows a happy expression
    Then the mascot may animate cheerfully

  Scenario: Mascot provides gentle encouragement on mistakes
    Given the child is tracing a number
    When the child makes a tracing error
    Then the mascot shows an encouraging expression
    Then the mascot does not show disappointment
