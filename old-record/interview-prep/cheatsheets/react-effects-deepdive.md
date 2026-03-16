# ⚛️ Deep Dive — Effects, Layout, Transitions, Imperative Handle

> Every "effect" hook, when to use it, and real-world examples.

---

## The Timeline — When Each Hook Runs

```
User clicks button
       │
       ▼
┌─────────────────────┐
│  React renders       │ ← useState, useMemo, useRef run here
│  (builds virtual DOM)│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  DOM mutations       │ ← React applies changes to real DOM
│  (commit phase)      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  useLayoutEffect     │ ← BEFORE browser paints (sync, blocks paint)
│  runs here           │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Browser paints      │ ← User sees the update on screen
│  pixels on screen    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  useEffect           │ ← AFTER paint (async, non-blocking)
│  runs here           │
└──────────┘
```

---

## 1. useEffect — The Default Side Effect Hook

### What it does
Runs AFTER the browser paints. Non-blocking. Async.

### When to use
- Data fetching
- Subscriptions (WebSocket, event listeners)
- Logging / analytics
- Syncing with external systems
- **90% of your side effects go here**

### Real World
```jsx
// Data fetching
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort(); // cleanup on unmount or userId change
  }, [userId]);

  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;
}

// Event listener
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return size;
}

// Timer
useEffect(() => {
  const id = setInterval(() => setCount(prev => prev + 1), 1000);
  return () => clearInterval(id); // cleanup prevents memory leak
}, []);
```

### Dependency Array Rules
```jsx
useEffect(() => { ... });          // runs every render (usually a bug)
useEffect(() => { ... }, []);      // runs once on mount
useEffect(() => { ... }, [a, b]);  // runs when a or b changes

// React compares deps with Object.is
// Objects/arrays = new reference every render = runs every time
// Fix: useMemo the dependency or restructure
```

### Cleanup — When it runs
```
1. Component unmounts → cleanup runs
2. Deps change → cleanup of PREVIOUS effect runs, then new effect runs

Mount:     effect()
Re-render: cleanup() → effect()   (if deps changed)
Unmount:   cleanup()
```

### Interview one-liner
> "useEffect runs after paint — it's for side effects that don't need to block the screen: fetching, subscriptions, timers. Always clean up to prevent leaks."

---

## 2. useLayoutEffect — Before the User Sees Anything

### What it does
Same as useEffect but runs BEFORE browser paints. Synchronous. Blocks paint.

### When to use
- **Measuring DOM elements** (getBoundingClientRect)
- **Preventing visual flicker** (position something before user sees it)
- **Scroll position** restoration
- **Only when useEffect causes a visible glitch**

### Real World — Tooltip positioning (the classic example)
```jsx
// ❌ useEffect — tooltip briefly appears at (0,0) then jumps
function Tooltip({ anchorRef, children }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left });
  }, []);
  // FLICKER! User sees tooltip at (0,0) then it jumps

  return <div ref={tooltipRef} style={{ position: "fixed", ...pos }}>{children}</div>;
}

// ✅ useLayoutEffect — measures BEFORE paint, no flicker
function Tooltip({ anchorRef, children }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left });
  }, []);
  // No flicker — position is set before browser paints

  return <div ref={tooltipRef} style={{ position: "fixed", ...pos }}>{children}</div>;
}
```

### Real World — Auto-scroll to bottom
```jsx
function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // scroll before user sees the new layout

  return (
    <div>
      {messages.map(m => <p key={m.id}>{m.text}</p>)}
      <div ref={bottomRef} />
    </div>
  );
}
```

### Real World — Measure element height
```jsx
function AutoHeight({ children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setHeight(ref.current.getBoundingClientRect().height);
  }, [children]);

  return (
    <>
      <div ref={ref}>{children}</div>
      <p>Content height: {height}px</p>
    </>
  );
}
```

### Interview one-liner
> "useLayoutEffect runs after DOM mutations but before paint — synchronous and blocking. I use it only when useEffect causes a visible flicker, like measuring DOM for positioning. Default to useEffect for everything else."

---

## 3. useTransition — Non-Urgent State Updates

### What it does
Marks a state update as "low priority" so React can keep the UI responsive during expensive renders. Part of React 18 concurrent features.

### When to use
- **Filtering/searching large lists** while keeping input responsive
- **Tab switching** with heavy content
- **Any update where the input must stay responsive** but the result can lag

### Real World — Filtering a huge list
```jsx
function SearchList({ items }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // HIGH priority — input stays responsive

    startTransition(() => {
      // LOW priority — can be interrupted if user keeps typing
      setFiltered(items.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Updating...</p>}
      <ul>
        {filtered.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </>
  );
}
```

### Real World — Tab switching
```jsx
function Tabs() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  const switchTab = (newTab) => {
    startTransition(() => {
      setTab(newTab); // heavy tab content renders without blocking UI
    });
  };

  return (
    <>
      <button onClick={() => switchTab("home")}>Home</button>
      <button onClick={() => switchTab("analytics")}>Analytics</button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === "home" ? <Home /> : <AnalyticsDashboard />}
      </div>
    </>
  );
}
```

### useTransition vs useDeferredValue
```jsx
// useTransition — YOU control which setState is low priority
const [isPending, startTransition] = useTransition();
startTransition(() => setFiltered(newData));

// useDeferredValue — wraps a VALUE, React defers its update
const deferredQuery = useDeferredValue(query);
// deferredQuery lags behind query during heavy renders
// Useful when you don't control the state setter (e.g., prop from parent)

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery updates later, keeps parent responsive
  const results = expensiveFilter(items, deferredQuery);
  return <ul>{results.map(...)}</ul>;
}
```

### Interview one-liner
> "useTransition marks state updates as non-urgent — React keeps the UI responsive for high-priority updates like typing while deferring expensive renders. I use it for search/filter on large datasets. useDeferredValue is similar but wraps a value instead of a setter."

---

## 4. useImperativeHandle — Expose Custom Methods via Ref

### What it does
Customizes what a parent gets when it accesses a child's ref. Instead of exposing the full DOM node, you expose only specific methods.

### When to use
- **Custom form components** — expose `.focus()`, `.reset()`, `.validate()`
- **Video players** — expose `.play()`, `.pause()`, `.seek()`
- **Any child that needs to expose actions to parent**
- Encapsulation — hide internal DOM, expose clean API

### Real World — Custom Input with focus/reset
```tsx
// Child component
const FancyInput = forwardRef<{ focus: () => void; reset: () => void }, Props>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      reset() {
        setValue("");
        inputRef.current?.focus();
      },
      // Parent CANNOT access inputRef.current directly
      // Only focus() and reset() are exposed
    }), []);

    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  }
);

// Parent
function Form() {
  const inputRef = useRef<{ focus: () => void; reset: () => void }>(null);

  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.reset()}>Reset</button>
    </>
  );
}
```

### React 19 — No forwardRef needed
```tsx
function FancyInput({ ref }: { ref?: React.Ref<{ focus: () => void }> }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }), []);

  return <input ref={inputRef} />;
}
```

### Real World — Video Player
```tsx
const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
    getCurrentTime: () => videoRef.current?.currentTime ?? 0,
  }), []);

  return <video ref={videoRef} src={props.src} />;
});

// Parent controls video without touching the DOM node:
const playerRef = useRef(null);
playerRef.current?.play();
playerRef.current?.seek(30);
```

### Interview one-liner
> "useImperativeHandle lets a child component expose a custom API through its ref instead of the raw DOM node. I use it for reusable form inputs, media players — anywhere a parent needs to trigger child actions without prop drilling callbacks."

---

## 5. useInsertionEffect — CSS-in-JS Libraries Only

### What it does
Runs BEFORE `useLayoutEffect`, BEFORE DOM mutations. For injecting `<style>` tags.

### When to use
- **You're building a CSS-in-JS library** (styled-components, Emotion)
- **You are NOT building a CSS-in-JS library? Don't use this.**

```jsx
// Library code — not application code
useInsertionEffect(() => {
  const style = document.createElement("style");
  style.textContent = `.my-class { color: red; }`;
  document.head.appendChild(style);
  return () => style.remove();
}, []);
```

### Interview one-liner
> "useInsertionEffect is for CSS-in-JS library authors to inject styles before layout effects read the DOM. I've never needed it in application code."

---

## Complete Comparison Table

| Hook | When it runs | Blocks paint? | Use case |
|------|-------------|---------------|----------|
| `useEffect` | After paint | No | Data fetching, subscriptions, timers, 90% of effects |
| `useLayoutEffect` | After DOM commit, before paint | **Yes** | DOM measurement, prevent flicker |
| `useInsertionEffect` | Before DOM commit | **Yes** | CSS-in-JS style injection (library authors only) |
| `useTransition` | During render | No | Mark state update as low priority |
| `useDeferredValue` | During render | No | Defer a value update (when you don't own the setter) |
| `useImperativeHandle` | During commit | No | Expose custom ref API from child to parent |

---

## Decision Flowchart

```
Need a side effect?
├── Does it touch the DOM and cause flicker?
│   ├── Yes → useLayoutEffect
│   └── No → useEffect
│
├── Is a state update making the UI janky?
│   ├── You control the setter → useTransition
│   └── It's a prop/value → useDeferredValue
│
├── Need parent to call methods on child?
│   └── useImperativeHandle + forwardRef
│
└── Building a CSS-in-JS library?
    └── useInsertionEffect (probably not)
```

---

## Output Prediction Questions

### Q1: Order of execution?
```jsx
function App() {
  useEffect(() => console.log("useEffect"));
  useLayoutEffect(() => console.log("useLayoutEffect"));
  console.log("render");

  return <div>Hello</div>;
}
// Output:
// "render"
// "useLayoutEffect"
// "useEffect"
```

### Q2: Will there be a flicker?
```jsx
function Box() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  return <div ref={ref} style={{ border: `${width}px solid red` }}>Box</div>;
}
// YES — briefly renders with 0px border, then jumps to actual width.
// Fix: useLayoutEffect
```

### Q3: What happens?
```jsx
function Search({ items }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value);  // ← BUG!
    });
  };

  return <input value={query} onChange={handleChange} />;
}
// BUG: Input feels laggy — the typing itself is deferred!
// Fix: setQuery(e.target.value) should be HIGH priority (outside transition)
// Only the expensive filtering should be inside startTransition
```

---

## Verbal Drill — 60 Seconds Each

1. "What's the difference between useEffect and useLayoutEffect?"
2. "When would you use useTransition?"
3. "What does useImperativeHandle do? Give an example."
4. "Explain the useEffect cleanup function — when does it run?"
5. "useTransition vs useDeferredValue — when do you pick each?"
6. "What order do render, useLayoutEffect, and useEffect run in?"
