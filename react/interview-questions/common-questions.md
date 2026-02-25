# React Interview Questions

## 1. What is the Virtual DOM and how does it work?

The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new virtual DOM tree and diffs it against the previous one (reconciliation). Only the minimal set of actual DOM mutations needed are applied. This is faster than directly manipulating the DOM because DOM operations are expensive, while JS object comparisons are cheap.

## 2. Explain React's reconciliation algorithm.

When state/props change, React builds a new element tree and compares it with the previous one:

- **Different element types** → tear down old tree, build new one
- **Same element type** → keep the DOM node, update only changed attributes
- **Lists** → uses `key` prop to match children across renders

React uses heuristics (O(n) instead of O(n³)) by assuming:
1. Elements of different types produce different trees
2. Keys hint which children are stable across renders

## 3. What are the rules of hooks?

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions. React relies on call order to associate state with each hook.
2. **Only call hooks from React functions** — function components or custom hooks, not regular JS functions.

Breaking rule #1 example (bad):
```jsx
if (loggedIn) {
  useEffect(() => { ... }); // ❌ conditional hook call
}
```

## 4. Why does useEffect need a cleanup function?

The cleanup function runs before:
- The effect re-runs (when dependencies change)
- The component unmounts

It prevents memory leaks and stale behavior:
```jsx
useEffect(() => {
  const sub = api.subscribe(id);
  return () => sub.unsubscribe(); // cleanup
}, [id]);
```

Without cleanup, the old subscription stays active when `id` changes, leaking memory and causing bugs.

## 5. Why is the `key` prop important in lists?

Keys let React identify which items changed, were added, or removed. Without stable keys, React uses index by default, which causes:
- **State mismatches** when items are reordered
- **Unnecessary re-renders** when items are inserted/removed
- **Lost input state** in form elements inside list items

Always use a unique, stable identifier (like `id`), never array index for dynamic lists.

## 6. Controlled vs Uncontrolled components?

| | Controlled | Uncontrolled |
|---|---|---|
| State owner | React (useState) | DOM (ref) |
| Value source | `value={state}` | `defaultValue` |
| Updates | `onChange` handler | Read via ref |
| Validation | On every change | On submit |

Controlled is preferred because React is the single source of truth. Uncontrolled is useful for integrating with non-React code or simple forms where you only need the value on submit.

## 7. React.memo vs useMemo vs useCallback?

- **React.memo(Component)** — wraps a component; skips re-render if props are shallowly equal
- **useMemo(() => value, [deps])** — memoizes a computed value; recalculates only when deps change
- **useCallback(fn, [deps])** — memoizes a function reference; same function identity unless deps change

They work together: memo on the child, useMemo/useCallback on the props you pass to it. Without memoized props, memo is defeated by new object/function references.

## 8. What are Server Components?

Server Components run exclusively on the server and send rendered output (not JavaScript) to the client. Benefits:
- Zero bundle size impact
- Direct access to databases/filesystems
- Automatic code splitting

Trade-offs:
- No hooks (useState, useEffect)
- No event handlers
- No browser APIs

Use Server Components for data fetching and static content. Use Client Components (`"use client"`) for interactivity.

## 9. Explain the difference between useEffect and useLayoutEffect.

Both run after render, but timing differs:

- **useEffect** — runs asynchronously after the browser paints. Non-blocking. Use for data fetching, subscriptions, logging.
- **useLayoutEffect** — runs synchronously after DOM mutations but before the browser paints. Blocks painting. Use for measuring DOM elements or preventing visual flicker.

99% of the time, useEffect is correct. Use useLayoutEffect only when you need to read/modify DOM before the user sees the update.

## 10. How do you optimize React performance?

1. **React.memo** — prevent unnecessary child re-renders
2. **useMemo / useCallback** — stabilize references passed as props
3. **Code splitting** — React.lazy + Suspense for on-demand loading
4. **Virtualization** — react-window for long lists (only render visible items)
5. **State colocation** — keep state close to where it's used (avoid lifting too high)
6. **Avoid inline objects/arrays** in JSX — they create new references every render

Measure first with React DevTools Profiler. Don't optimize without evidence.

## 11. What is the Context API and when should you avoid it?

Context provides a way to pass data through the component tree without prop drilling. Created with `createContext`, provided with `<Context.Provider>`, consumed with `useContext`.

**Avoid Context when:**
- Data changes frequently (every keystroke, every frame) — all consumers re-render on every change
- You need complex state logic — use a state manager (Zustand, Redux)
- Simple prop drilling works fine (2-3 levels deep)

**Context is good for:**
- Theme, locale, auth status — values that change infrequently
- Compound component patterns (Accordion, Tabs)

## 12. What happens when you call setState? Walk through the render cycle.

1. **setState called** → React schedules a re-render (batched in React 18+)
2. **Render phase** → React calls the component function, producing a new element tree
3. **Reconciliation** → React diffs new tree vs previous tree
4. **Commit phase** → React applies minimal DOM mutations
5. **useLayoutEffect runs** (synchronously, before paint)
6. **Browser paints** the updated DOM
7. **useEffect runs** (asynchronously, after paint)

In React 18+, multiple setState calls in the same event are batched into a single re-render, even in async handlers (this was only true for React event handlers in React 17).
