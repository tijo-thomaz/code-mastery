# 🔥 TECH VERSANT — L2 Deep Dive Prep (Mon Mar 16, 2026)

> **L1 Signal:** They asked about handling concurrent users in an incident + hotfix process.
> **What this tells us:** They care about REAL production experience, not textbook answers.
> **L2 will be:** Hands-on coding + deep dive into architecture, concurrency, incident handling.
> **Your edge:** KYC system, Go concurrency, security layers. TALK ABOUT WHAT YOU BUILT.

---

## PART 1: HANDS-ON CODING PREP

> L2 = they will ask you to CODE. Not whiteboard. BUILD.

### 🔨 React Hands-On (expect at least one)

| Task | Time | What they're testing |
|------|------|---------------------|
| Build a component with concurrent data fetching | 20 min | State management, race conditions, loading states |
| Live search with debounce + API call | 15 min | Performance, UX, abort controller |
| Form with validation + submit + error handling | 15 min | Controlled inputs, TS types, edge cases |
| Refactor a bad component (they show you code) | 15 min | Code review eye, SRP, hooks extraction |
| Build a custom hook (useDebounce, usePagination) | 10 min | Hooks mastery, reusability |

**Practice these patterns cold:**

```tsx
// Pattern 1: Fetch with loading + error + abort
function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

```tsx
// Pattern 2: Debounced search with abort
function useDebounceSearch(query: string, delay = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then(r => r.json())
        .then(setResults)
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        })
        .finally(() => setLoading(false));
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, delay]);

  return { results, loading };
}
```

```tsx
// Pattern 3: Form with validation (TS strict)
interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function useForm(initial: FormData) {
  const [values, setValues] = useState<FormData>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setValues(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (onSubmit: (data: FormData) => Promise<void>) => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors({ name: 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, submitting, handleChange, handleSubmit };
}
```

---

### 🔨 Go Hands-On (expect at least one)

| Task | Time | What they're testing |
|------|------|---------------------|
| Build a REST endpoint with middleware | 15 min | Handler → service → repo pattern |
| Implement a worker pool | 15 min | Goroutines, channels, WaitGroup |
| Write concurrent-safe code | 10 min | Mutex, race conditions |
| Error handling + context propagation | 10 min | Idiomatic Go patterns |
| Table-driven tests | 10 min | Testing discipline |

**Practice these cold:**

```go
// Pattern 1: Worker Pool
func workerPool(jobs []Job, numWorkers int) []Result {
    jobCh := make(chan Job, len(jobs))
    resultCh := make(chan Result, len(jobs))

    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobCh {
                resultCh <- process(job)
            }
        }()
    }

    for _, job := range jobs {
        jobCh <- job
    }
    close(jobCh)

    go func() {
        wg.Wait()
        close(resultCh)
    }()

    var results []Result
    for r := range resultCh {
        results = append(results, r)
    }
    return results
}
```

```go
// Pattern 2: Concurrent-safe map with RWMutex
type SafeCache struct {
    mu    sync.RWMutex
    items map[string]interface{}
}

func (c *SafeCache) Get(key string) (interface{}, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.items[key]
    return val, ok
}

func (c *SafeCache) Set(key string, val interface{}) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = val
}
```

```go
// Pattern 3: Context with timeout
func fetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, fmt.Errorf("creating request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("making request: %w", err)
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
```

---

## PART 2: CONCURRENT USERS — INCIDENT DEEP DIVE

> **They asked about this in L1.** They WILL go deeper in L2.

### The Story You Should Tell (STAR format)

**Situation:** KYC portal / high-traffic app — multiple users accessing the same resource simultaneously.

**Task:** System started showing data inconsistency / race conditions under concurrent load.

**Action — be specific about WHAT you did:**

```
1. IDENTIFIED THE PROBLEM
   → Monitoring/logs showed intermittent data corruption
   → Reproduced with concurrent requests to the same endpoint
   → Root cause: read-modify-write without locking

2. IMMEDIATE FIX (short-term)
   → Added optimistic locking (version field on DB record)
   → Database-level: UPDATE ... WHERE version = $expected_version
   → If version mismatch → 409 Conflict → frontend retries with fresh data

3. PROPER FIX (long-term)
   → Implemented proper concurrency control:
     • Optimistic locking for low-contention resources
     • Pessimistic locking (SELECT FOR UPDATE) for high-contention resources
     • Queue-based processing for critical operations (one-at-a-time)
   → Added idempotency keys for mutation endpoints
   → Rate limited concurrent writes per user

4. PREVENTION
   → Load testing with concurrent users (k6, artillery)
   → Race condition tests in CI
   → Monitoring alerts for 409 spikes
```

**Result:** Zero data corruption after fix. System handles N concurrent users.

### Concurrency Patterns — Know These Cold

```
┌─────────────────────────────────────────────────────────────┐
│ Pattern               │ When to Use                         │
├─────────────────────────────────────────────────────────────┤
│ Optimistic Locking    │ Low contention, read-heavy          │
│ (version field)       │ Retry on conflict                   │
├─────────────────────────────────────────────────────────────┤
│ Pessimistic Locking   │ High contention, must-not-fail      │
│ (SELECT FOR UPDATE)   │ Holds lock until txn commits        │
├─────────────────────────────────────────────────────────────┤
│ Queue/Serial          │ Critical ops (payments, KYC submit) │
│                       │ Process one at a time                │
├─────────────────────────────────────────────────────────────┤
│ Idempotency Keys      │ Retry-safe mutations                │
│                       │ Client sends unique key per request  │
├─────────────────────────────────────────────────────────────┤
│ Distributed Lock      │ Multi-server. Redis SETNX / Redlock │
│                       │ For cross-instance coordination      │
└─────────────────────────────────────────────────────────────┘
```

**Code — Optimistic Locking:**
```go
// DB has a `version` column
func (r *Repo) Update(ctx context.Context, task *Task) error {
    result, err := r.db.ExecContext(ctx,
        `UPDATE tasks SET title = $1, status = $2, version = version + 1
         WHERE id = $3 AND version = $4`,
        task.Title, task.Status, task.ID, task.Version,
    )
    if err != nil {
        return fmt.Errorf("updating task: %w", err)
    }

    rows, _ := result.RowsAffected()
    if rows == 0 {
        return ErrConflict // someone else updated it
    }
    return nil
}
```

**Code — Idempotency Key:**
```go
func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
    idempotencyKey := r.Header.Get("X-Idempotency-Key")
    if idempotencyKey == "" {
        http.Error(w, "X-Idempotency-Key required", http.StatusBadRequest)
        return
    }

    // Check if we already processed this request
    existing, err := h.store.GetByIdempotencyKey(r.Context(), idempotencyKey)
    if err == nil {
        // Already processed — return the same result
        json.NewEncoder(w).Encode(existing)
        return
    }

    // Process new request
    order, err := h.service.CreateOrder(r.Context(), parseBody(r))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Store with idempotency key
    h.store.SaveWithKey(r.Context(), idempotencyKey, order)
    json.NewEncoder(w).Encode(order)
}
```

**SAY THIS:**
> "For concurrent users, my approach depends on contention level. Low contention — optimistic locking with a version field, retry on conflict. High contention — pessimistic locking with SELECT FOR UPDATE. For critical operations like payments — queue-based serial processing. And every mutation endpoint gets an idempotency key so retries are safe."

---

## PART 3: HOTFIX PROCESS — TEAM LEAD ANSWER

> **They asked this in L1.** Expect deeper follow-up.

### Your Hotfix Process (say this confidently)

```
SEVERITY ASSESSMENT (first 5 min):
┌────────┬──────────────────────────────────────────────┐
│ P0     │ Data loss, security breach, full outage       │
│        │ → Hotfix NOW. All hands.                      │
├────────┤                                                │
│ P1     │ Major feature broken, significant user impact  │
│        │ → Hotfix today. Core team.                     │
├────────┤                                                │
│ P2     │ Degraded experience, workaround exists         │
│        │ → Fix in next sprint.                          │
├────────┤                                                │
│ P3     │ Minor UI bug, edge case                        │
│        │ → Backlog.                                     │
└────────┴──────────────────────────────────────────────┘
```

### Hotfix Workflow

```
1. TRIAGE (5 min)
   → Reproduce the issue
   → Check monitoring/logs for scope
   → Assign severity (P0/P1/P2/P3)
   → Communicate to stakeholders: "We're aware, investigating"

2. BRANCH STRATEGY
   → Branch from production (main/release), NOT develop
   → Naming: hotfix/TICKET-short-description
   → Smallest possible change — fix the bug, nothing else

3. FIX + TEST (30-60 min for P0)
   → Write the fix
   → Write a test that reproduces the bug → passes with fix
   → Peer review (abbreviated — 1 reviewer, focused)
   → Run full test suite — no regressions

4. DEPLOY
   → Deploy to staging → smoke test (5 min)
   → Deploy to production → monitor closely (15 min)
   → Feature flags: if uncertain, deploy behind flag → enable gradually

5. POST-HOTFIX
   → Merge hotfix back to develop/main (both branches)
   → Postmortem: root cause, timeline, what broke, how to prevent
   → Add monitoring/alerts for this failure mode
   → Update runbook if applicable
```

### The Team Lead Angle

**SAY THIS:**
> "First I assess severity — is it P0 data loss or P2 cosmetic? P0 gets all hands immediately. I communicate to stakeholders within 5 minutes — 'we're aware, investigating.' The fix branches off production, is the smallest possible change, gets a focused peer review, and includes a regression test. After deploy, I monitor for 15 minutes, then write a blameless postmortem. The most important part is merging the hotfix back to develop so it doesn't get lost."

### Follow-up Questions They Might Ask

| Question | Your Answer |
|----------|------------|
| "What if the hotfix causes another bug?" | Rollback to previous version immediately. Feature flags make this instant. Fix again with more context. |
| "How do you prevent hotfixes?" | Better test coverage, canary deployments, feature flags, load testing before release. Most hotfixes = missing test case. |
| "Who decides to deploy a hotfix?" | Lead + senior dev agree on severity. P0 = immediate, I take ownership. P1 = within hours, team decides together. |
| "Hotfix vs rollback?" | If the hotfix is risky or unclear, rollback first (safe state), then fix properly. Rollback buys you time. |
| "How do you communicate during an incident?" | Dedicated Slack channel, status page updated every 15 min, stakeholder DM with ETA. Over-communicate. |

---

## PART 4: DEEP DIVE TOPICS THEY'LL LIKELY HIT

> Based on: Team Lead + Full Stack role + L1 signals

### Architecture & System Design

| Topic | Be Ready To |
|-------|-------------|
| How would you design X? | Draw boxes: Client → BFF → Services → DB. Explain each layer's responsibility |
| Scaling a feature | Caching (Redis), DB indexing, pagination, CDN for static, horizontal scaling |
| Database choices | PostgreSQL for relational, Redis for cache/sessions, MongoDB if document-oriented makes sense |
| Message queues | RabbitMQ / SQS for async processing. Decouple heavy operations from request cycle |
| Caching strategy | Cache invalidation is the hard part. TTL-based, event-based invalidation, cache-aside pattern |

### React Deep Dive (beyond basics)

| Topic | What They Want |
|-------|---------------|
| React 18/19 features | Concurrent rendering, useTransition, useDeferredValue, Suspense boundaries |
| Performance optimization | React.memo, useMemo, useCallback, virtualization, code splitting, bundle analysis |
| State management at scale | Local → Context (low-freq) → Zustand/Redux (high-freq) → TanStack Query (server state) |
| Error boundaries | Class-based, componentDidCatch, fallback UI, recovery strategy |
| Testing strategy | RTL for integration, custom hook testing with renderHook, MSW for API mocking |

### Go Deep Dive (beyond basics)

| Topic | What They Want |
|-------|---------------|
| Goroutine leak prevention | Always ensure goroutines can exit: context cancellation, done channels, closed channels |
| Channel patterns | Fan-out/fan-in, pipeline, done channel, select with timeout |
| Interface design | Small interfaces (1-2 methods). Accept interfaces, return structs |
| Error wrapping | fmt.Errorf("context: %w", err), errors.Is, errors.As for unwrapping |
| Graceful shutdown | os.Signal, context cancellation, drain connections, WaitGroup for in-flight requests |

```go
// Graceful shutdown — they WILL ask
func main() {
    srv := &http.Server{Addr: ":8080", Handler: handler}

    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatalf("server error: %v", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    log.Println("shutting down gracefully...")
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("forced shutdown: %v", err)
    }
    log.Println("server stopped")
}
```

---

## PART 5: L2 GAME PLAN — Monday Morning

```
BEFORE (1 hour):
  □ Read this file — focus on Parts 2, 3, 4
  □ Read FRONTEND-SECURITY-DRILL.md rapid-fire table
  □ Read FULLSTACK-SECURITY-DRILL.md rapid-fire table
  □ Practice one React hands-on (debounced search — 15 min)
  □ Practice one Go hands-on (worker pool — 10 min)
  □ Practice hotfix story OUT LOUD (2 min max)
  □ Practice concurrent users story OUT LOUD (2 min max)

DURING:
  □ Listen carefully — understand the question before answering
  □ For coding: think out loud, start simple, iterate
  □ For scenario: use STAR format, be specific about numbers/tools
  □ Ask clarifying questions — shows senior thinking
  □ Don't over-engineer — solve the problem, then discuss improvements

MINDSET:
  → You CLEARED L1. They liked you. L2 is confirmation, not elimination.
  → Talk about what you BUILT (KYC, real systems). Not textbook.
  → If you don't know something: "I haven't used that specifically, but here's how I'd approach it."
  → You're interviewing THEM too. Ask about the team, the codebase, the challenges.
```

---

## 🧠 CONFIDENCE ANCHORS

1. **You cleared L1 in 45 minutes** — they saw enough to advance you FAST.
2. **They asked about incidents and hotfixes** — that means they VALUE production experience. You have that.
3. **You built a KYC portal** — concurrent users, security, compliance. That's harder than most apps.
4. **You know React + Go** — rare combo. Most candidates know one deeply.
5. **You handle pressure** — you've been through multiple interviews, learned from each one, and kept improving.

---

> **L1 was the filter. L2 is the confirmation. Show them the engineer who handles real production problems. You've done this work. Now talk about it. 🔥**
