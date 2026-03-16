# 🎯 Mock Round 1 — Technical Screening (45-60 min)

> **Who interviews you:** Mid/Senior dev or tech lead
> **What they test:** "Does this person actually know the stack?"
> **Format:** Concept questions + output prediction + maybe 1 live coding task
> **Vibe:** Can you explain things clearly? Can you write basic code?

---

## ⚡ ANSWER FORMAT — Use This for EVERY Question

```
1. ONE-LINE ANSWER  → Give the summary (5 seconds)
2. HOW IT WORKS     → Explain the mechanism (15-20 seconds)
3. REAL EXAMPLE     → Anchor to something you've built or coded (15-20 seconds)
4. TRADE-OFF/WHEN   → When would you NOT use this? (10 seconds)

Total: under 60 seconds. If they want more, they'll ask.
```

---

## SECTION A: JavaScript (15 min — 5-6 questions)

### Q1: "What is a closure? Give a practical use."

> "A closure is a function that remembers variables from the scope where it was created, even after that scope finishes executing.
>
> Practically, I use closures for data privacy — factory functions that return methods with access to private variables. Also for callbacks — event handlers that need to reference component state. And for utilities like `once()` or `memoize()` where the inner function holds a cache in the outer scope.
>
> Quick example: a counter factory — `function makeCounter() { let count = 0; return () => ++count; }` — the returned function closes over `count`."

---

### Q2: "Explain the event loop."

> "JavaScript is single-threaded. The event loop is how it handles async operations without blocking.
>
> Three queues: call stack executes synchronous code first. When that's empty, it processes all **microtasks** — Promise callbacks, queueMicrotask. Only after microtasks are drained does it process one **macrotask** — setTimeout, setInterval, I/O.
>
> So `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3));` outputs 1, 3, 2 — sync first, then microtask, then macrotask."

---

### Q3: "What's the difference between `==` and `===`?"

> "`===` is strict equality — no type coercion. `1 === '1'` is false. `==` does type coercion — `1 == '1'` is true because it converts the string to a number.
>
> I always use `===`. The coercion rules of `==` are confusing — `[] == false` is true, `'' == 0` is true. Not worth the mental overhead."

---

### Q4: "Explain `this` in JavaScript."

> "`this` depends on HOW the function is called, not where it's defined. Five rules:
>
> 1. **Global call** — `fn()` → `this` = undefined (strict mode) or window
> 2. **Method call** — `obj.fn()` → `this` = obj
> 3. **Explicit** — `fn.call(obj)` / `fn.apply(obj)` / `fn.bind(obj)` → `this` = obj
> 4. **`new`** — `new Fn()` → `this` = new object
> 5. **Arrow function** — inherits `this` from enclosing scope, NEVER has its own
>
> The classic trap: extracting a method — `const fn = obj.greet; fn()` — loses `this` because it's now a standalone call, not a method call."

---

### Q5: "What will this output?"

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

> "A, D, C, B.
>
> A and D are synchronous — execute immediately. Then microtask queue: C (Promise). Then macrotask queue: B (setTimeout). Even though setTimeout is 0ms, microtasks always run before macrotasks."

---

### Q6: "var vs let vs const"

> "`var` is function-scoped, hoisted to `undefined`, and can be redeclared — legacy, avoid it. `let` is block-scoped, hoisted but in TDZ (accessing before declaration throws ReferenceError). `const` is same as `let` but can't be reassigned — though objects and arrays it points to CAN be mutated.
>
> I default to `const`. Use `let` only when I need reassignment. Never `var`."

---

## SECTION B: React (15 min — 5-6 questions)

### Q7: "Explain Virtual DOM and reconciliation."

> "The Virtual DOM is a lightweight JavaScript object tree that mirrors the real DOM. When state changes, React creates a NEW virtual tree, diffs it against the previous one — that's reconciliation — and calculates the minimal set of DOM mutations needed.
>
> This is faster than directly manipulating the DOM because DOM operations are expensive, but JavaScript object comparisons are cheap. React uses heuristics — O(n) instead of O(n³) — by assuming: different element types produce different trees, and `key` props identify stable children in lists.
>
> That's why keys matter — without stable keys, React can't efficiently match old and new list items, causing unnecessary unmounts and state loss."

---

### Q8: "When does React re-render a component?"

> "Three triggers:
> 1. **setState** is called in that component
> 2. **Parent re-renders** — child re-renders by default even if props didn't change
> 3. **Context value changes** — all consumers re-render
>
> Common misconception: 'props change' doesn't directly trigger re-render. The PARENT's setState triggers the parent re-render, which then re-renders children. React.memo can skip the child re-render if props are shallow-equal.
>
> Re-render ≠ DOM update. React re-renders (runs the function, diffs virtual DOM), but only updates the real DOM if something actually changed."

---

### Q9: "Controlled vs Uncontrolled components?"

> "Controlled: React owns the value via useState. The input's `value` is bound to state, and `onChange` updates state on every keystroke. React is the single source of truth.
>
> Uncontrolled: the DOM owns the value. You read it via `useRef` when needed — like on form submit. Simpler, but you lose per-keystroke validation.
>
> I default to controlled for most forms. Uncontrolled is fine for simple forms where I don't need real-time validation — just grab the value on submit."

---

### Q10: "useMemo vs useCallback vs React.memo — explain all three."

> "Three levels of memoization:
>
> **React.memo** wraps a COMPONENT — skips re-render if props haven't changed (shallow comparison).
>
> **useCallback** memoizes a FUNCTION REFERENCE — so React.memo sees the same function across renders instead of a new one each time.
>
> **useMemo** memoizes a COMPUTED VALUE — avoids expensive recalculations on every render.
>
> They work TOGETHER: memo on the child, useCallback on function props you pass to it, useMemo on expensive derived data. Without useCallback, memo is useless for function props because a new function reference is created every render.
>
> When does memo HURT? When props always change — you're paying the comparison cost AND the re-render cost. Don't sprinkle it everywhere. Profile first, optimize where measurable."

---

### Q11: "Explain useEffect — cleanup, dependency array."

> "useEffect runs AFTER render. The dependency array controls WHEN it re-runs:
> - `[]` — mount only (once)
> - `[dep]` — mount + whenever `dep` changes
> - No array — every render (almost never want this)
>
> The cleanup function runs BEFORE the effect re-runs and on unmount. It prevents memory leaks — unsubscribe, clear timers, abort fetch requests.
>
> Real example: subscribing to a WebSocket. Effect opens the connection, cleanup closes it. If the room ID changes, cleanup closes the old connection, effect opens a new one. Without cleanup, you'd leak connections."

---

### Q12: "What are React hooks rules? Why?"

> "Two rules: call hooks at the top level only — not inside loops, conditions, or nested functions. And only call hooks from React functions — components or custom hooks.
>
> Why top level? React identifies hooks by their CALL ORDER. If a hook is inside an `if` block, the order changes between renders, and React associates state with the wrong hook. That's why you can't conditionally call useState — the 3rd useState must always be the 3rd one called."

---

## SECTION C: TypeScript + Next.js + Redux (10 min — 3-4 questions)

### Q13: "interface vs type in TypeScript?"

> "Both define shapes. Key differences: `interface` supports declaration merging — you can declare the same interface twice and they merge. It also uses `extends`. `type` supports unions, intersections, mapped types, and computed properties.
>
> My rule: I default to `type` unless I need declaration merging — which is mainly for library authors. For React component props, `type` is usually simpler and more flexible."

---

### Q14: "SSR vs SSG vs ISR — when to use each?"

> "SSG for content that rarely changes — blog, docs, marketing. HTML built at build time, served from CDN, fastest option. SSR for personalized or real-time content — dashboards, user profiles, search results. HTML built per request, always fresh but costs server CPU. ISR for content that changes periodically — product pages, news. Static but revalidates every N seconds — fast like SSG, fresh-ish like SSR.
>
> In Next.js App Router: default fetch is cached (SSG behavior), `{ cache: 'no-store' }` forces SSR, and `{ next: { revalidate: 60 } }` gives ISR."

---

### Q15: "Walk me through Redux data flow."

> "One-way flow: the View dispatches an **action** — a plain object with `type` and optional `payload`. The action passes through **middleware** — thunk for async, logger for debugging. Then it reaches the **reducer** — a pure function that takes current state plus the action and returns new state. The **store** holds this state. Components subscribe via selectors. When the state they select changes, they re-render.
>
> When I'd NOT use Redux: if state is local to one component — just useState. If it's server data — TanStack Query or RTK Query. If the app is small — Context or Zustand. Redux shines for complex client state shared across many components."

---

## SECTION D: 🔥 SURPRISE LIVE CODING (10-15 min)

> They MIGHT say: "Open your editor and build X." Don't panic.
> Say: **"Let me start by thinking about the state shape."**

### If they say "Build a counter":
```
STATE → count (number)
RENDER → display count + buttons
HANDLERS → increment, decrement, reset
```
→ You've done R1. Under 60 seconds.

### If they say "Build a todo app":
```
STATE → todos: [{ id, text, done }], input: ""
RENDER → input + button + todos.map(...)
HANDLERS → add, toggle, delete
```
→ You've done R20. Under 5 minutes.

### If they say "Implement debounce":
```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```
→ You've drilled this. Under 45 seconds.

### If they say "Build a search filter":
```
STATE → query (string), items is static/prop
RENDER → input + filtered list
DERIVED → const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
```
→ You've done R14. Under 2 minutes.

---

## 📋 Round 1 Emergency Kit

| Situation | Say This |
|---|---|
| You blank on a concept | "Let me think about that for a moment..." then start with what you DO know |
| You don't know the answer | "I haven't worked with that directly, but based on [related concept]..." |
| Output prediction — not sure | "Let me trace through this step by step..." (grab pen, write sync → micro → macro) |
| Live coding — freeze | "Let me start with the state shape. What data do I need?" |
| You're rambling | Stop. Breathe. "The key point is..." |
| They ask a follow-up you don't know | "That's a good edge case. I'd need to verify, but my instinct is..." |
