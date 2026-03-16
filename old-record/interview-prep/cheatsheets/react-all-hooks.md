# ⚛️ All React Hooks — Complete Reference (2026)

> Every built-in hook. What it does, when to use it, real-world code.
> Deep dives on useState/useRef → `react-ref-state-deepdive.md`
> Deep dives on effects → `react-effects-deepdive.md`

---

## Quick Map — Which Hook For What?

```
STATE & DATA
├── useState          → Simple state (counter, input, toggle)
├── useReducer        → Complex state with actions (todo, form, multi-field)
├── useContext        → Read shared data without prop drilling (theme, auth, lang)
├── useSyncExternalStore → Subscribe to external stores (Redux, browser APIs)

SIDE EFFECTS
├── useEffect         → After paint (fetch, subscribe, timer)
├── useLayoutEffect   → Before paint (measure DOM, prevent flicker)
├── useInsertionEffect → Before DOM mutations (CSS-in-JS libraries only)

PERFORMANCE
├── useMemo           → Cache expensive computed values
├── useCallback       → Cache function references (prevent child re-renders)

REFS
├── useRef            → Mutable value that doesn't re-render (DOM, timers, prev value)
├── useImperativeHandle → Expose custom ref API from child

CONCURRENT / REACT 18+
├── useTransition     → Mark state update as low priority
├── useDeferredValue  → Defer a value (when you don't own setter)
├── useId             → Generate unique IDs for accessibility

REACT 19
├── use()             → Unwrap promises and context in render
├── useActionState    → Form actions with pending state
├── useOptimistic     → Optimistic UI updates
├── useFormStatus     → Pending state inside form
```

---

## 1. useState

> Deep dive → `react-ref-state-deepdive.md`

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState(() => loadFromStorage()); // lazy init
setCount(prev => prev + 1); // updater for batching
```

**One-liner:** "State that triggers re-render when changed."

---

## 2. useReducer — Complex State Machine

### When to use over useState
- Multiple related state values
- Next state depends on previous state
- State transitions follow clear rules (actions)
- When useState callbacks get messy

### Real World — Form with validation
```jsx
const initialState = {
  values: { name: "", email: "", password: "" },
  errors: {},
  isSubmitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined }, // clear error on edit
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function SignupForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (field) => (e) => {
    dispatch({ type: "SET_FIELD", field, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.values.email) {
      dispatch({ type: "SET_ERROR", field: "email", message: "Required" });
      return;
    }
    dispatch({ type: "SUBMIT_START" });
    await api.signup(state.values);
    dispatch({ type: "SUBMIT_END" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={state.values.name} onChange={handleChange("name")} />
      <input value={state.values.email} onChange={handleChange("email")} />
      {state.errors.email && <span>{state.errors.email}</span>}
      <button disabled={state.isSubmitting}>
        {state.isSubmitting ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### Real World — Todo (interview classic)
```jsx
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    case "TOGGLE":
      return state.map(t =>
        t.id === action.id ? { ...t, done: !t.done } : t
      );
    default:
      return state;
  }
}

const [todos, dispatch] = useReducer(todoReducer, []);
dispatch({ type: "ADD", text: "Learn hooks" });
dispatch({ type: "TOGGLE", id: 123 });
dispatch({ type: "DELETE", id: 123 });
```

### useState vs useReducer
```
useState:
  ✅ Simple values (string, number, boolean)
  ✅ Independent state pieces
  ✅ Quick prototyping

useReducer:
  ✅ Multiple related fields
  ✅ Complex state transitions
  ✅ Testable — reducer is pure function
  ✅ Pass dispatch to children (stable reference, no useCallback needed)
```

### Interview one-liner
> "useReducer is useState for complex state — when you have multiple related values or state transitions that follow clear action patterns. The reducer is a pure function, so it's easy to test. I use it for forms, todo apps, and anything with more than 2-3 related state values."

---

## 3. useContext — Global State Without Prop Drilling

### Real World — Theme
```jsx
// 1. Create context
const ThemeContext = createContext("light");

// 2. Provide at top level
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere (no prop drilling)
function DeepChildButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{ background: theme === "dark" ? "#333" : "#fff" }}
    >
      Toggle Theme
    </button>
  );
}
```

### Real World — Auth
```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — clean API
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Usage anywhere
function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  return isLoggedIn ? <button onClick={logout}>Logout {user.name}</button> : <LoginLink />;
}
```

### Trap: Context re-renders ALL consumers
```jsx
// ❌ Every component using this context re-renders when ANY value changes
<ThemeContext.Provider value={{ theme, fontSize, language }}>

// ✅ Split into separate contexts
<ThemeContext.Provider value={theme}>
<FontContext.Provider value={fontSize}>
<LangContext.Provider value={language}>

// ✅ Or memoize the value
const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value}>
```

### Interview one-liner
> "useContext reads from the nearest Provider above in the tree — no prop drilling. I use it for low-frequency global data like theme, auth, and locale. For high-frequency updates, I use Zustand or split into multiple contexts to avoid unnecessary re-renders."

---

## 4. useMemo — Cache Computed Values

### When to use
- **Expensive calculations** that shouldn't re-run every render
- **Referential stability** for objects/arrays passed to children
- **NOT for everything** — useMemo itself has overhead

```jsx
// ❌ Filters 10,000 items every render even if items/query haven't changed
function SearchResults({ items, query }) {
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  return <List data={filtered} />;
}

// ✅ Only recalculates when items or query change
function SearchResults({ items, query }) {
  const filtered = useMemo(() =>
    items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ),
    [items, query]
  );
  return <List data={filtered} />;
}
```

### Real World — Derived data
```jsx
function Dashboard({ transactions }) {
  const stats = useMemo(() => ({
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
    count: transactions.length,
    average: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
    byCategory: Object.groupBy(transactions, t => t.category),
  }), [transactions]);

  return (
    <>
      <p>Total: ${stats.total}</p>
      <p>Average: ${stats.average.toFixed(2)}</p>
    </>
  );
}
```

---

## 5. useCallback — Cache Function References

### When to use
- Passing callbacks to **memoized children** (`React.memo`)
- Passing to **dependency arrays** of useEffect
- **Without React.memo on child, useCallback does NOTHING useful**

```jsx
// ❌ Pointless useCallback — Child re-renders anyway
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount(prev => prev + 1), []);
  return <Child onClick={handleClick} />; // Child still re-renders when Parent re-renders
}

// ✅ Useful — Child is memoized, stable callback prevents re-render
const Child = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const handleClick = useCallback(() => setCount(prev => prev + 1), []);
  // When name changes, Parent re-renders but Child SKIPS (same onClick ref)
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Child onClick={handleClick} />
    </>
  );
}
```

### The Trinity — useMemo vs useCallback vs React.memo

```
React.memo(Component)      → Skips re-render if PROPS haven't changed
useMemo(() => value, deps) → Cache a VALUE (number, object, array)
useCallback(fn, deps)      → Cache a FUNCTION reference

useCallback(fn, deps) === useMemo(() => fn, deps)
```

```
                    Without React.memo    With React.memo
Without useCallback   Re-renders ✗         Re-renders ✗ (new fn ref)
With useCallback      Re-renders ✗         SKIPS ✅ (same fn ref)
```

### Interview one-liner
> "useCallback caches a function reference so it's stable across renders. It's only useful when the child is wrapped in React.memo — otherwise it's wasted overhead. useMemo is the same thing but for values. React.memo is the wrapper that makes both worthwhile."

---

## 6. useId — Unique IDs for Accessibility

### Problem
```jsx
// ❌ IDs will clash if component renders twice
function FormField() {
  return (
    <>
      <label htmlFor="email">Email</label>
      <input id="email" />
    </>
  );
}
```

### Solution
```jsx
function FormField({ label }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
// Generates unique IDs like ":r1:", ":r2:" — safe for SSR too

// Multiple related IDs:
const id = useId();
<label htmlFor={`${id}-email`}>Email</label>
<input id={`${id}-email`} aria-describedby={`${id}-error`} />
<span id={`${id}-error`}>Invalid email</span>
```

### Interview one-liner
> "useId generates stable unique IDs for linking labels to inputs, aria-describedby, etc. Works with SSR — same ID on server and client. Never use it for list keys."

---

## 7. useSyncExternalStore — Subscribe to External Data

### When to use
- Subscribing to **browser APIs** (online status, media queries)
- Subscribing to **third-party stores** (Redux, MobX)
- **Not** for React state — use useState/useReducer

### Real World — Online status
```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,        // client snapshot
    () => true,                     // server snapshot (SSR)
  );
}

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? "🟢 Online" : "🔴 Offline"}</p>;
}
```

### Real World — Window width
```jsx
function useWindowWidth() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    },
    () => window.innerWidth,
    () => 1024, // SSR default
  );
}
```

### Interview one-liner
> "useSyncExternalStore safely subscribes React to non-React data sources — browser APIs, external stores. It takes a subscribe function, a getSnapshot function, and an optional server snapshot for SSR."

---

## 8–10. React 19 Hooks

### use() — Unwrap Promises and Context in Render
```jsx
// Read a promise (works with Suspense)
function UserProfile({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Wrap with Suspense
<Suspense fallback={<Spinner />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>

// Also reads context (can be called conditionally unlike useContext!)
function Panel({ showTheme }) {
  if (showTheme) {
    const theme = use(ThemeContext); // ✅ conditional — only use() can do this
    return <div className={theme}>...</div>;
  }
  return <div>Default</div>;
}
```

### useActionState — Form Actions with Pending State
```jsx
async function submitForm(prevState, formData) {
  const name = formData.get("name");
  const res = await api.createUser({ name });
  if (res.error) return { error: res.error };
  return { success: true };
}

function CreateForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>Created!</p>}
    </form>
  );
}
```

### useOptimistic — Instant UI Updates
```jsx
function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [...currentTodos, { ...newTodo, pending: true }]
  );

  const handleSubmit = async (formData) => {
    const text = formData.get("text");
    addOptimistic({ id: Date.now(), text, done: false }); // instant UI update
    await addTodo(text); // actual API call — if fails, optimistic state reverts
  };

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### useFormStatus — Pending State Inside Form
```jsx
// Must be used INSIDE a <form> with an action
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function MyForm() {
  return (
    <form action={serverAction}>
      <input name="email" />
      <SubmitButton /> {/* automatically knows form is submitting */}
    </form>
  );
}
```

---

## Custom Hooks — Interview Patterns

### useLocalStorage
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

### useDebounce
```jsx
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Usage
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery);
}, [debouncedQuery]);
```

### useFetch
```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name !== "AbortError") {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
```

### useMediaQuery
```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery("(max-width: 768px)");
```

---

## Verbal Drill — 60 Seconds Each

1. "useState vs useReducer — when do you pick each?"
2. "How does useContext work? What's the re-render trap?"
3. "useMemo vs useCallback vs React.memo — explain the difference"
4. "What is useId and why not just use Math.random()?"
5. "What new hooks did React 19 add?"
6. "Build a useDebounce hook — explain how it works"
7. "When would you use useSyncExternalStore?"
8. "What is useOptimistic and when would you use it?"
