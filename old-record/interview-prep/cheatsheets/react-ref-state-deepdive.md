# ⚛️ Deep Dive — useRef vs useState (Tricks, Traps & Interview Gotchas)

---

## The Core Difference

```
useState                              useRef
──────────────────────────────────────────────────
Triggers re-render on change          NEVER triggers re-render
Returns [value, setter]               Returns { current: value }
Value is captured per render          Value is always latest (mutable)
For UI data (what user sees)          For "silent" data (what code needs)
Async — batched updates               Sync — immediate mutation
```

### One-liner
> "`useState` is for data that affects what the user sees. `useRef` is for data that your code needs but the screen doesn't."

---

## useState — Deep Tricks

### TRICK 1: State updates are batched
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);  // count is 0
    setCount(count + 1);  // count is STILL 0 — same render snapshot
    setCount(count + 1);  // count is STILL 0
  };
  // Result: count becomes 1, NOT 3
}
```

### FIX: Use updater function
```jsx
const handleClick = () => {
  setCount(prev => prev + 1);  // 0 → 1
  setCount(prev => prev + 1);  // 1 → 2
  setCount(prev => prev + 1);  // 2 → 3
};
// Result: count becomes 3 ✅
```

### TRAP QUESTION: "What will count be after clicking?"
```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 5);
  setCount(prev => prev + 1);
};
// Answer: 1
// First call schedules count = 0 + 5 = 5
// Second call: prev is 5, so 5 + 1 = 6
// WAIT — actually React batches these:
// setCount(count + 5) → schedules 5 (count is 0 in this closure)
// setCount(prev => prev + 1) → prev is 5 (from previous update), so 6
// Final: 6
```

---

### TRICK 2: Lazy initialization
```jsx
// ❌ Runs expensive function EVERY render (even though only first value is used)
const [data, setData] = useState(expensiveCalculation());

// ✅ Pass a function — React calls it ONLY on first render
const [data, setData] = useState(() => expensiveCalculation());

// Real world: reading from localStorage
const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});
```

---

### TRICK 3: Object/array state — must create new reference
```jsx
// ❌ Mutating existing object — React won't re-render
const [user, setUser] = useState({ name: "Alice", age: 25 });
const handleBirthday = () => {
  user.age += 1;     // mutating directly
  setUser(user);     // same reference — React skips re-render!
};

// ✅ Create new object with spread
const handleBirthday = () => {
  setUser(prev => ({ ...prev, age: prev.age + 1 }));
};

// ❌ Same trap with arrays
const [items, setItems] = useState([1, 2, 3]);
items.push(4);        // mutation!
setItems(items);      // same reference — no re-render

// ✅ Create new array
setItems(prev => [...prev, 4]);
```

---

### TRICK 4: State is a snapshot (stale closure)
```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // ❌ count is ALWAYS 0 — stale closure
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps = captures initial count (0)

  // Fix 1: updater function
  setCount(prev => prev + 1); // ✅ always has latest

  // Fix 2: add count to deps (but creates new interval each time)
  useEffect(() => { ... }, [count]);

  // Fix 3: useRef (see below)
}
```

---

### TRAP QUESTION: "Does setState always cause re-render?"
```jsx
const [count, setCount] = useState(0);

setCount(0); // count is already 0
// Answer: NO re-render. React bails out if new value === old value (Object.is)

// BUT with objects:
const [user, setUser] = useState({ name: "Alice" });
setUser({ name: "Alice" }); // new reference → DOES re-render!
// Even though contents are same, it's a new object (different reference)
```

---

## useRef — Deep Tricks

### TRICK 1: useRef survives re-renders without causing them
```jsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);       // doesn't trigger re-render

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);   // access latest value
  };

  return (
    <>
      <p>{time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

**Why not useState for intervalRef?** Because storing the interval ID in state would trigger a re-render every time you set it — pointless since the user doesn't see the ID.

---

### TRICK 2: Counting renders (common interview question)
```jsx
function RenderCounter() {
  const [name, setName] = useState("");
  const renderCount = useRef(0);

  renderCount.current += 1; // increments every render, no infinite loop

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Renders: {renderCount.current}</p>
    </>
  );
}

// ❌ If you used useState for renderCount:
const [renderCount, setRenderCount] = useState(0);
setRenderCount(prev => prev + 1); // in useEffect
// This causes ANOTHER re-render → infinite loop!
```

---

### TRICK 3: Previous value (interview favorite)
```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;  // updates AFTER render
  }, [value]);

  return ref.current;     // returns OLD value during render
}

// Usage:
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return <p>Now: {count}, Before: {prevCount}</p>;
}
```

**Why this works:** useEffect runs AFTER render. So during render, `ref.current` still holds the old value. After render, it gets updated.

---

### TRICK 4: DOM access
```jsx
function AutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();         // direct DOM access
    inputRef.current.scrollIntoView();
  }, []);

  return <input ref={inputRef} />;
}
```

---

### TRICK 5: Mutable value that doesn't re-render — avoiding stale closures
```jsx
function Chat() {
  const [message, setMessage] = useState("");
  const messageRef = useRef("");

  const handleChange = (e) => {
    setMessage(e.target.value);
    messageRef.current = e.target.value; // keep ref in sync
  };

  const sendDelayed = () => {
    setTimeout(() => {
      // ❌ message is stale (captured at click time)
      console.log("state:", message);

      // ✅ ref always has latest
      console.log("ref:", messageRef.current);
    }, 3000);
  };

  return (
    <>
      <input value={message} onChange={handleChange} />
      <button onClick={sendDelayed}>Send in 3s</button>
    </>
  );
}
```

---

### TRICK 6: forwardRef — passing ref to child components
```tsx
// ❌ Can't pass ref to function components directly
<MyInput ref={inputRef} />  // Error!

// ✅ Use forwardRef
const MyInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// Parent can now access the DOM element:
const inputRef = useRef<HTMLInputElement>(null);
<MyInput ref={inputRef} />
inputRef.current?.focus();
```

### React 19 update: `ref` is now a regular prop — no `forwardRef` needed!
```tsx
// React 19+
function MyInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

---

## useRef vs useState — Decision Table

| Scenario | Use | Why |
|----------|-----|-----|
| Counter displayed on screen | `useState` | User sees it → needs re-render |
| Interval/timeout ID | `useRef` | Code needs it, user doesn't see it |
| Form input value | `useState` | Displayed + controlled |
| Previous value tracking | `useRef` | No re-render needed |
| Render count | `useRef` | useState would cause infinite loop |
| DOM element access | `useRef` | Direct DOM manipulation |
| Debounce timer | `useRef` | Persist between renders, no re-render |
| API abort controller | `useRef` | Cleanup reference, not displayed |
| Animation frame ID | `useRef` | Cancel animation, not displayed |
| Toggle boolean shown in UI | `useState` | User sees the change |

### The rule
> **"Does changing this value need to update what the user SEES?"**
> Yes → `useState`. No → `useRef`.

---

## Interview Output Prediction Questions

### Q1: What renders?
```jsx
function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(0);

  const handleClick = () => {
    setCount(count + 1);
    ref.current += 1;
    console.log("state:", count);     // ?
    console.log("ref:", ref.current); // ?
  };

  return <button onClick={handleClick}>{count}</button>;
}
// Click once:
// console: "state: 0" (stale — state update hasn't applied yet)
// console: "ref: 1"   (immediate — ref is mutable)
// Screen shows: 1     (after re-render)
```

### Q2: Infinite loop?
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);  // triggers re-render → runs effect again → ...
  });
  // YES — infinite loop! No dependency array = runs every render
}
```

### Q3: Will this re-render?
```jsx
function App() {
  const ref = useRef(0);

  const handleClick = () => {
    ref.current += 1;
    console.log(ref.current); // logs increasing number
  };

  return <button onClick={handleClick}>{ref.current}</button>;
}
// Screen ALWAYS shows 0. Click updates ref but no re-render.
// ref.current changes in memory but screen doesn't update.
```

### Q4: What's logged?
```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  useEffect(() => {
    console.log("count:", count);
  });

  return <button onClick={handleClick}>{count}</button>;
}
// Click once:
// console: "count: 3" (batched — all three updaters run, one re-render)
// Screen: 3
```

### Q5: Stale closure trap
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      console.log("count:", count);
    }, 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
    </>
  );
}
// Click + 5 times, wait 3 seconds:
// console: "count: 0" ← stale! Closure captured initial count
// Fix: use ref to track latest, or add count to deps
```

---

## Verbal Drill — Explain in 60 Seconds

1. "What's the difference between useRef and useState?"
2. "When would you use useRef instead of useState?"
3. "What is a stale closure in React and how do you fix it?"
4. "Why does mutating state directly not cause a re-render?"
5. "What is lazy initialization in useState?"
6. "How do you track the previous value of a prop?"
