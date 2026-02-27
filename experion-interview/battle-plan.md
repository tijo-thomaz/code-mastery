# 🎯 Experion Interview — 4-Day Battle Plan (DRAFT)

> **Role:** Senior Engineer — ReactJS | Cochin/Trivandrum | 3-5 yrs
> **Core Stack:** ReactJS, Redux, Next.js, TypeScript, Jest, REST APIs
> **Reality:** 15 failed interviews. Pattern = panic + freeze + no answer framework.
> **Goal:** Cover every JD requirement in 4 days with a strategy that prevents freezing.

---

## 🧠 The Real Problem (From Your Failed Interviews)

| Pattern | Evidence | Fix |
|---------|----------|-----|
| Know the concept but give vague answers | Entry #3: knew useLayoutEffect but couldn't give a concrete example | **Build it, don't just read it** — hands-on for every concept |
| Panic on follow-up questions | Entry #5: froze when asked "how do you prevent abuse?" | **Mental checklists** — pre-loaded follow-up answers for each topic |
| Rush to answer, miss the real question | Entry #1: pattern-matched "this" but didn't trace execution context | **3-second pause rule** — classify the question before answering |
| Surface-level answers, no depth | All entries | **One-sentence summary → then go deep** — structured answer format |

### Anti-Freeze Protocol (Use in EVERY answer)

1. **Pause 3 seconds** — "Let me think about that" is a power move
2. **Classify** — Is this a concept question? Output prediction? "Build this"? System design?
3. **One-line answer first** — Give the summary, THEN elaborate
4. **Use an example** — Always anchor your answer to something concrete you've built or coded

---

## 🏗️ Expected Interview Rounds

| Round | Who | What They Evaluate | Duration |
|-------|-----|-------------------|----------|
| **R1: Technical Screening** | Mid/Senior dev or lead | JS/TS fundamentals, React basics, Redux flow, output prediction, "do you actually know the stack?" | 45-60 min |
| **R2: Deep Technical** | Tech lead / Architect | Architecture decisions, advanced React patterns, performance debugging, code review ability, system design, live coding | 60-90 min |
| **R3: Behavioral / Managerial** | Engineering Manager or HR | Leadership, mentoring, sprint management, culture fit, communication | 30-45 min |

### Round 1 vs Round 2 — What Changes

| Aspect | Round 1 (Screening) | Round 2 (Deep Tech) |
|--------|---------------------|---------------------|
| **JS questions** | "What is a closure?" | "You have a memory leak in production — how do you find and fix it?" |
| **React questions** | "Explain Virtual DOM" | "This component re-renders 50 times — walk me through how you'd debug and fix it" |
| **Redux questions** | "Explain the data flow" | "This Redux store has 200 slices and the app is slow — what's your approach?" |
| **Next.js questions** | "SSR vs SSG vs ISR?" | "The page takes 4 seconds to load — where do you start investigating?" |
| **TypeScript questions** | "interface vs type?" | "How would you type a polymorphic component that works as any HTML element?" |
| **Testing questions** | "What is Jest?" | "How do you decide what to test vs what not to test? How do you test a complex form wizard?" |
| **General vibe** | Can you explain concepts clearly? | Can you SOLVE problems and make architectural decisions under pressure? |

### Deep Tech Skills Round 2 Will Evaluate

These are the "senior signals" that separate you from a mid-level candidate:

| Deep Skill | What They're Looking For | Example Questions |
|---|---|---|
| **Architecture thinking** | Can you structure a large React app? Component boundaries, folder structure, state management choices | "You're building a dashboard with 15 widgets, real-time updates, and role-based access — how do you architect this?" |
| **Performance debugging** | Not just knowing React.memo exists, but knowing HOW to find the bottleneck | "The app freezes when a user types in a search box — walk me through your debugging process step by step" |
| **State management decisions** | When Redux, when Context, when Zustand, when URL state, when server state (TanStack Query) | "You have user auth, UI theme, form data, and API cache — where does each piece of state live and why?" |
| **Advanced React patterns** | Compound components, render props, HOCs, custom hooks for shared logic, React.lazy boundaries | "How would you build a reusable Modal system that supports stacking, animations, and keyboard trapping?" |
| **Error handling strategy** | Not just try/catch — error boundaries, API error states, retry logic, user-facing error messages | "A REST API returns a 500 — what happens in your frontend? Walk me through the entire error flow from fetch to what the user sees" |
| **Code review ability** | Can you spot bugs, anti-patterns, performance issues in someone else's code? | They show you a code snippet and ask "What's wrong with this? How would you fix it? What would you say in a PR review?" |
| **Real-world trade-offs** | No "right answer" — they want to hear you reason about trade-offs | "Would you use SSR or CSR for this page? What are you trading off?" |
| **API design sense** | How you structure REST endpoints, handle pagination, error responses, versioning | "Design the API contract for a task management feature — what endpoints, what request/response shapes?" |
| **Security awareness** | XSS prevention, token storage (cookie vs localStorage), CORS, CSP, input sanitization | "Where do you store the JWT? Why? What attack does that prevent?" |
| **Testing strategy** | What to test, what not to test, testing pyramid, integration vs unit, cost of tests | "You have 2 days to add tests to an untested codebase — what do you test first and why?" |

---

## 📋 JD Skill Breakdown — What They'll Actually Test

### 🔴 Tier 1: They WILL Ask (spend 60% of time here)

| JD Requirement | What They'll Actually Ask | How to Prepare |
|---|---|---|
| ReactJS core (Virtual DOM, JSX, Components) | "Explain Virtual DOM and reconciliation", "When does React re-render?", "Controlled vs uncontrolled" | Practice explaining out loud with real examples, draw the reconciliation flow on paper |
| Redux / Flux workflows | "Walk me through the Redux data flow", "When would you NOT use Redux?", "Explain middleware" | Draw the Redux cycle diagram from memory, know RTK slices vs old-style reducers |
| JavaScript (DOM, ES6+, object model) | Output prediction (`this`, closures, event loop), "Implement debounce", "== vs ===" | Hands-on: write 10 output-prediction snippets, predict first, run to verify |
| TypeScript | "Type this component's props", "interface vs type", "What is `unknown` vs `any`?" | Type a small React component from scratch in strict mode, practice utility types |
| Next.js | "SSR vs SSG vs ISR — when to use each?", "App Router vs Pages Router", "How do Server Components work?" | Know the data fetching story for each rendering strategy, draw a decision tree |

### 🟡 Tier 2: They MIGHT Ask (spend 30% of time here)

| JD Requirement | What They'll Actually Ask | How to Prepare |
|---|---|---|
| Jest unit testing | "How do you test a custom hook?", "When to use snapshot testing?", "Mock an API call" | Know the RTL philosophy (test behavior not implementation), practice describe/it/expect pattern |
| RESTful APIs | "Design the API for a task manager", "What HTTP status codes for what?", "How do you handle errors?" | Know CRUD → HTTP method mapping, common status codes (200, 201, 400, 401, 403, 404, 500) |
| Third-party APIs (Google/Facebook) | "How does OAuth 2.0 work?", "How would you integrate Google Sign-In?" | Know the OAuth flow: redirect → auth code → exchange for token → use token |
| Performance optimization | "How would you optimize a slow React app?", "What are Core Web Vitals?" | Memorize the checklist: memo, lazy loading, code splitting, virtualization, image optimization |
| HTML/CSS fundamentals | "Flexbox vs Grid — when?", "How does the CSS box model work?" | Quick review, unlikely to be deep — they care more about React/JS |

### 🟢 Tier 3: Behavioral / Leadership (spend 10% of time here)

| JD Requirement | What They'll Actually Ask | How to Prepare |
|---|---|---|
| Code review of juniors | "How do you review a junior's PR?", "How do you give feedback without demotivating?" | Prepare 2 STAR stories about mentoring |
| Sprint management | "How do you estimate tasks?", "What do you do when a sprint is at risk?" | Know story points, velocity, and have a real example |
| Agile / TDD | "What does your TDD workflow look like?", "Red-Green-Refactor — explain it" | Know the cycle, be honest about when you use it vs when you don't |
| Git workflows | "How do you handle merge conflicts?", "Branching strategy?" | Know feature branches, PR flow, rebasing vs merging |
| Accessibility & Security | "What are ARIA roles?", "How do you prevent XSS?" | Quick review of top 5 a11y rules and top 5 security practices |

---

## 📆 4-Day Schedule

### Day 1 — JavaScript + TypeScript (The Foundation)

> If you can't answer JS/TS questions confidently, nothing else matters.
> ⚠️ YOUR #1 KILLER: Array manipulation — frequency, dedup, groupBy failed you at Wipro, UST, Socure, Arrow (5 of 11 interviews!)

| Time Block | What to Do | Method |
|---|---|---|
| **Morning 2 hrs** | **Array muscle memory drills** — frequency count, dedup, groupBy, Array.from({length}), flatten. These 5 patterns alone cost you 5 interviews | Hands-on ONLY. Write each pattern 3x from memory. No reading. Open editor → type → run → repeat until fingers do it without thinking |
| **Mid-day 2 hrs** | Event loop, closures, `this` keyword, prototypes, `== vs ===`, hoisting/TDZ, Promises vs async/await | Write 10 output-prediction snippets, predict → run → understand why |
| **Afternoon 1.5 hrs** | TypeScript: `interface vs type`, `any vs unknown vs never`, generics, utility types, discriminated unions | Type a React component's props from scratch, practice narrowing |
| **Evening 30 min** | Speak answers out loud | Pick 5 questions, answer to yourself like the interviewer is there. 1-2 min per answer max |

**Day 1 Exit Criteria:**
- [ ] Can write frequency count from memory in under 2 minutes
- [ ] Can write dedup from memory in under 1 minute
- [ ] Can write groupBy from memory in under 2 minutes
- [ ] Can use Array.from({length: n}) fluently — know what it does and when to use it
- [ ] Can recognize Fibonacci, arithmetic, power-of-2 sequences on sight
- [ ] Can trace any event loop output prediction in under 60 seconds
- [ ] Can explain `this` with the 5-rule checklist without hesitation
- [ ] Can explain closures with 3 use cases
- [ ] Can type React component props in TypeScript strict mode

---

### Day 2 — React + Redux (The JD Core) + Round 2 Depth

> This is 50%+ of the interview. Round 1 tests if you know React. Round 2 tests if you can THINK in React.
> ⚠️ YOUR #2 KILLER: React "build X" tasks — todo list (failed TWICE at Wipro + UST), file explorer (Infosys), nested modal (Socure). You freeze when asked to build.

| Time Block | What to Do | Method |
|---|---|---|
| **Morning 2.5 hrs** | **Build a todo app 3 times from scratch.** Not once — THREE times. Time yourself each time. You failed this at Wipro AND UST. By the 3rd time it should take under 10 min. Then do it once more with TypeScript. | Every React "build X" task is the same 3 steps: (1) What state do I hold? (2) How do I render it? (3) What handlers change it? Internalize this skeleton |
| **Mid-day 1.5 hrs** | React concepts: Virtual DOM, reconciliation, keys, render cycle, hooks (useState batching, useEffect cleanup, useRef, useMemo vs useCallback vs React.memo) | Draw the render cycle on paper. Practice explaining out loud |
| **Afternoon 1.5 hrs** | Redux: store → action → reducer → view cycle, middleware, thunks, RTK slices, RTK Query, when NOT to use Redux | Draw the Redux flow diagram from memory 3 times. Know when Zustand/Context is better |
| **Late afternoon 1.5 hrs** | **Round 2 Depth:** Performance debugging mindset + state management decisions + error handling strategy | Practice thinking out loud: "App is slow → React DevTools Profiler → find heaviest component → check why → fix". Practice error flow: API error → catch → error boundary → user sees fallback |
| **Evening 30 min** | Practice answering: "Walk me through what happens when a user clicks a button that dispatches a Redux action" | Full end-to-end trace: click → handler → dispatch → middleware → reducer → new state → selector → re-render |

**Day 2 Exit Criteria:**
- [ ] Can build a todo app (add/delete/toggle) from scratch in under 10 minutes without hesitation
- [ ] Can explain the 3-step framework for ANY React build task: state → render → handlers
- [ ] Can draw the React render cycle from memory
- [ ] Can explain controlled vs uncontrolled with a real example
- [ ] Can draw the Redux data flow from memory
- [ ] Can explain when Redux is overkill (small apps, simple state, server state → use TanStack Query)
- [ ] Can explain React.memo vs useMemo vs useCallback — when each helps and when it hurts
- [ ] Can walk through a performance debugging session step by step (Round 2 readiness)
- [ ] Can explain where different types of state should live and WHY (Round 2 readiness)

---

### Day 3 — Next.js + Jest + REST APIs + Round 2 Deep Skills

> Next.js is explicitly in the JD. Jest is required. Afternoon shifts to Round 2 territory.

| Time Block | What to Do | Method |
|---|---|---|
| **Morning 2 hrs** | Next.js: SSR vs SSG vs ISR (when to use each), App Router file conventions, Server Components vs Client Components, Server Actions, Middleware | Create a decision tree: "If data changes rarely → SSG. If per-request → SSR. If periodic → ISR." |
| **Mid-day 1.5 hrs** | Jest + React Testing Library: testing philosophy, describe/it/expect, mocking (jest.fn, jest.mock), testing hooks with renderHook, snapshot testing pros/cons, TDD red-green-refactor | Write (or review) one test for a React component — understand the pattern, not just the syntax |
| **Afternoon 1 hr** | REST APIs: HTTP methods → CRUD mapping, status codes, error handling patterns, OAuth 2.0 flow for Google/Facebook sign-in | Draw the OAuth flow on paper, memorize the status code families (2xx success, 4xx client error, 5xx server error) |
| **Late afternoon 1.5 hrs** | **Round 2 Depth:** Architecture + code review + trade-offs thinking | Practice: "Design a dashboard" — think out loud about component tree, data flow, what's server-rendered vs client. Practice reading a bad code snippet and listing what's wrong (anti-patterns, perf issues, missing error handling) |
| **Evening 1 hr** | Fill gaps: accessibility (ARIA, semantic HTML, keyboard nav), security (XSS, CSRF, CSP, token storage), performance (Core Web Vitals, Lighthouse) | Make a cheat sheet — 5 bullet points per topic, not a deep dive |

**Day 3 Exit Criteria:**
- [ ] Can explain SSR vs SSG vs ISR with real use cases
- [ ] Can explain the App Router file structure (page.tsx, layout.tsx, loading.tsx, error.tsx)
- [ ] Can describe how you'd test a React form component with RTL
- [ ] Can draw the OAuth 2.0 authorization code flow
- [ ] Can name 3 XSS prevention techniques and 3 accessibility best practices
- [ ] Can talk through architecting a feature end-to-end: component design → state → API → error handling → testing (Round 2 readiness)
- [ ] Can review a code snippet and articulate what's wrong and how to fix it (Round 2 readiness)

---

### Day 4 — Mock Interview + Behavioral + Final Review

> Stop studying new things. Today is about PERFORMING under pressure.

| Time Block | What to Do | Method |
|---|---|---|
| **Morning 2 hrs** | Self-mock interview: pick 10 questions from Tier 1 topics, set a timer (2 min per answer), answer OUT LOUD | Record yourself on your phone. Listen back. Notice where you ramble, where you freeze, where you say "um" |
| **Mid-day 1 hr** | Behavioral prep: prepare 3 STAR stories (Situation, Task, Action, Result) | Story 1: A time you mentored a junior. Story 2: A time you solved a hard technical problem. Story 3: A time you handled a sprint going off-track |
| **Afternoon 1 hr** | System design light: "Design a dashboard" — practice thinking out loud | Framework: requirements → component tree → state management → API design → performance considerations |
| **Final 30 min** | Review your failed-interviews journal + this battle plan | Focus on 🔴 and 🟡 entries. Re-read your cheat sheets. Go to bed early |

**Day 4 Exit Criteria:**
- [ ] Can answer any Tier 1 question within 2 minutes without freezing
- [ ] Have 3 STAR stories ready for behavioral questions
- [ ] Can think out loud through a system design problem
- [ ] Feel prepared, not panicked

---

## 🧩 Question Pattern Recognition Guide

> The reason you freeze: you hear an unfamiliar PHRASING of a familiar concept.
> Every React interview question is one of these 6 patterns:

| Pattern | Example Questions | How to Recognize | Answer Framework |
|---|---|---|---|
| **"Explain X"** | "Explain Virtual DOM", "What is a closure?" | Concept question — they want depth | One-line definition → How it works → Why it exists → Real example |
| **"What's the difference between X and Y?"** | "useMemo vs useCallback", "SSR vs SSG", "interface vs type" | Comparison — they want you to show you know both | Quick table (2-3 rows), then "I'd use X when... and Y when..." |
| **"What will this output?"** | Event loop, `this`, closures, hoisting | Output prediction — they want you to trace execution | Pause → trace step by step on paper → state your answer confidently → explain WHY |
| **"How would you..."** | "How would you optimize a slow app?", "How would you handle auth?" | Practical scenario — they want your decision-making process | Start with questions you'd ask → then your approach → then trade-offs |
| **"Build X"** | "Build an autocomplete", "Build a todo with Redux" | Live coding — they want to see you think and code | Clarify requirements → sketch the component structure → code incrementally → test as you go |
| **"Tell me about a time..."** | Behavioral/STAR | They want a real story, not a hypothetical | Situation (2 sentences) → Task (1 sentence) → Action (2-3 sentences) → Result (1 sentence with metrics if possible) |

---

## ⚡ Things to Decide / Discuss

> Let's refine this plan together. Answer these:

1. **What time of day is the interview?** (So we can plan Day 4 energy around it)
2. **Is it one round or multiple?** (Phone screen → Technical → System Design → Behavioral?)
3. **Which of the Tier 1 topics do you feel WEAKEST in right now?** (We'll allocate more time there)
4. **Do you have a Redux project you've worked on?** (Real experience stories > textbook answers)
5. **Have any of your 15 failed interviews been for similar React Senior roles?** (What specific questions tripped you up?)
6. **Do you want to do hands-on coding practice as separate exercise files in this repo?** (We can create targeted drills)

---

## 📌 Non-Negotiable Rules for the Next 4 Days

1. **No tutorial rabbit holes** — You're not learning new things, you're sharpening what you know
2. **Speak every answer out loud** — Your brain knows it but your mouth freezes. Practice the mouth part
3. **Hands-on > reading** — Every concept, open your editor and BUILD something small
4. **Sleep 7+ hours** — A tired brain panics faster than a rested one
5. **On interview day: 3-second pause before every answer** — This is the single most important technique

---

*This is a draft. Let's refine based on your answers above. We'll adjust time allocation to your weak spots.*
