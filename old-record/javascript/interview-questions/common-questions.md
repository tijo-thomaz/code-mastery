# Common JavaScript Interview Questions

15 frequently asked questions with concise, interview-ready answers.

---

## 1. How does the JavaScript Event Loop work?

JavaScript is single-threaded. The event loop enables non-blocking I/O by offloading operations to the browser/Node.js APIs.

**Execution order:**
1. **Call stack** — synchronous code runs to completion
2. **Microtask queue** — `Promise.then`, `queueMicrotask`, `MutationObserver` — ALL drained before next step
3. **Macrotask queue** — ONE task runs: `setTimeout`, `setInterval`, I/O
4. Repeat from step 2

```javascript
console.log("1");              // sync
setTimeout(() => console.log("2"), 0); // macro
Promise.resolve().then(() => console.log("3")); // micro
console.log("4");              // sync
// Output: 1, 4, 3, 2
```

---

## 2. What are closures? Give a practical example.

A closure is a function that remembers variables from its outer (lexical) scope even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0; // enclosed variable
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // count is "private", accessible only through methods
```

**Use cases:** data privacy, factory functions, partial application, event handlers that need state.

---

## 3. Explain prototypal inheritance.

Every JavaScript object has an internal `[[Prototype]]` link to another object. When you access a property, JS walks up the prototype chain until it finds it or hits `null`.

```javascript
const animal = { speak() { return "..."; } };
const dog = Object.create(animal);
dog.speak = function() { return "Woof!"; };

dog.speak();           // "Woof!" (own property)
dog.toString();        // found on Object.prototype (up the chain)
dog.hasOwnProperty("speak"); // true
```

**ES6 classes** are syntactic sugar over this mechanism. `class Dog extends Animal` sets up the prototype chain.

---

## 4. How does `this` work in JavaScript?

`this` is determined by **how a function is called**, not where it's defined.

| Call style | `this` value |
|---|---|
| `obj.method()` | `obj` |
| `fn()` | `undefined` (strict) / `global` (sloppy) |
| `new Fn()` | new instance |
| `fn.call(ctx)` / `fn.apply(ctx)` | `ctx` |
| `fn.bind(ctx)()` | `ctx` (permanently) |
| `() => {}` | inherited from enclosing scope (lexical) |

**Arrow functions** don't have their own `this` — they capture it from the surrounding code. This is why they're ideal for callbacks.

---

## 5. Explain hoisting.

JavaScript moves declarations (not initializations) to the top of their scope during compilation.

- **`var`** — hoisted and initialized to `undefined`
- **`let`/`const`** — hoisted but NOT initialized → Temporal Dead Zone (TDZ)
- **`function` declarations** — fully hoisted (name + body)
- **`function` expressions** — only the variable is hoisted (as `var`/`let`)

```javascript
console.log(a); // undefined (var hoisted, not initialized)
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;
```

---

## 6. What's the difference between `==` and `===`?

- **`==`** (Abstract Equality) — coerces types before comparing
- **`===`** (Strict Equality) — no coercion, compares type AND value

```javascript
"5" == 5     // true  (string coerced to number)
"5" === 5    // false (different types)
null == undefined  // true  (special rule)
null === undefined // false
```

**Rule:** Always use `===` unless you explicitly need coercion (e.g., `value == null` checks both null and undefined).

---

## 7. What is event delegation?

Instead of attaching listeners to every child element, attach ONE listener to a parent and use `event.target` to determine which child was clicked.

```javascript
// ❌ Bad: 1000 listeners
items.forEach(item => item.addEventListener("click", handler));

// ✅ Good: 1 listener
list.addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (item) handleClick(item);
});
```

**Benefits:** fewer listeners (performance), works with dynamically added elements, simpler cleanup.

---

## 8. Debounce vs Throttle — when to use which?

| | Debounce | Throttle |
|---|---|---|
| **Behavior** | Fires after N ms of *inactivity* | Fires at most once per N ms |
| **Analogy** | Elevator: wait for people to stop entering | Rate limiter: max 1 per interval |
| **Use cases** | Search input, resize end, auto-save | Scroll, mouse move, API rate limiting |

```javascript
// Debounce: resets timer on each call
// Throttle: executes immediately, then ignores until interval passes
```

---

## 9. What's the difference between `var`, `let`, and `const`?

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (→ undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignment | ✅ | ✅ | ❌ |
| Redeclaration | ✅ | ❌ | ❌ |

**Best practice:** Use `const` by default. Use `let` when you need reassignment. Never use `var`.

---

## 10. What are Promises and how do they differ from callbacks?

A Promise represents a future value. It can be **pending**, **fulfilled**, or **rejected**.

**Callbacks problems:** callback hell (nesting), error handling is manual, no composition.

**Promises advantages:** chainable (`.then`), built-in error propagation (`.catch`), composable (`Promise.all`, `Promise.race`).

```javascript
// Callback hell
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => { ... });
  });
});

// Promise chain (flat)
getUser(id)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .catch(err => handleError(err));
```

---

## 11. What is the difference between `null` and `undefined`?

- **`undefined`** — variable declared but not assigned; default return value; missing function args
- **`null`** — intentional absence of value; explicitly assigned

```javascript
let a;          // undefined (not assigned)
let b = null;   // null (intentionally empty)
typeof undefined // "undefined"
typeof null      // "object" (historic bug)
null == undefined  // true
null === undefined // false
```

**Convention:** Use `null` to explicitly clear a value. Check for both with `value == null`.

---

## 12. How does `async/await` work under the hood?

`async/await` is syntactic sugar over Promises and generators.

- `async` function always returns a Promise
- `await` pauses execution until the Promise settles
- Under the hood, the engine transforms it into a state machine of `.then()` calls

```javascript
// This async function...
async function getData() {
  const a = await fetchA();
  const b = await fetchB(a);
  return b;
}

// ...is equivalent to:
function getData() {
  return fetchA()
    .then(a => fetchB(a))
    .then(b => b);
}
```

**Common mistake:** Using `await` in a loop when tasks could run in parallel. Use `Promise.all` instead.

---

## 13. What are WeakMap and WeakSet? When would you use them?

They hold **weak references** to object keys/values — entries are garbage-collected when no other reference exists.

| | Map/Set | WeakMap/WeakSet |
|---|---|---|
| Key types | Any | Objects only |
| Iterable | ✅ | ❌ |
| GC behavior | Strong refs (prevents GC) | Weak refs (allows GC) |

**Use cases:**
- Caching computed results per DOM node (WeakMap)
- Tracking visited objects without memory leaks (WeakSet)
- Storing private data associated with objects (WeakMap)

---

## 14. Explain the difference between shallow copy and deep copy.

**Shallow copy:** copies top-level properties. Nested objects still share references.
**Deep copy:** recursively copies all levels. No shared references.

```javascript
// Shallow
const shallow = { ...original };
const shallow2 = Object.assign({}, original);

// Deep
const deep = structuredClone(original); // modern, built-in
const deep2 = JSON.parse(JSON.stringify(original)); // lossy (no Date, undefined, functions)
```

**`structuredClone()`** handles: Date, Map, Set, ArrayBuffer, circular references. Does NOT handle: functions, DOM nodes.

---

## 15. What is the Temporal Dead Zone (TDZ)?

The TDZ is the period between entering a scope and the `let`/`const` declaration being reached. Accessing the variable during this period throws `ReferenceError`.

```javascript
{
  // TDZ starts
  console.log(x); // ReferenceError!
  let x = 10;     // TDZ ends
  console.log(x); // 10
}
```

**Why it exists:** To catch bugs. With `var`, using a variable before declaration silently gives `undefined`, which masks errors. The TDZ makes this a hard error.

---

## Quick-Fire Checklist Before Interviews

- [ ] Can I explain the event loop with a code example?
- [ ] Can I write debounce and throttle from memory?
- [ ] Do I understand `this` in all 5 call patterns?
- [ ] Can I explain closures with a real use case?
- [ ] Do I know when to use `Promise.all` vs `allSettled` vs `race`?
- [ ] Can I explain prototypal inheritance without classes?
- [ ] Do I understand `==` coercion rules?
- [ ] Can I trace event loop output order (sync → micro → macro)?
