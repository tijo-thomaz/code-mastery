// ========================================
// DAY 4 — 5 DRILLS
// ========================================

// ---- DRILL 1: Debounce (5 min) ----
// Implement debounce: delays function execution until user stops calling for `delay` ms.
// Usage: const debouncedFn = debounce(fn, 300)

function debounce(fn, delay) {

}

// ---- DRILL 2: Throttle (5 min) ----
// Implement throttle: function can only fire once per `limit` ms.

function throttle(fn, limit) {

}

// ---- DRILL 3: Flatten array recursively (5 min) ----
// Input:  [1, [2, [3, [4]], 5]]
// Output: [1, 2, 3, 4, 5]
// Do NOT use .flat()

function flatten(arr) {

}
console.log(flatten([1, [2, [3, [4]], 5]]));

// ---- DRILL 4: Array.from + Range function (3 min) ----
// Create a range function: range(1, 5) → [1, 2, 3, 4, 5]

function range(start, end) {

}
console.log(range(1, 5));
console.log(range(3, 7));

// ---- DRILL 5: Memoize (5 min) ----
// Implement memoize: caches results of expensive function calls.
// const memoAdd = memoize((a, b) => a + b)
// memoAdd(1, 2) → computes 3
// memoAdd(1, 2) → returns cached 3

function memoize(fn) {

}

const slowDouble = memoize((n) => {
  console.log('computing...');
  return n * 2;
});
console.log(slowDouble(5)); // computing... 10
console.log(slowDouble(5)); // 10 (no "computing...")
console.log(slowDouble(3)); // computing... 6

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
