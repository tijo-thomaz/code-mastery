# 📋 CRITICAL READS — Prioritized

> Read in this order. Each has a time estimate. Skip anything past #6 if short on time.

---

## #1 — Architecture Concepts (MUST READ TONIGHT)
**File:** `../L2-GAPS-ARCHITECT-DRILL.md`
**Sections:** Part 1 (Distributed Systems), Part 2 (Event-Driven)
**Time:** 20 min
**Why:** These are the EXACT topics Arun asked Friday. He WILL go deeper.
```
Key concepts to absorb:
  → CAP theorem (CP vs AP — per use case)
  → Eventual vs strong consistency
  → Distributed locking (DB → Redis → queue)
  → Event-driven patterns (notification, event sourcing, CQRS, saga)
  → Outbox pattern (reliable event publishing)
  → Message brokers (Kafka vs RabbitMQ)
```

---

## #2 — Security at Architect Level (MUST READ TONIGHT)
**File:** `../L2-GAPS-ARCHITECT-DRILL.md`
**Section:** Part 3 (Security at Architecture Level)
**Time:** 10 min
**Why:** He asked "how do you secure an application" — he wants LAYERS, not code.
```
Key concepts to absorb:
  → 9-layer security model (network → edge → auth → service → data → monitoring)
  → Zero trust (never trust, always verify)
  → mTLS between services
  → Secrets management (Vault, KMS)
```

---

## #3 — Go Hands-On Survival (MUST READ TONIGHT)
**File:** `../GO-INTERVIEW-CHEATSHEET.md`
**Sections:** Part 1 (Syntax Kit), Part 3 (Hands-On Patterns 1-3)
**Time:** 15 min
**Why:** If he asks you to code Go, Pattern 1 (minimal API) is your lifeline.
```
Key patterns to absorb:
  → Minimal REST API (25 lines — memorize this shape)
  → json.NewEncoder / json.NewDecoder
  → http.HandleFunc / mux.HandleFunc
  → http.Error for error responses
  → w.WriteHeader for status codes
```

---

## #4 — React + TS Hands-On (READ TOMORROW MORNING)
**File:** `../L1-EXTENSION-PREDICTED-SCRIPT.md`
**Section:** "REACT + TYPESCRIPT CODING" (search for "TASK 1: Build a search")
**Time:** 10 min
**Why:** Debounced search is the #1 most asked React hands-on.
```
Key patterns to absorb:
  → useDebounce custom hook
  → AbortController in useEffect
  → Loading + error + empty states
  → TypeScript interfaces (not any)
  → Cleanup function in useEffect return
```

---

## #5 — Predicted Interview Script (READ TOMORROW MORNING)
**File:** `../L1-EXTENSION-PREDICTED-SCRIPT.md`
**Sections:** Architecture scenarios + drill-down questions
**Time:** 20 min
**Why:** These are the SPECIFIC questions he'll likely ask, with answers.
```
Key sections:
  → 3 design scenarios (collab tool, multi-tenant, KYC walkthrough)
  → Deep drill-downs (event ordering, consumer failure, distributed locks)
  → Failure scenarios (broker down, cascading failure, monolith migration)
  → Team lead questions (ADRs, tech debt, onboarding)
```

---

## #6 — KYC Connection Points (SKIM BEFORE INTERVIEW)
**File:** `../L2-GAPS-ARCHITECT-DRILL.md`
**Section:** Bottom — "CONNECT EVERYTHING TO YOUR KYC EXPERIENCE"
**Time:** 5 min
**Why:** Every answer is stronger when tied to YOUR real experience.
```
  KYC → Event-Driven:    doc upload → processing → status update → notification
  KYC → Concurrency:     multiple officers reviewing same case → optimistic lock
  KYC → Security:        PII encryption, audit trail, role-based access
  KYC → Consistency:     verification status = strong consistency (PostgreSQL)
```

---

## #7 — Go Theory Verbal (OPTIONAL — IF TIME)
**File:** `../GO-INTERVIEW-CHEATSHEET.md`
**Section:** Part 2 (Theory Q&A)
**Time:** 10 min
**Why:** Quick verbal answers if he asks Go theory between coding.

---

## #8 — Fullstack Security (OPTIONAL — IF TIME)
**File:** `../FULLSTACK-SECURITY-DRILL.md`
**Section:** Rapid-fire table at bottom
**Time:** 5 min
**Why:** Quick refresh on security one-liners.

---

## #9 — System Design Rapid-Fire (OPTIONAL — IF TIME)
**File:** `../TONIGHT-BATTLE-PLAN.md`
**Section:** "SYSTEM DESIGN RAPID-FIRE" in Block 6B
**Time:** 5 min
**Why:** 30-second answers to common architecture questions.

---

## TOTAL TIME

```
Must reads (#1-#6):     ~80 min
Optional (#7-#9):       ~20 min

Tonight: #1, #2, #3          = 45 min
Tomorrow: #4, #5, #6         = 35 min
Optional if time: #7, #8, #9 = 20 min
```
