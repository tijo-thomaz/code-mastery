# ♿ Web Accessibility (a11y) — Senior React Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. What is Web Accessibility (a11y)?

**One-line:** Making web apps usable by everyone — including people using screen readers, keyboards, or assistive tech.

```
WCAG (Web Content Accessibility Guidelines):
  → The standard. Currently WCAG 2.1 / 2.2.
  → Levels: A (minimum) → AA (target for most apps) → AAA (ideal but hard)

POUR Principles:
  P — Perceivable    → Users can SEE or HEAR the content (alt text, captions, contrast)
  O — Operable       → Users can NAVIGATE and INTERACT (keyboard, no time traps)
  U — Understandable → Users can COMPREHEND the content (clear labels, predictable UI)
  R — Robust         → Works with ASSISTIVE TECH now and in the future (semantic HTML, ARIA)
```

**Say this in interview:**
> "Accessibility means building for all users, not just mouse-and-screen users. I follow WCAG 2.1 AA as my baseline — it covers the POUR principles: content must be perceivable, operable, understandable, and robust. It's also a legal requirement in many regions — ADA in the US, EAA in Europe."

**Trade-off:** Accessibility adds development time upfront, but prevents lawsuits, expands your user base, and improves UX for everyone (curb-cut effect — captions help in noisy rooms, keyboard nav helps power users).

---

## 2. Semantic HTML

**One-line:** Use the right HTML element for the job — `<button>` not `<div onClick>`, `<nav>` not `<div class="nav">`.

```
Semantic Structure:
├── <header>    → Site/section header (logo, nav)
├── <nav>       → Navigation links
├── <main>      → Primary content (one per page)
├── <article>   → Self-contained content (blog post, card)
├── <section>   → Thematic grouping with a heading
├── <aside>     → Sidebar, related content
└── <footer>    → Site/section footer

Screen Reader Behavior:
  → Announces landmarks: "navigation", "main content", "banner"
  → Users can JUMP between landmarks (like a table of contents)
  → <div> and <span> = invisible to screen readers (no semantic meaning)
```

**Say this in interview:**
> "Semantic HTML is free accessibility. A `<button>` gives you keyboard support, focus management, and screen reader announcement out of the box. A `<div onClick>` gives you none of that — you'd have to manually add role, tabIndex, keyDown handlers. I always reach for native HTML first."

---

## 3. ARIA Roles, States, and Properties

**One-line:** ARIA fills the gaps when native HTML can't express the UI's meaning — but native HTML always comes first.

```
First Rule of ARIA: Don't use ARIA if a native HTML element does the job.
  ❌ <div role="button">  →  ✅ <button>
  ❌ <div role="link">    →  ✅ <a href="...">

When ARIA IS needed:
├── role="dialog"         → Modal dialog (with aria-modal="true")
├── role="alert"          → Important message announced immediately
├── role="tablist/tab/tabpanel" → Custom tab UI
├── aria-label="Close"    → Label when no visible text (icon buttons)
├── aria-labelledby="id"  → Points to another element as the label
├── aria-describedby="id" → Points to a description (error messages)
├── aria-expanded="true"  → Dropdown/accordion is open
├── aria-hidden="true"    → Hide from screen readers (decorative elements)
├── aria-live="polite"    → Announces dynamic content changes (search results count)
└── aria-live="assertive" → Interrupts to announce (error alerts)
```

**Say this in interview:**
> "I follow the first rule of ARIA: don't use it if native HTML works. But for custom widgets like modals, tabs, or dropdowns, ARIA is essential. For example, a modal needs `role='dialog'`, `aria-modal='true'`, and `aria-labelledby` pointing to the title. I use `aria-live='polite'` for dynamic content like toast notifications so screen readers announce updates without interrupting."

---

## 4. Keyboard Navigation

**One-line:** Every interactive element must be reachable and operable with keyboard alone — Tab, Enter, Space, Escape, Arrow keys.

```
Tab Order:
├── tabIndex="0"   → Add to natural tab order (for custom interactive elements)
├── tabIndex="-1"  → Focusable via JS only, NOT in tab order (for programmatic focus)
├── tabIndex="5"   → ❌ NEVER use positive values (breaks natural order)
└── Natural order  → Follows DOM order, so structure HTML logically

Key Patterns:
├── Tab / Shift+Tab  → Move between focusable elements
├── Enter / Space    → Activate buttons, links
├── Escape           → Close modals, dropdowns
├── Arrow keys       → Navigate within widgets (tabs, menus, radio groups)

Skip Links:
  → Hidden link at top: "Skip to main content"
  → Lets keyboard users bypass navigation
  → <a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>
```

**Say this in interview:**
> "I ensure every interactive element is keyboard-accessible. I never use positive tabIndex — it breaks natural DOM order. I use tabIndex 0 to add custom elements to tab order, and tabIndex -1 for elements I need to focus programmatically, like after closing a modal. I also add skip links so keyboard users can jump past repetitive navigation."

---

## 5. Focus Management in React

**One-line:** When the UI changes (modal opens, route changes, item deleted), move focus to where the user needs it.

```jsx
// Focus a specific element with useRef
const headingRef = useRef(null);
useEffect(() => {
  headingRef.current?.focus();
}, []);
<h1 ref={headingRef} tabIndex={-1}>Dashboard</h1>

// Focus after route change (React Router)
useEffect(() => {
  document.querySelector('h1')?.focus();
}, [location.pathname]);

// Focus trap in modal — keep Tab cycling inside
// Use a library: react-focus-lock or focus-trap-react
import FocusLock from 'react-focus-lock';
<FocusLock>
  <dialog open>
    <h2>Confirm Delete</h2>
    <button>Cancel</button>
    <button>Delete</button>
  </dialog>
</FocusLock>
```

**Say this in interview:**
> "In React, I manage focus with useRef and focus(). When a modal opens, I trap focus inside using react-focus-lock so Tab can't escape to background content. When it closes, I return focus to the trigger button. On route changes, I move focus to the page heading so screen reader users know they've navigated. I use tabIndex -1 on non-interactive elements I need to focus programmatically."

---

## 6. Alt Text

**One-line:** Every `<img>` needs an `alt` attribute — meaningful for informative images, empty (`alt=""`) for decorative ones.

```
Decision Tree:
├── Image conveys information? → alt="Woman presenting quarterly results chart"
├── Image is decorative?       → alt="" (screen reader skips it)
├── Image is a link/button?    → alt describes the ACTION: alt="Go to homepage"
├── Complex image (chart)?     → alt="Chart summary" + longer description nearby
└── No alt at all?             → ❌ Screen reader reads the filename: "IMG_2847.jpg"

Rules:
  → Don't start with "Image of..." or "Picture of..." (screen reader already says "image")
  → Be concise but meaningful
  → Context matters: same image might need different alt text in different contexts
```

---

## 7. Color Contrast

**One-line:** Text must have enough contrast against its background — WCAG AA requires 4.5:1 for normal text, 3:1 for large text.

```
WCAG AA Requirements:
├── Normal text (< 18px):  4.5:1 contrast ratio
├── Large text (≥ 18px bold or ≥ 24px): 3:1 contrast ratio
├── UI components (buttons, inputs): 3:1 against adjacent colors
└── Don't rely on color ALONE to convey info (add icons, text, patterns)

Tools:
├── Chrome DevTools → Inspect element → color picker shows contrast ratio
├── axe DevTools browser extension
├── Lighthouse accessibility audit
└── WebAIM Contrast Checker (webaim.org/resources/contrastchecker)
```

---

## 8. Accessible Forms

**One-line:** Every input needs a visible label, errors need to be linked to their fields, and groups need `<fieldset>`.

```jsx
// Labels — use htmlFor in React (not "for")
<label htmlFor="email">Email</label>
<input id="email" type="email" required aria-describedby="email-error" />
<span id="email-error" role="alert">Please enter a valid email</span>

// Fieldset + Legend — group related inputs
<fieldset>
  <legend>Shipping Address</legend>
  <label htmlFor="street">Street</label>
  <input id="street" />
  <label htmlFor="city">City</label>
  <input id="city" />
</fieldset>

// Key patterns:
// ├── htmlFor + id links label to input (clicking label focuses input)
// ├── aria-describedby links error message to input
// ├── role="alert" on error = screen reader announces immediately
// ├── required attribute = screen reader says "required"
// └── aria-invalid="true" when validation fails
```

---

## 9. Common Interview Questions — Scripted Answers

### Q: "What are ARIA roles? When do you use them?"

**Say this in interview:**
> "ARIA roles tell assistive technology what an element IS when native HTML can't express it. For example, `role='dialog'` on a custom modal, `role='alert'` for important messages, or `role='tablist'` for a custom tab component. But the first rule of ARIA is: don't use it if native HTML does the job. A `<button>` is always better than `<div role='button'>` because native elements come with keyboard support, focus management, and screen reader behavior built in. I only reach for ARIA when building custom widgets that don't have native equivalents."

### Q: "How do you make a modal accessible?"

**Say this in interview:**
> "An accessible modal needs five things: First, `role='dialog'` and `aria-modal='true'` so screen readers know it's a modal. Second, `aria-labelledby` pointing to the modal title. Third, focus trap — Tab should cycle within the modal, not escape to background content. I use react-focus-lock for this. Fourth, Escape key closes the modal. Fifth, when the modal closes, focus returns to the button that opened it. I also add `aria-hidden='true'` to the background content so screen readers can't navigate behind the modal."

### Q: "What's your approach to accessibility in a React app?"

**Say this in interview:**
> "I build accessibility in from the start, not as an afterthought. First, semantic HTML — I use native elements like `<button>`, `<nav>`, `<main>` instead of divs. Second, keyboard navigation — I test every flow without a mouse. Third, ARIA where needed — for custom widgets like modals and tabs. Fourth, automated testing — I run axe-core in my test suite with jest-axe, and Lighthouse in CI. Fifth, manual testing — I periodically test with VoiceOver or NVDA because automated tools only catch about 30% of issues. My target is WCAG 2.1 AA compliance."

---

## 10. Quick Testing Checklist

```
Before shipping, I check:
□ Tab through the entire page — can I reach and operate everything?
□ Use only keyboard — Enter, Space, Escape, Arrow keys all work?
□ Run axe DevTools extension — zero critical violations?
□ Check color contrast in DevTools — all ratios pass AA?
□ Turn on VoiceOver/NVDA — does it make sense read aloud?
□ All images have meaningful alt (or alt="" if decorative)?
□ All forms have labels, errors are announced?
□ Focus is managed after modals, route changes, deletions?
```

---

*Last updated: Feb 26, 2026 — Experion Senior ReactJS Interview Prep*
