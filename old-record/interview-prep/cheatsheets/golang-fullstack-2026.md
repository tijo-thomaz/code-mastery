# 🐹 Golang Interview Prep — Theory + Hands-On (2026 Trends)

> For fullstack devs who use Go for backend. Covers what interviewers actually ask in 2025–2026.
> Read → Type the code → Explain out loud. That's the drill.

---

## PART 1: THEORY — Explain These in 60 Seconds Each

---

### 1. Goroutines vs OS Threads

```
Goroutine                          OS Thread
─────────────────────────────────────────────────
2–8 KB stack (grows dynamically)   1–8 MB fixed stack
User-space scheduling (Go runtime) Kernel scheduling
M:N model (M goroutines : N threads)  1:1 model
Create thousands cheaply           Expensive to create
Context switch: ~200ns             Context switch: ~1-2μs
```

**One-liner:** "Goroutines are lightweight user-space threads managed by Go's runtime scheduler — you can spin up thousands because they start at 2KB and the runtime multiplexes them onto OS threads."

---

### 2. Channels

```go
// Unbuffered — synchronous handoff (both sides must be ready)
ch := make(chan int)

// Buffered — async up to capacity
ch := make(chan int, 5)

// Directional
func producer(out chan<- int) { out <- 42 }  // send-only
func consumer(in <-chan int)  { v := <-in }  // receive-only

// Close signals "no more values"
close(ch)
// Range exits when channel is closed
for v := range ch { fmt.Println(v) }
```

**One-liner:** "Channels are typed, goroutine-safe pipes. Unbuffered = sync rendezvous, buffered = async queue. Sender closes, receiver ranges."

---

### 3. Error Handling Philosophy

```go
// Go way: errors are values, not exceptions
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething failed: %w", err) // wrap with context
}

// Unwrap chain
if errors.Is(err, sql.ErrNoRows) { /* handle */ }

// Type assert
var myErr *MyCustomError
if errors.As(err, &myErr) { /* handle */ }
```

**One-liner:** "Go treats errors as values returned explicitly. No try/catch — you handle at the call site. Wrap with `%w`, inspect with `errors.Is`/`errors.As`."

---

### 4. Interfaces — Implicit Satisfaction

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

// MyWriter satisfies Writer automatically — no "implements" keyword
type MyWriter struct{}
func (w MyWriter) Write(p []byte) (int, error) {
    return fmt.Print(string(p))
}

// Compile-time check
var _ Writer = (*MyWriter)(nil)
```

**One-liner:** "Go interfaces are satisfied implicitly — if your type has the methods, it satisfies the interface. Duck typing at compile time."

---

### 5. Context Package

```go
// Cancellation
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

// Timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// Usage in HTTP handler
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    select {
    case result := <-doWork(ctx):
        json.NewEncoder(w).Encode(result)
    case <-ctx.Done():
        http.Error(w, "timeout", http.StatusGatewayTimeout)
    }
}
```

**One-liner:** "Context carries cancellation, timeouts, and request-scoped values across API boundaries. Always first param. Always `defer cancel()`."

---

### 6. Slices Internals (Trap Question)

```go
// Slice header: pointer + length + capacity
s := make([]int, 3, 5)  // len=3, cap=5

// THE TRAP: sub-slices share backing array
s := []int{1, 2, 3}
t := s[:2]          // len=2, cap=3, SAME array
t = append(t, 99)   // overwrites s[2]! s is now [1, 2, 99]

// FIX: full slice expression limits capacity
t := s[:2:2]         // len=2, cap=2 → append allocates new array
```

**One-liner:** "A slice is a pointer+length+capacity header over an array. Sub-slices share the backing array — use `s[low:high:max]` to prevent mutation."

---

### 7. `defer` Mechanics

```go
func example() (result int) {
    defer func() { result++ }()  // can modify named returns
    return 0  // result becomes 0, then defer makes it 1
}
// Returns 1, not 0

// LIFO order
defer fmt.Println("first")   // prints third
defer fmt.Println("second")  // prints second
defer fmt.Println("third")   // prints first

// Args evaluated immediately
x := 10
defer fmt.Println(x)  // prints 10 even if x changes later
x = 20
```

---

### 8. `select` Statement

```go
select {
case msg := <-ch1:
    handle(msg)
case msg := <-ch2:
    handle(msg)
case ch3 <- value:
    // sent successfully
case <-ctx.Done():
    return ctx.Err()
case <-time.After(5 * time.Second):
    return errors.New("timeout")
default:
    // non-blocking — runs if no channel is ready
}
```

**Key:** If multiple cases ready → Go picks one **randomly** (not first).

---

### 9. Generics (Go 1.18+, trending in interviews)

```go
// Generic function
func Map[T any, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

// Generic with constraint
func Max[T constraints.Ordered](a, b T) T {
    if a > b { return a }
    return b
}

// Generic struct
type Stack[T any] struct {
    items []T
}
func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    v := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return v, true
}
```

---

### 10. Struct Embedding (Composition over Inheritance)

```go
type Logger struct{}
func (l Logger) Log(msg string) { fmt.Println(msg) }

type Server struct {
    Logger           // embedded — Server "inherits" Log method
    Port   int
}

s := Server{Port: 8080}
s.Log("started")  // promoted method
```

---

## PART 2: GO 1.22–1.24 NEW FEATURES (2025–2026 Interview Edge)

> Knowing these shows you're current. Interviewers love this.

### Go 1.22 (Feb 2024)
```go
// Range over integers
for i := range 10 {
    fmt.Println(i) // 0..9
}

// Loop variable fix — each iteration gets its own copy
for _, v := range items {
    go func() { fmt.Println(v) }() // SAFE now, no more closure bug
}

// Enhanced HTTP routing
mux := http.NewServeMux()
mux.HandleFunc("GET /api/users/{id}", getUser)   // method + pattern!
mux.HandleFunc("POST /api/users", createUser)
```

### Go 1.23 (Aug 2024)
```go
// Iterators — custom range functions
func Backward[T any](s []T) iter.Seq2[int, T] {
    return func(yield func(int, T) bool) {
        for i := len(s) - 1; i >= 0; i-- {
            if !yield(i, s[i]) { return }
        }
    }
}
for i, v := range Backward([]string{"a", "b", "c"}) {
    fmt.Println(i, v)  // 2 c, 1 b, 0 a
}

// unique package — canonical values (interning)
```

### Go 1.24 (Feb 2025)
```go
// Generic type aliases
type Set[T comparable] = map[T]bool

// weak pointers — for caches
wb := weak.Make(myObject)
if v := wb.Value(); v != nil { /* still alive */ }

// JSON omitzero — finally fixes time.Time zero value
type Event struct {
    Name string    `json:"name"`
    At   time.Time `json:"at,omitzero"`  // omitted when zero (not "0001-01-01")
}

// os.Root — directory-scoped filesystem access (security)
dir, _ := os.OpenRoot("/data")
file, _ := dir.Open("safe.txt")       // OK
file, _ = dir.Open("../etc/passwd")   // ERROR: path escapes

// b.Loop for benchmarks (replaces for range b.N)
func BenchmarkFoo(b *testing.B) {
    for b.Loop() { doWork() }  // no sink variable needed
}

// t.Context() — auto-canceled when test ends
func TestFoo(t *testing.T) {
    srv := startServer(t.Context())  // cleaned up automatically
}

// Swiss tables — maps are 30% faster for large maps
// sync.Map reimplemented — much faster concurrent access

// Tool dependencies in go.mod
// go get -tool golang.org/x/tools/cmd/stringer
```

---

## PART 3: HANDS-ON — Type These From Memory

### H1: Worker Pool (most asked Go pattern)

```go
func workerPool(jobs <-chan int, results chan<- int, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2 // process
            }
        }()
    }
    wg.Wait()
    close(results)
}

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)

    go workerPool(jobs, results, 3)

    for i := 0; i < 5; i++ {
        jobs <- i
    }
    close(jobs)

    for r := range results {
        fmt.Println(r)
    }
}
```

---

### H2: HTTP Server with Middleware (fullstack essential)

```go
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
    })
    mux.HandleFunc("GET /api/users/{id}", getUser)
    mux.HandleFunc("POST /api/users", createUser)

    server := &http.Server{
        Addr:         ":8080",
        Handler:      loggingMiddleware(mux),
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
    }
    log.Fatal(server.ListenAndServe())
}
```

---

### H3: Graceful Shutdown (senior-level must-know)

```go
func main() {
    srv := &http.Server{Addr: ":8080", Handler: mux}

    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatalf("server error: %v", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("shutting down...")

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("forced shutdown: %v", err)
    }
    log.Println("server stopped")
}
```

---

### H4: Table-Driven Tests (Go testing standard)

```go
func Add(a, b int) int { return a + b }

func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
        {"zero", 0, 0, 0},
        {"mixed", -1, 5, 4},
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
```

---

### H5: JSON REST Handler with Validation

```go
type CreateUserRequest struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid JSON", http.StatusBadRequest)
        return
    }
    if req.Name == "" || req.Email == "" {
        http.Error(w, "name and email required", http.StatusBadRequest)
        return
    }

    user := User{ID: 1, Name: req.Name, Email: req.Email}

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}
```

---

### H6: Concurrent Fan-Out/Fan-In

```go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        ch := make(chan int)
        channels[i] = ch
        go func() {
            defer close(ch)
            for v := range input {
                ch <- v * v // process
            }
        }()
    }
    return channels
}

func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                merged <- v
            }
        }(ch)
    }
    go func() {
        wg.Wait()
        close(merged)
    }()
    return merged
}
```

---

### H7: Custom Error Type

```go
type APIError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
}

func (e *APIError) Error() string {
    return fmt.Sprintf("API error %d: %s", e.Code, e.Message)
}

func fetchUser(id int) (*User, error) {
    if id <= 0 {
        return nil, &APIError{Code: 400, Message: "invalid user ID"}
    }
    return nil, &APIError{Code: 404, Message: "user not found"}
}

// Usage
user, err := fetchUser(-1)
var apiErr *APIError
if errors.As(err, &apiErr) {
    fmt.Printf("Status: %d, Msg: %s\n", apiErr.Code, apiErr.Message)
}
```

---

### H8: Mutex vs Channel (know when to use which)

```go
// Use Mutex: protecting shared state (counters, caches)
type SafeCounter struct {
    mu sync.RWMutex
    v  map[string]int
}
func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.v[key]++
}
func (c *SafeCounter) Get(key string) int {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.v[key]
}

// Use Channel: communicating between goroutines, pipelines, signaling
// Rule of thumb: "Don't communicate by sharing memory; share memory by communicating"
```

---

## PART 4: OUTPUT PREDICTION (Interview Traps)

### OP1: Closure + Goroutine (Go 1.21 vs 1.22+)

```go
// Pre Go 1.22:
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }()
}
// Output: 3 3 3 (all goroutines see final i)

// Go 1.22+:
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }()
}
// Output: 0 1 2 (each iteration gets own variable) — FIXED!
```

### OP2: Nil Interface Trap

```go
type MyError struct{ msg string }
func (e *MyError) Error() string { return e.msg }

func getError() error {
    var err *MyError = nil
    return err  // returns non-nil interface holding nil pointer!
}

err := getError()
fmt.Println(err == nil) // false! Interface is not nil even though value is
```

### OP3: Defer + Named Return

```go
func foo() (result int) {
    defer func() { result = result * 2 }()
    return 5  // result = 5, then defer makes it 10
}
fmt.Println(foo()) // 10
```

### OP4: Slice Append Trap

```go
s := []int{1, 2, 3}
t := append(s[:2], 4)
fmt.Println(s) // [1 2 4] — NOT [1 2 3]!
fmt.Println(t) // [1 2 4]
```

---

## PART 5: FULLSTACK GO — What They Ask in 2026

| Topic | What to say |
|-------|-------------|
| "Go vs Node for API?" | Go: compiled, goroutines, low memory, single binary. Node: npm ecosystem, shared frontend lang, faster prototyping |
| "How do you structure a Go API?" | `/cmd/api/main.go`, `/internal/handler`, `/internal/service`, `/internal/repository`. Clean arch layers |
| "Database access?" | `pgx` for Postgres (not database/sql — pgx is faster). `sqlc` for type-safe generated code |
| "How do you test HTTP handlers?" | `httptest.NewRequest` + `httptest.NewRecorder`. Table-driven tests. Mock service layer with interfaces |
| "Deployment?" | `go build` → single binary. Multi-stage Dockerfile. No runtime dependencies needed |
| "Observability?" | `slog` for structured logging (Go 1.21+). Prometheus metrics. `pprof` for profiling |
| "Auth in Go API?" | JWT middleware. Validate token in middleware, inject user into `context.Context` |
| "Rate limiting?" | `golang.org/x/time/rate` — token bucket. Per-IP with sync.Map of limiters |

---

## DRILL TRACKER

| # | Drill | Target | Attempt 1 | Attempt 2 | Attempt 3 | Status |
|---|-------|--------|-----------|-----------|-----------|--------|
| H1 | Worker Pool from memory | 120s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H2 | HTTP Server + Middleware | 120s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H3 | Graceful Shutdown | 90s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H4 | Table-Driven Test | 60s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H5 | JSON REST Handler | 90s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H6 | Fan-Out/Fan-In | 120s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H7 | Custom Error Type | 60s | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| H8 | Mutex SafeCounter | 60s | ___ / __ | ___ / __ | ___ / __ | ⬜ |

| # | Output Prediction | Attempt 1 | Attempt 2 | Attempt 3 | Status |
|---|-------------------|-----------|-----------|-----------|--------|
| OP1 | Closure + goroutine (1.21 vs 1.22) | ✅❌ | ✅❌ | ✅❌ | ⬜ |
| OP2 | Nil interface trap | ✅❌ | ✅❌ | ✅❌ | ⬜ |
| OP3 | Defer + named return | ✅❌ | ✅❌ | ✅❌ | ⬜ |
| OP4 | Slice append mutation | ✅❌ | ✅❌ | ✅❌ | ⬜ |

| # | Verbal (explain in 60s) | Attempt 1 | Attempt 2 | Attempt 3 | Status |
|---|------------------------|-----------|-----------|-----------|--------|
| V1 | Goroutines vs threads | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V2 | Channels buffered vs unbuffered | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V3 | Error handling philosophy | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V4 | Interfaces — implicit satisfaction | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V5 | Context — cancellation/timeouts | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V6 | What's new in Go 1.22–1.24 | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V7 | Go vs Node.js for backend | ___ / __ | ___ / __ | ___ / __ | ⬜ |
| V8 | Go project structure | ___ / __ | ___ / __ | ___ / __ | ⬜ |
