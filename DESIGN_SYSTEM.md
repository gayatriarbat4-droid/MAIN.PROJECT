---
name: Clinical Sanctuary
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#e3e8f9'
  surface-container-highest: '#dde2f3'
  on-surface: '#161c27'
  on-surface-variant: '#3f4943'
  inverse-surface: '#2a303d'
  inverse-on-surface: '#ecf0ff'
  outline: '#6f7a73'
  outline-variant: '#bec9c1'
  surface-tint: '#056c4d'
  primary: '#00543b'
  on-primary: '#ffffff'
  primary-container: '#0b6e4f'
  on-primary-container: '#98edc6'
  inverse-primary: '#83d7b1'
  secondary: '#49607c'
  on-secondary: '#ffffff'
  secondary-container: '#c7dfff'
  on-secondary-container: '#4b637e'
  tertiary: '#00534c'
  on-tertiary: '#ffffff'
  tertiary-container: '#006d64'
  on-tertiary-container: '#69f1e2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ff4cc'
  primary-fixed-dim: '#83d7b1'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#005139'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#b0c9e8'
  on-secondary-fixed: '#011d35'
  on-secondary-fixed-variant: '#314863'
  tertiary-fixed: '#70f8e8'
  tertiary-fixed-dim: '#4fdbcc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9ff'
  on-background: '#161c27'
  surface-variant: '#dde2f3'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: 4rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-xl:
    fontFamily: Newsreader
    fontSize: 2.5rem
    fontWeight: '500'
    lineHeight: 3rem
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 1.875rem
    fontWeight: '500'
    lineHeight: 2.375rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-xl:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Manrope
    fontSize: 0.9375rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1.125rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  margin-mobile: 1.25rem
  margin-desktop: 3rem
  max-content-width: 84rem
---

## Brand & Style

This design system establishes an elevated private-hospital editorial aesthetic. It bridges the authority and measured pace of high-end clinical medicine with the tactile warmth of boutique hospitality. The target audience encompasses discerning patients scheduling consultations, specialized physicians managing surgical suites, and clinical administrators orchestrating care flows. 

Every interaction must project uncompromising competence, discretion, and biological serenity. We reject cold, sterile, antiseptic whites in favor of balanced warmth, grounded botanical depth, and architectural proportions. 

The aesthetic fuses **Minimalism** and **Editorial Precision**:
- **Pristine Clinical Clarity**: Uncluttered viewports, deliberate white space, and crystal-clear data hierarchies eliminate cognitive load in stressful healthcare moments.
- **Architectural Balance**: High-contrast, editorial serif headers grounded by geometric, ultra-legible modern sans-serif body typography.
- **Organic Flow**: Structural containers and subtle botanical undertones provide reassurance without sacrificing institutional rigor.

## Colors

The palette establishes an atmosphere of grounded clinical excellence and restorative sanctuary. The interplay pairs deep forest depths with breathable organic surfaces.

### Primary Role & Tonal Structure
- **Primary Brand (`#0B6E4F`)**: The clinical anchor. Used for primary actions, critical interactive triggers, key navigational markers, and selected states.
- **Deep Anchor (`#073B3A`)**: Reserved for authoritative display headers, primary brand marks, and high-emphasis structural banners.
- **Secondary Deep Navy (`#102A43`)**: Provides technical stability. Used for clinical telemetry, scheduling grids, high-priority timestamps, and specialized doctor profiles.
- **Interactive Highlight (`#2EC4B6`)**: An active digital cyan-mint used sparingly for live status pings, real-time indicators, and success confirmations.

### Surface & Atmosphere
- **Canvas Base (`#FAF7F0`)**: A warm, calming ivory background that relieves clinical screen fatigue and rejects sterile pure-white sheet styling.
- **Card Surfaces (`#FFFFFF`)**: Pure white layered over the warm ivory base, creating optical separation with crisp, pristine definition.
- **Soft Mint Tint (`#D8F3E5`)**: Applied to badges, highlighted appointment slots, active tabs, and tertiary button fills.

### Functional Contrast Rules
Text must always exceed WCAG 2.1 AA standards. Pure black is forbidden; body content uses `#1A202C` for high-contrast reading against `#FFFFFF` or `#FAF7F0`. Secondary clinical metadata uses an ivory-tinted slate (`#486581`).

## Typography

The typographic hierarchy pairs the editorial authority of **Newsreader** with the functional clarity of **Manrope**.

- **Newsreader (Headlines & Editorial Callouts)**: Conveys quiet confidence, academic heritage, and human empathy. Used exclusively for section titles, doctor names, department headings, and greeting statements. It softens the technological edge of the software.
- **Manrope (Body, Metadata, & Interface Elements)**: Delivers geometric neutrality and superior legibility across small screens, dense consultation tables, vitals dashboards, and calendar scheduling chips.

### Typographic Principles
1. **Numbers and Data Points**: All scheduling times, lab values, and room numbers use `Manrope` with tabular figures (`tnum`) to maintain structural balance.
2. **Uppercase Discipline**: All-caps styling is restricted exclusively to `label-sm` metadata tags, paired with generous `+0.06em` letter-spacing.
3. **Weight Pairing**: Avoid bold weights in `Newsreader`. Rely on weight `400` and `500` for titles, allowing `Manrope` at weight `600` and `700` to carry structural hierarchy in buttons and navigational markers.

## Layout & Spacing

The layout is built on an **8pt modular baseline** governed by a structured fluid grid. The interface prioritizes deep spatial breathing room around clinical data, avoiding the dense claustrophobia common in legacy hospital EHR systems.

### Grid Framework
- **Desktop (1024px and up)**: 12-column fluid grid, `84rem` (1344px) maximum container width, `2rem` gutters, and `3rem` outer margins. 
- **Tablet (768px – 1023px)**: 8-column fluid grid, `1.5rem` gutters, `2rem` outer margins.
- **Mobile (below 768px)**: 4-column fluid grid, `1rem` gutters, `1.25rem` outer margins.

### Spatial Rhythm
- **Internal Micro-spacing (`0.25rem` to `0.75rem`)**: Tight grouping for icon-to-label offsets, badge padding, and meta tags.
- **Component Spacing (`1rem` to `1.5rem`)**: Standard separation between field inputs, card items, and consultation slot options.
- **Macro Layout Spacing (`2rem` to `4.5rem`)**: Large section gaps separating patient profiles, appointment queues, and department overviews.

## Elevation & Depth

This system rejects heavy, dark, or synthetic drop shadows. Elevation is achieved through soft, multi-layered natural light diffusion paired with emerald-tinted translucent borders.

### Depth Hierarchy
1. **Level 0 (Flat / Canvas Ground)**: The `#FAF7F0` warm ivory background surface.
2. **Level 1 (Card & Module Resting)**: Pristine `#FFFFFF` surfaces with a dual-layer shadow:
   - `0 1px 3px rgba(7, 59, 58, 0.04), 0 6px 16px -4px rgba(7, 59, 58, 0.06)`
   - Border: `1px solid rgba(11, 110, 79, 0.08)`
3. **Level 2 (Active Focus & Interactive Hover)**: Used for hovered appointment cards, active date selectors, and flyouts:
   - `0 4px 6px -2px rgba(7, 59, 58, 0.03), 0 12px 24px -4px rgba(7, 59, 58, 0.08)`
   - Border: `1px solid rgba(11, 110, 79, 0.18)`
4. **Level 3 (Modals, Overlays, and Drawers)**: Used for booking confirmations, doctor detail modals, and urgent notifications:
   - `0 24px 48px -12px rgba(16, 42, 67, 0.12), 0 8px 16px -4px rgba(7, 59, 58, 0.04)`
   - Backdrop: `rgba(16, 42, 67, 0.4)` with a `8px` blur.

### Outlines and Highlights
All interactive surfaces maintain a microscopic `1px` inner or outer border tinted with primary green at low opacities (`0.06` to `0.15`), giving every element a crisp edge against the warm background.

## Shapes

The shape language reflects organic wellness and architectural balance. 

- **Level 2 Roundedness**: Standard interactive components—such as buttons, inputs, dropdown menus, and standard cards—use a base radius of `0.5rem` (8px).
- **Elevated Surfaces (`rounded-lg` & `rounded-xl`)**: Primary clinic cards, scheduling panels, and doctor profile modules use `1rem` (16px) or `1.5rem` (24px) corner radii to express organic, approachable warmth.
- **Pill Containers (`rounded-full`)**: Reserved exclusively for status chips, specialty tags, date selectors, and active pill badges. These echo cellular and biological forms.

## Components

### Buttons
- **Primary Button**: Solid `#0B6E4F` background with `#FFFFFF` text. Padding: `0.75rem 1.5rem`. Corner radius: `0.5rem`. Hover state transitions to `#073B3A` with an ambient glow (`0 4px 12px rgba(11, 110, 79, 0.25)`).
- **Secondary Button**: Crisp `#FFFFFF` background with `#0B6E4F` text and an emerald border (`1px solid rgba(11, 110, 79, 0.2)`). Hover transitions to `#D8F3E5` background.
- **Ghost Button**: Transparent surface with `#102A43` text. Hover yields `#FAF7F0` surface tint.

### Chips & Badges
- **Status Pill (Confirmed / Active)**: Pill-shaped (`9999px` radius). Background `#D8F3E5`, text `#073B3A`, with an optional `6px` pulsing status dot in `#2EC4B6`.
- **Specialty Tag**: Background `#FFFFFF`, border `1px solid rgba(16, 42, 67, 0.1)`, text `#102A43`. Font size: `0.8125rem` (`label-md`).

### Input Fields & Selectors
- **Input Container**: Height `3rem`, background `#FFFFFF`, border `1px solid rgba(16, 42, 67, 0.12)`, radius `0.5rem`.
- **Focus State**: Border transitions to `#0B6E4F` with a soft outer ring: `0 0 0 3px rgba(11, 110, 79, 0.12)`.
- **Labels**: Rendered above the field in `label-md` weight using `#102A43`.

### Appointment Cards
- **Structure**: Pure white (`#FFFFFF`) surface, radius `1rem` (16px), subtle border `1px solid rgba(11, 110, 79, 0.08)`.
- **Header**: Doctor's title in `Newsreader` (`headline-sm`), with department subtitle in `Manrope` (`body-sm`).
- **Footer**: Integrated scheduling chip bar featuring dynamic time-slot buttons and quick-action booking links.

### Checkboxes & Radios
- **Unchecked**: Crisp `1.25rem` box with `0.25rem` radius (or circle for radio). Background `#FFFFFF`, border `2px solid rgba(16, 42, 67, 0.2)`.
- **Checked**: Filled with `#0B6E4F` with a crisp white checkmark or center pip. Focus ring utilizes a `3px` mint tint ring (`rgba(46, 196, 182, 0.3)`).