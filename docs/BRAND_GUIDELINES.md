# FlashFusion Brand Guidelines

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready

---

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Design Principles](#design-principles)
5. [Component Guidelines](#component-guidelines)
6. [Accessibility Standards](#accessibility-standards)
7. [Usage Rules](#usage-rules)

---

## Brand Identity

### Overview
FlashFusion is an AI-powered workflow orchestration platform designed for creators. Our brand reflects innovation, creativity, and premium quality while remaining approachable and user-friendly.

### Brand Personality
- **Innovative**: Cutting-edge technology with forward-thinking solutions
- **Premium**: High-quality experience without pretension
- **Creative**: Empowering artistic expression and workflow customization
- **Approachable**: User-friendly and accessible to all skill levels
- **Powerful**: Robust capabilities with sophisticated features

### Visual Style
- **Dark-first design**: Optimized for extended use and creative work
- **Glassmorphism**: Modern frosted glass aesthetic with subtle transparency
- **Neon accents**: Vibrant purple and pink highlights for energy and focus
- **High contrast**: Clear visual hierarchy and excellent readability
- **Fluid motion**: Smooth transitions and meaningful animations

---

## Color System

### Primary Palette

#### Primary (Purple)
**Brand Color**: `#a855f7` (HSL: 271, 91%, 65%)

The primary purple represents creativity, innovation, and premium quality. Use for primary actions, brand elements, and key interactive components.

**Scale**:
- `50`: `#faf5ff` - Lightest tint
- `100`: `#f3e8ff` - Light text on dark backgrounds
- `200`: `#e9d5ff` - Subtle backgrounds
- `300`: `#d8b4fe` - Secondary text
- `400`: `#c084fc` - Interactive elements
- `500`: `#a855f7` - **Primary brand color**
- `600`: `#9333ea` - Hover states
- `700`: `#7e22ce` - Active states
- `800`: `#6b21a8` - Dark accents
- `900`: `#581c87` - Darkest shade

#### Secondary (Rose/Pink)
**Accent Color**: `#f472b6` (HSL: 328, 86%, 70%)

The secondary rose adds warmth and energy. Use for secondary actions, highlights, and complementary elements.

**Scale**:
- `50`: `#fdf2f8`
- `100`: `#fce7f3`
- `200`: `#fbcfe8`
- `300`: `#f9a8d4`
- `400`: `#f472b6` - **Secondary accent color**
- `500`: `#ec4899`
- `600`: `#db2777`
- `700`: `#be185d`
- `800`: `#9f1239`
- `900`: `#831843`

### Semantic Colors

#### Success (Green)
**Color**: `#22c55e` (HSL: 142, 71%, 45%)

Use for positive feedback, successful operations, and confirmations.

#### Warning (Amber)
**Color**: `#f59e0b` (HSL: 38, 92%, 50%)

Use for warnings, important notices, and actions requiring attention.

#### Error (Red)
**Color**: `#ef4444` (HSL: 0, 84%, 60%)

Use for errors, destructive actions, and critical alerts.

#### Info (Blue)
**Color**: `#3b82f6` (HSL: 217, 91%, 60%)

Use for informational messages, tips, and neutral notifications.

### Dark Mode Colors

#### Background
**Primary Background**: `#0f0618` (HSL: 273, 73%, 6%)

Deep purple-tinted black creating an immersive, premium feel.

#### Surfaces
- **Surface**: `#1a0b2e` (HSL: 273, 65%, 12%) - Cards, panels
- **Surface Light**: `#2d1b4e` (HSL: 273, 50%, 21%) - Elevated elements
- **Border**: `#3d2764` (HSL: 273, 45%, 30%) - Subtle borders
- **Border Light**: `#5b3d8a` (HSL: 273, 40%, 40%) - Interactive borders

### Neutral Scale

Use for text, borders, and subtle UI elements:
- `50`: `#f8fafc` - Lightest (use on dark mode only)
- `100`: `#f1f5f9` - Primary text (dark mode)
- `300`: `#cbd5e1` - Secondary text (dark mode)
- `400`: `#94a3b8` - Muted text (dark mode)
- `500`: `#64748b` - Disabled text
- `700`: `#334155` - Dark text (light mode)
- `900`: `#0f172a` - Darkest

---

## Typography

### Font Families

#### Headings: Poppins
**Weights**: 300 (Light), 400 (Regular), 600 (Semibold), 700 (Bold)

Modern, geometric sans-serif with excellent legibility. Use for all headings, labels, and emphasis text.

```css
font-family: 'Poppins', system-ui, sans-serif;
```

#### Body: Inter
**Weights**: 300 (Light), 400 (Regular)

Clean, highly legible typeface optimized for UI and body text.

```css
font-family: 'Inter', system-ui, sans-serif;
```

#### Code: JetBrains Mono
**Weight**: 400 (Regular)

Monospace font for code snippets and technical content.

```css
font-family: 'JetBrains Mono', monospace;
```

### Type Scale

| Size | Name | Pixels | Use Case |
|------|------|--------|----------|
| `xs` | Extra Small | 12px | Captions, small labels |
| `sm` | Small | 14px | Secondary text, helper text |
| `base` | Base | 16px | Body text (default) |
| `lg` | Large | 18px | Emphasized body text |
| `xl` | Extra Large | 20px | Small headings, subheadings |
| `2xl` | 2X Large | 24px | Section headings |
| `3xl` | 3X Large | 30px | Page titles |
| `4xl` | 4X Large | 36px | Hero headings |
| `5xl` | 5X Large | 48px | Display headings |
| `6xl` | 6X Large | 60px | Hero displays |

### Font Weights

- **Light (300)**: Subtle text, large headings
- **Regular (400)**: Body text, default
- **Semibold (600)**: Buttons, emphasis, labels
- **Bold (700)**: Strong emphasis, headings

### Line Heights

- **Tight (1.25)**: Large headings, display text
- **Snug (1.375)**: Headings
- **Normal (1.5)**: UI elements
- **Relaxed (1.625)**: Body text (default)
- **Loose (2)**: Spacious content

### Letter Spacing

- **Tight (-0.025em)**: Large headings
- **Normal (0)**: Body text, default
- **Wide (0.025em)**: Small caps, emphasis
- **Wider (0.05em)**: Uppercase labels

---

## Design Principles

### 1. Dark-First Design
All interfaces should be optimized for dark mode as the primary experience. Light mode is secondary.

### 2. Glassmorphism
Use frosted glass effects for overlays, modals, and elevated UI elements to create depth and hierarchy.

**Implementation**:
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### 3. Neon Accents
Strategic use of glowing effects on interactive elements to guide attention and create energy.

**Implementation**:
```css
box-shadow: 0 0 20px hsl(271, 91%, 65% / 0.5),
            0 0 40px hsl(271, 91%, 65% / 0.3);
```

### 4. High Contrast
Maintain WCAG AA compliance (4.5:1 minimum) for all text. Use strong contrast for readability and accessibility.

### 5. Meaningful Motion
Animations should be purposeful, smooth, and subtle. Never animate for decoration alone.

**Duration Guidelines**:
- **Micro-interactions**: 150-200ms
- **Component transitions**: 250-300ms
- **Page transitions**: 400-500ms
- **Complex animations**: 500-800ms

### 6. Responsive by Default
All components must work seamlessly across desktop, tablet, and mobile viewports.

---

## Component Guidelines

### Buttons

#### Primary Button
**Purpose**: Main call-to-action, primary actions

**Style**:
- Background: `primary-500` (`#a855f7`)
- Text: White
- Hover: `primary-600` with glow effect
- Padding: `12px 24px`
- Border radius: `12px`
- Font: Poppins Semibold (600)

**Code Example**:
```css
.btn-primary {
  background: hsl(271, 91%, 65%);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: hsl(271, 81%, 56%);
  box-shadow: 0 0 20px hsl(271, 91%, 65% / 0.5);
  transform: translateY(-2px);
}
```

#### Secondary Button
**Purpose**: Secondary actions, alternative choices

**Style**:
- Background: `secondary-400` (`#f472b6`)
- Text: White
- Hover: `secondary-500` with glow effect

#### Outline Button
**Purpose**: Less emphasis, tertiary actions

**Style**:
- Background: Transparent
- Border: 1px solid `primary-500`
- Text: `primary-500`
- Hover: Fill with `primary-500/10%`

#### Ghost Button
**Purpose**: Minimal emphasis, inline actions

**Style**:
- Background: Transparent
- Text: `neutral-100`
- Hover: `surface-light`

### Form Elements

#### Text Input
**Style**:
- Background: `surface` with 50% opacity
- Border: `border` color
- Padding: `12px 16px`
- Border radius: `12px`
- Focus: `primary-500` border with glow

**Code Example**:
```css
.input {
  background: hsl(273, 65%, 12% / 0.5);
  border: 1px solid hsl(273, 45%, 30%);
  color: hsl(270, 100%, 95%);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-family: 'Inter', sans-serif;
}

.input:focus {
  border-color: hsl(271, 91%, 65%);
  box-shadow: 0 0 0 3px hsl(271, 91%, 65% / 0.2);
  outline: none;
}
```

### Cards

#### Standard Card
**Style**:
- Background: `surface` (`#1a0b2e`)
- Border: `border` with 50% opacity
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 4px 16px rgba(15, 6, 24, 0.4)`

#### Glass Card
**Style**:
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `rgba(255, 255, 255, 0.1)`
- Backdrop filter: `blur(12px)`
- Border radius: `16px`

### Badges

**Sizes**:
- Small: `6px 12px`, `12px` font
- Medium: `8px 16px`, `14px` font
- Large: `10px 20px`, `16px` font

**Variants**:
- Primary: Purple background
- Secondary: Pink background
- Success: Green background
- Warning: Amber background
- Error: Red background
- Neutral: Gray background

### Alerts

**Structure**: Icon + Message + Optional Action

**Variants**:
- **Success**: Green accent, checkmark icon
- **Warning**: Amber accent, alert icon
- **Error**: Red accent, error icon
- **Info**: Blue accent, info icon

**Style**:
- Background: Semantic color at 10% opacity
- Border: Semantic color at 30% opacity
- Padding: `16px`
- Border radius: `12px`

---

## Accessibility Standards

### WCAG AA Compliance

All color combinations must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text (18pt+)**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

### Focus States

All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid hsl(271, 91%, 65%);
  outline-offset: 2px;
}
```

### Motion Preferences

Respect user motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support

- Use semantic HTML elements
- Provide alt text for all images
- Use ARIA labels where appropriate
- Ensure keyboard navigation works for all interactions

### Color Blindness

- Never rely on color alone to convey information
- Use icons, labels, and patterns alongside color
- Test with color blindness simulators

---

## Usage Rules

### Do's ✓

#### Color Usage
- ✓ Use primary purple for main actions and brand elements
- ✓ Use secondary rose for complementary highlights
- ✓ Maintain high contrast for text (4.5:1 minimum)
- ✓ Use semantic colors consistently (green = success, red = error)
- ✓ Apply glassmorphism to elevated UI elements
- ✓ Use glow effects on interactive elements

#### Typography
- ✓ Use Poppins for all headings and labels
- ✓ Use Inter for body text and descriptions
- ✓ Maintain consistent type scale
- ✓ Keep line lengths between 50-75 characters
- ✓ Use appropriate line heights for readability

#### Components
- ✓ Use primary buttons for main actions
- ✓ Provide clear hover states for interactive elements
- ✓ Include loading states for async operations
- ✓ Display error messages near the relevant field
- ✓ Use badges to highlight status

#### Layout
- ✓ Follow 8px grid system for spacing
- ✓ Use consistent padding and margins
- ✓ Create clear visual hierarchy
- ✓ Ensure responsive design across breakpoints
- ✓ Leave adequate whitespace

### Don'ts ✗

#### Color Usage
- ✗ Don't use light colors (50-200) on white backgrounds for text
- ✗ Don't mix primary and secondary colors in the same component unless intentional
- ✗ Don't use more than 3 colors in a single component
- ✗ Don't use decorative gradients on text
- ✗ Don't apply glow effects to static elements

#### Typography
- ✗ Don't use more than 3 font sizes in a single view
- ✗ Don't use all caps for body text
- ✗ Don't center-align large blocks of text
- ✗ Don't use font weights below 400 for small text
- ✗ Don't mix multiple font families in body text

#### Components
- ✗ Don't use multiple primary buttons in the same context
- ✗ Don't remove focus indicators
- ✗ Don't use red for non-error states
- ✗ Don't use hover effects on mobile
- ✗ Don't hide error messages after user interaction begins

#### Layout
- ✗ Don't use fixed widths for text containers
- ✗ Don't stack more than 2-3 cards horizontally on mobile
- ✗ Don't hide critical navigation on mobile
- ✗ Don't use horizontal scroll for primary content
- ✗ Don't place actions outside the viewport

---

## Implementation Resources

### Design Tokens
See `src/design-system/design-tokens.json` for complete token definitions.

### Color System
See `src/design-system/color-system.json` for full color palette.

### Component Styles
See `src/design-system/component-color-map.json` for component-specific colors.

### Accessibility Report
See `src/design-system/accessibility-report.md` for WCAG compliance details.

### Tailwind Configuration
See `src/design-system/tailwind-theme-extension.json` for Tailwind config.

---

## Version History

### 1.0.0 (January 2026)
- Initial release
- Complete color system with primary purple and secondary rose
- Typography guidelines with Poppins and Inter
- Component guidelines for buttons, forms, cards, badges, alerts
- WCAG AA accessibility standards
- Dark-first design with glassmorphism

---

## Contact & Support

For questions about these brand guidelines:
- Technical implementation: [Documentation](../README.md)
- Design feedback: Create an issue in the repository
- Accessibility concerns: See accessibility report

---

**FlashFusion Brand Guidelines v1.0.0**  
© 2026 FlashFusion. All rights reserved.
