/**
 * ===========================================
 * 05 — ES6+ Features
 * ===========================================
 * Topics: classes, symbols, iterators/generators,
 *         WeakMap/WeakSet, Proxy, tagged template
 *         literals, dynamic import, top-level await
 *
 * Run:  node exercises/05-es6-plus-features.js
 * ===========================================
 */

// ────────────────────────────────────────────
// Exercise 1 — Classes
// Difficulty: ⭐⭐⭐
//
// Create a class hierarchy:
//   Shape (base) with:
//     - constructor(color)
//     - getColor() → returns color
//     - area() → throws "Not implemented"
//
//   Circle extends Shape with:
//     - constructor(color, radius)
//     - area() → π * r²
//
//   Rectangle extends Shape with:
//     - constructor(color, width, height)
//     - area() → width * height
//
// Also add a static method Shape.compare(s1, s2)
// that returns the shape with the larger area.
//
// Return { Shape, Circle, Rectangle }
// ────────────────────────────────────────────
function exercise1_classes() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 2 — Symbols
// Difficulty: ⭐⭐⭐
//
// Create an object that uses:
//   a) A Symbol as a private-like property key
//   b) Symbol.iterator to make the object iterable
//   c) Symbol.toPrimitive for custom type conversion
//
// The object represents a Money type:
//   - Has amount and currency
//   - Is iterable: yields individual unit coins
//     e.g., Money(3, "USD") → yields "$", "$", "$"
//   - When converted to number → returns amount
//   - When converted to string → returns "3 USD"
//
// Return the Money constructor/factory function.
// ────────────────────────────────────────────
function exercise2_symbols() {
  // TODO: return a createMoney(amount, currency) function
}

// ────────────────────────────────────────────
// Exercise 3 — Iterators and Generators
// Difficulty: ⭐⭐⭐
//
// Implement:
//   a) A `range(start, end, step=1)` generator that
//      yields numbers from start to end (exclusive).
//      e.g., range(0, 10, 3) → 0, 3, 6, 9
//
//   b) A `fibonacci()` infinite generator.
//      e.g., yields 0, 1, 1, 2, 3, 5, 8, 13, ...
//
//   c) A `take(iterable, n)` function that returns
//      the first n values from any iterable.
//
// Return { range, fibonacci, take }
// ────────────────────────────────────────────
function exercise3_generators() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 4 — WeakMap and WeakSet
// Difficulty: ⭐⭐⭐
//
// Use WeakMap to implement a private data pattern:
//
//   Create a `createPerson(name, age)` factory where
//   name and age are stored in a WeakMap and can only
//   be accessed through getName() and getAge() methods.
//
// Also use WeakSet to implement a `markVisited(node)`
// and `isVisited(node)` pair for tracking visited objects
// without preventing garbage collection.
//
// Return { createPerson, markVisited, isVisited }
// ────────────────────────────────────────────
function exercise4_weakMapSet() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 5 — Proxy
// Difficulty: ⭐⭐⭐
//
// Create a proxy-based validator for an object:
//
// Rules:
//   - `name` must be a non-empty string
//   - `age` must be a positive integer
//   - `email` must contain "@"
//   - Setting any other property is forbidden
//   - Getting a non-existent property returns "UNKNOWN"
//
// Return a function createValidatedObject() that
// returns the proxy.
// ────────────────────────────────────────────
function exercise5_proxy() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 6 — Tagged Template Literals
// Difficulty: ⭐⭐⭐
//
// Implement two tag functions:
//
//   a) `highlight` — wraps interpolated values in **bold**
//      e.g., highlight`Hello ${name}, you are ${age} years old`
//      → "Hello **Alice**, you are **30** years old"
//
//   b) `sql` — creates a safe SQL-like query object
//      with the query template and params separated
//      e.g., sql`SELECT * FROM users WHERE id = ${userId} AND name = ${name}`
//      → { query: "SELECT * FROM users WHERE id = $1 AND name = $2",
//          params: [userId, name] }
//
// Return { highlight, sql }
// ────────────────────────────────────────────
function exercise6_taggedTemplates() {
  // TODO: implement
}

// ────────────────────────────────────────────
// Exercise 7 — Dynamic Import Concept
// Difficulty: ⭐⭐⭐
//
// Demonstrate understanding of dynamic import:
//
// Implement a `loadModule(moduleName)` function that:
//   - Simulates dynamic import behavior
//   - Returns a promise that resolves with a mock module object
//   - If moduleName is "math", return { add, multiply }
//   - If moduleName is "string", return { capitalize, reverse }
//   - If unknown, reject with Error("Module not found")
//
// This simulates the pattern: const mod = await import('./module.js')
// ────────────────────────────────────────────
function exercise7_dynamicImport() {
  // TODO: implement loadModule
}

// ────────────────────────────────────────────
// Exercise 8 — Top-Level Await Concept
// Difficulty: ⭐⭐⭐
//
// Top-level await works in ES modules (.mjs or "type":"module").
// This exercise demonstrates the concept.
//
// Explain (in comments returned as a string) what
// top-level await is and when to use it.
//
// Implement a function that simulates a module that
// needs async initialization:
//
//   createAsyncModule() → returns a promise that resolves
//   with an initialized module object:
//     { ready: true, config: { loaded: true }, getData: fn }
//
// Simulate loading config asynchronously before the
// module is "ready".
// ────────────────────────────────────────────
async function exercise8_topLevelAwait() {
  // TODO: implement
}

// ═══════════════════════════════════════════
// Simple test runner — do not modify
// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 05 ES6+ Features ===\n");

  try {
    const { Shape, Circle, Rectangle } = exercise1_classes();
    const c = new Circle("red", 5);
    const r = new Rectangle("blue", 4, 6);
    console.log("Ex1 circle area:", c.area(), "color:", c.getColor());
    console.log("Ex1 rect area:", r.area());
    console.log("Ex1 compare:", Shape.compare(c, r).constructor.name);
  } catch (e) { console.log("Ex1 error:", e.message); }

  try {
    const createMoney = exercise2_symbols();
    const m = createMoney(3, "USD");
    console.log("Ex2 string:", String(m));
    console.log("Ex2 number:", +m);
    console.log("Ex2 iterate:", [...m]);
  } catch (e) { console.log("Ex2 error:", e.message); }

  try {
    const { range, fibonacci, take } = exercise3_generators();
    console.log("Ex3 range:", [...range(0, 10, 3)]);
    console.log("Ex3 fib:", take(fibonacci(), 8));
  } catch (e) { console.log("Ex3 error:", e.message); }

  try {
    const { createPerson, markVisited, isVisited } = exercise4_weakMapSet();
    const p = createPerson("Alice", 30);
    console.log("Ex4 person:", p.getName(), p.getAge());
    const node = { id: 1 };
    markVisited(node);
    console.log("Ex4 visited:", isVisited(node));
  } catch (e) { console.log("Ex4 error:", e.message); }

  try {
    const createValidatedObject = exercise5_proxy();
    const obj = createValidatedObject();
    obj.name = "Alice";
    obj.age = 25;
    obj.email = "alice@test.com";
    console.log("Ex5 proxy:", obj.name, obj.age, obj.email);
    console.log("Ex5 unknown prop:", obj.foo);
    try { obj.age = -5; } catch (e) { console.log("Ex5 validation:", e.message); }
  } catch (e) { console.log("Ex5 error:", e.message); }

  try {
    const { highlight, sql } = exercise6_taggedTemplates();
    const name = "Alice", age = 30;
    console.log("Ex6 highlight:", highlight`Hello ${name}, age ${age}`);
    const userId = 42;
    console.log("Ex6 sql:", sql`SELECT * FROM users WHERE id = ${userId} AND name = ${name}`);
  } catch (e) { console.log("Ex6 error:", e.message); }

  try {
    const loadModule = exercise7_dynamicImport();
    const math = await loadModule("math");
    console.log("Ex7 dynamic import:", math.add(2, 3), math.multiply(2, 3));
    try { await loadModule("unknown"); } catch (e) { console.log("Ex7 not found:", e.message); }
  } catch (e) { console.log("Ex7 error:", e.message); }

  try {
    const mod = await exercise8_topLevelAwait();
    console.log("Ex8 async module:", mod);
  } catch (e) { console.log("Ex8 error:", e.message); }
}

runTests();
