# Little Number Tracer - Color Palette

Kid-friendly color scheme designed for ages 3-6 with high contrast and cheerful tones.

## Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sunny Yellow** | `#FFD93D` | rgb(255, 217, 61) | Primary buttons, highlights, mascot accent |
| **Ocean Blue** | `#6BCB77` | rgb(107, 203, 119) | Success states, correct tracing |
| **Coral Pink** | `#FF6B6B` | rgb(255, 107, 107) | Call-to-action, important elements |

## Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sky Blue** | `#4ECDC4` | rgb(78, 205, 196) | Background accents, secondary buttons |
| **Lavender** | `#A084DC` | rgb(160, 132, 220) | Decorative elements, stars |
| **Peach** | `#FFB347` | rgb(255, 179, 71) | Warm accents, celebration elements |

## Background Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Soft Cream** | `#FFF8E7` | rgb(255, 248, 231) | Main background |
| **Light Mint** | `#E8F5E9` | rgb(232, 245, 233) | Tracing canvas background |
| **Pale Blue** | `#E3F2FD` | rgb(227, 242, 253) | Gallery background |

## UI Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Charcoal** | `#2D3436` | rgb(45, 52, 54) | Text, icons |
| **Warm Gray** | `#636E72` | rgb(99, 110, 114) | Secondary text |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Cards, modals |
| **Light Gray** | `#DFE6E9` | rgb(223, 230, 233) | Borders, dividers |

## Tracing Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Dotted Path** | `#B2BEC3` | rgb(178, 190, 195) | Dotted guide line |
| **Active Trace** | `#00B894` | rgb(0, 184, 148) | User's finger trace (on path) |
| **Off Path** | `#FDCB6E` | rgb(253, 203, 110) | Gentle warning when off path |
| **Arrow Blue** | `#0984E3` | rgb(9, 132, 227) | Direction arrows |

## Celebration Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Confetti 1** | `#FF6B6B` | rgb(255, 107, 107) | Red confetti |
| **Confetti 2** | `#4ECDC4` | rgb(78, 205, 196) | Teal confetti |
| **Confetti 3** | `#FFD93D` | rgb(255, 217, 61) | Yellow confetti |
| **Confetti 4** | `#A084DC` | rgb(160, 132, 220) | Purple confetti |
| **Star Gold** | `#F9CA24` | rgb(249, 202, 36) | Achievement stars |

## Tailwind CSS Config

```js
colors: {
  primary: {
    yellow: '#FFD93D',
    green: '#6BCB77',
    coral: '#FF6B6B',
  },
  secondary: {
    sky: '#4ECDC4',
    lavender: '#A084DC',
    peach: '#FFB347',
  },
  background: {
    cream: '#FFF8E7',
    mint: '#E8F5E9',
    paleBlue: '#E3F2FD',
  },
  tracing: {
    path: '#B2BEC3',
    active: '#00B894',
    offPath: '#FDCB6E',
    arrow: '#0984E3',
  },
  ui: {
    charcoal: '#2D3436',
    warmGray: '#636E72',
    lightGray: '#DFE6E9',
  },
  celebration: {
    red: '#FF6B6B',
    teal: '#4ECDC4',
    yellow: '#FFD93D',
    purple: '#A084DC',
    gold: '#F9CA24',
  },
}
```

## CSS Variables

```css
:root {
  /* Primary */
  --color-sunny-yellow: #FFD93D;
  --color-ocean-green: #6BCB77;
  --color-coral-pink: #FF6B6B;
  
  /* Secondary */
  --color-sky-blue: #4ECDC4;
  --color-lavender: #A084DC;
  --color-peach: #FFB347;
  
  /* Backgrounds */
  --color-bg-cream: #FFF8E7;
  --color-bg-mint: #E8F5E9;
  --color-bg-pale-blue: #E3F2FD;
  
  /* Tracing */
  --color-dotted-path: #B2BEC3;
  --color-trace-active: #00B894;
  --color-trace-off: #FDCB6E;
  --color-arrow: #0984E3;
  
  /* UI */
  --color-text: #2D3436;
  --color-text-secondary: #636E72;
  --color-border: #DFE6E9;
  
  /* Stars */
  --color-star: #F9CA24;
}
```

## Design Guidelines

1. **High Contrast**: Always ensure text has sufficient contrast against backgrounds
2. **Rounded Corners**: Use `border-radius: 16px` or higher for kid-friendly soft shapes
3. **Large Touch Targets**: Minimum 48x48px for all interactive elements
4. **Consistent Shadows**: Soft shadows with `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
5. **No Pure Black**: Use charcoal (#2D3436) instead of #000000 for softer appearance
