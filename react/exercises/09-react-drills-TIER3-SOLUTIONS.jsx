/**
 * ═══════════════════════════════════════════════════════════════════
 * 09 — React Interview Drills — TIER 3 ⭐⭐⭐ INTERVIEW STANDARD
 * ═══════════════════════════════════════════════════════════════════
 * Under 10 min each. These separate MID-LEVEL from SENIOR.
 * 🏖️ Each drill self-contained. Paste into CodeSandbox App.js.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useReducer, createContext, useContext, useMemo, useCallback, memo } from "react";


// ───────────────────────────────────────────────────────────────
// R36 ⭐⭐⭐ | React.memo + useCallback — Performance
// ───────────────────────────────────────────────────────────────
// PROBLEM: Parent re-renders → children re-render even if props same.
// FIX: memo on child + useCallback on handler props.
//
// React.memo → shallow-compares props, skips render if same.
// useCallback → memoizes function REFERENCE so memo works.
// Without useCallback, new function ref every render → memo useless.
//
// 🔥 "useMemo vs useCallback vs React.memo?"
//   memo = memoize COMPONENT (skip render)
//   useCallback = memoize FUNCTION reference
//   useMemo = memoize COMPUTED VALUE
// ───────────────────────────────────────────────────────────────

const ExpensiveChild = memo(function ExpensiveChild({ name, onClick }) {
  console.log(`  ⚡ ExpensiveChild rendered: ${name}`);
  return (
    <div style={{ padding: 8, margin: 4, border: "1px solid #ddd" }}>
      <p>{name}</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

export function R36_MemoDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // ✅ useCallback: same ref across renders → memo works
  const handleClick = useCallback(() => console.log("clicked"), []);

  // ❌ Without useCallback: const handleClick = () => console.log("clicked");
  // New function every render → memo sees different ref → re-renders child

  console.log("Parent rendered");
  return (
    <div>
      <h3>React.memo Demo (open console)</h3>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type — child should NOT re-render" />
      <p>Count: {count} <button onClick={() => setCount(c => c + 1)}>+</button></p>
      <ExpensiveChild name="Memoized Child" onClick={handleClick} />
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R37 ⭐⭐⭐ | Error Boundary
// ───────────────────────────────────────────────────────────────
// MUST be class component — no hook equivalent (React 18).
// getDerivedStateFromError → update state to show fallback
// componentDidCatch → log error (Sentry, analytics)
//
// Error boundaries DON'T catch:
//   - Event handler errors (use try/catch)
//   - Async errors (use .catch())
//   - SSR errors
//   - Errors in the boundary itself
// ───────────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, border: "2px solid red", borderRadius: 8 }}>
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) throw new Error("💥 Crashed!");
  return <button onClick={() => setShouldThrow(true)}>Click to crash</button>;
}

export function R37_ErrorBoundaryDemo() {
  return (
    <ErrorBoundary>
      <h3>Error Boundary Demo</h3>
      <BuggyComponent />
    </ErrorBoundary>
  );
}


// ───────────────────────────────────────────────────────────────
// R38 ⭐⭐⭐ | Context + useReducer = Mini Redux
// ───────────────────────────────────────────────────────────────
// Global state WITHOUT Redux. Context provides state, useReducer manages it.
// "How would you manage global state without Redux?" → THIS.
//
// When is this NOT enough? When you need:
//   - Selective re-rendering (Redux selectors)
//   - Middleware (thunk, saga, logger)
//   - DevTools time-travel debugging
//   - 20+ state slices
// ───────────────────────────────────────────────────────────────

const StoreContext = createContext();
function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be within StoreProvider");
  return ctx;
}

function storeReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM": return { ...state, items: state.items.filter((_, i) => i !== action.payload) };
    case "SET_USER": return { ...state, user: action.payload };
    case "LOGOUT": return { ...state, user: null };
    default: return state;
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, { user: null, items: [] });
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

function UserPanel() {
  const { state, dispatch } = useStore();
  return (
    <div style={{ padding: 12, border: "1px solid #ddd", margin: 8 }}>
      <h4>User Panel</h4>
      {state.user ? (
        <div><p>Welcome, {state.user}!</p>
          <button onClick={() => dispatch({ type: "LOGOUT" })}>Logout</button></div>
      ) : (
        <button onClick={() => dispatch({ type: "SET_USER", payload: "Tijo" })}>Login as Tijo</button>
      )}
    </div>
  );
}

function ItemList() {
  const { state, dispatch } = useStore();
  const [input, setInput] = useState("");
  return (
    <div style={{ padding: 12, border: "1px solid #ddd", margin: 8 }}>
      <h4>Items ({state.items.length})</h4>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => { if (input.trim()) { dispatch({ type: "ADD_ITEM", payload: input.trim() }); setInput(""); } }}>Add</button>
      <ul>{state.items.map((item, i) => (
        <li key={i}>{item} <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: i })}>✕</button></li>
      ))}</ul>
    </div>
  );
}

export function R38_MiniRedux() {
  return <StoreProvider><h3>Mini Redux</h3><UserPanel /><ItemList /></StoreProvider>;
}


// ───────────────────────────────────────────────────────────────
// R39 ⭐⭐⭐ | HOC (Higher-Order Component)
// ───────────────────────────────────────────────────────────────
// Function that takes a component, returns enhanced component.
// withLoading, withAuth, withTheme — wraps rendering logic.
//
// HOC vs Hook:
//   HOC = wrap RENDERING (loading spinner, auth redirect, error boundary)
//   Hook = share STATEFUL LOGIC (useFetch, useAuth, useDebounce)
//   Modern React prefers hooks. HOCs still in legacy + interviews.
// ───────────────────────────────────────────────────────────────

function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...rest }) {
    if (isLoading) return <p>Loading...</p>;
    return <WrappedComponent {...rest} />;
  };
}

function UserCard({ name, email }) {
  return <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}><h3>{name}</h3><p>{email}</p></div>;
}

const UserCardWithLoading = withLoading(UserCard);

export function R39_HOCDemo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); }, []);
  return <UserCardWithLoading isLoading={loading} name="Tijo" email="tijo@example.com" />;
}


// ───────────────────────────────────────────────────────────────
// R40 ⭐⭐⭐ | Compound Components — Accordion
// ───────────────────────────────────────────────────────────────
// Components that work together via shared context.
// Parent manages state, children consume via context.
// API: <Accordion><Accordion.Item index={0}><Accordion.Header>...
//
// The USER controls structure (JSX). The COMPONENT controls behavior.
// Used by: Radix, Headless UI, Reach UI.
// ───────────────────────────────────────────────────────────────

const AccordionCtx = createContext();
const AccItemCtx = createContext();

function Accordion({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggle = i => setActiveIndex(prev => prev === i ? null : i);
  return (
    <AccordionCtx.Provider value={{ activeIndex, toggle }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>{children}</div>
    </AccordionCtx.Provider>
  );
}

Accordion.Item = function AccItem({ index, children }) {
  return <AccItemCtx.Provider value={{ index }}><div style={{ borderBottom: "1px solid #e5e7eb" }}>{children}</div></AccItemCtx.Provider>;
};

Accordion.Header = function AccHeader({ children }) {
  const { activeIndex, toggle } = useContext(AccordionCtx);
  const { index } = useContext(AccItemCtx);
  return (
    <button onClick={() => toggle(index)} style={{
      width: "100%", padding: "12px 16px", textAlign: "left",
      background: "none", border: "none", cursor: "pointer", fontWeight: "bold",
    }}>
      {activeIndex === index ? "▼" : "▶"} {children}
    </button>
  );
};

Accordion.Panel = function AccPanel({ children }) {
  const { activeIndex } = useContext(AccordionCtx);
  const { index } = useContext(AccItemCtx);
  if (activeIndex !== index) return null;
  return <div style={{ padding: "0 16px 16px" }}>{children}</div>;
};

export function R40_CompoundAccordion() {
  return (
    <Accordion>
      <Accordion.Item index={0}>
        <Accordion.Header>What is React?</Accordion.Header>
        <Accordion.Panel>A JS library for building user interfaces.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item index={1}>
        <Accordion.Header>What is JSX?</Accordion.Header>
        <Accordion.Panel>Syntax extension that compiles to createElement calls.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item index={2}>
        <Accordion.Header>What are hooks?</Accordion.Header>
        <Accordion.Panel>Functions for state and lifecycle in function components.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}


// ───────────────────────────────────────────────────────────────
// R41 ⭐⭐⭐ | Render Props Pattern
// ───────────────────────────────────────────────────────────────
// Component that passes data to children via a function prop.
// Child controls HOW to render the data. Parent controls WHAT data.
// Modern alternative: custom hooks. But still asked in interviews.
// ───────────────────────────────────────────────────────────────

function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: 200, border: "1px solid #ddd", position: "relative" }}>
      {children(pos)}
    </div>
  );
}

export function R41_RenderProps() {
  return (
    <div>
      <h3>Move mouse over the box</h3>
      <MouseTracker>
        {({ x, y }) => <p>Mouse: ({x}, {y})</p>}
      </MouseTracker>
      <h4>Same tracker, different render:</h4>
      <MouseTracker>
        {({ x, y }) => (
          <div style={{
            width: 20, height: 20, borderRadius: "50%", backgroundColor: "red",
            position: "absolute", left: x - 10, top: y - 10, pointerEvents: "none",
          }} />
        )}
      </MouseTracker>
    </div>
  );
}

// 🔥 Curveball: "Render props vs Hooks?" → useMousePosition() hook is simpler.
// Render props are for when the CONSUMER needs to control rendering.
// Hooks are for when you just need the DATA.


// ───────────────────────────────────────────────────────────────
// R42 ⭐⭐⭐ | Infinite Scroll
// ───────────────────────────────────────────────────────────────
// Load more items when user scrolls near bottom.
// IntersectionObserver on a sentinel div at the bottom.
//
// KEY INSIGHT: Ref on a "load more" sentinel. When it enters viewport,
// fetch more data. No scroll event listener needed (perf).
// ───────────────────────────────────────────────────────────────

export function R42_InfiniteScroll() {
  const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(prev => {
        const next = Array.from({ length: 10 }, (_, i) => `Item ${prev.length + i + 1}`);
        return [...prev, ...next];
      });
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) loadMore();
    }, { threshold: 1.0 });

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loading, loadMore]);

  return (
    <div style={{ height: 400, overflow: "auto", border: "1px solid #ddd" }}>
      <ul>{items.map(item => <li key={item} style={{ padding: 8 }}>{item}</li>)}</ul>
      <div ref={sentinelRef} style={{ padding: 16, textAlign: "center" }}>
        {loading ? "Loading..." : "Scroll for more"}
      </div>
    </div>
  );
}

// 🔥 Curveball: "Why IntersectionObserver not scroll event?"
// scroll fires on EVERY pixel scrolled → 100s of events/sec → bad perf.
// IntersectionObserver fires ONCE when element enters viewport. No throttle needed.


// ───────────────────────────────────────────────────────────────
// R43 ⭐⭐⭐ | Debounced Search with API (Full Pattern)
// ───────────────────────────────────────────────────────────────
// Combines: controlled input + useDebounce + useFetch + loading/error/data
// This is what a REAL search component looks like.
// ───────────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function R43_DebouncedAPISearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users?q=${debouncedQuery}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        setResults(data.filter(u => u.name.toLowerCase().includes(debouncedQuery.toLowerCase())));
        setLoading(false);
      })
      .catch(err => { if (err.name !== "AbortError") setLoading(false); });
    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div style={{ maxWidth: 400 }}>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users..." style={{ width: "100%", padding: 8 }} />
      {loading && <p>Searching...</p>}
      <ul>{results.map(u => <li key={u.id}>{u.name} — {u.email}</li>)}</ul>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R44 ⭐⭐⭐ | Form with Validation + Submit
// ───────────────────────────────────────────────────────────────
// Real-world form: name, email, password.
// Inline validation on blur + submit validation.
// Disable submit until valid. Show errors per field.
// ───────────────────────────────────────────────────────────────

export function R44_ValidatedForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case "name": return value.trim().length < 2 ? "Name must be at least 2 chars" : "";
      case "email": return !value.includes("@") ? "Must contain @" : "";
      case "password": return value.length < 8 ? "At least 8 characters" : "";
      default: return "";
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(form).forEach(key => { newErrors[key] = validate(key, form[key]); });
    setErrors(newErrors);
    if (Object.values(newErrors).every(e => !e)) {
      setSubmitted(true);
    }
  };

  if (submitted) return <p style={{ color: "green" }}>✅ Submitted: {JSON.stringify(form)}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, display: "flex", flexDirection: "column", gap: 12 }}>
      {["name", "email", "password"].map(field => (
        <div key={field}>
          <label style={{ textTransform: "capitalize" }}>{field}:
            <input name={field} type={field === "password" ? "password" : "text"}
              value={form[field]} onChange={handleChange} onBlur={handleBlur}
              style={{ display: "block", width: "100%", padding: 6, borderColor: errors[field] ? "red" : "#ccc" }} />
          </label>
          {errors[field] && <p style={{ color: "red", margin: "2px 0", fontSize: 13 }}>{errors[field]}</p>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}


// ───────────────────────────────────────────────────────────────
// R45 ⭐⭐⭐ | usePrevious + Undo
// ───────────────────────────────────────────────────────────────
// Custom hook that remembers previous value.
// Build an undo feature with it.
//
// KEY INSIGHT: useRef + useEffect. After render, ref stores current value.
// On NEXT render, ref.current is the PREVIOUS value.
// ───────────────────────────────────────────────────────────────

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

export function R45_UndoDemo() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);

  const handleChange = (newVal) => {
    setHistory(prev => [...prev, newVal]);
    setCount(newVal);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCount(newHistory[newHistory.length - 1]);
  };

  const prev = usePrevious(count);

  return (
    <div>
      <h3>Count: {count}</h3>
      <p>Previous: {prev ?? "—"}</p>
      <button onClick={() => handleChange(count + 1)}>+1</button>
      <button onClick={() => handleChange(count - 1)}>-1</button>
      <button onClick={() => handleChange(count * 2)}>×2</button>
      <button onClick={undo} disabled={history.length <= 1}>Undo</button>
      <p style={{ fontSize: 12, color: "#999" }}>History: [{history.join(", ")}]</p>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  TIER 3 SUMMARY — 10 drills:
//  R36  React.memo + useCallback    R37  Error Boundary (class)
//  R38  Context + useReducer        R39  HOC pattern
//  R40  Compound Components         R41  Render Props
//  R42  Infinite Scroll             R43  Debounced API Search
//  R44  Validated Form              R45  usePrevious + Undo
//
//  PATTERNS: memo/useCallback, error boundaries, mini Redux,
//  HOC, compound components, render props, IntersectionObserver,
//  debounced search, form validation, undo with history
// ═══════════════════════════════════════════════════════════════
