/**
 * ===========================================
 * 02 — Functions and Closures
 * ===========================================
 * Topics: closures, IIFE, higher-order functions,
 *         currying, memoization, function composition,
 *         rest/spread, arrow vs regular (this)
 *
 * Run:  node exercises/02-functions-and-closures.js
 * ===========================================
 */

// ────────────────────────────────────────────
// Exercise 1 — Closures: Counter
// Difficulty: ⭐⭐
//
// Create a function that returns a counter object
// with methods: increment(), decrement(), getCount()
//
// The count should be private (not directly accessible).
// Starting count = 0.
//
// Example:
//   const c = exercise1_counter();
//   c.increment(); c.increment(); c.decrement();
//   c.getCount() → 1
// ────────────────────────────────────────────
function exercise1_counter() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 2 — IIFE
// Difficulty: ⭐⭐
//
// Use an Immediately Invoked Function Expression to
// create a module that exposes:
//   - getId()  → returns an auto-incrementing id (starts at 1)
//   - reset()  → resets the counter back to 0
//
// Return the module object from this function.
// The internal counter should not be accessible from outside.
// ────────────────────────────────────────────
function exercise2_iife() {
  // TODO: implement using (function() { ... })()
}

// ────────────────────────────────────────────
// Exercise 3 — Higher-Order Functions
// Difficulty: ⭐⭐
//
// Implement `myMap(array, transformFn)` that behaves
// like Array.prototype.map but written from scratch.
// Do NOT use .map() internally.
//
// Then implement `myFilter(array, predicateFn)`.
// Do NOT use .filter() internally.
//
// Return { myMap, myFilter }
// ────────────────────────────────────────────
function exercise3_higherOrder() {
  // TODO: implement myMap and myFilter
}

// ────────────────────────────────────────────
// Exercise 4 — Currying
// Difficulty: ⭐⭐⭐
//
// Implement a `curry` function that transforms a
// function of N arguments into a chain of functions
// each taking 1 argument.
//
// Example:
//   const add = (a, b, c) => a + b + c;
//   const curried = curry(add);
//   curried(1)(2)(3) → 6
//   curried(1, 2)(3) → 6  (should also support partial application)
// ────────────────────────────────────────────
function exercise4_curry(fn) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — Memoization
// Difficulty: ⭐⭐⭐
//
// Implement a `memoize` function that caches the result
// of a function based on its arguments.
//
// Requirements:
//   - Cache results for previously seen arguments
//   - Works with multiple arguments (use JSON.stringify as key)
//   - Return the cached result when called with same args
//
// Example:
//   let callCount = 0;
//   const expensive = (n) => { callCount++; return n * 2; };
//   const memoized = memoize(expensive);
//   memoized(5) → 10 (callCount = 1)
//   memoized(5) → 10 (callCount still 1)
// ────────────────────────────────────────────
function exercise5_memoize(fn) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 6 — Function Composition
// Difficulty: ⭐⭐⭐
//
// Implement `compose(...fns)` that takes multiple
// functions and returns a new function that applies
// them RIGHT to LEFT.
//
// Also implement `pipe(...fns)` that applies LEFT to RIGHT.
//
// Example:
//   const double = x => x * 2;
//   const addOne = x => x + 1;
//   compose(addOne, double)(5) → 11  (double first, then addOne)
//   pipe(double, addOne)(5)    → 11  (double first, then addOne)
//
// Return { compose, pipe }
// ────────────────────────────────────────────
function exercise6_composition() {
  // TODO: implement compose and pipe
}

// ────────────────────────────────────────────
// Exercise 7 — Rest/Spread in Functions
// Difficulty: ⭐⭐
//
// Implement a function `mergeObjects(...objects)` that
// takes any number of objects and merges them into one.
// Later objects override earlier ones.
//
// Also implement `sumAll(...numbers)` that sums all
// arguments using rest parameters.
//
// Return { mergeObjects, sumAll }
// ────────────────────────────────────────────
function exercise7_restSpread() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 8 — Arrow vs Regular Functions (this)
// Difficulty: ⭐⭐⭐
//
// Create an object `timer` with:
//   - seconds: 0
//   - startRegular(): uses setInterval with a REGULAR
//     function — demonstrate that `this` is lost
//   - startArrow(): uses setInterval with an ARROW
//     function — demonstrate that `this` is preserved
//
// For this exercise, just simulate the behavior:
//   Return an object { regularThis, arrowThis } where:
//     regularThis = what `this` refers to in a regular
//                   function callback (describe as string)
//     arrowThis   = what `this` refers to in an arrow
//                   function callback (describe as string)
//
// Also include a method getThisDemo() that returns
// { regular, arrow } where each is the actual `this` value
// captured in the respective function styles.
// ────────────────────────────────────────────
function exercise8_arrowVsRegular() {
  // TODO: implement
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 02 Functions and Closures ===\n");

  try {
    const c = exercise1_counter();
    c.increment(); c.increment(); c.decrement();
    console.log("Ex1 counter:", c.getCount());
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const mod = exercise2_iife();
    console.log("Ex2 IIFE:", mod.getId(), mod.getId(), (mod.reset(), mod.getId()));
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    const { myMap, myFilter } = exercise3_higherOrder();
    console.log("Ex3 myMap:", myMap([1,2,3], x => x * 2));
    console.log("Ex3 myFilter:", myFilter([1,2,3,4,5], x => x % 2 === 0));
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const add = (a, b, c) => a + b + c;
    const curried = exercise4_curry(add);
    console.log("Ex4 curry:", curried(1)(2)(3), curried(1, 2)(3));
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    let calls = 0;
    const fn = (n) => { calls++; return n * 2; };
    const memo = exercise5_memoize(fn);
    memo(5); memo(5); memo(10);
    console.log("Ex5 memoize:", memo(5), "calls:", calls);
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const { compose, pipe } = exercise6_composition();
    const double = x => x * 2;
    const addOne = x => x + 1;
    console.log("Ex6 compose:", compose(addOne, double)(5));
    console.log("Ex6 pipe:", pipe(double, addOne)(5));
  } catch (e) { console.log("Ex6 error:", e.message); }

  try {
    const { mergeObjects, sumAll } = exercise7_restSpread();
    console.log("Ex7 merge:", mergeObjects({ a: 1 }, { b: 2 }, { a: 3 }));
    console.log("Ex7 sum:", sumAll(1, 2, 3, 4, 5));
  } catch (e) { console.log("Ex7 error:", e.message); }

  try {
    const r8 = exercise8_arrowVsRegular();
    console.log("Ex8 this:", r8);
  } catch (e) { console.log("Ex8 error:", e.message); }
}

runTests();
