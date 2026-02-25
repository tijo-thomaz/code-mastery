/**
 * ===========================================
 * 05 — ES6+ Features — SOLUTIONS
 * ===========================================
 */

// ── Exercise 1 — Classes ──
function exercise1_classes() {
  class Shape {
    constructor(color) {
      this.color = color;
    }

    getColor() {
      return this.color;
    }

    area() {
      throw new Error("Not implemented");
    }

    // Static methods belong to the class, not instances.
    // Called as Shape.compare(), not shape.compare().
    static compare(s1, s2) {
      return s1.area() >= s2.area() ? s1 : s2;
    }
  }

  class Circle extends Shape {
    constructor(color, radius) {
      super(color); // MUST call super() before using `this`
      this.radius = radius;
    }

    area() {
      return Math.PI * this.radius ** 2;
    }
  }

  class Rectangle extends Shape {
    constructor(color, width, height) {
      super(color);
      this.width = width;
      this.height = height;
    }

    area() {
      return this.width * this.height;
    }
  }

  return { Shape, Circle, Rectangle };
}

// WHY: ES6 classes are syntactic sugar over prototypal inheritance.
// Under the hood, Circle.prototype.__proto__ === Shape.prototype.
// super() calls the parent constructor — required before accessing `this`.
// Static methods are utility functions that don't need instance data.
// The abstract area() pattern (throw on base class) is the Template Method pattern.

// ── Exercise 2 — Symbols ──
function exercise2_symbols() {
  // Symbol creates a unique, non-string property key.
  // Symbols are never shown in JSON.stringify or for...in loops.
  const _amount = Symbol("amount");
  const _currency = Symbol("currency");

  function createMoney(amount, currency) {
    return {
      [_amount]: amount,
      [_currency]: currency,

      // Symbol.iterator makes the object work with for...of and spread
      *[Symbol.iterator]() {
        const sign = currency === "USD" ? "$" : currency;
        for (let i = 0; i < amount; i++) {
          yield sign;
        }
      },

      // Symbol.toPrimitive controls type conversion behavior
      [Symbol.toPrimitive](hint) {
        if (hint === "number") return amount;
        if (hint === "string") return `${amount} ${currency}`;
        return amount; // default hint
      },
    };
  }

  return createMoney;
}

// WHY: Symbols solve the "name collision" problem for object properties.
// Well-known symbols (Symbol.iterator, Symbol.toPrimitive) let you hook into
// JS language mechanics — making custom objects work with for...of, +, String(), etc.
// Symbol.iterator must return an iterator (object with next() method).
// Using a generator function (*[Symbol.iterator]) is the easiest way.

// ── Exercise 3 — Iterators and Generators ──
function exercise3_generators() {
  // Generators are functions that can be paused and resumed.
  // yield pauses and returns a value; next() resumes.
  function* range(start, end, step = 1) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  }

  // Infinite generator — produces values forever.
  // Only computes values on demand (lazy evaluation).
  function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  // Helper to consume n values from any iterable
  function take(iterable, n) {
    const result = [];
    let count = 0;
    for (const value of iterable) {
      if (count >= n) break;
      result.push(value);
      count++;
    }
    return result;
  }

  return { range, fibonacci, take };
}

// WHY: Generators enable lazy evaluation — values are computed only when needed.
// This is critical for infinite sequences (fibonacci, event streams).
// The yield keyword pauses the function and returns { value, done }.
// Generators implement the Iterator protocol, so they work with for...of and spread.
// The take() utility is essential for consuming infinite generators safely.
// ES2025 adds Iterator helpers (.take(), .map(), .filter()) built-in!

// ── Exercise 4 — WeakMap and WeakSet ──
function exercise4_weakMapSet() {
  // WeakMap holds weak references to keys — when the key is garbage collected,
  // the entry is automatically removed. Keys must be objects.
  const privateData = new WeakMap();

  function createPerson(name, age) {
    const person = {
      getName() { return privateData.get(person).name; },
      getAge() { return privateData.get(person).age; },
    };
    privateData.set(person, { name, age });
    return person;
  }

  // WeakSet tracks object membership without preventing GC
  const visited = new WeakSet();

  function markVisited(node) {
    visited.add(node);
  }

  function isVisited(node) {
    return visited.has(node);
  }

  return { createPerson, markVisited, isVisited };
}

// WHY: WeakMap/WeakSet prevent memory leaks in long-running applications.
// Regular Map/Set hold strong references — objects can't be GC'd even if
// nothing else references them. WeakMap keys are held weakly.
// Use cases:
//   - Private data (WeakMap with object as key, private data as value)
//   - Caching computed results per object (without leaking)
//   - Tracking visited DOM nodes or objects in graph traversal
// Limitations: not iterable, no .size, no .clear() (by design).

// ── Exercise 5 — Proxy ──
function exercise5_proxy() {
  function createValidatedObject() {
    const data = {};
    const allowedKeys = new Set(["name", "age", "email"]);

    return new Proxy(data, {
      set(target, prop, value) {
        if (!allowedKeys.has(prop)) {
          throw new Error(`Property "${prop}" is not allowed`);
        }

        if (prop === "name" && (typeof value !== "string" || value.length === 0)) {
          throw new Error("name must be a non-empty string");
        }
        if (prop === "age" && (!Number.isInteger(value) || value <= 0)) {
          throw new Error("age must be a positive integer");
        }
        if (prop === "email" && (typeof value !== "string" || !value.includes("@"))) {
          throw new Error('email must contain "@"');
        }

        target[prop] = value;
        return true; // Must return true for the set to succeed
      },

      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return "UNKNOWN";
      },
    });
  }

  return createValidatedObject;
}

// WHY: Proxy intercepts fundamental operations on objects (get, set, delete, etc.).
// This creates "reactive" or "validated" objects with custom behavior.
// The handler traps are: get, set, has, deleteProperty, apply, construct, etc.
// set() must return true for the assignment to succeed (false throws in strict mode).
// Real-world use: Vue 3's reactivity system, form validation, logging/debugging.

// ── Exercise 6 — Tagged Template Literals ──
function exercise6_taggedTemplates() {
  // Tag functions receive: array of string parts + interpolated values
  function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
      return result + str + (i < values.length ? `**${values[i]}**` : "");
    }, "");
  }

  // SQL tag creates a parameterized query (prevents SQL injection)
  function sql(strings, ...values) {
    const query = strings.reduce((result, str, i) => {
      return result + str + (i < values.length ? `$${i + 1}` : "");
    }, "");
    return { query, params: values };
  }

  return { highlight, sql };
}

// WHY: Tagged templates are one of JS's most underused features.
// The tag function gets the raw string pieces and interpolated values separately.
// This separation is perfect for:
//   - SQL parameterization (preventing injection)
//   - HTML escaping (lit-html, styled-components)
//   - Internationalization (i18n tagged templates)
//   - Syntax highlighting or formatting
// strings always has one more element than values (strings[i] + values[i] + strings[i+1]).

// ── Exercise 7 — Dynamic Import Concept ──
function exercise7_dynamicImport() {
  // Dynamic import() returns a promise, enabling:
  //   - Code splitting (load modules on demand)
  //   - Conditional loading (based on user actions or environment)
  //   - Lazy loading (defer heavy modules until needed)

  const modules = {
    math: {
      add: (a, b) => a + b,
      multiply: (a, b) => a * b,
    },
    string: {
      capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
      reverse: (s) => [...s].reverse().join(""),
    },
  };

  function loadModule(moduleName) {
    return new Promise((resolve, reject) => {
      // Simulate async loading delay
      setTimeout(() => {
        if (modules[moduleName]) {
          resolve(modules[moduleName]);
        } else {
          reject(new Error("Module not found"));
        }
      }, 10);
    });
  }

  return loadModule;
}

// WHY: Static import (top of file) is resolved at parse time — all or nothing.
// Dynamic import() is a function call that returns a promise, enabling:
//   const { default: Chart } = await import('./chart.js');
// This is how webpack/Vite code-split — each dynamic import becomes a separate chunk.
// Pattern: const module = await import(`./locales/${lang}.js`);

// ── Exercise 8 — Top-Level Await Concept ──
async function exercise8_topLevelAwait() {
  // Simulate async initialization that would use top-level await in an ES module:
  //
  //   // config.mjs (ES module)
  //   const response = await fetch('/api/config');
  //   export const config = await response.json();
  //
  // Top-level await works in ES modules (.mjs or "type":"module" in package.json).
  // It pauses the module's execution until the await resolves.
  // Any module that imports this module will wait for it to finish.
  //
  // Use cases:
  //   - Loading configuration before the app starts
  //   - Initializing database connections
  //   - Conditional module loading based on environment

  const config = await delay(10, { loaded: true });

  return {
    ready: true,
    config,
    getData: () => "module data",
  };
}

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 05 Solutions ===\n");

  const { Shape, Circle, Rectangle } = exercise1_classes();
  const c = new Circle("red", 5);
  const r = new Rectangle("blue", 4, 6);
  console.log("Ex1 circle:", c.area(), c.getColor());
  console.log("Ex1 rect:", r.area());
  console.log("Ex1 compare:", Shape.compare(c, r).constructor.name);

  const createMoney = exercise2_symbols();
  const m = createMoney(3, "USD");
  console.log("Ex2:", String(m), +m, [...m]);

  const { range, fibonacci, take } = exercise3_generators();
  console.log("Ex3 range:", [...range(0, 10, 3)]);
  console.log("Ex3 fib:", take(fibonacci(), 8));

  const { createPerson, markVisited, isVisited } = exercise4_weakMapSet();
  const p = createPerson("Alice", 30);
  console.log("Ex4:", p.getName(), p.getAge());
  const node = { id: 1 };
  markVisited(node);
  console.log("Ex4 visited:", isVisited(node));

  const createValidatedObject = exercise5_proxy();
  const obj = createValidatedObject();
  obj.name = "Alice"; obj.age = 25; obj.email = "a@b.com";
  console.log("Ex5:", obj.name, obj.age, obj.email, obj.foo);

  const { highlight, sql } = exercise6_taggedTemplates();
  console.log("Ex6:", highlight`Hello ${"Alice"}, age ${30}`);
  console.log("Ex6:", sql`SELECT * FROM users WHERE id = ${42} AND name = ${"Alice"}`);

  const loadModule = exercise7_dynamicImport();
  const math = await loadModule("math");
  console.log("Ex7:", math.add(2, 3), math.multiply(2, 3));

  console.log("Ex8:", await exercise8_topLevelAwait());
}

runTests();
