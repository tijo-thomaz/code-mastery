# 🔥 TECHVERSANT L2 — TONIGHT + MORNING BATTLE PLAN

> **Interview:** Mon Mar 16, 2:30 PM IST | Google Meet | Arun Antony | ~45 min
> **Available:** 11 PM–3 AM tonight (4 hrs) + 10 AM–2 PM tomorrow (4 hrs) = **8 hrs total**
> **Strategy:** Don't try to cover everything. Drill the TOP 10 things they'll actually ask.
> **Rule:** HANDS-ON ONLY. No reading. TYPE CODE. RUN IT. REPEAT.

---

## 🧠 WHAT L2 WILL LOOK LIKE (based on L1 signals)

```
L1 asked: concurrent users + hotfix handling → THEY CARE ABOUT PRODUCTION SKILLS

L2 (Arun Antony — likely senior tech lead):
  → 15 min: JS/TS hands-on coding (write it, run it)
  → 15 min: React hands-on (build a component live)
  → 10 min: Architecture / system design scenario
  → 5 min:  Go depth (concurrency, patterns)
```

---

## ⏰ TONIGHT: 11 PM → 3 AM (4 hrs)

> **Theme:** JS/TS muscle memory + React component speed

---

### BLOCK 1: JS CORE SPEED ROUND (11:00 PM → 12:00 AM) — 1 hr

> Open a blank file. Type from MEMORY. No peeking. Time yourself.

**Do these 8 drills in order. 2 rounds each.**

| # | Drill | Target | Why |
|---|-------|--------|-----|
| 1 | Debounce function | < 60s | Asked in 80% of interviews |
| 2 | Throttle function | < 60s | Often paired with debounce |
| 3 | Promise.all polyfill | < 3 min | Shows async mastery |
| 4 | Flatten array (recursive + depth) | < 90s | Classic senior question |
| 5 | Deep clone (handle Date, Array, Object) | < 2 min | Shows JS depth |
| 6 | Event Emitter (on, emit, off) | < 3 min | Pattern knowledge |
| 7 | Memoize function | < 90s | Performance awareness |
| 8 | Curry function | < 2 min | FP knowledge |

**HOW TO DRILL:**
```
1. Open new file: drills/tonight-js-round1.js
2. Set phone timer
3. Type debounce from memory → run with node
4. If stuck > 30s → peek at solution → close → type again
5. Move to next. Don't polish. Speed > perfection.
6. After all 8 → do Round 2 in drills/tonight-js-round2.js (FASTER)
```

**Quick reference — the shapes you need in your fingers:**

```javascript
// DEBOUNCE — returns a function that delays execution
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// THROTTLE — runs at most once per interval
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// PROMISE.ALL
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resolved = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          if (++resolved === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}

// FLATTEN
function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

// DEEP CLONE
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

// EVENT EMITTER
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, cb) {
    (this.events[event] ??= []).push(cb);
    return this;
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(cb => cb(...args));
  }
  off(event, cb) {
    this.events[event] = (this.events[event] || []).filter(fn => fn !== cb);
  }
}

// MEMOIZE
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// CURRY
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried(...args, ...more);
  };
}
```

**⏱️ After Round 2, you should type debounce in < 30s. If not, do Round 3.**

---

### BLOCK 1B: GOLANG SPEED ROUND (inside Block 1 — last 15 min)

> Swap the last 15 min of Block 1 for Go if JS drills feel solid.

**Type these 4 from memory in a single main.go file:**

```go
// 1. WORKER POOL — the #1 Go interview pattern
func workerPool(jobs <-chan int, results chan<- int, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2
            }
        }()
    }
    wg.Wait()
    close(results)
}

// 2. HTTP HANDLER WITH JSON — fullstack essential
func getUser(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id") // Go 1.22+
    user := User{ID: id, Name: "Tijo"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// 3. MIDDLEWARE PATTERN
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// 4. GRACEFUL SHUTDOWN
quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
<-quit
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
srv.Shutdown(ctx)
```

**Run it: `go run main.go` — if it compiles, move on.**

---

### BLOCK 2: REACT HANDS-ON — BUILD 4 COMPONENTS (12:00 AM → 1:30 AM) — 1.5 hrs

> These are the 4 most asked React hands-on in L2 interviews. Build each from scratch.
> Use VS Code. Create a fresh React project or use your existing one.

**Setup (5 min):**
```bash
# Use an existing React project or create one
npx create-vite@latest tonight-drill --template react-ts
cd tonight-drill && npm install
npm run dev
```

---

#### DRILL R-1: Debounced Search with API (25 min)

> **THE most common React L2 question.** Build this cold.

```
WHAT TO BUILD:
- Input field
- Debounce the input (300ms)
- Fetch from a public API (use https://jsonplaceholder.typicode.com/users?q=)
- Show loading spinner while fetching
- Show results as a list
- AbortController to cancel stale requests
- Handle empty state + error state

SENIOR TOUCHES (mention these while coding):
- AbortController cleanup in useEffect
- encodeURIComponent on query
- Debounce as a custom hook, not inline
```

**Build it. Run it. Then DELETE it. Build again FASTER.**

---

#### DRILL R-2: Todo App with useReducer + TypeScript (25 min)

> Shows state management depth. useReducer > useState for complex state.

```
WHAT TO BUILD:
- Add todo (input + form submit)
- Toggle complete
- Delete todo
- Filter: All / Active / Completed
- useReducer with typed actions (discriminated union)
- Todo type: { id: string; text: string; completed: boolean }

THE TS ANGLE (this is what makes it senior):
- type Action = { type: 'ADD'; text: string } | { type: 'TOGGLE'; id: string } | { type: 'DELETE'; id: string }
- type FilterType = 'all' | 'active' | 'completed'
- Reducer fully typed
```

---

#### DRILL R-3: Data Table with Sort + Filter + Pagination (25 min)

> This is the "can you build a real feature" test.

```
WHAT TO BUILD:
- Array of objects (users/products — hardcode 20+ items)
- Column headers clickable for sort (asc/desc toggle)
- Text filter input that filters across all fields
- Pagination: 5 items per page, prev/next buttons, page number display
- useMemo for filtered + sorted + paginated data

SENIOR TOUCHES:
- Generic table component: <DataTable<T> data={[]} columns={[]} />
- Sort indicator (▲/▼) on active column
- Debounce the filter input
```

---

#### DRILL R-4: Multi-Step Form with Validation (15 min)

> KYC-relevant. You've actually built this. Show it.

```
WHAT TO BUILD:
- 3 steps: Personal Info → Address → Review & Submit
- Next/Back navigation
- Validation per step (don't let them proceed without valid data)
- Review step shows all entered data
- Submit button on final step
- Progress indicator (Step 1 of 3)

SENIOR TOUCHES:
- State persisted across steps (not lost on back/next)
- Generic step config pattern (your KYC pattern!)
- Typed form state
```

---

### BLOCK 3: TYPESCRIPT SPEED DRILL (1:30 AM → 2:15 AM) — 45 min

> They WILL ask TS questions. Type these from memory.

**Do in order, in a single .ts file:**

```typescript
// 1. Implement Pick<T, K> (2 min)
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 2. Implement Omit<T, K> (2 min)
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

// 3. Implement Readonly<T> (1 min)
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

// 4. Implement DeepReadonly<T> (3 min)
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

// 5. Implement ReturnType<T> (2 min)
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never

// 6. Discriminated Union — API Response (3 min)
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function handleResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case 'loading': return 'Loading...';
    case 'success': return res.data;    // TS knows `data` exists
    case 'error':   return res.error;   // TS knows `error` exists
  }
}

// 7. Generic fetch wrapper (3 min)
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// 8. Generic React component with constraints (3 min)
interface HasId { id: string | number }

function List<T extends HasId>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

// 9. Branded types (2 min)
type UserId = string & { __brand: 'UserId' }
type OrderId = string & { __brand: 'OrderId' }

function createUserId(id: string): UserId { return id as UserId }
function getUser(id: UserId) { /* can't accidentally pass OrderId */ }

// 10. Record + mapped type (2 min)
type FormFields = 'name' | 'email' | 'phone'
type FormState = Record<FormFields, string>
type FormErrors = Partial<Record<FormFields, string>>
```

**DRILL METHOD:** Type all 10 → delete file → type again. Target: all 10 in < 15 min.

---

### BLOCK 4: OUTPUT PREDICTION + VERBAL (2:15 AM → 3:00 AM) — 45 min

> **20 min: Output prediction on paper/notepad — no running code**

Write the output BEFORE running. Then check.

```javascript
// 1. Event loop
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Answer: 1, 4, 3, 2

// 2. Closure trap
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Answer: 3, 3, 3 (var is function-scoped)

// 3. Fix with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Answer: 0, 1, 2 (let is block-scoped)

// 4. this keyword
const obj = {
  name: 'Tijo',
  greet: function() { console.log(this.name); },
  greetArrow: () => { console.log(this.name); },
};
obj.greet();       // 'Tijo'
obj.greetArrow();  // undefined (arrow uses outer this)
const fn = obj.greet;
fn();              // undefined (lost context)

// 5. Promise chain
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { throw new Error('fail'); })
  .then(x => console.log('then:', x))
  .catch(e => console.log('catch:', e.message))
  .then(() => console.log('after catch'));
// Answer: catch: fail, after catch

// 6. async/await
async function foo() {
  console.log('1');
  const x = await Promise.resolve('2');
  console.log(x);
  console.log('3');
}
console.log('A');
foo();
console.log('B');
// Answer: A, 1, B, 2, 3
```

**Do 10 more from your OP1–OP30 list. Write on paper. Then verify.**

---

> **25 min: VERBAL DRILL — say out loud, time yourself**

| # | Topic | Say it in 60s | Key phrases to hit |
|---|-------|---------------|--------------------|
| 1 | React Fiber | "Replaced stack reconciler. Linked list of fiber nodes. Rendering is incremental, pausable. Priority-based scheduling. Powers useTransition, Suspense." |
| 2 | How useEffect cleanup works | "Return function runs before next effect and on unmount. Critical for: abort controllers, subscriptions, timers. Prevents memory leaks." |
| 3 | Closure | "Function + its birth scope. Even after outer function returns, inner function remembers variables. Used for: debounce, memoize, privacy, once()." |
| 4 | Event loop | "Single thread. Call stack → microtasks (Promise.then, queueMicrotask) → macrotasks (setTimeout, setInterval). Microtasks always drain first." |
| 5 | useMemo vs useCallback vs React.memo | "useMemo caches a VALUE. useCallback caches a FUNCTION reference. React.memo wraps a COMPONENT to skip re-render if props unchanged. Different levels." |
| 6 | How would you optimize a slow React app | "1) Profile with DevTools. 2) Find unnecessary re-renders. 3) React.memo expensive children. 4) Move state down. 5) Virtualize long lists. 6) Code split with lazy/Suspense." |
| 7 | Concurrent users handling | YOUR STORY from L2-DEEPDIVE-PREP — optimistic locking, idempotency keys, queue for critical ops |
| 8 | Hotfix process | Severity → branch from prod → smallest fix → test → peer review → deploy → monitor → postmortem |

**THEN: SLEEP. Set alarm for 9:30 AM.**

---

## ⏰ MORNING: 10 AM → 2 PM (4 hrs)

---

### BLOCK 5: REACT REBUILD — SPEED RUN (10:00 AM → 11:30 AM) — 1.5 hrs

> Rebuild last night's 4 components. This time FASTER. Delete, rebuild, time yourself.

| # | Component | Tonight time | Morning target |
|---|-----------|-------------|----------------|
| 1 | Debounced Search | ~25 min | **< 12 min** |
| 2 | Todo with useReducer + TS | ~25 min | **< 12 min** |
| 3 | Data Table (sort/filter/page) | ~25 min | **< 15 min** |
| 4 | Multi-Step Form | ~15 min | **< 10 min** |

**If you can build Debounced Search in < 12 min with AbortController + loading + error, you WILL impress.**

---

### BLOCK 6: GO FULLSTACK + DB DEEP DIVE (11:30 AM → 12:30 PM) — 1 hr

> They know you do Go + it's a fullstack lead role. DB + API design WILL come.

**Part A: Go Concurrency — Type from memory (15 min)**

```
1. Worker Pool (goroutines + channels + WaitGroup)        — 5 min
2. HTTP handler with middleware chain (auth + logging)     — 5 min
3. Graceful shutdown (signal.Notify + srv.Shutdown)        — 5 min
```

**Part B: Go + Database Patterns — Know these cold (15 min verbal)**

```go
// PATTERN 1: Repository pattern (clean architecture)
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
}

// Postgres implementation
type PostgresUserRepo struct { db *sql.DB }

func (r *PostgresUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    var u User
    err := r.db.QueryRowContext(ctx,
        "SELECT id, name, email, created_at FROM users WHERE id = $1", id,
    ).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)
    if err == sql.ErrNoRows {
        return nil, ErrNotFound
    }
    return &u, err
}

// PATTERN 2: Transaction handling
func (r *PostgresUserRepo) TransferFunds(ctx context.Context, from, to string, amount int) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil { return err }
    defer tx.Rollback() // no-op if committed

    _, err = tx.ExecContext(ctx,
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, from)
    if err != nil { return err }

    _, err = tx.ExecContext(ctx,
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, to)
    if err != nil { return err }

    return tx.Commit()
}

// PATTERN 3: Connection pooling
db, err := sql.Open("postgres", connStr)
db.SetMaxOpenConns(25)              // max active connections
db.SetMaxIdleConns(5)               // keep 5 ready
db.SetConnMaxLifetime(5 * time.Minute) // recycle stale connections
```

**Part C: Database Knowledge — Verbal prep (15 min out loud)**

| Topic | What to say (60s each) |
|-------|----------------------|
| **SQL vs NoSQL** | "SQL for relational data with ACID guarantees — PostgreSQL is my default. NoSQL (MongoDB) when schema is truly dynamic or document-oriented. Most apps should start with SQL." |
| **Indexing** | "B-tree index on columns in WHERE/JOIN/ORDER BY. Composite index for multi-column queries — leftmost prefix rule. EXPLAIN ANALYZE to verify index usage. Don't over-index — every index slows writes." |
| **N+1 Problem** | "Fetching a list then querying each item individually. Fix: JOIN or subquery to batch. In ORMs: eager loading. Example: 100 users → 100 queries for their orders → instead: JOIN users on orders WHERE user_id IN (...)." |
| **Transactions & ACID** | "Atomicity: all-or-nothing. Consistency: constraints enforced. Isolation: concurrent txns don't interfere. Durability: committed = persisted. Use BEGIN/COMMIT/ROLLBACK. In Go: `db.BeginTx` + defer Rollback." |
| **Optimistic vs Pessimistic Locking** | "Optimistic: version column, check on UPDATE, retry on conflict — for low contention. Pessimistic: SELECT FOR UPDATE, holds row lock — for high contention like payments." |
| **Connection Pooling** | "Reuse DB connections instead of creating per request. In Go: `sql.DB` is already a pool. Set MaxOpenConns (25), MaxIdleConns (5), ConnMaxLifetime (5 min). Prevents connection exhaustion under load." |
| **Migration Strategy** | "Version-controlled SQL files. Tools: golang-migrate, goose. Up/down for each migration. Run in CI before deploy. Never modify a deployed migration — create a new one." |

**Part D: REST API Design — Know these instantly (15 min verbal)**

```
ENDPOINT DESIGN:
  GET    /api/v1/users          → list (with pagination, filtering)
  GET    /api/v1/users/:id      → get one
  POST   /api/v1/users          → create
  PUT    /api/v1/users/:id      → full update
  PATCH  /api/v1/users/:id      → partial update
  DELETE /api/v1/users/:id      → delete

PAGINATION:
  GET /api/v1/users?page=2&limit=20&sort=created_at&order=desc
  Response: { data: [...], meta: { total: 100, page: 2, limit: 20, pages: 5 } }

  Cursor-based (better for large datasets):
  GET /api/v1/users?cursor=eyJpZCI6MTAwfQ&limit=20
  Response: { data: [...], meta: { nextCursor: "eyJpZCI6MTIwfQ", hasMore: true } }

STATUS CODES (know these cold):
  200 OK          → GET success, PATCH success
  201 Created     → POST success (+ Location header)
  204 No Content  → DELETE success
  400 Bad Request → validation error (return field errors)
  401 Unauthorized→ not authenticated
  403 Forbidden   → authenticated but not authorized
  404 Not Found   → resource doesn't exist
  409 Conflict    → optimistic lock conflict, duplicate
  422 Unprocessable→ valid JSON but business rule violated
  429 Too Many    → rate limited
  500 Internal    → server error (never expose details)

ERROR RESPONSE FORMAT:
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": [
        { "field": "email", "message": "must be a valid email" }
      ]
    }
  }
```

**Go Full API Handler — the pattern they want to see:**

```go
// Handler → validates → calls service → returns JSON
func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        respondError(w, http.StatusBadRequest, "invalid JSON")
        return
    }

    // Validate
    if req.Name == "" || req.Email == "" {
        respondError(w, http.StatusBadRequest, "name and email required")
        return
    }

    // Service layer handles business logic
    user, err := h.service.CreateUser(r.Context(), req)
    if err != nil {
        if errors.Is(err, ErrDuplicate) {
            respondError(w, http.StatusConflict, "email already exists")
            return
        }
        respondError(w, http.StatusInternalServerError, "internal error")
        return
    }

    respondJSON(w, http.StatusCreated, user)
}

// Helpers
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, message string) {
    respondJSON(w, status, map[string]string{"error": message})
}
```

---

### BLOCK 6B: SYSTEM DESIGN + LLD (12:30 PM → 1:15 PM) — 45 min

> Not a deep grilling round, but they MAY ask "how would you design X" to test lead thinking.

---

#### SYSTEM DESIGN — The 5-min Framework (practice once out loud)

```
STEP 1: CLARIFY (1 min)
  → "Before I design, let me confirm requirements..."
  → Functional: what does the user do?
  → Non-functional: scale, latency, consistency, availability?
  → Constraints: team size, timeline, existing infra?

STEP 2: HIGH-LEVEL ARCHITECTURE (2 min)
  → Draw boxes: Client → API Gateway/BFF → Services → DB/Cache
  → Identify: what's sync vs async?
  → Identify: what needs real-time?

STEP 3: DEEP DIVE ON ONE AREA (2 min)
  → They'll ask you to go deeper on one part
  → Be ready to discuss: DB schema, API contracts, caching, error handling

STEP 4: TRADE-OFFS (ongoing)
  → Always say WHY you chose something over alternatives
  → "I'd use PostgreSQL here because... but if we needed X, MongoDB would..."
```

---

#### LLD SCENARIOS — Practice These 3 Out Loud (15 min each)

**SCENARIO 1: "Design a Task Management API" (most likely for fullstack lead)**

```
ENTITIES:
  User    { id, name, email, role }
  Task    { id, title, description, status, priority, assignee_id, created_by, version, created_at, updated_at }
  Comment { id, task_id, user_id, content, created_at }

DB SCHEMA (PostgreSQL):
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done')),
    priority INTEGER DEFAULT 0,
    assignee_id UUID REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    version INTEGER DEFAULT 1,  -- optimistic locking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
  CREATE INDEX idx_tasks_status ON tasks(status);

API ENDPOINTS:
  POST   /api/v1/tasks                    → create task
  GET    /api/v1/tasks?status=todo&page=1  → list with filters
  GET    /api/v1/tasks/:id                 → get task
  PATCH  /api/v1/tasks/:id                 → update (with version check)
  DELETE /api/v1/tasks/:id                 → soft delete
  POST   /api/v1/tasks/:id/comments        → add comment
  GET    /api/v1/tasks/:id/comments        → list comments

GO ARCHITECTURE:
  cmd/server/main.go        → entry point, wire dependencies
  internal/handler/          → HTTP handlers (parse request, call service, return response)
  internal/service/          → business logic (validation, authorization, orchestration)
  internal/repository/       → database queries (SQL, no business logic)
  internal/middleware/        → auth, logging, rate limiting
  internal/model/            → structs (User, Task, Comment)

CONCURRENT USERS ANGLE (they asked in L1!):
  → Optimistic locking: PATCH /tasks/:id sends version in body
  → UPDATE tasks SET ... WHERE id = $1 AND version = $2
  → If 0 rows affected → 409 Conflict → client refreshes and retries
```

**SCENARIO 2: "Design a Notification System"**

```
COMPONENTS:
  → Producer: any service emits events (task assigned, comment added)
  → Queue: RabbitMQ / SQS → decouple producer from sender
  → Consumer: notification workers read from queue
  → Channels: email, in-app, push, Slack

FLOW:
  User assigns task → API → publishes to queue → workers pick up → send via channels

DB:
  notifications { id, user_id, type, title, body, channel, status, read_at, created_at }

WHY QUEUE:
  → Decouples: API responds fast, notification sent async
  → Retry: if email fails, message stays in queue
  → Scale: add more workers under load

IN-APP NOTIFICATIONS (React):
  → WebSocket or SSE for real-time
  → Bell icon with unread count
  → Mark as read: PATCH /notifications/:id { read: true }
  → Polling fallback: GET /notifications?unread=true every 30s
```

**SCENARIO 3: "Design an Auth System" (fullstack lead must-know)**

```
FLOW:
  Signup → hash password (bcrypt) → store user → return tokens
  Login  → verify password → issue access + refresh JWT → set httpOnly cookies
  Auth   → middleware validates JWT on every request → injects user in context
  Refresh→ access expired → refresh endpoint → new access token
  Logout → clear cookies → optionally blacklist refresh token

TOKEN STRATEGY:
  Access token:  15 min TTL, in httpOnly cookie, contains { userId, role }
  Refresh token: 7 day TTL, in separate httpOnly cookie, scoped to /api/refresh

DB:
  users { id, name, email, password_hash, role, created_at }
  refresh_tokens { id, user_id, token_hash, expires_at, revoked }

SECURITY LAYERS:
  → bcrypt cost 12 for passwords
  → JWT: verify signing algo (block alg:none attack)
  → Rate limit /login to 5 attempts/min per IP
  → Refresh token rotation: issue new refresh on use, revoke old
  → CSRF: SameSite=Strict cookies
```

---

#### SYSTEM DESIGN RAPID-FIRE — If They Quick-Ask (5 min verbal)

| Question | 30-second answer |
|----------|-----------------|
| "SQL vs NoSQL?" | "SQL (PostgreSQL) by default — ACID, relations, mature. NoSQL when schema is truly flexible (CMS content), or massive write throughput (logs, analytics). Most apps don't need NoSQL." |
| "How do you scale a backend?" | "Horizontal: stateless servers behind load balancer. Cache hot data in Redis. DB: read replicas for reads, connection pooling. Async heavy work via queues. CDN for static assets." |
| "Monolith vs microservices?" | "Start monolith. Split when you have clear domain boundaries AND team size justifies it. Microservices add network complexity, deployment complexity, data consistency challenges. Don't split prematurely." |
| "How do you handle caching?" | "Cache-aside pattern: check Redis → miss → query DB → write to Redis with TTL. Invalidate on writes. For APIs: HTTP cache headers (ETag, Cache-Control). React Query handles client-side caching." |
| "WebSocket vs SSE vs polling?" | "WebSocket: bidirectional, complex (reconnection). SSE: server-push only, simpler, auto-reconnect. Polling: simplest, okay for 30s intervals. I'd use SSE for notifications, WebSocket for chat, polling for dashboards." |
| "How do you handle migrations?" | "Version-controlled SQL files. golang-migrate or goose. Up + down for each. Run in CI. Never edit deployed migrations. For zero-downtime: additive-only changes, then backfill, then remove old columns." |
| "Message queue use cases?" | "Email sending, PDF generation, image processing, notifications — anything that's slow and doesn't need sync response. Decouple producer from consumer. Built-in retry and dead-letter queues." |
| "Redis use cases?" | "Session store, cache, rate limiting counters, pub/sub for real-time, leaderboards (sorted sets), distributed locks (SETNX). NOT for primary data store — it's in-memory, volatile by default." |
| "How do you monitor production?" | "Structured logging (JSON, with request_id, user_id). APM for latency (Datadog, New Relic). Alerts on: error rate spike, p99 latency, 5xx count. Dashboards for: request volume, DB connections, memory/CPU." |
| "Zero-downtime deployment?" | "Blue-green or rolling deployment. DB migrations must be backward-compatible. Feature flags for new features. Health checks for readiness. Drain connections before shutdown (graceful shutdown in Go)." |

---

### BLOCK 7: SCENARIO DEEP DIVE (already covered above, merge remaining) (1:15 PM → 1:45 PM) — 30 min

> They'll give you a scenario. Practice answering these OUT LOUD.

**Scenario 1: "Design a task management app" (10 min)**
```
TALK THROUGH:
→ Client: React + TS, component structure, state management
→ API: REST endpoints (CRUD), auth middleware
→ Backend: Go, handler → service → repo layers
→ DB: PostgreSQL, task table with user_id + status + version (optimistic lock)
→ Real-time: WebSocket or polling for updates
→ Mention: pagination, error handling, auth, rate limiting
```

**Scenario 2: "You have a performance issue in production" (10 min)**
```
TALK THROUGH:
→ Identify: monitoring/APM (which endpoint is slow?)
→ Frontend: React DevTools profiler, bundle size check, network waterfall
→ Backend: query analysis (EXPLAIN), N+1 queries, missing indexes
→ Fix: add index, cache hot data in Redis, paginate, code split
→ Verify: load test before/after
→ Prevent: performance budgets in CI, lighthouse scores
```

**Scenario 3: "How do you handle state management in a large React app?" (10 min)**
```
TALK THROUGH:
→ Local state first (useState) — don't over-engineer
→ Lift state when siblings need it
→ Context for low-frequency global (theme, auth, locale)
→ Zustand/Redux for high-frequency shared state
→ TanStack Query for server state (caching, refetch, stale)
→ NEVER put everything in global state
→ Your KYC example: form wizard state local, auth context global
```

**Scenario 4: "Code review — what's wrong with this code?" (10 min)**
```
Practice spotting:
→ Missing error handling in async code
→ useEffect without cleanup / missing deps
→ Direct DOM manipulation in React
→ State mutations (push instead of spread)
→ Missing keys in list rendering
→ Business logic in components instead of hooks
→ API keys in frontend code
→ No TypeScript types (using `any`)
```

**Practice each for 10 min: set a timer, answer OUT LOUD as if you're in the interview.**

---

### BLOCK 8: FINAL WARM-UP (1:15 PM → 2:00 PM) — 45 min

**Speed-type round — ALL from memory, no peeking (30 min):**

```
1. debounce           → < 30s
2. throttle           → < 30s
3. Promise.all        → < 90s
4. Event emitter      → < 90s
5. useDebounce hook   → < 60s
6. useFetch hook      → < 60s
7. MyPick<T,K>        → < 30s
8. Discriminated union→ < 60s
```

If you can type all 8 from memory → **you're ready.**

**Final verbal check (15 min):**
```
□ Explain Fiber in 60s
□ Explain closures in 30s
□ Explain your concurrent users story in 90s
□ Explain your hotfix process in 60s
□ Explain your state management strategy in 60s
□ "Tell me about yourself" → stack identity in 60s
```

---

## 🎯 PRIORITY MATRIX — IF YOU RUN OUT OF TIME

```
MUST DO (non-negotiable):
  ✅ JS: debounce, throttle, Promise.all, flatten, memoize
  ✅ React: Debounced search + Todo with useReducer
  ✅ TS: Pick, Omit, Discriminated union, Generic component
  ✅ Go: Worker pool, HTTP handler with middleware, graceful shutdown
  ✅ DB: Repository pattern, transactions, optimistic locking (verbal)
  ✅ Verbal: Fiber, closures, concurrent users story, hotfix story

SHOULD DO:
  ⚠️ React: Data table, multi-step form
  ⚠️ Go: Full API handler pattern, connection pooling
  ⚠️ DB: Indexing, N+1, ACID explanation
  ⚠️ LLD: Task management API design (entities + schema + endpoints)
  ⚠️ Sysdesign: Rapid-fire table (monolith vs micro, caching, scaling)
  ⚠️ Scenarios: Performance debugging, state management at scale

SKIP IF NEEDED:
  ⛔ Output prediction (review on phone before interview)
  ⛔ Deep clone, curry, event emitter (less likely in 45 min)
  ⛔ Notification system / auth system LLD (good to know, not priority)
  ⛔ Bitwise, cipher drills (won't come up at Techversant)
```

---

## 🕐 TIMELINE SUMMARY

```
TONIGHT:
  11:00 PM → 12:00 AM   Block 1:  JS core speed (8 drills × 2) + Go patterns (last 15 min)
  12:00 AM →  1:30 AM   Block 2:  React hands-on (4 components from scratch)
   1:30 AM →  2:15 AM   Block 3:  TypeScript speed drill (10 type challenges)
   2:15 AM →  3:00 AM   Block 4:  Output prediction + verbal drill
   3:00 AM              SLEEP 💤

MORNING:
  10:00 AM → 11:30 AM   Block 5:  React rebuild speed run (same 4, FASTER)
  11:30 AM → 12:30 PM   Block 6:  Go fullstack + DB + REST API (code + verbal)
  12:30 PM →  1:15 PM   Block 6B: System design + LLD scenarios (verbal)
   1:15 PM →  1:45 PM   Block 7:  Scenario deep dive (perf, state mgmt, code review)
   1:45 PM →  2:15 PM   Block 8:  Final warm-up (speed type + verbal check)
   2:15 PM →  2:25 PM   Shower, water, quiet. Skim L2-DEEPDIVE-PREP.md Parts 2+3.
   2:30 PM              🔥 INTERVIEW — Mr. Arun Antony — Google Meet
```

---

## 🧠 INTERVIEW MINDSET

- You CLEARED L1. They already liked you. This is confirmation.
- Think out loud while coding. Show your thought process.
- Start simple → make it work → then improve. Don't over-engineer.
- If stuck: "Let me think about this for a moment" → take 10 seconds → continue.
- Ask clarifying questions. It shows senior thinking.
- Your KYC system is your weapon. Bring it into every answer naturally.

---

> **You have 8 hours. That's enough to sharpen every blade you need.
> Don't study. DRILL. Type code. Run code. Delete. Repeat.
> The muscle memory you build tonight is what shows up tomorrow at 2:30. 💪🔥**
