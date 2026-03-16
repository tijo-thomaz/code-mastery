# 🐹 GO INTERVIEW CHEATSHEET — Theory + Hands-On

> **Purpose:** Quick reference for interview. Theory = verbal answers. Hands-on = type from memory.
> **Reality check:** You don't need to write perfect Go in 15 min. You need to show you THINK in Go.
> **If stuck:** Tell the interviewer "Let me think about the structure first" — talk through your approach.

---

## PART 1: SYNTAX SURVIVAL KIT 🆘

> Forgot syntax? This is your lifeline. Skim before interview.

```go
// ─── BASIC STRUCTURE ───
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "sync"
    "time"
)

func main() { }

// ─── VARIABLES ───
var name string = "Tijo"        // explicit
name := "Tijo"                  // short declaration (inside functions only)
const maxRetries = 3

// ─── STRUCTS ───
type User struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// ─── METHODS ───
func (u *User) FullName() string {      // pointer receiver (can modify)
    return u.Name
}

// ─── INTERFACES ───
type Repository interface {
    FindByID(id string) (*User, error)
    Create(user *User) error
}

// ─── ERROR HANDLING ───
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doing something: %w", err)   // wrap with context
}

// ─── SLICES ───
s := []int{1, 2, 3}
s = append(s, 4)
for i, v := range s { fmt.Println(i, v) }

// ─── MAPS ───
m := make(map[string]int)
m["key"] = 42
val, ok := m["key"]     // ok = true if exists
delete(m, "key")
for k, v := range m { fmt.Println(k, v) }

// ─── IF / SWITCH ───
if x > 0 {
} else if x < 0 {
} else {
}

switch status {
case "active":
    // no break needed — Go doesn't fall through by default
case "inactive":
    //
default:
    //
}

// ─── GOROUTINES ───
go func() {
    // runs concurrently
}()

// ─── CHANNELS ───
ch := make(chan string)         // unbuffered
ch := make(chan string, 10)    // buffered

ch <- "hello"                  // send
msg := <-ch                    // receive
close(ch)                      // close when done sending

// ─── DEFER ───
defer file.Close()             // runs when function returns, LIFO order

// ─── JSON ───
json.NewEncoder(w).Encode(data)              // struct → JSON → writer
json.NewDecoder(r.Body).Decode(&req)         // reader → JSON → struct
```

---

## PART 2: THEORY Q&A — Verbal Answers (60 seconds each)

---

### Q: "Goroutines vs threads?"

> "Goroutines are lightweight user-space threads — 2KB stack that grows dynamically,
> managed by Go's runtime scheduler, not the OS. You can spin up thousands cheaply.
> They're multiplexed onto OS threads with M:N scheduling. Context switch is ~200ns
> vs ~1-2μs for OS threads."

---

### Q: "How do channels work?"

> "Channels are typed, goroutine-safe pipes. Unbuffered channels are synchronous —
> sender blocks until receiver is ready. Buffered channels are async up to capacity.
> Sender closes the channel to signal 'no more data.' Receiver uses range to read
> until closed. Select statement multiplexes on multiple channels."

---

### Q: "Error handling in Go?"

> "Go doesn't have exceptions. Functions return (result, error). You check if err != nil
> at every call site. Wrap errors with fmt.Errorf and %w for context. Unwrap with
> errors.Is for specific errors and errors.As for type assertion. It's verbose but
> explicit — you always know where errors are handled."

---

### Q: "Interfaces in Go?"

> "Interfaces are satisfied implicitly — if your struct has the methods, it satisfies
> the interface. No implements keyword. This is duck typing enforced at compile time.
> Small interfaces are idiomatic — io.Reader has one method. Accept interfaces,
> return structs. This makes code testable — swap real DB for in-memory in tests."

---

### Q: "Context — what and why?"

> "Context carries cancellation signals, deadlines, and request-scoped values across
> API boundaries. Always the first parameter. WithCancel for manual cancellation,
> WithTimeout for auto-cancel after duration. In HTTP handlers, the request context
> auto-cancels when the client disconnects. Always defer cancel()."

---

### Q: "Mutex vs Channel — when to use which?"

> "Mutex for protecting shared state — counters, caches, maps. Channel for
> communicating between goroutines — passing data, signaling, pipelines. The
> Go proverb: 'Don't communicate by sharing memory; share memory by communicating.'
> In practice: if you're just guarding a variable, use Mutex. If goroutines need
> to coordinate work, use channels."

---

### Q: "How does defer work?"

> "Defer schedules a function call to run when the enclosing function returns. LIFO
> order — last defer runs first. Arguments are evaluated immediately at the defer
> site, not at execution time. Used for cleanup: close files, unlock mutexes,
> recover from panics. Can modify named return values."

---

### Q: "Slice vs Array?"

> "Array is fixed size, value type — assigning copies the whole array. Slice is a
> reference type — header with pointer, length, capacity over an underlying array.
> Slices are what you use 99% of the time. The gotcha: sub-slices share the backing
> array, so mutating one affects the other. Pre-allocate with make([]T, 0, size)
> when you know the size."

---

### Q: "Go project structure?"

> "cmd/ for entry points — each binary gets its own folder. internal/ for private
> packages — can't be imported by other modules. pkg/ for public reusable packages.
> For web APIs: internal/handler for HTTP, internal/service for business logic,
> internal/repository for data access. Clean architecture: handler → service → repo."

---

### Q: "Go vs Node for backend?"

> "Go: compiled to single binary, goroutines for concurrency, strong typing, low
> memory footprint, fast cold starts. Node: massive npm ecosystem, shared language
> with frontend, faster prototyping, event loop. I'd use Go for high-concurrency
> services and CPU-bound work, Node for BFF layers and rapid API prototyping."

---

### Q: "What's new in recent Go versions?"

> "Go 1.22: enhanced HTTP routing with method + pattern matching in ServeMux,
> range over integers, loop variable fix for closures. Go 1.23: custom iterators.
> Go 1.24: generic type aliases, json omitzero for zero values, Swiss table maps
> that are 30% faster, t.Context() for tests."

---

### Q: "How do you test in Go?"

> "Table-driven tests — slice of test cases with name, input, expected output.
> t.Run for subtests. httptest package for HTTP handlers — NewRequest and
> NewRecorder. Interfaces for mocking — define interface, pass mock implementation
> in tests. go test -race for race condition detection. Benchmarks with b.N."

---

## PART 3: HANDS-ON CODE — Simplified Patterns

> **The goal: show you can write Go, not write perfect Go.**
> **If 15 min feels tight: build the SIMPLEST version first, then add features.**

---

### PATTERN 1: Minimal REST API (THE most likely task)

> **Start here. If you can write this in 10 min, you're good.**

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type Task struct {
    ID    string `json:"id"`
    Title string `json:"title"`
    Done  bool   `json:"done"`
}

var tasks = []Task{
    {ID: "1", Title: "Learn Go", Done: false},
    {ID: "2", Title: "Build API", Done: true},
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/tasks", getTasks)
    mux.HandleFunc("POST /api/tasks", createTask)

    fmt.Println("Server on :8080")
    http.ListenAndServe(":8080", mux)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(tasks)
}

func createTask(w http.ResponseWriter, r *http.Request) {
    var t Task
    if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
        http.Error(w, "invalid json", http.StatusBadRequest)
        return
    }
    t.ID = fmt.Sprintf("%d", time.Now().UnixNano())
    tasks = append(tasks, t)

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(t)
}
```

**That's it. 25 lines of actual code. This is your MINIMUM.**

**Then ADD if time permits:**
```go
// Add GET by ID
mux.HandleFunc("GET /api/tasks/{id}", getTaskByID)

func getTaskByID(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")
    for _, t := range tasks {
        if t.ID == id {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(t)
            return
        }
    }
    http.Error(w, "not found", http.StatusNotFound)
}
```

**Then ADD middleware if time permits:**
```go
func logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        fmt.Printf("%s %s %v\n", r.Method, r.URL.Path, time.Since(start))
    })
}

// In main:
http.ListenAndServe(":8080", logger(mux))
```

**STRATEGY: Build minimal → add features → narrate while coding.**

---

### PATTERN 2: Worker Pool (if he asks concurrency)

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)

    // Start 3 workers
    var wg sync.WaitGroup
    for w := 0; w < 3; w++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {
                fmt.Printf("Worker %d processing job %d\n", id, job)
                results <- job * 2
            }
        }(w)
    }

    // Send jobs
    for i := 1; i <= 5; i++ {
        jobs <- i
    }
    close(jobs)

    // Wait and close results
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect
    for r := range results {
        fmt.Println("Result:", r)
    }
}
```

**NARRATE THIS:** "I create a buffered jobs channel, spin up N workers that range
over it, each processes and sends to results. Close jobs when done sending.
WaitGroup waits for all workers, then closes results. Main ranges over results."

---

### PATTERN 3: Middleware Chain

```go
// Middleware = func(http.Handler) http.Handler

func logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Printf("[%s] %s\n", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)
    })
}

func auth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "unauthorized", 401)
            return  // don't call next — request stops here
        }
        next.ServeHTTP(w, r)
    })
}

// Chain: request → logging → auth → handler
handler := logging(auth(mux))
```

---

### PATTERN 4: Graceful Shutdown

```go
srv := &http.Server{Addr: ":8080", Handler: mux}

// Start server in goroutine
go func() {
    if err := srv.ListenAndServe(); err != http.ErrServerClosed {
        log.Fatal(err)
    }
}()

// Wait for interrupt
quit := make(chan os.Signal, 1)
signal.Notify(quit, os.Interrupt)
<-quit

fmt.Println("Shutting down...")
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
srv.Shutdown(ctx)
```

---

### PATTERN 5: Table-Driven Test

```go
func Add(a, b int) int { return a + b }

func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
        {"zero", 0, 0, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Add(%d,%d) = %d, want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}
```

---

### PATTERN 6: Safe Concurrent Map

```go
type SafeMap struct {
    mu sync.RWMutex
    m  map[string]string
}

func NewSafeMap() *SafeMap {
    return &SafeMap{m: make(map[string]string)}
}

func (s *SafeMap) Get(key string) (string, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    v, ok := s.m[key]
    return v, ok
}

func (s *SafeMap) Set(key, val string) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.m[key] = val
}
```

**NARRATE:** "Maps in Go are NOT safe for concurrent access. I wrap with RWMutex —
RLock for reads (multiple readers), Lock for writes (exclusive). Always defer Unlock."

---

## PART 4: TRAPS HE MIGHT ASK (output prediction)

```go
// TRAP 1: nil interface
var err *MyError = nil
var e error = err
fmt.Println(e == nil)  // false! interface has type info

// TRAP 2: defer args evaluated immediately
x := 10
defer fmt.Println(x)  // prints 10
x = 20

// TRAP 3: defer LIFO
defer fmt.Println("A")
defer fmt.Println("B")
defer fmt.Println("C")
// Output: C, B, A

// TRAP 4: slice append mutation
s := []int{1, 2, 3}
t := s[:2]
t = append(t, 99)
fmt.Println(s)  // [1, 2, 99] — not [1, 2, 3]!

// TRAP 5: map iteration order
m := map[string]int{"a": 1, "b": 2, "c": 3}
for k, v := range m { fmt.Println(k, v) }
// Order is RANDOM every time — Go randomizes map iteration

// TRAP 6: named return + defer
func foo() (result int) {
    defer func() { result++ }()
    return 5  // result = 5, then defer makes it 6
}
// Returns 6
```

---

## PART 5: COMMON IMPORT CHEATSHEET

> You WILL forget imports under pressure. Here's what you need:

```go
// HTTP API
import (
    "encoding/json"     // json.Encode, json.Decode
    "fmt"               // fmt.Println, fmt.Sprintf, fmt.Errorf
    "log"               // log.Fatal, log.Printf
    "net/http"          // http.HandleFunc, http.ListenAndServe
    "time"              // time.Now, time.Second, time.Since
)

// Concurrency
import (
    "sync"              // sync.Mutex, sync.WaitGroup, sync.RWMutex
    "context"           // context.WithTimeout, context.Background
)

// System
import (
    "os"                // os.Getenv, os.Signal
    "os/signal"         // signal.Notify
)

// Testing
import "testing"        // testing.T, t.Run, t.Errorf

// Strings / IO
import (
    "strings"           // strings.ToUpper, strings.Contains
    "io"                // io.ReadAll
)
```

---

## PART 6: IF YOU GET STUCK — SURVIVAL MOVES

```
STUCK ON SYNTAX?
  → Say: "Let me write the structure first, then fill in the details"
  → Write the function signatures and types FIRST
  → Fill in logic after

STUCK ON A PATTERN?
  → Say: "I'd approach this with [describe pattern], let me code it"
  → Write pseudocode comments first, then convert to Go

CAN'T REMEMBER AN IMPORT?
  → Just write it — the interviewer won't fail you for a wrong import
  → Or say "I'd import encoding/json here" and move on

TIME RUNNING OUT?
  → Say: "Let me finish the core logic, and I can describe the rest"
  → Working POST + GET > perfect POST + GET + PUT + DELETE + middleware

COMPILES BUT WRONG?
  → That's fine. Walk through the logic. Show your debugging thinking.
  → "I think the issue is here... let me trace through..."
```

---

## ⚡ 10-MIN DRILL ORDER (do this tomorrow morning)

```
Step 1: Type the Minimal REST API (Pattern 1) from memory       — 5 min
Step 2: Add GET by ID                                            — 2 min
Step 3: Add logging middleware                                   — 2 min
Step 4: Run it: go run main.go                                  — 1 min

If it compiles and runs → you're ready.
If it doesn't → check imports, check syntax from Part 1.

Step 5: Delete everything. Do it again. Target: < 8 min.
```

---

> **You don't need to be a Go expert. You need to show you can THINK and BUILD
> in Go under pressure. Minimal working API + clear narration = pass.
> Start simple. Add features. Talk while you code. 🐹🔥**
