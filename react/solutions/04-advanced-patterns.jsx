// =============================================================================
// 04 — Advanced Patterns — SOLUTIONS
// =============================================================================

import React, {
  createContext,
  useContext,
  useState,
  memo,
  useMemo,
  useCallback,
  Component,
} from "react";

// =============================================================================
// Exercise 1 — Context API: Theme Switcher
// =============================================================================

const ThemeContext = createContext();

const themes = {
  light: { background: "#ffffff", text: "#1a1a1a", border: "#e5e5e5" },
  dark: { background: "#1a1a1a", text: "#f5f5f5", border: "#333333" },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  const value = useMemo(() => ({ theme, colors: themes[theme], toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemedPage() {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <div style={{ background: colors.background, color: colors.text, padding: 32, minHeight: "100vh" }}>
      <h1>Themed Page</h1>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

// Usage:
// <ThemeProvider><ThemedPage /></ThemeProvider>

// Explanation:
// Context avoids prop drilling. useMemo on the value object prevents
// unnecessary re-renders of consumers. The custom useTheme hook provides
// a clean API and error checking.

// =============================================================================
// Exercise 2 — Compound Components: Accordion
// =============================================================================

const AccordionContext = createContext();
const AccordionItemContext = createContext();

export function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ children, index }) {
  return (
    <AccordionItemContext.Provider value={{ index }}>
      <div style={{ borderBottom: "1px solid #eee" }}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

Accordion.Header = function AccordionHeader({ children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const { index } = useContext(AccordionItemContext);
  const isOpen = openIndex === index;

  return (
    <button
      onClick={() => setOpenIndex(isOpen ? null : index)}
      style={{
        width: "100%",
        padding: 12,
        textAlign: "left",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontWeight: isOpen ? "bold" : "normal",
      }}
    >
      {children} {isOpen ? "▾" : "▸"}
    </button>
  );
};

Accordion.Panel = function AccordionPanel({ children }) {
  const { openIndex } = useContext(AccordionContext);
  const { index } = useContext(AccordionItemContext);

  if (openIndex !== index) return null;
  return <div style={{ padding: 12 }}>{children}</div>;
};

// Usage:
// <Accordion>
//   <Accordion.Item index={0}>
//     <Accordion.Header>Section 1</Accordion.Header>
//     <Accordion.Panel>Content 1</Accordion.Panel>
//   </Accordion.Item>
//   <Accordion.Item index={1}>
//     <Accordion.Header>Section 2</Accordion.Header>
//     <Accordion.Panel>Content 2</Accordion.Panel>
//   </Accordion.Item>
// </Accordion>

// Explanation:
// Two context layers: AccordionContext shares global state (which item is open),
// AccordionItemContext provides each item's index. This lets Header and Panel
// communicate without explicit props.

// =============================================================================
// Exercise 3 — Render Props: MouseTracker
// =============================================================================

export function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div onMouseMove={handleMouseMove} style={{ height: 300, border: "1px solid #ccc" }}>
      {children(position)}
    </div>
  );
}

// Usage:
// <MouseTracker>
//   {({ x, y }) => <p>Mouse: {x}, {y}</p>}
// </MouseTracker>

// Explanation:
// The render prop pattern lets the consumer decide what to render with the
// shared data. children is a function that receives { x, y }. This pattern
// is less common now that custom hooks exist, but still useful for UI logic.

// =============================================================================
// Exercise 4 — Higher-Order Component (HOC)
// =============================================================================

export function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...rest }) {
    if (isLoading) return <p>Loading...</p>;
    return <WrappedComponent {...rest} />;
  };
}

// Usage:
// function UserList({ users }) {
//   return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
// }
// const UserListWithLoading = withLoading(UserList);
// <UserListWithLoading isLoading={false} users={[{ id: 1, name: "Alice" }]} />

// Explanation:
// An HOC is a function that takes a component and returns a new component.
// It extracts the isLoading prop and passes the rest through. This pattern
// is largely replaced by hooks but appears in older codebases and interviews.

// =============================================================================
// Exercise 5 — Error Boundary
// =============================================================================

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, border: "2px solid red", borderRadius: 8 }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) throw new Error("Boom! Component exploded.");

  return <button onClick={() => setShouldThrow(true)}>Break this component</button>;
}

// Usage:
// <ErrorBoundary>
//   <BuggyComponent />
// </ErrorBoundary>

// Explanation:
// Error boundaries must be class components — there's no hook equivalent.
// getDerivedStateFromError updates state to show fallback UI.
// componentDidCatch can log the error. Resetting state re-renders children.

// =============================================================================
// Exercise 6 — React.memo Optimization
// =============================================================================

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log("ExpensiveList rendered");
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
});

export function MemoDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const items = useMemo(() => ["Apple", "Banana", "Cherry"], []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
      <ExpensiveList items={items} />
    </div>
  );
}

// Explanation:
// React.memo does a shallow comparison of props. If items is the same
// reference, ExpensiveList won't re-render when count or text change.
// useMemo ensures the items array keeps the same reference across renders.
// Without useMemo, a new array would be created each render, defeating memo.
