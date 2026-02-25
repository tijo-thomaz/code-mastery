# Go Interview Questions & Answers

## 1. Goroutines vs OS Threads

**Q:** How do goroutines differ from OS threads?

**A:** Goroutines are lightweight, user-space threads managed by the Go runtime. Key differences:
- **Stack size**: Goroutines start with ~2-8 KB stack (grows dynamically) vs 1-8 MB for OS threads
- **Scheduling**: Go uses M:N scheduling — M goroutines multiplexed onto N OS threads by the Go scheduler
- **Creation cost**: Goroutines are cheap to create (thousands are normal); OS threads are expensive
- **Context switching**: Goroutine switches happen in user space (faster); thread switches require kernel involvement

---

## 2. How Do Channels Work?

**Q:** Explain buffered vs unbuffered channels.

**A:**
- **Unbuffered** (`make(chan int)`): Send blocks until a receiver is ready. Provides synchronization.
- **Buffered** (`make(chan int, 5)`): Send blocks only when the buffer is full. Receive blocks when empty.
- Channels are typed, goroutine-safe, and can be directional (`chan<-` send-only, `<-chan` receive-only).
- Closing a channel signals no more values; receiving from a closed channel returns the zero value.

---

## 3. Defer Behavior

**Q:** In what order do deferred calls execute? What about arguments?

**A:**
- Deferred calls execute in **LIFO** (last in, first out) order when the surrounding function returns.
- Arguments to deferred functions are **evaluated immediately** at the defer statement, not at execution time.
- Deferred functions can read and modify named return values.

```go
func example() {
    defer fmt.Println("first")  // prints third
    defer fmt.Println("second") // prints second
    defer fmt.Println("third")  // prints first
}
```

---

## 4. Interface Satisfaction

**Q:** How does Go determine if a type satisfies an interface?

**A:** Go uses **structural typing** (duck typing) — a type satisfies an interface if it implements all the interface's methods. No explicit `implements` keyword.
- Pointer receivers only satisfy interfaces when used with pointers
- Value receivers satisfy interfaces with both values and pointers
- The empty interface `interface{}` (or `any`) is satisfied by every type
- Compile-time check: `var _ MyInterface = (*MyType)(nil)`

---

## 5. Slice Internals

**Q:** What is the internal structure of a slice?

**A:** A slice header contains three fields:
- **Pointer**: to the underlying array
- **Length**: number of elements in the slice
- **Capacity**: number of elements from the pointer to the end of the underlying array

Key gotchas:
- Multiple slices can share the same underlying array
- `append` may allocate a new array if capacity is exceeded (growth factor ~2x)
- Slicing (`s[1:3]`) doesn't copy data — it creates a new header pointing to the same array

---

## 6. Map Concurrency Safety

**Q:** Are maps safe for concurrent use?

**A:** No. Concurrent reads are safe, but concurrent read+write or write+write will cause a runtime panic ("concurrent map writes"). Solutions:
- `sync.Mutex` or `sync.RWMutex` to protect access
- `sync.Map` for specific patterns (few writes, many reads, or disjoint key sets)
- Channel-based access patterns (serialize map operations through a goroutine)

---

## 7. Garbage Collection

**Q:** How does Go's garbage collector work?

**A:** Go uses a **concurrent, tri-color mark-and-sweep** collector:
- **Tri-color marking**: Objects are white (unreachable), gray (reachable, not scanned), or black (reachable, scanned)
- **Concurrent**: GC runs alongside application goroutines with minimal stop-the-world pauses (~sub-millisecond)
- **Write barrier**: Ensures correctness during concurrent marking
- Tuned via `GOGC` environment variable (default 100 = GC triggers when heap doubles)

---

## 8. Error Handling Philosophy

**Q:** Why doesn't Go have exceptions? What's the philosophy?

**A:**
- Errors are **values** — they're returned explicitly and handled at the call site
- This forces developers to handle errors immediately rather than ignoring them
- `panic`/`recover` exist but are reserved for truly unrecoverable situations (programming errors, not expected failures)
- Error wrapping with `fmt.Errorf("context: %w", err)` preserves the error chain
- `errors.Is` and `errors.As` enable inspection of wrapped errors

---

## 9. What is the `init` Function?

**Q:** When does `init()` run and what are its use cases?

**A:**
- `init()` runs **after** package-level variable declarations and **before** `main()`
- Each file can have multiple `init()` functions
- Execution order: imported packages' `init` → current package vars → current package `init` → `main`
- Common uses: setting up database connections, registering drivers, validating configuration
- Overuse is an anti-pattern — prefer explicit initialization

---

## 10. Goroutine Leaks

**Q:** What causes goroutine leaks and how do you prevent them?

**A:** A goroutine leak occurs when a goroutine blocks forever and is never cleaned up. Common causes:
- Sending to a channel with no receiver
- Receiving from a channel that's never closed or sent to
- Infinite loops without exit conditions

Prevention:
- Use `context.Context` with cancellation/timeout
- Always ensure channels are closed by the sender
- Use `select` with a done/cancel channel
- Monitor with `runtime.NumGoroutine()` or pprof

---

## 11. Value vs Pointer Receivers

**Q:** When should you use pointer receivers vs value receivers?

**A:**
- **Pointer receivers**: When the method needs to mutate the receiver, or the struct is large (avoids copying)
- **Value receivers**: When the method doesn't mutate, and the struct is small
- **Consistency rule**: If any method has a pointer receiver, all methods should use pointer receivers
- Pointer receivers are required to satisfy interfaces when calling on a value type

---

## 12. The `select` Statement

**Q:** How does `select` work with multiple ready channels?

**A:**
- `select` blocks until at least one case is ready
- If **multiple cases** are ready simultaneously, Go picks one **at random** (uniform pseudo-random selection)
- A `default` case makes it non-blocking
- Common patterns: timeouts (`time.After`), cancellation (`ctx.Done()`), fan-in (merge multiple channels)

```go
select {
case msg := <-ch1:
    handle(msg)
case msg := <-ch2:
    handle(msg)
case <-ctx.Done():
    return ctx.Err()
}
```
