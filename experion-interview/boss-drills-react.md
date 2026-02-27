# 🔥 Boss Level React Drills — Reddit's Most Failed Interview Questions

> **Source:** r/reactjs, r/Frontend, r/ExperiencedDevs + trending 2025-2026 senior interview patterns
> **Method:** Read solution → close file → type from memory → run → repeat
> **Levels:** 🟢 Tier 1 (WILL ask) → 🟡 Tier 2 (MIGHT ask) → 🔴 Tier 3 (Round 2 depth)

---

# 🟢 TIER 1 — They WILL Ask These

---

## T1-1: Build Autocomplete / Search with Debounce

> *Reddit: "Build an autocomplete" is the new "build a todo". If you can't do this, you're out.*

```jsx
import { useState, useEffect, useRef } from 'react';

function Autocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Debounce: clear previous timer, set new one
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(true);
      fetch(`https://api.example.com/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((item, i) => (
          <li key={item.id || i}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**What they're testing:**
- Debouncing user input (don't fire API on every keystroke)
- Cleanup on unmount / re-render
- Loading state
- Handling empty query

⏱️ Target: < 8 minutes from scratch

---

## T1-2: Implement `useDebounce` Custom Hook

> *"Implement a custom hook" — tests if you understand hooks composition*

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on value/delay change
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch results only when debounced value updates
      fetch(`/api/search?q=${debouncedQuery}`)
        .then(res => res.json())
        .then(setResults);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

⏱️ Target: < 3 minutes from memory

---

## T1-3: Stale Closure Bug — Predict Output + Fix

> *Reddit: "Why does console.log show the old value right after setState?" — trips up everyone*

**The Bug:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // Still 0! Stale closure
  }

  return <button onClick={handleClick}>Count: {count}</button>;
  // After click: count = 1 (NOT 3!)
}
```

**Why:** All 3 `setCount` calls see the SAME `count` (0) from the closure. React batches them → last one wins → `0 + 1 = 1`.

**The Fix — functional updater:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(prev => prev + 1); // 0 → 1
    setCount(prev => prev + 1); // 1 → 2
    setCount(prev => prev + 1); // 2 → 3
  }

  return <button onClick={handleClick}>Count: {count}</button>;
  // After click: count = 3 ✅
}
```

**Say this in interview:**
> "setState is asynchronous and uses the value from the current closure. When you need to update based on previous state, always use the functional form `setState(prev => ...)` — this ensures each update sees the latest state, not the stale closure value."

---

## T1-4: Why Does This Component Re-render Infinitely? (Debug)

> *Reddit: "What causes an infinite re-render loop and how do you debug it?"*

**The Bug:**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 🔴 INFINITE LOOP — no dependency array!
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data)); // setUser triggers re-render → useEffect runs again → loop
  });

  return <div>{user?.name}</div>;
}
```

**Fix 1 — add dependency array:**
```jsx
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data));
}, [userId]); // ✅ Only runs when userId changes
```

**Another common infinite loop — object/array in deps:**
```jsx
function App() {
  const [data, setData] = useState([]);

  // 🔴 INFINITE — { method: 'GET' } is a new object every render
  useEffect(() => {
    fetch('/api/data', { method: 'GET' })
      .then(res => res.json())
      .then(setData);
  }, [{ method: 'GET' }]); // New reference every time!

  return <div>{data.length}</div>;
}
```

**Another common loop — setting state unconditionally in useEffect:**
```jsx
function App() {
  const [count, setCount] = useState(0);

  // 🔴 INFINITE — setCount triggers re-render → effect runs → setCount again
  useEffect(() => {
    setCount(count + 1);
  }, [count]);

  return <div>{count}</div>;
}
```

**Say this in interview:**
> "Common causes of infinite re-renders: missing dependency array in useEffect, objects/arrays as dependencies that create new references each render, or unconditionally setting state inside an effect that depends on that state. I'd debug by adding a console.log inside the effect and checking React DevTools Profiler to see which component re-renders and why."

---

## T1-5: `useMemo` vs `useCallback` vs `React.memo` — When Each Helps

> *"When do you use each? When does it HURT?" — separates mids from seniors*

**The Setup (no optimization):**
```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 🔴 Created new on every render — ExpensiveChild always re-renders
  const data = { count };
  const handleClick = () => console.log('clicked');

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ExpensiveChild data={data} onClick={handleClick} />
    </>
  );
}

const ExpensiveChild = React.memo(({ data, onClick }) => {
  console.log('ExpensiveChild rendered');
  return <div onClick={onClick}>{data.count}</div>;
});
```

**Problem:** Typing in the input re-renders Parent → creates new `data` object + new `handleClick` function → `React.memo` sees new references → ExpensiveChild re-renders for nothing.

**The Fix:**
```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ✅ useMemo: memoize the OBJECT so reference stays stable
  const data = useMemo(() => ({ count }), [count]);

  // ✅ useCallback: memoize the FUNCTION so reference stays stable
  const handleClick = useCallback(() => console.log('clicked'), []);

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ExpensiveChild data={data} onClick={handleClick} />
    </>
  );
}
```

**Cheat sheet:**
```
React.memo    → Wraps a COMPONENT. Skips re-render if props haven't changed (shallow compare)
useMemo       → Memoizes a VALUE (object, array, computed result). Returns the cached value.
useCallback   → Memoizes a FUNCTION reference. Returns the same function between renders.

They work TOGETHER:
  React.memo on the child = "don't re-render if props are same"
  useMemo/useCallback in parent = "make sure the props ARE actually the same"

Without React.memo on the child, useMemo/useCallback in the parent are USELESS.

When NOT to use:
  → Don't wrap every component in React.memo — adds comparison overhead
  → Don't useMemo cheap calculations (string concat, simple math)
  → Profile first, optimize second
```

---

## T1-6: Implement `useState` from Scratch (Simplified)

> *Reddit: "I was asked to implement React.useState. Couldn't do it. Interview ended."*

```javascript
// Simplified useState — shows you understand the concept
let states = [];
let stateIndex = 0;

function useState(initialValue) {
  const currentIndex = stateIndex;

  // Initialize if first render
  if (states[currentIndex] === undefined) {
    states[currentIndex] = initialValue;
  }

  const setState = (newValue) => {
    if (typeof newValue === 'function') {
      states[currentIndex] = newValue(states[currentIndex]); // Functional updater
    } else {
      states[currentIndex] = newValue;
    }
    render(); // Trigger re-render
  };

  stateIndex++;
  return [states[currentIndex], setState];
}

function render() {
  stateIndex = 0; // Reset index before re-render
  App();          // Call component again
}

// Why hooks must be called in the same order:
// React uses the CALL ORDER (stateIndex) to map each useState to its value.
// If you put a hook inside an if-statement, the index shifts and everything breaks.
```

**Say this in interview:**
> "React stores hook values in an array, using call order as the index. That's why hooks must be called at the top level in the same order every render — if you skip a hook conditionally, all subsequent hooks get the wrong index. useState returns the current value and a setter that updates the stored value and triggers a re-render."

⏱️ Target: < 3 minutes from memory

---

# 🟡 TIER 2 — They MIGHT Ask These

---

## T2-1: Build `useLocalStorage` Custom Hook

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Theme: {theme}
    </button>
  );
}
```

**Key points:**
- Lazy initializer `useState(() => ...)` — only reads localStorage once
- Syncs to localStorage on every change via useEffect
- Handles JSON parse/stringify
- Handles errors (localStorage full, SSR where localStorage doesn't exist)

⏱️ Target: < 4 minutes from memory

---

## T2-2: Build `usePrevious` Custom Hook

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current; // Returns previous value (before useEffect updates it)
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

**Why it works:** useRef persists across renders. useEffect runs AFTER render. So during render, `ref.current` still holds the old value. After render, useEffect updates it to the new value.

⏱️ Target: < 2 minutes from memory

---

## T2-3: Build `useFetch` Custom Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // Prevent state update on unmounted component
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; }; // Cleanup
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{user.name}</h1>;
}
```

**Key points:**
- `cancelled` flag prevents setting state after unmount (memory leak prevention)
- Returns `{ data, loading, error }` — the 3 states of any async operation
- Re-fetches when `url` changes

⏱️ Target: < 5 minutes from memory

---

## T2-4: Context Performance Trap — Why Does Everything Re-render?

> *"How do you optimize context performance?" — Round 2 question*

**The Problem:**
```jsx
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Alice' });
  const [theme, setTheme] = useState('light');

  // 🔴 New object every render → ALL consumers re-render
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// ThemeToggle only uses theme, but re-renders when user changes too!
function ThemeToggle() {
  const { theme, setTheme } = useContext(AppContext);
  console.log('ThemeToggle rendered'); // Fires on EVERY context change
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
```

**Fix 1 — Split contexts:**
```jsx
const UserContext = React.createContext();
const ThemeContext = React.createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Alice' });
  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// ✅ Only re-renders when theme changes
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
```

**Fix 2 — Memoize the context value:**
```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Alice' });
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({ user, setUser, theme, setTheme }), [user, theme]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

**Say this in interview:**
> "Context re-renders ALL consumers when the value changes — even if a consumer only uses part of the value. The fix is either splitting into separate contexts so each consumer only subscribes to what it needs, or memoizing the context value. For large apps with frequent updates, I'd use Zustand or Jotai instead of Context — they have built-in selector support that prevents unnecessary re-renders."

---

## T2-5: Error Boundary (Class Component — The One Class You Must Know)

> *"This is the ONLY class component you still need to know in 2026"*

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught:', error, errorInfo);
    // logToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage — wrap per widget, not globally
function App() {
  return (
    <div>
      <ErrorBoundary fallback={<p>Dashboard widget failed</p>}>
        <DashboardWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Sidebar failed</p>}>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}
```

**What Error Boundaries DON'T catch:**
- Event handlers (use try/catch)
- Async code (promises, setTimeout)
- SSR
- Errors in the error boundary itself

⏱️ Target: < 4 minutes from memory

---

# 🔴 TIER 3 — Round 2 Depth / Architecture

---

## T3-1: Build a Multi-Step Form Wizard with State

> *"How would you build a multi-step form?" — architecture + state management*

```jsx
function useFormWizard(steps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const next = () => setCurrentStep(i => Math.min(i + 1, steps.length - 1));
  const back = () => setCurrentStep(i => Math.max(i - 1, 0));
  const goTo = (step) => setCurrentStep(step);

  return {
    currentStep,
    step: steps[currentStep],
    formData,
    updateFields,
    next,
    back,
    goTo,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
  };
}

// Step Components
function PersonalInfo({ data, updateFields }) {
  return (
    <>
      <input
        value={data.name || ''}
        onChange={e => updateFields({ name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={data.email || ''}
        onChange={e => updateFields({ email: e.target.value })}
        placeholder="Email"
      />
    </>
  );
}

function Address({ data, updateFields }) {
  return (
    <input
      value={data.city || ''}
      onChange={e => updateFields({ city: e.target.value })}
      placeholder="City"
    />
  );
}

function Review({ data }) {
  return (
    <div>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
      <p>City: {data.city}</p>
    </div>
  );
}

// Wizard Component
function FormWizard() {
  const steps = [PersonalInfo, Address, Review];
  const { currentStep, formData, updateFields, next, back, isFirst, isLast } =
    useFormWizard(steps);

  const StepComponent = steps[currentStep];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLast) {
      console.log('Submit:', formData);
    } else {
      next();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Step {currentStep + 1} of {steps.length}</p>
      <StepComponent data={formData} updateFields={updateFields} />
      <div>
        {!isFirst && <button type="button" onClick={back}>Back</button>}
        <button type="submit">{isLast ? 'Submit' : 'Next'}</button>
      </div>
    </form>
  );
}
```

---

## T3-2: Implement Infinite Scroll with Intersection Observer

```jsx
function useInfiniteScroll(fetchMore) {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [fetchMore]);

  return sentinelRef;
}

// Usage
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    fetch(`/api/items?page=${page}&limit=20`)
      .then(res => res.json())
      .then(data => {
        setItems(prev => [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setPage(p => p + 1);
        setLoading(false);
      });
  }, [page, loading, hasMore]);

  const sentinelRef = useInfiniteScroll(fetchMore);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      {loading && <p>Loading...</p>}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  );
}
```

---

## T3-3: Performance Debugging — "The App Freezes When User Types"

> *"Walk me through your debugging process step by step"*

**Say this in interview (step by step):**

```
Step 1: REPRODUCE
  → Open the app, type in the search box, observe the freeze

Step 2: PROFILE
  → Open React DevTools → Profiler tab → Record → Type → Stop
  → Look at the flame graph: which component takes the longest?
  → Look at "Why did this render?" — what changed?

Step 3: IDENTIFY THE BOTTLENECK
  Common causes:
  a) Re-rendering a huge list on every keystroke
     → Fix: debounce the input, virtualize the list (react-window)
  b) Expensive computation in render
     → Fix: useMemo to cache the computed value
  c) Parent re-renders causing all children to re-render
     → Fix: React.memo on children, useCallback for handlers
  d) Uncontrolled re-renders from context
     → Fix: Split context, use selectors (Zustand)

Step 4: FIX (pick based on bottleneck)
  → Debounce input: useDebounce hook (300ms)
  → Virtualize: react-window for long lists
  → Memoize: React.memo + useMemo + useCallback
  → Code split: React.lazy for heavy components not visible yet

Step 5: VERIFY
  → Profile again. Compare flame graphs before/after.
  → Check INP (Interaction to Next Paint) in Lighthouse
```

---

## T3-4: Build a Compound Component Pattern (Tabs)

> *"How would you build a reusable Tabs component?" — tests advanced patterns*

```jsx
const TabsContext = React.createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
      style={{ fontWeight: activeTab === value ? 'bold' : 'normal' }}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach sub-components
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanel = TabPanel;

// Usage — clean, declarative API
function App() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.TabList>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.TabList>

      <Tabs.TabPanel value="profile">Profile content here</Tabs.TabPanel>
      <Tabs.TabPanel value="settings">Settings content here</Tabs.TabPanel>
      <Tabs.TabPanel value="billing">Billing content here</Tabs.TabPanel>
    </Tabs>
  );
}
```

**Why this pattern matters:**
- Components share state via Context without prop drilling
- Clean, declarative API for consumers
- Each piece is independently testable
- Used by Radix UI, Headless UI, Reach UI

---

## T3-5: Output Prediction — React Render Order

> *"What renders, in what order?"*

**Puzzle 1:**
```jsx
function Parent() {
  console.log('Parent render');

  useEffect(() => {
    console.log('Parent effect');
  });

  return <Child />;
}

function Child() {
  console.log('Child render');

  useEffect(() => {
    console.log('Child effect');
  });

  return <div>Hello</div>;
}

// Output:
// Parent render
// Child render
// Child effect    ← effects fire bottom-up!
// Parent effect
```

**Puzzle 2:**
```jsx
function App() {
  const [count, setCount] = useState(0);
  console.log('Render:', count);

  useEffect(() => {
    console.log('Effect:', count);
  }, [count]);

  return (
    <button onClick={() => {
      setCount(1);
      setCount(2);
      setCount(3);
    }}>
      Click
    </button>
  );
}

// Initial:
// Render: 0
// Effect: 0

// After click (React 18 batching):
// Render: 3      ← only ONE re-render, last setState wins
// Effect: 3
```

**Puzzle 3:**
```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('A');
    return () => console.log('B'); // Cleanup
  }, [count]);

  useEffect(() => {
    console.log('C');
  }, []);

  console.log('D');

  // Initial render:   D, A, C
  // After setCount:   D, B, A   (B = cleanup of first effect, then A re-runs)
}
```

---

## Quick-Fire: React Gotchas They Love to Ask

| Gotcha | Answer |
|---|---|
| "Why can't hooks be inside if/for?" | React uses call ORDER (array index) to track hooks. Conditional/loop changes the order → wrong state mapping |
| "forEach vs map in JSX?" | forEach returns undefined → renders nothing. map returns new array → renders elements. Use map. |
| "Why does index as key cause bugs?" | If items reorder/delete, React maps state to wrong elements. Use stable unique IDs. |
| "Why does child re-render when props look the same?" | Parent re-renders → child re-renders by default. Props are new object references each time. Use React.memo to compare. |
| "Controlled vs uncontrolled — when each?" | Controlled (React owns value) for validation, conditional logic, syncing. Uncontrolled (DOM owns value via ref) for simple forms, file inputs, third-party libs. |
| "What is hydration?" | Server sends HTML. React "hydrates" by attaching event listeners to existing HTML without re-creating DOM. Mismatch = hydration error. |
| "useLayoutEffect vs useEffect?" | useLayoutEffect fires synchronously after DOM mutation, before browser paint. Use for DOM measurements, preventing visual flicker. useEffect fires after paint. |
| "startTransition — what is it?" | Marks a state update as non-urgent. React can interrupt it to handle urgent updates (typing) first. Use for expensive re-renders like filtering a large list. |
