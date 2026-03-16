# 💀 Go Trick Questions & Traps

> **The gotchas interviewers use to test if you ACTUALLY write Go.**
> **Know these = instant credibility.**

---

## 1. Loop Variable Capture

```go
funcs := []func(){}
for i := 0; i < 3; i++ {
    funcs = append(funcs, func() { fmt.Println(i) })
}
for _, f := range funcs { f() }

// TRAP: You'd expect 0, 1, 2
// ANSWER: 3, 3, 3 (Go < 1.22)
// WHY: closure captures the VARIABLE i, not the value. Loop ends, i = 3.
// FIX (pre 1.22): shadow it
for i := 0; i < 3; i++ {
    i := i  // new variable per iteration
    funcs = append(funcs, func() { fmt.Println(i) })
}
// Go 1.22+: fixed — each iteration gets its own variable automatically
```

---

## 2. Goroutine Loop Variable (Classic Trap)

```go
for _, val := range []string{"a", "b", "c"} {
    go func() {
        fmt.Println(val)
    }()
}
time.Sleep(time.Second)

// TRAP: expect "a", "b", "c" in some order
// ANSWER (pre 1.22): "c", "c", "c" — all print the LAST value
// FIX: pass as argument
for _, val := range []string{"a", "b", "c"} {
    go func(v string) {
        fmt.Println(v)
    }(val)
}
// Go 1.22+: fixed automatically
```

---

## 3. nil Interface vs nil Pointer

```go
type MyError struct{ msg string }
func (e *MyError) Error() string { return e.msg }

func getError() error {
    var err *MyError = nil  // nil pointer
    return err              // returns interface holding (type=*MyError, value=nil)
}

func main() {
    err := getError()
    fmt.Println(err == nil) // false !!!
}

// TRAP: err is NOT nil even though the pointer inside is nil
// WHY: interface has two fields: (type, value). Both must be nil for interface == nil.
//      Here type = *MyError, value = nil → interface is NOT nil
// FIX: return nil explicitly, not a typed nil pointer
func getError() error {
    var err *MyError = nil
    if err == nil {
        return nil  // return bare nil, not typed nil
    }
    return err
}
```

**SAY THIS:**
> "An interface is nil only when both its type AND value are nil. A nil pointer wrapped in an interface is NOT a nil interface — the type field is set. This is the #1 Go trap. Always return bare nil, never a typed nil pointer."

---

## 4. Slice Append Mutation

```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]          // b = [2, 3], len=2, cap=4
b = append(b, 99)    // Does this affect a?

fmt.Println(a) // [1, 2, 3, 99, 5] — YES, a is mutated!
fmt.Println(b) // [2, 3, 99]

// TRAP: append on a sub-slice modifies the original if capacity allows
// WHY: b shares the same underlying array as a
// FIX: full slice expression
b := a[1:3:3]        // cap = 3-1 = 2, no room → append allocates new array
```

---

## 5. Map Iteration Order

```go
m := map[string]int{"a": 1, "b": 2, "c": 3}
for k, v := range m {
    fmt.Println(k, v)
}

// TRAP: expecting consistent order
// ANSWER: order is RANDOMIZED intentionally by Go runtime
// WHY: Go randomizes to prevent developers from depending on order
// FIX: sort keys first if you need order
keys := make([]string, 0, len(m))
for k := range m { keys = append(keys, k) }
sort.Strings(keys)
```

---

## 6. Defer with Loops

```go
func processFiles(files []string) error {
    for _, f := range files {
        file, err := os.Open(f)
        if err != nil { return err }
        defer file.Close()  // ⚠️ defers ALL close until function returns
    }
    // TRAP: 1000 files = 1000 open file handles until function ends
    // FIX: wrap in a closure
    for _, f := range files {
        func() {
            file, _ := os.Open(f)
            defer file.Close()  // closes when THIS closure returns
        }()
    }
}
```

---

## 7. Defer Argument Evaluation

```go
func main() {
    x := 1
    defer fmt.Println(x)  // x is evaluated NOW = 1
    x = 2
}
// TRAP: expect 2
// ANSWER: prints 1
// WHY: defer arguments are evaluated at the defer statement, not at execution

// BUT: deferred closures capture by reference
func main() {
    x := 1
    defer func() { fmt.Println(x) }()  // closure captures x
    x = 2
}
// ANSWER: prints 2 — closure sees the current value of x
```

---

## 8. String Iteration — Bytes vs Runes

```go
s := "héllo"
fmt.Println(len(s))  // 6, not 5!

// TRAP: len() counts BYTES, not characters. 'é' = 2 bytes in UTF-8.

for i, ch := range s {
    fmt.Printf("%d: %c\n", i, ch)
}
// 0: h
// 1: é    ← index jumps to 3 because é is 2 bytes
// 3: l
// 4: l
// 5: o

// range iterates by RUNE (character), not byte
// index is BYTE position, not rune position

// Count characters:
runeCount := utf8.RuneCountInString(s) // 5
// Or: len([]rune(s)) // 5
```

---

## 9. Copying a Struct with a Mutex

```go
type SafeCounter struct {
    mu sync.Mutex
    n  int
}

c1 := SafeCounter{}
c2 := c1  // ❌ COPIES the mutex!

// TRAP: copying a locked mutex = undefined behavior, data race
// go vet catches this: "copies lock value"
// FIX: use pointer, or don't copy
c2 := &c1  // share, don't copy
```

---

## 10. Range Over Channel

```go
ch := make(chan int)
go func() {
    ch <- 1
    ch <- 2
    ch <- 3
    // forgot to close(ch)
}()

for v := range ch {
    fmt.Println(v)
}
// TRAP: range blocks forever after receiving 3 — deadlock!
// WHY: range over channel only exits when channel is CLOSED
// FIX: always close the channel from the sender side
go func() {
    ch <- 1; ch <- 2; ch <- 3
    close(ch)  // range loop exits
}()
```

---

## 11. Multiple Return Shadowing

```go
func getUser() (*User, error) {
    user, err := findInCache()
    if err == nil { return user, nil }

    user, err := findInDB()  // ❌ compile error: no new variables
    // FIX: use = not :=
    user, err = findInDB()   // ✅

    // BUT this is the real trap:
    if something {
        user, err := findInDB()  // ✅ compiles — new scope! shadows outer user
        _ = user                  // this user is LOST when if-block ends
    }
    return user, err  // returns the CACHE user, not DB user!
}
```

---

## 12. Goroutine Doesn't Execute

```go
func main() {
    go fmt.Println("hello")
}
// TRAP: might print nothing!
// WHY: main() exits before goroutine runs → program terminates
// FIX: sync.WaitGroup, channel, or time.Sleep (hacky)
```

---

## 13. Panic Recovery Scope

```go
func main() {
    go func() {
        panic("crash")  // kills the ENTIRE program
    }()
    time.Sleep(time.Second)
}
// TRAP: panic in a goroutine is NOT recoverable from main
// recover() only works in a deferred function in the SAME goroutine

go func() {
    defer func() {
        if r := recover(); r != nil {
            log.Println("recovered:", r)  // ✅ same goroutine
        }
    }()
    panic("crash")  // recovered, program continues
}()
```

---

## 14. Pointer Receiver & Interface

```go
type Stringer interface {
    String() string
}

type Person struct { Name string }

func (p *Person) String() string { return p.Name }  // pointer receiver

var s Stringer = Person{Name: "Tijo"}  // ❌ compile error!
var s Stringer = &Person{Name: "Tijo"} // ✅ must use pointer

// TRAP: value receiver satisfies interface for BOTH value and pointer
//       pointer receiver satisfies interface for POINTER ONLY
// WHY: Go can't always get address of a value (e.g., map values, return values)
```

---

## 15. Map Value Not Addressable

```go
type User struct { Name string }

m := map[string]User{"a": {Name: "Tijo"}}
m["a"].Name = "Updated"  // ❌ compile error: cannot assign to struct field in map

// TRAP: map values are NOT addressable — you can't modify fields in place
// WHY: maps may relocate values internally during growth
// FIX 1: replace the whole value
u := m["a"]
u.Name = "Updated"
m["a"] = u

// FIX 2: use map of pointers
m2 := map[string]*User{"a": {Name: "Tijo"}}
m2["a"].Name = "Updated"  // ✅ works — pointer is addressable
```

---

## 16. iota Reset

```go
const (
    A = iota  // 0
    B         // 1
    C         // 2
)

const (
    X = iota  // 0 again! iota resets per const block
    Y         // 1
)

// TRAP: iota resets to 0 in each const block, not global
// Also:
const (
    _  = iota          // 0 — skip
    KB = 1 << (10 * iota) // 1 << 10 = 1024
    MB                    // 1 << 20
    GB                    // 1 << 30
)
```

---

## 17. Select Default — Non-Blocking Gotcha

```go
ch := make(chan int, 1)
ch <- 1

select {
case ch <- 2:
    fmt.Println("sent")
default:
    fmt.Println("full")  // this runs — buffer is full
}

// TRAP: without default, select blocks forever if no case ready
// With default, it becomes non-blocking — might skip cases you expected to run
// Use default only when you WANT non-blocking behavior
```

---

## 18. WaitGroup Add Location

```go
// ❌ RACE CONDITION
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    go func() {
        wg.Add(1)   // inside goroutine — might not run before Wait()
        defer wg.Done()
        // work
    }()
}
wg.Wait()  // might return before all Add(1) calls happen

// ✅ CORRECT
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)   // in the launching goroutine, BEFORE go func
    go func() {
        defer wg.Done()
        // work
    }()
}
wg.Wait()
```

---

## 19. Zero Values as Traps

```go
var b bool     // false, not error
var i int      // 0
var s string   // "" (empty string, not nil)
var p *int     // nil
var sl []int   // nil (but len=0, append works)
var m map[string]int // nil — reading returns zero, WRITING PANICS!

m["key"] = 1  // ❌ panic: assignment to entry in nil map
// FIX: m = make(map[string]int)

// TRAP: nil slice is safe to append to, nil map PANICS on write
```

---

## 20. Embedding Ambiguity

```go
type A struct{}
func (A) Hello() string { return "A" }

type B struct{}
func (B) Hello() string { return "B" }

type C struct { A; B }  // embeds both

c := C{}
c.Hello()  // ❌ compile error: ambiguous selector — both A and B have Hello()

// FIX: be explicit
c.A.Hello()  // "A"
c.B.Hello()  // "B"
```

---

## ⚡ SPEED TABLE — "What's the output?"

| Code | Output | Why |
|------|--------|-----|
| `len("héllo")` | `6` | len counts bytes, not runes |
| `nil map write` | **panic** | nil map = read ok, write panics |
| `nil slice append` | works | nil slice is valid, append allocates |
| `defer fmt.Println(x)` then `x=2` | prints old value | args evaluated at defer time |
| `defer func(){fmt.Println(x)}()` then `x=2` | prints `2` | closure captures by reference |
| `interface holding nil ptr == nil` | `false` | interface nil = both type AND value nil |
| `map iteration order` | random | intentionally randomized |
| `copy mutex` | undefined behavior | go vet catches, never copy |
| `wg.Add inside goroutine` | race condition | Add before `go func` |
| `range channel not closed` | deadlock | range exits only on close |
| `panic in goroutine` | kills program | recover only in same goroutine |
| `pointer receiver on value` | compile error | pointer receiver needs pointer |

---

> **If you know these 20 traps, you'll handle ANY Go curveball they throw. These are the questions that separate "read a tutorial" from "writes Go daily." You're the second one. 💪**
