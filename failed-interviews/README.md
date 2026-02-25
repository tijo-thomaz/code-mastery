# 📓 Failed Interviews Journal

> "I have not failed. I've just found 10,000 ways that won't work." — Thomas Edison
>
> (But seriously, track those ways so you don't repeat them.)

## Why Tracking Failures Matters

Every failed interview is **free education** — if you capture the lesson. Most people walk out of a bad interview, feel terrible for a day, and then forget what they got wrong. Three months later, they get the same question and fail again.

**Tracking your failures helps you:**

- Identify patterns (are you always weak on system design? concurrency? behavioral?)
- Build a personal study guide based on *actual gaps*, not random topics
- Turn emotional frustration into concrete action items
- See progress over time — your failure log becomes a growth log
- Prepare for the *next* interview with precision

**The rule:** Within 24 hours of a failed interview, write it down. The details fade fast.

---

## Entry Template

Copy this for each failed interview:

```markdown
---

### Entry #___

**Date:** YYYY-MM-DD
**Company:** ___
**Role:** ___
**Round:** Phone Screen / Technical / System Design / Behavioral / Take-Home
**Interviewer Vibe:** Friendly / Neutral / Tough

**Question:**
> Write the exact question or as close as you can remember.

**My Answer:**
> What did you actually say or write? Be honest — don't polish it.

**Correct / Better Answer:**
> What should you have said? Research this after the interview.

**Why I Got It Wrong:**
> Root cause. Did you not know the concept? Did you know it but panicked? Did you run out of time?

**Lesson:**
> One clear takeaway.

**Follow-up Action:**
- [ ] Specific thing to study or practice
- [ ] Resource to read/watch
- [ ] Practice problem to solve

**Status:** 🔴 Not reviewed / 🟡 Studied / 🟢 Mastered

---
```

---

## Example Entries

### Entry #1

**Date:** 2025-03-15
**Company:** Fintech Startup (Series B)
**Role:** Senior Frontend Engineer
**Round:** Technical — Live Coding

**Question:**
> "What will this code log and why?"
> ```js
> const obj = {
>   name: 'Alice',
>   greet: function() {
>     setTimeout(() => {
>       console.log(`Hello, ${this.name}`);
>     }, 100);
>     setTimeout(function() {
>       console.log(`Hi, ${this.name}`);
>     }, 200);
>   }
> };
> obj.greet();
> ```

**My Answer:**
> I said both would print the name. I forgot that the regular function inside `setTimeout` gets its own `this` (which defaults to `undefined` in strict mode or `window` in sloppy mode), so I said both would log "Alice".

**Correct / Better Answer:**
> - First `setTimeout` (arrow function): Logs `"Hello, Alice"` — arrow functions inherit `this` from the enclosing lexical scope, which is the `greet` method where `this === obj`.
> - Second `setTimeout` (regular function): Logs `"Hi, undefined"` — regular functions get their own `this`. When called by `setTimeout`, `this` is the global object (browser: `window`, Node: `Timeout` object), not `obj`. `window.name` is `undefined` (or empty string in browsers).
>
> The fix: use an arrow function, or `bind`, or capture `this` in a variable (`const self = this`).

**Why I Got It Wrong:**
> I *know* the difference between arrow functions and regular functions regarding `this`. But under pressure, I didn't slow down and think through the execution context of each callback separately. I pattern-matched "setTimeout + this" and gave a surface-level answer.

**Lesson:**
> When asked about `this`, always ask: "Who is calling this function, and how?" Trace the call site, not the definition site (except for arrow functions, which have no own `this`).

**Follow-up Action:**
- [x] Re-read MDN article on `this`
- [x] Write 5 variations of `this` tricky code and predict output
- [x] Practice explaining `this` out loud (rubber duck it)

**Status:** 🟢 Mastered

---

### Entry #2

**Date:** 2025-04-22
**Company:** Large E-commerce Platform
**Role:** Full Stack TypeScript Engineer
**Round:** Technical — Whiteboard/Conceptual

**Question:**
> "TypeScript has `Readonly<T>`, but it only makes top-level properties readonly. Can you implement `DeepReadonly<T>` that makes all nested properties readonly too?"

**My Answer:**
> I started with `type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }` but then got stuck when the interviewer asked about edge cases — arrays, functions, primitives. My solution would try to recurse into `string` and `number` types, which doesn't make sense. I couldn't handle the base cases properly.

**Correct / Better Answer:**
> ```ts
> type DeepReadonly<T> =
>   T extends Function
>     ? T
>     : T extends object
>       ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
>       : T;
> ```
>
> Key insights:
> - **Primitives** (`string`, `number`, `boolean`): Already immutable, return as-is. The `T extends object` check handles this — primitives fall through to the `T` branch.
> - **Functions**: Should not be recursed into. Check `T extends Function` first.
> - **Arrays**: `T extends object` catches arrays. `keyof` on an array gives indices + array methods, and `readonly` on mapped array types works correctly in TS.
> - **Optional:** Handle `Map`, `Set`, `Date`, etc. by adding more conditions if needed.

**Why I Got It Wrong:**
> I hadn't practiced recursive conditional types enough. I knew the concept of mapped types and `keyof`, but I hadn't internalized the pattern of "check the base case first, then recurse." This is the same pattern as recursive algorithms — I just hadn't applied it to the type system.

**Lesson:**
> TypeScript's type system is a functional programming language. Treat type-level programming like you treat value-level programming: identify base cases, then recurse. Practice utility type implementations regularly.

**Follow-up Action:**
- [x] Implement `DeepReadonly`, `DeepPartial`, `DeepRequired` from scratch
- [x] Study the source of `type-fest` library for advanced patterns
- [ ] Do 10 TypeScript type challenges on [type-challenges](https://github.com/type-challenges/type-challenges)

**Status:** 🟡 Studied

---

### Entry #3

**Date:** 2025-06-10
**Company:** Healthcare SaaS Startup
**Role:** React/Next.js Developer
**Round:** Technical — Deep Dive Discussion

**Question:**
> "When would you use `useLayoutEffect` instead of `useEffect`? Can you give a concrete example?"

**My Answer:**
> I said something vague like "useLayoutEffect runs before the paint" but couldn't give a real-world example. I also wasn't sure about the exact timing difference. I mumbled something about animations and the interviewer moved on.

**Correct / Better Answer:**
> **`useEffect`** runs **after** the browser paints the screen. It's asynchronous and non-blocking. Use it for most side effects: data fetching, subscriptions, logging.
>
> **`useLayoutEffect`** runs **after** DOM mutations but **before** the browser paints. It's synchronous and blocks the paint. Use it when you need to:
>
> 1. **Measure DOM elements** before the user sees them (e.g., getting element dimensions to position a tooltip).
> 2. **Prevent visual flicker** — if a `useEffect` causes a visible layout shift (e.g., setting position based on a measurement), the user sees a flash. `useLayoutEffect` prevents this because it runs before paint.
>
> **Concrete example — Tooltip positioning:**
> ```jsx
> function Tooltip({ anchorRef, children }) {
>   const tooltipRef = useRef(null);
>   const [position, setPosition] = useState({ top: 0, left: 0 });
>
>   useLayoutEffect(() => {
>     const anchorRect = anchorRef.current.getBoundingClientRect();
>     const tooltipRect = tooltipRef.current.getBoundingClientRect();
>     setPosition({
>       top: anchorRect.bottom + 8,
>       left: anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
>     });
>   }, [anchorRef]);
>
>   return (
>     <div ref={tooltipRef} style={{ position: 'fixed', ...position }}>
>       {children}
>     </div>
>   );
> }
> ```
> If you used `useEffect` here, the tooltip would briefly appear at `(0, 0)` then jump to the correct position — a visible flicker.
>
> **Rule of thumb:** Default to `useEffect`. Only reach for `useLayoutEffect` when you see a visual glitch caused by measuring/mutating the DOM.

**Why I Got It Wrong:**
> I had read about this difference but never encountered the flicker problem in practice, so I didn't have an intuitive understanding. I also hadn't built a component where the distinction mattered.

**Lesson:**
> Don't just read React docs — build small demos that demonstrate each hook's behavior. The difference between "I read it" and "I built it" is the difference between a vague answer and a confident one.

**Follow-up Action:**
- [x] Build a tooltip component using both hooks and observe the flicker
- [x] Read the React docs on useLayoutEffect with the new React 19 docs
- [ ] Review all React hooks and write a one-line summary for each

**Status:** 🟡 Studied

---

### Entry #4

**Date:** 2025-07-03
**Company:** Cloud Infrastructure Company
**Role:** Backend Engineer (Go)
**Round:** Technical — Live Coding

**Question:**
> "Write a function that processes items from a channel with a worker pool. Make sure there are no goroutine leaks."

**My Answer:**
> ```go
> func process(items <-chan string) {
>     for i := 0; i < 5; i++ {
>         go func() {
>             for item := range items {
>                 fmt.Println("Processing:", item)
>             }
>         }()
>     }
> }
> ```
> I forgot that if the channel is never closed, the goroutines will block on `range items` forever — a goroutine leak. I also didn't use a `sync.WaitGroup` to wait for workers to finish, so the function returns immediately and the caller has no way to know when processing is done.

**Correct / Better Answer:**
> ```go
> func process(items <-chan string) {
>     var wg sync.WaitGroup
>     for i := 0; i < 5; i++ {
>         wg.Add(1)
>         go func() {
>             defer wg.Done()
>             for item := range items {
>                 fmt.Println("Processing:", item)
>             }
>         }()
>     }
>     wg.Wait()
> }
> ```
>
> **Critical requirement:** The *sender* must `close(items)` when done sending. This causes `range items` to exit, workers finish, `wg.Wait()` unblocks.
>
> **For cancellation support**, accept a `context.Context`:
> ```go
> func process(ctx context.Context, items <-chan string) {
>     var wg sync.WaitGroup
>     for i := 0; i < 5; i++ {
>         wg.Add(1)
>         go func() {
>             defer wg.Done()
>             for {
>                 select {
>                 case item, ok := <-items:
>                     if !ok { return }
>                     fmt.Println("Processing:", item)
>                 case <-ctx.Done():
>                     return
>                 }
>             }
>         }()
>     }
>     wg.Wait()
> }
> ```

**Why I Got It Wrong:**
> I focused on getting the worker pool pattern right and completely forgot about the lifecycle management. In production, I always close channels, but under interview pressure I jumped straight to the "interesting" part and skipped the fundamentals.

**Lesson:**
> In Go concurrency questions, always address: (1) How do goroutines start? (2) How do they stop? (3) How do you wait for them? (4) What happens on cancellation? If you can't answer all four, your solution has a leak.

**Follow-up Action:**
- [x] Write the worker pool pattern 5 times from memory
- [x] Study `errgroup` package as a cleaner alternative to WaitGroup
- [ ] Read "Go Concurrency Patterns" blog post by the Go team
- [ ] Practice goroutine leak detection with `runtime.NumGoroutine()`

**Status:** 🟡 Studied

---

### Entry #5

**Date:** 2025-08-18
**Company:** Mid-size SaaS Platform
**Role:** Senior Full Stack Engineer
**Round:** System Design

**Question:**
> "Design a URL shortener API. Walk me through the architecture."

**My Answer:**
> I covered the basics well: hashing/encoding, database schema, redirect flow, read-heavy optimization with caching. But when the interviewer asked "How do you prevent abuse?", I blanked. I hadn't considered rate limiting, and I gave a hand-wavy answer about "maybe adding some limits." The interviewer pushed further: "What kind of limits? At what layer? How do you handle distributed rate limiting?" I had no structured answer.

**Correct / Better Answer:**
> **Rate limiting strategy for a URL shortener:**
>
> 1. **Per-user rate limits:**
>    - Authenticated users: 100 URLs/hour, 1000/day
>    - Anonymous users: 10 URLs/hour (by IP)
>    - Implement with a token bucket or sliding window algorithm
>
> 2. **Implementation layers:**
>    - **API Gateway level:** Basic rate limiting (e.g., AWS API Gateway, Nginx `limit_req`)
>    - **Application level:** Business-rule rate limiting (per-user quotas)
>    - **Distributed:** Use Redis with `INCR` + `EXPIRE` for shared counters across instances
>
> 3. **Sliding window with Redis:**
>    ```
>    Key: rate_limit:{user_id}:{window}
>    INCR key
>    EXPIRE key {window_seconds}
>    If count > limit → return 429 Too Many Requests
>    ```
>
> 4. **Additional abuse prevention:**
>    - Block known malicious URLs (phishing, malware) using URL reputation services
>    - CAPTCHA for anonymous users after threshold
>    - Spam detection on bulk creation patterns
>    - URL destination validation (is the target URL reachable?)
>
> 5. **Response:** Return `429 Too Many Requests` with `Retry-After` header

**Why I Got It Wrong:**
> I prepared for system design by focusing on the "happy path" — how to make it work. I didn't prepare for the "unhappy path" — how to make it safe. Rate limiting, abuse prevention, and security should be part of every system design answer.

**Lesson:**
> For every system design question, have a mental checklist: Functional requirements → Non-functional requirements → **Security & Abuse Prevention** → Scaling → Monitoring. Rate limiting is almost always relevant.

**Follow-up Action:**
- [ ] Study rate limiting algorithms: token bucket, sliding window, leaky bucket
- [ ] Learn Redis-based distributed rate limiting patterns
- [ ] Add "security & abuse" section to my system design template
- [ ] Practice 5 system design questions focusing specifically on the abuse/security angle

**Status:** 🔴 Not reviewed

---

## Tips for Turning Failures into Growth

### 1. The 24-Hour Rule
Write your entry within 24 hours. After that, you'll forget the exact question, your exact answer, and the subtle detail that tripped you up.

### 2. Be Brutally Honest
Don't write what you *wish* you'd said. Write what you *actually* said. The gap between those two things is where the learning lives.

### 3. Research the Correct Answer Thoroughly
Don't just write a one-line correction. Go deep. Read the docs, write code, test edge cases. Make the correct answer so solid that you could *teach* it.

### 4. Practice the Follow-up Actions
Writing "study X" means nothing if you never do it. Block time on your calendar. Treat follow-up actions like assignments with deadlines.

### 5. Review Before Every Interview
Before your next interview, re-read your failure log. Focus on entries that are still 🔴 or 🟡. You'll walk in with specific knowledge of your weak spots.

### 6. Notice Patterns
After 5-10 entries, look for patterns:
- Are you consistently weak on a topic? (e.g., concurrency, system design, CSS)
- Are you failing due to knowledge gaps or interview nerves?
- Are you failing at a specific round? (e.g., always passing phone screens but failing system design)

The pattern tells you *what* to study and *how* to practice.

---

## Spaced Repetition Approach

Failed interview questions are perfect for spaced repetition. Here's how:

### The System

1. **After the interview:** Write the entry (Day 0)
2. **Day 1:** Review the correct answer, make sure you understand it
3. **Day 3:** Try to answer the question from memory, check against your notes
4. **Day 7:** Answer it again. Can you explain it to someone else?
5. **Day 14:** One more review. If solid, mark as 🟢
6. **Day 30:** Final check. If you still know it, it's in long-term memory

### Tools for Spaced Repetition

- **Anki** — Create flashcards from your failed questions. Front: the question. Back: the correct answer. Let Anki schedule reviews.
- **Obsidian + Spaced Repetition plugin** — If you use Obsidian for notes
- **Manual calendar reminders** — Simple but effective. Set reminders to review specific entries.

### Flashcard Format

```
Front: What's the difference between useEffect and useLayoutEffect?
       When would you use each?

Back:  useEffect runs after paint (async, non-blocking).
       useLayoutEffect runs before paint (sync, blocks paint).
       Use useLayoutEffect when you need to measure/mutate DOM
       before the user sees it (e.g., tooltip positioning to prevent flicker).
       Default to useEffect for everything else.
```

The goal is not to memorize answers word-for-word. It's to **internalize the concept** so deeply that you can explain it naturally, in your own words, under pressure.

---

## Final Thought

Every senior developer you admire has a trail of failed interviews behind them. The difference isn't that they stopped failing — it's that they stopped failing at the *same things*.

Start your journal today. Your future self will thank you.
