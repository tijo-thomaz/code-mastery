// ========================================
// DAY 5 — 5 DRILLS
// ========================================

// ---- DRILL 1: Promise.all from scratch (8 min) ----
// Implement myPromiseAll: takes array of promises, resolves when all resolve.
// Rejects immediately if any promise rejects.

function myPromiseAll(promises) {

}

// Test:
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log); // [1, 2, 3]

// ---- DRILL 2: Curry (5 min) ----
// Implement curry: converts fn(a, b, c) to fn(a)(b)(c)
// Also works: fn(a, b)(c) or fn(a)(b, c)

function curry(fn) {

}

const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3));   // 6
console.log(add(1, 2)(3));   // 6
console.log(add(1)(2, 3));   // 6

// ---- DRILL 3: Deep Clone (5 min) ----
// Clone an object deeply. Handle: objects, arrays, Date, null.
// Do NOT use structuredClone or JSON.parse.

function deepClone(obj) {

}

const original = { a: 1, b: { c: 2 }, d: [1, 2, 3], e: new Date() };
const cloned = deepClone(original);
cloned.b.c = 999;
console.log(original.b.c); // 2 (not mutated)
console.log(cloned.b.c);   // 999

// ---- DRILL 4: Pipe (3 min) ----
// Implement pipe: pipe(fn1, fn2, fn3)(x) → fn3(fn2(fn1(x)))

function pipe(...fns) {

}

const transform = pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => `Result: ${x}`
);
console.log(transform(5)); // "Result: 12"

// ---- DRILL 5: Event Emitter (8 min) ----
// Implement a class with: on(event, callback), emit(event, ...args), off(event, callback)

class EventEmitter {

}

const emitter = new EventEmitter();
const greet = (name) => console.log(`Hello ${name}`);
emitter.on('greet', greet);
emitter.emit('greet', 'Alice'); // Hello Alice
emitter.off('greet', greet);
emitter.emit('greet', 'Bob');   // nothing

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
