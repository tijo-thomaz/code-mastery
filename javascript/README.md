# JavaScript Mastery

A structured, hands-on path to mastering JavaScript — from fundamentals to advanced patterns.

## 📁 Structure

```
javascript/
├── exercises/          # Progressively harder exercises (with TODOs)
├── solutions/          # Full solutions with detailed explanations
├── speed-typing/       # Real-world snippets to build muscle memory
└── interview-questions/ # Common questions, answers & failure log
```

## 🗂️ Exercises

| # | Topic | Exercises | Difficulty Range |
|---|-------|-----------|-----------------|
| [01](exercises/01-variables-and-types.js) | Variables & Types | 8 | ⭐–⭐⭐ |
| [02](exercises/02-functions-and-closures.js) | Functions & Closures | 8 | ⭐⭐–⭐⭐⭐ |
| [03](exercises/03-arrays-and-objects.js) | Arrays & Objects | 8 | ⭐⭐–⭐⭐⭐ |
| [04](exercises/04-promises-and-async.js) | Promises & Async | 8 | ⭐⭐–⭐⭐⭐ |
| [05](exercises/05-es6-plus-features.js) | ES6+ Features | 8 | ⭐⭐⭐ |
| [06](exercises/06-event-loop-and-patterns.js) | Event Loop & Patterns | 6 | ⭐⭐⭐ |

## 🚀 ES2024/2025 Features to Know

### ES2024 (Finalized)
- **`Object.groupBy()` / `Map.groupBy()`** — native grouping without lodash
- **`Promise.withResolvers()`** — cleaner deferred promise pattern
- **`ArrayBuffer.prototype.resize()`** — resizable array buffers
- **`String.prototype.isWellFormed()` / `toWellFormed()`** — UTF-16 safety
- **`Atomics.waitAsync()`** — non-blocking shared memory waits
- **RegExp `/v` flag** — set notation and properties of strings

### ES2025 (Stage 4 / Shipping)
- **`Set` methods** — `union()`, `intersection()`, `difference()`, `symmetricDifference()`, `isSubsetOf()`, `isSupersetOf()`, `isDisjointFrom()`
- **`Iterator` helpers** — `.map()`, `.filter()`, `.take()`, `.drop()`, `.forEach()`, `.toArray()` on iterators
- **`JSON.parse` source text access** — context-aware reviver
- **`import.meta.resolve()`** — synchronous module URL resolution
- **`Duplicate named capture groups`** — in RegExp alternations
- **`Float16Array`** — half-precision float typed array

## 🏋️ How to Use

1. **Read** the exercise file — understand what's expected.
2. **Solve** each function — replace the `TODO` with your implementation.
3. **Run** with Node.js: `node exercises/01-variables-and-types.js`
4. **Compare** with solutions when stuck or to learn better approaches.
5. **Type** snippets from `speed-typing/snippets.md` for muscle memory.
6. **Review** interview questions before interviews.
7. **Log** failed interview questions to track and close knowledge gaps.

## 🧪 Running Exercises

All exercises are self-contained and can be run directly:

```bash
node javascript/exercises/01-variables-and-types.js
```

Each exercise file includes a simple test runner at the bottom that validates your solutions.

## 📚 Recommended Learning Order

1. Variables & Types → build the foundation
2. Functions & Closures → the heart of JavaScript
3. Arrays & Objects → daily data manipulation
4. Promises & Async → modern async patterns
5. ES6+ Features → classes, symbols, proxies, generators
6. Event Loop & Patterns → how JS actually works under the hood
