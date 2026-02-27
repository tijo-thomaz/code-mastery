# 🎯 March Mastery Plan — The Real One

> **Your situation:**
> - Moved UK → India (Nov). Holidays ate December. Started applying January. Now Feb end — 3 months, 15 failed interviews, no result.
> - You're NOT panicking anymore. You've parked the pressure. You're ready to go deep.
> - You already KNOW React, TypeScript, JS — but not deep enough to perform under interview pressure.
> - Golang/PostgreSQL can wait. Your market is React + TS + JS. That's where jobs are in Cochin/Trivandrum.
> - Taking interviews one at a time. If it takes 6 months, fine. Quality over speed.
>
> **The shift:** You're not a beginner learning a stack. You're a working developer who needs to go from "I know this" to "I can perform this under pressure, every time, on demand."

---

## 🗓️ Your Real Timeline

```
Nov 2025   →  Moved back to India. Adjusting.
Dec 2025   →  Holidays. Lost month.
Jan 2026   →  Started applying. Scattered prep.
Feb 2026   →  15 failed interviews. Patterns identified. Repo built.
                                                          ↑ YOU ARE HERE
Feb end    →  EXPERION INTERVIEW (4-day battle plan — see battle-plan.md)
Mar 2026   →  THE REFINEMENT MONTH. Regardless of Experion result, go deep.
Apr 2026+  →  Interview with confidence. One at a time. Land the right role.
```

> ⚡ **This plan starts AFTER the Experion interview.** For Experion prep, follow `battle-plan.md` + `rehearsal-script.md`.
> Whatever happens with Experion — pass or fail — March is where you become unshakeable.

---

## 🚫 What the Original Roadmap Got Wrong (For You)

The 24-week roadmap is for someone starting from scratch. That's NOT you.

| Original Roadmap Says | Your Reality | What to Do Instead |
|---|---|---|
| Weeks 1–4: JS deep dive | You already know JS — you just freeze on output prediction and array patterns | **Drill the 7 patterns from your failed interviews until they're muscle memory** |
| Weeks 5–8: TypeScript | You know TS basics — you freeze on typing React components under pressure | **Practice typing real React components in strict mode, not type-challenges** |
| Weeks 9–14: React + Next.js | You know React — you freeze when asked to BUILD something from scratch | **Build the same 5 components 10 times each until your hands do it without your brain** |
| Weeks 15–18: PostgreSQL | Not needed for your target roles right now | **Skip for March. Come back later.** |
| Weeks 19–23: Golang | Not needed for your target roles right now | **Skip for March. Come back later.** |

---

## 📅 March: 4-Week Refined Plan

> **Philosophy:** You're not learning. You're TRAINING. Like a boxer before a fight — you know how to punch. You need to punch without thinking.

### Week 1 (Mar 1–7): JavaScript — Kill the Array/Output Weakness

> This is where 5 of your 15 interviews died. Fix it first.

| Day | Focus | Method | Time |
|-----|-------|--------|------|
| Sat 1 | Rehearsal script Drills 1–4: frequency, dedup, groupBy, Array.from | Type each 3x from memory. Time yourself. | 3 hrs |
| Sun 2 | Drills 5–7: Fibonacci, debounce, flatten + output prediction (this, closures) | Type each 3x. Predict 10 output snippets. | 3 hrs |
| Mon 3 | Event loop deep — write 10 mixed async snippets, predict output, run to verify | Create your own tricky snippets, not just read existing ones | 2 hrs |
| Tue 4 | `this` keyword — all 5 rules. Write 10 trap snippets. Predict every one. | Focus on setTimeout + arrow vs regular, extracted methods | 2 hrs |
| Wed 5 | Closures + Promises + async/await — practical patterns | Write: memoize, once(), retry(), Promise.all from scratch | 2 hrs |
| Thu 6 | Prototypes, == vs ===, hoisting/TDZ, var/let/const | Output prediction focus. Write 10 snippets, predict, verify | 2 hrs |
| Fri 7 | **Week 1 self-test:** Pick 10 random JS questions. Answer out loud. Time: 2 min each. | Record yourself. Listen back. Notice where you hesitate. | 2 hrs |

**Week 1 exit test:**
- [ ] Can write frequency/dedup/groupBy/debounce from memory in under 2 min each
- [ ] Can predict output of any this/closure/event-loop snippet in under 60 seconds
- [ ] Can explain 5 JS concepts out loud fluently without "um" or freezing

---

### Week 2 (Mar 8–14): React — Kill the "Build X" Paralysis

> This is where 4 of your 15 interviews died. You know React. You need to BUILD in React without thinking.

| Day | Focus | Method | Time |
|-----|-------|--------|------|
| Sat 8 | Todo app — build 3 times. First time: look at reference. Second: from memory. Third: timed (target <10 min) | This is your most-failed question. Make it automatic. | 3 hrs |
| Sun 9 | File explorer (recursive) + Nested boxes (recursive) — build each 2x from memory | Both use the same recursive pattern. Nail the pattern once, both tasks become easy. | 3 hrs |
| Mon 10 | React concepts: Virtual DOM, reconciliation, keys, render cycle, controlled vs uncontrolled | Practice EXPLAINING out loud, not just reading. 2 min per concept. | 2 hrs |
| Tue 11 | Hooks deep: useState batching, useEffect cleanup/deps, useRef, custom hooks (useDebounce, useLocalStorage) | Build each custom hook from scratch. Understand why cleanup matters. | 2 hrs |
| Wed 12 | useMemo vs useCallback vs React.memo — when each helps, when it hurts. Error boundaries. | Build a component where memo actually matters. Build an ErrorBoundary. | 2 hrs |
| Thu 13 | Redux: draw the flow, explain middleware, know RTK slices, know when NOT to use Redux. Practice the talk-through script out loud. | No coding — this is about EXPLAINING fluently. Say the Redux flow 5 times. | 2 hrs |
| Fri 14 | **Week 2 self-test:** Build a random component from scratch (give yourself a prompt, start a timer). Then answer 5 React concept questions out loud. | If todo takes >10 min or you freeze on any concept, mark it for re-drill. | 2 hrs |

**Week 2 exit test:**
- [ ] Can build todo/file-explorer/nested-boxes from blank file without looking at anything
- [ ] Can explain Virtual DOM, reconciliation, hooks lifecycle, controlled vs uncontrolled in <2 min each
- [ ] Can draw Redux flow from memory and explain when NOT to use it

---

### Week 3 (Mar 15–21): TypeScript + Next.js + Jest — Round Out the JD

> These appear in every Senior React JD. You need solid answers, not expert-level depth.

| Day | Focus | Method | Time |
|-----|-------|--------|------|
| Sat 15 | TypeScript: interface vs type, any vs unknown vs never, generics basics, utility types (Partial, Pick, Omit, Record) | Type a React component's props in strict mode. Practice narrowing. | 3 hrs |
| Sun 16 | TypeScript with React: component props typing, event types (React.ChangeEvent, React.MouseEvent), generic components, discriminated unions for state | Retype the todo app in full TypeScript strict mode | 3 hrs |
| Mon 17 | Next.js: SSR vs SSG vs ISR decision tree, App Router file conventions, Server Components vs Client Components | Draw the decision tree from memory. Know when to use each. | 2 hrs |
| Tue 18 | Next.js: Server Actions, Middleware, API routes, data fetching patterns | Practice explaining out loud. Know the App Router file structure. | 2 hrs |
| Wed 19 | Jest + RTL: testing philosophy, describe/it/expect, mocking, testing hooks, snapshot testing pros/cons, TDD red-green-refactor | Write a test for a React component. Understand the pattern. | 2 hrs |
| Thu 20 | REST APIs + OAuth + Security + Accessibility — quick-fire cheat sheets | 5 bullet points per topic. No deep dive. Just enough to answer confidently. | 2 hrs |
| Fri 21 | **Week 3 self-test:** Type a React component in TS strict. Explain SSR vs SSG vs ISR. Explain your testing approach. All out loud, timed. | Mark weak spots for Week 4 re-drill. | 2 hrs |

**Week 3 exit test:**
- [ ] Can type React components in TypeScript strict mode without TS errors
- [ ] Can explain SSR/SSG/ISR with real use cases in under 2 min
- [ ] Can describe how you'd test a form component with RTL
- [ ] Can answer OAuth flow, XSS prevention, ARIA basics without hesitation

---

### Week 4 (Mar 22–28): Integration + Mock Interviews + Interview Readiness

> Stop learning. Start PERFORMING. This week is all about simulating pressure.

| Day | Focus | Method | Time |
|-----|-------|--------|------|
| Sat 22 | Full mock interview #1: 10 random questions across JS/React/TS. 2 min each. Record yourself. | Treat it like a real interview. Sit at your desk. Camera on. Speak clearly. | 3 hrs |
| Sun 23 | Review mock recording. Identify the 5 weakest answers. Re-drill those specific topics. | Be brutally honest. The gaps you find today are the gaps that won't kill you in the real thing. | 3 hrs |
| Mon 24 | System design light: "Design a dashboard". Practice thinking out loud — component tree, state, API, performance. | Framework: requirements → components → state → API → edge cases | 2 hrs |
| Tue 25 | Behavioral prep: 3 STAR stories. Code review process. Mentoring approach. Sprint estimation. | Write bullet points for each story. Practice telling them in under 2 min. | 2 hrs |
| Wed 26 | Full mock interview #2: Include a live coding task (random component build) + concept questions + behavioral | Harder than the real thing. If you survive this, the real interview feels easy. | 2 hrs |
| Thu 27 | Final re-drill of any remaining weak spots. Review failed-interview-patterns.md. Review rehearsal-script.md. | Light day. Don't cram. Confidence comes from knowing you've put in the reps. | 1.5 hrs |
| Fri 28 | **REST DAY.** No studying. Go for a walk. Sleep well. You're ready. | A rested brain performs 10x better than a crammed one. | 0 hrs |

**Week 4 exit test:**
- [ ] Can handle 10 random interview questions without freezing on any
- [ ] Have 3 STAR stories ready and rehearsed
- [ ] Can think out loud through a system design question
- [ ] Feel READY, not anxious

---

## 📊 March Daily Routine

```
Morning (1.5–2 hrs):
  └─ Day's focus from the weekly plan above
  └─ Always: speak answers out loud, don't just code silently

Afternoon (30 min):
  └─ Re-drill one pattern from a previous day that felt shaky

Evening (30 min):
  └─ Speed typing practice — type code snippets for muscle memory
  └─ OR review the rehearsal script quick-fire answers out loud
```

**Total: ~2.5–3 hrs/day weekdays, ~3 hrs weekends. Sustainable. No burnout.**

---

## 🎯 April Onwards: The Interview Strategy

After March, you're refined. Now the approach changes:

| Rule | Why |
|---|---|
| **One interview at a time** | Full focus. Prepare specifically for each company's JD. No scattergun. |
| **Research the company before applying** | Know their product, tech stack, team size. Tailor your answers. |
| **After every interview — journal it** | Use the failed-interviews template. Capture the question within 24 hours. |
| **Re-drill weak spots between interviews** | Each interview teaches you something. Use it. |
| **Don't rush** | You said 6 months is fine. That means you can be selective and prepared. |

---

## 🛡️ Handling the 6-Month Gap (They WILL Ask)

> "Tell me about the gap in your resume" — this is coming. Don't fear it. OWN it.

### The Truth (Reframed, Not Lied About)

Your actual story is strong — most interviewers have seen relocation gaps. The key is to tell it with confidence, not apology.

**What happened:** Relocated from UK to India for personal/family reasons. Took time to settle, then deliberately chose to upskill rather than rush into a role that wasn't the right fit.

**What you did during the gap:** Built a structured self-study system (this repo is literal proof), identified weaknesses from past interviews, practiced systematically, and sharpened your React/TypeScript/JS skills.

### Script — Practice This Out Loud Until It Sounds Natural

> "I relocated from the UK to India towards the end of last year. After settling in, I made a deliberate decision to take time to sharpen my skills rather than rush into the first role available. I've been doing structured deep-dive practice — JavaScript internals, advanced React patterns, TypeScript, system design — and building a practice repo that I use daily. I wanted to make sure that when I join a team, I'm contributing from day one as a senior, not ramping up on things I should already know."

### Why This Works

| What They Fear | What Your Answer Proves |
|---|---|
| "Was he fired? Is something wrong?" | No — relocation is a clean, understandable reason |
| "Did he just sit around?" | No — you have a repo, a roadmap, you can talk about what you studied |
| "Is he rusty?" | No — your technical answers in this interview will prove you're sharper than before |
| "Will he leave again?" | Address it: "I'm settled in Kerala now, looking for a long-term role here" |

### What NOT to Say

- ❌ Don't apologize: "Sorry about the gap..."
- ❌ Don't overshare personal stress or financial pressure
- ❌ Don't say "I couldn't find a job" — even if true, reframe as "I chose to prepare properly"
- ❌ Don't mention 15 failed interviews

### If They Push Further

> "What specifically did you work on during this time?"

Have 2–3 concrete things ready:
1. "I deep-dived into JavaScript internals — event loop, closures, prototypal inheritance — and built exercises to test my understanding"
2. "I practiced building React components from scratch under time pressure — autocomplete, file explorer, CRUD apps with Redux and TypeScript"
3. "I studied Next.js App Router, Server Components, and modern data fetching patterns since the ecosystem has evolved significantly"

> "Why didn't you take freelance or contract work?"

> "I considered it, but I wanted to invest this time fully in depth rather than splitting focus. I've been a working developer for years — I wanted to come back stronger, not just busy."

### The Confidence Trick

The gap only hurts you if YOU act like it's a problem. If you say it matter-of-factly — "I relocated, I upskilled, I'm ready" — the interviewer moves on. If you stammer and apologize, they smell blood.

**Practice the script 5 times out loud before any interview. Make it boring. Make it routine. Make it a non-event.**

---

## 🔑 The Mindset Shift

```
BEFORE (Jan–Feb):                        AFTER (March onwards):
"I need a job NOW"                  →    "I need the RIGHT job"
"Let me apply everywhere"           →    "Let me prepare for THIS one"
"I know this stuff"                 →    "I can PERFORM this stuff under pressure"
"15 failed interviews = I'm bad"    →    "15 failed interviews = 15 data points showing exactly what to fix"
"I'm scared of 6 months"           →    "6 months of refinement > 6 months of panic applications"
```

You already know the tech. March is about turning knowledge into performance. I'm here every day to drill with you.

---

*Start March 1. Follow the weekly plan. Come back here when you need to drill, adjust, or prep for a specific interview. Let's go.*
