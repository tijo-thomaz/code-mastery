// =============================================================================
// 03 — Custom Hooks
// =============================================================================

import React, { useState, useEffect, useRef } from "react";

// =============================================================================
// Exercise 1 — useLocalStorage 🟡
// Create a hook: useLocalStorage(key, initialValue)
// Returns [storedValue, setValue] — just like useState but persists to
// localStorage. Should read the initial value from localStorage if it exists.
// Handle JSON serialization/deserialization.
// =============================================================================

// TODO: Create useLocalStorage hook
// export function useLocalStorage(key, initialValue) { ... }

// Demo component:
// export function LocalStorageDemo() {
//   const [name, setName] = useLocalStorage("name", "");
//   return <input value={name} onChange={(e) => setName(e.target.value)} />;
// }

// =============================================================================
// Exercise 2 — useFetch 🟡
// Create a hook: useFetch(url)
// Returns { data, loading, error }
// Should fetch data when url changes.
// Should abort the previous request if url changes before it completes.
// Use AbortController for cleanup.
// =============================================================================

// TODO: Create useFetch hook
// export function useFetch(url) { ... }

// Demo component:
// export function FetchDemo() {
//   const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts/1");
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// }

// =============================================================================
// Exercise 3 — useDebounce 🟡
// Create a hook: useDebounce(value, delay)
// Returns the debounced value — only updates after `delay` ms of inactivity.
// =============================================================================

// TODO: Create useDebounce hook
// export function useDebounce(value, delay) { ... }

// Demo component:
// export function DebounceDemo() {
//   const [text, setText] = useState("");
//   const debouncedText = useDebounce(text, 500);
//   return (
//     <div>
//       <input value={text} onChange={(e) => setText(e.target.value)} />
//       <p>Debounced: {debouncedText}</p>
//     </div>
//   );
// }

// =============================================================================
// Exercise 4 — useToggle 🟢
// Create a hook: useToggle(initialValue = false)
// Returns [value, toggle, setTrue, setFalse]
// toggle() flips the value, setTrue/setFalse force a specific state.
// =============================================================================

// TODO: Create useToggle hook
// export function useToggle(initialValue = false) { ... }

// =============================================================================
// Exercise 5 — useMediaQuery 🟡
// Create a hook: useMediaQuery(query)
// Accepts a CSS media query string (e.g., "(min-width: 768px)").
// Returns a boolean indicating whether the query matches.
// Listen for changes using matchMedia's change event.
// =============================================================================

// TODO: Create useMediaQuery hook
// export function useMediaQuery(query) { ... }

// Demo component:
// export function MediaQueryDemo() {
//   const isDesktop = useMediaQuery("(min-width: 1024px)");
//   return <p>{isDesktop ? "Desktop view" : "Mobile view"}</p>;
// }

// =============================================================================
// Exercise 6 — usePrevious 🟢
// Create a hook: usePrevious(value)
// Returns the previous value (from the last render).
// Hint: use useRef and useEffect.
// =============================================================================

// TODO: Create usePrevious hook
// export function usePrevious(value) { ... }

// Demo component:
// export function PreviousDemo() {
//   const [count, setCount] = useState(0);
//   const prevCount = usePrevious(count);
//   return (
//     <div>
//       <p>Current: {count}, Previous: {prevCount}</p>
//       <button onClick={() => setCount((c) => c + 1)}>Increment</button>
//     </div>
//   );
// }
