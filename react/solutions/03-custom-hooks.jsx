// =============================================================================
// 03 — Custom Hooks — SOLUTIONS
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";

// =============================================================================
// Exercise 1 — useLocalStorage
// =============================================================================

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Explanation:
// Lazy initializer (function passed to useState) avoids reading localStorage
// on every render — only on mount. useEffect syncs state to localStorage
// whenever key or value changes.

export function LocalStorageDemo() {
  const [name, setName] = useLocalStorage("name", "");
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" />
      <p>Stored: {name}</p>
    </div>
  );
}

// =============================================================================
// Exercise 2 — useFetch
// =============================================================================

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Explanation:
// AbortController cancels in-flight requests when the url changes or the
// component unmounts. We check for AbortError to avoid setting error state
// for intentional cancellations.

export function FetchDemo() {
  const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts/1");
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// =============================================================================
// Exercise 3 — useDebounce
// =============================================================================

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Explanation:
// Each time value changes, we start a timer. The cleanup clears the previous
// timer. Only the last timer fires, updating the debounced value.

export function DebounceDemo() {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type fast..." />
      <p>Debounced: {debouncedText}</p>
    </div>
  );
}

// =============================================================================
// Exercise 4 — useToggle
// =============================================================================

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}

// Explanation:
// useCallback memoizes the functions so they don't change identity between
// renders. This is important if consumers pass them as props to memoized children.

export function ToggleDemo() {
  const [isOpen, toggle, open, close] = useToggle(false);

  return (
    <div>
      <p>Modal is {isOpen ? "open" : "closed"}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
}

// =============================================================================
// Exercise 5 — useMediaQuery
// =============================================================================

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    function handler(e) {
      setMatches(e.matches);
    }

    mql.addEventListener("change", handler);
    setMatches(mql.matches);

    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Explanation:
// window.matchMedia returns a MediaQueryList. We listen for "change" events
// instead of polling. Cleanup removes the listener when query changes or
// the component unmounts.

export function MediaQueryDemo() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div>
      <p>Layout: {isDesktop ? "Desktop" : "Mobile"}</p>
      <p>Theme preference: {prefersDark ? "Dark" : "Light"}</p>
    </div>
  );
}

// =============================================================================
// Exercise 6 — usePrevious
// =============================================================================

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Explanation:
// useRef persists across renders without causing re-renders. useEffect runs
// AFTER render, so ref.current still holds the old value during the current
// render. After the render commits, the effect updates ref to the new value.

export function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count}, Previous: {prevCount ?? "none"}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
