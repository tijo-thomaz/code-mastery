# 📊 Failed Interview Pattern Analysis

> 10+ interviews analyzed. 3 deadly patterns identified.

---

## Raw Data

| # | Company | Round | Task | Result | Category |
|---|---------|-------|------|--------|----------|
| 1 | Wipro | JS | Frequency count of array | ❌ Failed | Array manipulation |
| 2 | Wipro | React | List + addTodo | ❌ Failed | React build task |
| 3 | Mphasis | L1 | Fibonacci | ✅ Passed | — |
| 4 | Mphasis | L2 | Golang coding | ❌ Failed (profile mismatch) | Not relevant |
| 5 | UST | L2 | React | ✅ Passed then ghosted | — |
| 6 | UST | F2F L1 | Dedup emails (JS) + React | ❌ Failed | Array manipulation |
| 7 | UST | L2 | GroupBy count + type-based grouping + React todo list | ❌ Failed | Array manipulation + React build |
| 8 | Socure | React | Nested color box (modal stacking) | ❌ Failed | React build task |
| 9 | Socure | JS | Array.from({length}) usage | ❌ Failed | Array fundamentals |
| 10 | Infosys | React | File explorer component | ❌ Failed | React build task |
| 11 | Arrow | JS | [1,1,2,3,5,8,13,21] — didn't recognize Fibonacci | ❌ Failed | Pattern recognition |

---

## 🔴 The 3 Patterns That Keep Killing You

### Pattern 1: Array Manipulation Under Pressure (5 out of 11)

**Failed at:** frequency count, dedup, groupBy, Array.from({length}), Fibonacci recognition

**Root cause:** You know `map`, `filter`, `reduce` exist — but under pressure you can't pick the RIGHT one and write it fluently. These are NOT hard problems. They're **muscle memory** problems.

**The 5 array operations every interview asks (in different disguises):**

| Operation | What They Ask | Core Method |
|-----------|--------------|-------------|
| **Frequency count** | "Count occurrences", "find duplicates", "most common element" | `reduce` into an object/Map |
| **Dedup** | "Remove duplicates", "unique values", "dedup emails" | `Set` or `filter` with `indexOf` |
| **GroupBy** | "Group by type/category", "organize by X" | `reduce` into an object with arrays |
| **Transform** | "Flatten", "reshape data", "create from length" | `Array.from({length})`, `flat`, `flatMap` |
| **Sequence recognition** | Fibonacci, arithmetic, geometric series | Know the first 10 of each by sight |

**Realization:** These 5 operations cover ~80% of JS coding questions. You don't need to be a LeetCode expert — you need these 5 patterns on autopilot.

---

### Pattern 2: React "Build X From Scratch" Paralysis (4 out of 11)

**Failed at:** Todo list (TWICE), file explorer, nested modal/box

**Root cause:** You know React concepts (hooks, state, JSX) but when they say "build a todo app" your brain tries to think about EVERYTHING at once — state shape, event handlers, rendering, styling — and freezes.

**The tasks that keep repeating:**

| Task | How Often It Appears | Why You Freeze |
|------|---------------------|----------------|
| **Todo list** | Almost every interview | You try to build the whole thing at once instead of incrementally |
| **File explorer / tree** | Common at mid-senior level | Recursive rendering feels overwhelming |
| **Modal / overlay / stacked UI** | Common | Positioning + z-index + state management together |
| **List with add/edit/delete** | Everywhere | Same as todo — CRUD with state |

**Realization:** Every React build task is the same skeleton:
1. State: what data do I hold?
2. Render: how do I display it?
3. Handlers: how does the user change it?

If you can build a todo app in your sleep, you can build 80% of interview components.

---

### Pattern 3: Pattern Recognition Failure (Fibonacci, Array.from)

**Failed at:** Didn't recognize [1,1,2,3,5,8,13,21] as Fibonacci. Didn't know Array.from({length}) pattern.

**Root cause:** You haven't seen these patterns enough times for instant recognition.

**Must-recognize patterns:**

| Pattern | Recognition | Example |
|---------|------------|---------|
| Fibonacci | Each number = sum of previous two | 1,1,2,3,5,8,13,21,34 |
| Arithmetic sequence | Constant difference | 2,4,6,8 or 3,6,9,12 |
| Powers of 2 | Doubling | 1,2,4,8,16,32,64 |
| Triangular numbers | +1, +2, +3, +4... | 1,3,6,10,15,21 |
| Array.from({length: n}) | Creates array of n items | Like Python's range() |

---

## 📌 What This Means for the 4-Day Plan

> Your biggest enemy is NOT missing knowledge. It's that your hands freeze on the keyboard because these patterns aren't in your muscle memory yet.

**Priority adjustment:**
1. Day 1 must include aggressive hands-on array drills (frequency, dedup, groupBy) — not just reading
2. Day 2 must include building a todo app from scratch at LEAST 3 times until it's automatic
3. Every day: 30 min of just TYPING code — not thinking about it, typing it like a pianist plays scales
