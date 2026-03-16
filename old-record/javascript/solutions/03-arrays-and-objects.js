/**
 * ===========================================
 * 03 — Arrays and Objects — SOLUTIONS
 * ===========================================
 */

// ── Exercise 1 — map / filter / reduce ──
function exercise1_mapFilterReduce(products) {
  // map: transforms each element → new array of transformed values
  const names = products.map(p => p.name);

  // filter: keeps only elements that pass the predicate
  const available = products.filter(p => p.inStock);

  // reduce: accumulates array into a single value
  // We chain filter + reduce to sum only in-stock prices
  const totalCost = products
    .filter(p => p.inStock)
    .reduce((sum, p) => sum + p.price, 0);

  return { names, available, totalCost };
}

// WHY: map/filter/reduce are the three pillars of functional array processing.
// They don't mutate the original array (immutability).
// reduce is the most versatile — you can implement map and filter with reduce.
// The initial value (0 in reduce) is important to avoid errors on empty arrays.

// ── Exercise 2 — flat / flatMap ──
function exercise2_flatFlatMap(sentences, nested) {
  // flatMap = map + flat(1). Perfect for one-to-many transformations.
  // Each sentence maps to an array of words, then flattened into one array.
  const words = sentences.flatMap(s => s.split(" "));

  // flat(Infinity) recursively flattens all nested arrays
  const flattened = nested.flat(Infinity);

  return { words, flattened };
}

// WHY: flatMap is more efficient than .map().flat() because it does both in one pass.
// flat(depth) controls how many levels to flatten. Infinity flattens everything.
// Common use case: flatMap for expanding items (e.g., users → user's orders).

// ── Exercise 3 — Destructuring ──
function exercise3_destructuring(user) {
  // Object destructuring with nested extraction and defaults
  const {
    name,
    age,
    address: { city },                  // nested destructuring
    scores: [firstScore, ...restScores], // array destructuring with rest
    country = "US",                      // default value
  } = user;

  return { name, age, city, firstScore, restScores, country };
}

// WHY: Destructuring is syntactic sugar for extracting values from objects/arrays.
// Nested destructuring (address: { city }) extracts city directly.
// Array destructuring with rest ([first, ...rest]) splits head from tail.
// Default values (country = "US") only apply when the value is undefined (not null).

// ── Exercise 4 — Spread / Rest with Objects ──
function exercise4_spreadRest() {
  function omit(obj, ...keys) {
    // Create a copy and filter out unwanted keys using Object.entries
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key))
    );
  }

  function pick(obj, ...keys) {
    // Only keep the specified keys
    return Object.fromEntries(
      keys.filter(key => key in obj).map(key => [key, obj[key]])
    );
  }

  return { omit, pick };
}

// WHY: omit and pick are fundamental utility functions (found in lodash).
// This immutable approach (no delete, no mutation) is preferred in modern JS.
// Object.entries → filter/map → Object.fromEntries is a powerful transformation pipeline.
// An alternative omit using rest: const { [key]: _, ...rest } = obj — but only for single keys.

// ── Exercise 5 — Object.entries / Object.fromEntries ──
function exercise5_entriesFromEntries(obj) {
  // entries → map → fromEntries is the "object transformation pipeline"
  const doubled = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v * 2])
  );

  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v > 1)
  );

  // Swap keys ↔ values
  const swapped = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [String(v), k])
  );

  return { doubled, filtered, swapped };
}

// WHY: There's no native "map over object values" in JS.
// The entries → transform → fromEntries pattern fills this gap.
// Object.entries returns [key, value] pairs as an array of arrays.
// Object.fromEntries reverses the process back into an object.
// Note: keys are always strings in the result (even if values were numbers).

// ── Exercise 6 — Deep Clone ──
function exercise6_deepClone(value) {
  // Base case: primitives are returned as-is (they're copied by value)
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Date objects (they're objects but need special treatment)
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => exercise6_deepClone(item));
  }

  // Handle plain Objects — recursively clone each property
  const cloned = {};
  for (const key of Object.keys(value)) {
    cloned[key] = exercise6_deepClone(value[key]);
  }
  return cloned;
}

// WHY: Shallow copies (spread, Object.assign) only copy the top level.
// Nested objects still share references → modifying one affects the other.
// JSON.parse(JSON.stringify(x)) works but loses: Date, undefined, functions, Infinity, NaN.
// This recursive approach handles the common cases correctly.
// For production, use structuredClone() (built-in since Node 17 / all modern browsers).

// ── Exercise 7 — groupBy ──
function exercise7_groupBy(array, keyFn) {
  // Manual implementation using reduce — the classic approach
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    // If the group doesn't exist yet, create it as an empty array
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  // ES2024 native alternative:
  // return Object.groupBy(array, keyFn);
}

// WHY: Grouping is an extremely common operation — categorizing data.
// The reduce pattern builds up the groups object incrementally.
// ES2024's Object.groupBy() does exactly this natively.
// Map.groupBy() returns a Map instead (useful for non-string keys).

// ── Exercise 8 — structuredClone ──
function exercise8_structuredClone() {
  const original = {
    name: "Alice",
    scores: [1, 2, 3],
    nested: { deep: { value: 42 } },
    date: new Date("2024-01-01"),
    set: new Set([1, 2, 3]),
    map: new Map([["a", 1]]),
  };

  // structuredClone is the modern, built-in deep clone.
  // It handles: Date, Map, Set, ArrayBuffer, RegExp, Error, and more.
  // It does NOT handle: Functions, DOM nodes, Symbols as keys.
  const clone = structuredClone(original);

  // Prove it's deep: modify the original
  original.nested.deep.value = 999;
  original.scores.push(4);

  const isDeep = clone.nested.deep.value === 42 && clone.scores.length === 3;

  return { original, clone, isDeep };
}

// WHY: structuredClone() was added to replace the JSON.parse(JSON.stringify()) hack.
// It correctly handles types that JSON cannot (Date, Map, Set, etc.).
// It also handles circular references!
// Limitations: can't clone functions, DOM nodes, or certain host objects.
// Available in: Node 17+, all modern browsers (2022+).

// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 03 Solutions ===\n");

  const products = [
    { name: "Laptop", price: 999, inStock: true },
    { name: "Phone", price: 699, inStock: false },
    { name: "Tablet", price: 499, inStock: true },
    { name: "Watch", price: 299, inStock: true },
  ];

  console.log("Ex1:", exercise1_mapFilterReduce(products));
  console.log("Ex2:", exercise2_flatFlatMap(["hello world", "foo bar baz", "one"], [1, [2, [3, [4, [5]]]]]));
  console.log("Ex3:", exercise3_destructuring({ name: "Alice", age: 30, address: { city: "NYC", zip: "10001" }, scores: [95, 87, 92] }));

  const { omit, pick } = exercise4_spreadRest();
  console.log("Ex4 omit:", omit({ a: 1, b: 2, c: 3 }, "b", "c"));
  console.log("Ex4 pick:", pick({ a: 1, b: 2, c: 3 }, "a", "c"));

  console.log("Ex5:", exercise5_entriesFromEntries({ a: 1, b: 2, c: 3 }));

  const orig = { a: 1, b: { c: 2 }, d: [3, 4], e: new Date("2024-01-01") };
  const cloned = exercise6_deepClone(orig);
  orig.b.c = 999;
  console.log("Ex6 deepClone:", cloned.b.c === 2 ? "PASS" : "FAIL");

  console.log("Ex7:", exercise7_groupBy([6.1, 4.2, 6.3], Math.floor));
  console.log("Ex8:", exercise8_structuredClone());
}

runTests();
