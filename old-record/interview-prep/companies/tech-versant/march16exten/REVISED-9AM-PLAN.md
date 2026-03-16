# 🔥 REVISED BATTLE PLAN — 9 AM Start (5 hrs to interview)

> You slept well = sharper brain. 5 hrs is MORE than enough.
> **Rule: DO → Don't just read. Type it. Say it out loud. Active recall beats re-reading 10x.**

---

## THE SCIENCE: Why This Order Works

```
1. CODE FIRST (while brain is freshest) → muscle memory locks in
2. ARCHITECTURE VERBAL (mid-morning) → speaking activates different memory
3. SIMULATION (late morning) → pressure-test under fake stress
4. LIGHT REVIEW + REST (before interview) → let brain consolidate
```

---

## BLOCK 1: GO HANDS-ON — 9:00 → 10:15 (75 min)

### 9:00-9:25 — REST API from Memory (Pattern 1 from cheatsheet)
```
1. Open empty main.go
2. Type minimal REST API from memory (GET + POST, in-memory store)
3. go run main.go → curl test
4. If stuck → peek at GO-INTERVIEW-CHEATSHEET.md Part 3, Pattern 1
5. DELETE the file. Do it again. Target: < 8 min
```

### 9:25-9:50 — Go Drill Problems (from golang/GO-HANDS-ON-DRILL.md)
```
Type from memory — one at a time, run after each:
  ✅ Fibonacci (P1)            — < 2 min
  ✅ Balanced Brackets (P3)    — < 3 min
  ✅ Two Sum (P5)              — < 2 min
  ✅ Binary Search (P13)       — < 2 min
  ✅ Reverse String (P6)       — < 1 min

If any fails to compile → fix it, delete, redo.
```

### 9:50-10:15 — Go Theory Verbal (say OUT LOUD, 60s each)
```
Walk around the room. Pretend Arun is asking:
  □ "Goroutines vs threads?"
  □ "How do channels work?"
  □ "Error handling in Go?"
  □ "Interfaces — how do they work?"
  □ "Context — what and why?"
  □ "Mutex vs Channel — when to use which?"
  □ "Why Go over Node for backend?"

If stuck → quick peek at GO-INTERVIEW-CHEATSHEET.md Part 2
```

**☕ 2-min water break**

---

## BLOCK 2: REACT + TS HANDS-ON — 10:17 → 11:00 (43 min)

### 10:17-10:40 — Debounced Search from Memory
```
1. Create new React+TS component from scratch
2. Must include:
   → useDebounce custom hook (useState + useEffect + setTimeout)
   → AbortController in fetch useEffect
   → TypeScript interfaces for SearchResult
   → Loading / error / empty states
   → Cleanup function in useEffect return
3. If stuck → peek at L1-EXTENSION-PREDICTED-SCRIPT.md "TASK 1"
4. DELETE. Rebuild. Target: < 12 min
```

### 10:40-11:00 — JS Core Speed Run (type from memory, no peeking)
```
  □ debounce function         — < 45s
  □ throttle function         — < 45s
  □ Promise.all polyfill      — < 90s
  □ Array flatten             — < 60s

If you nail 3/4 → move on. Don't get stuck here.
```

**☕ 5-min break — stretch, water, snack**

---

## BLOCK 3: ARCHITECTURE VERBAL — 11:05 → 12:00 (55 min)

> **THE MOST IMPORTANT BLOCK.** Arun is a Solution Architect.
> He cares MORE about how you THINK than how you CODE.

### 11:05-11:30 — Core Concepts Out Loud (90s each, walk around)
```
Pretend Arun just asked you. Answer OUT LOUD:
  □ "Explain CAP theorem" → CP vs AP per use case, KYC = CP
  □ "Event-driven vs request-response" → loose coupling, eventual consistency
  □ "How do you handle distributed concurrency?" → DB locks → Redis → queues
  □ "Saga pattern — what is it?" → choreography vs orchestration, compensating tx
  □ "How do you secure a distributed system?" → 9 LAYERS, defense in depth
  □ "What is zero trust?" → never trust, always verify, mTLS between services
  □ "Outbox pattern — why?" → reliable event publishing, avoid dual-write
  □ "Circuit breaker — when?" → cascading failure prevention, fallback

KEY RULE: Every answer must have:
  1. One-line definition
  2. "In my KYC system..." real example
  3. Trade-off or "it depends on..."
```

### 11:30-12:00 — Architecture Scenarios (5 min each, out loud)
```
  □ "Walk me through your KYC system architecture"
    → Draw it mentally: client → API gateway → auth → services → DB
    → Event flow: doc upload → processing → status → notification
    → Security: PII encryption, audit trail, RBAC, mTLS

  □ "Design a task management system for distributed teams"
    → Start with: "What are the requirements?" (show architect thinking)
    → Then: users, real-time updates, task state, notifications
    → Patterns: event-driven, optimistic locking, WebSocket

  □ "How would you handle concurrent users editing the same resource?"
    → Optimistic locking (version field) → conflict detection → merge/reject
    → "In KYC, multiple officers reviewing same case..."

  □ "What happens when your message broker goes down?"
    → Outbox pattern → local DB → retry → DLQ → graceful degradation
    → Circuit breaker on the producer side

  □ "How do you migrate from monolith to microservices?"
    → Strangler fig → start with highest-value bounded context
    → Keep shared DB initially → split later → events for integration
```

**🍌 10-min real break — eat something, walk, NO screens**

---

## BLOCK 4: SIMULATION — 12:10 → 12:45 (35 min)

> Pretend this is the real interview. Set a timer. No peeking.

```
12:10-12:15  (5 min)  → Arun asks architecture question
                        Answer out loud, time yourself
                        Pick: "How do you secure a distributed system?"

12:15-12:25  (10 min) → "Build a REST API in Go"
                        Empty file. Timer running. Narrate while coding.
                        Must compile and run.

12:25-12:35  (10 min) → "Build a debounced search in React"
                        Empty file. Timer running. Narrate while coding.
                        Must include TS interfaces + AbortController.

12:35-12:45  (10 min) → Rapid-fire architecture:
                        "What's the saga pattern?" (90s)
                        "CAP theorem — explain" (90s)
                        "How do distributed locks work?" (90s)
                        "What's eventual consistency?" (60s)
```

### SCORE YOURSELF:
```
Architecture answer had layers + KYC example?     □ YES  □ NO
Go API compiled on first try?                     □ YES  □ NO
Go API done under 10 min?                         □ YES  □ NO
React search had AbortController + interfaces?    □ YES  □ NO
Rapid-fire: answered all 4 without freezing?      □ YES  □ NO

4-5 YES = you're ready 🔥
3 YES = review weak spot in Block 5
< 3 YES = redo the failed one, don't panic
```

---

## BLOCK 5: FINAL PREP — 12:45 → 1:30 (45 min)

### 12:45-1:00 — Weak Spot Fix
```
Whatever you stumbled on in simulation:
  → Re-read that section
  → Explain it out loud ONE more time
  → Move on. Don't spiral.
```

### 1:00-1:15 — Final Reads (skim, don't study)
```
  □ Skim CHEAT-SHEET-MONITOR.md → tape/pin to monitor
  □ Skim L1-EXTENSION-PREDICTED-SCRIPT.md → architecture scenarios
  □ Read KYC connection points (CRITICAL-READS #6)
  □ Skim GO-INTERVIEW-CHEATSHEET.md Part 5 (imports)
```

### 1:15-1:30 — Print & Prep
```
  □ Print or display CHEAT-SHEET-MONITOR.md on second screen
  □ Open Google Meet link, test audio/video
  □ Have water bottle ready
  □ Close all unnecessary tabs
```

---

## BLOCK 6: RECHARGE — 1:30 → 2:20 (50 min)

```
  🚿 Shower
  🍽️ Light meal (not heavy — no food coma)
  🧘 10 min quiet — no studying, no phone
  💪 Remind yourself:
     "I built a production KYC system handling PII, compliance, multi-jurisdiction.
      I know security, I know architecture, I know code.
      Arun wants to see how I THINK, not perfection."

  2:00 PM → Join Meet, test audio/video
  2:20 PM → Glance at CHEAT-SHEET-MONITOR.md one last time
  2:30 PM → 🔥 CRUSH IT
```

---

## ⚡ IF YOU'RE BEHIND SCHEDULE — Emergency 2-Hour Plan

```
ABSOLUTE MINIMUM (if only 2 hrs left):
  45 min → Go REST API from memory + 3 drill problems
  30 min → React debounced search from memory
  30 min → Architecture: 5 concepts out loud + KYC walkthrough
  15 min → Skim cheat sheet + setup

Everything else is bonus. These 4 things = PASS.
```
