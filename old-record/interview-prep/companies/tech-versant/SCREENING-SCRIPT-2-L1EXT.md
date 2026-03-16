# 🎯 SCREENING SCRIPT 2 — L1 Extension with Arun Antony

> **Date:** Mon Mar 16, 2:30 PM IST | **Duration:** ~45 min | **Google Meet**
> **Interviewer:** Arun Antony (Solution Architect) — SAME person from Friday L1
> **What he covered Friday:** Security, distributed concurrency, distributed systems, event-driven
> **What he said:** "I need more time to evaluate" → rescheduled to continue
> **What to expect today:** Architecture DEEPER + Hands-on CODING (Go + React/TS)

---

## 🧠 ARUN'S MINDSET — What He's Doing

```
He already SAW you answer at CODE level (mutex, bcrypt, httpOnly).
He's coming back because he WANTS you to succeed — if he didn't
see potential, he'd have rejected you Friday.

TODAY he's testing:
  1. Can you UPGRADE to architect-level thinking?  (layers, trade-offs, failure)
  2. Can you actually CODE under pressure?           (Go + React)
  3. Are you TEAM LEAD material?                     (decisions, process, mentoring)

His style:
  → Broad question → listen → pick ONE thing → drill deeper
  → He's mapping your DEPTH, not just breadth
  → He wants to hear "it depends on..." and "the trade-off is..."
```

---

## ⏱️ PREDICTED 45-MIN FLOW

```
FORMAT A (most likely — mixed):
  0–3     Warm-up / "Let's continue from Friday"
  3–18    Architecture deep dive (2-3 questions, he'll drill)
  18–35   Hands-on coding (Go API or React component or both)
  35–42   Team lead / process questions
  42–45   Your questions + close

FORMAT B (coding-heavy):
  0–3     Warm-up
  3–8     Quick architecture (1 question)
  8–38    Hands-on coding — Go API + React component (30 min)
  38–42   Team lead questions
  42–45   Close
```

---

## MINUTE 0–3: WARM-UP

**He'll say:** "Hi Tijo, thanks for joining again. Let's pick up where we left off."

**YOUR MOVE:**
> "Hi Arun, great to connect again. I really enjoyed our conversation Friday —
> it got me thinking more deeply about some of those architecture topics.
> Looking forward to continuing."

**Rules:** Smile. Don't over-talk. Let him lead.

---

## MINUTE 3–18: ARCHITECTURE DEEP DIVE

> He covered security + distributed concurrency + event-driven on Friday.
> Today he'll go DEEPER on the same topics or test NEW scenarios.

---

### Q1: "Let's go back to security — how do you design security at an architecture level?"

> **THE SHIFT:** Friday you said bcrypt, httpOnly, CORS. Today say LAYERS.

**YOUR ANSWER:**

> "I think about security as defense in depth — nine layers, each independent:
>
> **Layer 1 — Network:** VPC isolation, private subnets, security groups.
> No service is publicly accessible except through the gateway.
>
> **Layer 2 — Edge:** WAF, DDoS protection, rate limiting before traffic
> reaches your services.
>
> **Layer 3 — API Gateway:** JWT validation, API key management, request
> throttling per client.
>
> **Layer 4 — Authentication:** OAuth 2.0 / OIDC, MFA, token rotation.
> Short-lived access tokens, refresh with rotation.
>
> **Layer 5 — Authorization:** RBAC with fine-grained permissions.
> In my KYC system, a compliance officer could VIEW documents but only
> a senior officer could APPROVE them.
>
> **Layer 6 — Service-to-Service:** Zero trust — every service authenticates
> to every other service via mTLS. No implicit trust based on network location.
>
> **Layer 7 — Data:** Encryption at rest (AES-256), in transit (TLS 1.3),
> field-level encryption for PII. In KYC, we encrypted SSN and passport
> numbers at the field level — even a DB dump wouldn't expose raw PII.
>
> **Layer 8 — Secrets:** No hardcoded credentials. HashiCorp Vault or AWS KMS.
> Rotate secrets automatically. Inject at runtime, not in config files.
>
> **Layer 9 — Monitoring:** Audit logs for every access, anomaly detection,
> SIEM integration. Know when something unusual happens before the attacker
> knows you know.
>
> The key principle is: no single layer failing should compromise the system."

**If he drills: "What's zero trust?"**
> "Traditional model: trust anything inside the network perimeter. Zero trust:
> never trust, always verify. Every request is authenticated and authorized,
> regardless of origin. Even internal services use mTLS. In practice: service mesh
> like Istio or Linkerd handles mTLS transparently."

**If he drills: "How do you manage secrets?"**
> "External secrets manager — Vault or AWS Secrets Manager. Services fetch secrets
> at startup via API, not from env files or config. Secrets rotate automatically.
> In Kubernetes, we mount secrets from Vault into pods — the app never sees the
> raw secret file on disk."

---

### Q2: "How would you handle concurrent users in a distributed system?"

> **THE SHIFT:** Friday you said mutex. Today say DISTRIBUTED LOCKS + QUEUES.

**YOUR ANSWER:**

> "It depends on the contention level and consistency requirements. I think
> about it in escalating levels:
>
> **Low contention — Optimistic Locking:**
> Add a version field to the record. On update, check: `WHERE version = $1`.
> If someone else updated first, version won't match → reject, let user retry.
> In my KYC system, we used this for compliance officers reviewing the same case.
>
> **Medium contention — Distributed Locks:**
> Redis-based locks with SETNX + TTL. Set a lock with expiry, do your work,
> release. TTL prevents deadlocks if the holder crashes. For critical paths,
> Redlock across multiple Redis instances.
>
> **High contention — Queue-Based:**
> Stop competing. Serialize access through a message queue. All writes to
> a resource go through a single consumer. Order is guaranteed, no conflicts.
> Kafka with partition keys ensures all events for the same entity go to the
> same consumer.
>
> **The key decision:** What happens on conflict? Retry? Reject? Merge?
> For financial data or KYC verification — reject and notify. For collaborative
> editing — merge or last-write-wins."

**If he drills: "What about idempotency?"**
> "Idempotency keys. Client generates a unique key per request, sends it as a
> header. Server stores the key + result. If the same key comes again, return
> the stored result instead of re-processing. Critical for payment systems —
> prevents double charges on network retries."

**If he drills: "What's the saga pattern?"**
> "For distributed transactions spanning multiple services. Instead of one big
> transaction, each service does its local transaction and publishes an event.
> If any step fails, we execute compensating transactions to undo previous steps.
>
> Two styles: choreography — each service listens and reacts. Orchestration —
> a central coordinator tells each service what to do. Choreography is simpler,
> orchestration gives you more control and visibility.
>
> In KYC: submit application → verify identity → check sanctions → approve.
> If sanctions check fails → compensating action: mark identity verification
> as void, notify applicant."

---

### Q3: "Explain event-driven architecture — when would you use it?"

**YOUR ANSWER:**

> "Event-driven decouples producers from consumers. The producer publishes
> what happened, doesn't care who's listening. Three key benefits:
>
> **Loose coupling:** Services don't need to know about each other.
> Document service publishes 'document_uploaded.' Notification service,
> verification service, audit service — each subscribes independently.
>
> **Resilience:** If the notification service is down, the event waits
> in the queue. When it comes back, it processes the backlog. The upload
> isn't blocked.
>
> **Scalability:** Consumers scale independently. If verification is slow,
> add more consumers. Producer doesn't change.
>
> **When NOT to use it:** When you need a synchronous response — user
> submits a form and needs immediate confirmation. Or when the added
> complexity isn't worth it for simple CRUD operations.
>
> **The hard parts:** Event ordering — use partition keys in Kafka so
> events for the same entity stay ordered. Duplicate events — make
> consumers idempotent. Lost events — outbox pattern, write event
> to DB in same transaction as business data."

**If he drills: "Kafka vs RabbitMQ?"**
> "Different tools for different needs. Kafka: durable event log, high
> throughput, consumer groups, replay capability. Best for event sourcing
> and streaming. RabbitMQ: traditional message broker, flexible routing,
> acknowledgment-based. Best for task queues and RPC patterns.
> For my KYC system, I'd use Kafka for the event stream — I want replay
> capability for audit, and I want multiple consumers processing the
> same event independently."

**If he drills: "What's the outbox pattern?"**
> "Problem: dual-write. You update the DB AND publish to Kafka — if the
> app crashes between the two, data is inconsistent.
> Solution: write the event to an outbox table in the SAME DB transaction.
> A separate process (poller or CDC) reads the outbox and publishes to
> the broker. If the publish fails, it retries. The event is never lost
> because it's in the DB."

---

### Q4: "What is CAP theorem? How does it apply in practice?"

**YOUR ANSWER:**

> "CAP says a distributed system can guarantee only two of three:
> Consistency, Availability, Partition tolerance. Since network partitions
> are inevitable, the real choice is CP vs AP — per use case.
>
> **CP (Consistency + Partition tolerance):** Every read returns the latest
> write, but some requests may fail during a partition. Example: financial
> transactions, KYC verification status. I can't have a document both
> approved and rejected.
>
> **AP (Availability + Partition tolerance):** Every request gets a response,
> but it might be stale. Example: product catalog, user preferences.
> Showing slightly stale data is fine.
>
> **In my KYC system:** Verification status = CP (PostgreSQL, strong consistency).
> Notification delivery = AP (eventually consistent, retry if needed).
> The key insight: you don't pick one for the whole system.
> You pick per service, per data type."

---

## MINUTE 18–35: HANDS-ON CODING

> **He'll say:** "Let me give you a coding task. Can you share your screen?"

---

### IF GO: "Build a REST API for task management"

**YOUR PLAY — Start simple, add features, narrate while coding:**

> "Let me start with the simplest working version and we can add features."

```
STEP 1 (5 min): Type the basic API
  → package main, imports, Task struct with json tags
  → var tasks = []Task{...}  (in-memory store)
  → mux := http.NewServeMux()
  → GET /api/tasks → json.NewEncoder(w).Encode(tasks)
  → POST /api/tasks → json.NewDecoder(r.Body).Decode(&t)
  → go run main.go → test it

STEP 2 (3 min): Add GET by ID
  → mux.HandleFunc("GET /api/tasks/{id}", getTaskByID)
  → r.PathValue("id") → loop through tasks → return or 404

STEP 3 (3 min): Add middleware
  → func logger(next http.Handler) http.Handler
  → http.HandlerFunc wrapper → next.ServeHTTP(w, r)
  → Wrap: http.ListenAndServe(":8080", logger(mux))

NARRATE: "This is a basic in-memory store. In production, I'd use
a TaskStore struct with sync.RWMutex for concurrent safety — RLock
for reads, Lock for writes. I'd also add context for cancellation
and graceful shutdown."
```

**IF HE SAYS "Make it concurrent-safe":**
```
  → Create TaskStore struct with sync.RWMutex + map[string]Task
  → Get() uses s.mu.RLock() / defer s.mu.RUnlock()
  → Set() uses s.mu.Lock() / defer s.mu.Unlock()
  → Replace the slice with the store

NARRATE: "RWMutex lets multiple goroutines read concurrently —
RLock doesn't block other readers. But writes are exclusive —
Lock blocks everyone. For a task API with many reads and few writes,
this is ideal."
```

**IF HE SAYS "Add a worker pool":**
```
  → jobs := make(chan Task, 10)
  → func worker(id int, jobs <-chan Task, wg *sync.WaitGroup)
  → range over jobs channel
  → Main: spin up 3 workers with go worker(...)
  → POST sends task to channel: jobs <- t

NARRATE: "Buffered channel acts as a work queue. Workers range over it —
when the channel closes, they stop. WaitGroup tracks worker lifecycle."
```

---

### IF REACT/TS: "Build a search component with debouncing"

**YOUR PLAY:**

> "I'll build a custom useDebounce hook and a search component with
> proper cleanup."

```
STEP 1 (3 min): TypeScript interfaces
  interface SearchResult { id: string; title: string; }
  interface SearchState { query: string; results: SearchResult[]; loading: boolean; error: string | null; }

STEP 2 (3 min): useDebounce hook
  function useDebounce<T>(value: T, delay: number): T
  → useState + useEffect + setTimeout + clearTimeout in cleanup

STEP 3 (5 min): Search component
  → useState for query, results, loading, error
  → useDebounce(query, 300)
  → useEffect on debouncedQuery:
    → if empty, clear results, return
    → const controller = new AbortController()
    → fetch with { signal: controller.signal }
    → try/catch, check if abort error
    → cleanup: return () => controller.abort()

STEP 4 (2 min): Render
  → input onChange → setQuery
  → if loading → "Searching..."
  → if error → error message
  → if results.length === 0 → "No results"
  → results.map → list items

NARRATE: "AbortController cancels in-flight requests when the query
changes — prevents race conditions where an old response arrives
after a new one. The cleanup function in useEffect handles this
automatically."
```

---

## MINUTE 35–42: TEAM LEAD QUESTIONS

---

### Q: "How do you make architecture decisions in a team?"

> "ADRs — Architecture Decision Records. Short doc: context, options we
> considered, the decision, and the trade-offs. The team reviews and
> discusses async first, then we have a focused meeting. If there's
> disagreement, I propose we timebox a PoC with measurable criteria.
> Once decided, we commit. The ADR is the permanent record of WHY —
> six months later, a new dev can read it and understand the reasoning."

---

### Q: "How do you handle a team member who's underperforming?"

> "Private 1:1 first — ask, don't assume. Maybe they're blocked, bored,
> or burned out. Set clear expectations with measurable goals — 'I need
> you to deliver X by Y.' Pair them with a strong dev if it's a skill
> gap. Check in weekly. Document everything. If there's no improvement
> after honest support, escalate to management. But most times, the
> conversation alone fixes it — people want to do good work."

---

### Q: "How do you handle technical debt?"

> "I allocate 15-20% of sprint capacity for tech debt — make it visible,
> not hidden. Tag debt tickets with impact: 'blocks every feature' vs
> 'looks ugly.' Prioritize by velocity impact — what slows the team
> down daily? The Boy Scout Rule: leave code better than you found it.
> In regulated environments like KYC, some 'debt' is actually compliance
> risk — that's not debt, that's a P1 bug."

---

### Q: "How do you ensure code quality?"

> "Three gates: automated (linting, type checking, tests in CI),
> peer review (PRs under 400 lines, at least one approval), and
> architectural (I review system-level changes myself). For Go:
> golangci-lint + errcheck + race detector in CI. For React:
> ESLint + strict TypeScript + no 'any' rule. Table-driven tests
> in Go, React Testing Library for component behavior."

---

## MINUTE 42–45: YOUR QUESTIONS + CLOSE

**Pick 2 of these:**

> 1. "What does the current architecture look like — monolith, microservices,
>     or somewhere in between?"
>
> 2. "What's the biggest technical challenge the team is facing?"
>
> 3. "How does the team split between Go backend and React frontend work?"
>
> 4. "What does the deployment pipeline look like — CI/CD, cloud provider?"
>
> 5. "What does success look like for this role in the first 90 days?"

**YOUR CLOSING:**

> "Arun, thanks again for taking the time for a second conversation. I've
> genuinely enjoyed discussing these architecture topics with you. The
> React + TypeScript + Go stack is exactly my combo, and I'd love the
> opportunity to bring my experience with the KYC system and team
> leadership to Tech Versant."

*[Stop. Smile. Don't ramble.]*

---

## 🚨 EMERGENCY PHRASES — If You Get Stuck

| Situation | Say This |
|-----------|----------|
| Brain freeze on architecture | "Let me think about this in layers..." |
| Don't know a concept | "I haven't implemented that directly, but my understanding is..." |
| Code doesn't compile | "Let me trace through this... I think the issue is here..." |
| Question is vague | "Just to clarify — are you asking about X at the system level or the code level?" |
| He goes deeper than you know | "That's the boundary of my hands-on experience — here's how I'd approach learning it..." |
| You're rambling | STOP. "To summarize the key point..." |

---

## 🧠 CONFIDENCE ANCHORS (Read at 2:20 PM)

```
1. Arun CAME BACK. He sees potential. He wants you to pass.

2. You built a PRODUCTION KYC system — PII, compliance, multi-jurisdiction.
   That's more real-world architecture than most candidates can talk about.

3. Your stack is RARE. React + TypeScript + Go. Most candidates are
   React + Node. You're the full-stack lead he's looking for.

4. You fixed the L1 gap. Friday was CODE-level answers.
   Today you speak in LAYERS, TRADE-OFFS, and FAILURE MODES.

5. You don't need to be perfect. You need to show you THINK like
   an architect who can also CODE. That's exactly who you are.
```

---

> **Frame: LAYERS. Connect: KYC. Trade-off: "it depends on..."**
> **Code: start simple, add features, narrate while coding.**
> **Energy: positive, grateful, confident. You've got this. 🔥**
