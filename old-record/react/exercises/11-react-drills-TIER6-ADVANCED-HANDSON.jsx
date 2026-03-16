/**
 * ═══════════════════════════════════════════════════════════════════
 * 11 — React Interview Drills — TIER 6 ⭐⭐⭐⭐⭐⭐ ADVANCED HANDS-ON
 * ═══════════════════════════════════════════════════════════════════
 * EXPERION ROUND 2 — "Build this" challenges.
 * These are SENIOR-LEVEL constructions they'll ask you to build live.
 *
 * 🧠 Pattern: State shape → Render → Handlers → Edge cases
 * 🏖️ Each drill self-contained. Paste into CodeSandbox App.js.
 * ⏱️ Practice until you can build each from memory under 15 min.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  useMemo,
  memo,
  createContext,
  useContext,
  useTransition,
} from "react";
import { createPortal } from "react-dom";


// ═══════════════════════════════════════════════════════════════
// R57 ⭐⭐⭐⭐⭐⭐ | Autocomplete with Keyboard Navigation + API
// ═══════════════════════════════════════════════════════════════
// THE MOST ASKED "build this" in senior interviews.
// Combines: debounce, API fetch, keyboard nav, click-outside.
// ───────────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export function R57_AdvancedAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useClickOutside(containerRef, () => setIsOpen(false));

  // Fetch on debounced query change
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        // Filter client-side to simulate search
        const filtered = data.filter((u) =>
          u.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
        setHighlightIndex(-1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery]);

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        if (highlightIndex >= 0) {
          selectItem(results[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const selectItem = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: 300 }}>
      <h3>🔍 Advanced Autocomplete</h3>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search users..."
        style={{ width: "100%", padding: 10, fontSize: 14 }}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {loading && (
        <div style={{ position: "absolute", right: 10, top: 42, color: "#999" }}>
          ⏳
        </div>
      )}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ddd",
            borderTop: "none",
            listStyle: "none",
            padding: 0,
            margin: 0,
            background: "white",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === highlightIndex}
              onClick={() => selectItem(item)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                backgroundColor: i === highlightIndex ? "#e8f0fe" : "white",
              }}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              <div style={{ fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{item.email}</div>
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && results.length === 0 && debouncedQuery && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            padding: 12,
            border: "1px solid #ddd",
            borderTop: "none",
            background: "white",
            color: "#999",
          }}
        >
          No results found
        </div>
      )}
    </div>
  );
}

// 🔥 KEY POINTS TO SAY OUT LOUD:
// "I'm using debounce to avoid API calls on every keystroke"
// "AbortController cancels stale requests — prevents race conditions"
// "Keyboard navigation: ArrowDown/Up changes highlight, Enter selects"
// "useClickOutside custom hook closes dropdown when clicking elsewhere"
// "ARIA attributes for accessibility: combobox, listbox, option"


// ═══════════════════════════════════════════════════════════════
// R58 ⭐⭐⭐⭐⭐⭐ | Compound Tabs Component (Advanced Pattern)
// ═══════════════════════════════════════════════════════════════
// Build a COMPOSABLE Tabs component using Compound Components.
// Parent + children share implicit state via Context.
// This is the pattern used by Radix UI, Headless UI, etc.
// ───────────────────────────────────────────────────────────────

const TabsContext = createContext();

function Tabs({ children, defaultTab, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const handleChange = (tab) => {
    setActiveTab(tab);
    onChange?.(tab);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return (
    <div
      role="tablist"
      style={{ display: "flex", borderBottom: "2px solid #e5e7eb" }}
    >
      {children}
    </div>
  );
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === id;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(id)}
      style={{
        padding: "10px 20px",
        border: "none",
        borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent",
        background: "none",
        color: isActive ? "#3b82f6" : "#666",
        fontWeight: isActive ? 600 : 400,
        cursor: "pointer",
        marginBottom: -2,
      }}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;
  return (
    <div role="tabpanel" style={{ padding: 16 }}>
      {children}
    </div>
  );
}

// Attach sub-components for clean API
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export function R58_CompoundTabs() {
  return (
    <div style={{ maxWidth: 500 }}>
      <h3>🗂️ Compound Tabs</h3>
      <Tabs defaultTab="profile" onChange={(tab) => console.log("Tab:", tab)}>
        <Tabs.List>
          <Tabs.Tab id="profile">👤 Profile</Tabs.Tab>
          <Tabs.Tab id="settings">⚙️ Settings</Tabs.Tab>
          <Tabs.Tab id="notifications">🔔 Notifications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="profile">
          <h4>Profile</h4>
          <p>Name: Tijo Thomaz</p>
          <p>Role: Senior React Developer</p>
        </Tabs.Panel>
        <Tabs.Panel id="settings">
          <h4>Settings</h4>
          <p>Theme: Dark mode</p>
          <p>Language: English</p>
        </Tabs.Panel>
        <Tabs.Panel id="notifications">
          <h4>Notifications</h4>
          <p>Email: Enabled</p>
          <p>Push: Disabled</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

// 🔥 SAY THIS: "Compound components share implicit state via Context.
// The consumer controls composition — what goes where.
// The component controls behavior — how tabs switch.
// It's like <select> and <option> — they work together implicitly.
// This is how Radix UI, Headless UI, and MUI are built internally."


// ═══════════════════════════════════════════════════════════════
// R59 ⭐⭐⭐⭐⭐⭐ | Infinite Scroll with IntersectionObserver
// ═══════════════════════════════════════════════════════════════
// Loads more data when user scrolls to bottom.
// IntersectionObserver > scroll events (more performant).
// ───────────────────────────────────────────────────────────────

function useInfiniteScroll(callback) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [callback]
  );

  return lastElementRef;
}

export function R59_InfiniteScroll() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      text: `Post #${i + 1} — ${["React tips", "JS tricks", "CSS hacks", "Node.js patterns", "TypeScript gems"][i % 5]}`,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setItems((prev) => {
        if (prev.length >= 100) {
          setHasMore(false);
          setLoading(false);
          return prev;
        }
        const next = Array.from({ length: 10 }, (_, i) => ({
          id: prev.length + i + 1,
          text: `Post #${prev.length + i + 1} — ${["React tips", "JS tricks", "CSS hacks", "Node.js patterns", "TypeScript gems"][(prev.length + i) % 5]}`,
        }));
        setLoading(false);
        return [...prev, ...next];
      });
    }, 800);
  }, [loading, hasMore]);

  const lastRef = useInfiniteScroll(loadMore);

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>📜 Infinite Scroll (IntersectionObserver)</h3>
      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={i === items.length - 1 ? lastRef : null}
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <strong>#{item.id}</strong> {item.text}
          </div>
        ))}
        {loading && (
          <div style={{ padding: 16, textAlign: "center", color: "#999" }}>
            Loading more...
          </div>
        )}
        {!hasMore && (
          <div style={{ padding: 16, textAlign: "center", color: "#999" }}>
            ✅ All posts loaded ({items.length} total)
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 SAY THIS: "IntersectionObserver is more performant than scroll events.
// No debouncing needed — it fires only when the element enters the viewport.
// I attach a ref to the LAST element. When it's visible → load more.
// The callback ref pattern ensures the observer reattaches when items change."


// ═══════════════════════════════════════════════════════════════
// R60 ⭐⭐⭐⭐⭐⭐ | Undo/Redo Hook — History Management
// ═══════════════════════════════════════════════════════════════
// Custom hook that wraps any state with undo/redo capability.
// Uses history array + pointer index.
// Shows architecture thinking — reusable, composable hook.
// ───────────────────────────────────────────────────────────────

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];

  const setState = useCallback(
    (newState) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, index + 1);
        const value =
          typeof newState === "function" ? newState(prev[index]) : newState;
        return [...newHistory, value];
      });
      setIndex((i) => i + 1);
    },
    [index]
  );

  const undo = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const redo = useCallback(
    () => setIndex((i) => Math.min(history.length - 1, i + 1)),
    [history.length]
  );

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
}

export function R60_UndoRedoDemo() {
  const {
    state: items,
    setState: setItems,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(["Buy groceries", "Walk the dog"]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    setItems((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>↩️ Undo/Redo Todo</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={undo} disabled={!canUndo}>
          ↩ Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          ↪ Redo
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addItem}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, i) => (
          <li
            key={`${i}-${item}`}
            style={{
              padding: "8px 12px",
              marginBottom: 4,
              background: "#f9fafb",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {item}
            <button
              onClick={() => removeItem(i)}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🔥 SAY THIS: "The undo/redo pattern stores state history as an array
// with a pointer index. setState cuts future history (fork point),
// undo decrements the pointer, redo increments.
// It's reusable — works with any state type: text, arrays, objects."


// ═══════════════════════════════════════════════════════════════
// R61 ⭐⭐⭐⭐⭐⭐ | Multi-Select with Tags + Search
// ═══════════════════════════════════════════════════════════════
// Dropdown with search, multi-select, and tag chips.
// Common UI component asked in "build a component library" interviews.
// ───────────────────────────────────────────────────────────────

const ALL_SKILLS = [
  "React", "Redux", "TypeScript", "Next.js", "Node.js",
  "GraphQL", "Jest", "Tailwind", "Docker", "AWS",
  "Python", "Go", "PostgreSQL", "MongoDB", "Redis",
];

export function R61_MultiSelectTags() {
  const [selected, setSelected] = useState(["React", "TypeScript"]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const filtered = ALL_SKILLS.filter(
    (skill) =>
      !selected.includes(skill) &&
      skill.toLowerCase().includes(search.toLowerCase())
  );

  const addSkill = (skill) => {
    setSelected((prev) => [...prev, skill]);
    setSearch("");
  };

  const removeSkill = (skill) => {
    setSelected((prev) => prev.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && search === "" && selected.length > 0) {
      setSelected((prev) => prev.slice(0, -1));
    }
    if (e.key === "Enter" && filtered.length > 0) {
      addSkill(filtered[0]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ maxWidth: 400 }}>
      <h3>🏷️ Multi-Select with Tags</h3>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          border: `2px solid ${isOpen ? "#3b82f6" : "#ddd"}`,
          borderRadius: 8,
          padding: 6,
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          cursor: "text",
          minHeight: 42,
        }}
      >
        {selected.map((skill) => (
          <span
            key={skill}
            style={{
              background: "#e8f0fe",
              color: "#1d4ed8",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {skill}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              style={{
                border: "none",
                background: "none",
                color: "#1d4ed8",
                cursor: "pointer",
                padding: 0,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? "Select skills..." : ""}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            minWidth: 80,
            padding: 4,
            fontSize: 14,
          }}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <ul
          style={{
            border: "1px solid #ddd",
            borderTop: "none",
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: 200,
            overflowY: "auto",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {filtered.map((skill) => (
            <li
              key={skill}
              onClick={() => addSkill(skill)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: 14,
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filtered.length === 0 && search && (
        <div
          style={{
            padding: 12,
            border: "1px solid #ddd",
            borderTop: "none",
            color: "#999",
            borderRadius: "0 0 8px 8px",
          }}
        >
          No matching skills
        </div>
      )}
      <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
        Selected: {selected.join(", ") || "None"}
      </p>
    </div>
  );
}

// 🔥 SAY THIS: "Tags pattern: selected items as chips with remove.
// Search filters available options. Backspace removes last tag.
// Click-outside closes dropdown. This is how tools like Jira,
// GitHub Labels, and Notion multi-select work."


// ═══════════════════════════════════════════════════════════════
// R62 ⭐⭐⭐⭐⭐⭐ | Virtual List — Render 10,000 Items Smoothly
// ═══════════════════════════════════════════════════════════════
// The key performance optimization for large lists.
// Only renders visible items + buffer. Uses scroll position math.
// This is what react-window does internally.
// ───────────────────────────────────────────────────────────────

function useVirtualList({ itemCount, itemHeight, containerHeight, overscan = 5 }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push({
      index: i,
      style: {
        position: "absolute",
        top: i * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0,
      },
    });
  }

  const totalHeight = itemCount * itemHeight;

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, totalHeight, onScroll };
}

export function R62_VirtualList() {
  const ITEM_COUNT = 10000;
  const ITEM_HEIGHT = 40;
  const CONTAINER_HEIGHT = 400;

  const { visibleItems, totalHeight, onScroll } = useVirtualList({
    itemCount: ITEM_COUNT,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
  });

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>⚡ Virtual List — {ITEM_COUNT.toLocaleString()} Items</h3>
      <p style={{ fontSize: 12, color: "#999" }}>
        Only renders ~{visibleItems.length} items instead of {ITEM_COUNT.toLocaleString()}.
        Scroll smoothly!
      </p>
      <div
        onScroll={onScroll}
        style={{
          height: CONTAINER_HEIGHT,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleItems.map(({ index, style }) => (
            <div
              key={index}
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                borderBottom: "1px solid #f3f4f6",
                backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
              }}
            >
              <span style={{ color: "#999", width: 60, fontSize: 12 }}>
                #{index + 1}
              </span>
              <span>
                User {String.fromCharCode(65 + (index % 26))}{index + 1} —{" "}
                {["Engineering", "Design", "Product", "QA", "DevOps"][index % 5]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🔥 SAY THIS: "Virtualization only renders visible items plus an overscan
// buffer. Instead of mounting 10,000 DOM nodes, we mount ~20.
// The trick: absolute positioning + scroll offset math to calculate
// which items are visible. This is exactly how react-window works internally."


// ═══════════════════════════════════════════════════════════════
// R63 ⭐⭐⭐⭐⭐⭐ | useTransition — Concurrent Mode Demo
// ═══════════════════════════════════════════════════════════════
// React 18 concurrent feature. Mark expensive updates as non-urgent
// so typing stays responsive.
// ───────────────────────────────────────────────────────────────

export function R63_UseTransitionDemo() {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  // 10,000 items to filter (simulating expensive operation)
  const allItems = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        text: `Item ${i + 1} — ${["React", "Redux", "TypeScript", "Next.js", "Node.js"][i % 5]} ${["basics", "advanced", "patterns", "tips", "tricks"][i % 5]}`,
      })),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // ← HIGH priority (keep input responsive)

    startTransition(() => {
      // ← LOW priority (can be interrupted)
      const filtered = allItems.filter((item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>⚛️ useTransition — Concurrent Mode</h3>
      <p style={{ fontSize: 12, color: "#666" }}>
        Type fast — input stays responsive while 10K items filter in background.
      </p>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search 10,000 items..."
        style={{ width: "100%", padding: 10, fontSize: 14, marginBottom: 8 }}
      />
      <div
        style={{
          fontSize: 13,
          color: isPending ? "#f59e0b" : "#22c55e",
          marginBottom: 8,
        }}
      >
        {isPending ? "⏳ Filtering..." : `✅ ${filteredItems.length} results`}
      </div>
      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        {filteredItems.slice(0, 100).map((item) => (
          <div
            key={item.id}
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #f3f4f6",
              fontSize: 13,
            }}
          >
            {item.text}
          </div>
        ))}
        {filteredItems.length > 100 && (
          <div style={{ padding: 12, textAlign: "center", color: "#999" }}>
            ... and {filteredItems.length - 100} more
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 SAY THIS: "useTransition marks a state update as non-urgent.
// React 18 can interrupt the low-priority render if the user types again.
// The input stays responsive because setQuery is high-priority,
// while setFilteredItems is low-priority inside startTransition.
// isPending gives us a loading indicator for free."


// ═══════════════════════════════════════════════════════════════
// R64 ⭐⭐⭐⭐⭐⭐ | Permission-Based UI — Role-Based Access
// ═══════════════════════════════════════════════════════════════
// Auth context + role-based rendering + permission guards.
// The pattern every real app uses for admin vs user vs viewer.
// ───────────────────────────────────────────────────────────────

const PermissionContext = createContext();

const ROLES = {
  admin: ["read", "write", "delete", "manage_users"],
  editor: ["read", "write"],
  viewer: ["read"],
};

function PermissionProvider({ children, role = "viewer" }) {
  const permissions = ROLES[role] || [];
  const hasPermission = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  );
  return (
    <PermissionContext.Provider value={{ role, permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be within PermissionProvider");
  return ctx;
}

// Guard component — renders children only if user has permission
function Can({ permission, children, fallback = null }) {
  const { hasPermission } = usePermission();
  return hasPermission(permission) ? children : fallback;
}

// Role indicator badge
function RoleBadge() {
  const { role } = usePermission();
  const colors = {
    admin: { bg: "#fee2e2", text: "#dc2626" },
    editor: { bg: "#fef3c7", text: "#d97706" },
    viewer: { bg: "#dbeafe", text: "#2563eb" },
  };
  const c = colors[role] || colors.viewer;
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
      }}
    >
      {role.toUpperCase()}
    </span>
  );
}

function DashboardContent() {
  const { role } = usePermission();
  const [items] = useState([
    { id: 1, title: "Q4 Report", status: "Published" },
    { id: 2, title: "Design System", status: "Draft" },
    { id: 3, title: "API Docs", status: "Review" },
  ]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h4>Documents</h4>
        <Can permission="write">
          <button
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + New Document
          </button>
        </Can>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>
              Title
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>
              Status
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {item.title}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {item.status}
              </td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                <Can permission="read">
                  <button style={{ marginRight: 4 }}>View</button>
                </Can>
                <Can permission="write">
                  <button style={{ marginRight: 4 }}>Edit</button>
                </Can>
                <Can permission="delete">
                  <button style={{ color: "red" }}>Delete</button>
                </Can>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Can permission="manage_users">
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#fef2f2",
            borderRadius: 8,
            border: "1px solid #fecaca",
          }}
        >
          🔐 <strong>Admin Panel</strong> — Manage users, roles, and permissions.
        </div>
      </Can>
    </div>
  );
}

export function R64_PermissionUI() {
  const [role, setRole] = useState("admin");
  return (
    <div style={{ maxWidth: 600 }}>
      <h3>🔐 Role-Based UI</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span>Switch role:</span>
        {["admin", "editor", "viewer"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: role === r ? "2px solid #3b82f6" : "1px solid #ddd",
              background: role === r ? "#eff6ff" : "white",
              cursor: "pointer",
            }}
          >
            {r}
          </button>
        ))}
        <RoleBadge />
      </div>
      <PermissionProvider role={role}>
        <DashboardContent />
      </PermissionProvider>
    </div>
  );
}

// 🔥 SAY THIS: "I use a <Can> guard component for declarative permission checks.
// It reads from a PermissionContext that maps roles to permission arrays.
// Client-side permissions are for UX — hiding buttons a user can't use.
// Server-side validation is the real security gate. Never trust the client."


// ═══════════════════════════════════════════════════════════════
// R65 ⭐⭐⭐⭐⭐⭐ | Form with Validation + Error Messages
// ═══════════════════════════════════════════════════════════════
// Complete registration form with field-level validation,
// real-time feedback, submit validation, and error display.
// This is what they mean by "build a form" in senior interviews.
// ───────────────────────────────────────────────────────────────

const validators = {
  name: (v) => {
    if (!v.trim()) return "Name is required";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
    return "";
  },
  password: (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(v)) return "Must contain an uppercase letter";
    if (!/[0-9]/.test(v)) return "Must contain a number";
    return "";
  },
  confirmPassword: (v, form) => {
    if (!v) return "Please confirm password";
    if (v !== form.password) return "Passwords do not match";
    return "";
  },
};

function useForm(initialValues, validatorMap) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was already touched
    if (touched[name] && validatorMap[name]) {
      const error = validatorMap[name](value, { ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validatorMap[name]) {
      const error = validatorMap[name](value, values);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;
    for (const [field, validator] of Object.entries(validatorMap)) {
      const error = validator(values[field], values);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    setTouched(
      Object.keys(validatorMap).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return isValid;
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit };
}

export function R65_ValidatedForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    validators
  );
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Submitted:", data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: 24,
          background: "#f0fdf4",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        <h3>✅ Registration Successful!</h3>
        <p>Welcome, {values.name}!</p>
        <button onClick={() => setSubmitted(false)}>Reset</button>
      </div>
    );
  }

  const Field = ({ label, name, type = "text" }) => (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{ display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 }}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: `1px solid ${touched[name] && errors[name] ? "#ef4444" : "#ddd"}`,
          fontSize: 14,
        }}
      />
      {touched[name] && errors[name] && (
        <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>📋 Registration Form</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Full Name" name="name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        <Field label="Confirm Password" name="confirmPassword" type="password" />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: 12,
            background: isSubmitting ? "#93c5fd" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
}

// 🔥 SAY THIS: "The useForm hook handles values, errors, touched state,
// and validation. Fields validate on blur (first touch) then on change
// (real-time feedback). Cross-field validation — confirmPassword checks
// against password. The submit handler validates ALL fields before calling
// the API. This pattern is what react-hook-form does internally."


// ═══════════════════════════════════════════════════════════════
// R66 ⭐⭐⭐⭐⭐⭐ | Debounced API Search with Loading + Cache
// ═══════════════════════════════════════════════════════════════
// The COMPLETE search pattern: debounce + fetch + cache + abort.
// This is what React Query does under the hood (simplified).
// ───────────────────────────────────────────────────────────────

function useDebouncedSearch(searchFn, delay = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // Check cache first
    if (cacheRef.current.has(debouncedQuery)) {
      setResults(cacheRef.current.get(debouncedQuery));
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchFn(debouncedQuery, controller.signal)
      .then((data) => {
        cacheRef.current.set(debouncedQuery, data); // Cache result
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, searchFn]);

  return { query, setQuery, results, loading, error };
}

const searchUsers = async (query, signal) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users`,
    { signal }
  );
  const data = await res.json();
  return data.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );
};

export function R66_DebouncedAPISearch() {
  const { query, setQuery, results, loading, error } = useDebouncedSearch(
    searchUsers,
    300
  );

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>🔎 Debounced API Search (with Cache)</h3>
      <p style={{ fontSize: 12, color: "#999" }}>
        Try searching, then searching the same term again — it's cached!
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users by name or email..."
        style={{ width: "100%", padding: 10, fontSize: 14, marginBottom: 8 }}
      />
      {loading && <p style={{ color: "#999" }}>🔄 Searching...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {!loading && results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((user) => (
            <li
              key={user.id}
              style={{
                padding: 12,
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: 13, color: "#666" }}>{user.email}</div>
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>{user.company?.name}</div>
            </li>
          ))}
        </ul>
      )}
      {!loading && query && results.length === 0 && (
        <p style={{ color: "#999" }}>No results found for "{query}"</p>
      )}
    </div>
  );
}

// 🔥 SAY THIS: "This custom hook combines debouncing, AbortController,
// and a Map-based cache — essentially a simplified React Query.
// The debounce prevents API spam. AbortController cancels stale requests.
// The cache prevents duplicate fetches. This is the pattern I'd use
// before reaching for a library, or to explain how React Query works."


// ═══════════════════════════════════════════════════════════════
//  TIER 6 SUMMARY — 10 ADVANCED HANDS-ON BUILDS
// ═══════════════════════════════════════════════════════════════
//
//  R57  Autocomplete with keyboard nav + click-outside + API
//  R58  Compound Tabs (the React design pattern)
//  R59  Infinite Scroll with IntersectionObserver
//  R60  Undo/Redo hook (history management)
//  R61  Multi-Select with tags + search
//  R62  Virtual List (render 10,000 items — react-window internals)
//  R63  useTransition — React 18 concurrent mode
//  R64  Permission-based UI with <Can> guard component
//  R65  Form with validation, errors, touched state
//  R66  Debounced API search with cache (mini React Query)
//
// ═══════════════════════════════════════════════════════════════
//
// 🎯 PRIORITY FOR TONIGHT:
//  1. R57 — Autocomplete (most commonly asked)
//  2. R65 — Validated Form (they WILL ask "build a form")
//  3. R59 — Infinite Scroll (shows you know IntersectionObserver)
//  4. R58 — Compound Tabs (shows design pattern knowledge)
//  5. R64 — Permission UI (shows architecture thinking)
//
// 🔥 WHEN BUILDING LIVE, ALWAYS SAY:
//  "Let me start with the state shape — what data do I need?"
//  "I'll use [specific hook/pattern] because [reason]"
//  "Let me handle the edge case of [empty state/error/loading]"
//
// ═══════════════════════════════════════════════════════════════
