/**
 * ═══════════════════════════════════════════════════════════════════
 * 07 — React + Redux Interview Drills — SOLUTIONS + CURVEBALLS
 * ═══════════════════════════════════════════════════════════════════
 *
 * 🧠 HOW TO USE THIS FILE:
 *   1. Read ONE solution carefully
 *   2. Open a new CodeSandbox (https://codesandbox.io → React template)
 *   3. Build it from memory — NO peeking
 *   4. If stuck, peek at the KEY INSIGHT line only, then close and retry
 *   5. Repeat until your fingers type it without thinking
 *   6. For pen & paper: cover the code, write the component on paper
 *
 * 🏖️ CODESANDBOX SETUP:
 *   → https://codesandbox.io → "Create Sandbox" → React (JavaScript)
 *   → Delete everything in App.js
 *   → Paste/type ONE drill at a time
 *   → Each drill is self-contained — just paste into App.js and it works
 *
 * 📊 DIFFICULTY LEVELS:
 *   ⭐          = Easy (under 2 min — must be instant)
 *   ⭐⭐        = Medium (under 5 min)
 *   ⭐⭐⭐      = Interview Standard (under 10 min)
 *   ⭐⭐⭐⭐    = Hard (under 15 min)
 *   ⭐⭐⭐⭐⭐  = Boss Level (under 20 min)
 *
 * 🎯 CURVEBALL variations marked with 🔥
 *
 * 🔴 YOUR FAILED INTERVIEW HISTORY:
 *   - Todo list: Failed at Wipro + UST (TWICE!)
 *   - File explorer: Failed at Infosys
 *   - Nested color boxes: Failed at Socure
 *   - React concepts freeze under pressure
 *
 * 🛟 THE UNIVERSAL REACT BUILD FRAMEWORK:
 *   Every "build X" question follows 3 steps:
 *   ┌─────────────────────────────────────────┐
 *   │ Step 1: STATE    → What data do I hold? │
 *   │ Step 2: RENDER   → How do I display it? │
 *   │ Step 3: HANDLERS → What changes state?  │
 *   └─────────────────────────────────────────┘
 *   Say this OUT LOUD before you write a single line of code.
 *
 * ═══════════════════════════════════════════════════════════════════
 */


// ╔═══════════════════════════════════════════════════════════════╗
// ║                                                               ║
// ║   🛟 REACT CHEAT SHEET — Patterns That Cover 90% of          ║
// ║   Interview Questions                                         ║
// ║                                                               ║
// ╚═══════════════════════════════════════════════════════════════╝
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 1: CONTROLLED INPUT                                │
// │                                                             │
// │  const [value, setValue] = useState("");                    │
// │  <input value={value} onChange={e => setValue(e.target.value)} /> │
// │                                                             │
// │  KEY: React owns the value. onChange syncs it.              │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 2: LIST + ADD + DELETE                             │
// │                                                             │
// │  const [items, setItems] = useState([]);                   │
// │  const add = (item) => setItems(prev => [...prev, item]);  │
// │  const remove = (id) =>                                     │
// │    setItems(prev => prev.filter(i => i.id !== id));         │
// │                                                             │
// │  items.map(item => <li key={item.id}>...</li>)             │
// │                                                             │
// │  KEY: Spread to add, filter to remove. key={item.id}.      │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 3: TOGGLE BOOLEAN STATE                            │
// │                                                             │
// │  const [isOpen, setIsOpen] = useState(false);              │
// │  <button onClick={() => setIsOpen(prev => !prev)}>        │
// │    {isOpen ? "Hide" : "Show"}                               │
// │  </button>                                                  │
// │  {isOpen && <div>Content</div>}                             │
// │                                                             │
// │  KEY: prev => !prev, never !isOpen (stale closure risk)    │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 4: OBJECT STATE (Forms)                            │
// │                                                             │
// │  const [form, setForm] = useState({ name: "", email: "" });│
// │  const handleChange = (e) => {                              │
// │    const { name, value } = e.target;                       │
// │    setForm(prev => ({ ...prev, [name]: value }));          │
// │  };                                                         │
// │  <input name="name" value={form.name} onChange={handleChange} /> │
// │                                                             │
// │  KEY: Spread old state + computed property [name]: value    │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 5: useEffect FOR SIDE EFFECTS                      │
// │                                                             │
// │  useEffect(() => {                                          │
// │    // setup (runs after render)                             │
// │    const sub = subscribe(id);                               │
// │    return () => sub.unsubscribe(); // cleanup               │
// │  }, [id]); // re-run when id changes                        │
// │                                                             │
// │  [] = mount only                                            │
// │  [dep] = mount + when dep changes                          │
// │  no array = EVERY render (almost never want this)          │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 6: CONDITIONAL RENDERING                           │
// │                                                             │
// │  {isLoading && <Spinner />}           // AND short-circuit │
// │  {error ? <Error /> : <Data />}       // Ternary            │
// │  {status === "idle" && <Idle />}      // Exact match       │
// │                                                             │
// │  KEY: 0 && <X/> renders "0". Use !!count or count > 0     │
// └─────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────┐
// │  PATTERN 7: LIFTING STATE UP                                │
// │                                                             │
// │  // Parent owns the state, child gets value + handler      │
// │  function Parent() {                                        │
// │    const [value, setValue] = useState("");                  │
// │    return <Child value={value} onChange={setValue} />;      │
// │  }                                                          │
// │  function Child({ value, onChange }) {                      │
// │    return <input value={value}                              │
// │      onChange={e => onChange(e.target.value)} />;           │
// │  }                                                          │
// └─────────────────────────────────────────────────────────────┘


// ═══════════════════════════════════════════════════════════════
//  TIER 1 — ⭐ EASY (under 2 min each — must be INSTANT)
//  These are warmups. If you can't do these in your sleep,
//  you'll freeze on the real questions.
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// R1 ⭐ | Counter
// ───────────────────────────────────────────────────────────────
// Build a counter with increment, decrement, reset buttons.
//
// RENDERS: A number + 3 buttons (-, Reset, +)
// BEHAVIOR: +1, -1, back to 0
//
// KEY INSIGHT: useState + updater form setCount(c => c + 1)
// WHY UPDATER FORM: Prevents stale closure bugs when React batches updates
//
// STATE → count (number)
// RENDER → <h2>{count}</h2> + 3 buttons
// HANDLERS → increment, decrement, reset
// ───────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useReducer, createContext, useContext, useMemo, useCallback, memo } from "react";

// R1 — Counter ⭐
export function R1_Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// 🔥 R1 Curveball: "Add a step size — increment by N instead of 1"
export function R1_CounterWithStep() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <div>
      <h2>{count}</h2>
      <label>
        Step: <input type="number" value={step} onChange={e => setStep(Number(e.target.value))} style={{ width: 50 }} />
      </label>
      <button onClick={() => setCount(c => c - step)}>-{step}</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(c => c + step)}>+{step}</button>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R2 ⭐ | Toggle Show/Hide
// ───────────────────────────────────────────────────────────────
// Build a button that toggles visibility of a paragraph.
//
// RENDERS: Button + conditionally visible <p>
// BEHAVIOR: Click → show/hide text
//
// KEY INSIGHT: Boolean state + && conditional rendering
//
// STATE → isVisible (boolean)
// RENDER → button label changes, paragraph conditionally rendered
// HANDLERS → toggle
// ───────────────────────────────────────────────────────────────

export function R2_Toggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(prev => !prev)}>
        {isVisible ? "Hide" : "Show"}
      </button>
      {isVisible && <p>Hello! Now you see me.</p>}
    </div>
  );
}

// 🔥 R2 Curveball: "Toggle with animation (fade in/out)"
// Interviewer wants to see if you know CSS transitions + state
export function R2_ToggleFade() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(prev => !prev)}>
        {isVisible ? "Hide" : "Show"}
      </button>
      <p style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
        // NOTE: Don't use && here — element must stay in DOM for transition to work
      }}>
        Hello! I fade in and out.
      </p>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R3 ⭐ | Controlled Text Input
// ───────────────────────────────────────────────────────────────
// Build an input that displays what you type in a <p> below it.
//
// RENDERS: Input + live preview paragraph
// BEHAVIOR: Type → text appears below in real time
//
// KEY INSIGHT: value={state} + onChange={e => setState(e.target.value)}
// This is THE fundamental React form pattern.
//
// STATE → text (string)
// RENDER → <input> + <p>{text}</p>
// HANDLERS → onChange
// ───────────────────────────────────────────────────────────────

export function R3_ControlledInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}

// 🔥 R3 Curveball: "Add character count with max limit"
export function R3_InputWithLimit() {
  const MAX = 50;
  const [text, setText] = useState("");

  const handleChange = (e) => {
    if (e.target.value.length <= MAX) {
      setText(e.target.value);
    }
  };

  return (
    <div>
      <input value={text} onChange={handleChange} placeholder="Type something..." />
      <p>{text.length}/{MAX} characters</p>
      {text.length === MAX && <p style={{ color: "red" }}>Max length reached!</p>}
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R4 ⭐ | List Rendering
// ───────────────────────────────────────────────────────────────
// Render a list of fruits from an array.
//
// RENDERS: <ul> with <li> for each item
// BEHAVIOR: Static list, properly keyed
//
// KEY INSIGHT: array.map() + key={unique_id}
// NEVER use index as key for dynamic lists (reorder/filter bugs)
// Index is OK only for static, never-changing lists
//
// STATE → fruits array (static, so could be a const)
// RENDER → fruits.map(f => <li key={f.id}>{f.name}</li>)
// HANDLERS → none (static list)
// ───────────────────────────────────────────────────────────────

export function R4_ListRendering() {
  const fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
    { id: 4, name: "Dragonfruit" },
    { id: 5, name: "Elderberry" },
  ];

  return (
    <ul>
      {fruits.map(fruit => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
}

// 🔥 R4 Curveball: "Why not use index as key?"
// When items are reordered/deleted, React uses keys to match old→new.
// Index keys cause React to reuse the WRONG DOM node → state bugs.
// Example: a list of <input>s with index keys — delete item 0,
// and the text from item 1 appears in item 0's position.


// ───────────────────────────────────────────────────────────────
// R5 ⭐ | Conditional Rendering — Status Badge
// ───────────────────────────────────────────────────────────────
// Show different colored badges based on a status prop.
//
// INPUT: status = "online" | "offline" | "away"
// RENDERS: Colored dot + label
//
// KEY INSIGHT: Use a config object, NOT if/else chains.
// Config objects are cleaner, extensible, and interviewers love them.
//
// STATE → none (driven by props)
// RENDER → lookup from config object
// HANDLERS → none
// ───────────────────────────────────────────────────────────────

export function R5_StatusBadge({ status = "offline" }) {
  const config = {
    online:  { color: "#22c55e", label: "Online" },
    offline: { color: "#6b7280", label: "Offline" },
    away:    { color: "#f59e0b", label: "Away" },
  };

  const { color, label } = config[status] || config.offline;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        backgroundColor: color, display: "inline-block",
      }} />
      {label}
    </span>
  );
}

// Demo: <R5_StatusBadge status="online" />

// 🔥 R5 Curveball: "What if status is an unknown value?"
// Answer: config[status] || config.offline — fallback to default.
// Better: use TypeScript union type: status: "online" | "offline" | "away"


// ───────────────────────────────────────────────────────────────
// R6 ⭐ | Add Items to a List
// ───────────────────────────────────────────────────────────────
// Input + button. Type a name, click Add, it appears in a list below.
//
// RENDERS: Input + Add button + <ul> of names
// BEHAVIOR: Type → click Add (or Enter) → name appears in list → input clears
//
// KEY INSIGHT: Spread to add [...prev, newItem]. Clear input after add.
//
// STATE → items (array), inputValue (string)
// RENDER → input + button + list
// HANDLERS → handleAdd, handleInputChange
// ───────────────────────────────────────────────────────────────

export function R6_AddToList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), text: input.trim() }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add item..."
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

// 🔥 R6 Curveball: "Don't allow duplicate entries"
export function R6_AddToListNoDupes() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (items.some(item => item.text.toLowerCase() === trimmed.toLowerCase())) {
      setError("Item already exists!");
      return;
    }
    setItems(prev => [...prev, { id: Date.now(), text: trimmed }]);
    setInput("");
    setError("");
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
      <button onClick={handleAdd}>Add</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>{items.map(item => <li key={item.id}>{item.text}</li>)}</ul>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R7 ⭐ | Delete from List
// ───────────────────────────────────────────────────────────────
// Render a list with a delete button next to each item.
//
// RENDERS: <ul> with each <li> having text + X button
// BEHAVIOR: Click X → item removed from list
//
// KEY INSIGHT: filter(item => item.id !== idToRemove)
// NEVER mutate state directly. filter() returns a new array.
//
// STATE → items (array)
// RENDER → items.map with delete button
// HANDLERS → handleDelete(id)
// ───────────────────────────────────────────────────────────────

export function R7_DeleteFromList() {
  const [items, setItems] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build a project" },
    { id: 3, text: "Get a job" },
  ]);

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.text}
          <button onClick={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>✕</button>
        </li>
      ))}
    </ul>
  );
}

// 🔥 R7 Curveball: "Why onClick={() => handleDelete(item.id)} and not onClick={handleDelete(item.id)}?"
// Answer: Without the arrow function, handleDelete(item.id) would EXECUTE immediately
// during render, not on click. The arrow function creates a closure that runs on click.
// Alternative: onClick={handleDelete.bind(null, item.id)} — but arrow is cleaner.


// ───────────────────────────────────────────────────────────────
// R8 ⭐ | Toggle Item in List (Strikethrough)
// ───────────────────────────────────────────────────────────────
// Render a list of tasks. Click a task to toggle its done status.
//
// RENDERS: <ul> with each <li> clickable, struck-through if done
// BEHAVIOR: Click → toggles strikethrough
//
// KEY INSIGHT: map + spread to update ONE item in array
// This is the CORE pattern for updating objects inside arrays.
//
// STATE → tasks (array of { id, text, done })
// RENDER → tasks.map with conditional style
// HANDLERS → handleToggle(id)
// ───────────────────────────────────────────────────────────────

export function R8_ToggleListItem() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy groceries", done: false },
    { id: 2, text: "Clean house", done: false },
    { id: 3, text: "Walk the dog", done: true },
  ]);

  const handleToggle = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map(task => (
        <li
          key={task.id}
          onClick={() => handleToggle(task.id)}
          style={{
            textDecoration: task.done ? "line-through" : "none",
            cursor: "pointer",
            padding: "4px 0",
            color: task.done ? "#999" : "#000",
          }}
        >
          {task.done ? "☑" : "☐"} {task.text}
        </li>
      ))}
    </ul>
  );
}

// 🔥 R8 Curveball: "Show a count of completed vs total"
// Just add below the list:
// <p>{tasks.filter(t => t.done).length} / {tasks.length} completed</p>


// ───────────────────────────────────────────────────────────────
// R9 ⭐ | Simple Form — Two Fields
// ───────────────────────────────────────────────────────────────
// Build a form with name + email. Display values below as you type.
//
// RENDERS: 2 inputs + live preview
// BEHAVIOR: Type → see values update in real time below the form
//
// KEY INSIGHT: Single state object + computed property name [name]: value
// This pattern handles ANY number of form fields with ONE handler.
//
// STATE → form: { name: "", email: "" }
// RENDER → 2 inputs + display
// HANDLERS → handleChange (shared for both fields)
// ───────────────────────────────────────────────────────────────

export function R9_SimpleForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div>
        <label>Name: <input name="name" value={form.name} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Email: <input name="email" value={form.email} onChange={handleChange} /></label>
      </div>
      <hr />
      <p>Name: {form.name || "—"}</p>
      <p>Email: {form.email || "—"}</p>
    </div>
  );
}

// 🔥 R9 Curveball: "Add validation — email must contain @"
export function R9_FormWithValidation() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Inline validation
    if (name === "email") {
      setErrors(prev => ({
        ...prev,
        email: value && !value.includes("@") ? "Must contain @" : "",
      }));
    }
  };

  return (
    <div>
      <div>
        <label>Name: <input name="name" value={form.name} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Email: <input name="email" value={form.email} onChange={handleChange} /></label>
        {errors.email && <p style={{ color: "red", margin: 0 }}>{errors.email}</p>}
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R10 ⭐ | useEffect — Document Title
// ───────────────────────────────────────────────────────────────
// Counter that updates the browser tab title with the current count.
//
// RENDERS: Counter + buttons
// BEHAVIOR: Tab title shows "Count: N" as you click
//
// KEY INSIGHT: useEffect with [count] dependency — runs when count changes
// This is THE simplest useEffect example. Master this first.
//
// STATE → count
// RENDER → count + buttons
// HANDLERS → increment
// EFFECT → document.title update
// ───────────────────────────────────────────────────────────────

export function R10_DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

// 🔥 R10 Curveball: "Clean up the title when component unmounts"
// useEffect(() => {
//   document.title = `Count: ${count}`;
//   return () => { document.title = "React App"; }; // cleanup
// }, [count]);


// ───────────────────────────────────────────────────────────────
// R11 ⭐ | useRef — Focus Input
// ───────────────────────────────────────────────────────────────
// Input + "Focus" button. Clicking button focuses the input.
// Input also auto-focuses on mount.
//
// RENDERS: Input + Focus button
// BEHAVIOR: Button click → input gets focus. Also focuses on mount.
//
// KEY INSIGHT: useRef creates a ref → attach via ref={inputRef} → access .current
// useRef does NOT cause re-renders. It's a mutable container.
//
// STATE → none (ref is not state)
// RENDER → input with ref + button
// HANDLERS → focus button click
// EFFECT → auto-focus on mount
// ───────────────────────────────────────────────────────────────

export function R11_FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // auto-focus on mount
  }, []);

  return (
    <div>
      <input ref={inputRef} placeholder="I auto-focus!" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </div>
  );
}

// 🔥 R11 Curveball: "What's the difference between useRef and useState?"
// useState: holds value + triggers re-render on change
// useRef: holds value + does NOT trigger re-render. Persists across renders.
// Use ref for: DOM access, storing mutable values (timers, previous values)


// ───────────────────────────────────────────────────────────────
// R12 ⭐ | Conditional Rendering — Loading/Error/Data
// ───────────────────────────────────────────────────────────────
// Simulate an API call. Show loading → data or error.
//
// RENDERS: Loading spinner → success message OR error message
// BEHAVIOR: On mount, simulate a 1.5s fetch, then show data
//
// KEY INSIGHT: Three states — loading, error, data. Render based on which is set.
// This is the pattern for EVERY data-fetching component.
//
// STATE → { data, loading, error }
// RENDER → if loading → spinner, if error → message, if data → content
// EFFECT → simulate fetch on mount
// ───────────────────────────────────────────────────────────────

export function R12_LoadingState() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate success (change to setError("Failed!") to test error path)
      setData({ name: "Tijo", role: "Senior React Dev" });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return <p>Welcome, {data.name} ({data.role})</p>;
}

// 🔥 R12 Curveball: "Add a retry button on error"
export function R12_WithRetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setData({ name: "Tijo" });
      } else {
        setError("Network error");
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={fetchData}>Retry</button>
    </div>
  );
  return <p>Hello, {data.name}</p>;
}


// ───────────────────────────────────────────────────────────────
// R13 ⭐ | Select Dropdown — Controlled
// ───────────────────────────────────────────────────────────────
// A dropdown that selects a color and changes the background.
//
// RENDERS: <select> + a div whose background changes
// BEHAVIOR: Pick color from dropdown → div background updates
//
// KEY INSIGHT: Same as controlled input — value={state} + onChange
// <select> is just another controlled element in React.
//
// STATE → selectedColor (string)
// RENDER → select + colored div
// HANDLERS → onChange
// ───────────────────────────────────────────────────────────────

export function R13_ControlledSelect() {
  const [color, setColor] = useState("tomato");

  return (
    <div>
      <select value={color} onChange={e => setColor(e.target.value)}>
        <option value="tomato">Tomato</option>
        <option value="steelblue">Steel Blue</option>
        <option value="gold">Gold</option>
        <option value="mediumseagreen">Sea Green</option>
      </select>
      <div style={{
        width: 100, height: 100, backgroundColor: color,
        marginTop: 8, borderRadius: 8,
      }} />
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R14 ⭐ | Search Filter
// ───────────────────────────────────────────────────────────────
// Filter a list of items as the user types in a search box.
//
// RENDERS: Search input + filtered list
// BEHAVIOR: Type → list filters in real time (case-insensitive)
//
// KEY INSIGHT: Derive filtered list from state — don't store filtered list separately.
// const filtered = items.filter(i => i.includes(query))
// This is a DERIVED VALUE, not separate state.
//
// STATE → query (string), items is static
// RENDER → input + filtered list
// HANDLERS → onChange updates query
// ───────────────────────────────────────────────────────────────

export function R14_SearchFilter() {
  const [query, setQuery] = useState("");

  const items = ["Apple", "Banana", "Cherry", "Dragonfruit", "Elderberry", "Fig", "Grape"];

  const filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search fruits..."
      />
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
      {filtered.length === 0 && <p>No results found.</p>}
    </div>
  );
}

// 🔥 R14 Curveball: "What if the list has 10,000 items?"
// Answer: Debounce the search input (useEffect + setTimeout) and/or
// use useMemo to memoize the filtered result:
// const filtered = useMemo(() => items.filter(...), [query, items]);
// For 10k+ items: use virtualization (react-window or TanStack Virtual)


// ───────────────────────────────────────────────────────────────
// R15 ⭐ | Tabs Component
// ───────────────────────────────────────────────────────────────
// Tabs that switch content panels. Click a tab → show its content.
//
// RENDERS: Row of tab buttons + content area
// BEHAVIOR: Click tab → content switches. Active tab highlighted.
//
// KEY INSIGHT: activeTab state (index or id) + conditional content render
// Map over tabs to render buttons, use activeTab to show content.
//
// STATE → activeTab (number — index of active tab)
// RENDER → tab buttons + content for activeTab
// HANDLERS → setActiveTab on click
// ───────────────────────────────────────────────────────────────

export function R15_Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Home", content: "Welcome to the Home tab!" },
    { label: "Profile", content: "This is your profile." },
    { label: "Settings", content: "Adjust your settings here." },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 0 }}>
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            style={{
              padding: "8px 16px",
              backgroundColor: activeTab === index ? "#3b82f6" : "#e5e7eb",
              color: activeTab === index ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 16, border: "1px solid #e5e7eb" }}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

// 🔥 R15 Curveball: "What if tabs have different components, not just text?"
// Replace content strings with components:
// { label: "Home", content: <HomePanel /> }
// Or use children pattern: <Tab label="Home"><HomePanel /></Tab>


// ───────────────────────────────────────────────────────────────
// R16 ⭐ | Accordion (Show/Hide Sections)
// ───────────────────────────────────────────────────────────────
// List of FAQ items. Click a question → toggle answer visibility.
//
// RENDERS: List of questions. Clicked question shows/hides answer.
// BEHAVIOR: Click question → toggle. Only ONE open at a time.
//
// KEY INSIGHT: activeIndex state. If clicked index === activeIndex, close it (set null).
// Otherwise open the new one.
//
// STATE → activeIndex (number | null)
// RENDER → questions mapped, answer shown if index matches
// HANDLERS → toggle on click
// ───────────────────────────────────────────────────────────────

export function R16_Accordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: "What is React?", a: "A JavaScript library for building user interfaces." },
    { q: "What is JSX?", a: "A syntax extension that looks like HTML but compiles to React.createElement calls." },
    { q: "What are hooks?", a: "Functions that let you use state and lifecycle features in function components." },
  ];

  const toggle = (index) => {
    setActiveIndex(prev => prev === index ? null : index);
  };

  return (
    <div>
      {faqs.map((faq, index) => (
        <div key={index} style={{ borderBottom: "1px solid #ddd" }}>
          <button
            onClick={() => toggle(index)}
            style={{
              width: "100%", textAlign: "left", padding: 12,
              background: "none", border: "none", cursor: "pointer",
              fontWeight: "bold", fontSize: 16,
            }}
          >
            {activeIndex === index ? "▼" : "▶"} {faq.q}
          </button>
          {activeIndex === index && (
            <div style={{ padding: "0 12px 12px" }}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// 🔥 R16 Curveball: "Allow multiple sections open at once"
export function R16_AccordionMultiple() {
  const [openIndexes, setOpenIndexes] = useState(new Set());

  const faqs = [
    { q: "What is React?", a: "A JS library for building UIs." },
    { q: "What is JSX?", a: "Syntax extension that compiles to createElement." },
    { q: "What are hooks?", a: "Functions for state and lifecycle in function components." },
  ];

  const toggle = (index) => {
    setOpenIndexes(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div>
      {faqs.map((faq, index) => (
        <div key={index} style={{ borderBottom: "1px solid #ddd" }}>
          <button onClick={() => toggle(index)} style={{
            width: "100%", textAlign: "left", padding: 12,
            background: "none", border: "none", cursor: "pointer", fontWeight: "bold",
          }}>
            {openIndexes.has(index) ? "▼" : "▶"} {faq.q}
          </button>
          {openIndexes.has(index) && <div style={{ padding: "0 12px 12px" }}>{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}


// ───────────────────────────────────────────────────────────────
// R17 ⭐ | Temperature Converter
// ───────────────────────────────────────────────────────────────
// Two inputs: Celsius and Fahrenheit. Changing one updates the other.
//
// RENDERS: 2 inputs side by side
// BEHAVIOR: Type in C → F updates. Type in F → C updates.
//
// KEY INSIGHT: Single source of truth. Store ONE value + which field is active.
// Or: just store celsius and compute fahrenheit (simpler).
//
// STATE → celsius (string — NOT number, because input values are strings)
// RENDER → 2 inputs, fahrenheit is derived
// HANDLERS → update celsius from either direction
// ───────────────────────────────────────────────────────────────

export function R17_TempConverter() {
  const [celsius, setCelsius] = useState("");

  const toF = (c) => c === "" ? "" : ((parseFloat(c) * 9/5) + 32).toFixed(1);
  const toC = (f) => f === "" ? "" : ((parseFloat(f) - 32) * 5/9).toFixed(1);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <label>
        °C: <input
          value={celsius}
          onChange={e => setCelsius(e.target.value)}
          type="number"
        />
      </label>
      <label>
        °F: <input
          value={toF(celsius)}
          onChange={e => setCelsius(toC(e.target.value))}
          type="number"
        />
      </label>
    </div>
  );
}

// 🔥 R17 Curveball: "This is the 'lifting state up' pattern from React docs.
// One source of truth, shared between two inputs that derive from each other."


// ───────────────────────────────────────────────────────────────
// R18 ⭐ | Timer / Stopwatch
// ───────────────────────────────────────────────────────────────
// A timer that counts seconds. Start, Stop, Reset buttons.
//
// RENDERS: Time display + 3 buttons
// BEHAVIOR: Start → counts up. Stop → pauses. Reset → back to 0.
//
// KEY INSIGHT: useRef for the interval ID (not state — no re-render needed).
// setInterval + cleanup with clearInterval.
//
// STATE → seconds (number), isRunning (boolean)
// RENDER → formatted time + buttons
// HANDLERS → start, stop, reset
// REF → intervalRef (to store interval ID)
// ───────────────────────────────────────────────────────────────

export function R18_Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div>
      <h2>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</h2>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={stop} disabled={!isRunning}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// 🔥 R18 Curveball: "Why useRef for the interval, not useState?"
// If you stored intervalId in useState, every setInterval would trigger a re-render.
// useRef.current can be mutated WITHOUT causing re-renders.
// Also: you need the SAME reference to clearInterval later — state would give you stale values.


// ───────────────────────────────────────────────────────────────
// R19 ⭐ | Children Prop — Card Wrapper
// ───────────────────────────────────────────────────────────────
// A reusable Card component that wraps any content.
//
// RENDERS: A styled container around whatever children are passed
// BEHAVIOR: Pure composition — no state needed
//
// KEY INSIGHT: {children} is whatever you put between <Card>...</Card>
// This is React composition. The building block of reusable components.
//
// STATE → none
// RENDER → styled wrapper + {children}
// HANDLERS → none
// ───────────────────────────────────────────────────────────────

export function R19_Card({ title, children }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 8,
      padding: 16, marginBottom: 12,
    }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
}

// Usage:
// <R19_Card title="User Info">
//   <p>Name: Tijo</p>
//   <p>Role: Developer</p>
// </R19_Card>

// 🔥 R19 Curveball: "What's the difference between children and render props?"
// children = static content passed between tags
// render prop = a FUNCTION passed as prop that returns JSX
// <Card renderHeader={() => <h3>Custom Header</h3>}>...</Card>
// Use children for simple cases, render props when child needs parent data.


// ───────────────────────────────────────────────────────────────
// R20 ⭐ | Todo App — Add + Toggle + Delete (THE INTERVIEW CLASSIC)
// ───────────────────────────────────────────────────────────────
// This is the MOST ASKED React interview question.
// You failed this at Wipro AND UST. Make it AUTOMATIC.
//
// RENDERS: Input + Add button + list of todos with toggle + delete
// BEHAVIOR:
//   - Type + Enter (or click Add) → adds todo
//   - Click todo text → toggles strikethrough
//   - Click X → deletes todo
//   - Input clears after adding
//
// KEY INSIGHT: This combines R6 (add) + R7 (delete) + R8 (toggle).
// If you can do those 3, you can do this. It's NOT hard.
// The reason you freeze is you try to think about ALL of it at once.
// Instead: STATE first, then RENDER, then HANDLERS. One step at a time.
//
// STATE → todos: [{ id, text, done }], input: ""
// RENDER → input + button + todos.map(...)
// HANDLERS → add, toggle, delete
//
// ⏱️ TARGET: Under 5 minutes from blank file. Rehearse until automatic.
// ───────────────────────────────────────────────────────────────

export function R20_TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // HANDLER: Add
  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  // HANDLER: Toggle
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // HANDLER: Delete
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Todo App</h2>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.done ? "line-through" : "none",
                cursor: "pointer",
                flex: 1,
                color: todo.done ? "#999" : "#000",
              }}
            >
              {todo.done ? "☑" : "☐"} {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <p>{todos.filter(t => t.done).length}/{todos.length} completed</p>
      )}
    </div>
  );
}

// 🔥 R20 Curveball 1: "Add edit functionality"
// On double-click → turn text into input → edit → blur or Enter saves
export function R20_TodoWithEdit() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    setTodos(prev => prev.map(t => t.id === editingId ? { ...t, text: editText } : t));
    setEditingId(null);
    setEditText("");
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()} placeholder="Add..." />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            {editingId === todo.id ? (
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveEdit()}
                onBlur={saveEdit}
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(todo)}
                style={{ textDecoration: todo.done ? "line-through" : "none", flex: 1, cursor: "pointer" }}
              >
                {todo.text}
              </span>
            )}
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🔥 R20 Curveball 2: "Add filter: All / Active / Completed"
export function R20_TodoWithFilter() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // DERIVED STATE — not stored separately
  const filteredTodos = todos.filter(t => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  return (
    <div style={{ maxWidth: 400 }}>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()} placeholder="Add..." />
        <button onClick={addTodo}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        {["all", "active", "completed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontWeight: filter === f ? "bold" : "normal",
              textDecoration: filter === f ? "underline" : "none",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.done ? "line-through" : "none", cursor: "pointer", flex: 1 }}
            >
              {todo.done ? "☑" : "☐"} {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p>{todos.filter(t => !t.done).length} items left</p>
    </div>
  );
}

// 🔥 R20 Curveball 3: "Persist todos to localStorage"
// See useLocalStorage pattern in Tier 2 (custom hooks section)


// ═══════════════════════════════════════════════════════════════
//  TIER 1 COMPLETE — SUMMARY OF WHAT YOU CAN NOW BUILD:
// ═══════════════════════════════════════════════════════════════
//
//  R1  Counter              → useState + updater form
//  R2  Toggle               → boolean state + conditional rendering
//  R3  Controlled Input     → value + onChange (THE fundamental pattern)
//  R4  List Rendering       → .map() + key={id}
//  R5  Status Badge         → config object + conditional render
//  R6  Add to List          → [...prev, newItem]
//  R7  Delete from List     → prev.filter(i => i.id !== id)
//  R8  Toggle in List       → prev.map(i => i.id === id ? {...i, done: !i.done} : i)
//  R9  Form (object state)  → { ...prev, [name]: value }
//  R10 useEffect            → side effects + dependency array
//  R11 useRef               → DOM access + mutable container
//  R12 Loading/Error/Data   → 3-state pattern for data fetching
//  R13 Select               → controlled dropdown
//  R14 Search Filter        → derived state (filter, don't store)
//  R15 Tabs                 → activeIndex state
//  R16 Accordion            → activeIndex with toggle-to-close
//  R17 Temp Converter       → single source of truth + derived values
//  R18 Timer                → useRef for interval ID + cleanup
//  R19 Card (children)      → composition pattern
//  R20 Todo App             → R6 + R7 + R8 combined (THE interview question)
//
//  🧠 PATTERNS COVERED:
//  ✅ Controlled inputs (text, select, checkbox)
//  ✅ List operations (add, delete, toggle, filter)
//  ✅ Conditional rendering (&&, ternary, config object)
//  ✅ useState (primitives, objects, arrays)
//  ✅ useEffect (mount, dependency, cleanup)
//  ✅ useRef (DOM + mutable values)
//  ✅ children prop (composition)
//  ✅ Derived state (filter/compute from state, don't store separately)
//  ✅ Event handling (onClick, onChange, onKeyDown)
//
//  🔥 CURVEBALL PATTERNS COVERED:
//  ✅ Step size counter
//  ✅ Fade animation (CSS transition + state)
//  ✅ Character limit
//  ✅ Duplicate prevention
//  ✅ Inline validation
//  ✅ Retry on error
//  ✅ Multiple accordion (Set-based state)
//  ✅ Todo with edit (double-click inline edit)
//  ✅ Todo with filter (derived filtered list)
//
// ═══════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────
// R21 ⭐⭐⭐ | Sort + Filter + Search (THE classic interview combo)
// ───────────────────────────────────────────────────────────────
// Build a product list with:
//   1. Search by name (text input)
//   2. Filter by category (dropdown)
//   3. Sort by price (asc/desc toggle)
//
// KEY INSIGHT: All three are DERIVED STATE — chain .filter().filter().sort()
//   on the original array. NEVER mutate or store filtered results separately.
//
// STATE → search (string), category (string), sortOrder ("asc"|"desc")
// RENDER → search input + category select + sort button + filtered list
// HANDLERS → setSearch, setCategory, toggleSort
//
// 🧠 MENTAL MODEL:
//   products → filter by search → filter by category → sort by price → render
//   Think of it as a pipeline. Each step narrows/reorders the list.
// ───────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 29.99 },
  { id: 2, name: "Running Shoes", category: "Sports", price: 89.99 },
  { id: 3, name: "USB-C Cable", category: "Electronics", price: 12.99 },
  { id: 4, name: "Yoga Mat", category: "Sports", price: 34.99 },
  { id: 5, name: "Desk Lamp", category: "Home", price: 45.99 },
  { id: 6, name: "Bluetooth Speaker", category: "Electronics", price: 59.99 },
  { id: 7, name: "Water Bottle", category: "Sports", price: 19.99 },
  { id: 8, name: "Throw Pillow", category: "Home", price: 24.99 },
];

export function R21_SortFilterSearch() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  // Step 1: Get unique categories for the dropdown
  const categories = ["all", ...new Set(PRODUCTS.map(p => p.category))];

  // Step 2: PIPELINE — filter by search → filter by category → sort
  const displayedProducts = PRODUCTS
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "all" || p.category === category)
    .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Products</h2>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      {/* Filter + Sort controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>

        <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}>
          Price {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Results */}
      {displayedProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayedProducts.map(p => (
            <li key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <strong>{p.name}</strong> — ${p.price.toFixed(2)}
              <span style={{ color: "#888", marginLeft: 8 }}>({p.category})</span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ color: "#666" }}>
        Showing {displayedProducts.length} of {PRODUCTS.length} products
      </p>
    </div>
  );
}

// 🔥 R21 Curveball 1: "Add sort by name as well"
// Add a sortBy state: "price" | "name", then switch the .sort() comparator
export function R21_MultiSort() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price"); // "price" | "name"
  const [sortOrder, setSortOrder] = useState("asc");

  const categories = ["all", ...new Set(PRODUCTS.map(p => p.category))];

  const displayedProducts = PRODUCTS
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "all" || p.category === category)
    .sort((a, b) => {
      let cmp;
      if (sortBy === "price") {
        cmp = a.price - b.price;
      } else {
        cmp = a.name.localeCompare(b.name);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Products (Multi-Sort)</h2>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="price">Sort by Price</option>
          <option value="name">Sort by Name</option>
        </select>
        <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {displayedProducts.map(p => (
          <li key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{p.name}</strong> — ${p.price.toFixed(2)}
            <span style={{ color: "#888", marginLeft: 8 }}>({p.category})</span>
          </li>
        ))}
      </ul>
      <p style={{ color: "#666" }}>Showing {displayedProducts.length} of {PRODUCTS.length}</p>
    </div>
  );
}

// 🔥 R21 Curveball 2: "Debounce the search input"
// Combines search/filter/sort with a debounced search for performance
export function R21_DebouncedSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // Debounce: update debouncedSearch 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer); // cleanup on each keystroke
  }, [search]);

  const categories = ["all", ...new Set(PRODUCTS.map(p => p.category))];

  const displayedProducts = PRODUCTS
    .filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .filter(p => category === "all" || p.category === category)
    .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Products (Debounced)</h2>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
        <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}>
          Price {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
      {search !== debouncedSearch && <p style={{ color: "#aaa" }}>Searching...</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {displayedProducts.map(p => (
          <li key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{p.name}</strong> — ${p.price.toFixed(2)}
            <span style={{ color: "#888", marginLeft: 8 }}>({p.category})</span>
          </li>
        ))}
      </ul>
      <p style={{ color: "#666" }}>Showing {displayedProducts.length} of {PRODUCTS.length}</p>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  🏖️ CODESANDBOX QUICK-PASTE TEMPLATE
// ═══════════════════════════════════════════════════════════════
//
//  For any drill above, paste this into App.js in CodeSandbox:
//
//  ┌──────────────────────────────────────────────────────────┐
//  │  import { useState, useEffect, useRef } from "react";   │
//  │                                                          │
//  │  // Paste the component function here                    │
//  │                                                          │
//  │  export default function App() {                         │
//  │    return (                                               │
//  │      <div style={{ padding: 20 }}>                       │
//  │        <ComponentName />                                  │
//  │      </div>                                               │
//  │    );                                                     │
//  │  }                                                        │
//  └──────────────────────────────────────────────────────────┘
//
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
//  HIGHER TIERS → SEPARATE FILES:
//
//  ⭐⭐    → 08-react-drills-TIER2-SOLUTIONS.jsx (R21-R35)
//             useReducer, Context, custom hooks, File Explorer,
//             Nested Boxes, Modal, Pagination, Autocomplete...
//
//  ⭐⭐⭐  → 09-react-drills-TIER3-SOLUTIONS.jsx (R36-R45)
//             React.memo, Error Boundary, Mini Redux, HOC,
//             Compound Components, Infinite Scroll, Validated Form...
//
//  ⭐⭐⭐⭐/⭐⭐⭐⭐⭐ → 10-react-drills-TIER4-SOLUTIONS.jsx (R46-R52)
//             Data Table, Shopping Cart, Kanban, Auth Flow,
//             Chat UI, CRUD App, Stacked Modals
// ═══════════════════════════════════════════════════════════════
