// ========================================
// DAY 6 — 5 DRILLS (Polyfills + Advanced)
// ========================================

// ---- DRILL 1: myBind polyfill (5 min) ----
// Implement Function.prototype.myBind

Function.prototype.myBind = function (context, ...args) {

};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const boundGreet = greet.myBind({ name: 'Alice' }, 'Hello');
console.log(boundGreet('!')); // Hello, Alice!

// ---- DRILL 2: myReduce polyfill (5 min) ----

Array.prototype.myReduce = function (cb, initialValue) {

};

console.log([1, 2, 3, 4].myReduce((acc, val) => acc + val, 0)); // 10
console.log([1, 2, 3, 4].myReduce((acc, val) => acc + val));    // 10 (no initial)

// ---- DRILL 3: Retry with Exponential Backoff (8 min) ----
// retry(fn, retries, delay) — calls fn, if it fails waits delay, then 2*delay, then 4*delay...

async function retry(fn, retries = 3, delay = 1000) {

}

// Test:
let attempt = 0;
retry(() => {
  attempt++;
  if (attempt < 3) throw new Error('fail');
  return 'success';
}, 3, 100).then(console.log); // "success" after 2 retries

// ---- DRILL 4: Flatten Object (8 min) ----
// Input:  { a: { b: { c: 1 } }, d: 2, e: { f: { g: 3 } } }
// Output: { 'a.b.c': 1, 'd': 2, 'e.f.g': 3 }

function flattenObject(obj, prefix = '', result = {}) {

}

console.log(flattenObject({ a: { b: { c: 1 } }, d: 2, e: { f: { g: 3 } } }));

// ---- DRILL 5: Concurrency Limiter (10 min) ----
// Run async tasks with max N concurrent. Like Promise.all but limited.
// asyncPool(3, urls, fetch) — max 3 fetches at a time

async function asyncPool(limit, items, fn) {

}

// Test with fake async work:
const fakeFetch = (id) => new Promise((res) => {
  console.log(`Start ${id}`);
  setTimeout(() => { console.log(`Done ${id}`); res(id); }, 100);
});

asyncPool(2, [1, 2, 3, 4, 5], fakeFetch).then(console.log);
// Should process max 2 at a time, result: [1, 2, 3, 4, 5]

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
