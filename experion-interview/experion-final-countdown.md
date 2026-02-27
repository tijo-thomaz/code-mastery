# 🎯 Experion Final Countdown — 94 Hours to Interview

> **Role:** Senior Engineer — ReactJS | Cochin/Trivandrum | 3-5 yrs
> **JD Stack:** ReactJS, Redux, Next.js, TypeScript, Jest, REST APIs
> **Timeline:** Thursday Feb 26 (2 PM) → Monday Mar 2 (Interview)
> **Reality:** 15 failed interviews. Patterns identified. Drills built. Time to EXECUTE.
> **Wife's Birthday:** Sunday Mar 1 🎂 — family time protected

---

## ⏰ The Timeline at a Glance

```
THU Feb 26  ██████░░░░  2 PM – 10 PM    Core JS Muscle Memory (5 hrs effective)
FRI Feb 27  ██████████  9 AM – 10 PM    React + Redux + Build Tasks (7 hrs effective)
SAT Feb 28  ██████████  9 AM – 10 PM    Next.js + TS + Jest + Round 2 Depth (7 hrs effective)
SUN Mar  1  ███░░░░░░░  🎂 BIRTHDAY     Light review only (3 hrs max, split AM/PM)
MON Mar  2  ██░░░░░░░░  Morning review  → INTERVIEW
            ─────────────────────────────────────────────────
            TOTAL PREP: ~22 hrs effective
```

---

## 📌 Non-Negotiable Rules

1. **Sleep by 10:30 PM every night** — A tired brain panics. Period.
2. **3-second pause before every answer** — "Let me think about that" is a power move
3. **Speak out loud** — Your brain knows it but your mouth freezes. Practice the mouth part
4. **No new topics after Saturday** — Sunday/Monday is REHEARSAL only, not learning
5. **Wife's birthday = HER day** — See `birthday-surprise-march1.md`. Be present.

---

## 🎯 What the Interviewer Will Actually Test (From JD)

### 🔴 WILL Ask — Spend 60% of Prep Here

| Skill | What They'll Ask | Your Material |
|-------|-----------------|---------------|
| **JavaScript Core** | Output prediction (this, closures, event loop), implement debounce, array manipulation | `07-interview-drills-SOLUTIONS.js` (3,031 lines), `rehearsal-script.md` Drills 1-7 |
| **React** | "Build a todo app", "Explain Virtual DOM", "When does React re-render?" | `rehearsal-script.md` Drills 8-11, `react/interview-questions/common-questions.md` |
| **Redux** | "Walk me through Redux data flow", "When NOT to use Redux?" | `rehearsal-script.md` Part 4 |
| **TypeScript** | "interface vs type", "type these props", "any vs unknown vs never" | `typescript/interview-questions/common-questions.md` |
| **Next.js** | "SSR vs SSG vs ISR — when?", "App Router file conventions" | Build decision tree Saturday |

### 🟡 MIGHT Ask — Spend 30%

| Skill | What They'll Ask | Prep Method |
|-------|-----------------|-------------|
| **Jest / RTL** | "How do you test a custom hook?", "When snapshot testing?" | Know the pattern: render → act → assert |
| **REST APIs** | "Design API for task manager", "Status codes for X?" | CRUD→HTTP mapping, know 200/201/400/401/403/404/500 |
| **Performance** | "How would you optimize a slow React app?" | Checklist: memo, lazy, code split, virtualize, image opt |
| **OAuth** | "How does Google Sign-In work?" | Know the flow: redirect → code → token → use |

### 🟢 Behavioral — Spend 10%

| Topic | Your Answer |
|-------|-------------|
| 6-month gap | "Relocated UK→India, deliberately upskilled, this repo is proof" (see `march-mastery-plan.md`) |
| Mentoring | Prepare 1 STAR story |
| Sprint risk | Prepare 1 STAR story |
| Code review | "I focus on: correctness → readability → performance. I ask questions, not demands" |

---

# 📅 Day-by-Day Execution Plan

---

## 🟦 THURSDAY Feb 26 — Core JS Muscle Memory

> **Your #1 killer: Array manipulation failed you at Wipro, UST ×2, Socure, Arrow (5 of 15 interviews!)**
> **Available:** 2 PM – 10 PM (dinner break 7-7:30 PM)
> **Effective hours:** ~5 hrs

### Block 1: Array Patterns — The 5 That Keep Killing You (2 PM – 4:30 PM)

**Material:** `07-interview-drills-SOLUTIONS.js` Tier 1-2 + `rehearsal-script.md` Drills 1-5

| Drill | Target Time | Reps | Method |
|-------|-------------|------|--------|
| **Frequency count** (A1) | < 60s | 3x | Read solution → close file → type from memory → run → repeat |
| **Dedup** (A3) | < 30s | 3x | Both: `[...new Set()]` AND the `Map` trick for objects |
| **GroupBy** (A5) | < 2 min | 3x | `reduce` into object with arrays. Then groupBy-with-count variant |
| **Array.from({length})** (A7) | < 30s | 3x | Know `(_, i) => i` pattern. Know WHY `new Array(5).map` fails |
| **Fibonacci** (A9) | < 60s | 3x | Generate + recognize on sight. Know first 10: 1,1,2,3,5,8,13,21,34,55 |

**✅ Checkpoint:** Can you write all 5 from a blank file without peeking? If yes, move on. If no, drill again.

### Block 2: More Array + String Patterns (4:30 PM – 6 PM)

**Material:** `07-interview-drills-SOLUTIONS.js` Tier 2-3

| Drill | Target Time | Reps |
|-------|-------------|------|
| **Flatten** (A8) | < 60s | 2x | Both: `arr.flat(Infinity)` AND recursive `reduce` + `concat` |
| **moveZeros** (A11) | < 60s | 2x |
| **chunk** (A13) | < 60s | 2x |
| **rotate by K** (A16) | < 90s | 2x | Slice method + know curveballs: negative k, k > length |
| **Reverse string** (E1) | < 15s | 1x | One-liner: `s.split('').reverse().join('')` |
| **Palindrome** (E2) | < 30s | 1x |
| **Anagram** (E3) | < 45s | 2x |
| **firstNonRepeating** (E5) | < 45s | 2x |

### Block 3: Core JS Concepts — Output Prediction (6 PM – 7 PM)

**Material:** `07-interview-drills-SOLUTIONS.js` Section D (D1-D8) + `rehearsal-script.md` Drills 12-14

| Topic | What to Do | Time |
|-------|-----------|------|
| **Event loop** (D1-D2) | Trace 5 snippets: separate into sync → microtask → macrotask columns | 15 min |
| **`this` keyword** (D3) | Know the 5 rules. Trace 3 trap snippets from Drill 12 | 15 min |
| **var in loop / closures** (D4, D6) | Classic: `var` in `setTimeout` → 3,3,3. Fix with `let` | 10 min |
| **Hoisting / TDZ** (D5) | `var` → undefined, `let/const` → ReferenceError, function decl → hoisted | 10 min |
| **Equality / IIFE** (D7, D8) | `==` coercion rules, IIFE pattern | 10 min |

### 🍽️ Dinner Break (7 PM – 7:30 PM)

### Block 4: Polyfills + Utility Functions (7:30 PM – 9 PM)

**Material:** `07-interview-drills-SOLUTIONS.js` Tier 3-4

| Drill | Target Time | Reps | Why |
|-------|-------------|------|-----|
| **Debounce** (C1) | < 45s | 3x | **Most asked JS coding Q in interviews. Period.** |
| **Throttle** (C2) | < 60s | 2x | Pair with debounce — they often ask both |
| **Memoize** (C3) | < 60s | 2x |
| **myMap** (B1) | < 60s | 2x | Shows you understand how `.map` works under the hood |
| **myFilter** (B2) | < 60s | 1x |
| **myReduce** (B3) | < 90s | 2x | The hardest polyfill — know the `initialValue` edge case |
| **Promise.all** (B4) | < 2 min | 2x | Classic senior-level ask |

### Block 5: Hardcore Output Prediction (9 PM – 10 PM)

**Material:** `07-interview-drills-SOLUTIONS.js` OP1-OP30

| What | Method | Time |
|------|--------|------|
| Skim OP1-OP15 | Read each, predict output BEFORE reading the answer, check | 30 min |
| Skim OP16-OP30 | Same method. Star the ones you got wrong | 30 min |

**Mark the ones you got wrong — re-drill these Friday evening.**

### 🌙 Thursday Exit Criteria

- [ ] Can write frequency count, dedup, groupBy from memory in under 2 min each
- [ ] Can write debounce from memory in under 45 seconds
- [ ] Can trace any event loop / `this` / closure output snippet in under 60 seconds
- [ ] Can write Promise.all polyfill from memory
- [ ] Know which OP questions tripped you (starred for Friday re-drill)
- [ ] **In bed by 10:30 PM**

---

## 🟩 FRIDAY Feb 27 — React + Redux + "Build X" (Your #2 Killer)

> **4 of 15 interviews died here:** Todo (Wipro + UST), File explorer (Infosys), Nested modal (Socure)
> **Available:** 9 AM – 10 PM (lunch 1-2 PM, dinner 7-7:30 PM)
> **Effective hours:** ~7 hrs

### Block 1: The 3-Step React Build Framework (9 AM – 9:30 AM)

**This framework saved you.** Before EVERY "build X" task, think:

```
Step 1: STATE  → What data do I hold? What shape? (useState)
Step 2: RENDER → How do I display it? (JSX)
Step 3: HANDLERS → What changes the state? (event handlers)
```

Write this on a sticky note. Put it on your monitor. This IS your anti-freeze protocol for React builds.

### Block 2: Todo App — 3 Reps From Scratch (9:30 AM – 12 PM)

**Material:** `rehearsal-script.md` Drill 9

| Rep | Method | Target Time |
|-----|--------|-------------|
| **Rep 1** | Look at rehearsal script → type it | No time limit. Understand every line. |
| **Rep 2** | Close the file. Type from memory. Peek only when truly stuck. | < 15 min |
| **Rep 3** | Fresh blank file. Timer on. No peeking. | **< 10 min** |

**Features to include each time:**
- [ ] Add todo (input + button + Enter key)
- [ ] Toggle complete (click to strike-through)
- [ ] Delete todo (X button)
- [ ] List rendering with proper keys

**If Rep 3 takes > 10 min:** Do a 4th rep. This is your most-failed question. Make it AUTOMATIC.

### Block 3: Recursive Components — File Explorer + Nested Boxes (12 PM – 1 PM)

**Material:** `rehearsal-script.md` Drills 10-11

| Component | Reps | Target Time | Key Insight |
|-----------|------|-------------|-------------|
| **File Explorer** | 2x | < 8 min | A component rendering itself for children. `isFolder ? toggle : show` |
| **Nested Boxes** | 1x | < 5 min | Same recursion: peel first color, render box, recurse with rest |

**Both use the same pattern:** Base case (empty → null) + Recursive case (render one, pass rest down)

### 🍽️ Lunch Break (1 PM – 2 PM)

### Block 4: React Concepts — Speak Out Loud (2 PM – 3:30 PM)

**Material:** `react/interview-questions/common-questions.md`

For EACH concept: read the answer → close file → explain it out loud in < 2 min. If you ramble or freeze, re-read and try again.

| # | Concept | Time | What to Nail |
|---|---------|------|-------------|
| 1 | Virtual DOM + Reconciliation | 5 min | Lightweight JS copy → diff → minimal DOM mutations |
| 2 | Rules of Hooks | 3 min | Top level only. Why? React uses call ORDER |
| 3 | useEffect cleanup | 5 min | Runs before re-run + on unmount. Prevents leaks |
| 4 | Keys in lists | 3 min | Stable identity for reconciliation. Never use index for dynamic lists |
| 5 | Controlled vs Uncontrolled | 5 min | React owns value (useState+onChange) vs DOM owns value (ref) |
| 6 | useMemo vs useCallback vs React.memo | 10 min | memo=component, useMemo=value, useCallback=function ref. They work TOGETHER |
| 7 | When does React re-render? | 5 min | setState, parent re-render, context change. NOT prop change alone |
| 8 | Error Boundaries | 5 min | Class component with `getDerivedStateFromError` + `componentDidCatch`. Catch render errors |
| 9 | useRef — when and why | 3 min | DOM access + mutable value that doesn't trigger re-render |
| 10 | useState batching | 5 min | React 18: automatic batching in ALL contexts (not just event handlers) |

**Total: ~50 min.** Then spend 10 min re-doing the 3 you explained worst.

### Block 5: Redux — Talk-Through Until Natural (3:30 PM – 4:30 PM)

**Material:** `rehearsal-script.md` Part 4-5

| Task | Method | Reps |
|------|--------|------|
| **Redux data flow** | Say the full flow out loud: View → dispatch → action → middleware → reducer → store → selector → re-render | 5x |
| **"When NOT to use Redux"** | Say the 3 cases: local state, server state (TanStack Query), small apps | 3x |
| **RTK vs old Redux** | Know: `createSlice` = reducer + actions in one. `createAsyncThunk` for async. RTK Query for API cache | 2x |
| **Middleware explanation** | "Middleware intercepts actions before they reach the reducer. Thunk = async logic. Logger = debugging" | 2x |

**Draw the Redux flow diagram on paper 3 times.** Arrow by arrow. This is a guaranteed question.

### Block 6: Advanced React Patterns — Round 2 Readiness (4:30 PM – 6 PM)

> Round 2 separates seniors from mids. They don't just ask "what" — they ask "when and WHY"

| Topic | What to Practice | Time |
|-------|-----------------|------|
| **Performance debugging** | Say out loud: "App is slow → React DevTools Profiler → find heaviest render → check why → React.memo? useMemo? code split?" | 15 min |
| **State management decisions** | For each state type, say WHERE it lives: UI state → useState. Server data → TanStack Query. Global UI → Zustand/Context. URL state → searchParams. Form → react-hook-form | 15 min |
| **Error handling flow** | Say: "API returns 500 → catch in fetch → set error state → ErrorBoundary catches render crashes → user sees fallback UI → retry button" | 10 min |
| **Component architecture** | Practice: "Given a dashboard with 10 widgets — how do I structure it?" Think: layout component, each widget is isolated, data fetching per widget (not parent), error boundary per widget | 15 min |
| **Code review answer** | "I look for: correctness first, then readability, then performance. I ask questions in PRs rather than make demands. I suggest, not dictate" | 5 min |

### 🍽️ Dinner Break (7 PM – 7:30 PM)

### Block 7: Quick-Fire Answers + Re-drill Thursday Weak Spots (7:30 PM – 9 PM)

**Material:** `rehearsal-script.md` Part 5 (quick-fire table)

| Task | Time |
|------|------|
| Say each quick-fire answer out loud. Under 60 seconds each. | 30 min |
| Re-drill the OP questions you starred Thursday (the ones you got wrong) | 30 min |
| Re-drill any JS pattern from Thursday that still feels shaky | 30 min |

### Block 8: Saturday Prep (9 PM – 9:30 PM)

- [ ] Review what Saturday covers (Next.js, TS, Jest)
- [ ] Skim `typescript/interview-questions/common-questions.md` headers — know what's coming
- [ ] **Order birthday cake for Sunday if not done yet** 🎂

### 🌙 Friday Exit Criteria

- [ ] Can build todo app from blank file in < 10 min without looking at anything
- [ ] Can build file explorer from blank file in < 8 min
- [ ] Can explain Virtual DOM, reconciliation, hooks, controlled vs uncontrolled in < 2 min each
- [ ] Can draw Redux flow from memory and explain when NOT to use it
- [ ] Can talk through performance debugging step-by-step
- [ ] Can answer any quick-fire question without hesitation
- [ ] **In bed by 10:30 PM**

---

## 🟨 SATURDAY Feb 28 — Next.js + TypeScript + Jest + Round 2 Deep Skills

> **Last full study day.** After this, it's review only.
> **Available:** 9 AM – 10 PM (lunch 1-2 PM, dinner 7-7:30 PM)
> **Effective hours:** ~7 hrs
> **Evening task:** Prep birthday surprise (see `birthday-surprise-march1.md`)

### Block 1: TypeScript — Type React Components in Strict Mode (9 AM – 11 AM)

**Material:** `typescript/interview-questions/common-questions.md` + `typescript/exercises/`

| Topic | What to Do | Time |
|-------|-----------|------|
| **interface vs type** | Say the comparison table from memory. Know: interface = merging + extends. type = unions + mapped types | 10 min |
| **any vs unknown vs never** | Say it: any = no safety. unknown = must narrow. never = impossible state / exhaustiveness | 10 min |
| **Utility types** | Write from memory: `Partial<T>`, `Required<T>`, `Pick<T,K>`, `Omit<T,K>`, `Record<K,V>`, `Readonly<T>` | 15 min |
| **Type a React component** | Open blank file → type a todo component with full TS strict props: `{ todos: Todo[]; onAdd: (text: string) => void; onToggle: (id: number) => void; onDelete: (id: number) => void }` | 20 min |
| **React event types** | Know: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, `React.MouseEvent<HTMLButtonElement>` | 10 min |
| **Generics basics** | Write a generic `function identity<T>(arg: T): T` → then a generic React component | 15 min |
| **Discriminated unions** | Write a `type Result<T> = { ok: true; data: T } | { ok: false; error: string }` and narrow it | 10 min |
| **Common TS exercises** | Skim `typescript/exercises/01-basic-types.ts` and `03-utility-types.ts` | 20 min |

### Block 2: Next.js — The Decision Tree (11 AM – 1 PM)

| Topic | What to Master | Method |
|-------|---------------|--------|
| **SSR vs SSG vs ISR** | When each? SSG = rarely changes (blog). SSR = per-request (dashboard). ISR = periodic refresh (product page) | Draw the decision tree on paper 3x. Say it out loud. |
| **App Router file conventions** | `page.tsx` = route. `layout.tsx` = shared wrapper. `loading.tsx` = Suspense fallback. `error.tsx` = ErrorBoundary. `not-found.tsx` = 404. `route.ts` = API endpoint | Write the file tree from memory |
| **Server Components vs Client Components** | Default = Server. Add `'use client'` for interactivity (useState, useEffect, onClick). Server = no JS shipped, can access DB directly. Client = interactive, runs in browser | Explain out loud in < 2 min |
| **Server Actions** | `'use server'` functions. Called from client forms/buttons. Replace API routes for mutations. `revalidatePath()` to refresh data | Know the pattern |
| **Middleware** | `middleware.ts` at root. Runs on EVERY request. Use for: auth redirect, geolocation, A/B testing. `NextResponse.next()` or `.redirect()` | Know 3 use cases |
| **Data fetching** | Server components: just `await fetch()` or DB query directly. Client: `useEffect` + fetch or TanStack Query. `cache: 'no-store'` = SSR. `cache: 'force-cache'` = SSG | Know the 3 patterns |

**🗣️ Practice answering:** "Explain when you'd use SSR vs SSG vs ISR with real examples" — say it out loud 3 times.

### 🍽️ Lunch Break (1 PM – 2 PM)

### Block 3: Jest + React Testing Library (2 PM – 3:30 PM)

| Topic | What to Know | Time |
|-------|-------------|------|
| **Testing philosophy** | "Test behavior, not implementation. If the user can't see it, don't test it" | 5 min |
| **describe/it/expect** | Basic structure. `describe` groups. `it` or `test` is one case. `expect(x).toBe(y)` | 5 min |
| **RTL core methods** | `render()`, `screen.getByRole()`, `screen.getByText()`, `screen.getByLabelText()`, `userEvent.click()`, `userEvent.type()` | 10 min |
| **Mocking** | `jest.fn()` = mock function. `jest.mock('module')` = mock module. `jest.spyOn(obj, 'method')` | 10 min |
| **Testing a component** | Pattern: render → find element → interact → assert. Example: render todo → type in input → click add → assert new item appears | 15 min |
| **Testing custom hooks** | `renderHook(() => useMyHook())` from `@testing-library/react`. Access `result.current` | 10 min |
| **Snapshot testing** | `expect(component).toMatchSnapshot()`. Pros: catches unexpected changes. Cons: brittle, people blindly update | 5 min |
| **TDD** | Red (write failing test) → Green (make it pass minimally) → Refactor (clean up) | 5 min |
| **What NOT to test** | Implementation details, third-party libraries, simple getters, styling | 5 min |

### Block 4: REST APIs + OAuth + Security + A11y — Quick-Fire Cheat Sheets (3:30 PM – 5 PM)

**Goal: 5 bullet points per topic. Enough to answer confidently. Not a deep dive.**

#### REST APIs (15 min)
| HTTP Method | CRUD | Example |
|-------------|------|---------|
| `GET` | Read | `GET /api/tasks` → list tasks |
| `POST` | Create | `POST /api/tasks` + body → create task |
| `PUT` | Update (full) | `PUT /api/tasks/1` + body → replace task |
| `PATCH` | Update (partial) | `PATCH /api/tasks/1` + body → update fields |
| `DELETE` | Delete | `DELETE /api/tasks/1` → delete task |

**Status codes:** 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error

#### OAuth 2.0 Flow (10 min)
```
1. User clicks "Sign in with Google"
2. App redirects to Google's auth page
3. User consents → Google redirects back with authorization CODE
4. Your backend exchanges code for ACCESS TOKEN (server-to-server, secret key)
5. Backend uses token to get user info from Google API
6. Backend creates session/JWT for your app
```
Say this flow out loud 3 times.

#### Security — Top 5 (10 min)
1. **XSS prevention:** React auto-escapes JSX. Never `dangerouslySetInnerHTML` with user input. CSP headers.
2. **Token storage:** httpOnly cookies > localStorage. localStorage is accessible to XSS attacks.
3. **CSRF:** Use SameSite cookies + CSRF tokens for form submissions.
4. **CORS:** Server whitelist allowed origins. Don't use `*` in production.
5. **Input validation:** Validate on server, sanitize on client. Never trust client data.

#### Accessibility — Top 5 (10 min)
1. **Semantic HTML:** Use `<button>`, `<nav>`, `<main>`, `<article>` — not `<div>` for everything.
2. **ARIA roles:** `role="dialog"`, `aria-label`, `aria-expanded`. Use when HTML semantics aren't enough.
3. **Keyboard navigation:** All interactive elements must be reachable via Tab. Focus trapping in modals.
4. **Alt text:** Every `<img>` needs `alt`. Decorative images: `alt=""`.
5. **Color contrast:** WCAG AA minimum. Don't rely on color alone to convey information.

#### Performance — Core Web Vitals (10 min)
1. **LCP (Largest Contentful Paint):** How fast the main content loads. Target: < 2.5s. Fix: optimize images, preload fonts.
2. **INP (Interaction to Next Paint):** How fast the page responds to input. Fix: avoid long tasks, use `useTransition`.
3. **CLS (Cumulative Layout Shift):** Visual stability. Fix: set dimensions on images/ads, avoid dynamic content injection above fold.
4. **React optimizations:** `React.memo`, `useMemo`, `useCallback`, code splitting with `lazy/Suspense`, virtualization for long lists.
5. **Next.js optimizations:** `next/image` auto-optimization, route prefetching, ISR for cache, streaming SSR.

### Block 5: Full Mock — 10 Random Questions Out Loud (5 PM – 6:30 PM)

Set a timer. 2 min per question. Answer OUT LOUD. Record on phone if possible.

| # | Question | Category |
|---|----------|----------|
| 1 | "What is a closure? Give 3 practical uses" | JS Core |
| 2 | "Implement debounce from scratch" | JS Coding |
| 3 | "What will this output?" — pick one OP from your starred list | Output Prediction |
| 4 | "Explain Virtual DOM and reconciliation" | React Concepts |
| 5 | "Build a todo app" — describe your approach (state → render → handlers) | React Build |
| 6 | "Walk me through Redux data flow" | Redux |
| 7 | "SSR vs SSG vs ISR — when do you use each?" | Next.js |
| 8 | "interface vs type in TypeScript?" | TypeScript |
| 9 | "How do you test a React component with RTL?" | Testing |
| 10 | "Where do you store the JWT? Why?" | Security |

**After each answer, rate yourself:**
- 🟢 Nailed it — confident, clear, < 2 min
- 🟡 Shaky — got there but hesitated or rambled
- 🔴 Failed — froze, couldn't finish, or wrong answer

**Re-drill any 🔴 or 🟡 answers before bed.**

### 🍽️ Dinner Break (7 PM – 7:30 PM)

### Block 6: Re-Drill Weak Spots + Gap Fill (7:30 PM – 9 PM)

| Task | Time |
|------|------|
| Re-drill any mock questions you rated 🟡 or 🔴 | 30 min |
| Re-read `failed-interview-patterns.md` — remind yourself what killed you before | 15 min |
| Do one more todo app speed run — is it still under 10 min? | 10 min |
| Skim `rehearsal-script.md` quick-fire table one more time out loud | 15 min |
| Practice the 6-month gap answer (see `march-mastery-plan.md` gap section) out loud 3x | 10 min |

### Block 7: Birthday Prep (9 PM – 10 PM) 🎂

**See `birthday-surprise-march1.md` for the full script.**

- [ ] Cake: ordered/bought?
- [ ] Handwritten note: written?
- [ ] Balloons/decorations: ready to put up after she sleeps?
- [ ] Gift: decided?
- [ ] Sunday lunch plan: decided?
- [ ] Monday interview outfit: ironed and ready?

### 🌙 Saturday Exit Criteria

- [ ] Can explain SSR vs SSG vs ISR with real use cases in < 2 min
- [ ] Can type React component props in TypeScript strict mode
- [ ] Can describe RTL testing pattern: render → find → interact → assert
- [ ] Can say OAuth flow from memory
- [ ] Can answer 10 random questions without freezing on any
- [ ] Birthday surprise FULLY prepped
- [ ] Interview outfit ready
- [ ] Decorations up after she sleeps
- [ ] **In bed by 10:30 PM**

---

## 🎂 SUNDAY Mar 1 — Wife's 33rd Birthday + Light Review

> **Today is HER day.** You've done 3 days of intensive prep. Trust it.
> **Study: 3 hrs max** — split into 2 windows she won't notice.
> **See `birthday-surprise-march1.md` for the full birthday plan.**

### 🌅 Early Morning — Before She Wakes (7 AM – 8 AM)

**Execute birthday surprise:**
- [ ] Tea/coffee ready on bedside table
- [ ] Handwritten note placed
- [ ] Wake her up with the birthday greeting

### Study Window 1 (10 AM – 12 PM) — While She's on Birthday Calls

> She'll be on the phone with family/friends wishing her. This is natural quiet time.

| Task | Method | Time |
|------|--------|------|
| **Behavioral prep** | Write bullet points for 3 STAR stories. Practice each under 2 min out loud | 30 min |
| **Quick-fire answers** | Skim `rehearsal-script.md` Part 5. Say each answer once. Under 60 seconds each | 20 min |
| **Anti-freeze protocol** | Re-read and internalize: Pause 3s → Classify → One-line answer → Example | 10 min |
| **Re-drill 1 shaky JS pattern** | Pick whatever felt weakest Thursday/Friday. One more rep | 15 min |
| **Re-drill 1 shaky React concept** | Same — whatever felt weakest Friday. Explain out loud once | 15 min |

### 🎂 Birthday Time (12 PM – 8 PM)

**Phone in pocket. Be present. Enjoy.**

- Lunch out (or ordered in)
- Whatever she wants to do
- Family/friends time
- Birthday photos

### Study Window 2 (8 PM – 9:30 PM) — While Family Winds Down

| Task | Time |
|------|------|
| Re-read `failed-interview-patterns.md` — the 3 patterns that kill you | 15 min |
| Practice the 6-month gap answer one final time out loud | 5 min |
| Skim your starred OP questions one last time | 20 min |
| Mental walkthrough: "Tomorrow they'll ask me X. My answer is Y" for your top 10 topics | 20 min |
| Lay out interview setup: laptop charged, good internet spot, water bottle, notebook + pen | 10 min |

### 🌙 Sunday Night Ritual

- [ ] Tell her: "Thank you for today. After tomorrow, I'm yours"
- [ ] Interview outfit on
- [ ] Laptop charged and ready
- [ ] Water bottle filled
- [ ] Notebook + pen on desk
- [ ] Alarm set for Monday
- [ ] **In bed by 10 PM. Not 10:30. TEN.**

### 🌙 Sunday Exit Criteria

- [ ] Wife had a great birthday ✅
- [ ] 3 STAR stories rehearsed
- [ ] Anti-freeze protocol memorized
- [ ] Gap answer smooth
- [ ] Everything ready for tomorrow
- [ ] **Asleep by 10:30 PM latest**

---

## 🔴 MONDAY Mar 2 — Interview Day

> **Stop studying.** You've put in 22 hours of focused prep over 4 days.
> You know this material. Now it's about PERFORMING, not knowing.

### Morning Routine (2-3 hrs before interview)

| Time | What |
|------|------|
| **Wake up** | No alarm snoozing. Get up. Shower. Dress well (even if remote). |
| **Breakfast** | Eat something. Don't interview hungry. |
| **15 min review** | Skim these 3 things ONLY: (1) Anti-freeze protocol, (2) Quick-fire answer table, (3) The 3-step React build framework |
| **10 min warm-up** | Open editor. Type debounce from memory. Type frequency count. Just to get your fingers moving |
| **5 min mental prep** | Close eyes. Breathe. Say: "I've done the work. I know this stuff. 3-second pause before every answer" |

### During the Interview

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  🛡️ ANTI-FREEZE PROTOCOL — USE ON EVERY QUESTION                │
│                                                                  │
│  1. PAUSE 3 seconds  — "Let me think about that"                │
│  2. CLASSIFY          — Concept? Output? Build? System design?   │
│  3. ONE-LINE FIRST    — Give the summary                        │
│  4. THEN GO DEEP      — Elaborate with an example               │
│                                                                  │
│  If you freeze:                                                  │
│  → Say "Let me work through this step by step"                  │
│  → Start writing code, even pseudo-code                         │
│  → Talk out loud — they want to see your THINKING               │
│                                                                  │
│  If you don't know:                                              │
│  → "I haven't worked with that directly, but here's how         │
│     I'd approach it based on what I know about [related topic]"  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### If They Ask "Build X" (React)

```
IMMEDIATELY say:
"Let me start by thinking about the state shape."

Step 1: STATE   → What data? What type? useState or useReducer?
Step 2: RENDER  → How does this data become JSX?
Step 3: HANDLERS → What events change the state?

Start coding incrementally. Don't try to write the whole thing at once.
Get something on screen FAST. Then iterate.
```

### After the Interview

- Write down every question they asked (within 1 hour while fresh)
- Rate yourself on each: 🟢🟡🔴
- Add to `failed-interview-patterns.md` if needed (or to a new `success-patterns.md` 🤞)
- Regardless of result: you did the work. The prep was real. This version of you is better.

---

## 📊 Coverage Map — What This Plan Covers vs JD

| JD Requirement | Covered When | Material |
|---|---|---|
| ReactJS core (Virtual DOM, JSX, Components) | Friday Block 4 | `react/interview-questions/common-questions.md` |
| Redux / Flux workflows | Friday Block 5 | `rehearsal-script.md` Part 4 |
| JavaScript (DOM, ES6+, object model) | Thursday ALL | `07-interview-drills-SOLUTIONS.js` |
| TypeScript | Saturday Block 1 | `typescript/interview-questions/common-questions.md` |
| Next.js | Saturday Block 2 | Decision tree + file conventions |
| Jest unit testing | Saturday Block 3 | RTL pattern: render → find → interact → assert |
| RESTful APIs | Saturday Block 4 | CRUD → HTTP mapping + status codes |
| Third-party APIs (OAuth) | Saturday Block 4 | OAuth 2.0 flow |
| Performance optimization | Saturday Block 4 | Core Web Vitals + React checklist |
| HTML/CSS fundamentals | Saturday Block 4 | Semantic HTML + Flexbox/Grid basics |
| Code review | Friday Block 6 | "Correctness → readability → performance" |
| Sprint management | Sunday Block 1 | STAR story |
| Agile / TDD | Saturday Block 3 | Red → Green → Refactor |
| Git workflows | Covered by experience | Feature branches, PR flow, rebasing |
| Accessibility & Security | Saturday Block 4 | Top 5 each |

---

## 🧠 The Final Mindset

```
You are NOT the person who failed 15 interviews.
You are the person who ANALYZED 15 failures and built a system to fix every one.

That's what a senior engineer does.
Not "never fail" — but "learn from failure systematically."

The interviewer doesn't know about the 15 failures.
They'll see someone who answers clearly, codes confidently, and pauses to think.

That person is you. After this week. After this prep.

Pause. Classify. Answer. Example.
State. Render. Handlers.
You've got this.
```

---

> *Files in this folder:*
> - `battle-plan.md` — Original 4-day strategy (reference)
> - `experion-final-countdown.md` — THIS FILE (hour-by-hour execution plan)
> - `rehearsal-script.md` — JS + React drills to type from memory
> - `failed-interview-patterns.md` — Your 15 failures analyzed
> - `march-mastery-plan.md` — Post-Experion long-term plan
> - `birthday-surprise-march1.md` — Sunday birthday plan 🎂
