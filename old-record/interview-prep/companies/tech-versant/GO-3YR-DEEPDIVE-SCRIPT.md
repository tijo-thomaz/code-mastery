# 🚀 Go 3-Year Dev — Core Deep Dive Script

> **Speed read. 20 minutes. Say out loud. Done.**

---

## 1. SLICE INTERNALS (THEY WILL ASK)

```go
// Slice = 3 fields: pointer + length + capacity
type slice struct {
    array unsafe.Pointer  // ptr to underlying array
    len   int
    cap   int
}
```

**Gotcha 1 — shared underlying array:**
```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]         // b = [2, 3], shares same array
b[0] = 99           // a is now [1, 99, 3, 4, 5] — MUTATED!
```

**Gotcha 2 — append can break sharing:**
```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]          // b = [2, 3], len=2, cap=4
b = append(b, 99)    // fits in cap → a[3] becomes 99! a = [1, 2, 3, 99, 5]
b = append(b, 88)    // fits in cap → a[4] becomes 88!
b = append(b, 77)    // EXCEEDS cap → NEW array allocated → a is safe now
```

**Gotcha 3 — prevent mutation with full slice expression:**
```go
b := a[1:3:3]        // [low:high:max] → cap = max - low = 0 remaining
b = append(b, 99)    // cap exceeded → new array → a untouched ✅
```

**Gotcha 4 — nil vs empty slice:**
```go
var s []int           // nil slice: s == nil, len=0, cap=0
s2 := []int{}         // empty slice: s2 != nil, len=0, cap=0
s3 := make([]int, 0)  // empty slice: s3 != nil, len=0, cap=0
// json.Marshal: nil → "null", empty → "[]"
```

**Gotcha 5 — growth strategy:**
```go
// cap < 256: doubles (2x)
// cap >= 256: grows by ~25% + some extra
// Pre-allocate when you know size:
s := make([]int, 0, 1000)  // len=0, cap=1000 — zero allocs during fill
```

**SAY THIS:**
> "A slice is a pointer, length, and capacity over an underlying array. The big gotcha is shared backing arrays — two slices can point to the same memory, so mutating one affects the other. Append only allocates a new array when capacity is exceeded. I pre-allocate with make when I know the size to avoid repeated allocations."

---

## 2. STRUCT DEEP DIVE

**Memory layout & padding:**
```go
// ❌ BAD — wasted memory due to alignment padding
type Bad struct {
    a bool    // 1 byte + 7 padding
    b int64   // 8 bytes
    c bool    // 1 byte + 7 padding
}             // Total: 24 bytes

// ✅ GOOD — ordered by size descending
type Good struct {
    b int64   // 8 bytes
    a bool    // 1 byte
    c bool    // 1 byte + 6 padding
}             // Total: 16 bytes — saved 8 bytes per struct
```

**Embedding (composition over inheritance):**
```go
type Base struct {
    ID        string
    CreatedAt time.Time
}

type User struct {
    Base              // embedded — User "inherits" ID, CreatedAt
    Name  string
    Email string
}

u := User{
    Base: Base{ID: "1", CreatedAt: time.Now()},
    Name: "Tijo",
}
fmt.Println(u.ID)        // promoted — access directly
fmt.Println(u.Base.ID)   // also works
```

**Struct tags:**
```go
type User struct {
    ID    string `json:"id" db:"user_id" validate:"required"`
    Name  string `json:"name" validate:"required,min=2"`
    Email string `json:"email" validate:"required,email"`
    Pass  string `json:"-"`  // NEVER serialize password
}
```

**Value vs pointer semantics:**
```go
// Value — copies the struct (safe, no mutation)
func (u User) FullName() string { return u.Name }

// Pointer — mutates the original (or struct is large)
func (u *User) SetName(n string) { u.Name = n }

// Rule: if ANY method uses pointer receiver, ALL should
```

**SAY THIS:**
> "Go uses composition via embedding instead of inheritance. I order struct fields by size for memory alignment. Value receivers for reads, pointer receivers for mutations or large structs. Struct tags drive JSON serialization, DB mapping, and validation — and I always use json:\"-\" for sensitive fields."

---

## 3. WORKER POOL (WILL 100% BE ASKED)

```go
func workerPool(jobs []Job, numWorkers int) []Result {
    jobsCh := make(chan Job, len(jobs))
    resultsCh := make(chan Result, len(jobs))

    // Start workers
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobsCh {      // blocks until job available
                result := process(job)      // do the work
                resultsCh <- result         // send result
            }
        }(i)
    }

    // Send jobs
    for _, job := range jobs {
        jobsCh <- job
    }
    close(jobsCh)   // signal no more jobs → workers exit range loop

    // Wait for all workers, then close results
    go func() {
        wg.Wait()
        close(resultsCh)
    }()

    // Collect results
    var results []Result
    for r := range resultsCh {
        results = append(results, r)
    }
    return results
}
```

**With context cancellation:**
```go
func workerPoolWithContext(ctx context.Context, jobs []Job, numWorkers int) []Result {
    jobsCh := make(chan Job, len(jobs))
    resultsCh := make(chan Result, len(jobs))

    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case job, ok := <-jobsCh:
                    if !ok { return }        // channel closed
                    result := process(job)
                    resultsCh <- result
                case <-ctx.Done():           // cancelled/timeout
                    return
                }
            }
        }()
    }

    // Send jobs (respect cancellation)
    go func() {
        defer close(jobsCh)
        for _, job := range jobs {
            select {
            case jobsCh <- job:
            case <-ctx.Done():
                return
            }
        }
    }()

    go func() { wg.Wait(); close(resultsCh) }()

    var results []Result
    for r := range resultsCh {
        results = append(results, r)
    }
    return results
}
```

**KYC example:**
```go
// Concurrent verification — run ID check, address check, sanctions check in parallel
func verifyUser(ctx context.Context, user User) (*VerificationResult, error) {
    ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
    defer cancel()

    type checkResult struct {
        name string
        pass bool
        err  error
    }

    results := make(chan checkResult, 3)

    go func() { pass, err := checkID(ctx, user); results <- checkResult{"id", pass, err} }()
    go func() { pass, err := checkAddress(ctx, user); results <- checkResult{"address", pass, err} }()
    go func() { pass, err := checkSanctions(ctx, user); results <- checkResult{"sanctions", pass, err} }()

    var failed []string
    for i := 0; i < 3; i++ {
        r := <-results
        if r.err != nil { return nil, fmt.Errorf("%s check failed: %w", r.name, r.err) }
        if !r.pass { failed = append(failed, r.name) }
    }

    return &VerificationResult{Passed: len(failed) == 0, Failed: failed}, nil
}
```

**Complete runnable example with process functions:**
```go
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Job struct {
	ID    int
	Input string
}

type Result struct {
	JobID  int
	Output string
	Err    error
}

// process — the actual work each worker does
func process(job Job) Result {
	// Simulate variable processing time
	time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)

	// Simulate occasional failure
	if rand.Float32() < 0.1 {
		return Result{JobID: job.ID, Err: fmt.Errorf("job %d failed: transient error", job.ID)}
	}

	return Result{
		JobID:  job.ID,
		Output: fmt.Sprintf("processed-%s", job.Input),
	}
}

func workerPool(jobs []Job, numWorkers int) []Result {
	jobsCh := make(chan Job, len(jobs))
	resultsCh := make(chan Result, len(jobs))

	var wg sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for job := range jobsCh {
				fmt.Printf("worker %d: processing job %d\n", workerID, job.ID)
				resultsCh <- process(job)
			}
		}(i)
	}

	for _, job := range jobs {
		jobsCh <- job
	}
	close(jobsCh)

	go func() {
		wg.Wait()
		close(resultsCh)
	}()

	var results []Result
	for r := range resultsCh {
		results = append(results, r)
	}
	return results
}

func main() {
	jobs := make([]Job, 20)
	for i := range jobs {
		jobs[i] = Job{ID: i + 1, Input: fmt.Sprintf("item-%d", i+1)}
	}

	results := workerPool(jobs, 5)

	var succeeded, failed int
	for _, r := range results {
		if r.Err != nil {
			fmt.Printf("❌ Job %d: %v\n", r.JobID, r.Err)
			failed++
		} else {
			fmt.Printf("✅ Job %d: %s\n", r.JobID, r.Output)
			succeeded++
		}
	}
	fmt.Printf("\nTotal: %d succeeded, %d failed\n", succeeded, failed)
}
```

**SAY THIS:**
> "Worker pool: N goroutines reading from a buffered job channel. WaitGroup tracks completion. Close the job channel to signal done — workers exit the range loop. A separate goroutine waits for all workers then closes the results channel. In the KYC system, I used this for concurrent verification — ID, address, and sanctions checks ran in parallel with a 10-second context timeout."

---

## 4. GOROUTINE LIFECYCLE & LEAKS

```go
// ❌ LEAK — goroutine blocks forever
func leak() {
    ch := make(chan int)
    go func() {
        val := <-ch     // blocks forever — nobody sends
        fmt.Println(val)
    }()
    // function returns, goroutine is stuck
}

// ✅ FIX — use context
func noLeak(ctx context.Context) {
    ch := make(chan int)
    go func() {
        select {
        case val := <-ch:
            fmt.Println(val)
        case <-ctx.Done():    // parent cancelled → goroutine exits
            return
        }
    }()
}

// Detect leaks
fmt.Println(runtime.NumGoroutine())  // should stay stable over time
// Use pprof in production: /debug/pprof/goroutine
```

---

## 5. CONTEXT — THE GLUE

```go
// Timeout — auto-cancel after duration
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()  // ALWAYS defer cancel to release resources

// Deadline — cancel at specific time
ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(30*time.Second))

// Manual cancel
ctx, cancel := context.WithCancel(context.Background())
// call cancel() when done

// Values (use sparingly — for request-scoped data like requestID, userID)
ctx = context.WithValue(ctx, "requestID", uuid.New())
reqID := ctx.Value("requestID").(string)

// Pass context as FIRST param, always
func GetUser(ctx context.Context, id string) (*User, error) {
    // Use ctx in DB calls, HTTP calls — they respect cancellation
    row := db.QueryRowContext(ctx, "SELECT ...", id)
}
```

---

## 6. ERROR HANDLING — PRODUCTION PATTERNS

```go
// Custom error types
type NotFoundError struct {
    Resource string
    ID       string
}
func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s with id %s not found", e.Resource, e.ID)
}

// Wrap with context
user, err := repo.FindByID(ctx, id)
if err != nil {
    return fmt.Errorf("getUserProfile: %w", err)  // %w wraps for Is/As
}

// Check specific errors
if errors.Is(err, sql.ErrNoRows) {
    return &NotFoundError{Resource: "user", ID: id}
}

// Type assert
var notFound *NotFoundError
if errors.As(err, &notFound) {
    // handle not found specifically
    http.Error(w, notFound.Error(), 404)
}

// Sentinel errors
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrConflict     = errors.New("conflict")
)
```

---

## 7. INTERFACES — GO'S SUPERPOWER

```go
// Small interfaces — Go way
type Reader interface { Read(p []byte) (int, error) }
type Writer interface { Write(p []byte) (int, error) }
type Closer interface { Close() error }
type ReadWriteCloser interface { Reader; Writer; Closer }

// Implicit satisfaction — no "implements" keyword
type MyFile struct{}
func (f *MyFile) Read(p []byte) (int, error) { /* ... */ }
func (f *MyFile) Write(p []byte) (int, error) { /* ... */ }
func (f *MyFile) Close() error { /* ... */ }
// MyFile automatically satisfies ReadWriteCloser

// Compile-time interface check
var _ ReadWriteCloser = (*MyFile)(nil)

// Accept interfaces, return structs
func NewUserService(repo UserRepository) *UserService {  // returns concrete
    return &UserService{repo: repo}                      // accepts interface
}

// Empty interface = any type (Go 1.18+: use `any`)
func printAnything(v any) { fmt.Println(v) }

// Type switch
func describe(v any) string {
    switch val := v.(type) {
    case string:  return "string: " + val
    case int:     return fmt.Sprintf("int: %d", val)
    case error:   return "error: " + val.Error()
    default:      return "unknown"
    }
}
```

---

## 8. CONCURRENCY PRIMITIVES CHEATSHEET

```go
// Mutex — protect shared state
var mu sync.Mutex
mu.Lock()
counter++
mu.Unlock()

// RWMutex — many readers, one writer
var rw sync.RWMutex
rw.RLock()    // multiple goroutines can RLock simultaneously
data := cache[key]
rw.RUnlock()

rw.Lock()     // exclusive — blocks all readers and writers
cache[key] = value
rw.Unlock()

// WaitGroup — wait for N goroutines
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        // work
    }()
}
wg.Wait()  // blocks until all Done()

// Once — exactly one initialization
var once sync.Once
once.Do(func() {
    db = connectDB()  // runs exactly once, goroutine-safe
})

// atomic — lock-free operations
var counter int64
atomic.AddInt64(&counter, 1)
val := atomic.LoadInt64(&counter)
```

---

## 9. GENERICS (Go 1.18+ — they'll test if you're current)

```go
// Generic function
func Map[T any, R any](items []T, fn func(T) R) []R {
    result := make([]R, len(items))
    for i, item := range items {
        result[i] = fn(item)
    }
    return result
}

names := Map(users, func(u User) string { return u.Name })

// Generic with constraint
type Number interface {
    int | int64 | float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

// Generic struct
type Result[T any] struct {
    Data  T
    Error error
}
```

---

## 10. TESTING PATTERNS

```go
// Table-driven tests — non-negotiable on your teams
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}

// Mock with interface
type MockRepo struct {
    users map[string]*User
}
func (m *MockRepo) FindByID(ctx context.Context, id string) (*User, error) {
    u, ok := m.users[id]
    if !ok { return nil, ErrNotFound }
    return u, nil
}

// Test with mock
func TestGetUser(t *testing.T) {
    repo := &MockRepo{users: map[string]*User{"1": {Name: "Tijo"}}}
    svc := NewUserService(repo)
    user, err := svc.GetUser(context.Background(), "1")
    // assert...
}
```

---

## ⚡ RAPID FIRE — 30 SECONDS EACH

| Question | Answer |
|----------|--------|
| Slice vs array? | Array = fixed size, value type. Slice = pointer + len + cap over array, reference type. |
| Slice append gotcha? | Append may mutate shared backing array if cap allows. Use full slice `a[1:3:3]` to prevent. |
| nil vs empty slice? | nil marshals to "null", empty to "[]". Both have len=0. |
| Struct padding? | Order fields largest→smallest to minimize memory waste. |
| Embedding? | Composition. Promoted fields/methods. Not inheritance. |
| Worker pool? | N goroutines + job channel + WaitGroup + results channel. Close job ch to signal done. |
| Goroutine leak? | Goroutine blocks forever. Fix: context cancellation + select + ctx.Done(). |
| context.Context? | Cancellation + timeout + request-scoped values. Always first param. Always defer cancel. |
| errors.Is vs As? | Is = value comparison (sentinel). As = type assertion (custom error types). |
| sync.Once? | Run init exactly once, goroutine-safe. Use for singleton DB/logger. |
| Mutex vs RWMutex? | Mutex = exclusive. RWMutex = many readers OR one writer. Use RW for read-heavy. |
| Map concurrency? | NOT safe. Use sync.Mutex, sync.RWMutex, or sync.Map. |
| Generics? | Go 1.18+. Type params with constraints. `func Map[T any, R any]`. |
| Table-driven tests? | Slice of test cases, t.Run for each. Non-negotiable pattern. |
| Value vs pointer receiver? | Value = no mutation, small struct. Pointer = mutation or large struct. Be consistent. |
| defer order? | LIFO. Args evaluated at defer time, not execution time. |
| select with multiple ready? | Random pick. Not first, not priority — random. |
| init() function? | Runs before main. After imports + var init. Avoid overuse. |
| GC? | Concurrent tri-color mark-and-sweep. Sub-ms pauses. Tune with GOGC. |
| Why Go over Node? | Compiled, goroutines, type-safe, single binary, low memory, simple. |

---

> **You've built Go backends. You've run concurrent KYC checks. Worker pools, context cancellation, interface injection — this is YOUR daily code. Just say it out loud once and go. 💪**
