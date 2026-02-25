/**
 * ===========================================
 * 01 — Variables and Types
 * ===========================================
 * Topics: var/let/const, hoisting, type coercion,
 *         typeof, NaN, template literals,
 *         nullish coalescing, optional chaining
 *
 * Run:  node exercises/01-variables-and-types.js
 * ===========================================
 */

// ────────────────────────────────────────────
// Exercise 1 — var vs let vs const
// Difficulty: ⭐
//
// Return an object { a, b, c } where:
//   a = value of x declared with var inside a block
//       accessed OUTSIDE that block
//   b = whether accessing a let variable outside its
//       block throws (true/false)
//   c = whether reassigning a const throws (true/false)
//
// Hint: use try/catch to detect errors.
// ────────────────────────────────────────────
function exercise1_varLetConst() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 2 — Hoisting
// Difficulty: ⭐
//
// Predict the output of accessing variables before
// their declaration.
//
// Return an object:
//   { varBefore, letBefore, funcBefore }
//
//   varBefore   → what does `console.log(a)` give
//                  if `var a = 5` comes after?
//   letBefore   → "ReferenceError" (string) because
//                  let is in the temporal dead zone
//   funcBefore  → result of calling hoisted() where
//                  function hoisted() { return "works" }
//                  is declared below the call
//
// Use try/catch for letBefore.
// ────────────────────────────────────────────
function exercise2_hoisting() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 3 — Type Coercion
// Difficulty: ⭐⭐
//
// Return an object with the results of these
// coercion expressions (don't just hardcode —
// actually evaluate them):
//
//   a: "5" + 3
//   b: "5" - 3
//   c: true + true
//   d: [] + {}
//   e: {} + []     (evaluate as an expression, not a statement)
//   f: "5" == 5
//   g: "5" === 5
//   h: null == undefined
// ────────────────────────────────────────────
function exercise3_typeCoercion() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 4 — typeof Quirks
// Difficulty: ⭐
//
// Return an object with the typeof results for:
//   a: typeof undefined
//   b: typeof null       (this is the famous bug!)
//   c: typeof NaN
//   d: typeof function(){}
//   e: typeof []
//   f: typeof {}
// ────────────────────────────────────────────
function exercise4_typeof() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — NaN Behavior
// Difficulty: ⭐⭐
//
// Return an object:
//   a: NaN === NaN          → evaluate it
//   b: Number.isNaN(NaN)    → evaluate it
//   c: Number.isNaN("hello") → evaluate it
//   d: isNaN("hello")       → evaluate it (global isNaN)
//   e: a reliable way to check if a value x is NaN
//      → return a FUNCTION that takes x and returns boolean
// ────────────────────────────────────────────
function exercise5_nan() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 6 — Template Literals
// Difficulty: ⭐
//
// Given name (string) and scores (array of numbers),
// return a multi-line string using template literals:
//
//   "Student: <name>
//   Scores: <comma-separated scores>
//   Average: <average to 1 decimal place>"
//
// Example: templateReport("Alice", [80, 90, 100])
//   → "Student: Alice\nScores: 80, 90, 100\nAverage: 90.0"
// ────────────────────────────────────────────
function exercise6_templateLiterals(name, scores) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 7 — Nullish Coalescing (??)
// Difficulty: ⭐⭐
//
// Given a config object that may have missing fields,
// return a new object with defaults applied using ??
//
//   config shape: { host, port, debug }
//   defaults:     { host: "localhost", port: 3000, debug: false }
//
// IMPORTANT: values like 0, "", and false should NOT be
// replaced — only null/undefined should trigger defaults.
//
// Compare this with || and explain in a comment why ?? is better here.
// ────────────────────────────────────────────
function exercise7_nullishCoalescing(config) {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 8 — Optional Chaining (?.)
// Difficulty: ⭐⭐
//
// Given a deeply nested user object, safely extract:
//   a: user's street name    → user.address.street.name
//   b: user's first hobby    → user.hobbies[0]
//   c: result of user.greet() if greet exists, else "N/A"
//
// Return { street, hobby, greeting }
// All should return undefined or "N/A" without throwing
// if the path doesn't exist.
// ────────────────────────────────────────────
function exercise8_optionalChaining(user) {
  // TODO: implement
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 01 Variables and Types ===\n");

  try {
    const r1 = exercise1_varLetConst();
    console.log("Ex1 var/let/const:", r1);
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const r2 = exercise2_hoisting();
    console.log("Ex2 hoisting:", r2);
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    const r3 = exercise3_typeCoercion();
    console.log("Ex3 coercion:", r3);
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const r4 = exercise4_typeof();
    console.log("Ex4 typeof:", r4);
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    const r5 = exercise5_nan();
    console.log("Ex5 NaN:", { ...r5, e: r5?.e?.(NaN) });
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const r6 = exercise6_templateLiterals("Alice", [80, 90, 100]);
    console.log("Ex6 template:", r6);
  } catch (e) { console.log("Ex6 error:", e.message); }

  try {
    const r7 = exercise7_nullishCoalescing({ host: "", port: 0, debug: false });
    console.log("Ex7 nullish:", r7);
  } catch (e) { console.log("Ex7 error:", e.message); }

  try {
    const r8a = exercise8_optionalChaining({ address: { street: { name: "Main St" } }, hobbies: ["coding"], greet: () => "Hi!" });
    const r8b = exercise8_optionalChaining({});
    console.log("Ex8 optional chaining (exists):", r8a);
    console.log("Ex8 optional chaining (empty):", r8b);
  } catch (e) { console.log("Ex8 error:", e.message); }
}

runTests();
