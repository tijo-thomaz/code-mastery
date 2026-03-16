# 📚 Interview Prep — Common Patterns & Cheatsheets

> Not tied to any company. Reusable across all interviews.

---

## 📂 Structure

```
interview-prep/
├── cheatsheets/              ← Topic cheatsheets (reusable across all interviews)
├── mock-rounds/              ← Generic mock interview scripts
└── companies/                ← Per-company tracking
    ├── experion/             ← 🗄️ SHELVED
    │   └── STATUS.md
    ├── tech-versant/         ← 🟢 ACTIVE
    │   └── STATUS.md
    └── <new-company>/        ← Copy template below
        └── STATUS.md
```

### Adding a new company

Create `companies/<company-name>/STATUS.md` using this template:

```markdown
# <Company> — 🟢 ACTIVE

| Round | Status | Date | Notes |
|-------|--------|------|-------|
| Screening | ⬜ Pending | — | — |
| L1 Technical | ⬜ Pending | — | — |
| L2 Deep Dive | ⬜ Pending | — | — |
| HR / Offer | ⬜ Pending | — | — |
```

**Status icons:** `🟢 ACTIVE` · `🗄️ SHELVED` · `❌ REJECTED` · `🏆 OFFER`
**Round status:** `⬜ Pending` · `⏳ Scheduled` · `✅ Cleared` · `❌ Failed` · `⏳ No contact`

---

## 🎯 Quick Reference — What to Read Before Each Round Type

| Round Type | Read These |
|------------|-----------|
| **Initial Screening (30 min)** | `mock-rounds/mock-round1-screening.md`, `mock-rounds/rehearsal-script.md` |
| **Technical L1 (JS/React)** | `cheatsheets/advanced-concepts-cheatsheet.md`, `cheatsheets/dom-events-cheatsheet.md` |
| **Technical L2 (Deep Dive)** | `cheatsheets/auth-deep-dive-cheatsheet.md`, `cheatsheets/mfe-architecture-cheatsheet.md`, `cheatsheets/security-cheatsheet.md` |
| **React Build Task** | `cheatsheets/boss-drills-react.md`, DRILL-PROGRESS-TRACKER.md (React section) |
| **Next.js / SSR** | `cheatsheets/nextjs-cheatsheet.md`, `mock-rounds/nextjs-deep-dive-round2.md` |
| **CSS / Styling** | `cheatsheets/css-scss-tailwind-cheatsheet.md`, `cheatsheets/accessibility-cheatsheet.md` |
| **Testing** | `cheatsheets/jest-tdd-cheatsheet.md` |
| **API / Backend** | `cheatsheets/rest-api-cheatsheet.md` |

---

## 🧠 "I Use It But Can't Explain It" — Verbal Drills

> Full drill tracker with attempts: see [DRILL-PROGRESS-TRACKER.md](../DRILL-PROGRESS-TRACKER.md) → section "I USE IT BUT CAN'T EXPLAIN IT"
> Full answers for Fiber, build/dev, peer deps: see [failed-interviews/experion-march-2026.md](../failed-interviews/experion-march-2026.md)

**Before ANY interview, practice explaining these out loud (60–90s each):**

1. React Fiber vs old reconciler
2. `npm run dev` vs `npm run build` — what actually happens
3. `--legacy-peer-deps` — what and why
4. Virtual DOM & reconciliation
5. SSR vs CSR vs SSG vs ISR
6. Webpack vs Vite
7. Tree shaking & dead code elimination
8. HMR (Hot Module Replacement)
9. `useEffect` vs `useLayoutEffect`
10. dependency types in package.json

---

## 🔴 Your 3 Deadly Patterns (from 12+ interviews)

> Full analysis: `cheatsheets/failed-interview-patterns.md`

1. **Array manipulation under pressure** — frequency, dedup, groupBy freeze
2. **React "build X" paralysis** — todo, file explorer, modal freeze
3. **"I use it but can't explain it"** — Fiber, build scripts, peer deps (NEW from Experion)

---

## 📋 Interview Pipeline

> Each company has its own folder in `companies/` with a `STATUS.md`.

| Company | Status | Folder | Next Action |
|---------|--------|--------|-------------|
| ~~Experion~~ | 🗄️ Shelved | [companies/experion/](companies/experion/STATUS.md) | No HR contact since L2 |
| **Tech Versant** | 🟢 Active | [companies/tech-versant/](companies/tech-versant/STATUS.md) | **Screening Tue Mar 10** |
