/**
 * ===========================================
 * 02 — Functions and Closures — SOLUTIONS
 * ===========================================
 */

// ── Exercise 1 — Closures: Counter ──
function exercise1_counter() {
  // The `count` variable is enclosed in the returned object's methods.
  // It's not directly accessible from outside — this is the closure pattern.
  let count = 0;

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; },
  };
}

// WHY: Closures "close over" variables from their outer scope.
// Even after exercise1_counter() returns, the inner functions
// still have access to `count`. This creates true private state
// in JavaScript — the only way to access count is through the methods.

// ── Exercise 2 — IIFE ──
function exercise2_iife() {
  // IIFE creates a new scope immediately. The counter variable
  // is trapped inside and can only be accessed through the returned API.
  return (function () {
    let counter = 0;

    return {
      getId() { return ++counter; },
      reset() { counter = 0; },
    };
  })();
}

// WHY: Before ES6 modules, IIFE was THE pattern for encapsulation.
// The function runs immediately, creating a private scope.
// The returned object is the "public API". This is the Module Pattern.
// Today, ES modules serve this purpose, but IIFE is still useful for
// one-off scope isolation (e.g., in scripts without a build step).

// ── Exercise 3 — Higher-Order Functions ──
function exercise3_higherOrder() {
  // A higher-order function either takes a function as an argument
  // or returns a function (or both). map and filter are classic examples.

  function myMap(array, transformFn) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      result.push(transformFn(array[i], i, array));
    }
    return result;
  }

  function myFilter(array, predicateFn) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      if (predicateFn(array[i], i, array)) {
        result.push(array[i]);
      }
    }
    return result;
  }

  return { myMap, myFilter };
}

// WHY: Understanding how map/filter work internally deepens your
// understanding of callbacks and iteration. Note how we pass (element, index, array)
// to match the real Array.prototype.map signature.

// ── Exercise 4 — Currying ──
function exercise4_curry(fn) {
  // Currying transforms f(a, b, c) into f(a)(b)(c).
  // This implementation also supports partial application: f(a, b)(c).
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Otherwise, return a new function that collects more arguments
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// WHY: Currying enables partial application — pre-filling some arguments.
// Example: const add5 = curry(add)(5); add5(3) → 8
// fn.length gives the number of declared parameters.
// We keep collecting args until we have enough to call the original.
// This is heavily used in functional programming (Ramda, lodash/fp).

// ── Exercise 5 — Memoization ──
function exercise5_memoize(fn) {
  // Cache maps argument signatures to their computed results.
  // We use JSON.stringify as a simple (but imperfect) cache key.
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// WHY: Memoization trades memory for speed. For pure functions
// (same input → same output), caching avoids redundant computation.
// JSON.stringify works for primitive args but fails for circular refs
// or objects where key order matters. Production memoizers use more
// sophisticated key strategies. Map is used instead of a plain object
// because it handles any string key without prototype collisions.

// ── Exercise 6 — Function Composition ──
function exercise6_composition() {
  // compose applies functions RIGHT to LEFT: compose(f, g)(x) = f(g(x))
  function compose(...fns) {
    return function (x) {
      return fns.reduceRight((acc, fn) => fn(acc), x);
    };
  }

  // pipe applies functions LEFT to RIGHT: pipe(f, g)(x) = g(f(x))
  function pipe(...fns) {
    return function (x) {
      return fns.reduce((acc, fn) => fn(acc), x);
    };
  }

  return { compose, pipe };
}

// WHY: Composition lets you build complex transformations from simple ones.
// compose is mathematical convention (right-to-left), matching f(g(x)).
// pipe is more readable (left-to-right), matching "first do X, then Y".
// reduceRight and reduce elegantly express the direction difference.
// Used heavily in Redux middleware, RxJS operators, and FP libraries.

// ── Exercise 7 — Rest/Spread in Functions ──
function exercise7_restSpread() {
  // Rest (...) collects arguments into an array.
  // Spread (...) expands an iterable into individual elements.

  function mergeObjects(...objects) {
    // Spread each object into a new one. Later properties override earlier ones.
    return Object.assign({}, ...objects);
    // Equivalent: return objects.reduce((merged, obj) => ({ ...merged, ...obj }), {});
  }

  function sumAll(...numbers) {
    // Rest parameter collects all arguments into an array
    return numbers.reduce((sum, n) => sum + n, 0);
  }

  return { mergeObjects, sumAll };
}

// WHY: Rest/spread replaced the old `arguments` object.
// Rest is cleaner: it gives a real array (arguments is array-like).
// Spread for objects is a shallow merge — nested objects are still references.
// Object.assign does the same thing but spread syntax is more readable.

// ── Exercise 8 — Arrow vs Regular Functions (this) ──
function exercise8_arrowVsRegular() {
  const obj = {
    value: 42,

    // Regular function: `this` depends on HOW the function is called
    getRegular() {
      const regular = function () {
        return this;
      };
      return regular(); // called without context → this is undefined (strict) or global
    },

    // Arrow function: `this` is lexically inherited from the enclosing scope
    getArrow() {
      const arrow = () => {
        return this;
      };
      return arrow(); // inherits `this` from getArrow → obj
    },
  };

  return {
    regularThis: "global/undefined (depends on strict mode)",
    arrowThis: "lexically inherited from enclosing scope (the object's method)",
    regular: typeof obj.getRegular(), // "object" (global) or "undefined" (strict)
    arrow: obj.getArrow().value,      // 42 — because this === obj
  };
}

// WHY: This is one of the most common interview questions.
// Regular functions: `this` is determined by the CALL SITE.
//   - obj.method() → this = obj
//   - const fn = obj.method; fn() → this = undefined (strict) / global (sloppy)
//   - setTimeout(obj.method, 0) → this is lost!
// Arrow functions: `this` is captured at DEFINITION TIME from the enclosing scope.
//   - They don't have their own `this`, `arguments`, `super`, or `new.target`.
//   - This is why arrows are perfect for callbacks (setTimeout, .then, event handlers).
// Rule of thumb: Use arrows for callbacks, regular functions for methods.

// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 02 Solutions ===\n");

  const c = exercise1_counter();
  c.increment(); c.increment(); c.decrement();
  console.log("Ex1 counter:", c.getCount()); // 1

  const mod = exercise2_iife();
  console.log("Ex2 IIFE:", mod.getId(), mod.getId(), (mod.reset(), mod.getId())); // 1 2 1

  const { myMap, myFilter } = exercise3_higherOrder();
  console.log("Ex3 myMap:", myMap([1,2,3], x => x * 2)); // [2,4,6]
  console.log("Ex3 myFilter:", myFilter([1,2,3,4,5], x => x % 2 === 0)); // [2,4]

  const add = (a, b, c) => a + b + c;
  const curried = exercise4_curry(add);
  console.log("Ex4 curry:", curried(1)(2)(3), curried(1, 2)(3)); // 6 6

  let calls = 0;
  const fn = (n) => { calls++; return n * 2; };
  const memo = exercise5_memoize(fn);
  memo(5); memo(5); memo(10);
  console.log("Ex5 memoize:", memo(5), "calls:", calls); // 10 calls: 2

  const { compose, pipe } = exercise6_composition();
  const double = x => x * 2;
  const addOne = x => x + 1;
  console.log("Ex6 compose:", compose(addOne, double)(5)); // 11
  console.log("Ex6 pipe:", pipe(double, addOne)(5)); // 11

  const { mergeObjects, sumAll } = exercise7_restSpread();
  console.log("Ex7 merge:", mergeObjects({ a: 1 }, { b: 2 }, { a: 3 })); // { a: 3, b: 2 }
  console.log("Ex7 sum:", sumAll(1, 2, 3, 4, 5)); // 15

  console.log("Ex8 this:", exercise8_arrowVsRegular());
}

runTests();
