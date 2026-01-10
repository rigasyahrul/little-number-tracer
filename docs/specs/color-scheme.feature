@REQ-010
Feature: Kid-Friendly Color Scheme

  Scenario: Display app with bright cheerful colors
    Given the app is launched
    When any screen loads
    Then bright kid-friendly colors are used
    Then UI elements have rounded corners
    Then high contrast ensures visibility

  Scenario: Consistent theme across all screens
    Given the child navigates between screens
    When the child goes from gallery to tracing to free draw
    Then color scheme remains consistent
    Then visual style is unified
