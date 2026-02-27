# CSS / SCSS / Tailwind / PostCSS / Responsive Design — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off

---

## 1. CSS Specificity & Cascade

**Q: How does CSS specificity work? How do you resolve conflicts?**

**One-line:** Specificity is a weight system (inline > ID > class > element) that determines which rule wins when multiple rules target the same element.

**How it works:**
```
Specificity = (inline, IDs, classes/attrs/pseudo-classes, elements/pseudo-elements)

/* 0,0,0,1 */  p { }
/* 0,0,1,0 */  .card { }
/* 0,0,1,1 */  p.card { }
/* 0,1,0,0 */  #header { }
/* 0,1,1,0 */  #header .nav { }
/* 1,0,0,0 */  style="color:red"   ← inline always wins (except !important)
```

**Real example:**
```css
/* Bug: why isn't my button blue? */
#sidebar .widget button { color: red; }   /* 0,1,1,1 */
.btn-primary { color: blue; }              /* 0,0,1,0 — LOSES */

/* Fix: match or exceed specificity */
#sidebar .widget .btn-primary { color: blue; } /* 0,1,2,0 — wins */
```

**Trade-off:** `!important` breaks the cascade — use it only for utility overrides. In large codebases, BEM or CSS Modules avoid specificity wars entirely.

---

## 2. Box Model

**Q: Explain the CSS box model. What's the difference between content-box and border-box?**

**One-line:** The box model is content + padding + border + margin. `border-box` includes padding/border in the declared width.

```css
/* content-box (default): width = content only */
.box { width: 200px; padding: 20px; border: 2px solid; }
/* Actual rendered width = 200 + 20*2 + 2*2 = 244px */

/* border-box: width = content + padding + border */
.box { box-sizing: border-box; width: 200px; padding: 20px; border: 2px solid; }
/* Actual rendered width = 200px (content shrinks to 156px) */

/* Senior move: reset globally */
*, *::before, *::after { box-sizing: border-box; }
```

**Trade-off:** Always use `border-box` in production. Every CSS reset (normalize.css, Tailwind preflight) does this.

---

## 3. Flexbox — Complete Mental Model

**Q: Explain Flexbox. When would you use it vs Grid?**

**One-line:** Flexbox is 1D layout (row OR column). Grid is 2D (rows AND columns). Use Flexbox for components, Grid for page layout.

```css
/* Container properties */
.flex-container {
  display: flex;
  flex-direction: row | column | row-reverse | column-reverse;
  justify-content: flex-start | center | space-between | space-around | space-evenly;
  align-items: stretch | center | flex-start | flex-end | baseline;
  flex-wrap: nowrap | wrap;
  gap: 16px;                /* modern — replaces margin hacks */
}

/* Item properties */
.flex-item {
  flex: 1;                  /* shorthand: flex-grow flex-shrink flex-basis */
  flex: 0 0 200px;          /* fixed 200px, no grow/shrink */
  align-self: center;       /* override container's align-items */
  order: -1;                /* visual reorder without DOM change */
}
```

**Real example — Navbar:**
```css
.navbar {
  display: flex;
  justify-content: space-between;  /* logo left, nav right */
  align-items: center;
}
.navbar-links { display: flex; gap: 24px; }
```

**Real example — Center anything:**
```css
.center { display: flex; justify-content: center; align-items: center; }
/* or shorthand: */
.center { display: grid; place-items: center; }  /* Grid version */
```

**Curveball: What does `flex: 1` actually mean?**
→ `flex-grow: 1; flex-shrink: 1; flex-basis: 0%` — takes equal share of remaining space.

---

## 4. CSS Grid — Complete Mental Model

**Q: Explain CSS Grid. Build a responsive layout.**

**One-line:** Grid is 2D layout with explicit row/column tracks. Best for page-level layouts and complex component grids.

```css
/* Basic grid */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;          /* 3 columns, middle is 2x */
  grid-template-rows: auto 1fr auto;            /* header, content, footer */
  gap: 16px;
}

/* Responsive grid WITHOUT media queries */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
/* auto-fill: creates as many 250px+ columns as fit */
/* auto-fit: same but collapses empty tracks */

/* Named areas — senior pattern */
.layout {
  grid-template-areas:
    "header  header  header"
    "sidebar content aside"
    "footer  footer  footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
```

**Real example — Dashboard:**
```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}
```

**Curveball: auto-fill vs auto-fit?**
- `auto-fill`: keeps empty tracks (columns) even if no content
- `auto-fit`: collapses empty tracks, items stretch to fill

---

## 5. Responsive Design — Mobile-First

**Q: How do you approach responsive design? What's mobile-first?**

**One-line:** Mobile-first means base styles are for small screens, then `min-width` media queries add complexity for larger screens.

```css
/* MOBILE-FIRST (correct) — base = mobile */
.container { padding: 16px; }
.grid { display: flex; flex-direction: column; }

@media (min-width: 768px) {  /* tablet+ */
  .container { padding: 24px; }
  .grid { flex-direction: row; }
}

@media (min-width: 1024px) { /* desktop+ */
  .container { max-width: 1200px; margin: 0 auto; }
}

/* DESKTOP-FIRST (avoid) — base = desktop, overrides for small */
@media (max-width: 768px) { /* ← harder to maintain */ }
```

**Common breakpoints:**
```
640px   — sm (large phones)
768px   — md (tablets)
1024px  — lg (small laptops)
1280px  — xl (desktops)
1536px  — 2xl (large screens)
```

**Senior techniques:**
```css
/* 1. Fluid typography with clamp() */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
/* min 1.5rem, scales with viewport, max 3rem */

/* 2. Container queries (CSS 2023+) */
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }  /* responds to PARENT size, not viewport */
}

/* 3. Fluid spacing */
.section { padding: clamp(1rem, 3vw, 3rem); }
```

**Trade-off:** Mobile-first is industry standard. Container queries are the future — they make components truly reusable regardless of where they're placed.

---

## 6. CSS Positioning

**Q: Explain the difference between static, relative, absolute, fixed, and sticky.**

```css
/* static — default, normal flow */
.box { position: static; }

/* relative — stays in flow, offset from original position */
.box { position: relative; top: 10px; left: 20px; }
/* Creates a positioning context for absolute children */

/* absolute — removed from flow, positioned relative to nearest positioned ancestor */
.parent { position: relative; }
.child { position: absolute; top: 0; right: 0; }  /* top-right of parent */

/* fixed — removed from flow, positioned relative to viewport */
.navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }

/* sticky — hybrid: relative until scroll threshold, then fixed */
.table-header { position: sticky; top: 0; background: white; }
```

**Curveball: What creates a new stacking context?**
→ `position: relative/absolute/fixed` + `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`

---

## 7. SCSS/SASS — Senior Patterns

**Q: How do you organize SCSS in a large project? What SCSS features do you use?**

**One-line:** SCSS adds variables, nesting, mixins, functions, and partials. In large projects, use 7-1 pattern or component-scoped modules.

```scss
// === VARIABLES ===
$primary: #2563eb;
$spacing-unit: 8px;
$breakpoints: (sm: 640px, md: 768px, lg: 1024px);

// === NESTING (don't go deeper than 3 levels) ===
.card {
  padding: $spacing-unit * 3;
  &__title { font-size: 1.25rem; }     // BEM: .card__title
  &__body { padding: $spacing-unit * 2; }
  &--featured { border: 2px solid $primary; }  // BEM modifier: .card--featured
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
}

// === MIXINS — reusable blocks ===
@mixin respond-to($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  @media (min-width: $value) { @content; }
}
.container {
  padding: 16px;
  @include respond-to(md) { padding: 24px; }
  @include respond-to(lg) { max-width: 1200px; }
}

// === FUNCTIONS ===
@function spacing($multiplier) {
  @return $spacing-unit * $multiplier;
}
.section { padding: spacing(4); }  // → 32px

// === EXTEND (use sparingly) ===
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero { @extend %flex-center; min-height: 100vh; }

// === LOOPS ===
@each $name, $value in $breakpoints {
  .hide-#{$name} {
    @media (max-width: $value) { display: none; }
  }
}

// === PARTIALS & IMPORTS (7-1 pattern) ===
// abstracts/_variables.scss, _mixins.scss
// base/_reset.scss, _typography.scss
// components/_button.scss, _card.scss
// layout/_header.scss, _grid.scss
// pages/_home.scss
// themes/_dark.scss
// vendors/_normalize.scss
// main.scss — imports everything
```

**Trade-off:** SCSS nesting is powerful but can generate bloated selectors. Keep nesting ≤ 3 levels. With CSS Modules or Tailwind, you may not need SCSS at all.

---

## 8. BEM Methodology

**Q: What is BEM? Why use it?**

**One-line:** BEM (Block Element Modifier) is a naming convention that prevents specificity conflicts and makes CSS self-documenting.

```css
/* Block: standalone component */
.card { }

/* Element: part of block (double underscore) */
.card__title { }
.card__image { }
.card__body { }

/* Modifier: variation (double dash) */
.card--featured { }
.card--dark { }
.card__title--large { }
```

```html
<div class="card card--featured">
  <h2 class="card__title card__title--large">Title</h2>
  <div class="card__body">Content</div>
</div>
```

**Trade-off:** BEM keeps specificity flat (all single class selectors = 0,0,1,0). Verbose but predictable. In React, CSS Modules or Tailwind replace BEM.

---

## 9. Tailwind CSS — Senior Patterns

**Q: How does Tailwind work? Pros/cons vs traditional CSS?**

**One-line:** Tailwind is a utility-first CSS framework — you compose styles from atomic classes instead of writing custom CSS.

```jsx
// === BASIC USAGE ===
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
    transition-colors duration-200">
    Click
  </button>
</div>

// === RESPONSIVE (mobile-first, prefix = min-width) ===
<div className="flex flex-col md:flex-row gap-4">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
// flex-col on mobile → flex-row on md (768px)+

// === DARK MODE ===
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Dark mode ready
</div>

// === HOVER, FOCUS, GROUP, PEER ===
<div className="group p-4 hover:bg-gray-50">
  <h3 className="group-hover:text-blue-600">Hover parent, child reacts</h3>
</div>

// === ARBITRARY VALUES ===
<div className="w-[calc(100%-240px)] top-[117px] bg-[#1a1a2e]">
  Custom values when design tokens don't fit
</div>

// === COMMON LAYOUT PATTERNS ===
// Center anything
<div className="grid place-items-center h-screen">Centered</div>

// Responsive card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {cards.map(c => <Card key={c.id} />)}
</div>

// Sticky header
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
  Navbar
</header>

// Truncate text
<p className="truncate">Very long text...</p>
<p className="line-clamp-3">Clamp to 3 lines...</p>
```

**tailwind.config.js — Customization:**
```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],  // purge paths
  theme: {
    extend: {
      colors: { brand: { 500: '#2563eb', 600: '#1d4ed8' } },
      spacing: { '18': '4.5rem' },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),  // prose class for markdown
  ],
}
```

**Trade-off:**
- ✅ No naming, no specificity wars, purged CSS is tiny (~10KB), rapid prototyping
- ❌ Long class strings, harder to read, team needs to learn utilities
- Senior opinion: Use Tailwind for apps, traditional CSS/SCSS for design systems

---

## 10. CSS Modules (React)

**Q: How do CSS Modules work? Why use them?**

**One-line:** CSS Modules scope class names locally by auto-generating unique names at build time. No global conflicts.

```css
/* Button.module.css */
.button { padding: 8px 16px; border-radius: 4px; }
.primary { background: #2563eb; color: white; }
.disabled { opacity: 0.5; cursor: not-allowed; }
```

```jsx
import styles from './Button.module.css';

function Button({ variant, disabled, children }) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''}`}>
      {children}
    </button>
  );
}
// Rendered: <button class="Button_button_x7d2s Button_primary_k3m1n">
```

**Trade-off:** Scoped by default, works with any CSS preprocessor. But dynamic styles need className logic or a lib like `clsx`.

---

## 11. PostCSS & Modern CSS Tooling

**Q: What is PostCSS? How does it differ from SCSS?**

**One-line:** PostCSS is a CSS transformer that uses JS plugins to process CSS. SCSS is a preprocessor language; PostCSS works on standard CSS.

```
SCSS:     .scss → SCSS compiler → .css
PostCSS:  .css  → PostCSS + plugins → .css

Common PostCSS plugins:
├── autoprefixer        → adds vendor prefixes (-webkit-, -moz-)
├── postcss-preset-env  → use future CSS today (nesting, :is(), etc.)
├── cssnano             → minification for production
├── postcss-import      → @import inlining
└── tailwindcss         → Tailwind IS a PostCSS plugin
```

**postcss.config.js:**
```js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({ preset: 'default' }),
  ],
};
```

**CSS Nesting (native, via postcss-preset-env):**
```css
/* Modern CSS nesting — no SCSS needed */
.card {
  padding: 16px;
  & .title { font-size: 1.25rem; }
  &:hover { background: #f3f4f6; }
  @media (min-width: 768px) { padding: 24px; }
}
```

**Trade-off:** PostCSS is lighter than SCSS since you only add what you need. Most modern setups (Next.js, Vite) include PostCSS by default. SCSS is still fine — it's about team preference.

---

## 12. CSS-in-JS (styled-components / Emotion)

**Q: What are pros/cons of CSS-in-JS? When would you use it?**

**One-line:** CSS-in-JS generates scoped styles at runtime using JS. Great for dynamic theming but adds bundle size and runtime cost.

```jsx
// styled-components
import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  background: ${props => props.primary ? '#2563eb' : '#e5e7eb'};
  color: ${props => props.primary ? 'white' : '#111'};
  border: none;
  border-radius: 4px;
  &:hover { opacity: 0.9; }
`;

<Button primary>Click me</Button>

// Emotion (similar API, lighter)
import { css } from '@emotion/react';
const buttonStyle = css`padding: 8px 16px; background: #2563eb;`;
<button css={buttonStyle}>Click</button>
```

**Trade-off:**
- ✅ Dynamic styles, co-located with components, auto-scoped, theming
- ❌ Runtime cost, larger bundle, breaks SSR without extra setup, React DevTools noise
- **2024-2025 trend:** Moving AWAY from runtime CSS-in-JS. Tailwind, CSS Modules, or zero-runtime libs (Vanilla Extract, Panda CSS) are preferred.

---

## 13. CSS Custom Properties (Variables)

**Q: How do CSS custom properties differ from SCSS variables?**

**One-line:** CSS variables are live in the browser (can change at runtime, inherit through DOM). SCSS variables compile away at build time.

```css
/* Define on :root */
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --spacing-md: 16px;
  --font-size-base: 1rem;
}

/* Dark mode override */
[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-bg: #1a1a2e;
}

/* Usage */
.card {
  background: var(--color-bg);
  padding: var(--spacing-md);
  color: var(--color-primary);
}

/* Fallback */
.text { color: var(--color-accent, #333); }  /* #333 if --color-accent not defined */
```

**Senior pattern — Theme switching:**
```jsx
function ThemeToggle() {
  const toggle = () => {
    document.documentElement.setAttribute(
      'data-theme',
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  };
  return <button onClick={toggle}>Toggle Theme</button>;
}
```

**Trade-off:** CSS variables can be changed via JS at runtime (`el.style.setProperty('--color', 'red')`). SCSS variables can't. Use CSS variables for theming, SCSS variables for build-time constants.

---

## 14. Animations & Transitions

**Q: How do you handle animations? CSS vs JS animations?**

```css
/* TRANSITIONS — simple state changes */
.button {
  background: #2563eb;
  transition: background 200ms ease, transform 150ms ease;
}
.button:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}

/* KEYFRAMES — complex multi-step animations */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeSlideIn 300ms ease-out forwards; }

/* PERFORMANCE — only animate these (GPU-accelerated): */
/* ✅ transform, opacity */
/* ❌ width, height, top, left, margin, padding (trigger layout/reflow) */

/* will-change — hint to browser for optimization */
.animated { will-change: transform, opacity; }
/* Remove after animation completes — don't leave it on permanently */

/* prefers-reduced-motion — accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Trade-off:** CSS animations for simple UI (hover, enter/exit). JS animations (Framer Motion, GSAP) for complex sequenced/interactive animations. Always respect `prefers-reduced-motion`.

---

## 15. CSS Performance — Senior Knowledge

**Q: How do you optimize CSS performance?**

```
1. CRITICAL CSS
   → Inline above-the-fold CSS in <head> for fast first paint
   → Tools: critters (Webpack plugin), Next.js does this automatically

2. PURGE UNUSED CSS
   → Tailwind + PurgeCSS removes unused utilities
   → Tree-shaking CSS Modules automatically dead-code eliminates

3. AVOID EXPENSIVE SELECTORS
   ❌ div > ul > li > a.active     (deep nesting, right-to-left matching)
   ✅ .nav-link--active             (single class, fast)

4. REDUCE REFLOWS
   → Batch DOM reads/writes
   → Use transform instead of top/left for animations
   → contain: layout style paint  → isolates element from rest of page

5. FONT LOADING
   → font-display: swap (show fallback immediately, swap when loaded)
   → Preload critical fonts: <link rel="preload" as="font" crossorigin>

6. MODERN CSS FEATURES THAT HELP PERF
   → content-visibility: auto  → skip rendering off-screen content
   → contain: strict           → isolation for layout/paint
```

---

## 16. Accessibility (a11y) in CSS

**Q: How do you make UI accessible with CSS?**

```css
/* 1. Focus indicators — NEVER remove without replacement */
:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
/* :focus-visible = only keyboard focus, not mouse clicks */

/* 2. Visually hidden but screen-reader accessible */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); border: 0; white-space: nowrap;
}

/* 3. Color contrast — WCAG AA minimum */
/* Normal text: 4.5:1 ratio */
/* Large text (18px+ bold or 24px+): 3:1 ratio */

/* 4. Don't rely on color alone */
.error { color: red; border: 2px solid red; }  /* color + visual indicator */

/* 5. Respect user preferences */
@media (prefers-reduced-motion: reduce) { /* disable animations */ }
@media (prefers-color-scheme: dark) { /* dark mode */ }
@media (prefers-contrast: high) { /* high contrast */ }
```

---

## 17. Common Layout Patterns (Quick Reference)

```css
/* HOLY GRAIL LAYOUT */
.layout {
  display: grid;
  grid-template: auto 1fr auto / 200px 1fr 200px;
  min-height: 100vh;
}

/* STICKY FOOTER */
body { display: flex; flex-direction: column; min-height: 100vh; }
main { flex: 1; }
footer { /* automatically at bottom */ }

/* ASPECT RATIO (modern) */
.video { aspect-ratio: 16 / 9; width: 100%; }

/* OVERLAY */
.overlay {
  position: fixed; inset: 0;  /* shorthand for top/right/bottom/left: 0 */
  background: rgba(0,0,0,0.5);
  display: grid; place-items: center;
}

/* TRUNCATE TEXT */
.truncate {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.line-clamp-3 {
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* SCROLLBAR STYLING */
.custom-scroll::-webkit-scrollbar { width: 8px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
```

---

## 18. CSS Logical Properties (i18n)

**Q: What are CSS logical properties?**

**One-line:** Logical properties replace physical (left/right) with flow-relative (inline-start/end) — essential for RTL language support.

```css
/* Physical (breaks in RTL) */
.box { margin-left: 16px; padding-right: 8px; }

/* Logical (works in any direction) */
.box { margin-inline-start: 16px; padding-inline-end: 8px; }

/* Mappings: */
/* margin-left    → margin-inline-start */
/* margin-right   → margin-inline-end */
/* padding-top    → padding-block-start */
/* width          → inline-size */
/* height         → block-size */
/* top            → inset-block-start */
/* inset: 0       → already logical */
```

---

## 19. Tailwind vs SCSS vs CSS Modules — When to Use What

```
┌────────────────────┬───────────────────────────────────────────┐
│ Approach           │ Best For                                  │
├────────────────────┼───────────────────────────────────────────┤
│ Tailwind           │ Rapid app development, prototypes,        │
│                    │ consistent design systems, small teams     │
├────────────────────┼───────────────────────────────────────────┤
│ SCSS               │ Large enterprise apps, design systems,    │
│                    │ teams familiar with traditional CSS        │
├────────────────────┼───────────────────────────────────────────┤
│ CSS Modules        │ React/Next.js apps needing scoped styles  │
│                    │ without runtime cost                       │
├────────────────────┼───────────────────────────────────────────┤
│ CSS-in-JS          │ Highly dynamic theming, component libs    │
│ (styled-comp)      │ (but trend is moving away)                │
├────────────────────┼───────────────────────────────────────────┤
│ Vanilla CSS        │ Small projects, when you want zero deps   │
│ + Custom Props     │ and modern browsers only                   │
└────────────────────┴───────────────────────────────────────────┘
```

---

## 20. Quick-Fire Interview Answers

| Question | Senior Answer |
|----------|--------------|
| `em` vs `rem` | `em` = relative to parent font-size, `rem` = relative to root. Use `rem` for consistency. |
| `display: none` vs `visibility: hidden` | `none` removes from flow + accessibility tree. `hidden` keeps space, still in a11y tree. |
| `opacity: 0` vs `visibility: hidden` | Both keep space. `opacity:0` still receives clicks. `visibility:hidden` doesn't. |
| How to center a div? | `display: grid; place-items: center` or Flexbox `justify-content + align-items: center`. |
| What is `z-index` and stacking context? | `z-index` only works on positioned elements. Each stacking context is independent. |
| `@import` vs `<link>`? | `<link>` loads parallel, `@import` blocks. Never use `@import` in production CSS. |
| What is FOUC? | Flash of Unstyled Content — browser renders before CSS loads. Fix: critical CSS inline, `font-display: swap`. |
| `min-width` vs `max-width` in queries? | `min-width` = mobile-first (add complexity up). `max-width` = desktop-first (override down). |
| What is specificity of `*`? | Zero specificity (0,0,0,0). Overridden by everything. |
| `inherit` vs `initial` vs `unset`? | `inherit` = parent's value, `initial` = CSS spec default, `unset` = inherit if inheritable, else initial. |
| What triggers a browser reflow? | Reading `offsetHeight`, changing `width/height/margin`, DOM insertions. Batch reads, then writes. |
| `contain` property? | Isolates element: `contain: layout style paint` — browser skips recalculating this subtree. |

---

## 21. Next.js Styling (Bonus — relevant for Experion)

```
Next.js supports out of the box:
├── CSS Modules       → .module.css (default, recommended)
├── Global CSS        → import in _app.tsx or layout.tsx only
├── Tailwind CSS      → first-class support, just configure
├── CSS-in-JS         → styled-components/emotion (needs config for SSR)
└── Sass/SCSS         → npm install sass, then use .module.scss

// App Router + Tailwind (most common 2025 setup)
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// Component
export default function Page() {
  return <h1 className="text-4xl font-bold text-center mt-20">Hello</h1>;
}
```

---

*Last updated: Feb 26, 2026 — Experion Senior ReactJS Interview Prep*
