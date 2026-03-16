# 🔥 TONIGHT'S BATTLE PLAN — 22:54 to 11:00 AM Interview

> **NO PANIC. You cleared Round 1. They already like you.**
> Round 2 = show them you THINK, not just recite.

---

## ⏰ SCHEDULE (Non-Negotiable)

```
22:54 - 23:30  ▸ BLOCK 1: Anti-Panic Script (READ THIS FIRST — 36 min)
23:30 - 00:30  ▸ BLOCK 2: JS Core — debounce, memoize, event loop (60 min)
00:30 - 01:30  ▸ BLOCK 3: TypeScript — utility types from scratch (60 min)
01:30 - 02:00  ▸ BLOCK 4: BREAK — walk, water, snack (30 min) ← NON-NEGOTIABLE
02:00 - 03:00  ▸ BLOCK 5: React Advanced — build autocomplete from memory (60 min)
03:00 - 04:00  ▸ BLOCK 6: Next.js deep dive — patterns not definitions (60 min)
04:00 - 04:30  ▸ BLOCK 7: TDD — memorize the login form test (30 min)
04:30 - 05:30  ▸ BLOCK 8: Mock interview — answer 10 questions OUT LOUD (60 min)
05:30 - 06:00  ▸ BLOCK 9: Quick-fire cards — read the tables below (30 min)
06:00 - 08:00  ▸ 😴 SLEEP (2 hrs) — set TWO alarms
08:00 - 08:30  ▸ Shower, eat, get ready
08:30 - 09:30  ▸ BLOCK 10: Final review — read ONLY the quick-fire tables
09:30 - 10:00  ▸ Light walk / sit quietly. NO MORE STUDYING.
10:00 - 10:45  ▸ Setup: quiet room, water, laptop ready, headphones tested
10:45 - 11:00  ▸ Breathing: 4-7-8 pattern. You're ready.
11:00           ▸ 🎯 INTERVIEW
```

### RULES:
1. **No new topics.** You have all the material. Tonight is PRACTICE, not learning.
2. **Say answers OUT LOUD.** Your brain knows it. Your mouth needs to practice.
3. **Take the break at 01:30.** A tired brain panics. A rested brain performs.
4. **Stop at 06:00.** Sleep > one more drill. Seriously.

---

## 🛟 THE ANTI-PANIC SCRIPT (Read this 3 times right now)

### When You Hear a Question:

```
DON'T: Start talking immediately (that's how you ramble and freeze)

DO THIS EVERY TIME:
  1. PAUSE 3 seconds (take a breath — this is a POWER MOVE, not weakness)
  2. CLASSIFY the question:
     → "Explain X"        → Definition + how it works + when I'd use it
     → "What's the diff"  → Quick table, then "I'd use X when... Y when..."
     → "What will output?" → "Let me trace this step by step"
     → "Build X"          → "Let me start with the state shape"
     → "How would you..."  → "I'd approach this in 3 steps..."
     → "What's wrong?"    → "Let me read through this... I see..."
  3. ONE-LINE ANSWER first (5 seconds)
  4. THEN elaborate (20-30 seconds)
  5. STOP. Don't ramble. If they want more, they'll ask.
```

### When You BLANK:

```
"Let me think about that for a moment..."
  → This buys you 5-10 seconds
  → Use those seconds to connect it to something you DO know

"I know this relates to [broader concept]..."
  → Shows you're thinking, not frozen

"I haven't used that specific API, but the concept is..."
  → Honest + still demonstrates understanding
```

### When You're Asked Simple JS and Panic:

The panic hits because you OVERTHINK simple questions. Here's the antidote:

```
Q: "What is a closure?"
PANIC BRAIN: "Oh god, what if they ask a follow-up I don't know..."
CALM BRAIN:  "A closure is a function that remembers variables from its
              outer scope even after that scope finishes. I use them
              for data privacy — like a counter factory."
→ DONE. 15 seconds. Stop talking.

Q: "What is hoisting?"
PANIC BRAIN: "Wait, is it var only or let too? What about functions?"
CALM BRAIN:  "Hoisting moves declarations to the top of their scope.
              var is hoisted to undefined. let/const are hoisted but
              in the TDZ — accessing before declaration throws.
              Function declarations are fully hoisted."
→ DONE. 15 seconds.

Q: "Explain 'this'"
PANIC BRAIN: "There are so many rules..."
CALM BRAIN:  "this depends on HOW the function is called:
              1. Standalone call → undefined (strict) / window
              2. Method call → the object
              3. call/apply/bind → whatever you pass
              4. new → the new object
              5. Arrow → inherits from parent scope"
→ DONE. 20 seconds.
```

### THE GOLDEN RULE:
**Short, confident answers > long, rambling ones.**
If they want more depth, they'll ask. A 15-second crisp answer beats a 2-minute ramble EVERY time.

---

## 📋 SIMPLE JS — Quick Answers (No Panic Version)

Read these out loud 3 times. These are the "easy" questions where panic hits.

| Question | Crisp Answer (say this EXACTLY) |
|---|---|
| **What is a closure?** | "A function that remembers variables from its outer scope. I use them for private state — counter factories, memoize, once patterns." |
| **What is hoisting?** | "Declarations move to top of scope. var → undefined. let/const → TDZ. Function declarations → fully hoisted. Function expressions → NOT hoisted." |
| **Explain this** | "Depends on call site. Standalone → undefined. obj.fn() → obj. call/apply → explicit. new → new object. Arrow → inherits parent." |
| **== vs ===** | "=== is strict — no coercion. == coerces types. I always use ===." |
| **var vs let vs const** | "var: function-scoped, hoisted. let: block-scoped, TDZ. const: like let but can't reassign. I default to const." |
| **What is the event loop?** | "JS is single-threaded. Sync runs first. Then all microtasks (Promises). Then one macrotask (setTimeout). Repeat." |
| **What is a Promise?** | "An object representing an async operation's eventual result. Three states: pending, fulfilled, rejected. I chain with .then or use async/await." |
| **map vs forEach** | "map returns a new array. forEach returns undefined. Use map to transform, forEach for side effects." |
| **null vs undefined** | "undefined: variable declared but not assigned. null: intentional absence of value. typeof null is 'object' — historical bug." |
| **Spread vs Rest** | "Same syntax (...), different purpose. Spread expands: [...arr]. Rest collects: function(...args). Spread = unpack. Rest = pack." |
| **What is destructuring?** | "Extract values from objects/arrays into variables. const { name } = user. const [first, ...rest] = arr." |
| **Arrow vs regular function** | "Arrow: no own this (inherits), no arguments object, can't be constructor. I use arrows for callbacks, regular for methods." |
| **What is prototypal inheritance?** | "Objects have a prototype chain. Property lookup walks up the chain. class is sugar over prototypes." |
| **What is the DOM?** | "Document Object Model — browser's tree representation of HTML. JavaScript manipulates it to update the page." |
| **What is event delegation?** | "One listener on a parent catches all child events via bubbling. Better performance, works for dynamic elements." |
| **What is debounce?** | "Wait until the user STOPS doing something. clearTimeout + setTimeout. Search input — fire after they stop typing." |
| **What is throttle?** | "Fire at most once per interval. Scroll handlers — fire every 100ms, not every pixel." |
| **Sync vs Async** | "Sync blocks until done. Async doesn't block — continues and handles result later via callbacks, promises, or async/await." |

---

## 📋 REACT — Quick Answers

| Question | Crisp Answer |
|---|---|
| **What is Virtual DOM?** | "A JS object tree mirroring real DOM. On state change, React diffs new vs old tree, applies minimal DOM updates. Faster than direct DOM manipulation." |
| **When does React re-render?** | "3 triggers: setState called, parent re-renders, context value changes. Re-render ≠ DOM update — React only updates DOM if diff finds changes." |
| **useState vs useReducer** | "useState for simple state. useReducer for 3+ actions on same state or complex transitions. useReducer is the Redux pattern." |
| **useEffect cleanup** | "Return function runs before re-run and on unmount. Prevents leaks — clear timers, unsubscribe, abort fetch." |
| **useMemo vs useCallback** | "useMemo caches a VALUE. useCallback caches a FUNCTION reference. Both take a dependency array." |
| **React.memo** | "Wraps a component. Skips re-render if props are shallow-equal. Without useCallback on function props, memo is useless." |
| **useRef** | "Mutable container that persists across renders without causing re-render. For DOM access or values that don't trigger UI updates." |
| **Context performance** | "ALL consumers re-render on ANY context change. Fix: split contexts, or use Zustand for fine-grained subscriptions." |
| **Error Boundary** | "Class component that catches render errors. getDerivedStateFromError + componentDidCatch. Must be class — no hook equivalent. Doesn't catch event/async errors." |
| **Keys in lists** | "Stable identifier for list items. React uses keys to match old and new items during reconciliation. Without keys: unnecessary unmounts and state loss." |
| **Controlled vs Uncontrolled** | "Controlled: React owns the value via state. Uncontrolled: DOM owns it, read via ref. I default to controlled for real-time validation." |

---

## 📋 NEXT.JS — Quick Answers

| Question | Crisp Answer |
|---|---|
| **Server vs Client Component** | "Server = default, zero JS shipped, can access DB. Client = 'use client', for interactivity — useState, onClick, browser APIs." |
| **SSR vs SSG vs ISR** | "SSG: build time, cached on CDN, fastest. SSR: per request, always fresh. ISR: static + revalidates every N seconds." |
| **Server Actions** | "Functions marked 'use server'. Replace API routes for mutations. Work with forms, call revalidatePath after DB write." |
| **App Router vs Pages Router** | "App Router: Server Components default, nested layouts, streaming, loading.tsx/error.tsx. Pages Router: getServerSideProps, global _app.tsx." |
| **Middleware** | "Runs before request reaches page. Auth redirects, geo routing, headers. Edge Runtime — lightweight, no Node APIs." |
| **Streaming** | "Server sends HTML chunks as data becomes ready. User sees shell immediately. loading.tsx and Suspense enable this." |

---

## 📋 TYPESCRIPT — Quick Answers

| Question | Crisp Answer |
|---|---|
| **interface vs type** | "Both define shapes. interface: declaration merging, extends. type: unions, intersections, mapped types. I default to type unless I need merging." |
| **any vs unknown vs never** | "any: opts out of type checking. unknown: safe — must narrow before use. never: impossible state — exhaustive checks." |
| **What is a generic?** | "A type parameter that makes functions/types reusable. function first<T>(arr: T[]): T — T is inferred from the argument." |
| **Type inference vs annotation** | "TS infers from values — let x = 5 is number. I annotate function params (required) and let TS infer the rest." |
| **Utility types** | "Partial makes all optional. Pick selects keys. Omit removes keys. Record creates key-value types. ReturnType extracts function return type." |
| **Implement Partial** | "type MyPartial<T> = { [K in keyof T]?: T[K] } — mapped type, iterate keys, make optional." |
| **Discriminated unions** | "Union types with a literal discriminant. switch on shape.kind — TS narrows in each case. never in default catches missing cases." |

---

## 📋 TDD — Quick Answers

| Question | Crisp Answer |
|---|---|
| **What is TDD?** | "Write test first (RED), write minimum code (GREEN), refactor. Test defines the behavior BEFORE the code exists." |
| **Unit vs Integration vs E2E** | "Unit: one function. Integration: components together. E2E: full browser flow. Testing trophy: more integration, fewer unit, fewest E2E." |
| **RTL vs Enzyme** | "RTL tests behavior — what user sees. Enzyme tests internals — state values. RTL is the React standard." |
| **RTL query priority** | "getByRole (best) → getByLabelText (forms) → getByText (content) → getByTestId (last resort)." |
| **How to test async** | "findByText waits for element. waitFor waits for assertion. Mock API with jest.mock or global.fetch mock." |
| **What to test / not test** | "Test behavior: submit calls handler, error shows, list updates. Don't test: internal state, CSS, third-party lib internals." |

---

## ⏰ BLOCK-BY-BLOCK STUDY GUIDE

### BLOCK 2 (23:30-00:30): JS Core
Open `javascript/exercises/08-advanced-interview-SOLUTIONS.js`:
1. Read D4 debounce — close file — write from memory — check
2. Read A4 memoize — close — write from memory — check
3. Read A3 once — close — write from memory — check
4. Read E1-E3 event loop outputs — trace on paper without looking
5. Read D3 pipe — close — write from memory

### BLOCK 3 (00:30-01:30): TypeScript
Open `typescript/exercises/06-advanced-interview-SOLUTIONS.ts`:
1. Read B1-B5 (Partial, Required, Readonly, Pick, Omit) — write each from memory
2. Read B7-B9 (Exclude, Extract, ReturnType) — write from memory
3. Read D section (any/unknown/never table) — memorize the table
4. Read C1 discriminated unions — write the Shape example from memory
5. Read A5 satisfies — understand the difference from type annotation

### BLOCK 4 (01:30-02:00): BREAK
Walk around. Drink water. Eat something. Stretch. Do NOT touch code.

### BLOCK 5 (02:00-03:00): React Advanced
Open `react/exercises/11-react-drills-TIER6-ADVANCED-HANDSON.jsx`:
1. R57 Autocomplete — read, close, build from memory
2. R65 Validated Form — read, close, build from memory
3. R58 Compound Tabs — read, understand the pattern
4. R59 Infinite Scroll — read, understand IntersectionObserver
5. R64 Permission UI — read, understand the <Can> pattern

### BLOCK 6 (03:00-04:00): Next.js
Open `experion-interview/nextjs-deep-dive-round2.md`:
1. Section 2: Server vs Client boundary — say the pattern out loud
2. Section 3: Data fetching — cache: 'no-store' = SSR, revalidate = ISR
3. Section 4: Server Actions — know the code pattern
4. Section 6: Decision tree — for any page, which rendering strategy?
5. Section 9: Practice answering "page takes 4 seconds" out loud

### BLOCK 7 (04:00-04:30): TDD
Open `react/exercises/12-tdd-hands-on-drills-SOLUTIONS.jsx`:
1. Drill 1 LoginForm — memorize the test structure
2. Drill 8 Utility functions — easiest TDD demo, write from memory
3. The TDD Playbook at the bottom — memorize the 6 steps

### BLOCK 8 (04:30-05:30): Mock Interview (OUT LOUD)
Answer each question TO YOURSELF as if the interviewer is there.
Timer: 90 seconds max per answer. If you go over, stop and trim.

```
1. "What is a closure? Give a real use case."
2. "Explain the event loop — what does this code output?" (trace E1)
3. "Implement debounce." (write it)
4. "What's the difference between useMemo and useCallback?"
5. "This component re-renders 50 times — how do you debug it?"
6. "Build an autocomplete with keyboard navigation." (talk through state)
7. "Where do you store the JWT and why?"
8. "Explain Server Components vs Client Components in Next.js."
9. "Implement Partial from scratch in TypeScript."
10. "Show me TDD for a login form — what tests do you write first?"
```

### BLOCK 9 (05:30-06:00): Quick-Fire
Re-read ONLY the tables above (JS, React, Next.js, TS, TDD).
Read each answer out loud once.

### BLOCK 10 (08:30-09:30): Final Review
Re-read this file's quick-fire tables. Nothing else.

---

## 🎯 WHEN THE INTERVIEW STARTS

```
1. Smile. Say hi. Be human.
2. "Thank you for having me for the second round."
3. PAUSE 3 SECONDS before every answer.
4. Short answers. Let THEM ask for more.
5. If you don't know: "I haven't used that directly, but here's how I'd approach it..."
6. If you mess up: "Actually, let me correct that —" (they RESPECT this)
7. "Any questions for us?" →
   - "What does a typical sprint look like for the team?"
   - "What's the biggest technical challenge the team is facing?"
   - "How do you handle tech debt?"
```

## 💪 REMEMBER

- You cleared Round 1. They already think you're capable.
- Round 2 tests THINKING, not memorization.
- A calm, honest "I'd approach it by..." beats a panicked wrong answer.
- 3-second pause. Classify. Answer. Stop.

**You've got this. Now go execute the study plan.** 🔥
