# M2: JavaScript Core

> **Read → Drill → Trap Questions**
> **Time:** 45 min total

---

## SECTION A: Concepts to Explain Out Loud

---

### 1. Closures
> Function + its birth scope. Inner function remembers outer variables even after outer returns. Used for: privacy, memoize, debounce, curry, once().

### 2. Event Loop
> Single thread. Call stack → microtasks (Promise.then, queueMicrotask) → ONE macrotask (setTimeout, setInterval) → repeat. Microtasks drain completely before next macrotask.

### 3. `this` Keyword
> 4 rules: Default (global/undefined strict), Implicit (left of dot), Explicit (call/apply/bind), New (fresh object). Arrow = lexical (inherits from enclosing scope).

### 4. Prototypes
> Every object has `__proto__` chain → Object.prototype → null. Property lookup walks the chain. `class` is sugar. `extends` sets up the prototype link.

### 5. Event Delegation
> Attach ONE listener on parent, use `e.target` to identify which child was clicked. Works because events bubble up the DOM. Fewer listeners = better memory + performance.

### 6. ES Modules vs CommonJS
> ESM: `import/export`, static, tree-shakeable, async. CJS: `require/module.exports`, dynamic, synchronous, no tree-shaking. Modern = ESM.

---

## SECTION B: 🪤 TRAP QUESTIONS

---

### TRAP 1: var vs let vs const hoisting
```js
console.log(a); // ?
console.log(b); // ?
console.log(c); // ?

var a = 1;
let b = 2;
const c = 3;
```

**Answer:**
```
undefined          // var is hoisted, initialized to undefined
ReferenceError     // let is hoisted but in TDZ (Temporal Dead Zone)
// never reaches c — script stops at b's ReferenceError
```

---

### TRAP 2: Closure in a loop
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Output:** `3, 3, 3` — var is function-scoped, all callbacks share same `i`, which is 3 after loop.

**Fix 1:** `let i` — block-scoped, each iteration gets its own `i`
**Fix 2:** IIFE — `(function(j) { setTimeout(() => console.log(j), 100); })(i)`

---

### TRAP 3: == vs ===
```js
console.log(0 == '');        // true  (both coerce to 0)
console.log(0 == '0');       // true  (string coerces to number)
console.log('' == '0');      // false (string comparison, different strings)
console.log(false == '0');   // true  (both coerce to 0)
console.log(null == undefined); // true  (special rule)
console.log(null === undefined); // false (different types)
```

**Rule:** Always use `===`. Never use `==` except for `null` checks: `value == null` catches both null and undefined.

---

### TRAP 4: typeof gotchas
```js
typeof undefined    // "undefined"
typeof null         // "object"  ← TRAP! Historical bug, never fixed
typeof NaN          // "number"  ← TRAP! NaN is a number type
typeof []           // "object"  ← Use Array.isArray()
typeof function(){} // "function"
```

---

### TRAP 5: this in different contexts
```js
const obj = {
  name: 'CSE',
  greet: function() { console.log(this.name); },
  greetArrow: () => { console.log(this.name); }
};

obj.greet();          // "CSE" — implicit binding
obj.greetArrow();     // undefined — arrow inherits from outer scope (module/global)

const fn = obj.greet;
fn();                 // undefined — lost implicit binding, default binding (global)
```

---

### TRAP 6: Promise execution order
```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

**Output:** `1, 4, 3, 2`

> Sync first (1, 4), then microtask (Promise → 3), then macrotask (setTimeout → 2).

---

### TRAP 7: Object reference
```js
const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a.x); // ?
```

**Answer:** `2` — objects are passed by reference. `b` and `a` point to the same object.

**Follow-up:**
```js
const a = { x: 1 };
const b = { ...a };
b.x = 2;
console.log(a.x); // 1 — spread creates a shallow copy
```

---

### TRAP 8: Array method gotchas
```js
const arr = [1, 2, 3];

// map returns new array
arr.map(x => x * 2); // [2, 4, 6] — arr is unchanged

// sort MUTATES
arr.sort((a, b) => b - a); // arr is now [3, 2, 1]

// splice MUTATES, slice doesn't
arr.splice(0, 1); // removes first element, arr = [2, 1]
arr.slice(0, 1);  // returns [2], arr unchanged
```

**Rule:** Know which methods mutate: `push, pop, shift, unshift, splice, sort, reverse` — all mutate. `map, filter, reduce, slice, concat, flat` — return new array.

---

### TRAP 9: NaN
```js
NaN === NaN       // false ← TRAP!
Number.isNaN(NaN) // true  ← correct way
isNaN('hello')    // true  ← TRAP! coerces string, use Number.isNaN
Number.isNaN('hello') // false ← correct
```

---

### TRAP 10: Comma operator & short-circuit
```js
const x = (1, 2, 3);
console.log(x); // 3 — comma operator returns last value

console.log(0 || 'default');   // "default" — 0 is falsy
console.log(0 ?? 'default');   // 0 — ?? only catches null/undefined
console.log('' ?? 'default');  // '' — empty string is NOT null/undefined
console.log(null ?? 'default'); // "default"
```

**Key:** `||` checks falsy (0, '', false, null, undefined, NaN). `??` only checks null/undefined. Use `??` for defaults where 0 or '' are valid values.

---

### TRAP 11: Async/Await order
```js
async function foo() {
  console.log('1');
  const result = await Promise.resolve('2');
  console.log(result);
  console.log('3');
}

console.log('4');
foo();
console.log('5');
```

**Output:** `4, 1, 5, 2, 3`

> `4` sync → `foo()` starts, prints `1` → hits `await`, pauses foo → `5` sync → microtask resumes foo → `2, 3`.

---

## SECTION C: Hands-On Drill (10 min)

> Write these from memory. These are CSE machine-test likely patterns.

### 1. Debounce (3 min)
```js
function debounce(fn, delay) {
  // YOUR CODE — use setTimeout, clearTimeout, closure
}
```

### 2. Throttle (3 min)
```js
function throttle(fn, limit) {
  // YOUR CODE — use flag or timestamp
}
```

### 3. Deep Clone (3 min)
```js
function deepClone(obj) {
  // Handle: null, non-objects, arrays, Date, nested objects
}
```

### 4. Flatten Array (2 min)
```js
function flatten(arr) {
  // Recursive — check Array.isArray, spread + recurse
}
```

---

## ✅ Checklist

- [ ] Can explain closures, event loop, `this`, prototypes in 30 sec each
- [ ] Can solve all 11 trap questions without peeking
- [ ] Can write debounce, throttle, deepClone, flatten from memory
- [ ] Know which array methods mutate and which don't
- [ ] Know `==` vs `===` vs `??` vs `||` edge cases
