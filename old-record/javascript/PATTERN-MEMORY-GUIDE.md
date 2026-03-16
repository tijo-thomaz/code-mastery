# 🧠 Pattern Memory Guide — Solve ANY Problem by Recall

> **Rule:** Every interview problem is just a PATTERN you've seen before wearing a costume.
> Memorize the pattern skeleton → recognize the costume → apply.

---

## 🔑 THE MEMORY METHOD

1. **Read** the pattern once
2. **Write** it from memory (pen & paper or blank file)
3. **Compare** — find what you missed
4. **Repeat** — 3 reps same day, then 1 rep next day
5. **Explain out loud** — if you can teach it, you own it

---

## PART 1: CORE JS PATTERNS (13 Skeletons)

Every JS interview question maps to one of these. Memorize the SKELETON, not the specific problem.

---

### SKELETON 1: Accumulate into Object
**Covers:** Frequency count, GroupBy, GroupByCount, word count, histogram
**Memory anchor:** "reduce → acc[key]"

```js
// FREQUENCY COUNT
function freqCount(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

// GROUP BY
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
}
```

**🧠 Recall trigger:** "Need to categorize/count things? → reduce into `{}`"

---

### SKELETON 2: Set for Uniqueness
**Covers:** Dedup, intersection, difference, union, "has seen"
**Memory anchor:** "`new Set` → spread back"

```js
const dedup    = arr => [...new Set(arr)];
const intersect = (a, b) => { const s = new Set(b); return a.filter(x => s.has(x)); };
const diff      = (a, b) => { const s = new Set(b); return a.filter(x => !s.has(x)); };
```

**🧠 Recall trigger:** "Unique? Overlap? Exclude? → Set"

---

### SKELETON 3: String ↔ Array Transform
**Covers:** Reverse string, palindrome, anagram, title case
**Memory anchor:** "`split → transform → join`"

```js
const reverse     = s => s.split("").reverse().join("");
const isPalindrome = s => { const c = s.toLowerCase().replace(/[^a-z0-9]/g, ""); return c === reverse(c); };
const isAnagram   = (a, b) => { const sort = s => s.toLowerCase().split("").sort().join(""); return sort(a) === sort(b); };
const titleCase   = s => s.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
```

**🧠 Recall trigger:** "String manipulation? → split it, work on array, join back"

---

### SKELETON 4: Closure + Timer
**Covers:** Debounce, throttle, memoize, once, rate limiter
**Memory anchor:** "Return a function that remembers"

```js
// DEBOUNCE — reset timer each call
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// THROTTLE — block until cooldown done
function throttle(fn, interval) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => (waiting = false), interval);
  };
}

// MEMOIZE — cache by args
function memoize(fn) {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
}

// ONCE — flag blocks re-entry
function once(fn) {
  let called = false, result;
  return (...args) => {
    if (called) return result;
    called = true;
    return (result = fn(...args));
  };
}
```

**🧠 Recall trigger:** "Control WHEN/HOW OFTEN something runs? → closure + flag/timer"
**🧠 Shape:** ALL four have the same shape: `let state; return (...args) => { /* check state */ }`

---

### SKELETON 5: Recursion + Base Case
**Covers:** Flatten, deep clone, deep equal, tree traversal, fibonacci, nested objects
**Memory anchor:** "Base case → recurse on children"

```js
// FLATTEN
const flatten = arr =>
  arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item) ? flatten(item) : item), []);

// DEEP CLONE
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  const clone = {};
  for (const key in obj) clone[key] = deepClone(obj[key]);
  return clone;
}

// DEEP EQUAL
function deepEqual(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => deepEqual(a[k], b[k]));
}
```

**🧠 Recall trigger:** "Nested/tree structure? → recursion. ALWAYS write base case FIRST."

---

### SKELETON 6: Promise Constructor
**Covers:** Sleep, Promise.all, Promise.race, allSettled, retry, timeout
**Memory anchor:** "`new Promise((resolve, reject) => ...)`"

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;         // maintain ORDER (not push!)
        if (++count === promises.length) resolve(results);
      }).catch(reject);           // reject on FIRST failure
    });
  });
}

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject));
  });
}
```

**🧠 Recall trigger:** "Async coordination? → new Promise wrapper"
**🧠 Trap to remember:** Promise.all uses `results[i]` NOT `.push()` — order matters!

---

### SKELETON 7: Prototype Method (myMap/myFilter/myReduce)
**Covers:** Polyfills — very common interview question
**Memory anchor:** "`Array.prototype.myX = function(cb) { loop this }`"

```js
Array.prototype.myMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(cb(this[i], i, this));
  }
  return result;
};

Array.prototype.myReduce = function(cb, init) {
  let acc = init !== undefined ? init : this[0];
  let start = init !== undefined ? 0 : 1;
  for (let i = start; i < this.length; i++) {
    acc = cb(acc, this[i], i, this);
  }
  return acc;
};

// myBind — trickiest polyfill
Function.prototype.myBind = function(ctx, ...bound) {
  const fn = this;
  return function(...args) {
    return fn.apply(ctx, [...bound, ...args]);
  };
};
```

**🧠 Recall trigger:** "Implement X from scratch? → `Type.prototype.myX = function`"
**🧠 Trap:** `myReduce` with no initial value → start from index 1, acc = this[0]

---

### SKELETON 8: Stack
**Covers:** Valid brackets, undo/redo, expression parsing, nested structures
**Memory anchor:** "Open → push. Close → pop and check."

```js
function validBrackets(str) {
  const stack = [];
  const map = { ")": "(", "]": "[", "}": "{" };
  for (const ch of str) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in map) {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

**🧠 Recall trigger:** "Matching pairs / nesting? → Stack"

---

### SKELETON 9: Pipe / Compose
**Covers:** Function composition, middleware chains, transforms
**Memory anchor:** "reduce with function application"

```js
const pipe    = (...fns) => x => fns.reduce((v, f) => f(v), x);      // left to right
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x); // right to left
```

---

### SKELETON 10: Curry
**Covers:** Partial application, config builders
**Memory anchor:** "Collect args until enough"

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

---

### SKELETON 11: Event Emitter
**Covers:** PubSub, observer, custom events
**Memory anchor:** "Object of arrays: `{ event: [cb, cb] }`"

```js
function createEmitter() {
  const events = {};
  return {
    on(e, cb)   { (events[e] = events[e] || []).push(cb); },
    off(e, cb)  { events[e] = (events[e] || []).filter(f => f !== cb); },
    emit(e, ...args) { (events[e] || []).forEach(cb => cb(...args)); },
    once(e, cb) {
      const wrapper = (...args) => { cb(...args); this.off(e, wrapper); };
      this.on(e, wrapper);
    }
  };
}
```

---

### SKELETON 12: Sliding Window / Chunk
**Covers:** Chunk array, max sum subarray, substring problems

```js
// CHUNK
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
```

---

### SKELETON 13: Array.from Generator
**Covers:** Range, matrix, mock data, sequences

```js
const range   = (start, end, step = 1) =>
  Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
const zeros   = n => Array.from({ length: n }, () => 0);
const matrix  = (r, c) => Array.from({ length: r }, () => Array(c).fill(0));
```

---

## PART 2: DSA PATTERNS (10 Templates)

These 10 patterns cover ~90% of coding interview problems.

---

### DSA 1: TWO POINTERS
**When:** Sorted array, pair sum, remove duplicates, container with water
**Memory anchor:** "Left at 0, right at end, move inward based on condition"

```js
// TWO SUM (sorted array)
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}

// REMOVE DUPLICATES IN-PLACE (sorted)
function removeDups(arr) {
  let write = 1;
  for (let read = 1; read < arr.length; read++) {
    if (arr[read] !== arr[read - 1]) {
      arr[write++] = arr[read];
    }
  }
  return arr.slice(0, write);
}
```

**🧠 Recognition:** "Sorted array + find pair/triplet? → Two pointers"
**🧠 Variants:**
- Same direction (fast/slow): linked list cycle, remove n-th from end
- Opposite direction: two sum sorted, container with water

---

### DSA 2: SLIDING WINDOW
**When:** Subarray/substring of size K, max sum, longest without repeating
**Memory anchor:** "Expand right, shrink left, track best"

```js
// MAX SUM SUBARRAY OF SIZE K
function maxSumK(arr, k) {
  let sum = 0, maxSum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= k) sum -= arr[i - k];    // shrink: remove leftmost
    if (i >= k - 1) maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

// LONGEST SUBSTRING WITHOUT REPEATING
function longestUnique(s) {
  const seen = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1;  // shrink past duplicate
    }
    seen.set(s[right], right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
```

**🧠 Recognition:** "Contiguous subarray/substring + optimal? → Sliding window"
**🧠 Fixed size:** Add right, remove left when window > k
**🧠 Variable size:** Expand right always, shrink left when condition breaks

---

### DSA 3: HASH MAP LOOKUP
**When:** Two sum (unsorted), find pairs, group anagrams, first unique
**Memory anchor:** "Store what you've seen → check before inserting"

```js
// TWO SUM (unsorted) — THE most asked question ever
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [-1, -1];
}
```

**🧠 Recognition:** "Need O(1) lookup / 'have I seen X before?' → HashMap"

---

### DSA 4: FIBONACCI / DYNAMIC PROGRAMMING (Bottom-Up)
**When:** Fibonacci, climbing stairs, min cost, coin change
**Memory anchor:** "Build answer from smaller sub-answers"

```js
// FIBONACCI — iterative (O(n) time, O(1) space)
function fib(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// CLIMBING STAIRS (same as fib!)
// Ways to reach step n = ways to reach (n-1) + ways to reach (n-2)
function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2;
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// COIN CHANGE — min coins to make amount
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**🧠 Recognition:** "Optimal value from choices? Overlapping subproblems? → DP"
**🧠 Template:** `dp[i] = best of (dp[smaller] + cost)`

---

### DSA 5: BFS / Level-Order (Queue)
**When:** Shortest path, level-order tree traversal, flood fill
**Memory anchor:** "Queue → process front → add neighbors"

```js
// LEVEL ORDER TRAVERSAL
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;       // snapshot current level size
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

**🧠 Recognition:** "Level by level? Shortest path? → BFS with queue"

---

### DSA 6: DFS / Recursion (Stack)
**When:** Tree depth, path sum, permutations, combinations, backtracking
**Memory anchor:** "Process current → recurse left → recurse right"

```js
// MAX DEPTH
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// PATH SUM — does any root-to-leaf path equal target?
function hasPathSum(root, target) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === target;
  return hasPathSum(root.left, target - root.val) ||
         hasPathSum(root.right, target - root.val);
}

// IN-ORDER TRAVERSAL (Left → Node → Right) — gives sorted order for BST
function inOrder(root, result = []) {
  if (!root) return result;
  inOrder(root.left, result);
  result.push(root.val);
  inOrder(root.right, result);
  return result;
}
```

**🧠 Recognition:** "Explore all paths? Tree? Depth? → DFS/recursion"

---

### DSA 7: BACKTRACKING
**When:** Permutations, combinations, subsets, N-queens, sudoku
**Memory anchor:** "Choose → Explore → Un-choose"

```js
// ALL SUBSETS
function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);          // snapshot current subset
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);            // CHOOSE
      backtrack(i + 1, current);        // EXPLORE
      current.pop();                    // UN-CHOOSE (backtrack)
    }
  }
  backtrack(0, []);
  return result;
}

// PERMUTATIONS
function permutations(nums) {
  const result = [];
  function backtrack(current, remaining) {
    if (!remaining.length) { result.push([...current]); return; }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}
```

**🧠 Recognition:** "Generate all possible X? → Backtracking"
**🧠 Template:** for loop → push → recurse → pop

---

### DSA 8: BINARY SEARCH
**When:** Sorted array, find target, find boundary, rotated array
**Memory anchor:** "mid = floor((lo + hi) / 2), halve the search space"

```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// FIND FIRST TRUE (boundary search — very powerful)
// Given sorted booleans [F,F,F,T,T,T], find first T
function firstTrue(arr) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid]) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}
```

**🧠 Recognition:** "Sorted? Find target/boundary? → Binary search"
**🧠 Trap:** Off-by-one errors. Use `lo <= hi` and `mid ± 1`.

---

### DSA 9: LINKED LIST PATTERNS
**When:** Reverse list, detect cycle, merge lists, find middle
**Memory anchor:** "prev/curr/next for reverse, fast/slow for cycle"

```js
// REVERSE LINKED LIST
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;  // new head
}

// DETECT CYCLE (Floyd's tortoise & hare)
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// FIND MIDDLE
function findMiddle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

**🧠 Recognition:** "Linked list? → prev/curr/next OR fast/slow"

---

### DSA 10: SORTING PATTERNS
**When:** Custom sort, merge sort (for interviews), counting sort
**Memory anchor:** "Merge sort = split + merge. Quick sort = pivot + partition."

```js
// MERGE SORT — O(n log n), stable, great for interviews
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    result.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  return [...result, ...a.slice(i), ...b.slice(j)];
}
```

---

## PART 3: PATTERN RECOGNITION CHEAT SHEET

When you see this in the problem → Use this pattern:

| Problem Signal | Pattern | Time |
|---------------|---------|------|
| "Sorted array" + "find" | Binary Search | O(log n) |
| "Sorted array" + "pair/sum" | Two Pointers | O(n) |
| "Subarray of size K" | Sliding Window (fixed) | O(n) |
| "Longest/shortest subarray where..." | Sliding Window (variable) | O(n) |
| "Find pair/seen before" | HashMap | O(n) |
| "Count/frequency/group" | Reduce into {} | O(n) |
| "Unique/duplicate" | Set | O(n) |
| "Nested structure" | Recursion | varies |
| "All combinations/permutations" | Backtracking | O(2^n / n!) |
| "Shortest path / level by level" | BFS (queue) | O(V+E) |
| "All paths / depth / exists" | DFS (recursion/stack) | O(V+E) |
| "Optimal value + choices" | DP | O(n*m) |
| "Linked list reverse/cycle" | prev/curr or fast/slow | O(n) |
| "Matching brackets/undo" | Stack | O(n) |
| "Rate limit / cache / delay" | Closure + timer/flag | O(1) |

---

## PART 4: OUTPUT PREDICTION RULES (Memorize These 7)

| Rule | Remember |
|------|----------|
| **Event loop order** | sync → microtask (Promise.then) → macrotask (setTimeout) |
| **`this` (5 rules)** | new > bind/call/apply > obj.fn() > plain fn (undefined) > arrow (inherits) |
| **var vs let in loop** | `var` = shared (loop ends, all see final value). `let` = each iteration owns its copy |
| **Hoisting** | `var` → hoisted as undefined. `let/const` → TDZ error. `function` → fully hoisted |
| **Closure** | Captures REFERENCE not value. Variable can change after closure is created |
| **== coercion** | null==undefined ✅, ""==false ✅, 0==false ✅. Always use === |
| **Spread is SHALLOW** | `{...obj}` only copies top level. Nested objects are still same reference |

---

## PART 5: DAILY PRACTICE ROUTINE

```
Morning (30 min):
  □ Pick 5 drills from current tier
  □ Write each from memory (set 2-min timer)
  □ If stuck → peek → close → rewrite immediately

Afternoon (20 min):
  □ Pick 2 DSA patterns
  □ Solve 1 easy LeetCode using that pattern
  □ Write the template from memory after

Evening (10 min):
  □ 5 output prediction questions on paper
  □ Write answer FIRST, then check
  □ Say the RULE out loud for any you got wrong
```

---

## 🎯 THE GOLDEN RULE

> **Don't memorize solutions. Memorize SHAPES.**
>
> Every for loop that builds an object is the SAME SHAPE.
> Every closure that returns a function is the SAME SHAPE.
> Every recursion has a base case + recurse on smaller.
>
> See the shape → fingers type automatically.
