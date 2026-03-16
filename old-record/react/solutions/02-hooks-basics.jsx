// =============================================================================
// 02 — Hooks Basics — SOLUTIONS
// =============================================================================

import React, { useState, useEffect, useRef, useReducer } from "react";

// =============================================================================
// Exercise 1 — useState: Counter
// =============================================================================

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}

// Explanation:
// Use the updater form setCount(c => c + 1) instead of setCount(count + 1)
// to avoid stale closure issues when updates are batched.

// =============================================================================
// Exercise 2 — useState: Toggle
// =============================================================================

export function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => setIsOn((prev) => !prev)}
      style={{
        padding: "10px 24px",
        backgroundColor: isOn ? "#22c55e" : "#6b7280",
        color: "white",
        border: "none",
        borderRadius: 20,
        cursor: "pointer",
      }}
    >
      {isOn ? "ON" : "OFF"}
    </button>
  );
}

// =============================================================================
// Exercise 3 — useState: Form
// =============================================================================

export function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  function validate(field, value) {
    const newErrors = { ...errors };
    if (field === "email") {
      newErrors.email = value.includes("@") ? "" : "Email must contain @";
    }
    if (field === "password") {
      newErrors.password =
        value.length >= 8 ? "" : "Password must be at least 8 characters";
    }
    setErrors(newErrors);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  }

  return (
    <div>
      <div>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>
      <h4>Summary</h4>
      <p>Name: {form.name}</p>
      <p>Email: {form.email}</p>
      <p>Password: {"•".repeat(form.password.length)}</p>
    </div>
  );
}

// Explanation:
// Single state object for related fields. Spread previous state when updating
// one field: { ...prev, [name]: value }. Computed property name [name] lets
// us reuse one handler for all inputs.

// =============================================================================
// Exercise 4 — useEffect: Fetch Data
// =============================================================================

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchUsers();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}

// Explanation:
// The `cancelled` flag prevents state updates after unmount (avoids the
// "can't perform a React state update on an unmounted component" warning).
// Empty dependency array [] means this runs once on mount.

// =============================================================================
// Exercise 5 — useEffect: Cleanup
// =============================================================================

export function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <p>
      Window: {size.width} × {size.height}
    </p>
  );
}

// Explanation:
// Returning a cleanup function from useEffect removes the event listener
// when the component unmounts, preventing memory leaks.

// =============================================================================
// Exercise 6 — useEffect: Dependencies (Debounce)
// =============================================================================

export function SearchFilter() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(() => {
      console.log("Searching for:", query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />;
}

// Explanation:
// Every keystroke re-runs the effect. The cleanup clears the previous timer.
// Only the last timer (after 300ms of no typing) actually fires.

// =============================================================================
// Exercise 7 — useRef: Focus Input
// =============================================================================

export function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} placeholder="I'm auto-focused!" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </div>
  );
}

// Explanation:
// useRef returns a mutable ref object. Assigning it to an element's ref prop
// gives us direct DOM access. .current holds the DOM node.

// =============================================================================
// Exercise 8 — useReducer: Todo App
// =============================================================================

const initialState = { todos: [], nextId: 1 };

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, { id: state.nextId, text: action.text, done: false }],
        nextId: state.nextId + 1,
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      };
    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, text: action.text } : t
        ),
      };
    default:
      return state;
  }
}

export function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  function handleAdd() {
    if (!input.trim()) return;
    dispatch({ type: "ADD_TODO", text: input.trim() });
    setInput("");
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit(id) {
    dispatch({ type: "EDIT_TODO", id, text: editText });
    setEditingId(null);
  }

  return (
    <div>
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a todo" />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {editingId === todo.id ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span onClick={() => startEdit(todo)}>{todo.text}</span>
                <button onClick={() => dispatch({ type: "TOGGLE_TODO", id: todo.id })}>
                  {todo.done ? "Undo" : "Done"}
                </button>
                <button onClick={() => dispatch({ type: "DELETE_TODO", id: todo.id })}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Explanation:
// useReducer shines when state logic is complex or involves multiple sub-values.
// The reducer is a pure function — easy to test independently.
// All state transitions are explicit action types — great for debugging.
