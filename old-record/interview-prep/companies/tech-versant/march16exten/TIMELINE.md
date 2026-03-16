# ⏰ L1 Extension — Timeline (Mon Mar 16, 2:30 PM)

> Tonight: 1 hr reading | Morning: 7 AM → 1:30 PM drilling | 2:30 PM interview

---

## TONIGHT — Sun 9:30 PM → 11 PM (1.5 hr)

```
9:30–10:00 PM   READ: GO-INTERVIEW-CHEATSHEET.md (Part 1-3)
                → Syntax survival + theory answers + minimal API pattern

10:00–10:30 PM  READ: L2-GAPS-ARCHITECT-DRILL.md (Parts 1-3)
                → CAP theorem, event-driven, distributed concurrency, security layers

10:30–11:00 PM  READ: L1-EXTENSION-PREDICTED-SCRIPT.md (skim full flow)
                → 45-min predicted flow, architecture + coding sections

11:00 PM        SLEEP 💤
```

---

## MORNING — Mon 7 AM → 1:30 PM (6.5 hrs)

```
7:00–7:45 AM    ARCHITECTURE VERBAL (out loud, 60-90s each)
                → CAP theorem
                → Event-driven vs request-response
                → Saga pattern + outbox pattern
                → Distributed locks (DB → Redis → queue)
                → Security layers (9 layers, defense-in-depth)
                → Zero trust
                → Read: CRITICAL-READS.md #1, #2

7:45–8:30 AM    GO HANDS-ON — TYPE FROM MEMORY
                → Minimal REST API (Pattern 1 from GO-INTERVIEW-CHEATSHEET.md)
                → Run it: go run main.go + curl test
                → Add GET by ID + middleware
                → DELETE. Rebuild. Target: < 8 min
                → Worker pool if time permits
                → Read: CRITICAL-READS.md #3

8:30–9:00 AM    GO THEORY VERBAL (out loud, 60s each)
                → Goroutines vs threads
                → Channels (buffered vs unbuffered)
                → Error handling (wrap with %w)
                → Interfaces (implicit, duck typing)
                → Context (cancellation, timeout)
                → Mutex vs Channel (when to use which)

9:00–10:00 AM   REACT + TS HANDS-ON — TYPE FROM MEMORY
                → Debounced search (useDebounce hook + AbortController) — 15 min
                → Todo with useReducer + discriminated unions — 15 min
                → DELETE. Rebuild both faster — 10 min each
                → Read: CRITICAL-READS.md #4

10:00–10:30 AM  JS CORE SPEED RUN (from memory, no peeking)
                → debounce        < 30s
                → throttle        < 30s
                → Promise.all     < 90s
                → flatten         < 60s
                → memoize         < 60s

10:30–11:30 AM  ARCHITECTURE SCENARIOS (say out loud)
                → "Design a task management system" (5 min)
                → "How do you secure a distributed system?" (3 min)
                → "How do you handle concurrent users across servers?" (3 min)
                → "Explain event-driven architecture" (3 min)
                → "Walk me through your KYC system architecture" (5 min)
                → Deep drill-downs from predicted script (event ordering,
                  consumer failure, cascading failure, saga)
                → Read: CRITICAL-READS.md #5

11:30 AM–12:15  FULL SIMULATION — pretend interview
                → 5 min: answer an architecture question out loud
                → 10 min: build Go API from scratch (timed)
                → 10 min: build React search from scratch (timed)
                → If all 3 under 25 min → you're ready

12:15–12:45 PM  WEAK SPOTS — revisit anything you stumbled on
                → Re-read that section
                → Explain it out loud one more time

12:45–1:30 PM   FINAL PREP
                → Skim GO-INTERVIEW-CHEATSHEET.md Part 5 (imports)
                → Skim CHEAT-SHEET-MONITOR.md (tape to monitor)
                → Read CRITICAL-READS.md #6 (KYC connection points)
                → Shower, water, quiet mind

2:00 PM         Join Google Meet link, test audio/video
2:30 PM         🔥 INTERVIEW — Arun Antony
```

---

## IF SHORT ON TIME — Priority Order

```
MUST (non-negotiable — do these even if you wake late):
  ✅ Go: build minimal REST API once from memory (15 min)
  ✅ React: build debounced search once from memory (15 min)
  ✅ Architecture: 5 verbal answers out loud (15 min)
  ✅ Skim CHEAT-SHEET-MONITOR.md (5 min)
  = 50 min minimum

SHOULD:
  ⚠️ Go: worker pool, middleware, theory verbal
  ⚠️ React: todo with useReducer
  ⚠️ JS: debounce, throttle, Promise.all from memory
  ⚠️ Architecture: full scenario practice

SKIP IF NEEDED:
  ⛔ Data table with sort+pagination
  ⛔ Go output prediction traps
  ⛔ Deep clone, curry, event emitter
```
