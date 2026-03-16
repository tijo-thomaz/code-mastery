# 🎯 TECH VERSANT SCREENING — Initial Round

> **Date**: Tuesday, March 10, 2026
> **Format**: 30-Minute Screening — General + Technical Touch
> **Role**: Team Lead — React / TypeScript / Golang
> **Key Signal**: They asked about years of Go experience — Go WILL come up
> **Stakes**: Don't repeat Experion mistakes. Fiber, build/dev, peer deps — you know these now.

---

## ⏱️ Interview Flow (30 Minutes)

```
00:00 - 02:00  Small talk, introductions
02:00 - 07:00  PHASE 1: Tell Me About Yourself (5 min)
07:00 - 15:00  PHASE 2: Technical Rapid Fire — JS/React/TS (8 min)
15:00 - 22:00  PHASE 3: Golang Questions (7 min)
22:00 - 27:00  PHASE 4: Team Lead / Leadership (5 min)
27:00 - 30:00  PHASE 5: Your Questions (3 min)
```

---

## PHASE 1: Introduction (5 min)

### Q1: "Tell me about yourself"

> *[DELIVERY NOTE: 90 seconds max. Smile. Sit up. This is a conversation, not a recitation.]*

**YOUR ANSWER:**

> "Hi, thanks for having me. I'm Tijo — a Senior Frontend Engineer with deep React and TypeScript expertise, and I also work with Golang on the backend.
>
> My most impactful work was building a **config-driven KYC portal** — I led the migration from a legacy system to a modern React, TypeScript, and Go stack. The config-driven approach meant business teams could modify KYC verification flows without code changes — adding a new country or changing document requirements was a config update, not a code deployment.
>
> *[Slow down — this is the hook]*
>
> What excites me about this Team Lead role is the stack alignment — React and TypeScript on the frontend, Go on the backend. That's exactly my combo. And I've led feature deliveries, set up code review culture, mentored devs transitioning into React — so the lead responsibilities are familiar territory.
>
> I relocated from the UK to India in late 2025, and I'm looking for the right team to build with."

*[Stop. Don't ramble. Let them ask the next question.]*

---

### Q2: "Walk me through your KYC project — what did you build?"

> *[DELIVERY NOTE: Be specific. Leads love specifics — not vague "I worked on the frontend."]*

**YOUR ANSWER:**

> "The legacy KYC system had hardcoded flows — every regulatory change meant developer time. I architected a config-driven approach where form fields, validations, step order, and verification rules were all driven by configuration per country/jurisdiction.
>
> **Frontend:** React + TypeScript with strict typing on the config schema. A generic step-form engine that read the config and rendered dynamically — adding a new country meant adding a config file, not writing new components.
>
> **Backend:** Go services handling verification logic, document processing, and API orchestration. Used goroutines for concurrent verification checks — running ID validation, address check, and sanctions screening in parallel instead of sequentially.
>
> **Migration approach:** We used the Strangler Fig pattern — didn't rewrite everything at once. Legacy routes served the old system, new routes loaded the React app. A TypeScript bridge handled communication between old and new via postMessage. Over time, more routes migrated to React. Zero-downtime, gradual migration.
>
> **Impact:** Business teams could launch in new jurisdictions without developer involvement for standard flows. Verification processing time dropped because of Go's concurrent checks."

**FOLLOW-UP they might ask:** *"What was the hardest part?"*

> "State persistence across steps. If a user dropped off at step 3, they could resume later without redoing steps 1-2. We persisted partial form state to the backend and restored it on return — with validation to handle cases where the config changed between sessions."

---

### Q3: "Why are you looking? / Why this role?"

> *[DELIVERY NOTE: Stay positive. Brief. No negativity about past employers.]*

**YOUR ANSWER:**

> "I relocated from the UK to India in late 2025 for family reasons. I'm targeting a team lead role specifically because I've been doing lead-level work — owning feature delivery end-to-end, mentoring, driving architecture decisions — and I want a role where that's the explicit responsibility, not just something I do informally.
>
> Tech Versant caught my attention because of the React + TypeScript + Go stack. That's rare — most companies are React + Node. My Go backend experience means I can lead across the full stack, not just the frontend layer."

---

## PHASE 2: Technical Rapid Fire — JS/React/TS (8 min)

> *[DELIVERY NOTE: Short, crisp answers. One-liners. Don't lecture. If they want more, they'll ask.]*

### JavaScript Core

**"Explain closures."**
> "A closure is a function that remembers variables from the scope where it was defined, even after that scope has exited. Used for data privacy, memoization, and factory functions like debounce."

**"What's the event loop?"**
> "JavaScript is single-threaded. The event loop processes the call stack first, then microtasks like Promise callbacks, then macrotasks like setTimeout. That's why a resolved Promise runs before a setTimeout — even if setTimeout was registered first."

**"Explain `this` keyword."**
> "Four rules: default binding — global or undefined in strict mode. Implicit — the object calling the method. Explicit — call, apply, bind. And `new` — a fresh object. Arrow functions don't have their own `this` — they inherit from the enclosing scope."

**"Debounce vs throttle?"**
> "Debounce delays execution until the user stops triggering — like a search input, wait 300ms after they stop typing. Throttle limits execution to once per interval — like a scroll handler, fire at most once every 200ms."

**"ES Modules vs CommonJS?"**
> "ES Modules use import/export, are statically analyzed at build time, and enable tree-shaking. CommonJS uses require/module.exports, is dynamic, runs at runtime, and can't be tree-shaken. Modern bundlers prefer ESM."

---

### React

**"What is React Fiber?"**

> *[DELIVERY NOTE: This is the Experion killer question. You KNOW this now. Nail it.]*

> "Fiber replaced the old stack reconciler in React 16. The old model was synchronous and recursive — once React started rendering a component tree, it couldn't stop until done. That blocked the main thread on large trees.
>
> Fiber breaks rendering into small units of work — each fiber node is a unit that can be paused, resumed, or aborted. The tree is now a linked list, not a recursive walk. This enables priority-based scheduling — user input and animations get high priority, data fetching results get low priority. Fiber is what powers Concurrent Mode features like useTransition, useDeferredValue, and Suspense.
>
> One-liner: Fiber broke the monolithic render into tiny resumable units of work so React can stay responsive."

**"useMemo vs useCallback vs React.memo?"**
> "useMemo caches a computed value. useCallback caches a function reference. React.memo wraps a component to skip re-render if props haven't changed. Use React.memo on the child, useCallback on the function you pass to it — they work together."

**"How do you optimize a slow React app?"**
> "Profile first with React DevTools — find what's re-rendering unnecessarily. Then: React.memo for expensive children, move state down closer to where it's used, virtualize long lists, code-split with lazy/Suspense, debounce rapid state updates. Measure before and after every change."

**"State management strategy?"**
> "Local state first. Lift when needed. Context for low-frequency global state like theme or auth. Zustand or Redux for high-frequency shared state. TanStack Query for server state. Never put everything in global — that's the biggest mistake teams make."

**"Build vs dev scripts — what's the difference?"**

> *[DELIVERY NOTE: Second Experion killer. You've got this.]*

> "Dev starts a local server with Hot Module Replacement, full source maps, no minification — NODE_ENV=development. Fast rebuilds for iteration. Build creates the production bundle — minified, tree-shaken, code-split, dead code eliminated — NODE_ENV=production. Output goes to disk as static files. Dev is for speed, build is for optimization."

**"What's `--legacy-peer-deps`?"**

> *[DELIVERY NOTE: Third Experion killer. Complete the sweep.]*

> "npm 7+ changed peer dependency resolution from warnings to hard errors. If package A needs react@^17 and package B needs react@^18, npm 7+ refuses to install. `--legacy-peer-deps` tells npm to use the old npm 6 behavior — ignore peer dep conflicts. It's a workaround, not a fix. The better solution is to update packages or use `overrides` in package.json to force a version."

---

### TypeScript

**"interface vs type?"**
> "Interface is for object shapes — extendable, declaration-mergeable, great for public APIs. Type alias handles unions, intersections, and computed types. I use interface for component props and API contracts, type for unions and utility combinations."

**"Explain generics."**
> "Type parameters that make functions and components reusable without losing type safety. Instead of typing a fetch function with `any`, you write `function fetchData<T>(url: string): Promise<T>` — the caller decides the type. Constraints with `extends` narrow what T can be."

**"What's a discriminated union?"**
> "A union type where each member has a shared literal field — like `type: 'loading' | 'success' | 'error'`. TypeScript narrows the type in switch/if statements based on that field. Perfect for type-safe state machines and API response handling."

**"`unknown` vs `any` vs `never`?"**
> "`any` opts out of type checking — avoid it. `unknown` is a safe any — you must narrow the type before using it. `never` represents impossible states — useful for exhaustive switch checks where TypeScript errors if you miss a case."

---

## PHASE 3: Golang Questions (7 min)

> *[DELIVERY NOTE: They asked about Go experience specifically. This is YOUR differentiator. Most React devs can't talk Go.]*

### Q: "How long have you been writing Go? What have you used it for?"

**YOUR ANSWER:**

> "I've used Go for backend services — REST APIs, concurrent data processing, worker pools. In the KYC project, Go handled the verification orchestration — running multiple checks concurrently with goroutines, HTTP middleware for auth and logging, and the config service that the React frontend consumed.
>
> I chose Go over Node for that backend because of the concurrency model — goroutines made parallel verification checks trivial — and the single binary deployment simplified our CI/CD pipeline."

---

### Q: "Goroutines vs threads?"

> "Goroutines are user-space lightweight threads — they start at about 2KB of stack versus megabytes for OS threads. Go's runtime uses M:N scheduling — multiplexes thousands of goroutines onto a small number of OS threads. You can spin up thousands of goroutines cheaply. The Go scheduler handles context switching, not the OS kernel."

### Q: "How do channels work?"

> "Channels are typed pipes for communication between goroutines. Unbuffered channels are synchronous — the sender blocks until a receiver is ready. Buffered channels are async up to the buffer capacity. You close a channel to signal that no more values will be sent — receivers can range over a closed channel to drain remaining values."

### Q: "Error handling in Go?"

> "No exceptions. Functions return `(result, error)`. You check `if err != nil` after every call. Wrap errors with `fmt.Errorf('context: %w', err)` for the error chain. Unwrap with `errors.Is` for value comparison and `errors.As` for type assertion. This makes error flow explicit — you always know where an error was handled or propagated."

### Q: "Why Go over Node for backend?"

> "Compiled — faster execution and smaller memory footprint. Built-in concurrency with goroutines and channels — no callback hell. Type-safe at compile time. Single binary deployment — no node_modules, no runtime dependency. Great stdlib — `net/http` is production-ready without frameworks. And Go's simplicity reduces team onboarding time — fewer ways to do things means less bike-shedding."

### Q: "Explain context.Context"

> "Context carries cancellation signals, timeouts, deadlines, and request-scoped values across API boundaries and goroutines. Always pass it as the first parameter. `WithTimeout` auto-cancels after a duration, `WithCancel` gives you manual cancel control. In HTTP servers, the request context is cancelled when the client disconnects — so your goroutines can clean up instead of doing wasted work."

### Q: "What's a worker pool pattern?"

> "N goroutines reading jobs from a shared channel. The main goroutine sends jobs into the channel, workers pick them up concurrently. WaitGroup tracks completion — `Add(n)` before sending, `Done()` when a worker finishes a job, `Wait()` to block until all jobs complete. Close the job channel to signal no more work. I used this in the KYC system for running concurrent verification checks."

---

### Go + Team Lead Angle

> *[Use these if the conversation goes toward team leadership + Go:]*

> "Go's simplicity makes it great for teams — there's basically one way to write a for loop, one way to handle errors. Less code review debates, faster onboarding."
>
> "I enforce `golangci-lint` and `errcheck` in CI — catches common mistakes before code review."
>
> "Table-driven tests are non-negotiable on my teams — makes test patterns consistent and easy to extend."
>
> "For new Go devs, goroutine lifecycle is the first thing I teach — that's where production bugs hide. Leaked goroutines are the Go equivalent of memory leaks."

---

## PHASE 4: Team Lead / Leadership (5 min)

### Q: "Tell me about your leadership experience"

> *[DELIVERY NOTE: STAR format. Under 2 minutes. Be specific.]*

**YOUR ANSWER:**

> "In the KYC migration project, I led the frontend delivery — coordinated between the React team, the Go backend team, and the QA team. I broke the migration into phases using the Strangler Fig pattern so we could ship incrementally without a risky big-bang rewrite.
>
> I set up the code review process — PRs under 400 lines, reviewers had to approve before merge, and I left 'why' comments, not just 'change this.' I mentored backend developers who were transitioning into React — pair programming on real features, not tutorials.
>
> The result: we migrated the critical KYC flows to React + TypeScript in [X] months with zero downtime in production. The team was confident shipping independently by the end."

---

### Q: "How do you handle conflict in the team?"

> "Listen first — understand both perspectives. Focus on the technical merit, not the personalities. If it's a tech decision disagreement, I propose we PoC both approaches with measurable criteria — bundle size, dev experience, performance. Let the data decide. Once decided, commit fully and move on. Relitigating kills velocity."

---

### Q: "How do you estimate and plan sprints?"

> "Break epics into stories into tasks. T-shirt sizing with the team — not top-down estimates. Track velocity over 3 sprints before trusting it. Add buffer for unknowns. Budget 15-20% of capacity for tech debt — otherwise it accumulates and slows everything down. Keep standups to 15 minutes. Async updates when possible."

---

### Q: "How do you onboard new devs?"

> "Day 1: environment setup and first PR — even if it's a typo fix. Getting the green CI checkmark on day one builds confidence. Week 1: pair on a small feature. Month 1: own a feature with review support. Document everything — the onboarding experience reveals gaps in your docs."

---

### Q: "How do you handle tech debt?"

> "Track it visibly — create tickets, label them. Prioritize by: does this slow down every future feature, or is it just ugly? The first kind gets fixed now. Budget 15-20% of sprint capacity. The Boy Scout Rule — leave code better than you found it. In regulated environments, some 'debt' is actually a compliance risk — that's not debt, that's a P1 bug."

---

## PHASE 5: Your Questions (3 min)

> *[DELIVERY NOTE: Ask 2 of these. Good questions show you're evaluating them too — you're not desperate.]*

**Pick 2:**

**1. "What's the React vs Go split on the team — is it the same devs doing both, or separate frontend/backend teams?"**
> *WHY: Shows you're thinking about how you'd operate day-to-day. His answer tells you if you'd be full-stack or frontend-focused.*

**2. "How big is the team I'd be leading? What's the current mix of experience levels?"**
> *WHY: Shows you're already thinking about the lead role. His answer tells you the mentoring load.*

**3. "What does success look like for this role in the first 90 days?"**
> *WHY: Shows you're thinking about delivering value fast. Gives you a roadmap if you get the job.*

**4. "What's the deployment process like — CI/CD, cloud provider, release cadence?"**
> *WHY: Shows you care about engineering process, not just code. Connects to your Go single-binary deployment experience.*

---

## 💀 CURVEBALL SECTION

### "What's your biggest weakness?"
> "Articulation under pressure. I know the material deeply — I've built production systems with React, TypeScript, and Go — but earlier in my interview journey, I'd freeze when explaining internals like React Fiber or build tooling. I identified that pattern and fixed it by practicing verbal explanations out loud daily. That's why I can explain Fiber clearly right now."

### "What's a technical decision you regret?"
> "Early in my career, I used Redux for everything — even local component state. It made the codebase complex for no benefit. I learned to start with the simplest state solution and escalate only when needed. Now I use local state first, server state with TanStack Query, and global state with Zustand only when it's truly cross-cutting."

### "What would you do in your first 30 days?"
> "Week 1-2: Ship a small PR to learn the codebase and build pipeline. Read existing code, not just docs. Sit with each team member 1:1 to understand their strengths and blockers. Week 3-4: Own a medium feature end-to-end. I'd rather ask a lot of questions early than make assumptions that cost us later."

### "Tell me about a time you failed."
> "I had an interview recently where I knew React Fiber, build scripts, and peer dependencies inside out — I use them daily. But I couldn't articulate them clearly under pressure. I lost the round not because of knowledge gaps but because of communication gaps. I tracked every question I missed, studied the answers, and now practice explaining concepts out loud. That failure made me a better communicator."

### "Salary expectations?"
> "I'm flexible on compensation — I'm more focused on the role, the team, and the growth opportunity. What's the range budgeted for this position?"

---

## 💀 THE CLOSING

When they say *"Anything else you'd like to add?"*

> *[DELIVERY NOTE: Look at the camera. Confident, not desperate. 30 seconds max.]*

**YOUR CLOSING:**

> "Just that I'm genuinely excited about this role. The React + TypeScript + Go stack is exactly my combo, and it's rare to find a team lead position that values all three. I've led migrations, mentored teams, and shipped config-driven systems in production. I'd love the opportunity to bring that experience to Tech Versant."

*[Stop. Smile. Don't ramble.]*

---

## 📋 PRE-INTERVIEW CHECKLIST

```
□ Practice "Tell me about yourself" once out loud
□ Say out loud: Fiber, closures, goroutines vs threads — one-liner each
□ Review Go questions in this file (Phase 3)
□ Have 2 STAR stories ready (KYC migration, mentoring)
□ Pick 2 questions to ask them (Phase 5)
□ Test audio/video, quiet room, water nearby
□ Close all notifications, Do Not Disturb mode
□ Deep breath. You've cleared multiple L1s. Your fundamentals are solid.
```

---

## 🧠 CONFIDENCE ANCHORS (Read 5 Minutes Before)

1. **Your stack is RARE.** React + TypeScript + Go. Most candidates are React + Node. You stand out.

2. **You've built exactly what they need.** Config-driven KYC system, React + TS frontend, Go backend. This is not theoretical — you shipped it.

3. **You've done the lead work.** Mentoring, code reviews, migration planning, sprint estimation. You just need the title.

4. **You fixed the Experion weakness.** Fiber? You can explain it now. Build/dev scripts? You know the difference cold. Peer deps? Nailed. You turned failure into preparation.

5. **This is a 30-minute screening, not a deep dive.** They want to see if you're real. You are. Just talk about what you've built.

---

## 🎯 EMERGENCY PHRASES

| Situation | Say This |
|-----------|----------|
| You blank | "That's a great question. Let me think through this..." |
| You don't know | "I haven't worked with that specific tool, but here's how I'd approach it based on similar patterns..." |
| You ramble | Stop. Breathe. "Let me summarize the key point..." |
| Question is unclear | "Just to make sure I understand — are you asking about X or Y?" |
| They ask about something not in your stack | "I haven't used that in production, but I understand the concept — [brief explanation]. I'd ramp up quickly." |
| Salary comes up | "I'm flexible — what's the range budgeted for this role?" |

---

> **Remember: You cleared multiple L1s. Your fundamentals are solid. This screening is 30 minutes — just be yourself and talk about what you've built. The right role is coming. This could be it. Go crush it.** 💪
