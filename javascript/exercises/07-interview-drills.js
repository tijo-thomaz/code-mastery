/**
 * ===========================================
 * 07 — Interview Drills (2026 Edition)
 * ===========================================
 * Based on: your 15 failed interviews +
 *           top trending JS questions 2025-2026
 *
 * Sections:
 *   A. Array Manipulation (your #1 failure area)
 *   B. Polyfills — Implement From Scratch
 *   C. Utility Functions (debounce, throttle, memoize, curry, pipe)
 *   D. Output Prediction (this, closures, event loop, hoisting)
 *   E. String & Data Structure Challenges
 *   F. Async Patterns (Promise.all, retry, concurrency limiter)
 *   G. ES2025 Awareness (new features they now ask about)
 *
 * Rules:
 *   1. Try EVERY exercise WITHOUT looking at solutions
 *   2. Time yourself — target times are given
 *   3. If you fail, study the solution, then DELETE and redo
 *   4. Repeat until you can write it from memory
 *
 * Run: node javascript/exercises/07-interview-drills.js
 * ===========================================
 */

// ╔═══════════════════════════════════════════╗
// ║  SECTION A — Array Manipulation Drills    ║
// ║  (Failed at: Wipro, UST x2, Socure, Arrow)║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// A1 — Frequency Count
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Given an array, return an object where keys are
// elements and values are how many times they appear.
//
// frequencyCount(["a","b","a","c","b","a"])
// → { a: 3, b: 2, c: 1 }
// ────────────────────────────────────────────
function A1_frequencyCount(arr) {
  // TODO
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
  }, {})

}

// ────────────────────────────────────────────
// A2 — Most Frequent Element
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐
//
// Return the element that appears the most.
// If tie, return the first one encountered.
//
// mostFrequent([3,1,3,2,1,3]) → 3
// ────────────────────────────────────────────
function A2_mostFrequent(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A3 — Dedup Primitives
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Remove duplicates from an array of primitives.
//
// dedup([1,2,2,3,3,3]) → [1,2,3]
// ────────────────────────────────────────────
function A3_dedupPrimitives(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A4 — Dedup Objects by Key
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Remove duplicate objects based on a given key.
// Keep the LAST occurrence.
//
// dedupByKey(
//   [{ id: 1, email: "a@b.com" }, { id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }],
//   "email"
// )
// → [{ id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }]
// ────────────────────────────────────────────
function A4_dedupByKey(arr, key) {
  // TODO
}

// ────────────────────────────────────────────
// A5 — GroupBy
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐
//
// Group array items by a key. Return object where
// keys are group names and values are arrays of items.
//
// groupBy(
//   [{name:"Apple", type:"fruit"}, {name:"Carrot", type:"veg"}, {name:"Banana", type:"fruit"}],
//   "type"
// )
// → { fruit: [{...}, {...}], veg: [{...}] }
// ────────────────────────────────────────────
function A5_groupBy(arr, key) {
  // TODO
}

// ────────────────────────────────────────────
// A6 — GroupBy with Count
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Same as groupBy but return counts instead of items.
//
// groupByCount([{type:"fruit"},{type:"veg"},{type:"fruit"}], "type")
// → { fruit: 2, veg: 1 }
// ────────────────────────────────────────────
function A6_groupByCount(arr, key) {
  // TODO
}

// ────────────────────────────────────────────
// A7 — Array.from Drills
// ⏱️ Target: 30 seconds each | Difficulty: ⭐⭐
//
// Generate arrays using Array.from:
//   a) [0, 1, 2, 3, 4]
//   b) [1, 2, 3, 4, 5]
//   c) [2, 4, 6, 8, 10]
//   d) [{id:1}, {id:2}, {id:3}]
// ────────────────────────────────────────────
function A7_arrayFromDrills() {
  // TODO: return an object { a, b, c, d } with each array
}

// ────────────────────────────────────────────
// A8 — Flatten Nested Array (from scratch)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Do NOT use .flat(). Implement recursively.
//
// flatten([1, [2, [3, [4, 5]]]]) → [1, 2, 3, 4, 5]
// ────────────────────────────────────────────
function A8_flatten(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A9 — Fibonacci Generator
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Generate first N fibonacci numbers.
//
// fibonacci(8) → [1, 1, 2, 3, 5, 8, 13, 21]
// ────────────────────────────────────────────
function A9_fibonacci(n) {
  // TODO
}

// ────────────────────────────────────────────
// A10 — Is Fibonacci-like Sequence?
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Check if each element = sum of previous two.
//
// isFibLike([1,1,2,3,5,8,13,21]) → true
// isFibLike([1,2,4,8,16])        → false
// ────────────────────────────────────────────
function A10_isFibLike(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A11 — Move Zeros to End
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Move all zeros to end, keep order of non-zeros.
//
// moveZeros([0,1,0,3,12]) → [1,3,12,0,0]
// ────────────────────────────────────────────
function A11_moveZeros(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A12 — Second Largest Element
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Find second largest unique value.
//
// secondLargest([1, 3, 5, 8, 8, 2, 9]) → 8
// ────────────────────────────────────────────
function A12_secondLargest(arr) {
  // TODO
}

// ────────────────────────────────────────────
// A13 — Chunk Array
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Split array into chunks of given size.
//
// chunk([1,2,3,4,5,6,7], 3) → [[1,2,3],[4,5,6],[7]]
// ────────────────────────────────────────────
function A13_chunk(arr, size) {
  // TODO
}

// ────────────────────────────────────────────
// A14 — Array Intersection
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Return elements present in BOTH arrays.
//
// intersection([1,2,3,4], [3,4,5,6]) → [3,4]
// ────────────────────────────────────────────
function A14_intersection(a, b) {
  // TODO
}

// ────────────────────────────────────────────
// A15 — Array Difference
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Return elements in first array but NOT in second.
//
// difference([1,2,3,4], [3,4,5,6]) → [1,2]
// ────────────────────────────────────────────
function A15_difference(a, b) {
  // TODO
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION B — Polyfills (Implement From    ║
// ║  Scratch) — TOP 2026 interview pattern    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// B1 — Implement Array.prototype.myMap
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Implement map from scratch.
// Must handle: callback(element, index, array)
//
// [1,2,3].myMap(x => x * 2) → [2,4,6]
// ────────────────────────────────────────────
function B1_myMap() {
  // TODO: Add to Array.prototype.myMap
  // Return nothing — the test runner will check Array.prototype
}

// ────────────────────────────────────────────
// B2 — Implement Array.prototype.myFilter
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Implement filter from scratch.
//
// [1,2,3,4,5].myFilter(x => x > 3) → [4,5]
// ────────────────────────────────────────────
function B2_myFilter() {
  // TODO: Add to Array.prototype.myFilter
}

// ────────────────────────────────────────────
// B3 — Implement Array.prototype.myReduce
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Implement reduce from scratch.
// Handle: with and without initial value.
// callback(accumulator, currentValue, index, array)
//
// [1,2,3].myReduce((acc, x) => acc + x, 0) → 6
// [1,2,3].myReduce((acc, x) => acc + x)    → 6 (no initial: starts at first element)
// ────────────────────────────────────────────
function B3_myReduce() {
  // TODO: Add to Array.prototype.myReduce
}

// ────────────────────────────────────────────
// B4 — Implement Promise.all
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Takes an array of promises.
// Resolves with array of results when ALL resolve.
// Rejects immediately if ANY rejects.
//
// myPromiseAll([Promise.resolve(1), Promise.resolve(2)])
// → Promise<[1, 2]>
// ────────────────────────────────────────────
function B4_myPromiseAll(promises) {
  // TODO
}

// ────────────────────────────────────────────
// B5 — Implement Promise.allSettled
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Waits for ALL promises to settle (resolve or reject).
// Returns array of { status, value } or { status, reason }.
//
// myAllSettled([Promise.resolve(1), Promise.reject("err")])
// → [{ status:"fulfilled", value:1 }, { status:"rejected", reason:"err" }]
// ────────────────────────────────────────────
function B5_myAllSettled(promises) {
  // TODO
}

// ────────────────────────────────────────────
// B6 — Implement Function.prototype.myBind
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Implement bind from scratch.
// Must handle partial application (pre-filled args).
//
// function greet(greeting, name) { return `${greeting}, ${name}`; }
// const hi = greet.myBind(null, "Hi");
// hi("Tijo") → "Hi, Tijo"
// ────────────────────────────────────────────
function B6_myBind() {
  // TODO: Add to Function.prototype.myBind
}

// ────────────────────────────────────────────
// B7 — Implement Array.prototype.myFlat
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// Implement flat(depth) from scratch.
// Default depth = 1.
//
// [1,[2,[3]]].myFlat()  → [1,2,[3]]
// [1,[2,[3]]].myFlat(Infinity) → [1,2,3]
// ────────────────────────────────────────────
function B7_myFlat() {
  // TODO: Add to Array.prototype.myFlat
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION C — Utility Functions            ║
// ║  (debounce, throttle, memoize, curry,     ║
// ║   pipe, compose, once, deep clone)        ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// C1 — Debounce
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Only calls fn after `delay` ms of inactivity.
// Each new call resets the timer.
// ────────────────────────────────────────────
function C1_debounce(fn, delay) {
  // TODO
}

// ────────────────────────────────────────────
// C2 — Throttle
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Calls fn immediately, then at most once per `interval` ms.
// ────────────────────────────────────────────
function C2_throttle(fn, interval) {
  // TODO
}

// ────────────────────────────────────────────
// C3 — Memoize
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Cache function results based on arguments.
// If called with same args, return cached result.
//
// const memoAdd = memoize((a,b) => a + b);
// memoAdd(1,2) → 3 (computed)
// memoAdd(1,2) → 3 (cached — fn NOT called again)
// ────────────────────────────────────────────
function C3_memoize(fn) {
  // TODO
}

// ────────────────────────────────────────────
// C4 — Once
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Returns a function that calls fn only once.
// Subsequent calls return the first result.
//
// const init = once(() => Math.random());
// init() → 0.42 (computed)
// init() → 0.42 (same result, fn NOT called)
// ────────────────────────────────────────────
function C4_once(fn) {
  // TODO
}

// ────────────────────────────────────────────
// C5 — Curry
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Transform fn(a,b,c) into fn(a)(b)(c).
// Must also work with multiple args: fn(a,b)(c)
//
// const add = curry((a,b,c) => a + b + c);
// add(1)(2)(3)  → 6
// add(1,2)(3)   → 6
// add(1)(2,3)   → 6
// ────────────────────────────────────────────
function C5_curry(fn) {
  // TODO
}

// ────────────────────────────────────────────
// C6 — Pipe (left-to-right composition)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// pipe(f, g, h)(x) === h(g(f(x)))
//
// const transform = pipe(
//   x => x + 1,
//   x => x * 2,
//   x => `Result: ${x}`
// );
// transform(3) → "Result: 8"
// ────────────────────────────────────────────
function C6_pipe(...fns) {
  // TODO
}

// ────────────────────────────────────────────
// C7 — Compose (right-to-left composition)
// ⏱️ Target: 30 seconds | Difficulty: ⭐⭐
//
// compose(f, g, h)(x) === f(g(h(x)))
// (Hint: it's pipe in reverse)
// ────────────────────────────────────────────
function C7_compose(...fns) {
  // TODO
}

// ────────────────────────────────────────────
// C8 — Deep Clone (without structuredClone or JSON)
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Handle: objects, arrays, Date, null, primitives.
// Don't worry about Map/Set/RegExp for now.
//
// const obj = { a: 1, b: { c: 2 }, d: [3,4], e: new Date() };
// const clone = deepClone(obj);
// clone.b.c = 99;
// obj.b.c → still 2 (not affected)
// ────────────────────────────────────────────
function C8_deepClone(obj) {
  // TODO
}

// ────────────────────────────────────────────
// C9 — Event Emitter
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐
//
// Implement:
//   on(event, cb)    → subscribe
//   off(event, cb)   → unsubscribe
//   emit(event, ...args) → trigger all listeners
//   once(event, cb)  → subscribe, auto-unsub after first call
// ────────────────────────────────────────────
function C9_createEventEmitter() {
  // TODO: return { on, off, emit, once }
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION D — Output Prediction            ║
// ║  (this, closures, event loop, hoisting)   ║
// ║  Return your predicted output as an array ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// D1 — Event Loop: Predict the order
//
//   console.log("A");
//   setTimeout(() => console.log("B"), 0);
//   Promise.resolve().then(() => console.log("C"));
//   Promise.resolve().then(() => {
//     console.log("D");
//     setTimeout(() => console.log("E"), 0);
//   });
//   console.log("F");
//
// Return: ["A", "F", ...]
// ────────────────────────────────────────────
function D1_eventLoop() {
  // TODO: return array of strings in execution order
}

// ────────────────────────────────────────────
// D2 — Event Loop (harder)
//
//   setTimeout(() => console.log("1"), 0);
//   Promise.resolve().then(() => {
//     console.log("2");
//     Promise.resolve().then(() => console.log("3"));
//   });
//   Promise.resolve().then(() => console.log("4"));
//   console.log("5");
//
// Return: ["5", ...]
// ────────────────────────────────────────────
function D2_eventLoopHard() {
  // TODO
}

// ────────────────────────────────────────────
// D3 — `this` in setTimeout
//
//   const obj = {
//     x: 10,
//     getX() { return this.x; },
//     getXArrow: () => this.x,
//     getXDelayed() {
//       setTimeout(function() { console.log(this.x); }, 0);   // A
//       setTimeout(() => { console.log(this.x); }, 0);         // B
//     }
//   };
//
//   console.log(obj.getX());       // C
//   console.log(obj.getXArrow());  // D
//   obj.getXDelayed();             // A then B
//
// Return: { C: ??, D: ??, A: ??, B: ?? }
// ────────────────────────────────────────────
function D3_thisKeyword() {
  // TODO: return { C: value, D: value, A: value, B: value }
}

// ────────────────────────────────────────────
// D4 — var in loop closure
//
//   for (var i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
//   }
//
// What gets logged?
// Return: [?, ?, ?]
// BONUS: How do you fix it? (two ways)
// ────────────────────────────────────────────
function D4_varInLoop() {
  // TODO: return the array of values that get logged
}

// ────────────────────────────────────────────
// D5 — Hoisting & TDZ
//
//   console.log(a);        // A
//   console.log(b);        // B — what happens?
//   var a = 1;
//   let b = 2;
//   console.log(typeof c); // C — function not declared yet?
//   function c() {}
//
// Return: { A: ??, B: "ReferenceError" or value, C: ?? }
// ────────────────────────────────────────────
function D5_hoisting() {
  // TODO
}

// ────────────────────────────────────────────
// D6 — Closure over reference
//
//   let val = 1;
//   const getVal = () => val;
//   val = 2;
//   console.log(getVal());  // ??
//
// Return the output
// ────────────────────────────────────────────
function D6_closureRef() {
  // TODO
}

// ────────────────────────────────────────────
// D7 — IIFE + closure
//
//   (function(a) {
//     return (function() {
//       console.log(a);
//       a = 23;
//     })();
//   })(45);
//
// What gets logged?
// ────────────────────────────────────────────
function D7_iife() {
  // TODO
}

// ────────────────────────────────────────────
// D8 — == vs ===
//
// Predict true/false for each:
//   "5" == 5
//   "5" === 5
//   null == undefined
//   null === undefined
//   NaN == NaN
//   0 == false
//   "" == false
//   [] == false
//   [] == ![]
//
// Return: [true/false, true/false, ...]
// ────────────────────────────────────────────
function D8_equality() {
  // TODO: return array of 9 booleans
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION E — String & Data Structure      ║
// ║  Challenges (commonly asked 2025-2026)    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// E1 — Reverse String (without .reverse())
// ⏱️ Target: 30 seconds | Difficulty: ⭐
// ────────────────────────────────────────────
function E1_reverseString(str) {
  // TODO
}

// ────────────────────────────────────────────
// E2 — Palindrome Check
// ⏱️ Target: 45 seconds | Difficulty: ⭐
//
// Ignore case and non-alphanumeric characters.
// isPalindrome("A man, a plan, a canal: Panama") → true
// ────────────────────────────────────────────
function E2_isPalindrome(str) {
  // TODO
}

// ────────────────────────────────────────────
// E3 — Anagram Check
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// isAnagram("listen", "silent") → true
// isAnagram("hello", "world")   → false
// ────────────────────────────────────────────
function E3_isAnagram(a, b) {
  // TODO
}

// ────────────────────────────────────────────
// E4 — Valid Brackets
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// isValid("()[]{}") → true
// isValid("(]")     → false
// isValid("([)]")   → false
// isValid("{[]}")    → true
// ────────────────────────────────────────────
function E4_validBrackets(str) {
  // TODO
}

// ────────────────────────────────────────────
// E5 — First Non-Repeating Character
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// firstUnique("aabccbd") → "d"
// firstUnique("aabb")    → null
// ────────────────────────────────────────────
function E5_firstNonRepeating(str) {
  // TODO
}

// ────────────────────────────────────────────
// E6 — Title Case a String
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// titleCase("hello world from js") → "Hello World From Js"
// ────────────────────────────────────────────
function E6_titleCase(str) {
  // TODO
}

// ────────────────────────────────────────────
// E7 — Count Vowels
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// countVowels("hello world") → 3
// ────────────────────────────────────────────
function E7_countVowels(str) {
  // TODO
}

// ────────────────────────────────────────────
// E8 — Longest Word in a String
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// longestWord("The quick brown fox jumped") → "jumped"
// ────────────────────────────────────────────
function E8_longestWord(str) {
  // TODO
}

// ────────────────────────────────────────────
// E9 — Remove Falsy Values
// ⏱️ Target: 15 seconds | Difficulty: ⭐
//
// compact([0, 1, false, 2, "", 3, null, undefined, NaN])
// → [1, 2, 3]
// ────────────────────────────────────────────
function E9_compact(arr) {
  // TODO
}

// ────────────────────────────────────────────
// E10 — Deep Equal (compare two objects/arrays)
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}}) → true
// deepEqual({a:1}, {a:2}) → false
// deepEqual([1,[2]], [1,[2]]) → true
// ────────────────────────────────────────────
function E10_deepEqual(a, b) {
  // TODO
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION F — Async Pattern Drills         ║
// ║  (Promise patterns, retry, concurrency)   ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// F1 — Sleep / Delay
// ⏱️ Target: 15 seconds | Difficulty: ⭐
//
// await sleep(1000) → resolves after 1 second
// ────────────────────────────────────────────
function F1_sleep(ms) {
  // TODO
}

// ────────────────────────────────────────────
// F2 — Retry with Backoff
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// retry(fn, maxRetries, delayMs)
// Calls fn. If it throws, wait delayMs then retry.
// Double the delay each retry (exponential backoff).
// After maxRetries, reject with last error.
//
// retry(() => fetchData(), 3, 1000)
// → try immediately, fail → wait 1s, fail → wait 2s, fail → reject
// ────────────────────────────────────────────
function F2_retry(fn, maxRetries, delayMs) {
  // TODO: return a Promise
}

// ────────────────────────────────────────────
// F3 — Concurrency Limiter
// ⏱️ Target: 5 minutes | Difficulty: ⭐⭐⭐⭐⭐
//
// Given an array of async task functions and a concurrency limit,
// run at most `limit` tasks at the same time.
// Return a promise that resolves with all results in order.
//
// const tasks = [
//   () => fetch("/api/1"),
//   () => fetch("/api/2"),
//   () => fetch("/api/3"),
//   () => fetch("/api/4"),
// ];
// runWithLimit(tasks, 2) → runs 2 at a time, returns all 4 results
// ────────────────────────────────────────────
function F3_runWithLimit(tasks, limit) {
  // TODO
}

// ────────────────────────────────────────────
// F4 — Promise.race from scratch
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Resolves/rejects as soon as the FIRST promise settles.
// ────────────────────────────────────────────
function F4_myRace(promises) {
  // TODO
}

// ────────────────────────────────────────────
// F5 — Sequential Promise Execution
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// Given array of functions that return promises,
// execute them one after another (NOT in parallel).
// Return array of results in order.
//
// runSequential([() => fetch(1), () => fetch(2), () => fetch(3)])
// → waits for 1 to finish, then starts 2, then 3
// ────────────────────────────────────────────
function F5_runSequential(tasks) {
  // TODO
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION G — ES2025 Awareness             ║
// ║  (New features interviewers ask about)    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// G1 — Set Methods (ES2025)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Use the NEW Set methods (ES2025):
//   .union(), .intersection(), .difference(),
//   .symmetricDifference(), .isSubsetOf()
//
// Given: A = {1,2,3,4}, B = {3,4,5,6}
// Return: { union, intersection, difference, symDiff, isSubset }
// ────────────────────────────────────────────
function G1_setMethods() {
  const A = new Set([1, 2, 3, 4]);
  const B = new Set([3, 4, 5, 6]);
  // TODO: return object with results using the new Set methods
}

// ────────────────────────────────────────────
// G2 — structuredClone (modern deep copy)
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Deep clone this object using structuredClone.
// Know: what it handles (Date, Map, Set, circular refs)
//       what it DOESN'T handle (functions, DOM nodes, Symbols)
// ────────────────────────────────────────────
function G2_structuredClone() {
  const original = {
    name: "Tijo",
    date: new Date(),
    nested: { deep: { value: 42 } },
    arr: [1, 2, 3],
  };
  // TODO: return a deep clone
}

// ────────────────────────────────────────────
// G3 — Optional Chaining + Nullish Coalescing
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Safely access deeply nested property.
// Return the value or a default.
//
// Given: { user: { profile: { name: "Tijo" } } }
// Get user.profile.name → "Tijo"
// Get user.settings.theme → "dark" (default)
// ────────────────────────────────────────────
function G3_optionalChaining(obj) {
  // TODO: return { name, theme }
}

// ────────────────────────────────────────────
// G4 — Object.groupBy (ES2024)
// ⏱️ Target: 30 seconds | Difficulty: ⭐⭐
//
// Use Object.groupBy (not reduce) to group items.
//
// items = [{type:"fruit", name:"Apple"}, {type:"veg", name:"Carrot"}, {type:"fruit", name:"Banana"}]
// → { fruit: [...], veg: [...] }
// ────────────────────────────────────────────
function G4_objectGroupBy() {
  const items = [
    { type: "fruit", name: "Apple" },
    { type: "veg", name: "Carrot" },
    { type: "fruit", name: "Banana" },
  ];
  // TODO: use Object.groupBy
}


// ═══════════════════════════════════════════
// TEST RUNNER — do not modify
// ═══════════════════════════════════════════
async function runTests() {
  console.log("╔═══════════════════════════════════════╗");
  console.log("║   07 — Interview Drills (2026)        ║");
  console.log("╚═══════════════════════════════════════╝\n");

  const test = (name, fn) => {
    try {
      const result = fn();
      console.log(`  ✅ ${name}:`, JSON.stringify(result));
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  };

  const testAsync = async (name, fn) => {
    try {
      const result = await fn();
      console.log(`  ✅ ${name}:`, JSON.stringify(result));
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  };

  // Section A
  console.log("\n── Section A: Array Manipulation ──\n");
  test("A1 frequency", () => A1_frequencyCount(["a", "b", "a", "c", "b", "a"]));
  test("A2 mostFreq", () => A2_mostFrequent([3, 1, 3, 2, 1, 3]));
  test("A3 dedup", () => A3_dedupPrimitives([1, 2, 2, 3, 3, 3]));
  test("A4 dedupByKey", () => A4_dedupByKey([{ id: 1, email: "a@b.com" }, { id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }], "email"));
  test("A5 groupBy", () => A5_groupBy([{ name: "Apple", type: "fruit" }, { name: "Carrot", type: "veg" }, { name: "Banana", type: "fruit" }], "type"));
  test("A6 groupCount", () => A6_groupByCount([{ type: "fruit" }, { type: "veg" }, { type: "fruit" }], "type"));
  test("A7 Array.from", () => A7_arrayFromDrills());
  test("A8 flatten", () => A8_flatten([1, [2, [3, [4, 5]]]]));
  test("A9 fibonacci", () => A9_fibonacci(8));
  test("A10 isFibLike", () => ({ yes: A10_isFibLike([1, 1, 2, 3, 5, 8, 13, 21]), no: A10_isFibLike([1, 2, 4, 8]) }));
  test("A11 moveZeros", () => A11_moveZeros([0, 1, 0, 3, 12]));
  test("A12 secondLargest", () => A12_secondLargest([1, 3, 5, 8, 8, 2, 9]));
  test("A13 chunk", () => A13_chunk([1, 2, 3, 4, 5, 6, 7], 3));
  test("A14 intersection", () => A14_intersection([1, 2, 3, 4], [3, 4, 5, 6]));
  test("A15 difference", () => A15_difference([1, 2, 3, 4], [3, 4, 5, 6]));

  // Section B
  console.log("\n── Section B: Polyfills ──\n");
  B1_myMap(); B2_myFilter(); B3_myReduce(); B6_myBind(); B7_myFlat();
  test("B1 myMap", () => [1, 2, 3].myMap(x => x * 2));
  test("B2 myFilter", () => [1, 2, 3, 4, 5].myFilter(x => x > 3));
  test("B3 myReduce", () => [1, 2, 3].myReduce((a, x) => a + x, 0));
  await testAsync("B4 Promise.all", () => (B4_myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]) || Promise.resolve("not implemented")));
  await testAsync("B5 allSettled", () => B5_myAllSettled([Promise.resolve(1), Promise.reject("err")]).catch(() => "not implemented"));
  test("B7 myFlat", () => [1, [2, [3]]].myFlat(Infinity));

  // Section C
  console.log("\n── Section C: Utility Functions ──\n");
  test("C3 memoize", () => {
    const fn = C3_memoize((a, b) => a + b);
    return [fn(1, 2), fn(1, 2), fn(3, 4)];
  });
  test("C4 once", () => {
    let count = 0;
    const fn = C4_once(() => ++count);
    return [fn(), fn(), fn()];
  });
  test("C5 curry", () => {
    const add = C5_curry((a, b, c) => a + b + c);
    return [add(1)(2)(3), add(1, 2)(3), add(1)(2, 3)];
  });
  test("C6 pipe", () => {
    const fn = C6_pipe(x => x + 1, x => x * 2, x => `Result: ${x}`);
    return fn(3);
  });
  test("C8 deepClone", () => {
    const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
    const clone = C8_deepClone(obj);
    clone.b.c = 99;
    return { original: obj.b.c, clone: clone.b.c };
  });
  test("C9 emitter", () => {
    const ee = C9_createEventEmitter();
    const log = [];
    ee.on("msg", v => log.push(v));
    ee.once("msg", v => log.push("once:" + v));
    ee.emit("msg", "hi");
    ee.emit("msg", "bye");
    return log;
  });

  // Section D
  console.log("\n── Section D: Output Prediction ──\n");
  test("D1 eventLoop", () => D1_eventLoop());
  test("D2 eventLoopHard", () => D2_eventLoopHard());
  test("D3 this", () => D3_thisKeyword());
  test("D4 var loop", () => D4_varInLoop());
  test("D5 hoisting", () => D5_hoisting());
  test("D6 closureRef", () => D6_closureRef());
  test("D7 iife", () => D7_iife());
  test("D8 equality", () => D8_equality());

  // Section E
  console.log("\n── Section E: String & Data Structures ──\n");
  test("E1 reverse", () => E1_reverseString("hello"));
  test("E2 palindrome", () => E2_isPalindrome("A man, a plan, a canal: Panama"));
  test("E3 anagram", () => ({ yes: E3_isAnagram("listen", "silent"), no: E3_isAnagram("hello", "world") }));
  test("E4 brackets", () => ({ a: E4_validBrackets("()[]{}"), b: E4_validBrackets("(]"), c: E4_validBrackets("{[]}") }));
  test("E5 firstUnique", () => E5_firstNonRepeating("aabccbd"));
  test("E6 titleCase", () => E6_titleCase("hello world from js"));
  test("E7 vowels", () => E7_countVowels("hello world"));
  test("E8 longest", () => E8_longestWord("The quick brown fox jumped"));
  test("E9 compact", () => E9_compact([0, 1, false, 2, "", 3, null, undefined, NaN]));
  test("E10 deepEqual", () => ({
    yes: E10_deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }),
    no: E10_deepEqual({ a: 1 }, { a: 2 }),
  }));

  // Section F
  console.log("\n── Section F: Async Patterns ──\n");
  await testAsync("F1 sleep", async () => { await F1_sleep(10); return "slept 10ms"; });
  await testAsync("F4 race", () => F4_myRace([
    new Promise(r => setTimeout(() => r("slow"), 100)),
    new Promise(r => setTimeout(() => r("fast"), 10)),
  ]));
  await testAsync("F5 sequential", () => F5_runSequential([
    () => Promise.resolve(1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
  ]));

  // Section G
  console.log("\n── Section G: ES2025 ──\n");
  test("G2 structuredClone", () => {
    const result = G2_structuredClone();
    return result ? "cloned" : "not implemented";
  });
  test("G3 optionalChaining", () => G3_optionalChaining({ user: { profile: { name: "Tijo" } } }));

  console.log("\n═══════════════════════════════════════");
  console.log("Done! Fill in TODOs, run again, repeat.");
  console.log("═══════════════════════════════════════\n");
}

runTests();
