# Failed Interview Questions — React

Track questions you got wrong or struggled with. Review before interviews.

## How to Use

After each interview, add entries for questions you couldn't answer well.
Fill in the correct answer and review periodically.

---

## Entry 1

**Date:** 2026-01-15
**Company:** Acme Corp
**Question:** Why does my useEffect run in an infinite loop when I fetch data and set state?

**My Answer (wrong):** "I think it's because of React's rendering... something with the dependency array?"

**Correct Answer:**
If your useEffect has no dependency array, it runs after every render. Calling setState inside it triggers a re-render, which triggers the effect again → infinite loop.

```jsx
// ❌ Infinite loop
useEffect(() => {
  fetch("/api/data")
    .then((r) => r.json())
    .then((data) => setData(data)); // triggers re-render → effect runs again
}); // no dependency array = runs every render

// ✅ Fix: add dependency array
useEffect(() => {
  fetch("/api/data")
    .then((r) => r.json())
    .then((data) => setData(data));
}, []); // empty array = run once on mount
```

Also watch out for object/array dependencies that look the same but are new references each render — use useMemo to stabilize them.

**Lesson:** Always specify the dependency array. Think about what should trigger re-runs.

---

## Entry 2

**Date:** 2026-02-01
**Company:** TechStart Inc
**Question:** Explain the stale closure problem in React event handlers.

**My Answer (wrong):** "Closures capture variables... but I'm not sure how that causes bugs in React."

**Correct Answer:**
When a function closes over a state variable, it captures the value at the time the closure was created. If that function is used later (e.g., in a setTimeout or event listener set up in useEffect), it sees the stale value.

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ Stale closure: `count` is always 0 here
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps → closure captures count = 0 forever

  // ✅ Fix: use updater function
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1); // reads latest value
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
```

The updater form `setCount(c => c + 1)` doesn't depend on the closure — it receives the current value as an argument.

**Lesson:** Use the updater form of setState when the new value depends on the previous value, especially inside closures that persist across renders.

---

## Template

```
## Entry N

**Date:**
**Company:**
**Question:**

**My Answer (wrong):**

**Correct Answer:**

**Lesson:**
```
