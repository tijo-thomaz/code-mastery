/**
 * ===========================================
 * 04 — Promises and Async
 * ===========================================
 * Topics: Promise creation, .then chaining,
 *         Promise.all, Promise.allSettled,
 *         Promise.race, async/await, error handling,
 *         sequential vs parallel execution
 *
 * Run:  node exercises/04-promises-and-async.js
 * ===========================================
 */

// Helper: simulates an async operation
function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function delayReject(ms, reason) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(reason)), ms));
}

// ────────────────────────────────────────────
// Exercise 1 — Promise Creation
// Difficulty: ⭐⭐
//
// Create a function that returns a Promise which:
//   - Resolves with "success" if the input number is even
//   - Rejects with Error("odd number") if the input is odd
//
// Do NOT use async/await — use the Promise constructor.
// ────────────────────────────────────────────
function exercise1_promiseCreation(num) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 2 — .then Chaining
// Difficulty: ⭐⭐
//
// Given a starting number, create a promise chain that:
//   1. Doubles the number
//   2. Adds 10
//   3. Converts to string with "Result: " prefix
//
// Return the promise chain (don't use async/await).
//
// Example: exercise2_thenChaining(5) → Promise("Result: 20")
// ────────────────────────────────────────────
function exercise2_thenChaining(num) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 3 — Promise.all
// Difficulty: ⭐⭐
//
// Simulate fetching user data from 3 "APIs":
//   - fetchName():  delay(100, "Alice")
//   - fetchAge():   delay(150, 30)
//   - fetchEmail(): delay(80, "alice@example.com")
//
// Use Promise.all to fetch all three in parallel and
// return a combined user object: { name, age, email }
//
// Return the promise.
// ────────────────────────────────────────────
async function exercise3_promiseAll() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 4 — Promise.allSettled
// Difficulty: ⭐⭐
//
// Given an array of promises (some may reject),
// use Promise.allSettled to return an object:
//   {
//     successful: [array of fulfilled values],
//     failed: [array of rejection reasons (strings)]
//   }
// ────────────────────────────────────────────
async function exercise4_allSettled(promises) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — Promise.race
// Difficulty: ⭐⭐
//
// Implement a `fetchWithTimeout(promise, ms)` function
// that races the given promise against a timeout.
//
// If the promise resolves before the timeout → return its value
// If the timeout wins → reject with Error("Timeout")
// ────────────────────────────────────────────
function exercise5_promiseRace(promise, ms) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 6 — async/await Basics
// Difficulty: ⭐⭐
//
// Rewrite this .then chain using async/await:
//
//   function getUser() {
//     return fetchId()
//       .then(id => fetchProfile(id))
//       .then(profile => fetchPosts(profile.userId))
//       .then(posts => ({ ...profile, posts }));
//   }
//
// Simulate with these helpers:
//   fetchId      → delay(50, 42)
//   fetchProfile → delay(50, { userId: id, name: "Alice" })
//   fetchPosts   → delay(50, ["post1", "post2"])
//
// Return the combined object { userId, name, posts }
// ────────────────────────────────────────────
async function exercise6_asyncAwait() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 7 — Error Handling with try/catch
// Difficulty: ⭐⭐⭐
//
// Implement a `resilientFetch(urls)` function that:
//   - Takes an array of URLs (simulated as promises)
//   - Tries each one sequentially
//   - Returns the first successful result
//   - If ALL fail, throws an AggregateError with all errors
//
// Use async/await with try/catch.
//
// Simulate: pass an array of promises (some reject, one resolves).
// ────────────────────────────────────────────
async function exercise7_errorHandling(promiseFactories) {
  // TODO: implement
  // promiseFactories is an array of functions that return promises
  // e.g., [() => delayReject(50, "fail1"), () => delay(50, "success")]
}

// ────────────────────────────────────────────
// Exercise 8 — Sequential vs Parallel Execution
// Difficulty: ⭐⭐⭐
//
// Given an array of async task functions, implement:
//
//   runSequential(tasks) — runs tasks one after another,
//                          returns array of results
//   runParallel(tasks)   — runs all tasks simultaneously,
//                          returns array of results
//
// Measure and log the time difference.
//
// Return { runSequential, runParallel }
// ────────────────────────────────────────────
function exercise8_sequentialVsParallel() {
  // TODO: implement runSequential and runParallel

  return { runSequential, runParallel };
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 04 Promises and Async ===\n");

  try {
    const r1a = await exercise1_promiseCreation(4);
    console.log("Ex1 even:", r1a);
    try { await exercise1_promiseCreation(3); } catch (e) { console.log("Ex1 odd:", e.message); }
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const r2 = await exercise2_thenChaining(5);
    console.log("Ex2 chaining:", r2);
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    const r3 = await exercise3_promiseAll();
    console.log("Ex3 Promise.all:", r3);
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const r4 = await exercise4_allSettled([
      delay(50, "ok1"),
      delayReject(50, "fail1"),
      delay(50, "ok2"),
      delayReject(50, "fail2"),
    ]);
    console.log("Ex4 allSettled:", r4);
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    const fast = await exercise5_promiseRace(delay(50, "fast"), 200);
    console.log("Ex5 race (fast):", fast);
    try {
      await exercise5_promiseRace(delay(500, "slow"), 100);
    } catch (e) { console.log("Ex5 race (timeout):", e.message); }
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const r6 = await exercise6_asyncAwait();
    console.log("Ex6 async/await:", r6);
  } catch (e) { console.log("Ex6 error:", e.message); }

  try {
    const r7 = await exercise7_errorHandling([
      () => delayReject(30, "server1 down"),
      () => delayReject(30, "server2 down"),
      () => delay(30, "server3 ok!"),
    ]);
    console.log("Ex7 resilient:", r7);
  } catch (e) { console.log("Ex7 error:", e.message); }

  try {
    const { runSequential, runParallel } = exercise8_sequentialVsParallel();
    const tasks = [
      () => delay(50, "a"),
      () => delay(50, "b"),
      () => delay(50, "c"),
    ];
    const start1 = Date.now();
    const seq = await runSequential(tasks);
    const seqTime = Date.now() - start1;
    const start2 = Date.now();
    const par = await runParallel(tasks);
    const parTime = Date.now() - start2;
    console.log(`Ex8 sequential: ${JSON.stringify(seq)} (${seqTime}ms)`);
    console.log(`Ex8 parallel: ${JSON.stringify(par)} (${parTime}ms)`);
  } catch (e) { console.log("Ex8 error:", e.message); }
}

runTests();
