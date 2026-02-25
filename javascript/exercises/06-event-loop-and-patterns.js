/**
 * ===========================================
 * 06 — Event Loop and Patterns
 * ===========================================
 * Topics: event loop output prediction,
 *         microtask vs macrotask, debounce,
 *         throttle, pub/sub, observer pattern
 *
 * Run:  node exercises/06-event-loop-and-patterns.js
 * ===========================================
 */

// ────────────────────────────────────────────
// Exercise 1 — Event Loop Output Prediction
// Difficulty: ⭐⭐⭐
//
// WITHOUT running the code, predict the output order.
// Then return the predicted order as an array of strings.
//
// Code:
//   console.log("1");
//   setTimeout(() => console.log("2"), 0);
//   Promise.resolve().then(() => console.log("3"));
//   Promise.resolve().then(() => {
//     console.log("4");
//     setTimeout(() => console.log("5"), 0);
//   });
//   setTimeout(() => {
//     console.log("6");
//     Promise.resolve().then(() => console.log("7"));
//   }, 0);
//   console.log("8");
//
// Return the order as: ["1", "8", "3", ...]
// ────────────────────────────────────────────
function exercise1_eventLoopPrediction() {
  // TODO: return an array of strings in the correct execution order
}

// ────────────────────────────────────────────
// Exercise 2 — Microtask vs Macrotask
// Difficulty: ⭐⭐⭐
//
// Explain the difference between microtasks and macrotasks
// by implementing a function that schedules both and
// demonstrates their execution order.
//
// Create a function that:
//   - Pushes messages to a `log` array in the order they execute
//   - Schedules: setTimeout (macro), Promise.then (micro),
//     queueMicrotask (micro), setTimeout (macro)
//   - Returns a promise that resolves with the log array
//     after all tasks have run
//
// Expected log order demonstrates: sync → microtasks → macrotasks
// ────────────────────────────────────────────
function exercise2_microtaskMacrotask() {
  // TODO: implement — return a Promise that resolves with the log array
}

// ────────────────────────────────────────────
// Exercise 3 — Debounce Implementation
// Difficulty: ⭐⭐⭐
//
// Implement `debounce(fn, delayMs)` that:
//   - Returns a new function
//   - Only calls fn after delayMs of inactivity
//   - If called again before delayMs, resets the timer
//   - The returned function should also have a .cancel() method
//
// Example: a search input that waits for the user to stop typing.
// ────────────────────────────────────────────
function exercise3_debounce(fn, delayMs) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 4 — Throttle Implementation
// Difficulty: ⭐⭐⭐
//
// Implement `throttle(fn, intervalMs)` that:
//   - Returns a new function
//   - Calls fn immediately on first invocation
//   - Ignores subsequent calls within intervalMs
//   - After intervalMs passes, the next call goes through
//
// Example: scroll event handler that fires at most once per 200ms.
// ────────────────────────────────────────────
function exercise4_throttle(fn, intervalMs) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — Pub/Sub Pattern
// Difficulty: ⭐⭐⭐
//
// Implement an EventEmitter with:
//   - on(event, callback)   → subscribe to an event
//   - off(event, callback)  → unsubscribe from an event
//   - emit(event, ...args)  → trigger all callbacks for an event
//   - once(event, callback) → subscribe but auto-unsubscribe after first call
//
// Return a createEventEmitter() factory function.
// ────────────────────────────────────────────
function exercise5_pubSub() {
  // TODO: implement createEventEmitter
}

// ────────────────────────────────────────────
// Exercise 6 — Observer Pattern
// Difficulty: ⭐⭐⭐
//
// Implement an observable store (like a simple Redux):
//
//   createStore(initialState) returns:
//     - getState()              → returns current state
//     - setState(updater)       → updater is (prevState) => newState
//     - subscribe(listener)     → listener called with new state on change
//                                 returns an unsubscribe function
//
// Example:
//   const store = createStore({ count: 0 });
//   const unsub = store.subscribe(state => console.log(state));
//   store.setState(prev => ({ count: prev.count + 1 }));
//   // listener fires with { count: 1 }
//   unsub(); // stops listening
// ────────────────────────────────────────────
function exercise6_observer() {
  // TODO: implement createStore
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 06 Event Loop and Patterns ===\n");

  try {
    const order = exercise1_eventLoopPrediction();
    console.log("Ex1 predicted order:", order);
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const log = await exercise2_microtaskMacrotask();
    console.log("Ex2 micro/macro order:", log);
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    let debounceResult = null;
    const debounced = exercise3_debounce((val) => { debounceResult = val; }, 100);
    debounced("a"); debounced("b"); debounced("c");
    await new Promise(r => setTimeout(r, 150));
    console.log("Ex3 debounce (should be 'c'):", debounceResult);
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const calls = [];
    const throttled = exercise4_throttle((val) => calls.push(val), 100);
    throttled("a"); throttled("b"); throttled("c");
    await new Promise(r => setTimeout(r, 150));
    throttled("d");
    console.log("Ex4 throttle (should be ['a','d']):", calls);
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    const createEventEmitter = exercise5_pubSub();
    const ee = createEventEmitter();
    const received = [];
    ee.on("data", (v) => received.push(v));
    ee.once("data", (v) => received.push("once:" + v));
    ee.emit("data", "hello");
    ee.emit("data", "world");
    console.log("Ex5 pub/sub:", received);
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const createStore = exercise6_observer();
    const store = createStore({ count: 0 });
    const logs = [];
    const unsub = store.subscribe(state => logs.push(state.count));
    store.setState(prev => ({ count: prev.count + 1 }));
    store.setState(prev => ({ count: prev.count + 1 }));
    unsub();
    store.setState(prev => ({ count: prev.count + 1 }));
    console.log("Ex6 observer (should be [1, 2]):", logs);
    console.log("Ex6 final state:", store.getState());
  } catch (e) { console.log("Ex6 error:", e.message); }
}

runTests();
