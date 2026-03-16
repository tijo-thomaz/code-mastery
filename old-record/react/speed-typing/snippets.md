# React Speed Typing Snippets

Practice each snippet until you can type it from memory without hesitation.

---

## 1 — useState Counter

```jsx
const [count, setCount] = useState(0);
```

## 2 — useState Object

```jsx
const [form, setForm] = useState({ name: "", email: "" });
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

## 3 — useEffect Fetch

```jsx
useEffect(() => {
  let cancelled = false;
  async function fetchData() {
    const res = await fetch(url);
    const data = await res.json();
    if (!cancelled) setData(data);
  }
  fetchData();
  return () => { cancelled = true; };
}, [url]);
```

## 4 — useEffect Event Listener

```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

## 5 — useEffect Debounce

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("Debounced:", value);
  }, 300);
  return () => clearTimeout(timer);
}, [value]);
```

## 6 — useRef Focus

```jsx
const inputRef = useRef(null);
useEffect(() => { inputRef.current.focus(); }, []);
```

## 7 — useReducer Setup

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
```

## 8 — Custom Hook Template

```jsx
function useCustomHook(param) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // setup
    return () => {
      // cleanup
    };
  }, [param]);

  return value;
}
```

## 9 — Context Setup

```jsx
const MyContext = createContext();

function MyProvider({ children }) {
  const [state, setState] = useState(initialValue);
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error("useMyContext must be used within MyProvider");
  return context;
}
```

## 10 — Controlled Input

```jsx
function TextInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
```

## 11 — List Rendering

```jsx
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

## 12 — Conditional Rendering

```jsx
{isLoading ? <Spinner /> : <Content data={data} />}
{error && <ErrorMessage message={error.message} />}
```

## 13 — React.memo + useMemo + useCallback

```jsx
const MemoizedChild = memo(function Child({ onClick, items }) {
  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>;
});

function Parent() {
  const items = useMemo(() => computeItems(), [dep]);
  const handleClick = useCallback(() => { /* ... */ }, [dep]);
  return <MemoizedChild onClick={handleClick} items={items} />;
}
```

## 14 — Error Boundary

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) return <p>Error: {this.state.error.message}</p>;
    return this.props.children;
  }
}
```

## 15 — React 19: useActionState

```jsx
async function action(prevState, formData) {
  await saveToServer(formData.get("name"));
  return { success: true };
}

const [state, formAction, isPending] = useActionState(action, { success: false });
```

## 16 — React 19: useOptimistic

```jsx
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (current, newItem) => [...current, newItem]
);
```

## 17 — React 19: use() with Suspense

```jsx
const dataPromise = fetch("/api/data").then((r) => r.json());

function DataView() {
  const data = use(dataPromise);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

<Suspense fallback={<p>Loading...</p>}>
  <DataView />
</Suspense>
```
