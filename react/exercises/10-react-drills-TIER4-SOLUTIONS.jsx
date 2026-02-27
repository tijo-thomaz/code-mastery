/**
 * ═══════════════════════════════════════════════════════════════════
 * 10 — React Interview Drills — TIER 4 ⭐⭐⭐⭐ HARD (under 15 min)
 * + TIER 5 ⭐⭐⭐⭐⭐ BOSS LEVEL (under 20 min)
 * ═══════════════════════════════════════════════════════════════════
 * Senior-level builds. Architecture thinking. Complex state.
 * 🏖️ Each drill self-contained. Paste into CodeSandbox App.js.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useReducer, createContext, useContext, useMemo, useCallback, memo } from "react";


// ═══════════════════════════════════════════════════════════════
//  TIER 4 — ⭐⭐⭐⭐ HARD
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// R46 ⭐⭐⭐⭐ | Data Table — Sort + Filter + Paginate
// ───────────────────────────────────────────────────────────────
// The "full package" table. Sort by column, search filter, pagination.
// Combines: derived state, sorting, filtering, pagination — ALL together.
// ───────────────────────────────────────────────────────────────

const USERS = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `User ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  age: 20 + (i % 30),
  role: ["Dev", "Designer", "PM", "QA"][i % 4],
}));

export function R46_DataTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  // 1. Filter → 2. Sort → 3. Paginate (order matters!)
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortKey], valB = b[sortKey];
    const cmp = typeof valA === "string" ? valA.localeCompare(valB) : valA - valB;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const start = (page - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  const SortIcon = ({ col }) => sortKey === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div>
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or role..." style={{ marginBottom: 8, padding: 6, width: 250 }} />
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {[["id", "ID"], ["name", "Name"], ["age", "Age"], ["role", "Role"]].map(([key, label]) => (
              <th key={key} onClick={() => handleSort(key)}
                style={{ border: "1px solid #ddd", padding: 8, cursor: "pointer", background: "#f5f5f5", userSelect: "none" }}>
                {label}<SortIcon col={key} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map(u => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{u.id}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{u.name}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{u.age}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "center" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} / {totalPages} ({sorted.length} results)</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R47 ⭐⭐⭐⭐ | Shopping Cart
// ───────────────────────────────────────────────────────────────
// Product list + Cart. Add to cart, change quantity, remove, total.
// useReducer for cart state. Derived total via reduce.
//
// Tests: state management, derived values, multiple actions on same state.
// ───────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find(i => i.id === action.payload.id);
      if (exists) return state.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE":
      return state.filter(i => i.id !== action.payload);
    case "CHANGE_QTY":
      return state.map(i => i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i);
    default: return state;
  }
}

const PRODUCTS = [
  { id: 1, name: "React Book", price: 29.99 },
  { id: 2, name: "TypeScript Course", price: 49.99 },
  { id: 3, name: "Next.js Starter Kit", price: 19.99 },
  { id: 4, name: "Redux Toolkit Pro", price: 39.99 },
];

export function R47_ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div>
        <h3>Products</h3>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ padding: 8, border: "1px solid #eee", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center", width: 280 }}>
            <span>{p.name} — ${p.price}</span>
            <button onClick={() => dispatch({ type: "ADD", payload: p })}>Add</button>
          </div>
        ))}
      </div>
      <div>
        <h3>Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h3>
        {cart.length === 0 && <p>Empty</p>}
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
            <span style={{ width: 150 }}>{item.name}</span>
            <button onClick={() => dispatch({ type: "CHANGE_QTY", payload: { id: item.id, qty: item.qty - 1 } })}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => dispatch({ type: "CHANGE_QTY", payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
            <span>${(item.price * item.qty).toFixed(2)}</span>
            <button onClick={() => dispatch({ type: "REMOVE", payload: item.id })}>✕</button>
          </div>
        ))}
        {cart.length > 0 && <h4>Total: ${total.toFixed(2)}</h4>}
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R48 ⭐⭐⭐⭐ | Kanban Board (Drag Between Columns)
// ───────────────────────────────────────────────────────────────
// 3 columns: Todo, In Progress, Done. Drag tasks between them.
// Combines: drag-and-drop + column state + move between arrays.
// ───────────────────────────────────────────────────────────────

const INITIAL_BOARD = {
  todo: [{ id: 1, text: "Design UI" }, { id: 2, text: "Setup project" }],
  inProgress: [{ id: 3, text: "Build components" }],
  done: [{ id: 4, text: "Write README" }],
};

export function R48_KanbanBoard() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const dragInfo = useRef({ item: null, fromCol: null });

  const handleDragStart = (item, fromCol) => {
    dragInfo.current = { item, fromCol };
  };

  const handleDrop = (toCol) => {
    const { item, fromCol } = dragInfo.current;
    if (!item || fromCol === toCol) return;
    setBoard(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(i => i.id !== item.id),
      [toCol]: [...prev[toCol], item],
    }));
    dragInfo.current = { item: null, fromCol: null };
  };

  const colLabels = { todo: "📋 Todo", inProgress: "🔧 In Progress", done: "✅ Done" };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {Object.keys(board).map(col => (
        <div key={col}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(col)}
          style={{ flex: 1, minHeight: 200, padding: 12, backgroundColor: "#f9fafb", borderRadius: 8, border: "2px dashed #e5e7eb" }}>
          <h4>{colLabels[col]} ({board[col].length})</h4>
          {board[col].map(item => (
            <div key={item.id} draggable onDragStart={() => handleDragStart(item, col)}
              style={{ padding: 8, marginBottom: 4, backgroundColor: "white", borderRadius: 4,
                border: "1px solid #ddd", cursor: "grab" }}>
              {item.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R49 ⭐⭐⭐⭐ | Auth Flow (Login/Logout/Protected Content)
// ───────────────────────────────────────────────────────────────
// Context-based auth. Login form → stores user in context.
// Protected content only visible when logged in.
// This is how every real app works (simplified).
// ───────────────────────────────────────────────────────────────

const AuthContext = createContext();
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (username, password) => {
    if (password.length < 4) return "Password too short";
    setUser({ username });
    return null; // no error
  };
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const err = login(form.username, form.password);
    if (err) setError(err);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
      <h3>Login</h3>
      <input placeholder="Username" value={form.username}
        onChange={e => setForm(p => ({ ...p, username: e.target.value }))} style={{ display: "block", marginBottom: 8, padding: 6, width: "100%" }} />
      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ display: "block", marginBottom: 8, padding: 6, width: "100%" }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

function ProtectedContent() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h3>Welcome, {user.username}!</h3>
      <p>This is protected content only visible when logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export function R49_AuthFlow() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { user } = useAuth();
  return user ? <ProtectedContent /> : <LoginForm />;
}


// ───────────────────────────────────────────────────────────────
// R50 ⭐⭐⭐⭐ | Chat UI — Messages + Input + Auto-scroll
// ───────────────────────────────────────────────────────────────
// Chat messages list. Type + send. Auto-scrolls to bottom.
// useRef for scroll container. scrollIntoView on new message.
// Simulated bot reply after 1s.
// ───────────────────────────────────────────────────────────────

export function R50_ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input.trim(), sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, text: `You said: "${userMsg.text}"`, sender: "bot",
      }]);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 400, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ height: 300, overflowY: "auto", padding: 12, backgroundColor: "#f9fafb" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: 8, display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              padding: "8px 12px", borderRadius: 12, maxWidth: "70%",
              backgroundColor: msg.sender === "user" ? "#3b82f6" : "#e5e7eb",
              color: msg.sender === "user" ? "white" : "black",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..." style={{ flex: 1, padding: 10, border: "none", outline: "none" }} />
        <button onClick={sendMessage} style={{ padding: "10px 16px" }}>Send</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  TIER 5 — ⭐⭐⭐⭐⭐ BOSS LEVEL
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// R51 ⭐⭐⭐⭐⭐ | Full CRUD App with useReducer
// ───────────────────────────────────────────────────────────────
// Users table: Add, Edit inline, Delete, Search filter.
// All state in one reducer. This is a mini admin panel.
// ───────────────────────────────────────────────────────────────

function crudReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { ...state, users: [...state.users, { id: Date.now(), ...action.payload }], editingId: null };
    case "DELETE":
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    case "START_EDIT":
      return { ...state, editingId: action.payload };
    case "SAVE_EDIT":
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? { ...u, ...action.payload } : u),
        editingId: null,
      };
    case "CANCEL_EDIT":
      return { ...state, editingId: null };
    default: return state;
  }
}

export function R51_CRUDApp() {
  const [state, dispatch] = useReducer(crudReducer, {
    users: [
      { id: 1, name: "Alice", email: "alice@test.com" },
      { id: 2, name: "Bob", email: "bob@test.com" },
    ],
    editingId: null,
  });
  const [form, setForm] = useState({ name: "", email: "" });
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    dispatch({ type: "ADD", payload: form });
    setForm({ name: "", email: "" });
  };

  const startEdit = (user) => {
    dispatch({ type: "START_EDIT", payload: user.id });
    setEditForm({ name: user.name, email: user.email });
  };

  const filtered = state.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>User Management</h3>
      <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12, padding: 6, width: "100%" }} />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ flex: 1, padding: 6 }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ flex: 1, padding: 6 }} />
        <button onClick={handleAdd}>Add</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Email</th>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
        </tr></thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user.id}>
              {state.editingId === user.id ? (
                <>
                  <td style={{ border: "1px solid #ddd", padding: 4 }}>
                    <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: "100%", padding: 4 }} />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 4 }}>
                    <input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} style={{ width: "100%", padding: 4 }} />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 4 }}>
                    <button onClick={() => dispatch({ type: "SAVE_EDIT", payload: { id: user.id, ...editForm } })}>Save</button>
                    <button onClick={() => dispatch({ type: "CANCEL_EDIT" })}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{user.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{user.email}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <button onClick={() => startEdit(user)}>Edit</button>
                    <button onClick={() => dispatch({ type: "DELETE", payload: user.id })} style={{ marginLeft: 4 }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R52 ⭐⭐⭐⭐⭐ | Stacked Modals (Socure Question!)
// ───────────────────────────────────────────────────────────────
// A modal that opens another modal. Stack-based.
// Each modal has increasing z-index.
// ───────────────────────────────────────────────────────────────

function StackModal({ level, onClose, children }) {
  useEffect(() => {
    const handleEsc = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, backgroundColor: `rgba(0,0,0,${0.3 + level * 0.1})`,
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 + level,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 8, padding: 24, minWidth: 300,
        transform: `translate(${level * 20}px, ${level * 20}px)`,
      }}>
        {children}
        <button onClick={onClose} style={{ marginTop: 12 }}>Close</button>
      </div>
    </div>
  );
}

export function R52_StackedModals() {
  const [stack, setStack] = useState([]);
  const push = () => setStack(prev => [...prev, prev.length]);
  const pop = () => setStack(prev => prev.slice(0, -1));

  return (
    <div>
      <h3>Stacked Modals</h3>
      <button onClick={push}>Open Modal</button>
      {stack.map((level, i) => (
        <StackModal key={i} level={i} onClose={pop}>
          <h3>Modal {i + 1}</h3>
          <p>Level {i + 1} of {stack.length}</p>
          <button onClick={push}>Open Another</button>
        </StackModal>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  FULL DRILL MAP — ALL 52 COMPONENTS
// ═══════════════════════════════════════════════════════════════
//
//  TIER 1 ⭐ (07-react-interview-drills-SOLUTIONS.jsx)
//  R1-R20: Counter, Toggle, Input, List, Badge, Add, Delete,
//          Toggle-in-list, Form, useEffect, useRef, Loading,
//          Select, Search, Tabs, Accordion, TempConverter,
//          Timer, Card, Todo App
//
//  TIER 2 ⭐⭐ (08-react-drills-TIER2-SOLUTIONS.jsx)
//  R21-R35: useReducer, Context/Theme, useLocalStorage,
//           useDebounce, useFetch, File Explorer, Nested Boxes,
//           Modal, Pagination, Star Rating, Multi-step Form,
//           Toasts, Autocomplete, Carousel, Drag Reorder
//
//  TIER 3 ⭐⭐⭐ (09-react-drills-TIER3-SOLUTIONS.jsx)
//  R36-R45: React.memo/useCallback, Error Boundary, Mini Redux,
//           HOC, Compound Components, Render Props,
//           Infinite Scroll, Debounced API Search,
//           Validated Form, usePrevious/Undo
//
//  TIER 4-5 ⭐⭐⭐⭐/⭐⭐⭐⭐⭐ (THIS FILE)
//  R46-R52: Data Table, Shopping Cart, Kanban Board,
//           Auth Flow, Chat UI, CRUD App, Stacked Modals
//
// ═══════════════════════════════════════════════════════════════
