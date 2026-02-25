# Failed Interview Questions Log

Track questions you got wrong or struggled with. Review before every interview.

**Purpose:** Turn failures into strengths. Every wrong answer is a gap to close.

---

## Template

Copy this for each new entry:

```
### Entry #N

- **Date:** YYYY-MM-DD
- **Company:** 
- **Round:** Phone Screen / Technical / Final
- **Topic:** 
- **Difficulty:** ⭐ / ⭐⭐ / ⭐⭐⭐

**Question:**
> 

**My Answer:**
> 

**Correct Answer:**
> 

**What I Learned:**
> 

**Follow-up Study:**
- [ ] 
```

---

## Logged Failures

---

### Entry #1

- **Date:** 2025-11-15
- **Company:** TechCorp (Series B startup)
- **Round:** Technical Phone Screen
- **Topic:** Closures
- **Difficulty:** ⭐⭐

**Question:**
> What does this code output and why?
> ```javascript
> for (var i = 0; i < 3; i++) {
>   setTimeout(() => console.log(i), 100);
> }
> ```

**My Answer:**
> "It prints 0, 1, 2" — I thought each iteration captured its own `i`.

**Correct Answer:**
> It prints `3, 3, 3`. Because `var` is function-scoped (not block-scoped), there's only ONE `i` variable shared across all iterations. By the time the `setTimeout` callbacks execute (~100ms later), the loop has finished and `i` is `3`.
>
> **Fixes:**
> 1. Use `let` instead of `var` — `let` is block-scoped, creating a new `i` per iteration.
> 2. Use an IIFE: `setTimeout((function(j) { return () => console.log(j); })(i), 100);`
> 3. Use `setTimeout`'s third arg: `setTimeout(console.log, 100, i);`

**What I Learned:**
> `var` is function-scoped, not block-scoped. The closure captures the *variable*, not its *value* at the time of creation. This is the single most common closure gotcha. Always use `let` in loops.

**Follow-up Study:**
- [x] Re-read MDN article on closures
- [x] Solve exercise 01 (closures/counter) from scratch
- [x] Practice explaining var vs let scoping out loud

---

### Entry #2

- **Date:** 2025-12-03
- **Company:** FinanceApp (Large enterprise)
- **Round:** Live Coding
- **Topic:** Promise.all Error Handling
- **Difficulty:** ⭐⭐⭐

**Question:**
> You have 5 API calls that should run in parallel. If one fails, you still want results from the others. How would you implement this?

**My Answer:**
> I used `Promise.all()` and wrapped everything in try/catch. The interviewer asked what happens when one promise rejects — I said the catch would handle it. I didn't realize `Promise.all` fails fast and discards ALL results on the first rejection.

**Correct Answer:**
> Use `Promise.allSettled()` instead of `Promise.all()`.
>
> ```javascript
> const results = await Promise.allSettled([
>   fetchUser(),
>   fetchPosts(),
>   fetchComments(),
>   fetchLikes(),
>   fetchFollowers(),
> ]);
>
> const successful = results
>   .filter(r => r.status === "fulfilled")
>   .map(r => r.value);
>
> const failed = results
>   .filter(r => r.status === "rejected")
>   .map(r => r.reason);
> ```
>
> **Alternatives:**
> - Wrap each promise in `.catch()`: `Promise.all(promises.map(p => p.catch(e => ({ error: e }))))`
> - Use `Promise.allSettled()` (ES2020) — purpose-built for this exact scenario.

**What I Learned:**
> - `Promise.all` → fail-fast: ONE rejection kills everything
> - `Promise.allSettled` → wait for ALL, get status of each
> - `Promise.any` → resolve on FIRST success, reject only if ALL fail
> - `Promise.race` → resolve/reject on FIRST settlement (success or failure)
>
> Always choose the right Promise combinator for the use case.

**Follow-up Study:**
- [x] Implement all 4 Promise static methods from scratch
- [x] Build a real "parallel fetch with fallback" utility
- [ ] Read TC39 proposal for Promise.allSettled to understand motivation

---

### Entry #3

- **Date:** 2026-01-20
- **Company:** CloudScale (DevTools startup)
- **Round:** Technical Screen
- **Topic:** Event Loop Output Prediction
- **Difficulty:** ⭐⭐⭐

**Question:**
> What's the output order of this code?
> ```javascript
> console.log("A");
> setTimeout(() => console.log("B"), 0);
> Promise.resolve().then(() => {
>   console.log("C");
>   setTimeout(() => console.log("D"), 0);
> });
> Promise.resolve().then(() => console.log("E"));
> console.log("F");
> ```

**My Answer:**
> I said: A, F, C, E, B, D. I got the sync part right (A, F) and knew microtasks run before macrotasks, but I said C before E because "it was queued first and C's .then does more work." The interviewer probed on D's position — I hesitated and said D could be before or after B, showing I wasn't sure about the ordering.

**Correct Answer:**
> `A, F, C, E, B, D`
>
> Actually, my answer was **correct** — but I couldn't explain WHY with confidence, which is what cost me.
>
> **Step-by-step execution:**
> 1. `console.log("A")` → sync → outputs **A**
> 2. `setTimeout(B, 0)` → schedules B as macrotask
> 3. `Promise.then(C + setTimeout D)` → queues to microtask queue
> 4. `Promise.then(E)` → queues to microtask queue
> 5. `console.log("F")` → sync → outputs **F**
> 6. Call stack empty → drain microtask queue:
>    - First microtask: outputs **C**, schedules D as macrotask
>    - Second microtask: outputs **E**
> 7. Microtask queue empty → run next macrotask: outputs **B**
> 8. Run next macrotask: outputs **D** (queued after B)

**What I Learned:**
> Knowing the answer isn't enough — I need to explain the event loop execution model step by step, confidently. The key rules:
> 1. ALL synchronous code first
> 2. ALL microtasks drain (FIFO order)
> 3. ONE macrotask runs
> 4. ALL microtasks drain again (including any new ones from step 3)
> 5. Repeat
>
> Macrotasks are processed in the order they were scheduled.

**Follow-up Study:**
- [x] Draw the event loop diagram from memory
- [x] Practice tracing 5 different event loop puzzles step by step
- [ ] Watch Jake Archibald's "In The Loop" talk again
- [x] Solve exercise 06-01 and 06-02 without looking at solutions

---

## Stats

| Metric | Count |
|--------|-------|
| Total logged | 3 |
| Closures/Scope | 1 |
| Async/Promises | 1 |
| Event Loop | 1 |
| Resolved (confident now) | 2 |
| Still shaky | 1 |

---

## Recurring Weak Areas

Track patterns in your failures:

- [ ] **Closures & Scope** — var vs let in loops, closure over reference vs value
- [ ] **Promise combinators** — knowing which one to use and their failure semantics
- [ ] **Event loop tracing** — confident step-by-step explanation under pressure
- [ ] **`this` binding** — especially in nested callbacks and event handlers
- [ ] **Type coercion** — edge cases with `==`, `+`, and implicit conversions
