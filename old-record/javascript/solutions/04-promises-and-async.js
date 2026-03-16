/**
 * ===========================================
 * 04 — Promises and Async — SOLUTIONS
 * ===========================================
 */

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function delayReject(ms, reason) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(reason)), ms));
}

// ── Exercise 1 — Promise Creation ──
function exercise1_promiseCreation(num) {
  return new Promise((resolve, reject) => {
    if (num % 2 === 0) {
      resolve("success");
    } else {
      reject(new Error("odd number"));
    }
  });
}

// WHY: The Promise constructor takes an executor function with resolve/reject.
// resolve(value) transitions the promise to "fulfilled".
// reject(error) transitions it to "rejected".
// Always reject with Error objects (not strings) for proper stack traces.

// ── Exercise 2 — .then Chaining ──
function exercise2_thenChaining(num) {
  return Promise.resolve(num)
    .then(n => n * 2)          // double: 5 → 10
    .then(n => n + 10)         // add 10: 10 → 20
    .then(n => `Result: ${n}`); // prefix: 20 → "Result: 20"
}

// WHY: Each .then() returns a NEW promise, enabling chaining.
// The return value of one .then() becomes the input to the next.
// This flat chain is much more readable than nested callbacks ("callback hell").
// If any .then() throws, it skips to the nearest .catch().

// ── Exercise 3 — Promise.all ──
async function exercise3_promiseAll() {
  const fetchName = () => delay(100, "Alice");
  const fetchAge = () => delay(150, 30);
  const fetchEmail = () => delay(80, "alice@example.com");

  // Promise.all runs all promises in parallel and waits for ALL to resolve.
  // It returns an array of results in the SAME order as the input promises.
  const [name, age, email] = await Promise.all([
    fetchName(),
    fetchAge(),
    fetchEmail(),
  ]);

  return { name, age, email };
}

// WHY: Promise.all is the go-to for parallel async operations.
// Total time = max(individual times), not sum.
// Here: ~150ms instead of ~330ms if done sequentially.
// CRITICAL: If ANY promise rejects, the entire Promise.all rejects.
// Use Promise.allSettled if you need results from all regardless of failures.

// ── Exercise 4 — Promise.allSettled ──
async function exercise4_allSettled(promises) {
  const results = await Promise.allSettled(promises);

  // Each result has: { status: "fulfilled", value } or { status: "rejected", reason }
  const successful = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === "rejected")
    .map(r => r.reason.message);

  return { successful, failed };
}

// WHY: Promise.allSettled NEVER rejects — it waits for ALL promises to settle.
// Each result has a `status` field: "fulfilled" or "rejected".
// Use this when you need to know the outcome of every promise,
// not just fail on the first error (like Promise.all does).
// Common use: batch operations where partial success is acceptable.

// ── Exercise 5 — Promise.race ──
function exercise5_promiseRace(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );

  // Promise.race resolves/rejects with the FIRST promise to settle.
  return Promise.race([promise, timeout]);
}

// WHY: Promise.race returns the result of whichever promise settles first.
// Perfect for implementing timeouts: race the real work against a timer.
// If the real promise wins → you get the result.
// If the timeout wins → you get a rejection.
// Note: the "losing" promise still runs — race doesn't cancel it.
// For cancellation, you'd need AbortController.

// ── Exercise 6 — async/await Basics ──
async function exercise6_asyncAwait() {
  const fetchId = () => delay(50, 42);
  const fetchProfile = (id) => delay(50, { userId: id, name: "Alice" });
  const fetchPosts = (userId) => delay(50, ["post1", "post2"]);

  // async/await makes async code read like synchronous code.
  // Each await pauses execution until the promise resolves.
  const id = await fetchId();
  const profile = await fetchProfile(id);
  const posts = await fetchPosts(profile.userId);

  return { ...profile, posts };
}

// WHY: async/await is syntactic sugar over .then() chains.
// It makes the sequential flow obvious and error handling intuitive (try/catch).
// The function pauses at each await without blocking the event loop.
// Under the hood, the JS engine transforms this into a state machine of .then() calls.

// ── Exercise 7 — Error Handling with try/catch ──
async function exercise7_errorHandling(promiseFactories) {
  const errors = [];

  // Try each factory sequentially — stop at first success
  for (const factory of promiseFactories) {
    try {
      const result = await factory();
      return result; // First success — return immediately
    } catch (error) {
      errors.push(error);
    }
  }

  // All failed — throw AggregateError with all collected errors
  throw new AggregateError(errors, "All promises failed");
}

// WHY: This implements a "fallback" pattern — try multiple sources until one works.
// We use promiseFactories (functions that create promises) instead of promises directly,
// because a promise starts executing immediately on creation.
// AggregateError (ES2021) groups multiple errors — used by Promise.any internally.
// try/catch with await is the standard way to handle async errors.

// ── Exercise 8 — Sequential vs Parallel Execution ──
function exercise8_sequentialVsParallel() {
  async function runSequential(tasks) {
    const results = [];
    for (const task of tasks) {
      // Each task waits for the previous one to complete
      results.push(await task());
    }
    return results;
  }

  async function runParallel(tasks) {
    // All tasks start simultaneously — Promise.all waits for all
    return Promise.all(tasks.map(task => task()));
  }

  return { runSequential, runParallel };
}

// WHY: Sequential is O(sum of times), parallel is O(max time).
// Sequential: await in a loop — each iteration waits. Use when tasks depend on each other.
// Parallel: Promise.all — all tasks run concurrently. Use when tasks are independent.
// Common mistake: using await in a loop when tasks could run in parallel.
// Example: 3 tasks × 50ms each → sequential: ~150ms, parallel: ~50ms.

// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 04 Solutions ===\n");

  console.log("Ex1 even:", await exercise1_promiseCreation(4));
  try { await exercise1_promiseCreation(3); } catch (e) { console.log("Ex1 odd:", e.message); }

  console.log("Ex2:", await exercise2_thenChaining(5));
  console.log("Ex3:", await exercise3_promiseAll());

  console.log("Ex4:", await exercise4_allSettled([
    delay(50, "ok1"), delayReject(50, "fail1"), delay(50, "ok2"), delayReject(50, "fail2"),
  ]));

  console.log("Ex5 fast:", await exercise5_promiseRace(delay(50, "fast"), 200));
  try { await exercise5_promiseRace(delay(500, "slow"), 100); }
  catch (e) { console.log("Ex5 timeout:", e.message); }

  console.log("Ex6:", await exercise6_asyncAwait());

  console.log("Ex7:", await exercise7_errorHandling([
    () => delayReject(30, "s1 down"),
    () => delayReject(30, "s2 down"),
    () => delay(30, "s3 ok!"),
  ]));

  const { runSequential, runParallel } = exercise8_sequentialVsParallel();
  const tasks = [() => delay(50, "a"), () => delay(50, "b"), () => delay(50, "c")];
  const s1 = Date.now(); const seq = await runSequential(tasks); const st = Date.now() - s1;
  const s2 = Date.now(); const par = await runParallel(tasks); const pt = Date.now() - s2;
  console.log(`Ex8 sequential: ${JSON.stringify(seq)} (${st}ms)`);
  console.log(`Ex8 parallel: ${JSON.stringify(par)} (${pt}ms)`);
}

runTests();
