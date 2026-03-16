# 🔥 Experion Round 2 — Advanced Battle Plan (Tomorrow 11 AM)

> **You cleared Round 1!** Round 2 is different. They don't want definitions — they want THINKING.
> **Who interviews you:** Tech lead / Architect / Senior Engineer
> **What they test:** Problem-solving, architecture decisions, advanced patterns, "senior signals"
> **Format:** Architecture discussion + live coding + "fix this" + system design + curveballs
> **Your advantage:** You have the knowledge. Now show the REASONING.

---

## 🧠 CRITICAL MINDSET SHIFT: Round 1 vs Round 2

```
Round 1: "What is X?"           → You explain concepts ✅ (You did this well!)
Round 2: "You have problem X"   → You show HOW you'd solve it

Round 1: "Explain Virtual DOM"  → Definition + example
Round 2: "Component re-renders 50 times — fix it" → Debugging process + trade-offs

Round 1: Right answer wins
Round 2: RIGHT THINKING wins (there's often no single right answer)
```

### The Round 2 Answer Framework (Use for EVERY Question)

```
1. CLARIFY  → "Just to confirm — are we talking about X or Y?" (shows maturity)
2. APPROACH → "Here's how I'd think about this..." (shows process)
3. IMPLEMENT → Concrete steps / code / architecture (shows ability)
4. TRADE-OFFS → "The alternative is Z, but I'd prefer X because..." (shows seniority)
5. REAL STORY → "I faced something similar at bet365/Infosys where..." (shows experience)
```

---

## ⏰ TONIGHT'S PREP SCHEDULE (You have ~12 hours)

| Time Block | Focus | Why |
|---|---|---|
| **Tonight 2 hrs** | Read this entire file. Practice answering 5 questions OUT LOUD | Round 2 rewards verbal fluency, not just knowledge |
| **Tonight 30 min** | Practice the 3 live coding challenges below from MEMORY | They WILL ask "build X". Your fingers must know it |
| **Morning before interview** | Re-read the Quick-Fire section at the bottom. Review your mock-round2-deep-tech.md | Fresh in your mind |
| **30 min before** | Stop studying. Breathe. Remember: 3-second pause before every answer | A calm brain thinks clearly |

---

## 🔴 SECTION 1: Advanced React Patterns They'll Ask (NEW MATERIAL)

### 1.1 Custom Hook Patterns (Beyond Basic)

**They'll ask:** "How do you share logic between components?"

```jsx
// Pattern 1: Custom hook with cleanup (interview favorite)
function useEventListener(event, handler, element = window) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (e) => savedHandler.current(e);
    element.addEventListener(event, listener);
    return () => element.removeEventListener(event, listener);
  }, [event, element]);
}

// Pattern 2: Custom hook with loading/error states (API pattern)
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    setState(prev => ({ ...prev, loading: true }));

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setState({ data, error: null, loading: false }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, error: err.message, loading: false });
        }
      });

    return () => controller.abort(); // Cancel on unmount or URL change
  }, [url]);

  return state;
}

// Pattern 3: Custom hook returning actions (reducer pattern)
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }];
}
```

**Say this in interview:**
> "I extract shared logic into custom hooks. The key principles: hooks should do ONE thing, handle their own cleanup, and expose a clean API. I always use AbortController for fetch hooks to cancel stale requests, and useRef for event handlers to avoid stale closures without re-subscribing."

---

### 1.2 Compound Components Pattern

**They'll ask:** "How would you build a reusable Tabs / Accordion / Select component?"

```jsx
// Compound Components — parent and children share state via Context
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage — clean, composable API
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile">Profile content...</Tabs.Panel>
  <Tabs.Panel id="settings">Settings content...</Tabs.Panel>
</Tabs>
```

**Say this in interview:**
> "Compound components share implicit state via Context. The consumer controls composition — what goes where — while the component controls behavior — how tabs switch. It's like `<select>` and `<option>` — they work together implicitly. I'd use this pattern for Tabs, Accordion, Dropdown, or any component with related sub-components."

---

### 1.3 Render Props vs HOC vs Custom Hooks

**They'll ask:** "What pattern would you use and why?"

```
Pattern           | When to Use                        | Example
───────────────── | ────────────────────────────────── | ──────────
Custom Hook       | Sharing stateful logic             | useAuth(), useFetch(), useDebounce()
                  | ✅ Modern, composable, simple       |
                  |                                    |
HOC               | Cross-cutting concerns (rarely)    | withAuth(Component)
                  | ⚠️ Legacy, hard to debug,          |
                  | wrapper hell, harder to type in TS |
                  |                                    |
Render Props      | Sharing rendering logic            | <MouseTracker render={({x,y}) => ...} />
                  | ⚠️ Mostly replaced by hooks        |
                  | Still useful for headless UI libs  |
```

**Say this in interview:**
> "I default to custom hooks — they're composable, simple to test, and don't create wrapper components. HOCs and render props still exist but hooks handle 95% of shared logic cases. I'd only use an HOC if I need to wrap a class component or add behavior without modifying it, and render props for headless UI libraries like Downshift."

---

## 🔴 SECTION 2: Advanced JavaScript They'll Test

### 2.1 Closures — Deep Cut Questions

**They'll show you this and ask "what happens?"**

```javascript
// Classic: Loop + setTimeout
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 3, 3, 3 (var is function-scoped, all closures share same i)

// Fix 1: Use let (block-scoped — each iteration gets its own i)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 0, 1, 2

// Fix 2: IIFE (creates new scope per iteration)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// Output: 0, 1, 2
```

### 2.2 Prototypal Inheritance (They love this in senior rounds)

```javascript
// Everything in JS inherits from a prototype chain
const arr = [1, 2, 3];
// arr → Array.prototype → Object.prototype → null
// That's why arr.map() works — map is on Array.prototype

// Creating inheritance
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound`; };

function Dog(name) {
  Animal.call(this, name); // Call parent constructor
}
Dog.prototype = Object.create(Animal.prototype); // Inherit methods
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() { return `${this.name} barks`; };

// Modern equivalent (class syntax — still prototypal under the hood)
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal {
  bark() { return `${this.name} barks`; }
}
```

**Say this in interview:**
> "JavaScript uses prototypal inheritance, not classical. Every object has a prototype chain — when you access a property, JS walks up the chain until it finds it or reaches null. `class` syntax is sugar over prototypes. I can demonstrate with `Object.getPrototypeOf()` or `__proto__`."

### 2.3 Event Delegation (Real-World Pattern)

```javascript
// Instead of adding listeners to each button, add ONE to the parent
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('button.delete')) {
    const id = e.target.dataset.id;
    deleteItem(id);
  }
});

// Works for dynamically added elements too!
// New buttons added to the list automatically work — no extra listeners needed
```

**Why it matters:**
- **Performance**: 1 listener instead of 1000
- **Dynamic elements**: Works for items added after page load
- **Memory**: No need to clean up individual listeners

### 2.4 Generators & Iterators (Curveball Topic)

```javascript
// Generator — a function that can pause and resume
function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id; // pause here, return value
  }
}

const gen = idGenerator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }

// Practical use: paginated data fetching
function* fetchPages(url) {
  let page = 1;
  while (true) {
    const response = yield fetch(`${url}?page=${page}`);
    if (response.data.length === 0) return; // done
    page++;
  }
}
```

---

## 🔴 SECTION 3: Performance Deep Dive (They WILL Ask This)

### 3.1 "Walk me through debugging a slow React app — step by step"

**This is THE senior question. Memorize this process:**

```
Step 1: MEASURE (don't guess)
  → React DevTools Profiler: Record → interact → see which components re-render
  → Chrome Performance tab: Record → look at Main thread → find Long Tasks (>50ms)
  → Lighthouse: Get overall scores (LCP, INP, CLS)
  → Network tab: Check slow API calls, large assets, waterfall

Step 2: IDENTIFY the bottleneck type
  → Rendering problem? → Components re-render unnecessarily
  → Bundle problem? → Too much JS loaded upfront
  → Network problem? → Slow APIs, large images, no caching
  → Computation problem? → Heavy JS blocking main thread

Step 3: FIX based on what you found
  → Unnecessary re-renders → React.memo + useCallback/useMemo (only where measured)
  → Expensive child tree → Move state DOWN (colocate with the component that needs it)
  → Large bundle → Code split with React.lazy, dynamic imports
  → Long lists → Virtualize with react-window
  → Heavy computation → Web Worker or useMemo
  → Slow API → React Query with caching, prefetch, stale-while-revalidate
  → Large images → next/image, lazy loading, WebP/AVIF
  → Context re-renders → Split context, or use Zustand for fine-grained subscriptions

Step 4: VERIFY
  → Profile again. Did the metric improve?
  → Set performance budgets in CI (bundle size < 200KB, Lighthouse > 90)
```

### 3.2 React.memo — When It Helps vs When It Hurts

```jsx
// ✅ HELPS: Expensive child that receives stable props
const ExpensiveChart = React.memo(({ data }) => {
  // Heavy render — complex SVG, 1000 data points
  return <svg>...</svg>;
});

// Parent:
function Dashboard() {
  const [filter, setFilter] = useState('all');
  const data = useMemo(() => processData(rawData, filter), [rawData, filter]);
  return <ExpensiveChart data={data} />;
}
// ✅ data is memoized → same reference when deps unchanged → memo skips re-render

// ❌ HURTS: Component with props that ALWAYS change
const SimpleText = React.memo(({ text, onClick }) => {
  return <span onClick={onClick}>{text}</span>;
});
// If onClick is a new function every render (no useCallback), memo ADDS cost:
// → comparison cost + re-render cost (compared to just re-render cost)
```

### 3.3 Context Performance Trap (Advanced)

```jsx
// ❌ THE TRAP: One Context with everything → ALL consumers re-render on ANY change
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <AppContext.Provider value={{ user, theme, notifications, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
// Problem: setTheme('dark') → new context value → EVERY consumer re-renders
// Even components that only use `user` re-render because the value object changed

// ✅ FIX 1: Split into separate contexts
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  </ThemeContext.Provider>
</UserContext.Provider>
// Now: setTheme → only ThemeContext consumers re-render

// ✅ FIX 2: Use Zustand for fine-grained subscriptions
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  notifications: [],
  setTheme: (theme) => set({ theme }),
}));

// Components subscribe to specific slices — only re-render when THEIR slice changes
function Header() {
  const theme = useStore((state) => state.theme); // Only re-renders when theme changes
}
```

**Say this in interview:**
> "Context causes all consumers to re-render when ANY part of the value changes. For rarely-changing values like auth and theme, this is fine. For frequently-changing state, I either split into separate contexts or use Zustand, which has built-in selector-based subscriptions — components only re-render when their specific slice of state changes."

---

## 🔴 SECTION 4: Advanced TypeScript Questions

### 4.1 Generics — Practical Patterns

```typescript
// Generic function — type-safe for any data type
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}
getFirst<number>([1, 2, 3]);  // returns number
getFirst<string>(['a', 'b']); // returns string

// Generic component — reusable with type safety
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Usage — TypeScript infers T from items
<List items={users} renderItem={(user) => <span>{user.name}</span>} />
// TypeScript knows user has .name because items is User[]
```

### 4.2 Discriminated Unions (Interview Favorite)

```typescript
// Pattern: Type-safe state machines
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function UserProfile() {
  const [state, setState] = useState<RequestState<User>>({ status: 'idle' });

  // TypeScript narrows the type based on status check
  if (state.status === 'success') {
    return <div>{state.data.name}</div>; // ✅ data exists here
  }
  if (state.status === 'error') {
    return <div>{state.error}</div>; // ✅ error exists here
  }
  if (state.status === 'loading') {
    return <div>Loading...</div>; // ✅ no data or error here
  }
}
```

### 4.3 Utility Types You Must Know

```typescript
Partial<T>       // All properties optional: Partial<User> = { name?: string, ... }
Required<T>      // All properties required
Pick<T, K>       // Select specific props: Pick<User, 'name' | 'email'>
Omit<T, K>       // Remove specific props: Omit<User, 'password'>
Record<K, V>     // Object type: Record<string, number> = { [key: string]: number }
ReturnType<T>    // Extract return type of a function
Parameters<T>    // Extract parameter types as a tuple
Exclude<T, U>    // Remove types: Exclude<'a' | 'b' | 'c', 'a'> = 'b' | 'c'
Extract<T, U>    // Keep matching types
NonNullable<T>   // Remove null and undefined
```

---

## 🔴 SECTION 5: Live Coding Challenges (PRACTICE THESE TONIGHT)

### 5.1 Infinite Scroll Hook

**They'll say:** "Build infinite scroll — load more data when user reaches bottom"

```jsx
function useInfiniteScroll(callback) {
  const observer = useRef(null);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback(); // Load more when last element is visible
      }
    });

    if (node) observer.current.observe(node);
  }, [callback]);

  return lastElementRef;
}

// Usage
function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => setPage(p => p + 1), []);
  const lastPostRef = useInfiniteScroll(loadMore);

  useEffect(() => {
    fetch(`/api/posts?page=${page}`)
      .then(res => res.json())
      .then(data => setPosts(prev => [...prev, ...data]));
  }, [page]);

  return (
    <div>
      {posts.map((post, i) => (
        <div key={post.id} ref={i === posts.length - 1 ? lastPostRef : null}>
          {post.title}
        </div>
      ))}
    </div>
  );
}
```

**Say out loud while coding:** "I'll use IntersectionObserver — it's more performant than scroll event listeners. The hook returns a ref callback that I attach to the last element."

---

### 5.2 Drag and Drop (Without Libraries)

**They'll say:** "Build a basic drag and drop list"

```jsx
function DragList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); // Required to allow drop
    if (dragIndex === index) return;

    const newItems = [...items];
    const [dragged] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, dragged);
    setItems(newItems);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: dragIndex === i ? 0.5 : 1,
            cursor: 'grab',
            padding: '8px',
            border: '1px solid #ddd',
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}
```

---

### 5.3 Undo/Redo System (Shows Architecture Thinking)

**They'll say:** "Add undo/redo to this text editor / drawing app"

```jsx
function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];

  const setState = useCallback((newState) => {
    // Cut off any future states (after redo point)
    const newHistory = history.slice(0, index + 1);
    newHistory.push(typeof newState === 'function' ? newState(state) : newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index, state]);

  const undo = useCallback(() => {
    setIndex(i => Math.max(0, i - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex(i => Math.min(history.length - 1, i + 1));
  }, [history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { state, setState, undo, redo, canUndo, canRedo };
}

// Usage
function TextEditor() {
  const { state: text, setState: setText, undo, redo, canUndo, canRedo } =
    useUndoRedo('');

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

---

## 🔴 SECTION 6: System Design Deep Questions

### 6.1 "Design a Real-Time Chat Application Frontend"

```
CLARIFY:
  → 1-on-1 or group chat? → Both
  → File sharing? → Yes, images and documents
  → Offline support? → Messages queued, sent when online
  → Read receipts? → Yes (sent/delivered/read)

COMPONENT ARCHITECTURE:
  <ChatApp>
  ├── <Sidebar>
  │   ├── <SearchUsers />
  │   └── <ConversationList /> → shows preview, unread count, last message
  ├── <ChatWindow>
  │   ├── <ChatHeader /> → contact info, online status
  │   ├── <MessageList /> → virtualized (react-window), infinite scroll up for history
  │   │   └── <Message /> → text/image/file, timestamp, read receipt, sender
  │   └── <MessageInput /> → text, file upload, emoji picker, typing indicator
  └── <ConnectionStatus /> → "Reconnecting..." banner

STATE:
  → Messages: React Query per conversation (cached, paginated)
  → Active conversation: URL param (/chat/:conversationId)
  → Online users: WebSocket event → Zustand set
  → Typing indicators: WebSocket event → local state (debounced)
  → Unread counts: Zustand (updated from WebSocket events)
  → Draft messages: localStorage per conversation

REAL-TIME:
  → WebSocket for: new messages, typing indicators, read receipts, online status
  → NOT polling — chat needs <100ms latency
  → Reconnection: exponential backoff (1s, 2s, 4s, 8s, max 30s)
  → Optimistic updates: show message immediately, mark as "sending", confirm from server

PERFORMANCE:
  → Virtualize message list (could be 10,000+ messages)
  → Lazy load images in messages
  → Paginate history (load 50 messages, scroll up for more)
  → Debounce typing indicator (send every 2s, not every keystroke)
```

### 6.2 "How would you handle form wizards with 10 steps?"

```
ARCHITECTURE:
  → Parent <Wizard> holds all state, renders current step
  → Each step is a separate component receiving relevant slice of state
  → Step validation before allowing "Next"
  → URL state for current step (/onboarding?step=3) — supports back button

STATE:
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // All fields across all steps
    personal: { name: '', email: '' },
    address: { street: '', city: '' },
    payment: { card: '', expiry: '' },
  });

VALIDATION:
  → Per-step validation with Zod or Yup schemas
  → Validate current step's schema before allowing next
  → Show errors inline, not on submit

PERSISTENCE:
  → Save to localStorage on every step change (user can resume later)
  → Clear on successful submission

NAVIGATION:
  → Linear: step 1 → 2 → 3 (can go back, can't skip ahead)
  → Or: stepper header showing progress, completed steps are clickable
```

---

## 🔴 SECTION 7: Testing Deep Dive (Senior-Level)

### 7.1 "What do you test vs what do you NOT test?"

```
✅ TEST (high value):
  → User-facing behavior: "user clicks submit → success message appears"
  → Custom hooks with complex logic (useFetch, useAuth)
  → Form validation (correct error messages for bad input)
  → Conditional rendering (admin sees delete button, viewer doesn't)
  → API integration (mock fetch, test loading → data → error states)
  → Critical business logic (price calculation, permissions)

❌ DON'T TEST (low value):
  → Implementation details (internal state values, method calls)
  → Third-party libraries (React Query caching, React Router navigation)
  → Pure styling/CSS (unless it's conditional classes affecting behavior)
  → Simple pass-through components (just renders children)
  → Console.log statements
```

### 7.2 Testing a Custom Hook

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it('resets to initial', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(0);
  });
});
```

### 7.3 Testing a Component with API Call

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserList } from './UserList';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]),
    })
  );
});

it('shows loading then users', async () => {
  render(<UserList />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});

it('shows error on fetch failure', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
  render(<UserList />);
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

---

## 🔴 SECTION 8: Curveball Advanced Topics

### 8.1 React 18/19 Concurrent Features

```
useTransition — Mark state updates as non-urgent
  const [isPending, startTransition] = useTransition();
  startTransition(() => setFilter(value)); // Low priority — won't block typing
  → Use for: search filtering, tab switching, heavy state updates
  → User input stays responsive while the expensive update processes

useDeferredValue — Defer re-rendering with a stale value
  const deferredQuery = useDeferredValue(query);
  → The component shows old value while the new one is computing
  → Use for: keeping input responsive while a filtered list updates

Suspense for Data Fetching
  → Components can "suspend" — show a fallback until data is ready
  → Enables streaming SSR in Next.js — send HTML in chunks
  → Combined with React.lazy for code splitting

Automatic Batching (React 18)
  → Multiple setState calls in event handlers, timeouts, promises
    are batched into ONE re-render (pre-18: only batched in event handlers)
```

**Say this in interview:**
> "React 18 introduced concurrent rendering. The key APIs: useTransition marks state updates as non-urgent so user input stays responsive. useDeferredValue shows stale data while new data processes. Automatic batching reduces re-renders. These are about keeping the UI responsive during expensive operations — the framework handles prioritization."

### 8.2 Memory Leaks in React (They Love This)

```
Common causes:
  1. Missing cleanup in useEffect (subscriptions, timers, event listeners)
  2. Setting state after component unmounts (stale fetch response)
  3. Closures holding references to large objects
  4. Global event listeners never removed
  5. Large state that's never cleaned up (accumulated data)

How to detect:
  → Chrome DevTools → Memory tab → Take heap snapshot
  → Performance monitor → JS heap size growing over time
  → React DevTools → Look for components that mount but never unmount

How to fix:
  → ALWAYS return cleanup from useEffect
  → AbortController for fetch requests
  → WeakRef / WeakMap for caches (GC can collect)
  → Clear large arrays/objects when component unmounts
```

### 8.3 Error Boundaries — Production Pattern

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Send to error tracking (Sentry, LogRocket)
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Production pattern: granular boundaries
<ErrorBoundary fallback={<DashboardError />}>
  <Dashboard />  {/* If Dashboard crashes → shows DashboardError, sidebar still works */}
</ErrorBoundary>

// Note: Error boundaries DON'T catch:
// → Event handler errors (use try/catch)
// → Async errors (use .catch() or try/catch)
// → Server-side rendering errors
// → Errors in the boundary itself
```

---

## 📋 Round 2 Emergency Responses

| Situation | Say This |
|---|---|
| Architecture question — overwhelmed | "Let me break this into layers: data layer, state management, component tree, and performance..." |
| They show code — "what's wrong?" | "Let me trace through this step by step... I see [most impactful issue first]" |
| Live coding — stuck | "Let me start with the state shape. What data do I need to hold? What can change?" |
| "How would you handle X at scale?" | "At small scale I'd do A — simple and fast. At scale, the bottleneck shifts to B, so I'd use C. The trade-off is..." |
| They push back on your answer | "That's a valid concern. You're right that [their point]. An alternative would be [adjustment]..." (DON'T get defensive) |
| Don't know something | "I haven't used that specific API, but conceptually it solves [problem]. I'd approach it by [related experience]..." |
| You realize you're wrong mid-answer | "Actually, let me correct that — [right answer]." (They RESPECT self-correction) |
| "Any questions for us?" | "What does the typical sprint cycle look like? How do you handle tech debt? What's the team's biggest technical challenge right now?" |

---

## 🔥 LAST 30 MINUTES — Quick-Fire Drill (Read These Right Before Interview)

| Topic | One-Line Answer |
|---|---|
| **useTransition** | "Marks state updates as non-urgent so user input stays responsive. I use it for filtering large lists while keeping the search input smooth." |
| **Compound Components** | "Related components sharing implicit state via Context. Like <Tabs>, <Tabs.Tab>, <Tabs.Panel> — composable API, component controls behavior." |
| **Event Delegation** | "One listener on the parent catches all child events via bubbling. Better for performance and dynamic elements." |
| **Memory Leak in React** | "Usually: missing useEffect cleanup, setting state after unmount, or uncancelled fetches. I use AbortController and always return cleanup functions." |
| **Discriminated Unions** | "Union types with a literal discriminant. `{ status: 'success', data } | { status: 'error', error }` — TypeScript narrows the type based on the status check." |
| **Context perf issue** | "All consumers re-render on ANY context change. Fix: split contexts, or use Zustand for fine-grained subscriptions." |
| **Error Boundary** | "Class component that catches render errors in its subtree. I use granular boundaries — per feature, not one at the top. They don't catch event handler or async errors." |
| **IntersectionObserver** | "Browser API that fires when elements enter/leave the viewport. I use it for infinite scroll, lazy loading, and scroll-triggered animations." |
| **Prototypal Inheritance** | "JS objects have a prototype chain. Property lookup walks up the chain. `class` is syntactic sugar over prototypes." |
| **Web Workers** | "Background threads for heavy computation. Can't access DOM. Communicate via postMessage. Prevents UI freezing." |
| **React Fiber** | "React's reconciliation engine. Breaks rendering into interruptible units of work. Foundation for concurrent features." |
| **Hydration** | "Attaching event listeners to server-rendered HTML. React 18 supports selective hydration — hydrate critical parts first." |
| **Custom hooks vs HOC** | "Hooks: composable, simple, modern. HOC: wrapper pattern, harder to type, use only for class components. I default to hooks." |

---

## 🎯 THE MOST IMPORTANT THING

**You already know the material. Round 1 proved that.**

Round 2 is about:
1. **Thinking out loud** — they want to hear your PROCESS, not just the answer
2. **Trade-offs** — always mention "I'd choose X over Y because..."
3. **Staying calm** — 3-second pause. Classify. Answer.
4. **Being honest** — "I haven't used that, but here's how I'd approach it" beats a wrong answer every time

**You've got this. 🔥**
