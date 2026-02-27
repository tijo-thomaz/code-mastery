/**
 * ═══════════════════════════════════════════════════════════════════
 * 08 — React Interview Drills — TIER 2 ⭐⭐ MEDIUM (under 5 min)
 * ═══════════════════════════════════════════════════════════════════
 * 🏖️ Each drill is self-contained. Paste into CodeSandbox App.js.
 * 🧠 Read → Close → Write from memory → Repeat until automatic.
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useReducer, createContext, useContext } from "react";


// ───────────────────────────────────────────────────────────────
// R21 ⭐⭐ | useReducer Todo
// ───────────────────────────────────────────────────────────────
// Same Todo as R20 but useReducer. This IS the Redux pattern.
// WHEN: 3+ actions on same state, complex transitions, testability.
// ───────────────────────────────────────────────────────────────

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
}

export function R21_TodoReducer() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: input.trim() });
    setInput("");
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder="Add..." />
      <button onClick={handleAdd}>Add</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
            <span onClick={() => dispatch({ type: "TOGGLE", payload: todo.id })}
              style={{ textDecoration: todo.done ? "line-through" : "none", cursor: "pointer", flex: 1 }}>
              {todo.done ? "☑" : "☐"} {todo.text}
            </span>
            <button onClick={() => dispatch({ type: "DELETE", payload: todo.id })}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R22 ⭐⭐ | Theme Toggle with Context
// ───────────────────────────────────────────────────────────────
// createContext → Provider → useContext → custom hook.
// ASKED IN EVERY SENIOR INTERVIEW.
// ───────────────────────────────────────────────────────────────

const ThemeContext = createContext();
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be within ThemeProvider");
  return ctx;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function ThemedPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div style={{ background: isDark ? "#1a1a2e" : "#fff", color: isDark ? "#e0e0e0" : "#1a1a2e", padding: 20, minHeight: 200 }}>
      <h2>Theme: {theme}</h2>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

export function R22_ThemeDemo() {
  return <ThemeProvider><ThemedPage /></ThemeProvider>;
}

// 🔥 Curveball: "Context re-renders ALL consumers. Fix?" → Split contexts, useMemo value, or Zustand.


// ───────────────────────────────────────────────────────────────
// R23 ⭐⭐ | Custom Hook: useLocalStorage
// ───────────────────────────────────────────────────────────────
// useState but persists to localStorage.
// Lazy initializer reads, useEffect writes.
// ───────────────────────────────────────────────────────────────

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

export function R23_LocalStorageDemo() {
  const [name, setName] = useLocalStorage("user-name", "");
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Persists on refresh!" />
      <p>Stored: {name || "—"}</p>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R24 ⭐⭐ | Custom Hook: useDebounce
// ───────────────────────────────────────────────────────────────
// Returns debounced value. Updates after delay ms of silence.
// useEffect + setTimeout + cleanup clearTimeout.
// ───────────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function R24_DebounceSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const allItems = ["React", "Redux", "Router", "Relay", "Recoil", "Remix", "Next.js", "Node"];
  const results = debouncedQuery
    ? allItems.filter(r => r.toLowerCase().includes(debouncedQuery.toLowerCase()))
    : [];

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      <p style={{ color: "#999" }}>Debounced: "{debouncedQuery}"</p>
      <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R25 ⭐⭐ | Custom Hook: useFetch
// ───────────────────────────────────────────────────────────────
// Reusable data fetching. Returns { data, loading, error }.
// AbortController for cleanup — fixes race conditions.
// ───────────────────────────────────────────────────────────────

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

export function R25_FetchDemo() {
  const [userId, setUserId] = useState(1);
  const { data, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button key={id} onClick={() => setUserId(id)} style={{ fontWeight: userId === id ? "bold" : "normal" }}>
            User {id}
          </button>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && <div><h3>{data.name}</h3><p>{data.email}</p></div>}
    </div>
  );
}

// 🔥 Curveball: "Why AbortController?" → Without it, clicking User 2 then 3 fast
// can cause User 2's late response to overwrite User 3's. Race condition fix.


// ───────────────────────────────────────────────────────────────
// R26 ⭐⭐ | File Explorer — Recursive Component
// ───────────────────────────────────────────────────────────────
// 🔴 FAILED AT INFOSYS. A component that renders ITSELF for children.
// isFolder → toggle open/close. isFile → show name.
// depth prop for indentation.
// ⏱️ TARGET: Under 5 min from blank file.
// ───────────────────────────────────────────────────────────────

const fileTreeData = [
  { name: "src", children: [
    { name: "components", children: [
      { name: "App.jsx" }, { name: "Header.jsx" },
    ]},
    { name: "hooks", children: [{ name: "useAuth.js" }] },
    { name: "index.js" },
  ]},
  { name: "package.json" },
  { name: "README.md" },
];

function FileNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!node.children;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div onClick={() => isFolder && setIsOpen(o => !o)}
        style={{ cursor: isFolder ? "pointer" : "default", padding: "2px 0" }}>
        {isFolder ? (isOpen ? "📂" : "📁") : "📄"} {node.name}
      </div>
      {isOpen && node.children?.map(child => (
        <FileNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function R26_FileExplorer() {
  return (
    <div style={{ fontFamily: "monospace" }}>
      <h3>File Explorer</h3>
      {fileTreeData.map(node => <FileNode key={node.name} node={node} />)}
    </div>
  );
}

// 🔥 Curveball: "Add search filter" → recursively filter tree, keep folder if any child matches.


// ───────────────────────────────────────────────────────────────
// R27 ⭐⭐ | Nested Color Boxes — Recursive
// ───────────────────────────────────────────────────────────────
// 🔴 FAILED AT SOCURE. Boxes nested INSIDE each other.
// WHY RECURSION NOT .map(): .map() creates SIBLINGS. These are NESTED.
// Base case: no colors → null. Recursive: render box, pass rest.
// ⏱️ TARGET: Under 3 min from blank file.
// ───────────────────────────────────────────────────────────────

function NestedBox({ colors }) {
  if (colors.length === 0) return null;
  const [first, ...rest] = colors;
  return (
    <div style={{ backgroundColor: first, padding: 20, border: "2px solid rgba(0,0,0,0.2)", borderRadius: 8 }}>
      <span style={{ fontSize: 12, color: "white", textShadow: "0 0 2px black" }}>{first}</span>
      <NestedBox colors={rest} />
    </div>
  );
}

export function R27_NestedBoxes() {
  return <NestedBox colors={["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"]} />;
}

// 🔥 Curveball: "Make interactive — click to add color"
export function R27_InteractiveBoxes() {
  const [colors, setColors] = useState(["#e74c3c", "#3498db", "#2ecc71"]);
  const [newColor, setNewColor] = useState("#f1c40f");
  return (
    <div>
      <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
      <button onClick={() => setColors(prev => [...prev, newColor])} style={{ marginLeft: 8 }}>Add Box</button>
      <div style={{ marginTop: 12 }}><NestedBox colors={colors} /></div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R28 ⭐⭐ | Modal Component
// ───────────────────────────────────────────────────────────────
// Overlay + centered content. Backdrop click closes. ESC closes.
// e.stopPropagation() on content prevents backdrop handler.
// ───────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = e => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 8, padding: 24, minWidth: 300, position: "relative",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 8, right: 12, border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function R28_ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <p>Press ESC or click backdrop to close.</p>
      </Modal>
    </div>
  );
}

// 🔥 Curveball: "Stack multiple modals" → Use array/stack of modal states.
// Each modal gets z-index: 1000 + index. This was the Socure question!


// ───────────────────────────────────────────────────────────────
// R29 ⭐⭐ | Pagination
// ───────────────────────────────────────────────────────────────
// Derive visible items: slice(start, start + pageSize).
// totalPages = Math.ceil(total / pageSize).
// ───────────────────────────────────────────────────────────────

export function R29_Pagination() {
  const allItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allItems.length / pageSize);
  const start = (page - 1) * pageSize;
  const visible = allItems.slice(start, start + pageSize);

  return (
    <div>
      <ul>{visible.map(item => <li key={item}>{item}</li>)}</ul>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ fontWeight: page === p ? "bold" : "normal" }}>{p}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
      <p>Page {page} / {totalPages}</p>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R30 ⭐⭐ | Star Rating
// ───────────────────────────────────────────────────────────────
// Click to rate 1-5. Hover previews. Two states: rating (permanent) + hover (temp).
// Display = hover || rating.
// ───────────────────────────────────────────────────────────────

export function R30_StarRating({ totalStars = 5 }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const display = hover || rating;

  return (
    <div>
      {Array.from({ length: totalStars }, (_, i) => i + 1).map(star => (
        <span key={star} onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
          style={{ cursor: "pointer", fontSize: 28, color: star <= display ? "#f59e0b" : "#d1d5db" }}>
          ★
        </span>
      ))}
      <p>Rating: {rating} / {totalStars}</p>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R31 ⭐⭐ | Multi-Step Form Wizard
// ───────────────────────────────────────────────────────────────
// step state controls which panel is visible.
// Single form object accumulates data across steps.
// ───────────────────────────────────────────────────────────────

export function R31_MultiStepForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", plan: "free" });
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? "#3b82f6" : "#e5e7eb" }} />
        ))}
      </div>

      {step === 1 && <div><h3>Step 1: Info</h3><input name="name" value={form.name} onChange={handleChange} placeholder="Name" /></div>}
      {step === 2 && <div><h3>Step 2: Contact</h3><input name="email" value={form.email} onChange={handleChange} placeholder="Email" /></div>}
      {step === 3 && <div><h3>Step 3: Review</h3><p>Name: {form.name}</p><p>Email: {form.email}</p></div>}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3 && <button onClick={() => setStep(s => s + 1)}>Next</button>}
        {step === 3 && <button onClick={() => alert(JSON.stringify(form, null, 2))}>Submit</button>}
      </div>
    </div>
  );
}

// 🔥 Curveball: "Validate before Next" → if (step === 1 && !form.name.trim()) return;


// ───────────────────────────────────────────────────────────────
// R32 ⭐⭐ | Toast Notifications
// ───────────────────────────────────────────────────────────────
// Toasts = array. Add = push with auto-dismiss timer. Remove = filter.
// Fixed position in corner. Auto-disappear after 3s.
// ───────────────────────────────────────────────────────────────

export function R32_Toasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const bgColor = { info: "#3b82f6", success: "#22c55e", error: "#ef4444" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => addToast("Info message", "info")}>Info</button>
        <button onClick={() => addToast("Success!", "success")}>Success</button>
        <button onClick={() => addToast("Error occurred", "error")}>Error</button>
      </div>
      <div style={{ position: "fixed", top: 16, right: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 999 }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding: "12px 16px", borderRadius: 8, color: "white",
            backgroundColor: bgColor[toast.type], minWidth: 200,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", gap: 12,
          }}>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R33 ⭐⭐ | Autocomplete / Typeahead
// ───────────────────────────────────────────────────────────────
// Input + filtered dropdown. Click suggestion → fills input.
// Combine: controlled input + filter + selection.
// ───────────────────────────────────────────────────────────────

export function R33_Autocomplete() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const options = ["JavaScript", "TypeScript", "React", "Redux", "Next.js", "Node.js", "Express", "GraphQL"];
  const filtered = options.filter(opt => opt.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: "relative", width: 250 }}>
      <input value={query} onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => query && setIsOpen(true)} placeholder="Search tech..." style={{ width: "100%", padding: 8 }} />
      {isOpen && filtered.length > 0 && (
        <ul style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          border: "1px solid #ddd", listStyle: "none", padding: 0, margin: 0,
          background: "white", maxHeight: 200, overflowY: "auto", zIndex: 10,
        }}>
          {filtered.map(opt => (
            <li key={opt} onClick={() => { setQuery(opt); setIsOpen(false); }}
              style={{ padding: "8px 12px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.background = "#f0f0f0"}
              onMouseLeave={e => e.target.style.background = "white"}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 🔥 Curveball: "Add keyboard nav (arrow keys + Enter)" → Track highlightedIndex state.


// ───────────────────────────────────────────────────────────────
// R34 ⭐⭐ | Image Carousel / Slider
// ───────────────────────────────────────────────────────────────
// currentIndex + modular arithmetic.
// next = (current + 1) % total. prev = (current - 1 + total) % total.
// ───────────────────────────────────────────────────────────────

export function R34_Carousel() {
  const images = [
    "https://picsum.photos/seed/a/400/250",
    "https://picsum.photos/seed/b/400/250",
    "https://picsum.photos/seed/c/400/250",
    "https://picsum.photos/seed/d/400/250",
  ];
  const [current, setCurrent] = useState(0);
  const total = images.length;

  return (
    <div style={{ maxWidth: 420, textAlign: "center" }}>
      <div style={{ position: "relative" }}>
        <img src={images[current]} alt={`Slide ${current + 1}`} style={{ width: "100%", borderRadius: 8 }} />
        <button onClick={() => setCurrent(c => (c - 1 + total) % total)}
          style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}>◀</button>
        <button onClick={() => setCurrent(c => (c + 1) % total)}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>▶</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        {images.map((_, i) => (
          <span key={i} onClick={() => setCurrent(i)}
            style={{ width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
              backgroundColor: i === current ? "#3b82f6" : "#d1d5db" }} />
        ))}
      </div>
    </div>
  );
}

// 🔥 Curveball: "Add auto-play, pause on hover" → setInterval in useEffect + isHovering state.


// ───────────────────────────────────────────────────────────────
// R35 ⭐⭐ | Drag-and-Drop Reorder
// ───────────────────────────────────────────────────────────────
// HTML5 drag API. useRef for drag indexes (no re-render needed during drag).
// onDragStart → store index. onDragEnter → store target. onDragEnd → splice & reinsert.
// ───────────────────────────────────────────────────────────────

export function R35_DragReorder() {
  const [items, setItems] = useState(["Learn React", "Learn Redux", "Learn TypeScript", "Build project", "Get hired"]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragEnd = () => {
    const newItems = [...items];
    const dragged = newItems.splice(dragItem.current, 1)[0];
    newItems.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    setItems(newItems);
  };

  return (
    <ul style={{ listStyle: "none", padding: 0, maxWidth: 300 }}>
      {items.map((item, index) => (
        <li key={item} draggable
          onDragStart={() => { dragItem.current = index; }}
          onDragEnter={() => { dragOverItem.current = index; }}
          onDragEnd={handleDragEnd}
          onDragOver={e => e.preventDefault()}
          style={{ padding: "10px 12px", margin: "4px 0", backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb", borderRadius: 6, cursor: "grab" }}>
          ≡ {item}
        </li>
      ))}
    </ul>
  );
}

// 🔥 Curveball: "Why useRef not useState for dragItem?" → No re-render needed during drag.


// ═══════════════════════════════════════════════════════════════
//  TIER 2 SUMMARY — 15 drills covering:
//  ✅ useReducer          ✅ Context API + custom hooks
//  ✅ useLocalStorage     ✅ useDebounce      ✅ useFetch
//  ✅ File Explorer (recursive — INFOSYS failure)
//  ✅ Nested Boxes (recursive — SOCURE failure)
//  ✅ Modal + ESC/backdrop ✅ Pagination
//  ✅ Star Rating         ✅ Multi-step Form
//  ✅ Toasts              ✅ Autocomplete
//  ✅ Carousel            ✅ Drag & Drop
// ═══════════════════════════════════════════════════════════════
