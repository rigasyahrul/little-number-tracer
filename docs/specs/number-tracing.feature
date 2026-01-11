@REQ-001
Feature: Number Tracing with Dotted Path

  Background:
    Numbers are rendered using SVG path data with Bezier curves for smooth,
    natural-looking shapes. Each number consists of two visual layers:
    1. A thick gray "background number" showing the complete number shape
    2. A thin dotted guide path on top for tracing guidance
    
    This approach ensures numbers look realistic and scale perfectly to any
    screen size, similar to professional handwriting education apps.

  Scenario: Display dotted path for selected number
    Given the child is on the tracing screen
    Given number 3 is selected
    When the tracing canvas loads
    Then a thick gray background number 3 is displayed
    Then a dotted guide path overlays the background number
    Then the number shape uses smooth curves (not polygonal segments)
    Then start point is clearly marked
    Then end point is visible

  Scenario: Trace number following the dotted path
    Given the child is viewing number 5 tracing screen
    Given the dotted path is displayed
    When the child traces along the dotted path with their finger
    Then a colored line follows the finger movement
    Then the line appears on top of the dotted path

  Scenario: Number path rendering quality
    Given any number is selected for tracing
    When the tracing canvas renders the number
    Then the number uses SVG path data with quadratic/bezier curves
    Then the thick background number is gray (#999999) with ~20px stroke width
    Then the dotted guide path uses 5px dashed line pattern
    Then the rendering scales correctly on high-DPI displays
