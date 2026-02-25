/**
 * ===========================================
 * 03 — Arrays and Objects
 * ===========================================
 * Topics: map/filter/reduce, flat/flatMap,
 *         destructuring, spread/rest with objects,
 *         Object.entries/fromEntries, deep clone,
 *         groupBy, structuredClone
 *
 * Run:  node exercises/03-arrays-and-objects.js
 * ===========================================
 */

// ────────────────────────────────────────────
// Exercise 1 — map / filter / reduce
// Difficulty: ⭐⭐
//
// Given an array of product objects:
//   [{ name: "Laptop", price: 999, inStock: true },
//    { name: "Phone", price: 699, inStock: false },
//    { name: "Tablet", price: 499, inStock: true },
//    { name: "Watch", price: 299, inStock: true }]
//
// Return an object:
//   names:      array of all product names (map)
//   available:  array of products that are inStock (filter)
//   totalCost:  sum of prices of in-stock items (reduce)
// ────────────────────────────────────────────
function exercise1_mapFilterReduce(products) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 2 — flat / flatMap
// Difficulty: ⭐⭐
//
// Given an array of sentences (strings), return an
// array of individual words (split on spaces).
// Use flatMap to do it in one step.
//
// Also: given a deeply nested array like
//   [1, [2, [3, [4, [5]]]]]
// flatten it completely to [1, 2, 3, 4, 5].
//
// Return { words, flattened }
// ────────────────────────────────────────────
function exercise2_flatFlatMap(sentences, nested) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 3 — Destructuring
// Difficulty: ⭐⭐
//
// Given a user object:
//   { name: "Alice", age: 30,
//     address: { city: "NYC", zip: "10001" },
//     scores: [95, 87, 92] }
//
// Use destructuring to extract:
//   - name and age (top level)
//   - city from address (nested)
//   - first score and rest of scores (array destructuring)
//   - a `country` field with default value "US"
//
// Return { name, age, city, firstScore, restScores, country }
// ────────────────────────────────────────────
function exercise3_destructuring(user) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 4 — Spread / Rest with Objects
// Difficulty: ⭐⭐
//
// Implement these utilities:
//
//   omit(obj, ...keys)  → returns a new object without the specified keys
//   pick(obj, ...keys)  → returns a new object with only the specified keys
//
// Use spread/rest/destructuring — NOT delete or mutation.
//
// Return { omit, pick }
// ────────────────────────────────────────────
function exercise4_spreadRest() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — Object.entries / Object.fromEntries
// Difficulty: ⭐⭐
//
// Given an object like { a: 1, b: 2, c: 3 }:
//
//   a) Double all values → { a: 2, b: 4, c: 6 }
//      (use entries → map → fromEntries)
//
//   b) Filter to only entries where value > 1
//      → { b: 2, c: 3 }
//
//   c) Swap keys and values → { "1": "a", "2": "b", "3": "c" }
//
// Return { doubled, filtered, swapped }
// ────────────────────────────────────────────
function exercise5_entriesFromEntries(obj) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 6 — Deep Clone
// Difficulty: ⭐⭐⭐
//
// Implement a deepClone function WITHOUT using
// structuredClone or JSON.parse/stringify.
//
// It should handle:
//   - primitives
//   - plain objects (nested)
//   - arrays (nested)
//   - Date objects
//
// Don't worry about: functions, RegExp, Map, Set, circular refs.
//
// Return the deepClone function.
// ────────────────────────────────────────────
function exercise6_deepClone(value) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 7 — groupBy
// Difficulty: ⭐⭐
//
// Implement a `groupBy(array, keyFn)` function that
// groups array elements by the result of keyFn.
//
// Example:
//   groupBy([6.1, 4.2, 6.3], Math.floor)
//   → { "4": [4.2], "6": [6.1, 6.3] }
//
//   groupBy(["one", "two", "three"], s => s.length)
//   → { "3": ["one", "two"], "5": ["three"] }
//
// Also show how Object.groupBy (ES2024) does the same.
// ────────────────────────────────────────────
function exercise7_groupBy(array, keyFn) {
  // TODO: implement manually (don't use Object.groupBy)
}

// ────────────────────────────────────────────
// Exercise 8 — structuredClone
// Difficulty: ⭐⭐
//
// Demonstrate structuredClone by:
//   a) Cloning a complex object with nested arrays,
//      objects, Date, Map, and Set
//   b) Proving it's a deep clone (modify original,
//      show clone is unaffected)
//
// Return { original, clone, isDeep } where isDeep
// is true if modifying original didn't affect clone.
// ────────────────────────────────────────────
function exercise8_structuredClone() {
  // TODO: implement
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 03 Arrays and Objects ===\n");

  const products = [
    { name: "Laptop", price: 999, inStock: true },
    { name: "Phone", price: 699, inStock: false },
    { name: "Tablet", price: 499, inStock: true },
    { name: "Watch", price: 299, inStock: true },
  ];

  try {
    console.log("Ex1 map/filter/reduce:", exercise1_mapFilterReduce(products));
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const sentences = ["hello world", "foo bar baz", "one"];
    const nested = [1, [2, [3, [4, [5]]]]];
    console.log("Ex2 flat/flatMap:", exercise2_flatFlatMap(sentences, nested));
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    const user = { name: "Alice", age: 30, address: { city: "NYC", zip: "10001" }, scores: [95, 87, 92] };
    console.log("Ex3 destructuring:", exercise3_destructuring(user));
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const { omit, pick } = exercise4_spreadRest();
    console.log("Ex4 omit:", omit({ a: 1, b: 2, c: 3 }, "b", "c"));
    console.log("Ex4 pick:", pick({ a: 1, b: 2, c: 3 }, "a", "c"));
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    console.log("Ex5 entries:", exercise5_entriesFromEntries({ a: 1, b: 2, c: 3 }));
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const original = { a: 1, b: { c: 2 }, d: [3, 4], e: new Date("2024-01-01") };
    const cloned = exercise6_deepClone(original);
    original.b.c = 999;
    console.log("Ex6 deepClone:", cloned.b.c === 2 ? "PASS" : "FAIL");
  } catch (e) { console.log("Ex6 error:", e.message); }

  try {
    console.log("Ex7 groupBy:", exercise7_groupBy([6.1, 4.2, 6.3], Math.floor));
  } catch (e) { console.log("Ex7 error:", e.message); }

  try {
    console.log("Ex8 structuredClone:", exercise8_structuredClone());
  } catch (e) { console.log("Ex8 error:", e.message); }
}

runTests();
