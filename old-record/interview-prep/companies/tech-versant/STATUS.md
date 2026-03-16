# Tech Versant — 🟢 ACTIVE

**Role:** Team Lead — Full Stack 🔥
**Stack:** React / JS / TS + **Golang** (they asked about years of Go experience)
**Security Focus:** Frontend + Backend — expect deep security grilling

| Round | Status | Date | Notes |
|-------|--------|------|-------|
| L1 (Arun Antony — Solution Architect) | ✅ Done | Fri Mar 13, 2026 | ~45 mins. Architecture-only, NO code. Asked: app security, distributed concurrent users, distributed systems, event-driven. He wants more time — rescheduling to continue. |
| L1 Extension (same interviewer) | ⏳ Scheduled | Mon Mar 16, 2026, 2:30 PM IST | Arun Antony continuing L1 evaluation. Expect deeper drill on same topics. |
| L2 | ⬜ Pending | — | — |
| HR / Offer | ⬜ Pending | — | — |

---

## Pre-Screening Checklist

- [ ] Read `BATTLE-PLAN.md` → Part 4 (Team Lead) + Part 5 (Golang)
- [ ] Prepare 3 STAR stories (led feature, resolved conflict, technical decision)
- [ ] Practice intro: stack identity + lead experience + Go mention (2 min)
- [ ] Verbal drill V1–V3 (Fiber, build/dev, peer deps) — don't repeat Experion mistakes
- [ ] Skim `golang/interview-questions/common-questions.md` — goroutines, channels, interfaces

---

## Golang — What They'll Likely Ask in Screening

Since they asked about years of Go experience, expect 2-3 Go questions. Be ready for:

### Must-Know (screening level)

| Question | One-liner |
|----------|-----------|
| "How long have you been writing Go?" | Be honest. State your actual experience level |
| "Goroutines vs threads?" | Lightweight user-space threads, 2KB stack, M:N scheduled by Go runtime, thousands are cheap |
| "How do channels work?" | Typed pipes between goroutines. Unbuffered = sync, buffered = async up to capacity |
| "Error handling in Go?" | No exceptions. Functions return `(result, error)`. Check `if err != nil`. Wrap with `fmt.Errorf("...: %w", err)` |
| "Why Go over Node for backend?" | Compiled, strong concurrency model, low memory footprint, fast cold starts, simple deployment (single binary) |

### If They Go Deeper

| Topic | Quick answer |
|-------|-------------|
| `defer` | LIFO order, args evaluated immediately, runs on function return |
| Interfaces | Implicit satisfaction (duck typing). No `implements` keyword |
| Slices vs arrays | Slice = pointer + length + capacity. Array = fixed size, value type |
| `context.Context` | Cancellation, timeouts, deadlines, request-scoped values. Pass as first arg |
| `sync.WaitGroup` | `Add(n)` before goroutines, `Done()` in each, `Wait()` to block until all finish |
| Maps concurrency | NOT safe. Use `sync.Mutex` or `sync.Map` |

### Go + Team Lead Angle

> If they ask about Go in the context of team leadership:

- "I've used Go for backend services — REST APIs, worker pools, concurrent processing"
- "Go's simplicity makes it great for teams — less bike-shedding, one way to do things"
- "I enforce `golangci-lint`, table-driven tests, and `errcheck` in CI"
- "For new Go devs on the team, I pair-program on goroutine patterns first — that's where bugs hide"

---

## 30-Min Screening Game Plan

| Time | Focus | Notes |
|------|-------|-------|
| 0–3 min | Intro | Stack identity + "I work across React/TS frontend and Go backend" |
| 3–10 min | JS/React rapid fire | Closures, hooks, Fiber, state mgmt |
| 10–15 min | Go questions | Goroutines, channels, error handling |
| 15–22 min | Team Lead questions | STAR stories, process, mentoring |
| 22–27 min | Their pitch | Listen, show interest, ask about team |
| 27–30 min | Your questions | "What does the Go vs React split look like? Team size? Deployment?" |
