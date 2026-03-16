// GAP #8 — Circuit Breaker Pattern
// Build from scratch. No peeking. Timer: 5 min.
//
// Requirements:
// 1. Three states: CLOSED (normal), OPEN (fail fast), HALF_OPEN (test one)
// 2. Track failure count
// 3. When failures > threshold → OPEN
// 4. After timeout → HALF_OPEN → allow one test request
// 5. If test succeeds → CLOSED. If fails → back to OPEN.
// 6. call(fn, fallback) method — wraps any async function
//
// DELETE THIS COMMENT BLOCK BEFORE YOU START. TYPE FROM MEMORY.

// YOUR CODE BELOW — build CircuitBreaker class
