# Experion Interview — March 2026

> L1 ✅ Passed | L2 ❌ Failed (no HR callback — silence since Wednesday March 4)

---

### Entry #6

**Date:** 2026-03-04 (Wednesday)
**Company:** Experion
**Role:** Frontend / React Developer
**Round:** L2 — Technical Deep Dive
**Interviewer Vibe:** Unknown
**L1 Result:** ✅ Cleared — technical was up to the mark

---

## Questions That Tripped You Up

### Q1: React Fiber vs Old Reconciliation Model

**My Answer:**
> (Fill in what you actually said — be honest, even if it was vague or incomplete)

**Correct / Better Answer:**

**Old Model (Stack Reconciler — React ≤15):**
- Reconciliation was **synchronous and recursive**
- Once React started rendering a tree, it couldn't stop until the entire tree was processed
- Large component trees → **blocked the main thread** → janky UI, dropped frames
- No way to prioritize urgent updates (like user input) over less important ones

**React Fiber (React 16+):**
- Complete rewrite of the reconciler — the tree is now a **linked list of "fiber" nodes**
- Rendering is **incremental** — React can pause, resume, and abort work
- Each fiber node is a **unit of work** that can be processed independently
- Enables **priority-based scheduling:**
  - High priority: user input, animations (processed immediately)
  - Low priority: data fetching results, offscreen updates (can be deferred)
- Powers Concurrent Mode features: `useTransition`, `useDeferredValue`, `Suspense`

**Key differences at a glance:**

| Aspect | Stack Reconciler | Fiber |
|--------|-----------------|-------|
| Rendering | Synchronous, blocking | Async, interruptible |
| Data structure | Recursive tree walk | Linked list of fiber nodes |
| Priority | None — all updates equal | Priority lanes |
| Can pause/resume | ❌ No | ✅ Yes |
| Main thread | Blocked until done | Yields control back |

**One-liner to remember:**
> "Fiber broke the monolithic render into tiny resumable units of work so React can stay responsive."

**Why I Got It Wrong:**
> Didn't study React internals deeply enough. Knew "Fiber is the new thing" but couldn't articulate the WHY and HOW.

**Follow-up Action:**
- [ ] Read: https://github.com/acdlite/react-fiber-architecture
- [ ] Watch: Lin Clark's "A Cartoon Intro to Fiber" talk
- [ ] Write own explanation of Fiber in 5 sentences from memory
- [ ] Study `requestIdleCallback` and how Fiber uses the concept

**Status:** 🔴 Not reviewed

---

### Q2: Build and Dev Scripts (package.json scripts, bundler config)

**My Answer:**
> (Fill in what you actually said)

**Correct / Better Answer:**

**`dev` script — Development mode:**
```json
"dev": "next dev"        // Next.js
"dev": "vite"            // Vite
"dev": "react-scripts start"  // CRA
```
- Starts a local dev server with **Hot Module Replacement (HMR)**
- Source maps enabled for debugging
- No minification, no tree-shaking
- Environment: `NODE_ENV=development`
- Fast rebuilds using incremental compilation

**`build` script — Production build:**
```json
"build": "next build"     // Next.js
"build": "vite build"     // Vite
"build": "react-scripts build"  // CRA
```
- Creates optimized production bundle
- **Minification** (Terser/esbuild), **tree-shaking**, **code splitting**
- Environment: `NODE_ENV=production`
- Output goes to `dist/` or `build/` or `.next/`
- Dead code elimination, CSS optimization

**Key differences:**

| Aspect | `dev` | `build` |
|--------|-------|---------|
| Purpose | Local development | Production deployment |
| Speed | Fast startup, HMR | Slower (full optimization) |
| Output | In-memory (dev server) | Static files on disk |
| Minified | No | Yes |
| Source maps | Full | Minimal or none |
| Tree-shaking | No | Yes |

**Why I Got It Wrong:**
> Use these scripts daily but never articulated the differences clearly. Classic "I use it but can't explain it" problem.

**Follow-up Action:**
- [ ] Read Vite docs on dev vs build mode
- [ ] Read Next.js docs on `next dev` vs `next build` vs `next start`
- [ ] Practice explaining the build pipeline verbally

**Status:** 🔴 Not reviewed

---

### Q3: Legacy Peer Dependencies (`--legacy-peer-deps`)

**My Answer:**
> (Fill in what you actually said)

**Correct / Better Answer:**

**What are peer dependencies?**
- A peer dependency says: "I don't install this myself, but I need the project using me to have it."
- Example: A React component library lists `react` as a `peerDependency` — it doesn't bundle React, it expects YOUR project to have React installed.

**The problem (npm 7+ changed behavior):**
- **npm 6 and below:** Peer dependency conflicts were just **warnings** — install continued
- **npm 7+:** Peer dependency conflicts are **errors** — install **fails** by default
- This broke tons of projects when people upgraded to npm 7+

**Example conflict:**
```
Package A requires react@^17.0.0 (peer)
Package B requires react@^18.0.0 (peer)
Your project has react@18.2.0
→ npm 7+ throws: "Could not resolve peer dependency react@^17.0.0"
```

**`--legacy-peer-deps` flag:**
```bash
npm install --legacy-peer-deps
```
- Tells npm to **use the old npm 6 behavior** — ignore peer dep conflicts
- It's a workaround, not a fix
- The "legacy" refers to the legacy (old) algorithm for resolving peer deps

**When to use it:**
- When installing packages that haven't updated their peer dep ranges yet
- When you're stuck and need to unblock (but understand the risk)
- Common with older packages that still declare `react@^16 || ^17` but you're on 18/19

**Better alternatives:**
- `npm install --force` — forces install but still attempts to resolve
- Update the outdated package to a version with correct peer dep ranges
- Use `overrides` in `package.json` to force a specific version:
  ```json
  "overrides": {
    "some-package": {
      "react": "$react"
    }
  }
  ```

**Why I Got It Wrong:**
> Probably used `--legacy-peer-deps` many times as a copy-paste fix from Stack Overflow without understanding what it actually does.

**Follow-up Action:**
- [ ] Read npm docs on peer dependencies
- [ ] Understand the difference between `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`
- [ ] Practice explaining `--legacy-peer-deps` vs `--force` vs `overrides`

**Status:** 🔴 Not reviewed

---

### Q4: Other Questions

> ⚠️ Fill in any other questions you remember — even fragments help.
> 
> - Question: ___
> - What I said: ___
> - What I should have said: ___

---

## Pattern Update

Adding to the [failed-interview-patterns.md](../experion-interview/failed-interview-patterns.md):

| # | Company | Round | Task | Result | Category |
|---|---------|-------|------|--------|----------|
| 12 | Experion | L2 | React Fiber internals, build/dev scripts | ❌ Failed | React internals + tooling knowledge |

**New Pattern Emerging: "I use it but can't explain it"**
- React Fiber: Use React daily but can't explain the engine
- Build/dev scripts: Run them every day but can't articulate what they do
- This is a **depth gap**, not a knowledge gap

---

## Recovery Plan

> Don't just feel bad. Do the drills.

- [ ] Day 1: Study React Fiber architecture (read + write summary)
- [ ] Day 2: Study build tooling (Vite/Webpack/Next.js internals)
- [ ] Day 3: Practice explaining both topics out loud (record yourself)
- [ ] Day 4: Mock interview covering React internals
- [ ] Fill in Q3 and any other questions you remember
