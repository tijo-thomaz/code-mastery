# 🎯 TECHVERSANT L1 Extension — Predicted 45-Min Script

> **Interviewer:** Arun Antony (Solution Architect) — SAME person from Friday's L1
> **Date:** Mon Mar 16, 2:30 PM IST
> **Format:** 45 min — ARCHITECTURE + CODING (he didn't finish Friday, L2 still ahead)
> **What he already covered:** App security, distributed concurrent users, distributed systems, event-driven
> **What he'll do now:** Finish architecture drill + likely test hands-on Go / React / TS

---

## 🧠 HOW A SOLUTION ARCHITECT INTERVIEWS

```
He's not checking if you know React hooks or Go syntax.
He's checking:

  1. Can you DESIGN a system end-to-end?
  2. Can you explain TRADE-OFFS (not just "I'd use X")?
  3. Can you handle FAILURE scenarios?
  4. Can you think about SCALE?
  5. Can you connect decisions to BUSINESS impact?

His pattern:
  → Ask a broad question
  → Listen to your answer
  → Pick ONE thing you said → drill deeper
  → Keep drilling until you hit your limit
  → He's mapping your DEPTH, not breadth
```

---

## ⏱️ PREDICTED 45-MIN FLOW

---

## ⏱️ LIKELY SPLIT (two possible formats)

```
FORMAT A (architecture-heavy):
  0–3     Warm-up / context
  3–20    Architecture deep dive (finish what he started)
  20–40   Hands-on coding (Go or React or both)
  40–45   Your questions

FORMAT B (coding-heavy):
  0–3     Warm-up
  3–10    Quick architecture follow-up (1-2 questions)
  10–40   Hands-on coding — build something (Go API or React component)
  40–45   Your questions

EITHER WAY: expect 20+ min of CODING. Prep both.
```

---

### MINUTE 0–3: WARM-UP / CONTEXT

**He'll say something like:**
> "Last time we discussed some architecture topics. Today I want to dive deeper
> into a few areas. Let's pick up where we left off."

**Or:**
> "I want to understand how you'd approach building a system from scratch.
> Let me give you a scenario."

**YOUR MOVE:** Listen. Don't jump in. Nod. Wait for the actual question.

---

### MINUTE 3–15: SCENARIO — SYSTEM DESIGN (expect this)

> He'll give you a scenario and want you to DESIGN the architecture.

**MOST LIKELY SCENARIOS:**

---

#### Scenario A: "Design a real-time collaboration tool" (like Google Docs / Trello board)

**If he asks this, walk through:**

> "Let me clarify requirements first..."

```
CLARIFY:
  → How many concurrent users per document/board?
  → Do they need to see each other's changes in real-time?
  → What's the consistency requirement? (can users see slightly stale data?)
  → Is offline support needed?

HIGH-LEVEL ARCHITECTURE:
  React Client ←→ WebSocket Server ←→ Event Bus ←→ Backend Services ←→ PostgreSQL

  1. CLIENT LAYER
     → React + WebSocket connection for real-time
     → Optimistic UI: show user's own changes immediately
     → Reconcile when server confirms

  2. REAL-TIME LAYER
     → WebSocket server (or SSE for simpler one-way)
     → Each document/board = a "room"
     → When User A makes a change → server broadcasts to all users in the room
     → Go is excellent here — goroutine per connection, channels for room management

  3. CONCURRENCY HANDLING (he'll drill here)
     → Conflict resolution: Last-Write-Wins (simple) or Operational Transform (complex)
     → For a Trello-like board: Last-Write-Wins with optimistic locking is enough
     → For Google Docs: need CRDT or Operational Transform (mention you know these exist)
     → Version vector per document — detect concurrent edits

  4. PERSISTENCE
     → PostgreSQL for source of truth
     → Redis for ephemeral state (who's online, cursor positions)
     → Event log for audit trail (who changed what when)

  5. SCALING
     → Multiple WebSocket servers behind load balancer (sticky sessions or Redis pub/sub)
     → Redis pub/sub to broadcast across server instances
     → Each server holds connections, Redis coordinates
```

**SAY THIS:**
> "I'd use WebSocket for real-time bidirectional communication. Go is ideal here —
> one goroutine per connection is cheap. Each document is a 'room,' and changes
> are broadcast to all connected users via Redis pub/sub so it works across
> multiple server instances. For conflict resolution on a task board, last-write-wins
> with optimistic locking is sufficient. For richer text collaboration, I'd look
> at CRDTs. The source of truth is PostgreSQL, and I'd keep an event log of all
> changes for audit and undo capabilities."

---

#### Scenario B: "Design a multi-tenant SaaS platform" (very likely for Team Lead)

```
CLARIFY:
  → How many tenants? (10s, 100s, 1000s?)
  → Data isolation requirement? (shared DB, schema-per-tenant, DB-per-tenant?)
  → Do tenants have different feature tiers?

ARCHITECTURE:

  1. DATA ISOLATION (the key decision)
     → Shared DB, shared schema (tenant_id column)
       ✅ Simplest. Every query has WHERE tenant_id = $1
       ✅ Easy maintenance — one schema to migrate
       ❌ Risk: query without tenant_id leaks data
       → Best for: 100s–1000s of small tenants

     → Shared DB, separate schemas (schema-per-tenant)
       ✅ Stronger isolation — PostgreSQL schemas
       ✅ Easy to drop a tenant (DROP SCHEMA)
       ❌ Migration complexity — run per schema
       → Best for: 10s–100s of medium tenants

     → Separate databases (DB-per-tenant)
       ✅ Maximum isolation — full data separation
       ✅ Per-tenant backup/restore
       ❌ Expensive, complex routing
       → Best for: enterprise clients with compliance requirements

  2. TENANT RESOLUTION
     → Subdomain: acme.app.com → extract "acme" → look up tenant
     → Header: X-Tenant-ID (for APIs)
     → JWT claim: tenant_id embedded in token
     → Middleware extracts tenant and injects into context

  3. FEATURE FLAGS BY TIER
     → Free / Pro / Enterprise tiers
     → Feature matrix in DB or config
     → Middleware checks: does this tenant's plan include this feature?

  4. SECURITY
     → Tenant isolation is THE security concern
     → Every DB query MUST include tenant_id
     → Row-Level Security (PostgreSQL RLS) as safety net
     → Code review checklist: "Does this query filter by tenant?"
     → Test: can Tenant A access Tenant B's data? (pen test this)
```

**SAY THIS:**
> "For multi-tenancy, the key decision is data isolation. For most SaaS apps,
> I'd start with shared DB + tenant_id column — it's simplest and scales well.
> PostgreSQL Row-Level Security acts as a safety net so even if code misses the
> tenant filter, the DB enforces it. Tenant resolution happens in middleware —
> extract from subdomain or JWT claim, inject into context, and every downstream
> query uses it. For enterprise clients needing strict isolation, I'd offer
> separate schemas or databases as a premium tier."

---

#### Scenario C: "Walk me through how you'd architect a KYC/document verification system"

> He may ask you to describe YOUR system. This is your strongest angle.

```
YOUR ANSWER — architect level:

  1. INTAKE LAYER
     → React frontend: multi-step form (country-specific, config-driven)
     → File upload: client validates type/size, server validates magic bytes
     → Documents stored in S3 with encryption at rest, pre-signed URLs for access

  2. PROCESSING LAYER (event-driven)
     → Document uploaded → event published → verification service picks up
     → OCR / automated checks → extract data from document
     → Compliance rules engine validates extracted data
     → Status transitions: uploaded → processing → verified / rejected

  3. REVIEW LAYER
     → Compliance officers access a review dashboard
     → Optimistic locking on review records — prevent two officers approving same case
     → Audit log: every action by every officer is recorded with timestamp

  4. DATA SECURITY (critical for KYC)
     → PII encrypted at field level before storage
     → Document access through pre-signed URLs (time-limited, no direct S3 access)
     → Access control: only authorized roles can view PII
     → Audit trail: who accessed what document, when, from which IP
     → Data retention policy: auto-delete after compliance window
     → GDPR: right to deletion, data export on request

  5. CONSISTENCY
     → Verification status must be strongly consistent
     → PostgreSQL with serializable isolation for status transitions
     → Can't have a document both approved and rejected

  6. SCALABILITY
     → Verification queue: burst of uploads doesn't overwhelm processing
     → Worker pool: N consumers process documents in parallel
     → Each country's rules are config-driven — adding a country = config, not code
```

---

### MINUTE 15–25: DEEP DIVE — He Picks One Topic and DRILLS

> He'll take something from your answer and go deeper. Predict:

---

#### If he drills on EVENT-DRIVEN:

**Q: "How do you ensure events are not lost?"**
> "Outbox pattern. The event is written to an outbox table in the same DB
> transaction as the business data. A separate poller or CDC (Change Data Capture)
> reads unpublished events and pushes to the message broker. If the app crashes
> after DB commit but before publish, the poller picks it up on next run."

**Q: "What if a consumer fails to process an event?"**
> "Retry with exponential backoff. After N retries, move to dead letter queue.
> Alert on DLQ size. Manual inspection — fix the bug, replay the events.
> Consumer must be idempotent — processing the same event twice should be safe."

**Q: "How do you handle event ordering?"**
> "Kafka guarantees ordering within a partition. I partition by entity ID —
> all events for order-123 go to the same partition, so they're processed in order.
> RabbitMQ doesn't guarantee ordering across consumers — if ordering matters,
> use a single consumer or Kafka."

**Q: "Event sourcing vs traditional CRUD — when?"**
> "CRUD for most things — simpler, familiar. Event sourcing when you need a
> complete audit trail, ability to replay history, or temporal queries like
> 'what was the state at 3 PM yesterday.' Financial systems, KYC, compliance-heavy
> domains. The trade-off is complexity — rebuilding state from events requires
> snapshots for performance, and the learning curve is steep for the team."

---

#### If he drills on DISTRIBUTED CONCURRENCY:

**Q: "How do you handle two users editing the same resource on different servers?"**
> "The database is the single coordination point. Optimistic locking with a version
> column — UPDATE WHERE version = expected. If 0 rows affected, return 409 Conflict,
> client refreshes and retries. The DB doesn't care which server the request came from."

**Q: "What about operations that span multiple services?"**
> "Saga pattern. No distributed transactions — each service commits locally and
> publishes an event. If a downstream step fails, compensating events undo previous
> steps. Example: order → payment → inventory. Payment fails → publish PaymentFailed
> → inventory releases reservation → order marked as failed → user notified."

**Q: "Distributed lock — when and how?"**
> "When multiple servers need to coordinate on a shared resource that's NOT in a
> single DB. Redis SETNX with TTL. Example: scheduled job that should run on only
> one instance. Acquire lock with SETNX, set TTL as safety net, release after work.
> Redlock algorithm for multi-node Redis. But I avoid distributed locks when
> possible — database locking or queue serialization is simpler."

**Q: "What is the CAP theorem and how does it affect your design?"**
> "In a distributed system, you can guarantee only 2 of: Consistency, Availability,
> Partition Tolerance. Since network partitions are inevitable, it's really C vs A.
> I choose CP for transactional data — PostgreSQL, strong reads. AP for analytics
> or feeds — eventually consistent, higher availability. The choice is per-service,
> not system-wide."

---

#### If he drills on SECURITY:

**Q: "How do you secure communication between microservices?"**
> "mTLS — both services present certificates and verify each other. A service mesh
> like Istio handles certificate issuance and rotation automatically. Zero-trust
> model: even inside the VPC, every service authenticates. Additionally, each
> service has scoped permissions — Payment Service can access only payment-related
> data, not user profiles."

**Q: "How do you handle secrets in a distributed system?"**
> "HashiCorp Vault or AWS Secrets Manager. Secrets injected at runtime, never in
> code, env files, or Docker images. Automatic rotation — DB passwords, API keys
> rotate on schedule with zero downtime. Audit trail: who accessed which secret
> and when. Applications fetch secrets at startup and cache in memory."

**Q: "How do you detect and respond to a security breach?"**
> "Monitoring: alert on auth failure spikes, unusual access patterns, privilege
> escalation attempts. Audit logs are immutable and stored separately. Incident
> response: contain (revoke tokens, disable endpoint), assess scope, fix, notify
> stakeholders, blameless postmortem. As lead, I own the communication and ensure
> the team learns from it."

**Q: "What about data privacy and compliance?"**
> "Minimize PII collection. Encrypt at rest (AES-256) and field-level for sensitive
> data. Access control: only services that NEED PII can access it. Audit every PII
> access. Retention policy: auto-delete after compliance window. GDPR: right to
> deletion and data export. In KYC, every document access was logged with user,
> timestamp, and IP."

---

### MINUTE 25–35: SCENARIO #2 or FAILURE/TRADE-OFF QUESTIONS

> He'll either give you another scenario or test how you handle failure.

---

**Q: "What happens when your message broker goes down?"**
> "The outbox pattern saves us — events are in the DB, so nothing is lost. The
> application continues to operate, writes to DB succeed, events queue up in the
> outbox table. When the broker comes back, the poller catches up. For critical
> real-time needs, I'd have a fallback: direct HTTP call with circuit breaker,
> then async reconciliation later."

**Q: "How do you handle a cascading failure across services?"**
> "Circuit breakers on every inter-service call. If Service B fails, Service A's
> circuit opens — fail fast, return fallback response. Bulkhead pattern: isolate
> resources so one failing service doesn't consume all connections. Timeouts on
> every outbound call. Health checks: load balancer stops routing to unhealthy
> instances. The system degrades gracefully — partial functionality rather than
> total outage."

**Q: "You need to migrate from monolith to microservices. How?"**
> "Strangler fig pattern. Don't rewrite — incrementally extract. Identify bounded
> contexts (DDD). Extract one service at a time, starting with the most independent.
> Run old and new in parallel. Route traffic via API gateway — gradually shift to
> new service. Keep the monolith's DB initially — extract data later. This is a
> multi-month/year effort, not a big-bang migration."

**Q: "How do you decide what technology to use for a new service?"**
> "Team familiarity first — a known technology well-used beats a 'perfect' technology
> nobody knows. Then: does it solve the specific problem? Go for high-concurrency
> services. Node for BFF/API aggregation. React for frontend — but that's already
> decided here. I write an ADR (Architecture Decision Record) documenting the why,
> so future team members understand the reasoning."

---

---

## 🖥️ CODING SECTION — What He'll Ask You To Build

> SA who codes = he'll give you a REAL problem, not leetcode.
> He wants to see: clean architecture, error handling, types, how you think while coding.

---

### GOLANG CODING — Most Likely Tasks

**TASK 1: "Build a REST endpoint" (most probable — 15 min)**

```go
// He'll say: "Build me a Go API endpoint for creating a task/user/order"
// What he wants to see:

package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "sync"
    "time"
)

type Task struct {
    ID        string    `json:"id"`
    Title     string    `json:"title"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
}

type CreateTaskRequest struct {
    Title string `json:"title"`
}

// In-memory store (he won't expect a DB in a live coding round)
var (
    tasks   = make(map[string]Task)
    tasksMu sync.RWMutex
    nextID  = 1
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("POST /api/tasks", createTask)
    mux.HandleFunc("GET /api/tasks", listTasks)
    mux.HandleFunc("GET /api/tasks/{id}", getTask)

    fmt.Println("Server on :8080")
    http.ListenAndServe(":8080", mux)
}

func createTask(w http.ResponseWriter, r *http.Request) {
    var req CreateTaskRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
        return
    }
    if req.Title == "" {
        http.Error(w, `{"error":"title required"}`, http.StatusBadRequest)
        return
    }

    tasksMu.Lock()
    id := fmt.Sprintf("task-%d", nextID)
    nextID++
    task := Task{ID: id, Title: req.Title, Status: "todo", CreatedAt: time.Now()}
    tasks[id] = task
    tasksMu.Unlock()

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(task)
}

func listTasks(w http.ResponseWriter, r *http.Request) {
    tasksMu.RLock()
    defer tasksMu.RUnlock()

    result := make([]Task, 0, len(tasks))
    for _, t := range tasks {
        result = append(result, t)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}

func getTask(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")

    tasksMu.RLock()
    task, ok := tasks[id]
    tasksMu.RUnlock()

    if !ok {
        http.Error(w, `{"error":"not found"}`, http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(task)
}
```

**WHAT HE'S WATCHING:**
```
✅ Proper HTTP methods (POST for create, GET for read)
✅ Input validation (title required)
✅ Correct status codes (201, 400, 404)
✅ JSON encoding/decoding
✅ Content-Type header
✅ Mutex for concurrent access (shows you think about concurrency)
✅ Clean separation (handler does one thing)
```

---

**TASK 2: "Add middleware" (he might chain this after Task 1)**

```go
// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Auth middleware (simple token check)
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
            return
        }
        // In real app: validate JWT here
        next.ServeHTTP(w, r)
    })
}

// Wire it up
handler := loggingMiddleware(authMiddleware(mux))
http.ListenAndServe(":8080", handler)
```

---

**TASK 3: "Worker pool / concurrent processing" (if he tests Go concurrency)**

```go
func processItems(items []string, workers int) []string {
    jobs := make(chan string, len(items))
    results := make(chan string, len(items))

    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for item := range jobs {
                // simulate processing
                results <- strings.ToUpper(item)
            }
        }()
    }

    for _, item := range items {
        jobs <- item
    }
    close(jobs)

    go func() {
        wg.Wait()
        close(results)
    }()

    var output []string
    for r := range results {
        output = append(output, r)
    }
    return output
}
```

---

### REACT + TYPESCRIPT CODING — Most Likely Tasks

**TASK 1: "Build a search/filter component" (most probable — 15 min)**

```tsx
import { useState, useEffect, useRef } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setUsers([]);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    fetch(`/api/users?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: abortRef.current.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setUsers)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length === 0 && !loading && query && <p>No results</p>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

**WHAT HE'S WATCHING:**
```
✅ TypeScript interfaces (not any)
✅ Custom hook extraction (useDebounce)
✅ AbortController for race conditions
✅ Loading + error + empty states
✅ encodeURIComponent on user input
✅ Cleanup in useEffect return
```

---

**TASK 2: "Todo / task list with useReducer" (shows state management depth)**

```tsx
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string };

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: crypto.randomUUID(), text: action.text, completed: false }];
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.id);
  }
}

function TaskList() {
  const [tasks, dispatch] = useReducer(reducer, []);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch({ type: 'ADD', text: input.trim() });
    setInput('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <span
              style={{ textDecoration: t.completed ? 'line-through' : 'none' }}
              onClick={() => dispatch({ type: 'TOGGLE', id: t.id })}
            >
              {t.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE', id: t.id })}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**WHAT HE'S WATCHING:**
```
✅ Discriminated union for actions (not string literals)
✅ Immutable state updates (map, filter, spread — NO push/splice)
✅ Form submit with e.preventDefault()
✅ Controlled input
✅ Stable keys (crypto.randomUUID, not index)
```

---

**TASK 3: "Data table with sort + pagination" (senior-level React)**

```tsx
interface Column<T> {
  key: keyof T;
  label: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

function DataTable<T extends { id: string | number }>({
  data, columns, pageSize = 5
}: Props<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer' }}>
                {col.label} {sortKey === col.key ? (sortAsc ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={String(col.key)}>{String(row[col.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
```

---

### MINUTE 35–42: TEAM LEAD / PROCESS QUESTIONS

> As a Solution Architect, he'll want to know how you LEAD technical decisions.

**Q: "How do you make architecture decisions in a team?"**
> "I write ADRs — Architecture Decision Records. Short doc: context, options
> considered, decision, consequences. The team reviews and discusses. If there's
> disagreement, I facilitate — focus on trade-offs, not opinions. Once decided,
> we commit. The ADR is the permanent record of WHY."

**Q: "How do you handle technical debt as a lead?"**
> "I allocate ~20% of sprint capacity for tech debt. Tag debt tickets with impact:
> 'blocks us' vs 'annoys us.' Prioritize by: what slows the team down most? I track
> it visibly so product understands it's real work. The Boy Scout Rule: leave code
> better than you found it — small continuous improvements over big rewrites."

**Q: "How do you onboard a new developer to a complex distributed system?"**
> "Week 1: set up local dev, first PR (small fix). Architecture walkthrough — I draw
> the system diagram and explain each service, how they communicate, where data flows.
> Pair programming on real tasks. Assign a 'starter' service — well-tested, low-risk.
> Documentation: architecture diagrams, runbooks, ADRs. Month 1: own a feature
> end-to-end with review support."

**Q: "How do you ensure system reliability?"**
> "SLOs — define targets (99.9% uptime, p95 latency < 200ms). Monitoring against
> SLOs with alerts when we approach the error budget. Runbooks for common incidents.
> Chaos engineering: intentionally inject failures in staging. Load testing before
> major releases. Blameless postmortems after incidents."

---

### MINUTE 42–45: YOUR QUESTIONS + CLOSE

**ASK HIM THESE (shows architect-level thinking):**

1. "What does the current service architecture look like? Monolith, microservices, or somewhere in between?"
2. "What's the biggest technical challenge the team is facing right now?"
3. "How do you handle cross-team coordination on shared services?"
4. "What does the deployment pipeline look like? CI/CD, feature flags?"
5. "What's the team's approach to observability — structured logging, tracing, metrics?"

**DO NOT ASK:** salary, leave, WFH — save for HR round.

---

## 🎯 CHEAT SHEET — TAPE THIS TO YOUR MONITOR

```
WHEN HE ASKS ABOUT...          THINK IN TERMS OF...

Security                    →   LAYERS (network → edge → auth → service → data → monitoring)
Concurrency                 →   DB locks → distributed locks → queues → idempotency
Events                      →   Publisher → broker → consumers → DLQ → outbox pattern
Failure                     →   Circuit breaker → fallback → retry → DLQ → graceful degradation
Scale                       →   Stateless servers → load balancer → cache → read replicas → queues
Consistency                 →   Strong (PostgreSQL) vs eventual (events) — PER USE CASE
Architecture decisions      →   ADRs, trade-offs, team familiarity, solve the actual problem
```

---

## 🗣️ PHRASES THAT SOUND ARCHITECT-LEVEL

> Sprinkle these naturally. Don't force them.

```
"It depends on the contention level..."
"The trade-off here is..."
"I'd start with the simplest approach and evolve..."
"In my KYC system, we handled this by..."
"Defense in depth — no single layer is sufficient..."
"That's a cross-cutting concern, so I'd handle it in middleware / at the infrastructure level..."
"The key constraint here is consistency vs availability..."
"I'd document this decision in an ADR so the team understands the why..."
"Graceful degradation — partial functionality is better than total outage..."
"The system should fail fast and recover automatically..."
```

---

## ⏰ PREP PLAN (1 hr tonight + 7 AM → 2 PM)

```
TONIGHT (1 hr):
  → Read this script end-to-end — architecture + coding sections (40 min)
  → Read L2-GAPS-ARCHITECT-DRILL.md Parts 1-3 (20 min)
  → Sleep

MORNING (7 AM → 2 PM):

  7:00–8:00    ARCHITECTURE VERBAL DRILL
               → Re-read architecture section of this script
               → Answer every predicted question OUT LOUD (60–90s each)
               → Focus: CAP, event-driven, saga, distributed locks, security layers

  8:00–9:30    GO HANDS-ON — TYPE FROM MEMORY
               → Build REST API (POST + GET) with in-memory store — 15 min
               → Add middleware (logging + auth) — 10 min
               → Worker pool with channels + WaitGroup — 10 min
               → Graceful shutdown — 5 min
               → DELETE ALL. Build API again FASTER — target < 10 min
               → Run with: go run main.go + test with curl

  9:30–11:00   REACT + TS HANDS-ON — TYPE FROM MEMORY
               → Debounced search with AbortController — 15 min
               → Todo with useReducer + discriminated unions — 15 min
               → Data table with sort + pagination — 20 min
               → DELETE ALL. Rebuild search + todo FASTER — target < 10 min each

  11:00–12:00  ARCHITECTURE DEEP DIVE
               → Practice scenarios out loud (collab tool, multi-tenant, KYC)
               → Drill-down questions: event ordering, cascading failure, saga
               → Security: layers, zero trust, mTLS — architect-level framing

  12:00–12:30  JS CORE SPEED RUN (in case he tests JS fundamentals)
               → Debounce, throttle, Promise.all, flatten, memoize
               → Type each from memory in < 60s

  12:30–1:00   FULL SPEED RUN — simulate the interview
               → 5 min architecture question (answer out loud)
               → 15 min Go API (build from scratch, timed)
               → 15 min React search component (build from scratch, timed)
               → If you finish all 3 under 35 min → you're ready

  1:00–1:30    Rest. Water. Quiet. Skim cheat sheet on monitor.
               
  2:30 PM      🔥 INTERVIEW
```

---

> **He's not testing if you can BUILD these systems (he knows you can — you passed L1).
> He's testing if you can THINK about systems the way an architect does.
> Talk in layers, trade-offs, and failure modes. Connect to KYC.
> You know more than you think. Just frame it right. 🏗️🔥**
