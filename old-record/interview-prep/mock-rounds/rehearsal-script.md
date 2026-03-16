# 🔁 Experion Rehearsal Script

> **How to use:** Go through each drill. Write the solution from memory. If you can't, study it, then close this file and write it again. Repeat until your fingers type it without thinking.
>
> **Rule:** Don't just READ this. OPEN YOUR EDITOR and TYPE each one. Then delete it and type it again.

---

## PART 1: JavaScript Patterns That Keep Failing You

---

### Drill 1: Frequency Count
> *Failed at: Wipro*
> *Prompt: "Count how many times each element appears in an array"*

**Think:** reduce into an object, key = element, value = count

```javascript
const arr = ["apple", "banana", "apple", "orange", "banana", "apple"];

const freq = arr.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {});

// { apple: 3, banana: 2, orange: 1 }
```

**Variations they disguise this as:**
- "Find the most frequent element" → frequency count + Object.entries + sort
- "Find duplicates" → frequency count + filter where count > 1
- "Are there any duplicates?" → frequency count OR just use a Set and compare lengths

```javascript
// Most frequent
const mostFreq = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

// Find duplicates
const dupes = Object.keys(freq).filter(key => freq[key] > 1);

// Has duplicates (one-liner)
const hasDupes = new Set(arr).size !== arr.length;
```

⏱️ **Target:** Write frequency count in under 60 seconds. Rehearse 3x.

---

### Drill 2: Dedup / Remove Duplicates
> *Failed at: UST (dedup emails)*
> *Prompt: "Remove duplicate values from an array"*

**Think:** Set for primitives, Map/reduce for objects

```javascript
// Primitives — one liner
const unique = [...new Set(arr)];

// Objects by key (e.g., dedup emails)
const users = [
  { id: 1, email: "a@b.com" },
  { id: 2, email: "c@d.com" },
  { id: 3, email: "a@b.com" },
];

const dedupByEmail = [...new Map(users.map(u => [u.email, u])).values()];
// Map overwrites duplicate keys → only last entry per email survives → .values() extracts them
```

**Why Map works for object dedup:**
- `new Map(entries)` takes `[key, value]` pairs
- If two entries have the same key, the second overwrites the first
- `.values()` gives you the deduplicated objects

⏱️ **Target:** Both versions in under 90 seconds. Rehearse 3x.

---

### Drill 3: GroupBy
> *Failed at: UST (groupBy count and items based on type)*
> *Prompt: "Group these items by their type/category"*

**Think:** reduce into an object, key = group, value = array of items

```javascript
const items = [
  { name: "Apple", type: "fruit" },
  { name: "Carrot", type: "vegetable" },
  { name: "Banana", type: "fruit" },
  { name: "Spinach", type: "vegetable" },
  { name: "Chicken", type: "meat" },
];

const grouped = items.reduce((acc, item) => {
  const key = item.type;
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

// { fruit: [{...}, {...}], vegetable: [{...}, {...}], meat: [{...}] }
```

**Variations:**
- "Group and count" → same reduce but push count instead of items
- "Group and get names only" → push `item.name` instead of `item`
- Modern: `Object.groupBy(items, item => item.type)` — know this exists but use reduce in interviews (wider support, shows you understand it)

```javascript
// Group and count
const countByType = items.reduce((acc, item) => {
  acc[item.type] = (acc[item.type] || 0) + 1;
  return acc;
}, {});
// { fruit: 2, vegetable: 2, meat: 1 }
```

⏱️ **Target:** GroupBy + GroupBy-with-count in under 2 minutes. Rehearse 3x.

---

### Drill 4: Array.from({length})
> *Failed at: Socure, Arrow*
> *Prompt: "Generate an array of N items" or "Create a range"*

**Think:** Array.from takes `{length: n}` and a mapper function `(_, index) => ...`

```javascript
// Generate [0, 1, 2, 3, 4]
Array.from({ length: 5 }, (_, i) => i);

// Generate [1, 2, 3, 4, 5]
Array.from({ length: 5 }, (_, i) => i + 1);

// Generate 5 empty objects with ids
Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: "" }));

// Generate a grid of colors (Socure nested box question!)
Array.from({ length: 4 }, (_, i) => ({
  id: i,
  color: ["red", "blue", "green", "yellow"][i],
}));
```

**Why Array.from and not new Array():**
- `new Array(5)` creates 5 empty slots — `.map()` skips empty slots!
- `Array.from({length: 5})` creates 5 `undefined` slots — `.map()` works on them
- That's why `new Array(5).map((_, i) => i)` gives `[empty × 5]` but `Array.from` works

⏱️ **Target:** Generate any array from length in under 30 seconds. Rehearse 3x.

---

### Drill 5: Fibonacci Recognition + Generation
> *Failed at: Arrow — saw [1,1,2,3,5,8,13,21] and didn't recognize it*

**Recognize on sight:**
```
Fibonacci:    1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
              each = sum of previous two

Arithmetic:   2, 4, 6, 8, 10         (constant difference)
Geometric:    2, 4, 8, 16, 32        (constant multiplier)
Triangular:   1, 3, 6, 10, 15, 21    (add 1, add 2, add 3...)
Powers of 2:  1, 2, 4, 8, 16, 32, 64
```

**Generate Fibonacci:**

```javascript
function fibonacci(n) {
  const result = [1, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

fibonacci(8); // [1, 1, 2, 3, 5, 8, 13, 21]
```

**Check if a sequence is Fibonacci:**

```javascript
function isFibLike(arr) {
  if (arr.length < 3) return true;
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + arr[i - 2]) return false;
  }
  return true;
}
```

⏱️ **Target:** Recognize any sequence type in under 5 seconds. Write generator in under 60 seconds. Rehearse 3x.

---

### Drill 6: Debounce
> *Top interview question across all companies. If they ask one JS coding Q, it's this.*

**Think:** Return a function that waits N ms of inactivity before firing. Each call resets the timer.

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**Why `fn.apply(this, args)`?** — Preserves `this` context and passes all arguments through.

⏱️ **Target:** Write debounce from memory in under 45 seconds. Rehearse 5x. This WILL be asked.

---

### Drill 7: Flatten Nested Array
> *Common disguised question*

```javascript
// Built-in (know this exists)
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// From scratch (they ask you to implement it)
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}
```

⏱️ **Target:** Both versions in under 60 seconds. Rehearse 2x.

---

## PART 2: React Build Patterns That Keep Failing You

---

### Drill 8: The Universal React Build Framework
> *Failed at: Wipro (todo), UST (todo), Infosys (file explorer), Socure (nested box)*

**Every React build task in an interview is 3 steps. ALWAYS start here:**

```
Step 1: STATE — What data do I hold? What shape?
Step 2: RENDER — How do I display the state? What JSX?
Step 3: HANDLERS — What actions change the state? What events trigger them?
```

**Apply this to ANY task they throw at you:**

| Task | State | Render | Handlers |
|------|-------|--------|----------|
| **Todo list** | `todos` array of `{id, text, done}` | `.map()` over todos, render each with checkbox + text | `addTodo`, `toggleTodo`, `deleteTodo` |
| **File explorer** | `tree` of `{name, children?}` | Recursive component, folder = expandable, file = leaf | `toggleExpand` |
| **Nested color boxes** | `boxes` array of `{id, color}` | `.map()` with nested positioning (absolute or margin) | `addBox`, maybe `removeBox` |
| **List with CRUD** | `items` array | `.map()` with edit/delete buttons | `add`, `edit`, `delete`, `update` |
| **Autocomplete** | `query` string + `results` array + `isOpen` bool | Input + dropdown list, highlight match | `onChange` → debounced fetch → set results |

**When they say "build X" — DON'T start coding immediately.**
Say: "Let me think about the state shape first." Then write the state, then the render, then the handlers. This alone stops the freeze.

---

### Drill 9: Todo App — Type Until Automatic
> *Failed at: Wipro, UST. You need to build this in your sleep.*

```jsx
import { useState } from "react";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.done ? "line-through" : "none" }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Rehearsal method:**
1. Type it once looking at this
2. Close this file, type it from memory — it's OK to get stuck, check, continue
3. Close again, type it fully from memory
4. Target: under 10 minutes without looking

⏱️ **Target:** Under 10 minutes from blank file. Rehearse until automatic.

---

### Drill 10: File Explorer (Recursive Component)
> *Failed at: Infosys*

**The pattern:** A component that renders itself for nested children.

```jsx
const data = [
  { name: "src", children: [
    { name: "components", children: [
      { name: "App.jsx" },
      { name: "Header.jsx" },
    ]},
    { name: "index.js" },
  ]},
  { name: "package.json" },
];

function FileNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!node.children;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <span onClick={() => isFolder && setIsOpen(!isOpen)}>
        {isFolder ? (isOpen ? "📂" : "📁") : "📄"} {node.name}
      </span>
      {isOpen && node.children?.map((child, i) => (
        <FileNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function FileExplorer() {
  return data.map((node, i) => <FileNode key={i} node={node} />);
}
```

**Key insight:** The "hard" part is just: a component that conditionally renders itself. Once you see it as `<FileNode>` rendering more `<FileNode>`s, it clicks.

⏱️ **Target:** Under 8 minutes from blank file. Rehearse 3x.

---

### Drill 11: Nested Color Boxes (Recursive — Peel Off Pattern)
> *Failed at: Socure*

**The pattern:** Each box CONTAINS the next box as a child. Recursion — peel off the first color, render a box, recurse with the remaining colors.

```jsx
function NestedBox({ colors }) {
  if (colors.length === 0) return null;

  const [first, ...rest] = colors;

  return (
    <div
      style={{
        backgroundColor: first,
        padding: 20,
        border: "2px solid black",
      }}
    >
      <NestedBox colors={rest} />
    </div>
  );
}

function App() {
  return <NestedBox colors={["red", "blue", "green", "yellow", "purple"]} />;
}
```

**Key insight:** This is the same recursive pattern as the file explorer — a component that renders itself with a smaller input. Base case: empty array → return null. Recursive case: render one box, pass the rest down.

**Why recursion, not `.map()`:** The boxes are nested INSIDE each other (parent → child), not siblings. `.map()` creates siblings. Recursion creates depth.

If they want it interactive (click to add): wrap colors in `useState`, push to the array.

⏱️ **Target:** Under 5 minutes from blank file. Rehearse 2x.

---

## PART 3: The "What Will This Output?" Drills

> These are the questions where you panic because you try to answer too fast. SLOW DOWN. Trace line by line.

---

### Drill 12: `this` Keyword Output Traps

**Before answering, ask:** "How is this function CALLED? Arrow or regular?"

```javascript
// Trap 1: method extracted to variable
const obj = { name: "Tijo", greet() { console.log(this.name); } };
const fn = obj.greet;
fn();           // undefined (lost context — standalone call)
obj.greet();    // "Tijo" (method call — this = obj)

// Trap 2: setTimeout with regular vs arrow
const user = {
  name: "Tijo",
  delayedGreet() {
    setTimeout(function() { console.log(this.name); }, 0);  // undefined
    setTimeout(() => { console.log(this.name); }, 0);       // "Tijo"
  },
};
// Regular function in setTimeout: this = global (not user)
// Arrow function: this = inherited from delayedGreet (which is user)

// Trap 3: nested arrow
const a = {
  name: "A",
  getGreeter() {
    return () => () => console.log(this.name);
  },
};
a.getGreeter()()(); // "A" — both arrows inherit from getGreeter's this
```

---

### Drill 13: Event Loop Output Prediction

**Framework:** Separate into 3 columns: sync | microtask | macrotask. Execute in that order.

```javascript
// Predict before reading the answer:
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => {
  console.log("5");
  setTimeout(() => console.log("6"), 0);
});
console.log("7");

// Trace:
// Sync: "1", "7"
// Microtasks: "3", "5" (and "5" schedules setTimeout → "6" goes to macrotask queue)
// Macrotasks: "2", "4", "6" (in order)
// Final: 1, 7, 3, 5, 2, 4, 6
```

---

### Drill 14: Closure Traps

```javascript
// Classic: var in loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 3, 3, 3 (var is function-scoped, all closures share same i)
// Fix: use let (block-scoped — each iteration gets its own i)

// Closure over reference, not value
let x = 1;
const getX = () => x;
x = 2;
console.log(getX()); // 2 (closure captured the variable, not the value)
```

---

## PART 4: Redux Flow — Talk-Through Script

> *JD explicitly requires Redux/Flux. Rehearse this explanation out loud.*

### Say this out loud until it's natural:

> "Redux has a one-way data flow. The **view** dispatches an **action** — a plain object with a `type` and optional `payload`. The action goes through **middleware** (like thunk for async, logger for debugging). Then it reaches the **reducer** — a pure function that takes current state + action and returns new state. The **store** holds this state. Components **subscribe** to the store using selectors. When the state they select changes, they re-render."

### When they ask "When would you NOT use Redux?"

> "I wouldn't use Redux when: (1) The state is only needed by one or two components — just use local useState. (2) The state is server data — I'd use TanStack Query or RTK Query instead of manually caching API responses in Redux. (3) The app is small — Context or Zustand is simpler. Redux shines when you have complex client-side state shared across many components with predictable update patterns."

---

## PART 5: Quick-Fire Answers (Rehearse Out Loud)

> *For each one, say your answer out loud in under 60 seconds. If you ramble, shorten it.*

| Question | Your 30-Second Answer Script |
|----------|------------------------------|
| "What is Virtual DOM?" | "A lightweight JS copy of the real DOM. When state changes, React creates a new virtual tree, diffs it against the old one (reconciliation), and applies only the minimal DOM mutations needed. This is faster than directly manipulating the DOM." |
| "Why are keys important?" | "Keys help React identify which list items changed, were added, or removed during reconciliation. Without stable keys, React falls back to index-based comparison which causes state mismatches on reorder and unnecessary re-renders." |
| "Controlled vs uncontrolled?" | "Controlled: React owns the value via useState, updated through onChange. Uncontrolled: DOM owns the value, you read it via ref when needed. Controlled gives you validation on every keystroke. Uncontrolled is simpler for basic forms." |
| "SSR vs SSG vs ISR?" | "SSG: HTML built at build time, fastest, for content that rarely changes. SSR: HTML built per request, for personalized/dynamic content. ISR: SSG but revalidates after a time period — best of both worlds for content that changes periodically." |
| "interface vs type?" | "Interface supports declaration merging and extends — good for public API contracts. Type supports unions, intersections, mapped types — good for complex compositions. I default to type unless I need merging." |
| "How do you prevent XSS?" | "React auto-escapes JSX output. Never use dangerouslySetInnerHTML with user input. Sanitize server-side. Use Content-Security-Policy headers. Store tokens in httpOnly cookies, not localStorage." |
| "What is a closure?" | "A function that remembers variables from the scope where it was created, even after that scope finishes. Used for data privacy, factory functions, and callbacks that need to hold state." |
| "useMemo vs useCallback vs React.memo?" | "React.memo wraps a component — skips re-render if props haven't changed. useMemo memoizes a computed value. useCallback memoizes a function reference. They work together: memo on the child, useCallback on the function you pass to it." |

---

## 📋 Daily Rehearsal Checklist

### Before Each Practice Session:
- [ ] Open a blank file in your editor
- [ ] Set a timer
- [ ] Write from memory — check only when stuck

### Day 1 Focus: Drills 1–7 (JS patterns)
- [ ] Frequency count — 3 reps
- [ ] Dedup — 3 reps
- [ ] GroupBy — 3 reps
- [ ] Array.from — 3 reps
- [ ] Fibonacci — 3 reps
- [ ] Debounce — 5 reps (this WILL be asked)
- [ ] Flatten — 2 reps

### Day 2 Focus: Drills 8–11 (React builds) + Drills 12–14 (output prediction)
- [ ] Todo app from scratch — 3 reps (target: under 10 min)
- [ ] File explorer from scratch — 2 reps
- [ ] Nested boxes — 2 reps
- [ ] `this` output traps — predict 5 snippets
- [ ] Event loop output — predict 3 snippets

### Day 3 Focus: Part 4–5 (Redux talk-through + Quick-fire answers)
- [ ] Redux flow explanation — say out loud 3 times
- [ ] Quick-fire answers — say each one out loud, under 60 seconds
- [ ] Any drill from Day 1–2 that felt shaky — 2 more reps

### Day 4 Focus: Full mock
- [ ] Random drill from Part 1 (timed)
- [ ] Random build from Part 2 (timed)
- [ ] 5 quick-fire questions out loud (timed)
- [ ] One full "interview simulation" — someone asks you questions or you record yourself
