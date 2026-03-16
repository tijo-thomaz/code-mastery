# ⚔️ Generic Battle Plan — React / JS / TS Senior & Team Lead

> Reusable across all interviews. Focus: React, JavaScript, TypeScript core + senior/lead-level depth.
> Not company-specific. For company prep, see `companies/<name>/STATUS.md`.

---

## 🎯 Your Stack Identity (say this in screening)

> "I'm a senior frontend engineer with deep React and TypeScript expertise. I've led feature delivery across teams, set up build pipelines, driven code review culture, and mentored junior devs. My core stack is React 18/19, Next.js, TypeScript strict mode, and I'm comfortable going deep into JS internals, performance, and architecture."

---

## 📋 Pre-Interview Checklist (1 hour before)

- [ ] Re-read `cheatsheets/failed-interview-patterns.md` — your 3 deadly patterns
- [ ] Verbal drill: Explain Fiber, build/dev, peer deps out loud (V1–V3)
- [ ] Review the company's `STATUS.md` for role-specific notes
- [ ] Open VS Code / CodeSandbox ready for live coding
- [ ] Water, quiet room, headphones tested

---

## PART 1: JavaScript Core (Senior Level)

### Must-Nail Topics (asked in 90%+ of interviews)

| Topic | One-liner you should be able to say | Cheatsheet |
|-------|-------------------------------------|------------|
| Closures | Function + its birth scope. Used for privacy, memoize, once() | mock-round1-screening.md |
| Event Loop | Single thread → call stack → microtasks (Promise) → macrotasks (setTimeout) | mock-round1-screening.md |
| `this` keyword | 4 rules: default, implicit, explicit (call/bind/apply), new. Arrow = lexical | mock-round1-screening.md |
| Prototypes | `__proto__` chain → Object.prototype → null. `class` is sugar | advanced-concepts |
| Promises | States: pending/fulfilled/rejected. Microtask queue. `.then` chains | mock-round1-screening.md |
| ES Modules vs CJS | `import/export` = static, tree-shakeable. `require` = dynamic, no tree-shake | — |
| Event Delegation | Attach one listener to parent, use `e.target` to identify child. Fewer listeners = better perf | dom-events-cheatsheet.md |
| Debounce vs Throttle | Debounce: wait until user stops. Throttle: max once per interval | — |

### Senior-Level JS (asked to differentiate senior from mid)

| Topic | What they want to hear |
|-------|----------------------|
| Memory leaks | Detached DOM nodes, forgotten timers/intervals, closures holding large objects, event listeners not cleaned up |
| `WeakMap` / `WeakRef` | Keys are weakly held → GC can collect them. Use: caching DOM nodes, private data on objects |
| `Proxy` / `Reflect` | Intercept object operations. Vue 3 reactivity uses Proxy. Validation, logging, access control |
| Generators | `function*` / `yield`. Lazy evaluation, infinite sequences, custom iterables, async flow control |
| `structuredClone` | Deep clone without JSON.parse hack. Handles Date, RegExp, Map, Set. No functions/DOM |
| `AbortController` | Cancel fetch requests, clean up in useEffect. `signal` passed to fetch |

---

## PART 2: TypeScript Core (Senior Level)

### Must-Nail Topics

| Topic | What to say |
|-------|-------------|
| `interface` vs `type` | Interface: extendable, mergeable, for object shapes. Type: unions, intersections, computed types. Use interface for public APIs |
| Generics | `<T>` = type parameter. Constraints with `extends`. Makes functions/components reusable without losing type safety |
| Utility types | `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly` — know all 6 cold |
| Discriminated unions | Shared literal field (e.g. `type: 'success' | 'error'`) + switch/narrowing. Type-safe state machines |
| `unknown` vs `any` vs `never` | `any` = opt out. `unknown` = safe any (must narrow). `never` = impossible state (exhaustive checks) |
| `satisfies` | Validates type without widening. `const config = {...} satisfies Config` — keeps literal types |
| Conditional types | `T extends U ? X : Y`. Powers `Extract`, `Exclude`, `ReturnType`. `infer` for extraction |
| Mapped types | `[K in keyof T]: ...` — transform every property. Add/remove `readonly`, `?` |

### Senior-Level TS Questions

| Question | Answer shape |
|----------|-------------|
| "Implement `DeepReadonly<T>`" | Recursive conditional: check Function → check object → recurse → else return T |
| "Implement `Pick<T,K>`" | `type MyPick<T, K extends keyof T> = { [P in K]: T[P] }` |
| "What's `infer`?" | Pattern matching in conditional types. `T extends Promise<infer U> ? U : T` extracts the resolved type |
| "Branded types" | `type USD = number & { __brand: 'USD' }` — prevent mixing currencies/IDs at type level |

---

## PART 3: React (Senior & Lead Level)

### Must-Nail Topics

| Topic | What to say |
|-------|-------------|
| Virtual DOM & Reconciliation | React builds a virtual tree → diffs old vs new → applies minimal DOM updates. O(n) heuristic with keys |
| React Fiber | Replaced stack reconciler in React 16. Linked list of fiber nodes. Rendering is incremental, pausable, priority-based |
| Hooks rules | Only top level, only in components/custom hooks. Rules exist because hooks rely on call ORDER (linked list) |
| `useEffect` cleanup | Return a function → runs before next effect and on unmount. Critical for subscriptions, timers, abort controllers |
| `useMemo` vs `useCallback` vs `React.memo` | `useMemo` = cache value. `useCallback` = cache function ref. `React.memo` = skip re-render if props unchanged |
| Keys in lists | Keys tell reconciler which items changed. Index as key = bugs on reorder. Use stable unique IDs |
| Error Boundaries | Class component with `componentDidCatch` / `getDerivedStateFromError`. Can't catch async/event handler errors |
| Server Components (RSC) | Run on server only → zero JS bundle. `'use client'` marks client boundary. Can't use state/effects |

### Lead-Level React Questions

| Question | What they want to hear |
|----------|----------------------|
| "How would you optimize a slow React app?" | 1) Profile with React DevTools → find what re-renders. 2) `React.memo` for expensive children. 3) Move state down / lift content up. 4) Virtualize long lists. 5) Code split with `lazy`/`Suspense`. 6) Debounce rapid state updates |
| "How do you structure a large React project?" | Feature-based folders, not type-based. Shared components → `/components`. Feature → `/features/auth`, `/features/dashboard`. Barrel exports. Co-locate tests. Absolute imports via `paths` |
| "State management strategy?" | Local state first → lift when needed → Context for low-frequency global (theme, auth) → Zustand/Redux for high-frequency shared state → TanStack Query for server state. NEVER put everything in global |
| "How do you handle code reviews?" | PR size < 400 lines. Review for: correctness, readability, performance, tests. Automate lint/format. Leave "why" comments not "how". Block on bugs, suggest on style |
| "How do you mentor juniors?" | Pair programming on real tasks. Code review with explanations. Assign stretch tasks with safety net. Weekly 1:1s. Share the "why" behind architecture decisions |
| "Testing strategy?" | Testing trophy: mostly integration tests (React Testing Library). Unit tests for utils/hooks. E2E for critical flows (Playwright). Don't test implementation details |

---

## PART 4: Team Lead Specific

### Questions you WILL get asked

| Question | Framework for answering |
|----------|----------------------|
| "Tell me about your leadership experience" | STAR: Situation → Task → Action → Result. Quantify: "led team of X, delivered Y, reduced Z" |
| "How do you handle conflict in the team?" | Listen first → understand both sides → focus on the technical merit → decide → communicate why |
| "How do you estimate and plan sprints?" | Break epics → stories → tasks. T-shirt sizing with team. Add buffer for unknowns. Track velocity over 3 sprints before trusting it |
| "How do you handle tech debt?" | Allocate 20% of sprint capacity. Tag debt tickets. Prioritize by: blocks us vs annoys us. Boy Scout Rule: leave code better than you found it |
| "How do you onboard new devs?" | Day 1: env setup + first PR (typo fix). Week 1: pair on small feature. Month 1: own a feature with review support. Document everything |
| "Agile ceremonies?" | Standup (15min), sprint planning, retro, backlog grooming. Keep meetings short. Async updates when possible |

### Your Team Lead Story Points (prepare 3-4 STAR stories)

- [ ] **Story 1:** Time you led a feature delivery (what was the scope, how did you coordinate)
- [ ] **Story 2:** Time you resolved a team conflict or unblocked someone
- [ ] **Story 3:** Time you made a technical decision that affected the team (e.g., chose a library, refactored architecture)
- [ ] **Story 4:** Time you mentored someone and they grew

---

## PART 5: Golang (Senior Level)

### Must-Nail Topics

| Topic | What to say |
|-------|-------------|
| Goroutines vs threads | User-space, 2KB stack, M:N scheduling, thousands are cheap. Go runtime scheduler manages them |
| Channels | Typed pipes. Unbuffered = synchronous handoff. Buffered = async up to cap. Close to signal done |
| Error handling | `(result, error)` return pattern. `if err != nil`. Wrap with `%w`. `errors.Is` / `errors.As` for unwrap |
| Interfaces | Implicit (duck typing). No `implements`. Empty interface = `any`. Checked at compile time |
| `defer` | LIFO. Args evaluated at defer site. Runs on function return. Used for cleanup (close files, unlock mutex) |
| `context.Context` | Cancellation + timeouts + deadlines. Always first param. `WithCancel`, `WithTimeout`, `WithValue` |
| `sync` package | `Mutex` (exclusive lock), `RWMutex` (read-many/write-one), `WaitGroup` (wait for goroutines), `Once` (init) |
| Slices | Header: pointer + length + capacity. `append` may reallocate. Shared underlying array trap |

### Senior-Level Go Questions

| Question | Answer shape |
|----------|-------------|
| "Worker pool pattern" | N goroutines reading from a shared channel. `WaitGroup` to wait. Sender `close(ch)` when done. Optional `context` for cancel |
| "Goroutine leak prevention" | Always ensure goroutines can exit: closed channels, context cancellation, done channels. Check with `runtime.NumGoroutine()` |
| "Why Go for backend?" | Compiled → fast. Single binary → simple deploy. Built-in concurrency. Low memory. Great stdlib (`net/http`). No framework debates |
| "`select` statement" | Multiplex on multiple channels. `default` for non-blocking. `case <-ctx.Done()` for cancellation. Random pick if multiple ready |
| "Go vs Node.js" | Go: compiled, goroutines, type-safe, better CPU-bound. Node: event loop, massive npm ecosystem, faster prototyping, shared JS stack |
| "Project structure" | `/cmd` (entrypoints), `/internal` (private), `/pkg` (public). Clean architecture: handlers → service → repository |

### Go + Leadership Angle

- "Go's simplicity reduces team onboarding time — fewer ways to do things"
- "I enforce `golangci-lint` + `errcheck` in CI — catches common mistakes"
- "Table-driven tests are non-negotiable — makes test patterns consistent across the team"
- "For new Go devs, goroutine lifecycle is the first thing I teach — that's where production bugs hide"

> **Full Go interview prep:** `golang/interview-questions/common-questions.md`

---

## ⚡ 30-Min Screening Quick Prep

> For short screenings (like Tech Versant tomorrow), focus on:

1. **Intro (2 min):** Your stack identity paragraph above
2. **JS rapid fire (5 min):** Closures, event loop, `this`, promises — one-liner answers
3. **React rapid fire (5 min):** Hooks, lifecycle, state management, Fiber
4. **TS rapid fire (3 min):** Generics, utility types, `unknown` vs `any`
5. **Lead questions (10 min):** Experience, team size, process, conflict resolution
6. **Your questions (5 min):** Team size? Tech stack? What does success look like in 6 months?

---

## 📖 Cheatsheet Quick Links

| Need | File |
|------|------|
| JS/React concepts | `mock-rounds/mock-round1-screening.md` |
| Deep tech (webhooks, workers, etc.) | `cheatsheets/advanced-concepts-cheatsheet.md` |
| Next.js | `cheatsheets/nextjs-cheatsheet.md` |
| Auth deep dive | `cheatsheets/auth-deep-dive-cheatsheet.md` |
| CSS/Tailwind | `cheatsheets/css-scss-tailwind-cheatsheet.md` |
| MFE architecture | `cheatsheets/mfe-architecture-cheatsheet.md` |
| Security | `cheatsheets/security-cheatsheet.md` |
| Testing (Jest/TDD) | `cheatsheets/jest-tdd-cheatsheet.md` |
| REST APIs | `cheatsheets/rest-api-cheatsheet.md` |
| Your failure patterns | `cheatsheets/failed-interview-patterns.md` |
| Verbal drills (V1–V10) | `../DRILL-PROGRESS-TRACKER.md` → "I USE IT BUT CAN'T EXPLAIN IT" |
| Post-mortems | `../failed-interviews/` |
