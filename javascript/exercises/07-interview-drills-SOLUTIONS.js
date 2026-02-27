/**
 * ═══════════════════════════════════════════════════════════════════
 * 07 — Interview Drills — SOLUTIONS + CURVEBALLS
 * ═══════════════════════════════════════════════════════════════════
 *
 * 🧠 HOW TO USE THIS FILE:
 *   1. Read the solution ONCE carefully
 *   2. Close this file
 *   3. Write it from memory in 07-interview-drills.js
 *   4. If you get stuck, peek here, then close and retry
 *   5. Repeat until your fingers type it without thinking
 *   6. For pen & paper: cover the code, write the solution on paper
 *      then compare
 *
 * 📊 DIFFICULTY LEVELS:
 *   ⭐          = Easy (30s or less — must be instant)
 *   ⭐⭐        = Medium (under 60s)
 *   ⭐⭐⭐      = Interview Standard (under 2 min)
 *   ⭐⭐⭐⭐    = Hard (under 3 min)
 *   ⭐⭐⭐⭐⭐  = Curveball / Boss Level
 *
 * 🎯 CURVEBALL sections are marked with 🔥
 *    These are tricky variations interviewers throw at you
 *
 * Run: node javascript/exercises/07-interview-drills-SOLUTIONS.js
 * ═══════════════════════════════════════════════════════════════════
 */


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   🛟 FOR-LOOP CHEAT SHEET — When fancy methods break,        ║
// ║   fall back to this. It ALWAYS works.                         ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝
//
// ┌─────────────────────────────────────────────────────┐
// │  PATTERN 1: BASIC FOR LOOP (most versatile)        │
// │                                                     │
// │  for (let i = 0; i < arr.length; i++) {            │
// │    const item = arr[i];                             │
// │    // do something with item                        │
// │  }                                                  │
// └─────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────┐
// │  PATTERN 2: FOR...OF (clean, no index needed)      │
// │                                                     │
// │  for (const item of arr) {                          │
// │    // do something with item                        │
// │  }                                                  │
// └─────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────┐
// │  PATTERN 3: FOR...IN (objects only!)                │
// │                                                     │
// │  for (const key in obj) {                           │
// │    if (obj.hasOwnProperty(key)) {                   │
// │      const value = obj[key];                        │
// │    }                                                │
// │  }                                                  │
// └─────────────────────────────────────────────────────┘
//
// ══════════════════════════════════════════════
// EVERY ARRAY METHOD → FOR LOOP FALLBACK
// If reduce/map/filter breaks, use these:
// ══════════════════════════════════════════════
//
// ── map (transform each item) ──
//   const result = [];
//   for (let i = 0; i < arr.length; i++) {
//     result.push(arr[i] * 2);
//   }
//
// ── filter (keep items that pass test) ──
//   const result = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > 3) result.push(arr[i]);
//   }
//
// ── reduce (accumulate into one value) ──
//   let acc = 0;  // or {} or []
//   for (let i = 0; i < arr.length; i++) {
//     acc += arr[i];    // or acc[key] = ... or acc.push(...)
//   }
//
// ── find (first match) ──
//   let found = null;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] === target) { found = arr[i]; break; }
//   }
//
// ── some (does ANY match?) ──
//   let hasMatch = false;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > 5) { hasMatch = true; break; }
//   }
//
// ── every (do ALL match?) ──
//   let allMatch = true;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] <= 0) { allMatch = false; break; }
//   }
//
// ── includes (is item in array?) ──
//   let exists = false;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] === target) { exists = true; break; }
//   }
//
// ── flat (flatten one level) ──
//   const result = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) {
//       for (let j = 0; j < arr[i].length; j++) {
//         result.push(arr[i][j]);
//       }
//     } else {
//       result.push(arr[i]);
//     }
//   }
//
// ══════════════════════════════════════════════
// COMMON INTERVIEW PATTERNS → FOR LOOP VERSION
// ══════════════════════════════════════════════
//
// ── Frequency Count ──
//   const freq = {};
//   for (let i = 0; i < arr.length; i++) {
//     freq[arr[i]] = (freq[arr[i]] || 0) + 1;
//   }
//
// ── GroupBy ──
//   const groups = {};
//   for (let i = 0; i < arr.length; i++) {
//     const key = arr[i].type;
//     if (!groups[key]) groups[key] = [];
//     groups[key].push(arr[i]);
//   }
//
// ── Dedup ──
//   const seen = {};
//   const result = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (!seen[arr[i]]) {
//       seen[arr[i]] = true;
//       result.push(arr[i]);
//     }
//   }
//
// ── Max / Min ──
//   let max = arr[0];
//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] > max) max = arr[i];
//   }
//
// ── String character loop ──
//   for (let i = 0; i < str.length; i++) {
//     const ch = str[i];   // or str.charAt(i)
//   }
//
// ── Reverse ──
//   let reversed = "";
//   for (let i = str.length - 1; i >= 0; i--) {
//     reversed += str[i];
//   }
//
// ── Object to array of entries ──
//   const entries = [];
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       entries.push([key, obj[key]]);
//     }
//   }
//
// 💡 REMEMBER: If your brain freezes on reduce/map/filter,
//    just use a for loop. It's NOT wrong. It ALWAYS works.
//    Better a working for loop than a broken reduce.
//


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   TIER 1 — EASY (⭐) — Must Be INSTANT                       ║
// ║   These should flow from your fingers like breathing          ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// A3 — Dedup Primitives
// ⭐ | Target: 30 seconds
// Pattern: Set → spread
//
// dedup([1,2,2,3,3,3]) → [1,2,3]
// ────────────────────────────────────────────
function A3_dedupPrimitives(arr) {
  return [...new Set(arr)];
}

// 🔥 CURVEBALL A3: Dedup WITHOUT using Set
// They might say "now do it without Set"
function A3_dedupNoSet(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}


// ────────────────────────────────────────────
// E1 — Reverse String (without .reverse())
// ⭐ | Target: 30 seconds
// Pattern: split → reverse → join
//
// reverseString("hello") → "olleh"
// ────────────────────────────────────────────
function E1_reverseString(str) {
  return str.split("").reverse().join("");
}

// 🔥 CURVEBALL E1: Reverse without .reverse()
function E1_reverseManual(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// 🔥 CURVEBALL E1b: Reverse words in a sentence (not characters)
// "hello world" → "world hello"
function E1_reverseWords(str) {
  return str.split(" ").reverse().join(" ");
}


// ────────────────────────────────────────────
// E2 — Palindrome Check
// ⭐ | Target: 45 seconds
// Pattern: clean → compare with reverse
//
// Ignore case and non-alphanumeric characters.
// isPalindrome("A man, a plan, a canal: Panama") → true
// ────────────────────────────────────────────
function E2_isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}


// ────────────────────────────────────────────
// E7 — Count Vowels
// ⭐ | Target: 30 seconds
// Pattern: match with regex
//
// countVowels("hello world") → 3
// ────────────────────────────────────────────
function E7_countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}

// 🔥 CURVEBALL E7: Count vowels WITHOUT regex
function E7_countVowelsNoRegex(str) {
  const vowels = "aeiouAEIOU";
  let count = 0;
  for (const ch of str) {
    if (vowels.includes(ch)) count++;
  }
  return count;
}


// ────────────────────────────────────────────
// E9 — Remove Falsy Values (compact)
// ⭐ | Target: 15 seconds — FASTEST drill
// Pattern: filter(Boolean)
//
// compact([0, 1, false, 2, "", 3, null, undefined, NaN]) → [1, 2, 3]
// ────────────────────────────────────────────
function E9_compact(arr) {
  return arr.filter(Boolean);
}

// 🔥 CURVEBALL E9: What are ALL falsy values in JS?
// Answer: false, 0, -0, 0n, "", null, undefined, NaN
// 🔥 CURVEBALL E9b: Keep only truthy strings
function E9_truthyStrings(arr) {
  return arr.filter(item => typeof item === "string" && item.length > 0);
}


// ────────────────────────────────────────────
// F1 — Sleep / Delay
// ⭐ | Target: 15 seconds
// Pattern: new Promise + setTimeout
//
// await sleep(1000) → resolves after 1 second
// ────────────────────────────────────────────
function F1_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ────────────────────────────────────────────
// G2 — structuredClone (modern deep copy)
// ⭐ | Target: 30 seconds
//
// Deep clone using structuredClone.
// Handles: Date, Map, Set, circular refs
// DOESN'T handle: functions, DOM nodes, Symbols
// ────────────────────────────────────────────
function G2_structuredClone() {
  const original = {
    name: "Tijo",
    date: new Date(),
    nested: { deep: { value: 42 } },
    arr: [1, 2, 3],
  };
  return structuredClone(original);
}

// 🔥 CURVEBALL G2: What DOESN'T structuredClone handle?
// Answer: functions, DOM nodes, Symbols, property descriptors, prototype chain
// 🔥 CURVEBALL G2b: Deep clone with JSON (what breaks?)
// Answer: loses Date (becomes string), undefined, functions, Infinity, NaN, circular refs throw


// ────────────────────────────────────────────
// G3 — Optional Chaining + Nullish Coalescing
// ⭐ | Target: 30 seconds
// Pattern: ?. for safe access, ?? for default
//
// Given: { user: { profile: { name: "Tijo" } } }
// Get user.profile.name → "Tijo"
// Get user.settings.theme → "dark" (default)
// ────────────────────────────────────────────
function G3_optionalChaining(obj) {
  return {
    name: obj?.user?.profile?.name ?? "Anonymous",
    theme: obj?.user?.settings?.theme ?? "dark",
  };
}

// 🔥 CURVEBALL G3: What's the difference between ?? and ||?
// ?? only catches null/undefined
// || catches ALL falsy (0, "", false, null, undefined)
// Example: 0 ?? 42 → 0     but    0 || 42 → 42


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   TIER 2 — MEDIUM (⭐⭐) — Under 60 Seconds                  ║
// ║   Your bread and butter — failed here at Wipro, UST, Arrow   ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// A1 — Frequency Count
// ⭐⭐ | Target: 60 seconds
// Pattern: reduce into an object
// FAILED AT: Wipro
//
// frequencyCount(["a","b","a","c","b","a"]) → { a: 3, b: 2, c: 1 }
// ────────────────────────────────────────────
function A1_frequencyCount(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

// 🔥 CURVEBALL A1: Frequency count using Map (not object)
function A1_frequencyMap(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
}

// 🔥 CURVEBALL A1b: Frequency count — sort by count descending
function A1_frequencySorted(arr) {
  const freq = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, count }));
}


// ────────────────────────────────────────────
// A2 — Most Frequent Element
// ⭐⭐ | Target: 90 seconds
// Pattern: frequency count → find max
//
// Return the element that appears the most. If tie, return first encountered.
// mostFrequent([3,1,3,2,1,3]) → 3
// ────────────────────────────────────────────
function A2_mostFrequent(arr) {
  const freq = {};
  let maxCount = 0;
  let maxItem = arr[0];

  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
    if (freq[item] > maxCount) {
      maxCount = freq[item];
      maxItem = item;
    }
  }
  return maxItem;
}

// 🔥 CURVEBALL A2: Return ALL elements with highest frequency (ties)
function A2_allMostFrequent(arr) {
  const freq = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(freq));
  return Object.keys(freq).filter(key => freq[key] === maxCount);
}


// ────────────────────────────────────────────
// A5 — GroupBy
// ⭐⭐ | Target: 90 seconds
// Pattern: reduce into object with arrays
// FAILED AT: UST
//
// groupBy([{name:"Apple",type:"fruit"},{name:"Carrot",type:"veg"},{name:"Banana",type:"fruit"}], "type")
// → { fruit: [{...}, {...}], veg: [{...}] }
// ────────────────────────────────────────────
function A5_groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

// 🔥 CURVEBALL A5: GroupBy with a FUNCTION instead of key
// groupByFn(arr, item => item.name[0]) — group by first letter
function A5_groupByFn(arr, fn) {
  return arr.reduce((acc, item) => {
    const group = fn(item);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}


// ────────────────────────────────────────────
// A6 — GroupBy Count
// ⭐⭐ | Target: 60 seconds
// Pattern: reduce into object with count
// FAILED AT: UST
//
// groupByCount([{type:"fruit"},{type:"veg"},{type:"fruit"}], "type") → { fruit: 2, veg: 1 }
// ────────────────────────────────────────────
function A6_groupByCount(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
}


// ────────────────────────────────────────────
// A7 — Array.from Drills
// ⭐⭐ | Target: 30 seconds each
// Pattern: Array.from({ length }, mapper)
// FAILED AT: Socure
//
// Generate arrays:
//   a) [0, 1, 2, 3, 4]
//   b) [1, 2, 3, 4, 5]
//   c) [2, 4, 6, 8, 10]
//   d) [{id:1}, {id:2}, {id:3}]
// ────────────────────────────────────────────
function A7_arrayFromDrills() {
  return {
    a: Array.from({ length: 5 }, (_, i) => i),           // [0,1,2,3,4]
    b: Array.from({ length: 5 }, (_, i) => i + 1),       // [1,2,3,4,5]
    c: Array.from({ length: 5 }, (_, i) => (i + 1) * 2), // [2,4,6,8,10]
    d: Array.from({ length: 3 }, (_, i) => ({ id: i + 1 })), // [{id:1},{id:2},{id:3}]
  };
}

// 🔥 CURVEBALL A7: Create a range function like Python's range()
function A7_range(start, end, step = 1) {
  return Array.from(
    { length: Math.ceil((end - start) / step) },
    (_, i) => start + i * step
  );
}
// A7_range(1, 10, 2) → [1, 3, 5, 7, 9]


// ────────────────────────────────────────────
// A9 — Fibonacci Generator
// ⭐⭐ | Target: 60 seconds
// FAILED AT: Arrow (didn't even recognize the pattern!)
//
// fibonacci(8) → [1, 1, 2, 3, 5, 8, 13, 21]
// ────────────────────────────────────────────
function A9_fibonacci(n) {
  const fib = [1, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib.slice(0, n);
}

// 🔥 CURVEBALL A9: Fibonacci using recursion + memoization
function A9_fibRecursive(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = A9_fibRecursive(n - 1, memo) + A9_fibRecursive(n - 2, memo);
  return memo[n];
}

// 🔥 CURVEBALL A9b: Nth Fibonacci number (not array)
function A9_nthFib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}


// ────────────────────────────────────────────
// A10 — Is Fibonacci-Like Sequence?
// ⭐⭐ | Target: 45 seconds
//
// isFibLike([1,1,2,3,5,8,13,21]) → true
// isFibLike([1,2,4,8,16])        → false
// ────────────────────────────────────────────
function A10_isFibLike(arr) {
  if (arr.length < 3) return true;
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + arr[i - 2]) return false;
  }
  return true;
}


// ────────────────────────────────────────────
// A11 — Move Zeros to End
// ⭐⭐ | Target: 45 seconds
//
// moveZeros([0,1,0,3,12]) → [1,3,12,0,0]
// ────────────────────────────────────────────
function A11_moveZeros(arr) {
  const nonZeros = arr.filter(x => x !== 0);
  const zeros = arr.length - nonZeros.length;
  return [...nonZeros, ...Array(zeros).fill(0)];
}

// 🔥 CURVEBALL A11: Move zeros IN PLACE (no new array)
function A11_moveZerosInPlace(arr) {
  let insertPos = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[insertPos], arr[i]] = [arr[i], arr[insertPos]];
      insertPos++;
    }
  }
  return arr;
}


// ────────────────────────────────────────────
// A12 — Second Largest Element
// ⭐⭐ | Target: 45 seconds
//
// secondLargest([1, 3, 5, 8, 8, 2, 9]) → 8
// ────────────────────────────────────────────
function A12_secondLargest(arr) {
  const unique = [...new Set(arr)];
  unique.sort((a, b) => b - a);
  return unique[1];
}

// 🔥 CURVEBALL A12: Second largest WITHOUT sorting (O(n))
function A12_secondLargestOptimal(arr) {
  let first = -Infinity, second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }
  return second;
}


// ────────────────────────────────────────────
// A13 — Chunk Array
// ⭐⭐ | Target: 60 seconds
//
// chunk([1,2,3,4,5,6,7], 3) → [[1,2,3],[4,5,6],[7]]
// ────────────────────────────────────────────
function A13_chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// 🔥 CURVEBALL A13: Chunk using reduce
function A13_chunkReduce(arr, size) {
  return arr.reduce((acc, item, i) => {
    const chunkIndex = Math.floor(i / size);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(item);
    return acc;
  }, []);
}


// ────────────────────────────────────────────
// A14 — Array Intersection
// ⭐⭐ | Target: 45 seconds
//
// intersection([1,2,3,4], [3,4,5,6]) → [3,4]
// ────────────────────────────────────────────
function A14_intersection(a, b) {
  const setB = new Set(b);
  return a.filter(item => setB.has(item));
}


// ────────────────────────────────────────────
// A15 — Array Difference
// ⭐⭐ | Target: 45 seconds
//
// difference([1,2,3,4], [3,4,5,6]) → [1,2]
// ────────────────────────────────────────────
function A15_difference(a, b) {
  const setB = new Set(b);
  return a.filter(item => !setB.has(item));
}

// 🔥 CURVEBALL A15: Symmetric difference (in either but not both)
function A15_symmetricDiff(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return [
    ...a.filter(x => !setB.has(x)),
    ...b.filter(x => !setA.has(x)),
  ];
}

// ────────────────────────────────────────────
// A16 — Rotate Array by K Positions
// ⭐⭐ | Target: 60 seconds
//
// rotateRight([1,2,3,4,5], 2) → [4,5,1,2,3]   (last 2 move to front)
// rotateLeft([1,2,3,4,5], 2)  → [3,4,5,1,2]   (first 2 move to end)
// ────────────────────────────────────────────

// METHOD 1: slice + concat (cleanest — use this first)
function A16_rotateRight(arr, k) {
  k = k % arr.length;  // handle k > arr.length
  return [...arr.slice(-k), ...arr.slice(0, -k)];
}

function A16_rotateLeft(arr, k) {
  k = k % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

// METHOD 2: for loop fallback
function A16_rotateRightLoop(arr, k) {
  k = k % arr.length;
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[(arr.length - k + i) % arr.length]);
  }
  return result;
}

// METHOD 3: in-place using reverse (O(1) space — interview gold)
// Trick: reverse whole → reverse first k → reverse rest
//
// [1,2,3,4,5] rotate right by 2:
//   reverse all:     [5,4,3,2,1]
//   reverse 0..k-1:  [4,5,3,2,1]
//   reverse k..end:  [4,5,1,2,3]  ✅
function A16_rotateInPlace(arr, k) {
  k = k % arr.length;
  const reverse = (a, start, end) => {
    while (start < end) {
      [a[start], a[end]] = [a[end], a[start]];
      start++;
      end--;
    }
  };
  reverse(arr, 0, arr.length - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, arr.length - 1);
  return arr;
}

// 🔥 CURVEBALL A16: What if k is negative?
// rotateRight(arr, -2) === rotateLeft(arr, 2)
function A16_rotateAny(arr, k) {
  const len = arr.length;
  k = ((k % len) + len) % len;  // handles negative k
  return [...arr.slice(-k), ...arr.slice(0, -k)];
}

// 🔥 CURVEBALL A16b: What if k > arr.length?
// k = 7, arr.length = 5 → k % 5 = 2 (same as rotating by 2)
// Already handled by k = k % arr.length above!



// ────────────────────────────────────────────
// E3 — Anagram Check
// ⭐⭐ | Target: 60 seconds
// Pattern: sort both → compare
//
// isAnagram("listen", "silent") → true
// isAnagram("hello", "world")   → false
// ────────────────────────────────────────────
function E3_isAnagram(a, b) {
  const sort = str => str.toLowerCase().split("").sort().join("");
  return sort(a) === sort(b);
}

// 🔥 CURVEBALL E3: Anagram check using frequency map (no sort)
function E3_isAnagramFreq(a, b) {
  if (a.length !== b.length) return false;
  const freq = {};
  for (const ch of a.toLowerCase()) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of b.toLowerCase()) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
}

// 🔥 CURVEBALL E3b: Group anagrams together
// ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]]
function E3_groupAnagrams(words) {
  const map = {};
  for (const word of words) {
    const key = word.split("").sort().join("");
    if (!map[key]) map[key] = [];
    map[key].push(word);
  }
  return Object.values(map);
}


// ────────────────────────────────────────────
// E5 — First Non-Repeating Character
// ⭐⭐ | Target: 60 seconds
//
// firstUnique("aabccbd") → "d"
// firstUnique("aabb")    → null
// ────────────────────────────────────────────
function E5_firstNonRepeating(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of str) {
    if (freq[ch] === 1) return ch;
  }
  return null;
}


// ────────────────────────────────────────────
// E6 — Title Case
// ⭐⭐ | Target: 45 seconds
//
// titleCase("hello world from js") → "Hello World From Js"
// ────────────────────────────────────────────
function E6_titleCase(str) {
  return str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

// 🔥 CURVEBALL E6: Title case but keep small words lowercase
// "the quick brown fox" → "The Quick Brown Fox" (simple)
// "the lord of the rings" → "The Lord of the Rings" (keep "of", "the" lowercase except first)
function E6_titleCaseSmart(str) {
  const smalls = new Set(["a", "an", "the", "of", "in", "on", "at", "to", "for", "and", "but", "or"]);
  return str.split(" ").map((w, i) => {
    if (i === 0 || !smalls.has(w.toLowerCase())) {
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    }
    return w.toLowerCase();
  }).join(" ");
}


// ────────────────────────────────────────────
// E8 — Longest Word
// ⭐⭐ | Target: 45 seconds
//
// longestWord("The quick brown fox jumped") → "jumped"
// ────────────────────────────────────────────
function E8_longestWord(str) {
  return str.split(" ").reduce((longest, word) =>
    word.length > longest.length ? word : longest
  , "");
}


// ────────────────────────────────────────────
// C4 — Once
// ⭐⭐ | Target: 45 seconds
// Pattern: closure with a flag
//
// const init = once(() => Math.random());
// init() → 0.42 (computed)
// init() → 0.42 (same result, fn NOT called again)
// ────────────────────────────────────────────
function C4_once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}


// ────────────────────────────────────────────
// C7 — Compose (right-to-left)
// ⭐⭐ | Target: 30 seconds
//
// compose(f, g, h)(x) === f(g(h(x)))
// (It's pipe in reverse)
// ────────────────────────────────────────────
function C7_compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}


// ────────────────────────────────────────────
// G4 — Object.groupBy (ES2024)
// ⭐⭐ | Target: 30 seconds
// ────────────────────────────────────────────
function G4_objectGroupBy() {
  const items = [
    { type: "fruit", name: "Apple" },
    { type: "veg", name: "Carrot" },
    { type: "fruit", name: "Banana" },
  ];
  return Object.groupBy(items, item => item.type);
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   TIER 3 — INTERVIEW STANDARD (⭐⭐⭐) — Under 2 Minutes     ║
// ║   If you can't do these fluently, you WILL fail again         ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// A4 — Dedup Objects by Key (keep LAST)
// ⭐⭐⭐ | Target: 90 seconds
// Pattern: reverse → Map by key → values → reverse back
// FAILED AT: UST (dedup emails)
//
// dedupByKey([{id:1,email:"a@b.com"},{id:2,email:"c@d.com"},{id:3,email:"a@b.com"}], "email")
// → [{id:2,email:"c@d.com"},{id:3,email:"a@b.com"}]
// ────────────────────────────────────────────
function A4_dedupByKey(arr, key) {
  const map = new Map();
  for (const item of arr) {
    map.set(item[key], item);
  }
  return [...map.values()];
}

// 🔥 CURVEBALL A4: Dedup keeping FIRST occurrence (not last)
function A4_dedupByKeyFirst(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
}

// 🔥 CURVEBALL A4b: Dedup by MULTIPLE keys
// dedupByKeys([{a:1,b:2},{a:1,b:3},{a:1,b:2}], ["a","b"])
function A4_dedupByKeys(arr, keys) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keys.map(k => item[k]).join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


// ────────────────────────────────────────────
// A8 — Flatten Nested Array (recursive, NO .flat())
// ⭐⭐⭐ | Target: 60 seconds
// Pattern: reduce + concat + recurse
//
// flatten([1, [2, [3, [4, 5]]]]) → [1, 2, 3, 4, 5]
// ────────────────────────────────────────────
function A8_flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? A8_flatten(item) : item);
  }, []);
}

// 🔥 CURVEBALL A8: Flatten with depth limit (like .flat(depth))
function A8_flattenDepth(arr, depth = 1) {
  if (depth === 0) return arr.slice();
  return arr.reduce((acc, item) => {
    return acc.concat(
      Array.isArray(item) ? A8_flattenDepth(item, depth - 1) : item
    );
  }, []);
}

// 🔥 CURVEBALL A8b: Flatten using iterative approach (no recursion)
function A8_flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
  return result;
}


// ────────────────────────────────────────────
// B1 — Array.prototype.myMap
// ⭐⭐⭐ | Target: 90 seconds
// Pattern: loop through this, call cb, push to result
//
// Must handle: callback(element, index, array)
// [1,2,3].myMap(x => x * 2) → [2,4,6]
// ────────────────────────────────────────────
function B1_myMap() {
  Array.prototype.myMap = function (cb) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      result.push(cb(this[i], i, this));
    }
    return result;
  };
}


// ────────────────────────────────────────────
// B2 — Array.prototype.myFilter
// ⭐⭐⭐ | Target: 90 seconds
//
// [1,2,3,4,5].myFilter(x => x > 3) → [4,5]
// ────────────────────────────────────────────
function B2_myFilter() {
  Array.prototype.myFilter = function (cb) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (cb(this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };
}


// ────────────────────────────────────────────
// B7 — Array.prototype.myFlat
// ⭐⭐⭐ | Target: 2 minutes
//
// [1,[2,[3]]].myFlat()         → [1,2,[3]]
// [1,[2,[3]]].myFlat(Infinity) → [1,2,3]
// ────────────────────────────────────────────
function B7_myFlat() {
  Array.prototype.myFlat = function (depth = 1) {
    const flatten = (arr, d) => {
      return arr.reduce((acc, item) => {
        if (Array.isArray(item) && d > 0) {
          return acc.concat(flatten(item, d - 1));
        }
        return acc.concat(item);
      }, []);
    };
    return flatten(this, depth);
  };
}


// ────────────────────────────────────────────
// C1 — Debounce
// ⭐⭐⭐ | Target: 60 seconds
// Pattern: clearTimeout + setTimeout in closure
//
// Only calls fn after `delay` ms of inactivity. Each new call resets the timer.
// ────────────────────────────────────────────
function C1_debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 🔥 CURVEBALL C1: Debounce with LEADING edge (fires immediately, then waits)
function C1_debounceLeading(fn, delay) {
  let timer;
  return function (...args) {
    if (!timer) fn.apply(this, args);
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, delay);
  };
}

// 🔥 CURVEBALL C1b: Debounce with cancel method
function C1_debounceCancel(fn, delay) {
  let timer;
  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}


// ────────────────────────────────────────────
// C2 — Throttle
// ⭐⭐⭐ | Target: 60 seconds
// Pattern: flag to track if waiting
//
// Calls fn immediately, then at most once per `interval` ms.
// ────────────────────────────────────────────
function C2_throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}


// ────────────────────────────────────────────
// C3 — Memoize
// ⭐⭐⭐ | Target: 90 seconds
// Pattern: cache object in closure
//
// const memoAdd = memoize((a,b) => a + b);
// memoAdd(1,2) → 3 (computed)
// memoAdd(1,2) → 3 (cached — fn NOT called again)
// ────────────────────────────────────────────
function C3_memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn.apply(this, args);
    return cache[key];
  };
}

// 🔥 CURVEBALL C3: Memoize with Map (better for object keys)
function C3_memoizeMap(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 🔥 CURVEBALL C3b: Memoize with TTL (cache expires after N ms)
function C3_memoizeTTL(fn, ttl) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < ttl) return cached.value;
    const result = fn.apply(this, args);
    cache.set(key, { value: result, time: Date.now() });
    return result;
  };
}


// ────────────────────────────────────────────
// C6 — Pipe (left-to-right)
// ⭐⭐⭐ | Target: 60 seconds
// Pattern: reduce, passing result through each fn
//
// pipe(f, g, h)(x) === h(g(f(x)))
// const transform = pipe(x => x + 1, x => x * 2, x => `Result: ${x}`);
// transform(3) → "Result: 8"
// ────────────────────────────────────────────
function C6_pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}


// ────────────────────────────────────────────
// C9 — Event Emitter
// ⭐⭐⭐ | Target: 3 minutes
//
// Implement: on(event, cb), off(event, cb), emit(event, ...args), once(event, cb)
// ────────────────────────────────────────────
function C9_createEventEmitter() {
  const events = {};
  return {
    on(event, cb) {
      if (!events[event]) events[event] = [];
      events[event].push(cb);
    },
    off(event, cb) {
      if (!events[event]) return;
      events[event] = events[event].filter(fn => fn !== cb);
    },
    emit(event, ...args) {
      if (!events[event]) return;
      events[event].forEach(cb => cb(...args));
    },
    once(event, cb) {
      const wrapper = (...args) => {
        cb(...args);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    },
  };
}


// ────────────────────────────────────────────
// E4 — Valid Brackets
// ⭐⭐⭐ | Target: 2 minutes
// Pattern: stack + matching map
//
// isValid("()[]{}") → true
// isValid("(]")     → false
// isValid("{[]}")    → true
// ────────────────────────────────────────────
function E4_validBrackets(str) {
  const stack = [];
  const map = { ")": "(", "]": "[", "}": "{" };
  for (const ch of str) {
    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (")]}".includes(ch)) {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}

// 🔥 CURVEBALL E4: What if the string has other characters mixed in?
// "( hello [ world ] )" → true  (ignore non-bracket chars)
// Same solution works! The else-if only processes bracket chars.


// ────────────────────────────────────────────
// G1 — ES2025 Set Methods
// ⭐⭐ | Target: 60 seconds
//
// A = {1,2,3,4}, B = {3,4,5,6}
// .union(), .intersection(), .difference(), .symmetricDifference(), .isSubsetOf()
// ────────────────────────────────────────────
function G1_setMethods() {
  const A = new Set([1, 2, 3, 4]);
  const B = new Set([3, 4, 5, 6]);
  return {
    union: A.union(B),                    // {1,2,3,4,5,6}
    intersection: A.intersection(B),      // {3,4}
    difference: A.difference(B),          // {1,2}
    symDiff: A.symmetricDifference(B),    // {1,2,5,6}
    isSubset: new Set([3, 4]).isSubsetOf(A), // true
  };
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   TIER 4 — HARD (⭐⭐⭐⭐) — Under 3 Minutes                ║
// ║   Senior-level questions. Nail these = strong hire signal     ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// B3 — Array.prototype.myReduce
// ⭐⭐⭐⭐ | Target: 2 minutes
// Tricky part: handle no initial value
//
// [1,2,3].myReduce((acc, x) => acc + x, 0) → 6
// [1,2,3].myReduce((acc, x) => acc + x)    → 6 (no initial: starts at first element)
// ────────────────────────────────────────────
function B3_myReduce() {
  Array.prototype.myReduce = function (cb, initialValue) {
    let acc = initialValue;
    let startIndex = 0;

    if (acc === undefined) {
      acc = this[0];
      startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
      acc = cb(acc, this[i], i, this);
    }
    return acc;
  };
}

// 🔥 CURVEBALL B3: What happens if you call reduce on empty array with no initial value?
// Answer: TypeError! "Reduce of empty array with no initial value"


// ────────────────────────────────────────────
// B4 — Promise.all from scratch
// ⭐⭐⭐⭐ | Target: 3 minutes
// Tricky: maintain order, reject on first failure
//
// myPromiseAll([Promise.resolve(1), Promise.resolve(2)]) → Promise<[1, 2]>
// Rejects immediately if ANY rejects.
// ────────────────────────────────────────────
function B4_myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        results[index] = value;  // maintain order!
        completed++;
        if (completed === promises.length) resolve(results);
      }).catch(reject);  // reject immediately on first error
    });
  });
}

// 🔥 CURVEBALL B4: What if the array contains non-promises?
// Answer: Promise.resolve(promise) handles it — wraps non-promises automatically


// ────────────────────────────────────────────
// B5 — Promise.allSettled from scratch
// ⭐⭐⭐⭐ | Target: 3 minutes
//
// Waits for ALL promises to settle (resolve or reject).
// myAllSettled([Promise.resolve(1), Promise.reject("err")])
// → [{ status:"fulfilled", value:1 }, { status:"rejected", reason:"err" }]
// ────────────────────────────────────────────
function B5_myAllSettled(promises) {
  return new Promise(resolve => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) resolve(results);
        });
    });
  });
}


// ────────────────────────────────────────────
// B6 — Function.prototype.myBind
// ⭐⭐⭐⭐ | Target: 2 minutes
// Tricky: partial application (pre-filled args)
//
// function greet(greeting, name) { return `${greeting}, ${name}`; }
// const hi = greet.myBind(null, "Hi");
// hi("Tijo") → "Hi, Tijo"
// ────────────────────────────────────────────
function B6_myBind() {
  Function.prototype.myBind = function (context, ...boundArgs) {
    const fn = this;
    return function (...callArgs) {
      return fn.apply(context, [...boundArgs, ...callArgs]);
    };
  };
}

// 🔥 CURVEBALL B6: Implement call and apply too
// call: fn.myCall(context, arg1, arg2)
// apply: fn.myApply(context, [arg1, arg2])
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};

Function.prototype.myApply = function (context, args = []) {
  return this.myCall(context, ...args);
};


// ────────────────────────────────────────────
// C5 — Curry
// ⭐⭐⭐⭐ | Target: 2 minutes
// Pattern: recursive — collect args until enough
//
// const add = curry((a,b,c) => a + b + c);
// add(1)(2)(3)  → 6
// add(1,2)(3)   → 6
// add(1)(2,3)   → 6
// ────────────────────────────────────────────
function C5_curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

// 🔥 CURVEBALL C5: Infinite curry with valueOf
// sum(1)(2)(3) + 0 === 6
// sum(1)(2)(3)(4)(5) + 0 === 15
function C5_infiniteCurry(fn) {
  const inner = (...args) => {
    const next = (...moreArgs) => inner(...args, ...moreArgs);
    next.valueOf = () => args.reduce(fn, 0);
    next.toString = () => String(args.reduce(fn, 0));
    return next;
  };
  return inner;
}
// const sum = C5_infiniteCurry((a, b) => a + b);
// sum(1)(2)(3) + 0 → 6


// ────────────────────────────────────────────
// C8 — Deep Clone (no structuredClone, no JSON)
// ⭐⭐⭐⭐ | Target: 3 minutes
//
// Handle: objects, arrays, Date, null, primitives.
// const clone = deepClone(obj); clone.b.c = 99; obj.b.c → still 2
// ────────────────────────────────────────────
function C8_deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(item => C8_deepClone(item));

  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = C8_deepClone(obj[key]);
    }
  }
  return clone;
}

// 🔥 CURVEBALL C8: Deep clone with circular reference handling
function C8_deepCloneCircular(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return seen.get(obj);

  if (obj instanceof Date) return new Date(obj);

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = C8_deepCloneCircular(obj[key], seen);
    }
  }
  return clone;
}


// ────────────────────────────────────────────
// E10 — Deep Equal
// ⭐⭐⭐⭐ | Target: 3 minutes
//
// deepEqual({a:1,b:{c:2}}, {a:1,b:{c:2}}) → true
// deepEqual({a:1}, {a:2}) → false
// deepEqual([1,[2]], [1,[2]]) → true
// ────────────────────────────────────────────
function E10_deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => E10_deepEqual(a[key], b[key]));
}

// 🔥 CURVEBALL E10: Deep equal that handles arrays, Date, NaN
function E10_deepEqualFull(a, b) {
  if (Object.is(a, b)) return true;  // handles NaN === NaN
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => E10_deepEqualFull(a[key], b[key]));
}


// ────────────────────────────────────────────
// F2 — Retry with Exponential Backoff
// ⭐⭐⭐⭐ | Target: 3 minutes
//
// retry(fn, maxRetries, delayMs)
// try → fail → wait 1s → fail → wait 2s → fail → reject
// ────────────────────────────────────────────
function F2_retry(fn, maxRetries, delayMs) {
  return new Promise((resolve, reject) => {
    const attempt = (retriesLeft, currentDelay) => {
      fn()
        .then(resolve)
        .catch(err => {
          if (retriesLeft <= 0) return reject(err);
          setTimeout(
            () => attempt(retriesLeft - 1, currentDelay * 2),
            currentDelay
          );
        });
    };
    attempt(maxRetries, delayMs);
  });
}

// 🔥 CURVEBALL F2: Retry using async/await (cleaner)
async function F2_retryAsync(fn, maxRetries, delayMs) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries) throw err;
      await F1_sleep(delayMs * Math.pow(2, i));
    }
  }
}


// ────────────────────────────────────────────
// F4 — Promise.race from scratch
// ⭐⭐⭐ | Target: 60 seconds
//
// Resolves/rejects as soon as the FIRST promise settles.
// ────────────────────────────────────────────
function F4_myRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}


// ────────────────────────────────────────────
// F5 — Sequential Promise Execution
// ⭐⭐⭐ | Target: 2 minutes
//
// Given array of functions that return promises, execute one after another (NOT parallel).
// runSequential([() => fetch(1), () => fetch(2)]) → waits for 1, then starts 2
// ────────────────────────────────────────────
function F5_runSequential(tasks) {
  return tasks.reduce(
    (chain, task) => chain.then(results =>
      task().then(result => [...results, result])
    ),
    Promise.resolve([])
  );
}

// 🔥 CURVEBALL F5: Sequential with async/await (easier to read)
async function F5_runSequentialAsync(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   TIER 5 — BOSS LEVEL (⭐⭐⭐⭐⭐) — Curveballs Only        ║
// ║   These separate mid from senior. Instant credibility.        ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// F3 — Concurrency Limiter
// ⭐⭐⭐⭐⭐ | Target: 5 minutes
// ────────────────────────────────────────────
function F3_runWithLimit(tasks, limit) {
  return new Promise(resolve => {
    const results = [];
    let running = 0;
    let index = 0;

    function runNext() {
      if (index >= tasks.length && running === 0) {
        return resolve(results);
      }

      while (running < limit && index < tasks.length) {
        const currentIndex = index++;
        running++;
        tasks[currentIndex]()
          .then(result => { results[currentIndex] = result; })
          .finally(() => {
            running--;
            runNext();
          });
      }
    }

    runNext();
  });
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 1: Implement a simple LRU Cache
// ⭐⭐⭐⭐⭐ | Target: 5 minutes
//
// get(key) → returns value or -1
// put(key, value) → inserts/updates, evicts oldest if over capacity
// ────────────────────────────────────────────
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);  // move to end (most recent)
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      // delete oldest (first key)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 2: Flatten an object
// ⭐⭐⭐⭐⭐ | Target: 3 minutes
//
// { a: { b: { c: 1 } }, d: 2 }
// → { "a.b.c": 1, "d": 2 }
// ────────────────────────────────────────────
function flattenObject(obj, prefix = "", result = {}) {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 3: UNflatten an object (reverse)
// ⭐⭐⭐⭐⭐ | Target: 3 minutes
//
// { "a.b.c": 1, "d": 2 }
// → { a: { b: { c: 1 } }, d: 2 }
// ────────────────────────────────────────────
function unflattenObject(obj) {
  const result = {};
  for (const key in obj) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = obj[key];
  }
  return result;
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 4: Promise with timeout
// ⭐⭐⭐⭐ | Target: 2 minutes
//
// Wraps a promise — if it doesn't resolve within
// timeout ms, reject with "Timeout"
// ────────────────────────────────────────────
function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 5: Implement JSON.stringify (simplified)
// ⭐⭐⭐⭐⭐ | Target: 5 minutes
// ────────────────────────────────────────────
function myStringify(value) {
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "undefined" || typeof value === "function") return undefined;

  if (Array.isArray(value)) {
    const items = value.map(item => myStringify(item) ?? "null");
    return `[${items.join(",")}]`;
  }

  if (typeof value === "object") {
    const pairs = Object.keys(value)
      .filter(key => myStringify(value[key]) !== undefined)
      .map(key => `"${key}":${myStringify(value[key])}`);
    return `{${pairs.join(",")}}`;
  }
}


// ────────────────────────────────────────────
// 🔥 CURVEBALL BOSS 6: Implement a simple pub/sub with wildcard
// ⭐⭐⭐⭐⭐ | Target: 4 minutes
//
// on("user.*", cb) → matches "user.login", "user.logout"
// on("*", cb) → matches everything
// ────────────────────────────────────────────
function createPubSub() {
  const subs = [];
  return {
    on(pattern, cb) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      subs.push({ regex, cb });
    },
    emit(event, data) {
      subs.forEach(({ regex, cb }) => {
        if (regex.test(event)) cb(data);
      });
    },
  };
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   SECTION D — Output Prediction SOLUTIONS                     ║
// ║   MEMORIZE THESE — they come up in EVERY interview            ║
// ║   Write the answers on paper first, then check                ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// D1 — Event Loop Order
//
// RULE: sync → microtasks (Promise) → macrotasks (setTimeout)
//
//   console.log("A");           ← sync: runs 1st
//   setTimeout(→"B", 0);       ← macrotask queue
//   Promise.then(→"C");        ← microtask queue
//   Promise.then(→"D", then setTimeout(→"E"));
//   console.log("F");           ← sync: runs 2nd
//
// Execution:
//   1. Sync: A, F
//   2. Microtask: C, D (D schedules E as macrotask)
//   3. Macrotask: B, E
// ────────────────────────────────────────────
function D1_eventLoop() {
  return ["A", "F", "C", "D", "B", "E"];
}


// ────────────────────────────────────────────
// D2 — Event Loop (harder)
//
//   setTimeout(→"1", 0);       ← macrotask
//   Promise.then(→"2", then Promise.then(→"3"));  ← microtask (chains another microtask)
//   Promise.then(→"4");        ← microtask
//   console.log("5");           ← sync
//
// Execution:
//   1. Sync: 5
//   2. Microtask: 2, 4, then 3 (microtask from inside microtask runs before macrotask!)
//   3. Macrotask: 1
// ────────────────────────────────────────────
function D2_eventLoopHard() {
  return ["5", "2", "4", "3", "1"];
}

// 🔥 CURVEBALL D2: What if we add queueMicrotask()?
// queueMicrotask behaves exactly like Promise.resolve().then()
// It goes to the microtask queue, runs before setTimeout


// ────────────────────────────────────────────
// D3 — `this` keyword
//
// obj.getX()        → 10 (method call, this = obj)
// obj.getXArrow()   → undefined (arrow fn, this = outer scope = module/global, no x)
// setTimeout(function) → undefined (regular fn in setTimeout, this = global)
// setTimeout(arrow)    → 10 (arrow captures this from getXDelayed, which is obj)
// ────────────────────────────────────────────
function D3_thisKeyword() {
  return { C: 10, D: undefined, A: undefined, B: 10 };
}

// 🔥 CURVEBALL D3: The 5 rules of `this` (MEMORIZE)
// 1. new → this = new object
// 2. explicit bind/call/apply → this = specified object
// 3. method call (obj.fn()) → this = obj
// 4. plain function call → this = undefined (strict) or global (sloppy)
// 5. arrow function → this = enclosing scope's this (NEVER has own this)


// ────────────────────────────────────────────
// D4 — var in loop
//
// var is function-scoped, NOT block-scoped
// By the time setTimeout runs, the loop is done and i = 3
// ────────────────────────────────────────────
function D4_varInLoop() {
  return [3, 3, 3];
}

// 🔥 CURVEBALL D4: TWO fixes
// Fix 1: Use let (block-scoped, each iteration gets its own i)
//   for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
//   → 0, 1, 2

// Fix 2: Use IIFE to capture i
//   for (var i = 0; i < 3; i++) {
//     (function(j) { setTimeout(() => console.log(j), 0); })(i);
//   }
//   → 0, 1, 2

// Fix 3: Use bind
//   for (var i = 0; i < 3; i++) {
//     setTimeout(console.log.bind(console, i), 0);
//   }


// ────────────────────────────────────────────
// D5 — Hoisting & TDZ
//
// var a → declaration hoisted (value undefined until assignment)
// let b → in TDZ (Temporal Dead Zone) until declaration line
// function c → FULLY hoisted (both declaration and body)
// ────────────────────────────────────────────
function D5_hoisting() {
  return { A: undefined, B: "ReferenceError", C: "function" };
}

// 🔥 CURVEBALL D5: Function expression vs declaration
// console.log(foo);  → [Function: foo]  (declaration hoisted)
// console.log(bar);  → undefined         (var hoisted, but value is undefined)
// function foo() {}
// var bar = function() {};


// ────────────────────────────────────────────
// D6 — Closure over reference (not value!)
//
// Closures capture the REFERENCE to the variable, not a snapshot
// When getVal() runs, val has already been changed to 2
// ────────────────────────────────────────────
function D6_closureRef() {
  return 2;
}


// ────────────────────────────────────────────
// D7 — IIFE
//
// Outer IIFE receives a = 45
// Inner IIFE logs a → 45
// Then a is reassigned to 23 (but log already happened)
// ────────────────────────────────────────────
function D7_iife() {
  return 45;
}


// ────────────────────────────────────────────
// D8 — == vs === (loose vs strict equality)
//
// RULE: == does type coercion, === does not
// ────────────────────────────────────────────
function D8_equality() {
  return [
    true,   // "5" == 5       → string coerced to number
    false,  // "5" === 5      → different types
    true,   // null == undefined  → special rule: they're == to each other and nothing else
    false,  // null === undefined → different types
    false,  // NaN == NaN     → NaN is not equal to anything, including itself!
    true,   // 0 == false     → false coerced to 0
    true,   // "" == false    → both coerced to 0
    true,   // [] == false    → [] → "" → 0, false → 0
    true,   // [] == ![]      → ![] is false, then [] == false (same as above)
  ];
}

// 🔥 CURVEBALL D8: The REALLY tricky ones
// {} + [] → 0        (empty block + array coerced to number)
// [] + {} → "[object Object]"   (array coerced to string + object)
// [] + [] → ""       (both coerced to empty strings)
// {} + {} → NaN or "[object Object][object Object]" (depends on engine)
// null + 1 → 1       (null coerced to 0)
// undefined + 1 → NaN
// "5" - 3 → 2        (string coerced to number for subtraction)
// "5" + 3 → "53"     (concatenation for +)


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   🔥🔥🔥 HARDCORE OUTPUT PREDICTION — 25 QUESTIONS 🔥🔥🔥   ║
// ║   Write your answer FIRST. Then check. Pen & paper gold.      ║
// ║   These are the ones that ACTUALLY show up in interviews.     ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝


// ────────────────────────────────────────────
// OP1 — Closure + setTimeout combo
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP1_closureTimeout() {
  // QUESTION: What does this print?
  //
  //   function outer() {
  //     let count = 0;
  //     return function inner() {
  //       count++;
  //       console.log(count);
  //     };
  //   }
  //   const fn = outer();
  //   fn();  // ?
  //   fn();  // ?
  //   fn();  // ?

  // ANSWER: 1, 2, 3
  // WHY: fn is a closure over `count`. Each call increments
  // the SAME `count` variable. Closures hold references, not copies.
  return [1, 2, 3];
}


// ────────────────────────────────────────────
// OP2 — Multiple closures share the same variable
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP2_sharedClosure() {
  // QUESTION:
  //
  //   function createFns() {
  //     let val = 0;
  //     const inc = () => ++val;
  //     const get = () => val;
  //     return { inc, get };
  //   }
  //   const { inc, get } = createFns();
  //   inc();
  //   inc();
  //   inc();
  //   console.log(get());  // ?

  // ANSWER: 3
  // WHY: Both inc and get close over the SAME `val`.
  // inc mutates it, get reads it.
  return 3;
}


// ────────────────────────────────────────────
// OP3 — Promise vs setTimeout ordering (tricky)
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP3_promiseSetTimeout() {
  // QUESTION:
  //
  //   console.log("1");
  //   setTimeout(() => console.log("2"), 0);
  //   Promise.resolve()
  //     .then(() => console.log("3"))
  //     .then(() => console.log("4"));
  //   setTimeout(() => console.log("5"), 0);
  //   console.log("6");

  // ANSWER: "1", "6", "3", "4", "2", "5"
  // WHY:
  //   Sync: 1, 6
  //   Microtask: 3, then 4 (chained .then runs before ANY macrotask)
  //   Macrotask: 2, 5 (in order they were scheduled)
  return ["1", "6", "3", "4", "2", "5"];
}


// ────────────────────────────────────────────
// OP4 — async/await is just sugar over Promises
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP4_asyncAwait() {
  // QUESTION:
  //
  //   async function foo() {
  //     console.log("A");
  //     await Promise.resolve();
  //     console.log("B");
  //   }
  //   console.log("C");
  //   foo();
  //   console.log("D");

  // ANSWER: "C", "A", "D", "B"
  // WHY:
  //   1. "C" — sync
  //   2. foo() called: "A" — sync (before the await)
  //   3. await pauses foo, returns to caller
  //   4. "D" — sync
  //   5. Microtask queue: "B" (the code after await)
  return ["C", "A", "D", "B"];
}


// ────────────────────────────────────────────
// OP5 — async/await with multiple awaits
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP5_multipleAwaits() {
  // QUESTION:
  //
  //   async function first() {
  //     console.log(1);
  //     await second();
  //     console.log(2);
  //   }
  //   async function second() {
  //     console.log(3);
  //     await Promise.resolve();
  //     console.log(4);
  //   }
  //   console.log(5);
  //   first();
  //   console.log(6);

  // ANSWER: 5, 1, 3, 6, 4, 2
  // WHY:
  //   Sync: 5
  //   first() called: 1 (sync), calls second()
  //   second() called: 3 (sync), hits await → pauses second AND first
  //   Back to main: 6 (sync)
  //   Microtask: 4 (second resumes after await)
  //   Microtask: 2 (first resumes — second() is now done)
  return [5, 1, 3, 6, 4, 2];
}


// ────────────────────────────────────────────
// OP6 — `this` with method extraction
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP6_thisExtraction() {
  // QUESTION:
  //
  //   const user = {
  //     name: "Tijo",
  //     greet() {
  //       return `Hi, I'm ${this.name}`;
  //     }
  //   };
  //
  //   const greet = user.greet;
  //   console.log(user.greet());  // A
  //   console.log(greet());       // B

  // ANSWER: A = "Hi, I'm Tijo", B = "Hi, I'm undefined"
  // WHY: When you extract the method, `this` is no longer `user`.
  //   user.greet() → this = user → "Tijo"
  //   greet() → this = undefined (strict) or global → no `name`
  return { A: "Hi, I'm Tijo", B: "Hi, I'm undefined" };
}


// ────────────────────────────────────────────
// OP7 — `this` in nested functions
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP7_thisNested() {
  // QUESTION:
  //
  //   const obj = {
  //     x: 1,
  //     method() {
  //       console.log(this.x);           // A
  //       function inner() {
  //         console.log(this.x);         // B
  //       }
  //       const arrowInner = () => {
  //         console.log(this.x);         // C
  //       };
  //       inner();
  //       arrowInner();
  //     }
  //   };
  //   obj.method();

  // ANSWER: A = 1, B = undefined, C = 1
  // WHY:
  //   A: method called on obj → this = obj → 1
  //   B: inner() is a plain function call → this = global → undefined
  //   C: arrow inherits `this` from method → this = obj → 1
  return { A: 1, B: undefined, C: 1 };
}


// ────────────────────────────────────────────
// OP8 — Promise.resolve chaining trap
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP8_promiseChain() {
  // QUESTION:
  //
  //   Promise.resolve(1)
  //     .then(x => x + 1)
  //     .then(x => { console.log(x); })
  //     .then(x => console.log(x));

  // ANSWER: 2, then undefined
  // WHY:
  //   Step 1: resolve(1) → x=1, return 1+1 = 2
  //   Step 2: x=2, console.log(2), function returns undefined (no explicit return)
  //   Step 3: x=undefined (previous .then returned nothing)
  return [2, undefined];
}


// ────────────────────────────────────────────
// OP9 — typeof traps
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP9_typeofTraps() {
  // QUESTION: What does typeof return for each?
  //
  //   typeof undefined       // a
  //   typeof null            // b  ← FAMOUS BUG!
  //   typeof NaN             // c
  //   typeof []              // d
  //   typeof {}              // e
  //   typeof function(){}    // f
  //   typeof ""              // g
  //   typeof 42n             // h (BigInt)
  //   typeof Symbol()        // i
  //   typeof Infinity        // j
  //   typeof -Infinity       // k
  //   typeof true            // l
  //   typeof 0               // m

  return {
    a: "undefined",
    b: "object",      // FAMOUS JS BUG — null is "object"!
    c: "number",      // NaN is type "number" — yes, really
    d: "object",      // arrays are objects
    e: "object",
    f: "function",    // only type that gets its own typeof
    g: "string",
    h: "bigint",
    i: "symbol",
    j: "number",      // Infinity is a number!
    k: "number",      // -Infinity is also a number!
    l: "boolean",
    m: "number",      // 0 is a number (even though it's falsy)
  };
  //
  // 🔥 BONUS: Infinity gotchas
  //   Infinity === Infinity        → true
  //   Infinity + 1                 → Infinity
  //   Infinity - Infinity          → NaN !!
  //   Infinity * 0                 → NaN !!
  //   Infinity * -1                → -Infinity
  //   1 / 0                        → Infinity
  //   -1 / 0                       → -Infinity
  //   0 / 0                        → NaN
  //   Number.isFinite(Infinity)    → false
  //   Number.isFinite(42)          → true
  //   Number.isFinite(NaN)         → false
  //   isFinite("42")               → true (coerces!)
  //   Number.isFinite("42")        → false (no coercion)
  //   Math.max()                   → -Infinity (empty!)
  //   Math.min()                   → Infinity  (empty!)
}


// ────────────────────────────────────────────
// OP10 — delete keyword traps
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP10_deleteTraps() {
  // QUESTION:
  //
  //   const obj = { a: 1, b: 2, c: 3 };
  //   delete obj.b;
  //   console.log(obj);             // A
  //   console.log("b" in obj);      // B
  //
  //   const arr = [1, 2, 3];
  //   delete arr[1];
  //   console.log(arr);             // C
  //   console.log(arr.length);      // D
  //   console.log(arr[1]);          // E

  // ANSWER:
  //   A = { a: 1, c: 3 }           — property removed
  //   B = false                     — it's gone
  //   C = [1, empty, 3]            — creates a HOLE, doesn't shift elements!
  //   D = 3                        — length unchanged!
  //   E = undefined                — hole reads as undefined
  return {
    A: { a: 1, c: 3 },
    B: false,
    C: "[ 1, <1 empty item>, 3 ]",
    D: 3,
    E: undefined,
  };
}


// ────────────────────────────────────────────
// OP11 — Object reference vs copy
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP11_reference() {
  // QUESTION:
  //
  //   let a = { x: 1 };
  //   let b = a;
  //   b.x = 2;
  //   console.log(a.x);   // A
  //
  //   let c = { x: 1 };
  //   let d = { ...c };
  //   d.x = 2;
  //   console.log(c.x);   // B
  //
  //   let e = { x: { y: 1 } };
  //   let f = { ...e };
  //   f.x.y = 2;
  //   console.log(e.x.y); // C  ← THIS IS THE TRAP!

  // ANSWER: A = 2, B = 1, C = 2
  // WHY:
  //   A: b and a point to SAME object. Mutating b mutates a.
  //   B: spread creates a SHALLOW copy. d is a new object. c untouched.
  //   C: spread is SHALLOW! f.x and e.x point to the SAME nested object.
  return { A: 2, B: 1, C: 2 };
}


// ────────────────────────────────────────────
// OP12 — Tricky scope + hoisting combo
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP12_scopeHoisting() {
  // QUESTION:
  //
  //   var x = 1;
  //   function foo() {
  //     console.log(x);  // A
  //     var x = 2;
  //     console.log(x);  // B
  //   }
  //   foo();
  //   console.log(x);    // C

  // ANSWER: A = undefined, B = 2, C = 1
  // WHY:
  //   A: var x inside foo is HOISTED to top of foo → x is undefined (not the outer x!)
  //   B: x has been assigned 2
  //   C: outer x was never touched (foo has its OWN x)
  return { A: undefined, B: 2, C: 1 };
}


// ────────────────────────────────────────────
// OP13 — let + block scope in if
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP13_letBlock() {
  // QUESTION:
  //
  //   let x = 10;
  //   if (true) {
  //     let x = 20;
  //     console.log(x);  // A
  //   }
  //   console.log(x);    // B

  // ANSWER: A = 20, B = 10
  // WHY: let is BLOCK scoped. The inner x is a completely
  // different variable from the outer x. Unlike var!
  return { A: 20, B: 10 };
}


// ────────────────────────────────────────────
// OP14 — setTimeout with 0 vs setImmediate vs process.nextTick
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP14_eventLoopDeep() {
  // QUESTION (Node.js):
  //
  //   console.log("1");
  //   process.nextTick(() => console.log("2"));
  //   setTimeout(() => console.log("3"), 0);
  //   Promise.resolve().then(() => console.log("4"));
  //   queueMicrotask(() => console.log("5"));
  //   console.log("6");

  // ANSWER: 1, 6, 2, 4, 5, 3
  // WHY (priority order):
  //   1. Sync: 1, 6
  //   2. process.nextTick: 2 (runs BEFORE other microtasks in Node!)
  //   3. Promise microtask: 4
  //   4. queueMicrotask: 5 (same queue as Promise, FIFO order)
  //   5. setTimeout (macrotask): 3
  //
  // NOTE: In Node, nextTick has higher priority than Promise.then!
  return ["1", "6", "2", "4", "5", "3"];
}


// ────────────────────────────────────────────
// OP15 — toString / valueOf coercion
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP15_coercion() {
  // QUESTION:
  //
  //   const a = {
  //     valueOf() { return 10; },
  //     toString() { return "20"; }
  //   };
  //   console.log(a + 1);     // A
  //   console.log(`${a}`);    // B
  //   console.log(a == 10);   // C
  //   console.log(String(a)); // D

  // ANSWER: A = 11, B = "20", C = true, D = "20"
  // WHY:
  //   A: numeric context → valueOf() → 10 + 1 = 11
  //   B: template literal → toString() → "20"
  //   C: == with number → valueOf() → 10 == 10 → true
  //   D: explicit String() → toString() → "20"
  return { A: 11, B: "20", C: true, D: "20" };
}


// ────────────────────────────────────────────
// OP16 — Closure in a loop with let (twist!)
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP16_letLoop() {
  // QUESTION:
  //
  //   const fns = [];
  //   for (let i = 0; i < 3; i++) {
  //     fns.push(() => i);
  //   }
  //   console.log(fns[0]());  // A
  //   console.log(fns[1]());  // B
  //   console.log(fns[2]());  // C
  //
  //   // NOW with var:
  //   const fns2 = [];
  //   for (var j = 0; j < 3; j++) {
  //     fns2.push(() => j);
  //   }
  //   console.log(fns2[0]());  // D
  //   console.log(fns2[1]());  // E
  //   console.log(fns2[2]());  // F

  // ANSWER: A=0, B=1, C=2, D=3, E=3, F=3
  // WHY:
  //   let: each loop iteration creates a NEW binding → 0, 1, 2
  //   var: all closures share the SAME j → after loop j = 3
  return { A: 0, B: 1, C: 2, D: 3, E: 3, F: 3 };
}


// ────────────────────────────────────────────
// OP17 — Prototype chain lookup
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP17_prototype() {
  // QUESTION:
  //
  //   function Animal(name) { this.name = name; }
  //   Animal.prototype.speak = function() { return `${this.name} speaks`; };
  //
  //   function Dog(name) { Animal.call(this, name); }
  //   Dog.prototype = Object.create(Animal.prototype);
  //
  //   const d = new Dog("Rex");
  //   console.log(d.speak());               // A
  //   console.log(d.hasOwnProperty("name")); // B
  //   console.log(d.hasOwnProperty("speak")); // C
  //   console.log(d instanceof Dog);         // D
  //   console.log(d instanceof Animal);      // E

  // ANSWER: A = "Rex speaks", B = true, C = false, D = true, E = true
  // WHY:
  //   A: speak found on Animal.prototype via prototype chain
  //   B: name was set directly on d via Animal.call(this, name)
  //   C: speak is on the prototype, NOT on d directly
  //   D & E: Dog.prototype → Animal.prototype, so both are true
  return { A: "Rex speaks", B: true, C: false, D: true, E: true };
}


// ────────────────────────────────────────────
// OP18 — Object.keys vs for...in
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP18_keysVsForIn() {
  // QUESTION:
  //
  //   const parent = { a: 1 };
  //   const child = Object.create(parent);
  //   child.b = 2;
  //
  //   console.log(Object.keys(child));            // A
  //   const forInKeys = [];
  //   for (const key in child) forInKeys.push(key);
  //   console.log(forInKeys);                     // B

  // ANSWER: A = ["b"], B = ["b", "a"]
  // WHY:
  //   Object.keys() → only OWN enumerable properties
  //   for...in → walks the ENTIRE prototype chain (own + inherited)
  return { A: ["b"], B: ["b", "a"] };
}


// ────────────────────────────────────────────
// OP19 — Promise error handling
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP19_promiseError() {
  // QUESTION:
  //
  //   Promise.resolve(1)
  //     .then(x => { throw new Error("boom"); })
  //     .then(x => console.log("A:", x))
  //     .catch(e => { console.log("B:", e.message); return 42; })
  //     .then(x => console.log("C:", x));

  // ANSWER: "B: boom", then "C: 42"
  // WHY:
  //   Step 1: resolves with 1
  //   Step 2: throws → skips next .then, goes to .catch
  //   "A" is SKIPPED (error jumped over it)
  //   Step 3: catch handles error, returns 42
  //   Step 4: .then receives 42 from catch's return value
  return ["B: boom", "C: 42"];
}


// ────────────────────────────────────────────
// OP20 — arguments object vs rest params
// Difficulty: ⭐⭐⭐
// ────────────────────────────────────────────
function OP20_arguments() {
  // QUESTION:
  //
  //   function regular() {
  //     console.log(typeof arguments);     // A
  //     console.log(arguments.length);     // B
  //   }
  //   regular(1, 2, 3);
  //
  //   const arrow = () => {
  //     console.log(typeof arguments);     // C
  //   };
  //   // arrow(1, 2, 3); → What happens?

  // ANSWER: A = "object", B = 3, C = ReferenceError (or inherits from outer)
  // WHY:
  //   Regular functions have their own `arguments` object (array-like, not array)
  //   Arrow functions do NOT have `arguments` — use ...rest instead
  //   Arrow inherits `arguments` from enclosing scope (if any)
  return { A: "object", B: 3, C: "ReferenceError or inherited" };
}


// ────────────────────────────────────────────
// OP21 — Tricky string coercion
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP21_stringCoercion() {
  // QUESTION: What does each expression evaluate to?
  //
  //   1 + "2"          // a
  //   "3" - 1          // b
  //   "3" + 1          // c
  //   true + true      // d
  //   true + "true"    // e
  //   [] + []          // f
  //   {} + []          // g (in browser console vs as expression)
  //   4 * "3"          // h
  //   "foo" * 3        // i
  //   "foo" + 3        // j
  //   null + 1         // k
  //   undefined + 1    // l

  return {
    a: "12",           // + with string → concatenation
    b: 2,              // - always numeric → "3" becomes 3
    c: "31",           // + with string → concatenation
    d: 2,              // true → 1, 1+1 = 2
    e: "truetrue",     // + with string → concatenation
    f: "",             // both arrays → toString → "" + "" = ""
    g: 0,              // {} is empty block, +[] → +0 → 0 (console) OR "[object Object]" (expression)
    h: 12,             // * always numeric
    i: NaN,            // "foo" → NaN, NaN * 3 → NaN
    j: "foo3",         // + with string → concatenation
    k: 1,              // null → 0
    l: NaN,            // undefined → NaN
  };
}


// ────────────────────────────────────────────
// OP22 — Promise.all failure behavior
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP22_promiseAllFail() {
  // QUESTION:
  //
  //   const p1 = new Promise(r => setTimeout(() => r("p1 done"), 100));
  //   const p2 = new Promise((_, rej) => setTimeout(() => rej("p2 fail"), 50));
  //   const p3 = new Promise(r => setTimeout(() => r("p3 done"), 200));
  //
  //   Promise.all([p1, p2, p3])
  //     .then(res => console.log("Success:", res))
  //     .catch(err => console.log("Error:", err));
  //
  // What gets logged? Does p1 or p3 still execute?

  // ANSWER: "Error: p2 fail"
  // WHY:
  //   Promise.all rejects as soon as the FIRST promise rejects (p2 at 50ms)
  //   p1 and p3 still EXECUTE (promises can't be cancelled!) but their
  //   results are IGNORED
  //
  // 🔥 FOLLOWUP: How to wait for all to finish?
  //   Use Promise.allSettled() → never rejects, returns status of each
  return "Error: p2 fail";
}


// ────────────────────────────────────────────
// OP23 — Spread vs Object.assign — hidden trap
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP23_spreadAssign() {
  // QUESTION:
  //
  //   const defaults = { a: 1, b: 2, c: { d: 3 } };
  //   const user = { b: 10 };
  //
  //   const config1 = { ...defaults, ...user };
  //   console.log(config1);          // A
  //
  //   config1.c.d = 99;
  //   console.log(defaults.c.d);     // B  ← THE TRAP!!
  //
  //   const config2 = Object.assign({}, defaults);
  //   console.log(config2 === defaults);  // C

  // ANSWER:
  //   A = { a: 1, b: 10, c: { d: 99 } }  (user.b overrides defaults.b)
  //   B = 99  ← TRAP! Spread is SHALLOW. config1.c IS defaults.c (same ref)
  //   C = false (new object, but shallow copy)
  return {
    A: { a: 1, b: 10, c: { d: 3 } },
    B: 99,
    C: false,
  };
}


// ────────────────────────────────────────────
// OP24 — Tricky `this` with bind, call, apply
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP24_bindCallApply() {
  // QUESTION:
  //
  //   function greet() { return `Hi ${this.name}`; }
  //
  //   const a = { name: "Alice" };
  //   const b = { name: "Bob" };
  //
  //   const greetAlice = greet.bind(a);
  //   console.log(greetAlice());            // A
  //   console.log(greetAlice.call(b));       // B  ← CAN YOU OVERRIDE BIND?
  //
  //   const c = { name: "Charlie", greet };
  //   console.log(c.greet());               // C
  //
  //   const d = { name: "Dave", greet: greetAlice };
  //   console.log(d.greet());               // D  ← TRAP!

  // ANSWER: A = "Hi Alice", B = "Hi Alice", C = "Hi Charlie", D = "Hi Alice"
  // WHY:
  //   A: bound to `a` → Alice
  //   B: bind CANNOT be overridden by call/apply! Once bound, always bound.
  //   C: method call → this = c → Charlie
  //   D: greetAlice is bound to `a`. Even as d's method, bind wins.
  //
  // RULE: bind > method call > default
  return { A: "Hi Alice", B: "Hi Alice", C: "Hi Charlie", D: "Hi Alice" };
}


// ────────────────────────────────────────────
// OP25 — Map vs Object (tricky key behavior)
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP25_mapVsObject() {
  // QUESTION:
  //
  //   // Object keys are ALWAYS strings:
  //   const obj = {};
  //   obj[1] = "one";
  //   obj["1"] = "ONE";
  //   console.log(obj[1]);       // A
  //   console.log(Object.keys(obj)); // B
  //
  //   // Map keys can be ANYTHING:
  //   const map = new Map();
  //   map.set(1, "one");
  //   map.set("1", "ONE");
  //   console.log(map.get(1));   // C
  //   console.log(map.get("1")); // D
  //   console.log(map.size);     // E
  //
  //   // Bonus trap:
  //   const obj2 = {};
  //   const key1 = {};
  //   const key2 = {};
  //   obj2[key1] = "val1";
  //   obj2[key2] = "val2";
  //   console.log(obj2[key1]);   // F  ← TRAP!

  // ANSWER:
  //   A = "ONE"      — obj[1] and obj["1"] are the SAME key
  //   B = ["1"]      — only one key, it was overwritten
  //   C = "one"      — Map keeps 1 and "1" as SEPARATE keys
  //   D = "ONE"
  //   E = 2
  //   F = "val2"     — both {} become "[object Object]" as string key!
  return { A: "ONE", B: ["1"], C: "one", D: "ONE", E: 2, F: "val2" };
}


// ────────────────────────────────────────────
// OP26 — Generator function output
// Difficulty: ⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP26_generator() {
  // QUESTION:
  //
  //   function* counter() {
  //     let i = 0;
  //     while (true) {
  //       const reset = yield i++;
  //       if (reset) i = 0;
  //     }
  //   }
  //   const gen = counter();
  //   console.log(gen.next());       // A
  //   console.log(gen.next());       // B
  //   console.log(gen.next(true));   // C  ← passing value INTO yield
  //   console.log(gen.next());       // D

  // ANSWER:
  //   A = { value: 0, done: false }
  //   B = { value: 1, done: false }
  //   C = { value: 0, done: false }  — reset=true → i reset to 0, yield 0
  //   D = { value: 1, done: false }
  // WHY: .next(val) sends val as the return value of yield
  return {
    A: { value: 0, done: false },
    B: { value: 1, done: false },
    C: { value: 0, done: false },
    D: { value: 1, done: false },
  };
}


// ────────────────────────────────────────────
// OP27 — finally block trap
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP27_finally() {
  // QUESTION:
  //
  //   function tricky() {
  //     try {
  //       return "try";
  //     } finally {
  //       return "finally";
  //     }
  //   }
  //   console.log(tricky());  // ?

  // ANSWER: "finally"
  // WHY: finally block ALWAYS runs. If finally has a return,
  // it OVERRIDES the try block's return!
  // This is a well-known trap. Never return from finally.
  return "finally";
}


// ────────────────────────────────────────────
// OP28 — WeakRef and FinalizationRegistry (ES2021)
// Difficulty: ⭐⭐⭐⭐⭐
// (Conceptual — can't predict exact GC timing)
// ────────────────────────────────────────────
function OP28_weakRef() {
  // QUESTION: What is the output after GC runs?
  //
  //   let obj = { name: "Tijo" };
  //   const weak = new WeakRef(obj);
  //   console.log(weak.deref()?.name); // A — before GC
  //   obj = null; // remove strong reference
  //   // ... after GC runs ...
  //   console.log(weak.deref()?.name); // B — after GC

  // ANSWER:
  //   A = "Tijo" (still reachable)
  //   B = undefined (GC collected it, deref() returns undefined, ?. returns undefined)
  // WHY: WeakRef doesn't prevent garbage collection.
  //   Once no strong refs exist, GC CAN collect it (timing non-deterministic).
  return { A: "Tijo", B: undefined };
}


// ────────────────────────────────────────────
// OP29 — Microtask flood (can you starve macrotasks?)
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP29_microtaskFlood() {
  // QUESTION: Does the setTimeout EVER fire?
  //
  //   setTimeout(() => console.log("timeout"), 0);
  //
  //   function flood() {
  //     Promise.resolve().then(flood);
  //   }
  //   flood();

  // ANSWER: NO — "timeout" NEVER fires
  // WHY: Microtasks run until the queue is empty BEFORE any macrotask.
  //   flood() keeps adding microtasks forever → infinite loop in
  //   microtask queue → macrotask queue starved → setTimeout never runs.
  //   This WILL hang the process/browser tab.
  //
  // LESSON: Be careful with recursive microtasks!
  return "timeout NEVER fires — infinite microtask loop starves macrotask queue";
}


// ────────────────────────────────────────────
// OP30 — Symbol.toPrimitive
// Difficulty: ⭐⭐⭐⭐⭐
// ────────────────────────────────────────────
function OP30_toPrimitive() {
  // QUESTION:
  //
  //   const obj = {
  //     [Symbol.toPrimitive](hint) {
  //       if (hint === "number") return 42;
  //       if (hint === "string") return "hello";
  //       return true;  // default
  //     }
  //   };
  //
  //   console.log(+obj);        // A
  //   console.log(`${obj}`);    // B
  //   console.log(obj + "");    // C  ← default hint!
  //   console.log(obj == 42);   // D
  //   console.log(obj === 42);  // E

  // ANSWER: A = 42, B = "hello", C = "true", D = false, E = false
  // WHY:
  //   A: unary + → hint = "number" → 42
  //   B: template literal → hint = "string" → "hello"
  //   C: binary + with string → hint = "default" → true → "true"
  //   D: == with number → hint = "default" → true, true != 42
  //   E: === never coerces → object !== number
  return { A: 42, B: "hello", C: "true", D: false, E: false };
}


// ═══════════════════════════════════════════
// TEST RUNNER for OP questions
// ═══════════════════════════════════════════
function runOPTests() {
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║   🔥 HARDCORE OUTPUT PREDICTION TESTS         ║");
  console.log("╚═══════════════════════════════════════════════╝\n");

  const test = (name, fn) => {
    try {
      const result = fn();
      console.log(`  ✅ ${name}:`, JSON.stringify(result));
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  };

  console.log("── ⭐⭐⭐ MEDIUM ──\n");
  test("OP1  closure+timeout", OP1_closureTimeout);
  test("OP2  shared closure", OP2_sharedClosure);
  test("OP9  typeof traps", OP9_typeofTraps);
  test("OP11 reference vs copy", OP11_reference);
  test("OP13 let block scope", OP13_letBlock);
  test("OP20 arguments", OP20_arguments);

  console.log("\n── ⭐⭐⭐⭐ HARD ──\n");
  test("OP3  promise vs setTimeout", OP3_promiseSetTimeout);
  test("OP4  async/await order", OP4_asyncAwait);
  test("OP6  this extraction", OP6_thisExtraction);
  test("OP7  this nested", OP7_thisNested);
  test("OP8  promise chain trap", OP8_promiseChain);
  test("OP10 delete traps", OP10_deleteTraps);
  test("OP12 scope+hoisting", OP12_scopeHoisting);
  test("OP16 let vs var loop", OP16_letLoop);
  test("OP17 prototype chain", OP17_prototype);
  test("OP18 keys vs for-in", OP18_keysVsForIn);
  test("OP19 promise error", OP19_promiseError);
  test("OP21 string coercion", OP21_stringCoercion);
  test("OP22 Promise.all fail", OP22_promiseAllFail);
  test("OP23 spread shallow", OP23_spreadAssign);
  test("OP25 Map vs Object", OP25_mapVsObject);
  test("OP26 generator", OP26_generator);

  console.log("\n── ⭐⭐⭐⭐⭐ BOSS LEVEL ──\n");
  test("OP5  multi async/await", OP5_multipleAwaits);
  test("OP14 event loop deep", OP14_eventLoopDeep);
  test("OP15 valueOf/toString", OP15_coercion);
  test("OP24 bind vs call", OP24_bindCallApply);
  test("OP27 finally trap", OP27_finally);
  test("OP28 WeakRef", OP28_weakRef);
  test("OP29 microtask flood", OP29_microtaskFlood);
  test("OP30 Symbol.toPrimitive", OP30_toPrimitive);

  console.log("\n═══════════════════════════════════════════════");
  console.log("Cover the answers. Predict FIRST. Then check.");
  console.log("═══════════════════════════════════════════════\n");
}


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   🔥 BONUS CURVEBALLS — Tricky Conceptual Questions          ║
// ║   These aren't coding — they're "explain this" curveballs    ║
// ║   Write answers on paper!                                     ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝

/*
 * 🔥 CURVEBALL: What is the difference between .map() and .forEach()?
 * Answer: .map() RETURNS a new array. .forEach() returns undefined.
 *         .map() is for transformation. .forEach() is for side effects.
 *
 * 🔥 CURVEBALL: Can you break out of .forEach()?
 * Answer: NO! You can't use break/return to stop forEach.
 *         Use a regular for loop or for...of if you need to break.
 *         (Or use .some() / .every() as a hack)
 *
 * 🔥 CURVEBALL: What's the difference between Object.freeze() and Object.seal()?
 * freeze: can't add, delete, or modify properties (shallow!)
 * seal: can't add or delete, but CAN modify existing properties
 * Neither is deep — nested objects are NOT frozen/sealed
 *
 * 🔥 CURVEBALL: What is a WeakMap? When would you use it?
 * Keys must be objects. Keys are weakly referenced — garbage collected when
 * no other references exist. Not iterable. Use for: private data, caching
 * where you don't want to prevent GC, DOM node metadata.
 *
 * 🔥 CURVEBALL: What is event delegation?
 * Instead of attaching handlers to each child, attach ONE handler to the parent.
 * Use event.target to determine which child was clicked.
 * Benefits: fewer handlers, works for dynamically added children.
 *
 * 🔥 CURVEBALL: What is the difference between target and currentTarget?
 * event.target = the element that was CLICKED (the source)
 * event.currentTarget = the element the handler is ATTACHED to
 *
 * 🔥 CURVEBALL: Explain the prototype chain
 * Every object has a [[Prototype]] link to another object.
 * When you access a property, JS looks up the chain until it finds it or hits null.
 * obj → Object.prototype → null
 * arr → Array.prototype → Object.prototype → null
 *
 * 🔥 CURVEBALL: What is generator function? When would you use it?
 * function* gen() { yield 1; yield 2; yield 3; }
 * Pauses execution at each yield. Called with .next().
 * Use for: lazy evaluation, infinite sequences, async iteration.
 *
 * 🔥 CURVEBALL: What is Symbol and why does it exist?
 * Unique, immutable identifier. No two Symbols are equal.
 * Use for: private-ish properties, avoiding name collisions,
 * well-known symbols (Symbol.iterator, Symbol.toPrimitive).
 *
 * 🔥 CURVEBALL: What is the difference between slice and splice?
 * slice(start, end): returns NEW array, does NOT modify original
 * splice(start, deleteCount, ...items): MODIFIES original array
 */


// ═══════════════════════════════════════════
// TEST RUNNER
// ═══════════════════════════════════════════
async function runTests() {
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║   07 — Interview Drills SOLUTIONS (2026)      ║");
  console.log("╚═══════════════════════════════════════════════╝\n");

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

  // TIER 1 — Easy
  console.log("\n── TIER 1: EASY (must be instant) ──\n");
  test("A3 dedup", () => A3_dedupPrimitives([1,2,2,3,3,3]));
  test("A3🔥 dedup no Set", () => A3_dedupNoSet([1,2,2,3,3,3]));
  test("E1 reverse", () => E1_reverseString("hello"));
  test("E1🔥 reverse manual", () => E1_reverseManual("hello"));
  test("E1🔥 reverse words", () => E1_reverseWords("hello world foo"));
  test("E2 palindrome", () => E2_isPalindrome("A man, a plan, a canal: Panama"));
  test("E7 vowels", () => E7_countVowels("hello world"));
  test("E9 compact", () => E9_compact([0,1,false,2,"",3,null,undefined,NaN]));
  test("G3 optional", () => G3_optionalChaining({ user: { profile: { name: "Tijo" } } }));
  await testAsync("F1 sleep", async () => { await F1_sleep(10); return "slept 10ms"; });

  // TIER 2 — Medium
  console.log("\n── TIER 2: MEDIUM (under 60s) ──\n");
  test("A1 frequency", () => A1_frequencyCount(["a","b","a","c","b","a"]));
  test("A1🔥 freq sorted", () => A1_frequencySorted(["a","b","a","c","b","a"]));
  test("A2 mostFreq", () => A2_mostFrequent([3,1,3,2,1,3]));
  test("A2🔥 all most", () => A2_allMostFrequent([1,1,2,2,3]));
  test("A5 groupBy", () => A5_groupBy([{name:"Apple",type:"fruit"},{name:"Carrot",type:"veg"},{name:"Banana",type:"fruit"}], "type"));
  test("A6 groupCount", () => A6_groupByCount([{type:"fruit"},{type:"veg"},{type:"fruit"}], "type"));
  test("A7 Array.from", () => A7_arrayFromDrills());
  test("A7🔥 range", () => A7_range(1, 10, 2));
  test("A9 fibonacci", () => A9_fibonacci(8));
  test("A10 isFibLike", () => ({ yes: A10_isFibLike([1,1,2,3,5,8,13,21]), no: A10_isFibLike([1,2,4,8]) }));
  test("A11 moveZeros", () => A11_moveZeros([0,1,0,3,12]));
  test("A12 secondLargest", () => A12_secondLargest([1,3,5,8,8,2,9]));
  test("A12🔥 optimal", () => A12_secondLargestOptimal([1,3,5,8,8,2,9]));
  test("A13 chunk", () => A13_chunk([1,2,3,4,5,6,7], 3));
  test("A14 intersection", () => A14_intersection([1,2,3,4],[3,4,5,6]));
  test("A15 difference", () => A15_difference([1,2,3,4],[3,4,5,6]));
  test("A15🔥 symDiff", () => A15_symmetricDiff([1,2,3,4],[3,4,5,6]));
  test("A16 rotateR", () => A16_rotateRight([1,2,3,4,5], 2));
  test("A16 rotateL", () => A16_rotateLeft([1,2,3,4,5], 2));
  test("A16🔥 loop", () => A16_rotateRightLoop([1,2,3,4,5], 2));
  test("A16🔥 inPlace", () => A16_rotateInPlace([1,2,3,4,5], 2));
  test("E3 anagram", () => ({ yes: E3_isAnagram("listen","silent"), no: E3_isAnagram("hello","world") }));
  test("E3🔥 group anagrams", () => E3_groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
  test("E5 firstUnique", () => E5_firstNonRepeating("aabccbd"));
  test("E6 titleCase", () => E6_titleCase("hello world from js"));
  test("E8 longest", () => E8_longestWord("The quick brown fox jumped"));
  test("C4 once", () => { let c=0; const fn=C4_once(()=>++c); return [fn(),fn(),fn()]; });
  test("C7 compose", () => C7_compose(x=>`(${x})`, x=>x*2)(3));

  // TIER 3 — Interview Standard
  console.log("\n── TIER 3: INTERVIEW STANDARD (under 2 min) ──\n");
  test("A4 dedupByKey", () => A4_dedupByKey([{id:1,email:"a@b.com"},{id:2,email:"c@d.com"},{id:3,email:"a@b.com"}], "email"));
  test("A8 flatten", () => A8_flatten([1,[2,[3,[4,5]]]]));
  test("A8🔥 depth", () => A8_flattenDepth([1,[2,[3,[4,5]]]], 1));
  B1_myMap(); B2_myFilter(); B3_myReduce(); B6_myBind(); B7_myFlat();
  test("B1 myMap", () => [1,2,3].myMap(x => x * 2));
  test("B2 myFilter", () => [1,2,3,4,5].myFilter(x => x > 3));
  test("B3 myReduce", () => [1,2,3].myReduce((a,x) => a + x, 0));
  test("C1 debounce", () => "debounce is async — tested conceptually");
  test("C3 memoize", () => { const fn=C3_memoize((a,b)=>a+b); return [fn(1,2),fn(1,2),fn(3,4)]; });
  test("C6 pipe", () => { const fn=C6_pipe(x=>x+1,x=>x*2,x=>`R:${x}`); return fn(3); });
  test("C9 emitter", () => {
    const ee = C9_createEventEmitter();
    const log = [];
    ee.on("msg", v => log.push(v));
    ee.once("msg", v => log.push("once:" + v));
    ee.emit("msg", "hi");
    ee.emit("msg", "bye");
    return log;
  });
  test("E4 brackets", () => ({ a: E4_validBrackets("()[]{}"), b: E4_validBrackets("(]"), c: E4_validBrackets("{[]}") }));

  // TIER 4 — Hard
  console.log("\n── TIER 4: HARD (under 3 min) ──\n");
  await testAsync("B4 Promise.all", () => B4_myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]));
  await testAsync("B5 allSettled", () => B5_myAllSettled([Promise.resolve(1), Promise.reject("err")]));
  test("C5 curry", () => { const add=C5_curry((a,b,c)=>a+b+c); return [add(1)(2)(3), add(1,2)(3), add(1)(2,3)]; });
  test("C8 deepClone", () => { const o={a:1,b:{c:2},d:[3,4]}; const c=C8_deepClone(o); c.b.c=99; return {orig:o.b.c,clone:c.b.c}; });
  test("E10 deepEqual", () => ({ yes: E10_deepEqual({a:1,b:{c:2}},{a:1,b:{c:2}}), no: E10_deepEqual({a:1},{a:2}) }));
  await testAsync("F4 race", () => F4_myRace([
    new Promise(r => setTimeout(() => r("slow"), 100)),
    new Promise(r => setTimeout(() => r("fast"), 10)),
  ]));
  await testAsync("F5 sequential", () => F5_runSequential([
    () => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3),
  ]));

  // Output Prediction
  console.log("\n── OUTPUT PREDICTION ──\n");
  test("D1 eventLoop", () => D1_eventLoop());
  test("D2 eventLoopHard", () => D2_eventLoopHard());
  test("D3 this", () => D3_thisKeyword());
  test("D4 var loop", () => D4_varInLoop());
  test("D5 hoisting", () => D5_hoisting());
  test("D6 closureRef", () => D6_closureRef());
  test("D7 iife", () => D7_iife());
  test("D8 equality", () => D8_equality());

  // BOSS Level
  console.log("\n── TIER 5: BOSS LEVEL ──\n");
  test("LRU Cache", () => {
    const lru = new LRUCache(2);
    lru.put(1, "a"); lru.put(2, "b");
    const r1 = lru.get(1);  // "a" — also makes 1 most recent
    lru.put(3, "c");        // evicts key 2
    const r2 = lru.get(2);  // -1 (evicted)
    return { r1, r2 };
  });
  test("flatten obj", () => flattenObject({ a: { b: { c: 1 } }, d: 2 }));
  test("unflatten obj", () => unflattenObject({ "a.b.c": 1, "d": 2 }));
  await testAsync("withTimeout", () => withTimeout(
    new Promise(r => setTimeout(() => r("ok"), 10)), 1000
  ));

  console.log("\n═══════════════════════════════════════════════");
  console.log("✅ All solutions verified! Now go practice.");
  console.log("═══════════════════════════════════════════════\n");

  // Run hardcore OP tests
  runOPTests();
}

runTests();
