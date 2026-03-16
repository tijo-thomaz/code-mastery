/**
 * ===========================================
 * 07 — Interview Drills (2026 Edition)
 * ===========================================
 * Based on: your 15 failed interviews +
 *           top trending JS questions 2025-2026
 *
 * Sections:
 *   A. Array Manipulation (your #1 failure area)
 *   B. Polyfills — Implement From Scratch
 *   C. Utility Functions (debounce, throttle, memoize, curry, pipe)
 *   D. Output Prediction (this, closures, event loop, hoisting)
 *   E. String & Data Structure Challenges
 *   F. Async Patterns (Promise.all, retry, concurrency limiter)
 *   G. ES2025 Awareness (new features they now ask about)
 *
 * Rules:
 *   1. Try EVERY exercise WITHOUT looking at solutions
 *   2. Time yourself — target times are given
 *   3. If you fail, study the solution, then DELETE and redo
 *   4. Repeat until you can write it from memory
 *
 * Run: node javascript/exercises/07-interview-drills.js
 * ===========================================
 */

// ╔═══════════════════════════════════════════╗
// ║  SECTION A — Array Manipulation Drills    ║
// ║  (Failed at: Wipro, UST x2, Socure, Arrow)║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// A1 — Frequency Count
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Given an array, return an object where keys are
// elements and values are how many times they appear.
//
// frequencyCount(["a","b","a","c","b","a"])
// → { a: 3, b: 2, c: 1 }
// ────────────────────────────────────────────
function A1_frequencyCount(arr) {
  // TODO
  // return arr.reduce((acc, item) => {
  //   acc[item] = (acc[item] || 0) + 1
  // }, {})
  const freq = {}
  for (let i = 0; i < arr.length; i++) {
    freq[arr[i]] = (freq[arr[i]] || 0) + 1;
  }


  return freq

}

// ────────────────────────────────────────────
// A2 — Most Frequent Element
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐
//
// Return the element that appears the most.
// If tie, return the first one encountered.
//
// mostFrequent([3,1,3,2,1,3]) → 3
// ────────────────────────────────────────────
function A2_mostFrequent(arr) {
  const freq = {}
  let maxcount = 0;
  let maxItem = arr[0];


  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1
    if (freq[item] > maxcount) { // first occurence >= last occurence   
      maxcount = freq[item]
      maxItem = item
    }
  }

  return maxItem
}

// ────────────────────────────────────────────
// A3 — Dedup Primitives
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Remove duplicates from an array of primitives.
//
// dedup([1,2,2,3,3,3]) → [1,2,3]
// ────────────────────────────────────────────
function A3_dedupPrimitives(arr) {
  return [...new Set(arr)]
}

// ────────────────────────────────────────────
// A4 — Dedup Objects by Key
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Remove duplicate objects based on a given key.
// Keep the LAST occurrence.
//
// dedupByKey(
//   [{ id: 1, email: "a@b.com" }, { id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }],
//   "email"
// )
// → [{ id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }]
// ────────────────────────────────────────────
function A4_dedupByKey(arr, key) {
  // TODO
  // const map = new Map()
  // for (const items of arr) {
  //   map.set(items[key], item)
  // }

  // return [...map.values()]


  const map = new Map()

  for (const item of arr) {
    map.set(item[key], item)
  }


  return [...map.values()]


}

// ────────────────────────────────────────────
// A5 — GroupBy
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐
//
// Group array items by a key. Return object where
// keys are group names and values are arrays of items.
//
// groupBy(
//   [{name:"Apple", type:"fruit"}, {name:"Carrot", type:"veg"}, {name:"Banana", type:"fruit"}],
//   "type"
// )
// → { fruit: [{...}, {...}], veg: [{...}] }
// ────────────────────────────────────────────
function A5_groupBy(arr, key) {
  // TODO
  // return arr.reduce((acc,item)=>{
  //    const group = item[key]
  //    if(!acc[group]) acc[group] = []
  //    acc[group].push(item)
  //   return acc
  // },{})



  //   return arr.reduce((acc,item)=>{
  //      const group = item[key]
  //      if(!acc[group]) acc[group]=[]
  //      acc[group].push(item)
  // ` `
  //     return acc
  //   },{})


  // return arrr.reduce((acc, item) => {
  //   const group = item?.[key]
  //   if (group === undefined) return acc;
  //   (acc[item] ?? []).push(item)

  //   return acc
  // }, {})

  return arr.reduce((acc, item) => {

    const group = item?.[key]

    if (group === undefined) return acc;

    (acc[group] ??= []).push(item)



    return acc
  }, {})


}

// ────────────────────────────────────────────
// A6 — GroupBy with Count
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Same as groupBy but return counts instead of items.
//
// groupByCount([{type:"fruit"},{type:"veg"},{type:"fruit"}], "type")
// → { fruit: 2, veg: 1 }
// ────────────────────────────────────────────
function A6_groupByCount(arr, key) {
  // TODO
  return arr.reduce((acc, item) => {
    const group = item?.[key]
    if (group === undefined) return acc

    acc[group] = (acc[group] || 0) + 1

    return acc
  }, {})
}

// ────────────────────────────────────────────
// A7 — Array.from Drills
// ⏱️ Target: 30 seconds each | Difficulty: ⭐⭐
//
// Generate arrays using Array.from:
//   a) [0, 1, 2, 3, 4]
//   b) [1, 2, 3, 4, 5]
//   c) [2, 4, 6, 8, 10]
//   d) [{id:1}, {id:2}, {id:3}]
// ────────────────────────────────────────────
function A7_arrayFromDrills() {
  return {
    a: Array.from({ length: 5 }, (_, i) => i),
    b: Array.from({ length: 5 }, (_, i) => i + 1),
    c: Array.from({ length: 5 }, (_, i) => (i + 1) * 2),
    d: Array.from({ length: 3 }, (_, i) => ({ id: i + 1 })),
  }
}

// ────────────────────────────────────────────
// A8 — Flatten Nested Array (from scratch)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Do NOT use .flat(). Implement recursively.
//
// flatten([1, [2, [3, [4, 5]]]]) → [1, 2, 3, 4, 5]
// ────────────────────────────────────────────
function A8_flatten(arr) {
  // TODO
  // return arr.reduce((acc, item) => {
  //   return acc.concat(Array.isArray(item) ? A8_flatten(item) : item)
  // },[])

  const result = []

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...A8_flatten(item))
    } else {
      result.push(item)
    }

  }

  return result
}

// ────────────────────────────────────────────
// A9 — Fibonacci Generator
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Generate first N fibonacci numbers.
//
// fibonacci(8) → [1, 1, 2, 3, 5, 8, 13, 21]
// ────────────────────────────────────────────
function A9_fibonacci(n) {
  // TODO
  if (n <= 0) return []
  if (n === 1) return [1]

  const fib = [1, 1]
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2])
  }
  return fib

  // if (n >= 1) return 1;
  // let prev = 1, curr = 1;
  // for (let i = 2; i < n; i++) {
  //   const next = prev + curr
  //   prev = curr
  //   curr = next
  // }
  // return curr

}

// ────────────────────────────────────────────
// A10 — Is Fibonacci-like Sequence?
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Check if each element = sum of previous two.
//
// isFibLike([1,1,2,3,5,8,13,21]) → true
// isFibLike([1,2,4,8,16])        → false
// ────────────────────────────────────────────
function A10_isFibLike(arr) {
  // TODO

  if (arr.length < 3) return true
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + arr[i - 2]) return false
  }
  return true
}

// ────────────────────────────────────────────
// A11 — Move Zeros to End
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Move all zeros to end, keep order of non-zeros.
//
// moveZeros([0,1,0,3,12]) → [1,3,12,0,0]
// ────────────────────────────────────────────
function A11_moveZeros(arr) {
  // TODO
  // const nonzeroes = arr.filter(x => x !== 0)
  // const zeroes = arr.length - nonzeroes.length
  // return [...nonzeroes, ...Array(zeroes).fill(0)]

  let instertposition = 0

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[instertposition] = arr[i]
      instertposition++
    }
  }

  while (instertposition < arr.length) {
    arr[instertposition] = 0
    instertposition++
  }

  return arr

}

// ────────────────────────────────────────────
// A12 — Second Largest Element
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Find second largest unique value.
//
// secondLargest([1, 3, 5, 8, 8, 2, 9]) → 8
// ────────────────────────────────────────────
function A12_secondLargest(arr) {
  // TODO

  // let first = -Infinity, second = -Infinity;
  // for (const num of arr) {
  //   if (num > first) {
  //     second = first;
  //     first = num;
  //   } else if (num > second && num !== first) {
  //     second = num
  //   }
  // }

  // return second


  let first = -Infinity, second = -Infinity;

  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num
    }


  }
  return second


}

// ────────────────────────────────────────────
// A13 — Chunk Array
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Split array into chunks of given size.
//
// chunk([1,2,3,4,5,6,7], 3) → [[1,2,3],[4,5,6],[7]]
// ────────────────────────────────────────────
function A13_chunk(arr, size) {
  // TODO
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }

  return result;
}

// ────────────────────────────────────────────
// A14 — Array Intersection
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Return elements present in BOTH arrays.
//
// intersection([1,2,3,4], [3,4,5,6]) → [3,4]
// ────────────────────────────────────────────
function A14_intersection(a, b) {
  const setB = new Set(b)
  return a.filter(x => setB.has(x))
}

// ────────────────────────────────────────────
// A15 — Array Difference
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Return elements in first array but NOT in second.
//
// difference([1,2,3,4], [3,4,5,6]) → [1,2]
// ────────────────────────────────────────────
function A15_difference(a, b) {
  const setB = new Set(b)
  return a.filter(x => !setB.has(x))
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION B — Polyfills (Implement From    ║
// ║  Scratch) — TOP 2026 interview pattern    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// B1 — Implement Array.prototype.myMap
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Implement map from scratch.
// Must handle: callback(element, index, array)
//
// [1,2,3].myMap(x => x * 2) → [2,4,6]
// ────────────────────────────────────────────
function B1_myMap() {
  Array.prototype.myMap = function (cb) {
    const result = []
    for (let i = 0; i < this.length; i++) {
      result.push(cb(this[i], i, this))
    }
    return result
  }
}

// ────────────────────────────────────────────
// B2 — Implement Array.prototype.myFilter
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Implement filter from scratch.
//
// [1,2,3,4,5].myFilter(x => x > 3) → [4,5]
// ────────────────────────────────────────────
function B2_myFilter() {
  Array.prototype.myFilter = function (cb) {
    const result = []
    for (let i = 0; i < this.length; i++) {
      if (cb(this[i], i, this)) result.push(this[i])
    }
    return result
  }
}

// ────────────────────────────────────────────
// B3 — Implement Array.prototype.myReduce
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Implement reduce from scratch.
// Handle: with and without initial value.
// callback(accumulator, currentValue, index, array)
//
// [1,2,3].myReduce((acc, x) => acc + x, 0) → 6
// [1,2,3].myReduce((acc, x) => acc + x)    → 6 (no initial: starts at first element)
// ────────────────────────────────────────────
function B3_myReduce() {
  Array.prototype.myReduce = function (cb, initialValue) {
    let acc = initialValue !== undefined ? initialValue : this[0]
    const startIndex = initialValue !== undefined ? 0 : 1
    for (let i = startIndex; i < this.length; i++) {
      acc = cb(acc, this[i], i, this)
    }
    return acc
  }
}

// ────────────────────────────────────────────
// B4 — Implement Promise.all
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Takes an array of promises.
// Resolves with array of results when ALL resolve.
// Rejects immediately if ANY rejects.
//
// myPromiseAll([Promise.resolve(1), Promise.resolve(2)])
// → Promise<[1, 2]>
// ────────────────────────────────────────────
function B4_myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completed = 0
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val
        if (++completed === promises.length) resolve(results)
      }).catch(reject)
    })
  })
}

// ────────────────────────────────────────────
// B5 — Implement Promise.allSettled
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Waits for ALL promises to settle (resolve or reject).
// Returns array of { status, value } or { status, reason }.
//
// myAllSettled([Promise.resolve(1), Promise.reject("err")])
// → [{ status:"fulfilled", value:1 }, { status:"rejected", reason:"err" }]
// ────────────────────────────────────────────
function B5_myAllSettled(promises) {
  return Promise.all(promises.map(p =>
    Promise.resolve(p)
      .then(value => ({ status: "fulfilled", value }))
      .catch(reason => ({ status: "rejected", reason }))
  ))
}

// ────────────────────────────────────────────
// B6 — Implement Function.prototype.myBind
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Implement bind from scratch.
// Must handle partial application (pre-filled args).
//
// function greet(greeting, name) { return `${greeting}, ${name}`; }
// const hi = greet.myBind(null, "Hi");
// hi("Tijo") → "Hi, Tijo"
// ────────────────────────────────────────────
function B6_myBind() {
  Function.prototype.myBind = function (context, ...args) {
    const fn = this
    return function (...newArgs) {
      return fn.apply(context, [...args, ...newArgs])
    }
  }
}

// ────────────────────────────────────────────
// B7 — Implement Array.prototype.myFlat
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// Implement flat(depth) from scratch.
// Default depth = 1.
//
// [1,[2,[3]]].myFlat()  → [1,2,[3]]
// [1,[2,[3]]].myFlat(Infinity) → [1,2,3]
// ────────────────────────────────────────────
function B7_myFlat() {
  Array.prototype.myFlat = function (depth = 1) {
    const result = []
    const flatten = (arr, d) => {
      for (const item of arr) {
        if (Array.isArray(item) && d > 0) {
          flatten(item, d - 1)
        } else {
          result.push(item)
        }
      }
    }
    flatten(this, depth)
    return result
  }
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION C — Utility Functions            ║
// ║  (debounce, throttle, memoize, curry,     ║
// ║   pipe, compose, once, deep clone)        ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// C1 — Debounce
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Only calls fn after `delay` ms of inactivity.
// Each new call resets the timer.
// ────────────────────────────────────────────
function C1_debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// ────────────────────────────────────────────
// C2 — Throttle
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Calls fn immediately, then at most once per `interval` ms.
// ────────────────────────────────────────────
function C2_throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      return fn.apply(this, args)
    }
  }
}

// ────────────────────────────────────────────
// C3 — Memoize
// ⏱️ Target: 90 seconds | Difficulty: ⭐⭐⭐
//
// Cache function results based on arguments.
// If called with same args, return cached result.
//
// const memoAdd = memoize((a,b) => a + b);
// memoAdd(1,2) → 3 (computed)
// memoAdd(1,2) → 3 (cached — fn NOT called again)
// ────────────────────────────────────────────
function C3_memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// ────────────────────────────────────────────
// C4 — Once
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// Returns a function that calls fn only once.
// Subsequent calls return the first result.
//
// const init = once(() => Math.random());
// init() → 0.42 (computed)
// init() → 0.42 (same result, fn NOT called)
// ────────────────────────────────────────────
function C4_once(fn) {
  let called = false, result
  return function (...args) {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  }
}

// ────────────────────────────────────────────
// C5 — Curry
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐⭐
//
// Transform fn(a,b,c) into fn(a)(b)(c).
// Must also work with multiple args: fn(a,b)(c)
//
// const add = curry((a,b,c) => a + b + c);
// add(1)(2)(3)  → 6
// add(1,2)(3)   → 6
// add(1)(2,3)   → 6
// ────────────────────────────────────────────
function C5_curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

// ────────────────────────────────────────────
// C6 — Pipe (left-to-right composition)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// pipe(f, g, h)(x) === h(g(f(x)))
//
// const transform = pipe(
//   x => x + 1,
//   x => x * 2,
//   x => `Result: ${x}`
// );
// transform(3) → "Result: 8"
// ────────────────────────────────────────────
function C6_pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x)
}

// ────────────────────────────────────────────
// C7 — Compose (right-to-left composition)
// ⏱️ Target: 30 seconds | Difficulty: ⭐⭐
//
// compose(f, g, h)(x) === f(g(h(x)))
// (Hint: it's pipe in reverse)
// ────────────────────────────────────────────
function C7_compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x)
}

// ────────────────────────────────────────────
// C8 — Deep Clone (without structuredClone or JSON)
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// Handle: objects, arrays, Date, null, primitives.
// Don't worry about Map/Set/RegExp for now.
//
// const obj = { a: 1, b: { c: 2 }, d: [3,4], e: new Date() };
// const clone = deepClone(obj);
// clone.b.c = 99;
// obj.b.c → still 2 (not affected)
// ────────────────────────────────────────────
function C8_deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj)
  if (Array.isArray(obj)) return obj.map(item => C8_deepClone(item))
  const clone = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) clone[key] = C8_deepClone(obj[key])
  }
  return clone
}

// ────────────────────────────────────────────
// C9 — Event Emitter
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐
//
// Implement:
//   on(event, cb)    → subscribe
//   off(event, cb)   → unsubscribe
//   emit(event, ...args) → trigger all listeners
//   once(event, cb)  → subscribe, auto-unsub after first call
// ────────────────────────────────────────────
function C9_createEventEmitter() {
  const events = {}
  return {
    on(event, cb) {
      (events[event] ??= []).push(cb)
    },
    off(event, cb) {
      events[event] = (events[event] || []).filter(fn => fn !== cb)
    },
    emit(event, ...args) {
      (events[event] || []).forEach(fn => fn(...args))
    },
    once(event, cb) {
      const wrapper = (...args) => {
        cb(...args)
        this.off(event, wrapper)
      }
      this.on(event, wrapper)
    },
  }
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION D — Output Prediction            ║
// ║  (this, closures, event loop, hoisting)   ║
// ║  Return your predicted output as an array ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// D1 — Event Loop: Predict the order
//
//   console.log("A");
//   setTimeout(() => console.log("B"), 0);
//   Promise.resolve().then(() => console.log("C"));
//   Promise.resolve().then(() => {
//     console.log("D");
//     setTimeout(() => console.log("E"), 0);
//   });
//   console.log("F");
//
// Return: ["A", "F", ...]
// ────────────────────────────────────────────
function D1_eventLoop() {
  return ["A", "F", "C", "D", "B", "E"]
}

// ────────────────────────────────────────────
// D2 — Event Loop (harder)
//
//   setTimeout(() => console.log("1"), 0);
//   Promise.resolve().then(() => {
//     console.log("2");
//     Promise.resolve().then(() => console.log("3"));
//   });
//   Promise.resolve().then(() => console.log("4"));
//   console.log("5");
//
// Return: ["5", ...]
// ────────────────────────────────────────────
function D2_eventLoopHard() {
  return ["5", "2", "4", "3", "1"]
}

// ────────────────────────────────────────────
// D3 — `this` in setTimeout
//
//   const obj = {
//     x: 10,
//     getX() { return this.x; },
//     getXArrow: () => this.x,
//     getXDelayed() {
//       setTimeout(function() { console.log(this.x); }, 0);   // A
//       setTimeout(() => { console.log(this.x); }, 0);         // B
//     }
//   };
//
//   console.log(obj.getX());       // C
//   console.log(obj.getXArrow());  // D
//   obj.getXDelayed();             // A then B
//
// Return: { C: ??, D: ??, A: ??, B: ?? }
// ────────────────────────────────────────────
function D3_thisKeyword() {
  return { C: 10, D: undefined, A: undefined, B: 10 }
}

// ────────────────────────────────────────────
// D4 — var in loop closure
//
//   for (var i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
//   }
//
// What gets logged?
// Return: [?, ?, ?]
// BONUS: How do you fix it? (two ways)
// ────────────────────────────────────────────
function D4_varInLoop() {
  return [3, 3, 3]
}

// ────────────────────────────────────────────
// D5 — Hoisting & TDZ
//
//   console.log(a);        // A
//   console.log(b);        // B — what happens?
//   var a = 1;
//   let b = 2;
//   console.log(typeof c); // C — function not declared yet?
//   function c() {}
//
// Return: { A: ??, B: "ReferenceError" or value, C: ?? }
// ────────────────────────────────────────────
function D5_hoisting() {
  return { A: undefined, B: "ReferenceError", C: "function" }
}

// ────────────────────────────────────────────
// D6 — Closure over reference
//
//   let val = 1;
//   const getVal = () => val;
//   val = 2;
//   console.log(getVal());  // ??
//
// Return the output
// ────────────────────────────────────────────
function D6_closureRef() {
  return 2
}

// ────────────────────────────────────────────
// D7 — IIFE + closure
//
//   (function(a) {
//     return (function() {
//       console.log(a);
//       a = 23;
//     })();
//   })(45);
//
// What gets logged?
// ────────────────────────────────────────────
function D7_iife() {
  return 45
}

// ────────────────────────────────────────────
// D8 — == vs ===
//
// Predict true/false for each:
//   "5" == 5
//   "5" === 5
//   null == undefined
//   null === undefined
//   NaN == NaN
//   0 == false
//   "" == false
//   [] == false
//   [] == ![]
//
// Return: [true/false, true/false, ...]
// ────────────────────────────────────────────
function D8_equality() {
  return [true, false, true, false, false, true, true, true, true]
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION E — String & Data Structure      ║
// ║  Challenges (commonly asked 2025-2026)    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// E1 — Reverse String (without .reverse())
// ⏱️ Target: 30 seconds | Difficulty: ⭐
// ────────────────────────────────────────────
function E1_reverseString(str) {
  return str.split("").reverse().join("")
}

// ────────────────────────────────────────────
// E2 — Palindrome Check
// ⏱️ Target: 45 seconds | Difficulty: ⭐
//
// Ignore case and non-alphanumeric characters.
// isPalindrome("A man, a plan, a canal: Panama") → true
// ────────────────────────────────────────────
function E2_isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "")
  return clean === clean.split("").reverse().join("")
}

// ────────────────────────────────────────────
// E3 — Anagram Check
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// isAnagram("listen", "silent") → true
// isAnagram("hello", "world")   → false
// ────────────────────────────────────────────
function E3_isAnagram(a, b) {
  const sort = s => s.toLowerCase().split("").sort().join("")
  return sort(a) === sort(b)
}

// ────────────────────────────────────────────
// E4 — Valid Brackets
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// isValid("()[]{}") → true
// isValid("(]")     → false
// isValid("([)]")   → false
// isValid("{[]}")    → true
// ────────────────────────────────────────────
function E4_validBrackets(str) {
  const stack = []
  const map = { ")": "(", "]": "[", "}": "{" }
  for (const ch of str) {
    if ("([{".includes(ch)) stack.push(ch)
    else if (stack.pop() !== map[ch]) return false
  }
  return stack.length === 0
}

// ────────────────────────────────────────────
// E5 — First Non-Repeating Character
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// firstUnique("aabccbd") → "d"
// firstUnique("aabb")    → null
// ────────────────────────────────────────────
function E5_firstNonRepeating(str) {
  const freq = {}
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1
  for (const ch of str) if (freq[ch] === 1) return ch
  return null
}

// ────────────────────────────────────────────
// E6 — Title Case a String
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// titleCase("hello world from js") → "Hello World From Js"
// ────────────────────────────────────────────
function E6_titleCase(str) {
  return str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
}

// ────────────────────────────────────────────
// E7 — Count Vowels
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// countVowels("hello world") → 3
// ────────────────────────────────────────────
function E7_countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length
}

// ────────────────────────────────────────────
// E8 — Longest Word in a String
// ⏱️ Target: 45 seconds | Difficulty: ⭐⭐
//
// longestWord("The quick brown fox jumped") → "jumped"
// ────────────────────────────────────────────
function E8_longestWord(str) {
  return str.split(" ").reduce((a, b) => b.length > a.length ? b : a)
}

// ────────────────────────────────────────────
// E9 — Remove Falsy Values
// ⏱️ Target: 15 seconds | Difficulty: ⭐
//
// compact([0, 1, false, 2, "", 3, null, undefined, NaN])
// → [1, 2, 3]
// ────────────────────────────────────────────
function E9_compact(arr) {
  return arr.filter(Boolean)
}

// ────────────────────────────────────────────
// E10 — Deep Equal (compare two objects/arrays)
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}}) → true
// deepEqual({a:1}, {a:2}) → false
// deepEqual([1,[2]], [1,[2]]) → true
// ────────────────────────────────────────────
function E10_deepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false
  const keysA = Object.keys(a), keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  return keysA.every(key => E10_deepEqual(a[key], b[key]))
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION F — Async Pattern Drills         ║
// ║  (Promise patterns, retry, concurrency)   ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// F1 — Sleep / Delay
// ⏱️ Target: 15 seconds | Difficulty: ⭐
//
// await sleep(1000) → resolves after 1 second
// ────────────────────────────────────────────
function F1_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ────────────────────────────────────────────
// F2 — Retry with Backoff
// ⏱️ Target: 3 minutes | Difficulty: ⭐⭐⭐⭐
//
// retry(fn, maxRetries, delayMs)
// Calls fn. If it throws, wait delayMs then retry.
// Double the delay each retry (exponential backoff).
// After maxRetries, reject with last error.
//
// retry(() => fetchData(), 3, 1000)
// → try immediately, fail → wait 1s, fail → wait 2s, fail → reject
// ────────────────────────────────────────────
function F2_retry(fn, maxRetries, delayMs) {
  return fn().catch(err => {
    if (maxRetries <= 0) throw err
    return F1_sleep(delayMs).then(() => F2_retry(fn, maxRetries - 1, delayMs * 2))
  })
}

// ────────────────────────────────────────────
// F3 — Concurrency Limiter
// ⏱️ Target: 5 minutes | Difficulty: ⭐⭐⭐⭐⭐
//
// Given an array of async task functions and a concurrency limit,
// run at most `limit` tasks at the same time.
// Return a promise that resolves with all results in order.
//
// const tasks = [
//   () => fetch("/api/1"),
//   () => fetch("/api/2"),
//   () => fetch("/api/3"),
//   () => fetch("/api/4"),
// ];
// runWithLimit(tasks, 2) → runs 2 at a time, returns all 4 results
// ────────────────────────────────────────────
function F3_runWithLimit(tasks, limit) {
  const results = []
  let i = 0
  const run = () => {
    if (i >= tasks.length) return Promise.resolve()
    const index = i++
    return tasks[index]().then(val => {
      results[index] = val
      return run()
    })
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => run())
  return Promise.all(workers).then(() => results)
}

// ────────────────────────────────────────────
// F4 — Promise.race from scratch
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐⭐
//
// Resolves/rejects as soon as the FIRST promise settles.
// ────────────────────────────────────────────
function F4_myRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject))
  })
}

// ────────────────────────────────────────────
// F5 — Sequential Promise Execution
// ⏱️ Target: 2 minutes | Difficulty: ⭐⭐⭐
//
// Given array of functions that return promises,
// execute them one after another (NOT in parallel).
// Return array of results in order.
//
// runSequential([() => fetch(1), () => fetch(2), () => fetch(3)])
// → waits for 1 to finish, then starts 2, then 3
// ────────────────────────────────────────────
function F5_runSequential(tasks) {
  return tasks.reduce(
    (chain, task) => chain.then(results => task().then(val => [...results, val])),
    Promise.resolve([])
  )
}


// ╔═══════════════════════════════════════════╗
// ║  SECTION G — ES2025 Awareness             ║
// ║  (New features interviewers ask about)    ║
// ╚═══════════════════════════════════════════╝

// ────────────────────────────────────────────
// G1 — Set Methods (ES2025)
// ⏱️ Target: 60 seconds | Difficulty: ⭐⭐
//
// Use the NEW Set methods (ES2025):
//   .union(), .intersection(), .difference(),
//   .symmetricDifference(), .isSubsetOf()
//
// Given: A = {1,2,3,4}, B = {3,4,5,6}
// Return: { union, intersection, difference, symDiff, isSubset }
// ────────────────────────────────────────────
function G1_setMethods() {
  const A = new Set([1, 2, 3, 4]);
  const B = new Set([3, 4, 5, 6]);
  return {
    union: [...A.union(B)],
    intersection: [...A.intersection(B)],
    difference: [...A.difference(B)],
    symDiff: [...A.symmetricDifference(B)],
    isSubset: A.isSubsetOf(B),
  }
}

// ────────────────────────────────────────────
// G2 — structuredClone (modern deep copy)
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Deep clone this object using structuredClone.
// Know: what it handles (Date, Map, Set, circular refs)
//       what it DOESN'T handle (functions, DOM nodes, Symbols)
// ────────────────────────────────────────────
function G2_structuredClone() {
  const original = {
    name: "Tijo",
    date: new Date(),
    nested: { deep: { value: 42 } },
    arr: [1, 2, 3],
  };
  return structuredClone(original)
}

// ────────────────────────────────────────────
// G3 — Optional Chaining + Nullish Coalescing
// ⏱️ Target: 30 seconds | Difficulty: ⭐
//
// Safely access deeply nested property.
// Return the value or a default.
//
// Given: { user: { profile: { name: "Tijo" } } }
// Get user.profile.name → "Tijo"
// Get user.settings.theme → "dark" (default)
// ────────────────────────────────────────────
function G3_optionalChaining(obj) {
  return {
    name: obj?.user?.profile?.name ?? "Unknown",
    theme: obj?.user?.settings?.theme ?? "dark",
  }
}

// ────────────────────────────────────────────
// G4 — Object.groupBy (ES2024)
// ⏱️ Target: 30 seconds | Difficulty: ⭐⭐
//
// Use Object.groupBy (not reduce) to group items.
//
// items = [{type:"fruit", name:"Apple"}, {type:"veg", name:"Carrot"}, {type:"fruit", name:"Banana"}]
// → { fruit: [...], veg: [...] }
// ────────────────────────────────────────────
function G4_objectGroupBy() {
  const items = [
    { type: "fruit", name: "Apple" },
    { type: "veg", name: "Carrot" },
    { type: "fruit", name: "Banana" },
  ];
  return Object.groupBy(items, item => item.type)
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║  SECTION H — BITWISE OPERATIONS (Trending Interview 2025)   ║
// ╚═══════════════════════════════════════════════════════════════╝

// ────────────────────────────────────────────
// H1 — Is Odd (Bitwise)
// ⏱️ Target: 15s | Difficulty: ⭐
//
// Check if a number is odd using bitwise AND.
// Do NOT use modulo (%).
//
// isOdd(7) → true
// isOdd(4) → false
// ────────────────────────────────────────────
function H1_isOdd(n) {
  return (n & 1) === 1
}

// ────────────────────────────────────────────
// H2 — Is Power of 2
// ⏱️ Target: 30s | Difficulty: ⭐⭐
//
// Powers of 2 have exactly one bit set: 10000
// n-1 flips all lower bits:             01111
// So (n & (n-1)) === 0 for powers of 2.
//
// isPowerOf2(16) → true
// isPowerOf2(15) → false
// isPowerOf2(1)  → true
// ────────────────────────────────────────────
function H2_isPowerOf2(n) {
  return n > 0 && (n & (n - 1)) === 0
}

// ────────────────────────────────────────────
// H3 — Count Set Bits (Hamming Weight)
// ⏱️ Target: 45s | Difficulty: ⭐⭐
//
// Count how many bits are 1 in binary representation.
//
// countSetBits(7)   → 3  (111)
// countSetBits(255) → 8  (11111111)
// countSetBits(0)   → 0
// ────────────────────────────────────────────
function H3_countSetBits(n) {
  let count = 0
  while (n) { count += n & 1; n >>>= 1 }
  return count
}

// ────────────────────────────────────────────
// H4 — Find Unique Number (XOR trick)
// ⏱️ Target: 30s | Difficulty: ⭐⭐
//
// Every number appears twice EXCEPT one. Find it.
// XOR cancels pairs: a ^ a = 0, a ^ 0 = a
//
// findUnique([2, 3, 5, 3, 2]) → 5
// ────────────────────────────────────────────
function H4_findUnique(arr) {
  return arr.reduce((xor, n) => xor ^ n, 0)
}

// ────────────────────────────────────────────
// H5 — Swap Without Temp Variable
// ⏱️ Target: 30s | Difficulty: ⭐⭐
//
// Swap two numbers using XOR. No temp variable.
// Return [b, a] given (a, b).
//
// swapWithoutTemp(10, 20) → [20, 10]
// ────────────────────────────────────────────
function H5_swapWithoutTemp(a, b) {
  a = a ^ b; b = a ^ b; a = a ^ b
  return [a, b]
}

// ────────────────────────────────────────────
// H6 — Bit Manipulation Toolkit
// ⏱️ Target: 60s | Difficulty: ⭐⭐
//
// Implement 4 functions:
//   setBit(num, n)    → set nth bit to 1
//   clearBit(num, n)  → set nth bit to 0
//   toggleBit(num, n) → flip nth bit
//   getBit(num, n)    → return 0 or 1
// ────────────────────────────────────────────
function H6_setBit(num, n) {
  return num | (1 << n)
}
function H6_clearBit(num, n) {
  return num & ~(1 << n)
}
function H6_toggleBit(num, n) {
  return num ^ (1 << n)
}
function H6_getBit(num, n) {
  return (num >> n) & 1
}

// ────────────────────────────────────────────
// H7 — Find Missing Number (XOR)
// ⏱️ Target: 60s | Difficulty: ⭐⭐⭐
//
// Array has numbers 0..n with one missing. Find it.
// XOR all indices AND all values — pairs cancel, missing remains.
//
// missingNumber([0, 1, 2, 4, 5]) → 3
// ────────────────────────────────────────────
function H7_missingNumber(arr) {
  let xor = arr.length
  for (let i = 0; i < arr.length; i++) xor ^= i ^ arr[i]
  return xor
}

// ────────────────────────────────────────────
// H8 — Find TWO Unique Numbers 🔥
// ⏱️ Target: 120s | Difficulty: ⭐⭐⭐⭐
//
// Every number appears twice EXCEPT two. Find both.
// 1. XOR all → gives xor of the two uniques
// 2. Find a set bit (they differ here)
// 3. Split into two groups by that bit, XOR each group
//
// findTwoUniques([1, 2, 1, 3, 2, 5]) → [3, 5] (sorted)
// ────────────────────────────────────────────
function H8_findTwoUniques(arr) {
  let xor = arr.reduce((a, b) => a ^ b, 0)
  const bit = xor & -xor
  let a = 0, b = 0
  for (const n of arr) {
    if (n & bit) a ^= n; else b ^= n
  }
  return [a, b].sort((x, y) => x - y)
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║  SECTION I — ENCRYPT / DECRYPT (Trending Interview 2025)    ║
// ╚═══════════════════════════════════════════════════════════════╝

// ────────────────────────────────────────────
// I1 — Caesar Cipher (Encrypt + Decrypt)
// ⏱️ Target: 90s | Difficulty: ⭐⭐
//
// Shift each letter by `shift` positions. Wrap around z→a.
// Non-alpha characters stay unchanged. Preserve case.
//
// caesarEncrypt("hello", 3) → "khoor"
// caesarDecrypt("khoor", 3) → "hello"
// ────────────────────────────────────────────
function I1_caesarEncrypt(str, shift) {
  return str.replace(/[a-zA-Z]/g, ch => {
    const base = ch <= "Z" ? 65 : 97
    return String.fromCharCode((ch.charCodeAt(0) - base + shift) % 26 + base)
  })
}
function I1_caesarDecrypt(str, shift) {
  return I1_caesarEncrypt(str, 26 - shift)
}

// ────────────────────────────────────────────
// I2 — XOR Cipher
// ⏱️ Target: 60s | Difficulty: ⭐⭐
//
// XOR each char code with a key. Same function encrypts AND decrypts
// because XOR is self-inverse: (a ^ k) ^ k = a
//
// xorCipher("hello", 42)  → encrypted string
// xorCipher(encrypted, 42) → "hello"
// ────────────────────────────────────────────
function I2_xorCipher(str, key) {
  return str.split("").map(ch => String.fromCharCode(ch.charCodeAt(0) ^ key)).join("")
}

// ────────────────────────────────────────────
// I3 — ROT13
// ⏱️ Target: 45s | Difficulty: ⭐⭐
//
// Special case of Caesar with shift=13.
// Applying twice returns original (26 letters / 2 = 13).
//
// rot13("Hello World") → "Uryyb Jbeyq"
// rot13("Uryyb Jbeyq") → "Hello World"
// ────────────────────────────────────────────
function I3_rot13(str) {
  return I1_caesarEncrypt(str, 13)
}

// ────────────────────────────────────────────
// I4 — Vigenère Cipher 🔥
// ⏱️ Target: 120s | Difficulty: ⭐⭐⭐
//
// Like Caesar but shift varies per character using a keyword.
// Each letter of keyword gives shift amount (a=0, b=1, ..., z=25).
// Keyword repeats to match message length.
// Lowercase only, no spaces.
//
// vigenereEncrypt("attackatdawn", "lemon") → "lxfopvefrnhr"
// vigenereDecrypt("lxfopvefrnhr", "lemon") → "attackatdawn"
// ────────────────────────────────────────────
function I4_vigenereEncrypt(str, key) {
  return str.split("").map((ch, i) => {
    const shift = key.charCodeAt(i % key.length) - 97
    return String.fromCharCode((ch.charCodeAt(0) - 97 + shift) % 26 + 97)
  }).join("")
}
function I4_vigenereDecrypt(str, key) {
  return str.split("").map((ch, i) => {
    const shift = key.charCodeAt(i % key.length) - 97
    return String.fromCharCode((ch.charCodeAt(0) - 97 - shift + 26) % 26 + 97)
  }).join("")
}

// ────────────────────────────────────────────
// I5 — Atbash Cipher
// ⏱️ Target: 45s | Difficulty: ⭐⭐
//
// Reverse the alphabet: a↔z, b↔y, c↔x, etc.
// Self-inverse: applying twice returns original.
// Preserve case, non-alpha unchanged.
//
// atbash("hello") → "svool"
// atbash("svool") → "hello"
// ────────────────────────────────────────────
function I5_atbash(str) {
  return str.replace(/[a-zA-Z]/g, ch => {
    const base = ch <= "Z" ? 65 : 97
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base))
  })
}

// ────────────────────────────────────────────
// I6 — Base64 Encode/Decode (from scratch)
// ⏱️ Target: 180s | Difficulty: ⭐⭐⭐⭐
//
// Implement Base64 encoding/decoding WITHOUT btoa/atob.
// Convert 3 bytes → 4 base64 chars using the standard table.
//
// base64Encode("Hello World!") → "SGVsbG8gV29ybGQh"
// base64Decode("SGVsbG8gV29ybGQh") → "Hello World!"
// ────────────────────────────────────────────
function I6_base64Encode(str) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i), b = str.charCodeAt(i + 1), c = str.charCodeAt(i + 2)
    const triplet = (a << 16) | ((b || 0) << 8) | (c || 0)
    result += chars[(triplet >> 18) & 63]
    result += chars[(triplet >> 12) & 63]
    result += i + 1 < str.length ? chars[(triplet >> 6) & 63] : "="
    result += i + 2 < str.length ? chars[triplet & 63] : "="
  }
  return result
}
function I6_base64Decode(str) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  const clean = str.replace(/=+$/, "")
  for (let i = 0; i < clean.length; i += 4) {
    const a = chars.indexOf(clean[i]), b = chars.indexOf(clean[i + 1])
    const c = chars.indexOf(clean[i + 2]), d = chars.indexOf(clean[i + 3])
    const triplet = (a << 18) | (b << 12) | ((c >= 0 ? c : 0) << 6) | (d >= 0 ? d : 0)
    result += String.fromCharCode((triplet >> 16) & 255)
    if (c >= 0) result += String.fromCharCode((triplet >> 8) & 255)
    if (d >= 0) result += String.fromCharCode(triplet & 255)
  }
  return result
}


// ═══════════════════════════════════════════
// TEST RUNNER — do not modify
// ═══════════════════════════════════════════
async function runTests() {
  console.log("╔═══════════════════════════════════════╗");
  console.log("║   07 — Interview Drills (2026)        ║");
  console.log("╚═══════════════════════════════════════╝\n");

  const test = (name, fn) => {
    try {
      const result = fn();
      console.log(`  ✅ ${name}:`, JSON.stringify(result));
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  };

  const testAsync = async (name, fn) => {
    try {
      const result = await fn();
      console.log(`  ✅ ${name}:`, JSON.stringify(result));
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  };

  // Section A
  console.log("\n── Section A: Array Manipulation ──\n");
  test("A1 frequency", () => A1_frequencyCount(["a", "b", "a", "c", "b", "a"]));
  test("A2 mostFreq", () => A2_mostFrequent([3, 1, 3, 2, 1, 3]));
  test("A3 dedup", () => A3_dedupPrimitives([1, 2, 2, 3, 3, 3]));
  test("A4 dedupByKey", () => A4_dedupByKey([{ id: 1, email: "a@b.com" }, { id: 2, email: "c@d.com" }, { id: 3, email: "a@b.com" }], "email"));
  test("A5 groupBy", () => A5_groupBy([{ name: "Apple", type: "fruit" }, { name: "Carrot", type: "veg" }, { name: "Banana", type: "fruit" }], "type"));
  test("A6 groupCount", () => A6_groupByCount([{ type: "fruit" }, { type: "veg" }, { type: "fruit" }], "type"));
  test("A7 Array.from", () => A7_arrayFromDrills());
  test("A8 flatten", () => A8_flatten([1, [2, [3, [4, 5]]]]));
  test("A9 fibonacci", () => A9_fibonacci(8));
  test("A10 isFibLike", () => ({ yes: A10_isFibLike([1, 1, 2, 3, 5, 8, 13, 21]), no: A10_isFibLike([1, 2, 4, 8]) }));
  test("A11 moveZeros", () => A11_moveZeros([0, 1, 0, 3, 12]));
  test("A12 secondLargest", () => A12_secondLargest([1, 3, 5, 8, 8, 2, 9]));
  test("A13 chunk", () => A13_chunk([1, 2, 3, 4, 5, 6, 7], 3));
  test("A14 intersection", () => A14_intersection([1, 2, 3, 4], [3, 4, 5, 6]));
  test("A15 difference", () => A15_difference([1, 2, 3, 4], [3, 4, 5, 6]));

  // Section B
  console.log("\n── Section B: Polyfills ──\n");
  B1_myMap(); B2_myFilter(); B3_myReduce(); B6_myBind(); B7_myFlat();
  test("B1 myMap", () => [1, 2, 3].myMap(x => x * 2));
  test("B2 myFilter", () => [1, 2, 3, 4, 5].myFilter(x => x > 3));
  test("B3 myReduce", () => [1, 2, 3].myReduce((a, x) => a + x, 0));
  await testAsync("B4 Promise.all", () => (B4_myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]) || Promise.resolve("not implemented")));
  await testAsync("B5 allSettled", () => B5_myAllSettled([Promise.resolve(1), Promise.reject("err")]).catch(() => "not implemented"));
  test("B7 myFlat", () => [1, [2, [3]]].myFlat(Infinity));

  // Section C
  console.log("\n── Section C: Utility Functions ──\n");
  test("C3 memoize", () => {
    const fn = C3_memoize((a, b) => a + b);
    return [fn(1, 2), fn(1, 2), fn(3, 4)];
  });
  test("C4 once", () => {
    let count = 0;
    const fn = C4_once(() => ++count);
    return [fn(), fn(), fn()];
  });
  test("C5 curry", () => {
    const add = C5_curry((a, b, c) => a + b + c);
    return [add(1)(2)(3), add(1, 2)(3), add(1)(2, 3)];
  });
  test("C6 pipe", () => {
    const fn = C6_pipe(x => x + 1, x => x * 2, x => `Result: ${x}`);
    return fn(3);
  });
  test("C8 deepClone", () => {
    const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
    const clone = C8_deepClone(obj);
    clone.b.c = 99;
    return { original: obj.b.c, clone: clone.b.c };
  });
  test("C9 emitter", () => {
    const ee = C9_createEventEmitter();
    const log = [];
    ee.on("msg", v => log.push(v));
    ee.once("msg", v => log.push("once:" + v));
    ee.emit("msg", "hi");
    ee.emit("msg", "bye");
    return log;
  });

  // Section D
  console.log("\n── Section D: Output Prediction ──\n");
  test("D1 eventLoop", () => D1_eventLoop());
  test("D2 eventLoopHard", () => D2_eventLoopHard());
  test("D3 this", () => D3_thisKeyword());
  test("D4 var loop", () => D4_varInLoop());
  test("D5 hoisting", () => D5_hoisting());
  test("D6 closureRef", () => D6_closureRef());
  test("D7 iife", () => D7_iife());
  test("D8 equality", () => D8_equality());

  // Section E
  console.log("\n── Section E: String & Data Structures ──\n");
  test("E1 reverse", () => E1_reverseString("hello"));
  test("E2 palindrome", () => E2_isPalindrome("A man, a plan, a canal: Panama"));
  test("E3 anagram", () => ({ yes: E3_isAnagram("listen", "silent"), no: E3_isAnagram("hello", "world") }));
  test("E4 brackets", () => ({ a: E4_validBrackets("()[]{}"), b: E4_validBrackets("(]"), c: E4_validBrackets("{[]}") }));
  test("E5 firstUnique", () => E5_firstNonRepeating("aabccbd"));
  test("E6 titleCase", () => E6_titleCase("hello world from js"));
  test("E7 vowels", () => E7_countVowels("hello world"));
  test("E8 longest", () => E8_longestWord("The quick brown fox jumped"));
  test("E9 compact", () => E9_compact([0, 1, false, 2, "", 3, null, undefined, NaN]));
  test("E10 deepEqual", () => ({
    yes: E10_deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }),
    no: E10_deepEqual({ a: 1 }, { a: 2 }),
  }));

  // Section F
  console.log("\n── Section F: Async Patterns ──\n");
  await testAsync("F1 sleep", async () => { await F1_sleep(10); return "slept 10ms"; });
  await testAsync("F4 race", () => F4_myRace([
    new Promise(r => setTimeout(() => r("slow"), 100)),
    new Promise(r => setTimeout(() => r("fast"), 10)),
  ]));
  await testAsync("F5 sequential", () => F5_runSequential([
    () => Promise.resolve(1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
  ]));

  // Section G
  console.log("\n── Section G: ES2025 ──\n");
  test("G2 structuredClone", () => {
    const result = G2_structuredClone();
    return result ? "cloned" : "not implemented";
  });
  test("G3 optionalChaining", () => G3_optionalChaining({ user: { profile: { name: "Tijo" } } }));

  // Section H: Bitwise
  console.log("\n── Section H: Bitwise Operations ──\n");
  test("H1 isOdd", () => ({ a: H1_isOdd(7), b: H1_isOdd(4), c: H1_isOdd(0) }));
  test("H2 isPowerOf2", () => ({ a: H2_isPowerOf2(16), b: H2_isPowerOf2(15), c: H2_isPowerOf2(1) }));
  test("H3 countBits", () => ({ a: H3_countSetBits(7), b: H3_countSetBits(255), c: H3_countSetBits(0) }));
  test("H4 findUnique", () => H4_findUnique([2, 3, 5, 3, 2]));
  test("H5 swapBitwise", () => H5_swapWithoutTemp(10, 20));
  test("H6 bitOps", () => ({
    set: H6_setBit(0b1000, 1),
    clear: H6_clearBit(0b1111, 2),
    toggle: H6_toggleBit(0b1010, 0),
    get: H6_getBit(0b1010, 3),
  }));
  test("H7 missingNumber", () => H7_missingNumber([0, 1, 2, 4, 5]));
  test("H8 twoUniques", () => H8_findTwoUniques([1, 2, 1, 3, 2, 5]));

  // Section I: Encrypt/Decrypt
  console.log("\n── Section I: Encrypt / Decrypt ──\n");
  test("I1 caesarCipher", () => ({
    enc: I1_caesarEncrypt("hello", 3),
    dec: I1_caesarDecrypt("khoor", 3),
  }));
  test("I2 xorCipher", () => {
    const enc = I2_xorCipher("secret message", 42);
    const dec = I2_xorCipher(enc, 42);
    return { encrypted: enc, decrypted: dec };
  });
  test("I3 rot13", () => ({ enc: I3_rot13("Hello World"), back: I3_rot13(I3_rot13("Hello World")) }));
  test("I4 vigenereCipher", () => ({
    enc: I4_vigenereEncrypt("attackatdawn", "lemon"),
    dec: I4_vigenereDecrypt("lxfopvefrnhr", "lemon"),
  }));
  test("I5 atbash", () => ({ enc: I5_atbash("hello"), back: I5_atbash(I5_atbash("hello")) }));
  test("I6 base64", () => {
    const enc = I6_base64Encode("Hello World!");
    const dec = I6_base64Decode(enc);
    return { encoded: enc, decoded: dec };
  });

  console.log("\n═══════════════════════════════════════");
  console.log("Done! Fill in TODOs, run again, repeat.");
  console.log("═══════════════════════════════════════\n");
}

runTests();
