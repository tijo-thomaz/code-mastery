/**
 * ═══════════════════════════════════════════════════════════════════
 * 08 — Advanced JavaScript Interview Drills — SOLUTIONS
 * ═══════════════════════════════════════════════════════════════════
 * EXPERION ROUND 2 — Advanced JS they'll ask you to BUILD.
 * 🧠 Read → Close → Write from memory → Repeat until automatic.
 * Run: node javascript/exercises/08-advanced-interview-SOLUTIONS.js
 * ═══════════════════════════════════════════════════════════════════
 */


// ═══════════════════════════════════════════════════════════════
// SECTION A: Closures Deep Cuts
// "Implement X" — they want to see you BUILD it
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// A1 ⭐⭐ | var vs let in loops — Output Prediction
// ⏱️ Must explain in 30s
// ───────────────────────────────────────────────────────────────

console.log("=== A1: var vs let ===");

// ❌ var — function-scoped, all closures share same i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0);
}
// Output: var: 3, var: 3, var: 3
// WHY: By the time setTimeout runs, loop is done, i = 3

// ✅ Fix 1: let — block-scoped, each iteration gets own copy
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 50);
}
// Output: let: 0, let: 1, let: 2

// ✅ Fix 2: IIFE — creates new scope per iteration
for (var k = 0; k < 3; k++) {
  (function (x) {
    setTimeout(() => console.log("IIFE:", x), 100);
  })(k);
}
// Output: IIFE: 0, IIFE: 1, IIFE: 2

// 🔥 SAY THIS: "var is function-scoped — all iterations share the same
// variable. By the time setTimeout fires, the loop is done and i is 3.
// let is block-scoped — each iteration creates a new binding.
// Before ES6, the fix was an IIFE to create a new scope."


// ───────────────────────────────────────────────────────────────
// A2 ⭐⭐ | createCounter — Closure Factory
// ⏱️ Target: under 60s from blank
// ───────────────────────────────────────────────────────────────

function createCounter(initial = 0) {
  let count = initial; // enclosed — private to the closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => {
      count = initial;
      return count;
    },
    getCount: () => count,
  };
}

console.log("\n=== A2: createCounter ===");
const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset());     // 10
console.log(counter.getCount());  // 10

// 🔥 SAY THIS: "This is data privacy via closures. count is not on
// the returned object — it's enclosed in the function scope. Only the
// returned methods can access it. This is the module pattern."


// ───────────────────────────────────────────────────────────────
// A3 ⭐⭐⭐ | once(fn) — Runs only first time
// ⏱️ Target: under 45s from blank
// ───────────────────────────────────────────────────────────────

function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

console.log("\n=== A3: once ===");
const initOnce = once((x) => {
  console.log("Initialized with:", x);
  return x * 2;
});
console.log(initOnce(5));  // "Initialized with: 5" → 10
console.log(initOnce(99)); // 10 (second call returns cached result, no log)
console.log(initOnce(1));  // 10

// 🔥 SAY THIS: "once is a higher-order function that wraps fn.
// Closure holds called flag and cached result. After first call,
// it always returns the cached result without calling fn again.
// Use case: database connection init, one-time setup."


// ───────────────────────────────────────────────────────────────
// A4 ⭐⭐⭐ | memoize(fn) — Cache results by arguments
// ⏱️ Target: under 60s from blank
// ───────────────────────────────────────────────────────────────

function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("  (cache hit)");
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

console.log("\n=== A4: memoize ===");
const slowSquare = memoize((n) => {
  console.log("  Computing...");
  return n * n;
});
console.log(slowSquare(5));  // Computing... 25
console.log(slowSquare(5));  // (cache hit) 25
console.log(slowSquare(3));  // Computing... 9
console.log(slowSquare(3));  // (cache hit) 9

// 🔥 SAY THIS: "Memoize is a HOF that caches function results.
// Key = JSON.stringify(args). If key exists in Map, return cached.
// Otherwise compute, cache, return. Limitation: JSON.stringify
// doesn't handle circular refs or functions as args."


// ═══════════════════════════════════════════════════════════════
// SECTION B: Promises & Async Advanced
// "Implement retry with backoff" — senior-level question
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// B1 ⭐⭐ | Promise.all vs allSettled vs race vs any
// ⏱️ Must explain all 4 in under 60s
// ───────────────────────────────────────────────────────────────

console.log("\n=== B1: Promise Methods ===");

// ┌──────────────────────────────────────────────────────────────┐
// │ Method        │ Resolves when         │ Rejects when        │
// ├──────────────────────────────────────────────────────────────┤
// │ Promise.all       │ ALL resolve       │ FIRST rejects       │
// │ Promise.allSettled │ ALL settle       │ NEVER rejects       │
// │ Promise.race      │ FIRST settles    │ FIRST settles       │
// │ Promise.any       │ FIRST resolves   │ ALL reject           │
// └──────────────────────────────────────────────────────────────┘

const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (v, ms) => new Promise((_, r) => setTimeout(() => r(v), ms));

// Promise.all — ALL succeed or fail fast
Promise.all([ok("A", 10), ok("B", 20)])
  .then((r) => console.log("all:", r)); // ["A", "B"]

// Promise.allSettled — always resolves, gives status of each
Promise.allSettled([ok("A", 10), fail("err", 20)])
  .then((r) => console.log("allSettled:", r.map((x) => x.status)));
// ["fulfilled", "rejected"]

// Promise.race — first to settle wins (resolve OR reject)
Promise.race([ok("fast", 10), ok("slow", 100)])
  .then((r) => console.log("race:", r)); // "fast"

// Promise.any — first to RESOLVE wins (ignores rejections)
Promise.any([fail("err1", 10), ok("winner", 20)])
  .then((r) => console.log("any:", r)); // "winner"

// 🔥 SAY THIS: "all = parallel, fail fast. allSettled = parallel, never
// fails, gives status of each. race = first to settle wins. any = first
// to RESOLVE wins, ignores rejections. I use all for independent parallel
// tasks, allSettled when I need results of all regardless of failures."


// ───────────────────────────────────────────────────────────────
// B2 ⭐ | sleep(ms)
// ⏱️ Target: instant (10s)
// ───────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Usage: await sleep(1000); // pause 1 second


// ───────────────────────────────────────────────────────────────
// B3 ⭐⭐⭐ | retry with exponential backoff
// ⏱️ Target: under 2 min from blank
// ───────────────────────────────────────────────────────────────

async function retry(fn, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      const backoff = delay * Math.pow(2, attempt);
      console.log(`  Retry ${attempt + 1} in ${backoff}ms...`);
      await sleep(backoff);
    }
  }
}

console.log("\n=== B3: retry ===");
let callCount = 0;
retry(
  () => {
    callCount++;
    if (callCount < 3) throw new Error("fail");
    return "success!";
  },
  3,
  100
).then((r) => console.log("retry result:", r)); // "success!" after 2 retries

// 🔥 SAY THIS: "Exponential backoff: delay doubles each attempt —
// 1s, 2s, 4s, 8s. This prevents overwhelming a recovering server.
// I use this pattern for API calls, payment processing, and any
// transient error scenario."


// ───────────────────────────────────────────────────────────────
// B4 ⭐⭐⭐⭐ | Implement Promise.all from scratch
// ⏱️ Target: under 3 min from blank
// ───────────────────────────────────────────────────────────────

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise) // handles non-Promise values
        .then((value) => {
          results[index] = value; // preserve order!
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // first rejection rejects the whole thing
    });
  });
}

console.log("\n=== B4: promiseAll ===");
promiseAll([ok(1, 30), ok(2, 10), ok(3, 20)]).then((r) =>
  console.log("promiseAll:", r)
); // [1, 2, 3] — ordered!

// 🔥 SAY THIS: "Key insights: results[index] preserves order even though
// promises resolve in any order. Promise.resolve(promise) handles non-Promise
// values. completed counter tracks when ALL are done. First rejection
// short-circuits via .catch(reject)."


// ───────────────────────────────────────────────────────────────
// B5 ⭐⭐⭐ | Sequential vs Parallel Execution
// ⏱️ Know the patterns — asked as "how would you..."
// ───────────────────────────────────────────────────────────────

console.log("\n=== B5: Sequential vs Parallel ===");

const urls = [1, 2, 3]; // simulated

// PARALLEL — all start at once (fast)
async function fetchParallel() {
  const results = await Promise.all(urls.map((u) => ok(`result-${u}`, 10)));
  console.log("parallel:", results);
}

// SEQUENTIAL — one after another (slower, but ordered)
async function fetchSequential() {
  const results = [];
  for (const u of urls) {
    results.push(await ok(`result-${u}`, 10));
  }
  console.log("sequential:", results);
}

fetchParallel();
fetchSequential();

// 🔥 SAY THIS: "Use parallel (Promise.all) when requests are independent.
// Use sequential (for...of + await) when each depends on the previous,
// or you need to control concurrency. Never use forEach with await —
// it doesn't wait."


// ═══════════════════════════════════════════════════════════════
// SECTION C: Prototype & Classes
// "How does inheritance work in JavaScript?"
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// C1 ⭐⭐ | Prototypal Inheritance — The Chain
// ⏱️ Must explain in under 60s
// ───────────────────────────────────────────────────────────────

console.log("\n=== C1: Prototype Chain ===");

function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype); // Inherit methods
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () {
  return `${this.name} barks!`;
};

const rex = new Dog("Rex", "Shepherd");
console.log(rex.speak()); // "Rex makes a sound" — inherited from Animal
console.log(rex.bark()); // "Rex barks!" — own method

// Chain: rex → Dog.prototype → Animal.prototype → Object.prototype → null
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true

// 🔥 SAY THIS: "JS uses prototypal inheritance. Every object has a
// prototype chain. When you access a property, JS walks up the chain
// until it finds it or reaches null. class syntax is just sugar over
// this same mechanism."


// ───────────────────────────────────────────────────────────────
// C2 ⭐⭐ | ES6 Class — Same thing, cleaner syntax
// ⏱️ Must know both syntaxes
// ───────────────────────────────────────────────────────────────

console.log("\n=== C2: ES6 Class ===");

class AnimalClass {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
  static create(name) {
    return new AnimalClass(name);
  }
}

class DogClass extends AnimalClass {
  constructor(name, breed) {
    super(name); // MUST call super before using 'this'
    this.breed = breed;
  }
  bark() {
    return `${this.name} barks!`;
  }
}

const buddy = new DogClass("Buddy", "Golden");
console.log(buddy.speak()); // "Buddy makes a sound"
console.log(buddy.bark());  // "Buddy barks!"
const cat = AnimalClass.create("Whiskers");
console.log(cat.speak()); // "Whiskers makes a sound"


// ───────────────────────────────────────────────────────────────
// C3 ⭐⭐ | typeof vs instanceof — The Traps
// ⏱️ Know the edge cases
// ───────────────────────────────────────────────────────────────

console.log("\n=== C3: typeof vs instanceof ===");

// typeof — returns string describing the TYPE
console.log(typeof "hello");      // "string"
console.log(typeof 42);           // "number"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object"  ← 🔥 THE TRAP!
console.log(typeof []);           // "object"  ← arrays are objects
console.log(typeof {});           // "object"
console.log(typeof function(){}); // "function"
console.log(typeof Symbol());     // "symbol"
console.log(typeof BigInt(1));    // "bigint"

// instanceof — checks PROTOTYPE CHAIN
console.log([] instanceof Array);     // true
console.log([] instanceof Object);    // true (Array → Object)
console.log("hi" instanceof String);  // false — primitives aren't instances!
console.log(new String("hi") instanceof String); // true — wrapper object IS

// 🔥 SAY THIS: "typeof returns the primitive type as a string. The trap:
// typeof null is 'object' — a historical JS bug. typeof array is 'object'
// — use Array.isArray() instead. instanceof checks the prototype chain —
// primitives return false because they're not objects."


// ═══════════════════════════════════════════════════════════════
// SECTION D: Advanced Array/Object Patterns
// "Implement debounce" — THE most asked utility function
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// D1 ⭐⭐⭐ | Deep Clone — 3 Methods
// ⏱️ Know all 3 and trade-offs
// ───────────────────────────────────────────────────────────────

console.log("\n=== D1: Deep Clone ===");

const original = { a: 1, b: { c: 2, d: [3, 4] }, e: new Date() };

// Method 1: structuredClone (modern — best option)
const clone1 = structuredClone(original);
// ✅ Handles: nested objects, arrays, Date, Map, Set, ArrayBuffer
// ❌ Cannot: functions, DOM nodes, symbols, prototype chain

// Method 2: JSON (simple but lossy)
const clone2 = JSON.parse(JSON.stringify(original));
// ❌ Loses: functions, undefined, Date (→ string), Symbol, Infinity, NaN

// Method 3: Recursive (handles everything you code for)
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));
  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}

const clone3 = deepClone(original);
clone3.b.c = 999;
console.log(original.b.c); // 2 — not affected ✅
console.log(clone3.b.c);   // 999

// 🔥 SAY THIS: "structuredClone is the modern standard — handles most
// cases. JSON.parse(JSON.stringify()) is quick but loses functions, dates,
// and undefined. For full control, recursive clone handles everything
// you explicitly support."


// ───────────────────────────────────────────────────────────────
// D2 ⭐⭐⭐ | Flatten Nested Array
// ⏱️ Target: under 60s each approach
// ───────────────────────────────────────────────────────────────

console.log("\n=== D2: Flatten ===");

// Built-in (ES2019)
console.log([1, [2, [3, [4]]]].flat(Infinity)); // [1, 2, 3, 4]

// Recursive
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}

// Iterative (stack-based — no recursion limit)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }
  return result.reverse();
}

console.log(flatten([1, [2, [3, [4]]]]));          // [1, 2, 3, 4]
console.log(flattenIterative([1, [2, [3, [4]]]])); // [1, 2, 3, 4]


// ───────────────────────────────────────────────────────────────
// D3 ⭐⭐⭐ | pipe & compose
// ⏱️ Target: under 30s
// ───────────────────────────────────────────────────────────────

console.log("\n=== D3: pipe & compose ===");

// pipe: left-to-right
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);

// compose: right-to-left (math style)
const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);

const transform = pipe(
  (str) => str.trim(),
  (str) => str.toLowerCase(),
  (str) => str.replace(/\s+/g, "-")
);

console.log(transform("  Hello World  ")); // "hello-world"

// 🔥 SAY THIS: "pipe applies functions left-to-right using reduce.
// compose applies right-to-left using reduceRight. pipe is more readable
// — data flows top-to-bottom. I use pipe for data transformation
// pipelines, like formatting user input or transforming API responses."


// ───────────────────────────────────────────────────────────────
// D4 ⭐⭐⭐ | debounce — THE Most Asked Utility
// ⏱️ Target: under 45s from blank — MUST be muscle memory
// ───────────────────────────────────────────────────────────────

console.log("\n=== D4: debounce ===");

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// "Wait until they STOP typing, then fire"
// Every call resets the timer. Only fires after [delay]ms of SILENCE.

// Leading-edge variant (fires IMMEDIATELY, then waits)
function debounceLeading(fn, delay) {
  let timer;
  return function (...args) {
    if (!timer) fn.apply(this, args); // fire immediately
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, delay);
  };
}

const debouncedLog = debounce((msg) => console.log("debounced:", msg), 200);
debouncedLog("a");
debouncedLog("b");
debouncedLog("c"); // Only "c" fires after 200ms

// 🔥 SAY THIS: "Debounce delays execution until the caller stops calling
// for [delay]ms. Each call resets the timer. Use for: search input (wait
// until user stops typing), window resize handler, form auto-save.
// clearTimeout + setTimeout is the core pattern."


// ───────────────────────────────────────────────────────────────
// D5 ⭐⭐⭐ | throttle — Rate Limiting
// ⏱️ Target: under 60s from blank
// ───────────────────────────────────────────────────────────────

console.log("\n=== D5: throttle ===");

function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}
// "Fire at most once every [interval]ms"

// DEBOUNCE vs THROTTLE:
// ┌─────────────────────────────────────────────────────────────┐
// │                  Debounce vs Throttle                       │
// ├─────────────┬──────────────────┬───────────────────────────┤
// │             │ Debounce         │ Throttle                  │
// ├─────────────┼──────────────────┼───────────────────────────┤
// │ Fires when? │ After silence    │ At most once per interval │
// │ Use for     │ Search input     │ Scroll/resize handler     │
// │ Pattern     │ Reset timer      │ Check elapsed time        │
// │ User types  │ Waits, fires END │ Fires during typing       │
// └─────────────┴──────────────────┴───────────────────────────┘

// 🔥 SAY THIS: "Debounce fires AFTER the user stops. Throttle fires
// DURING at a fixed rate. Search box → debounce (wait until done typing).
// Scroll handler → throttle (fire every 100ms, not every pixel)."


// ═══════════════════════════════════════════════════════════════
// SECTION E: Event Loop Deep Dive — Output Prediction
// "What does this print?" — asked EVERY interview
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// E1 ⭐⭐⭐ | Complex Output Prediction
// ⏱️ Must trace in under 30s
// ───────────────────────────────────────────────────────────────

console.log("\n=== E1: Event Loop ===");

console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => console.log("5"), 0);
});
console.log("6");

// OUTPUT: 1, 6, 3, 4, 2, 5
// STEP BY STEP:
// 1. "1" → sync, runs immediately
// 2. setTimeout(2) → pushed to MACROTASK queue
// 3. Promise.then(3) → pushed to MICROTASK queue
// 4. Promise.then(4+5) → pushed to MICROTASK queue
// 5. "6" → sync, runs immediately
// 6. Call stack empty → drain microtasks: "3", then "4" (which pushes setTimeout(5) to macrotask)
// 7. Process macrotask: "2"
// 8. Process macrotask: "5"

// RULE: Sync → ALL Microtasks → ONE Macrotask → ALL Microtasks → repeat

// 🔥 SAY THIS: "The event loop: sync code runs first. When the call stack
// is empty, ALL microtasks drain (Promises, queueMicrotask). Then ONE
// macrotask runs (setTimeout, setInterval). Microtasks always have
// priority over macrotasks."


// ───────────────────────────────────────────────────────────────
// E2 ⭐⭐⭐ | async/await Execution Order
// ⏱️ The tricky case — await pauses the function
// ───────────────────────────────────────────────────────────────

console.log("\n=== E2: async/await order ===");

async function foo() {
  console.log("foo start");
  await Promise.resolve();
  console.log("foo after await"); // This becomes a microtask!
}

console.log("script start");
foo();
console.log("script end");

// OUTPUT: "script start", "foo start", "script end", "foo after await"
// WHY: await pauses foo(). Everything AFTER await becomes a microtask.
// Sync code (script end) runs first, then microtask (foo after await).


// ───────────────────────────────────────────────────────────────
// E3 ⭐⭐⭐⭐ | Nested Promises — Chain Behavior
// ⏱️ The chain trap
// ───────────────────────────────────────────────────────────────

console.log("\n=== E3: Nested Promises ===");

console.log("A");
new Promise((resolve) => {
  console.log("B"); // executor runs SYNCHRONOUSLY!
  resolve();
})
  .then(() => {
    console.log("C");
    return new Promise((resolve) => {
      console.log("D"); // executor runs synchronously
      resolve();
    });
  })
  .then(() => console.log("E"));
console.log("F");

// OUTPUT: A, B, F, C, D, E
// WHY:
// A → sync
// B → Promise executor is SYNC (this is the trap!)
// F → sync
// C → microtask (first .then)
// D → sync inside the returned Promise executor
// E → microtask (second .then, after inner Promise resolves)


// ───────────────────────────────────────────────────────────────
// E4 ⭐⭐ | queueMicrotask — Same queue as Promises
// ───────────────────────────────────────────────────────────────

console.log("\n=== E4: queueMicrotask ===");

console.log("1");
queueMicrotask(() => console.log("2"));
Promise.resolve().then(() => console.log("3"));
setTimeout(() => console.log("4"), 0);
console.log("5");

// OUTPUT: 1, 5, 2, 3, 4
// queueMicrotask and Promise.then are BOTH microtasks — same queue
// setTimeout is a macrotask — runs after all microtasks

// 🔥 SAY THIS: "Promise callbacks and queueMicrotask go to the same
// microtask queue. setTimeout goes to the macrotask queue. The Promise
// constructor executor runs SYNCHRONOUSLY — that's the trap people miss."


// ═══════════════════════════════════════════════════════════════
// SECTION F: Error Handling & ES6+ Features
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// F1 ⭐⭐ | try/catch with async/await
// ───────────────────────────────────────────────────────────────

async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err.message);
    return null; // graceful fallback
  } finally {
    console.log("Cleanup — runs always (success or error)");
  }
}

// 🔥 SAY THIS: "try/catch with async/await reads like synchronous code.
// finally runs regardless of success or failure — I use it for cleanup
// like hiding loading spinners. I always check res.ok because fetch
// doesn't throw on HTTP errors — only on network failures."


// ───────────────────────────────────────────────────────────────
// F2 ⭐⭐ | Custom Error Classes
// ───────────────────────────────────────────────────────────────

class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Usage:
// throw new NotFoundError("User");
// catch (err) { if (err instanceof NotFoundError) ... }

console.log("\n=== F2: Custom Errors ===");
try {
  throw new NotFoundError("User");
} catch (err) {
  console.log(err.name);       // "NotFoundError"
  console.log(err.message);    // "User not found"
  console.log(err.statusCode); // 404
  console.log(err.code);       // "NOT_FOUND"
  console.log(err instanceof NotFoundError); // true
  console.log(err instanceof AppError);      // true
  console.log(err instanceof Error);         // true
}


// ───────────────────────────────────────────────────────────────
// F3 ⭐⭐ | Destructuring — Advanced Patterns
// ⏱️ Know all patterns — they'll test edge cases
// ───────────────────────────────────────────────────────────────

console.log("\n=== F3: Destructuring ===");

// Nested + defaults + rename
const userObj = { name: "Tijo", address: { city: "Trivandrum" } };
const {
  name: userName = "Guest",
  address: { city = "Unknown", zip = "N/A" } = {},
} = userObj;
console.log(userName, city, zip); // "Tijo" "Trivandrum" "N/A"

// Array: skip elements + rest
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
console.log(first, third, rest); // 1, 3, [4, 5]

// Swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1

// Function params destructuring with defaults
function createUser({ name, age = 25, role = "viewer" } = {}) {
  return { name, age, role };
}
console.log(createUser({ name: "Tijo" }));
// { name: "Tijo", age: 25, role: "viewer" }


// ───────────────────────────────────────────────────────────────
// F4 ⭐⭐ | Map vs Object — When to Use Map
// ───────────────────────────────────────────────────────────────

console.log("\n=== F4: Map vs Object ===");

// Map advantages:
const map = new Map();
map.set({ id: 1 }, "user1");  // ✅ Objects as keys
map.set(42, "answer");         // ✅ Numbers as keys
console.log(map.size);         // ✅ O(1) size — Object needs Object.keys().length

// Iteration order guaranteed (insertion order)
map.set("first", 1);
map.set("second", 2);
for (const [k, v] of map) console.log(k, v); // guaranteed order

// Object advantages:
// ✅ JSON serializable (JSON.stringify works)
// ✅ Destructuring syntax
// ✅ String keys are cleaner: obj.key vs map.get("key")

// 🔥 SAY THIS: "Use Map when: keys aren't strings, you need .size,
// or frequent add/delete. Use Object when: keys are strings, you need
// JSON serialization, or simple config objects."


// ───────────────────────────────────────────────────────────────
// F5 ⭐⭐⭐ | WeakMap — Prevent Memory Leaks
// ───────────────────────────────────────────────────────────────

console.log("\n=== F5: WeakMap ===");

// WeakMap keys are WEAKLY referenced — GC can collect them
// Use: attach data to objects without preventing garbage collection

const privateData = new WeakMap();

class Person {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn }); // private data — not on the object
  }
  getSSN() {
    return privateData.get(this).ssn;
  }
}

const person = new Person("Tijo", "123-45-6789");
console.log(person.name);     // "Tijo" — public
console.log(person.getSSN()); // "123-45-6789" — via WeakMap
console.log(person.ssn);      // undefined — truly private!

// When person is GC'd, WeakMap entry is automatically cleaned up
// No memory leak!

// 🔥 SAY THIS: "WeakMap keys are weakly held — when nothing else
// references the key, both the key and value are garbage collected.
// I use WeakMap for: private class data, DOM element metadata,
// and caches that shouldn't prevent garbage collection."


// ═══════════════════════════════════════════════════════════════
//  SUMMARY — All 28 Drills
// ═══════════════════════════════════════════════════════════════
//
//  SECTION A: Closures Deep Cuts (4)
//    A1  var vs let in loops (output prediction)
//    A2  createCounter factory
//    A3  once(fn) — run once
//    A4  memoize(fn) — cache results
//
//  SECTION B: Promises & Async (5)
//    B1  all vs allSettled vs race vs any
//    B2  sleep(ms)
//    B3  retry with exponential backoff
//    B4  Promise.all from scratch
//    B5  Sequential vs parallel execution
//
//  SECTION C: Prototype & Classes (3)
//    C1  Prototypal inheritance chain
//    C2  ES6 class + extends + static
//    C3  typeof vs instanceof traps
//
//  SECTION D: Array/Object Patterns (5)
//    D1  Deep clone (3 methods)
//    D2  Flatten nested array
//    D3  pipe & compose
//    D4  debounce — MOST ASKED ⚠️
//    D5  throttle + debounce vs throttle
//
//  SECTION E: Event Loop (4)
//    E1  Complex output prediction
//    E2  async/await execution order
//    E3  Nested promises — chain behavior
//    E4  queueMicrotask
//
//  SECTION F: Error Handling & ES6+ (5)
//    F1  try/catch with async/await
//    F2  Custom Error classes
//    F3  Destructuring advanced
//    F4  Map vs Object
//    F5  WeakMap — memory leaks
//
// ═══════════════════════════════════════════════════════════════
//
//  🎯 PRIORITY FOR TONIGHT:
//    1. D4+D5 — debounce/throttle (WILL be asked "implement debounce")
//    2. E1-E4 — Event loop output prediction (asked EVERY interview)
//    3. A3+A4 — once + memoize (closure HOFs)
//    4. B3+B4 — retry + promiseAll (async patterns)
//    5. C+F   — prototypes, errors, destructuring
//
// ═══════════════════════════════════════════════════════════════
