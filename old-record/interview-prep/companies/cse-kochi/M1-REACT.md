# M1: React Deep Dive

> **Read → Drill → Trap Questions**
> **Time:** 45 min total

---

## SECTION A: Concepts to Explain Out Loud (5 min each)

Practice each one. Say it out loud. Time yourself.

---

### 1. Virtual DOM & Reconciliation

**Explain it:**
> React builds a virtual DOM tree (lightweight JS objects). On state change, it builds a NEW virtual tree → diffs against the old one → computes minimal real DOM updates. O(n) heuristic — same type = update, different type = remount. Keys in lists identify which items changed.

**Drill:** Draw the flow on paper: `setState → new VDOM → diff → patch → real DOM`

---

### 2. React Fiber

**Explain it:**
> Old reconciler (React ≤15) was synchronous — blocked main thread on large trees. Fiber (React 16+) breaks rendering into small units of work. Each fiber node = one unit. Can pause, resume, abort. Linked list, not recursive tree walk. Enables priority scheduling — user input = high priority, data fetch = low. Powers useTransition, useDeferredValue, Suspense.

**One-liner:** "Fiber broke the monolithic render into tiny resumable units so React stays responsive."

**Drill:** Say it in 30 seconds without stumbling.

---

### 3. Hooks — How They Work Internally

**Explain it:**
> Hooks are stored in a linked list on the fiber node. React walks the list in order on every render. That's why hooks can't be in conditions — order must be stable. useState stores [value, setter]. useEffect stores [callback, deps, cleanup].

**Drill:** Explain why this breaks:
```jsx
if (loggedIn) {
  const [name, setName] = useState('');
}
// Answer: If loggedIn changes, hook order shifts. React pairs wrong state with wrong hook.
```

---

### 4. useEffect Deep Dive

**Explain it:**
> Runs side effects AFTER render (paint). Dependency array controls re-run. Cleanup runs before next effect + on unmount. Use for: subscriptions, timers, fetch, DOM mutations. DON'T use for: derived state (use useMemo), event responses (use handlers).

**Drill:** What's wrong here?
```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
// Answer: Infinite loop — effect updates count, which triggers effect again.
```

---

### 5. Component Lifecycle (Hooks Mapping)

**Know this cold:**
```
Mount    → useEffect(() => { ... }, [])
Update   → useEffect(() => { ... }, [dep])
Unmount  → useEffect(() => { return () => cleanup }, [])
Every render → useEffect(() => { ... })   // no deps array
```

---

## SECTION B: 🪤 TRAP QUESTIONS (Output Prediction)

> These are the "gotcha" questions Saudi interviewers LOVE. Practice each one.

---

### TRAP 1: Stale Closure
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // What prints?
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}
```

**What happens?**
> `count` is always 0 inside the interval — stale closure. The effect captured `count = 0` at mount. UI shows 1 and never changes (sets 0+1=1 repeatedly).

**Fix:**
```jsx
setCount(prev => prev + 1); // functional update — no dependency on stale closure
```

---

### TRAP 2: setState is async (batching)
```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // What prints?
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

**What happens?**
> `console.log(count)` prints `0` (state hasn't updated yet — batched).
> After render, count is `1`, NOT `3`. All three calls used the same stale `count = 0`.

**Fix for count = 3:**
```jsx
setCount(prev => prev + 1); // each gets latest value
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

---

### TRAP 3: Key prop reset
```jsx
function App() {
  const [toggle, setToggle] = useState(false);
  return (
    <div>
      <input key={toggle ? 'a' : 'b'} />
      <button onClick={() => setToggle(!toggle)}>Switch</button>
    </div>
  );
}
```

**What happens?**
> Clicking the button clears the input. Different key = React unmounts the old input and mounts a new one. Internal state (typed text) is lost.

**When to use this pattern:**
> Intentionally reset component state without useEffect — change the key.

---

### TRAP 4: useEffect vs useLayoutEffect
```jsx
useEffect(() => {
  element.style.color = 'red';
});

useLayoutEffect(() => {
  element.style.color = 'blue';
});
```

**What color?**
> Blue wins visually. useLayoutEffect runs synchronously BEFORE paint. useEffect runs AFTER paint. So blue is set before the user sees anything, then red overwrites — but both happen so fast you see red. Actually: useLayoutEffect first (before paint), then useEffect (after paint). Final color = red. But user never sees blue flash.

**When to use useLayoutEffect:** Measuring DOM (getBoundingClientRect), preventing visual flicker.

---

### TRAP 5: Object/array in dependency array
```jsx
useEffect(() => {
  fetchData(filters);
}, [filters]); // filters = { page: 1, search: '' }
```

**What happens?**
> Infinite loop! `filters` is a new object reference on every render. `{} !== {}` in JavaScript. useEffect sees "dependency changed" every time.

**Fix:**
```jsx
// Option 1: Memoize
const filters = useMemo(() => ({ page, search }), [page, search]);

// Option 2: Use primitive deps
useEffect(() => {
  fetchData({ page, search });
}, [page, search]);
```

---

### TRAP 6: Rendering vs Committing
```jsx
function App() {
  console.log('render');
  
  useEffect(() => {
    console.log('effect');
  });

  useLayoutEffect(() => {
    console.log('layout effect');
  });

  return <div>Hello</div>;
}
```

**Output order:**
```
render
layout effect
effect
```

> Render phase → Layout effects (sync, before paint) → Paint → Effects (async, after paint)

---

### TRAP 7: useState initializer function
```jsx
const [count, setCount] = useState(expensiveComputation()); // ❌ runs EVERY render
const [count, setCount] = useState(() => expensiveComputation()); // ✅ runs only on mount
```

**Why?** Passing a function = lazy initialization. React calls it only on first render. Passing the result = computed every render, value ignored after first.

---

### TRAP 8: Can you update state during render?
```jsx
function App({ items }) {
  const [sorted, setSorted] = useState([]);
  
  if (items !== sorted) {
    setSorted([...items].sort()); // Is this allowed?
  }
  
  return <List data={sorted} />;
}
```

**Answer:** Yes — this is a valid pattern in React. It's called "adjusting state during render." React will immediately restart the render with the new state. BUT: must have a condition to prevent infinite loops. Better approach: `useMemo`.

---

## SECTION C: Hands-On Drill (15 min)

> Build these from memory. These are the most likely "build X" challenges.

1. **Todo with CRUD + filter** — you've drilled this. Should take 5 min now.
2. **Controlled form with validation** — 3 fields, submit, show errors per field
3. **Fetch + loading + error states** — fetch from JSONPlaceholder, show all 3 states
4. **useReducer todo** — same todo but with reducer pattern

**Your muscle memory patterns:**
```
Add:    [...prev, newItem]
Delete: prev.filter(item => item.id !== id)
Toggle: prev.map(item => item.id === id ? {...item, done: !item.done} : item)
```

---

## ✅ Checklist

- [ ] Can explain Virtual DOM → Fiber → Hooks in 2 minutes
- [ ] Can solve all 8 trap questions without peeking
- [ ] Can build todo CRUD in 5 min from memory
- [ ] Can explain useEffect cleanup, deps, and stale closure fix
- [ ] Can explain useMemo vs useCallback vs React.memo with real example
