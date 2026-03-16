# 🎯 Mock Round 2 — Deep Technical (60-90 min)

> **Who interviews you:** Tech lead / Architect / Senior Engineer
> **What they test:** "Can this person THINK, not just recite?"
> **Format:** Architecture discussion + live coding + "fix this" + system design
> **Vibe:** No right answers — they want your REASONING process

---

## ⚡ ANSWER FORMAT — Round 2 is Different

```
Round 1: "What is X?" → Explain the concept.
Round 2: "You have problem X — what do you do?" → Show your THINKING.

Framework:
1. CLARIFY  → "Just to confirm — are we talking about X or Y?"
2. APPROACH → "Here's how I'd think about this..."
3. TRADE-OFFS → "The alternative is Z, but I'd prefer X because..."
4. REAL STORY → "I faced something similar at bet365/Infosys where..."
```

---

## SECTION A: Architecture & Design Decisions (20 min)

### Q1: "This component re-renders 50 times when the user types in a search box. Walk me through how you'd debug and fix it."

> "First I'd measure, not guess.
>
> **Step 1: React DevTools Profiler** — record, type in the search box, see which components re-render and how long each takes. Find the heaviest render.
>
> **Step 2: Identify the cause.** Common culprits:
> - Parent re-renders on every keystroke → all children re-render
> - Context value changes on every keystroke → all consumers re-render
> - New object/array/function references created on every render → breaks memo
> - Unfiltered list re-processes on every keystroke without memoization
>
> **Step 3: Fix based on what I find:**
> - If a child doesn't need the search value → `React.memo` on it
> - If a handler is passed as prop → `useCallback` so memo works
> - If filtering a large list → `useMemo` for the filtered result
> - If triggering API on every keystroke → debounce (useDebounce hook, wait 300ms)
> - If the entire tree re-renders from Context → split context into separate providers
>
> **Step 4: Verify** — run Profiler again, confirm renders dropped.
>
> The key principle: don't sprinkle memo everywhere. Profile, find the bottleneck, fix that specific spot."

---

### Q2: "You have user auth, UI theme, form data, and API cache. Where does each piece of state live and why?"

> "Different state types belong in different places:
>
> **User auth** → Context or Zustand. Global, read by many components (header, protected routes, API calls). Changes rarely. Context works fine here.
>
> **UI theme** → Context. Global, read everywhere, changes rarely. Classic Context use case. Provider at root, useTheme hook.
>
> **Form data** → Local useState or react-hook-form. Form state is local to the form component. It doesn't belong in global state. If it's a multi-step wizard, lift it to the wizard parent — still local, not global.
>
> **API/server cache** → TanStack Query or RTK Query. NOT Redux, NOT useState. These libraries handle caching, deduplication, background refetch, stale-while-revalidate, and error/loading states automatically. Putting API data in Redux means you're manually reinventing all of that.
>
> The principle: start with the most local, simplest option. Escalate only when you need to. Most state doesn't need to be global."

---

### Q3: "You're building a dashboard with 15 widgets, real-time updates, and role-based access. How do you architect the frontend?"

> "I'd break this into layers:
>
> **Layout:** Grid layout component. Each widget is an independent unit — its own data fetching, its own error boundary, its own loading state. One widget crashing doesn't take down the dashboard.
>
> **Data:** TanStack Query per widget. Each widget fetches its own data. For real-time: WebSocket connection at app level, events dispatched to relevant widgets. Stale-while-revalidate for non-real-time widgets — show cached data immediately, refresh in background.
>
> **Role-based access:** Permission config object — `{ admin: ['*'], analyst: ['widget-a', 'widget-c'], viewer: ['widget-a'] }`. Dashboard reads user role from auth context, filters visible widgets. Server validates permissions too — client filtering is UX convenience, not security.
>
> **Performance:** Code-split each widget with React.lazy — heavy chart widgets only load when that widget is visible. Virtualize if 15 widgets don't fit on screen (unlikely but possible on mobile).
>
> **Error isolation:** Each widget wrapped in an ErrorBoundary. One widget failing shows a 'Failed to load' card, not a white screen.
>
> If they ask 'what about the layout being customizable?' — store widget positions in user preferences (backend), use a grid library like react-grid-layout for drag-and-drop arrangement."

---

### Q4: "Design the API contract for a task management feature."

> "RESTful approach:
>
> ```
> GET    /api/tasks              → List tasks (with ?status=active&page=1&limit=20)
> POST   /api/tasks              → Create task { title, description, assigneeId }
> GET    /api/tasks/:id          → Get single task
> PUT    /api/tasks/:id          → Full update
> PATCH  /api/tasks/:id          → Partial update { status: 'done' }
> DELETE /api/tasks/:id          → Delete task
>
> Response shape:
> { data: Task | Task[], meta: { total, page, limit }, error: null }
>
> Error shape:
> { data: null, error: { code: 'VALIDATION_ERROR', message: '...', fields: {...} } }
> ```
>
> Status codes: 200 OK, 201 Created (POST success), 204 No Content (DELETE success), 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden (wrong role), 404 Not Found, 409 Conflict (duplicate), 500 Server Error.
>
> Pagination: cursor-based for real-time lists (avoid page drift), offset-based for static lists. Response includes `nextCursor` or `total + page`.
>
> Filtering: query params `?status=active&assignee=123&sort=createdAt:desc`. Server validates and sanitizes these."

---

## SECTION B: Live Coding — Build Under Pressure (20-25 min)

> They'll say: "Open your editor. Build X." This is where you say:
> **"Let me start by thinking about the state shape."**

### Q5: "Build a file explorer with expand/collapse folders."

**Say out loud:** "This is a recursive component. A FileNode that renders itself for children."

```jsx
const data = [
  { name: "src", children: [
    { name: "components", children: [
      { name: "App.jsx" },
      { name: "Header.jsx" },
    ]},
    { name: "index.js" },
  ]},
  { name: "package.json" },
];

function FileNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!node.children;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div onClick={() => isFolder && setIsOpen(o => !o)}
        style={{ cursor: isFolder ? "pointer" : "default" }}>
        {isFolder ? (isOpen ? "📂" : "📁") : "📄"} {node.name}
      </div>
      {isOpen && node.children?.map(child => (
        <FileNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function FileExplorer() {
  return data.map(node => <FileNode key={node.name} node={node} />);
}
```

**If they ask "add search":** Filter tree recursively — keep folder if any child matches.

---

### Q6: "Build an autocomplete component with debounced search."

**Say out loud:** "I need: controlled input, debounce hook, filtered suggestions, selection."

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Autocomplete({ options }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div style={{ position: "relative", width: 250 }}>
      <input value={query}
        onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
        placeholder="Search..." />
      {isOpen && filtered.length > 0 && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0,
          border: "1px solid #ddd", listStyle: "none", padding: 0, margin: 0,
          background: "white", maxHeight: 200, overflowY: "auto" }}>
          {filtered.map(opt => (
            <li key={opt}
              onClick={() => { setQuery(opt); setIsOpen(false); }}
              style={{ padding: 8, cursor: "pointer" }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**If they ask "add keyboard navigation":** Track `highlightedIndex` state. ArrowDown/Up changes it. Enter selects `filtered[highlightedIndex]`.

---

### Q7: "Build a modal that closes on backdrop click and ESC key."

**Say out loud:** "Overlay div with onClick for backdrop. stopPropagation on content. ESC via keydown listener."

```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = e => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "white", padding: 24, borderRadius: 8, minWidth: 300 }}>
        {children}
      </div>
    </div>
  );
}
```

---

## SECTION C: "What's Wrong With This Code?" (10 min)

### Q8: They show you buggy code and ask you to spot issues.

**Common traps they'll show:**

```jsx
// BUG 1: Missing key in list
items.map(item => <li>{item.name}</li>)
// FIX: <li key={item.id}>

// BUG 2: Stale closure in useEffect
useEffect(() => {
  setInterval(() => setCount(count + 1), 1000);
}, []);
// FIX: setCount(c => c + 1) — updater form avoids stale closure
// Also: missing cleanup — clearInterval

// BUG 3: Object in useEffect deps causes infinite loop
useEffect(() => {
  fetch(`/api?filter=${JSON.stringify(filter)}`);
}, [filter]); // if filter is { status: "active" } created inline → new ref every render → infinite loop
// FIX: useMemo to stabilize, or JSON.stringify as dep, or individual properties

// BUG 4: Mutating state directly
const handleAdd = (item) => {
  items.push(item);      // ❌ mutating state array
  setItems(items);        // ❌ same reference — React won't re-render
};
// FIX: setItems(prev => [...prev, item])

// BUG 5: useEffect missing cleanup
useEffect(() => {
  const handler = () => { ... };
  window.addEventListener("resize", handler);
  // Missing: return () => window.removeEventListener("resize", handler);
}, []);

// BUG 6: Calling function in onClick instead of passing it
<button onClick={handleDelete(item.id)}>Delete</button>
// This CALLS handleDelete during render, not on click
// FIX: onClick={() => handleDelete(item.id)}
```

**How to answer code review questions:**
> "First I'd check correctness — does it work? Then readability — is it clear? Then performance — any unnecessary re-renders or missing optimizations? I focus on the most impactful issues first, not nitpicks."

---

## SECTION D: Performance & Production (10 min)

### Q9: "How would you optimize a slow React app?"

> "Measure first. I open React DevTools Profiler, interact with the slow area, and find the heaviest component renders. Then fix in order of impact:
>
> 1. **Code splitting** — React.lazy per route first, then heavy components (chart libraries, editors). Don't load what users don't see.
> 2. **Render optimization** — React.memo + useCallback where Profiler shows wasted renders. Not everywhere — only measured bottlenecks.
> 3. **Virtualization** — long lists/tables with react-window or react-virtuoso. Render 20 visible rows, not 10,000.
> 4. **Bundle analysis** — webpack-bundle-analyzer. Replace heavy deps with lighter ones. Tree shake dead code.
> 5. **Network** — TanStack Query for caching + stale-while-revalidate. Prefetch next-page data. Proper Cache-Control headers.
> 6. **Images** — next/image for auto optimization. Lazy load below-fold images.
>
> I also set performance budgets in CI — bundle size threshold, Lighthouse score threshold. Can't maintain what you don't enforce."

---

### Q10: "A REST API returns a 500. What happens in your frontend? Walk me through the entire flow."

> "Full flow:
>
> 1. **fetch call** catches the error — either `.catch()` or try/catch with async/await.
> 2. **Error state** is set — `setError('Something went wrong')`. Loading state cleared.
> 3. **UI shows error** — the component renders an error message instead of data. If using TanStack Query, this is automatic — `{ error, isError }`.
> 4. **Retry option** — a 'Try Again' button that re-triggers the fetch. For transient errors (network blip, server overload), this often works.
> 5. **Error Boundary** — if the error somehow crashes the component during render (not just fetch), the ErrorBoundary catches it and shows fallback UI. But API errors usually don't crash render — they set error state.
> 6. **Logging** — the error is sent to Sentry/LogRocket with context: which endpoint, what payload, user ID. Without this, you're debugging blind in production.
> 7. **User experience** — never show a raw error message or stack trace. Show: 'Something went wrong. Please try again or contact support.' with a retry button.
>
> For critical flows (checkout, KYC verification): I add retry with exponential backoff — try 3 times with 1s, 2s, 4s delays before showing the error."

---

### Q11: "Where do you store the JWT? Why?"

> "httpOnly cookie — not localStorage.
>
> localStorage is accessible to ANY JavaScript on the page. If there's an XSS vulnerability — even from a third-party script — the attacker can read the token with `localStorage.getItem('token')` and send it to their server. Game over.
>
> httpOnly cookies are NOT accessible to JavaScript. The browser sends them automatically with requests. Even if XSS happens, the attacker can't extract the token. They can make requests AS the user (CSRF), but CSRF is easier to prevent — SameSite=Strict cookie attribute blocks most CSRF attacks.
>
> Defense in depth: httpOnly cookie + SameSite=Strict + short token expiry + refresh token rotation."

---

## SECTION E: 🔥 OUT-OF-THE-BLUE CURVEBALLS

### "What's the difference between SSR and Server Components?"

> "SSR renders the entire page to HTML on the server per request. The full React tree runs on the server, generates HTML, sends it to the browser, then React 'hydrates' it — attaches event listeners to make it interactive. ALL the JavaScript ships to the browser.
>
> Server Components are different — they run on the server and ship ZERO JavaScript. They're just HTML. Only components marked 'use client' ship JS. You can mix them — a Server Component fetches data and passes it to a Client Component for interactivity.
>
> SSR = whole page on server, all JS ships, hydration needed.
> Server Components = per-component, only client components ship JS, no hydration for server parts."

---

### "What is hydration?"

> "Hydration is when React takes server-rendered HTML and 'attaches' event listeners and state to make it interactive. The HTML is already on screen from SSR, but it's static — no onClick works yet. Hydration makes it live.
>
> The problem: hydration can be slow for large apps — the entire component tree must hydrate before anything is interactive. That's called TTI (Time to Interactive) delay.
>
> React 18's fix: **Selective Hydration** with Suspense — hydrate critical parts first, defer the rest. Next.js handles this automatically with streaming SSR."

---

### "What is streaming in Next.js?"

> "Instead of waiting for ALL data before sending HTML, the server sends HTML in chunks as each part becomes ready. The user sees a shell immediately with loading states, then each section fills in as its data arrives.
>
> In App Router, this is automatic with loading.tsx — each route segment can stream independently. Wrap slow parts in Suspense, and the rest of the page loads immediately while the slow part shows a loading fallback."

---

### "Explain React Fiber."

> "Fiber is React's reconciliation engine (since React 16). The key innovation: **interruptible rendering**. The old reconciler was synchronous — once it started diffing, it couldn't stop until done. If the tree was large, the main thread was blocked and the UI froze.
>
> Fiber breaks work into small units. It can pause work, come back to it later, prioritize urgent updates (user input) over less urgent ones (data fetch results). This is the foundation of concurrent features like useTransition and Suspense.
>
> In interview terms: Fiber = React can do work in chunks instead of all at once, so the UI stays responsive."

---

### "What would you do in your first 30 days at our company?"

> "Week 1-2: Ship a small PR. Not to prove myself — to learn the codebase, build tools, CI pipeline, and coding conventions by doing. I'd read existing code more than docs. Set up my dev environment. Meet the team — designers, PMs, backend engineers.
>
> Week 3-4: Own a medium feature end-to-end. Ask a lot of questions — I'd rather look junior for a month than make wrong assumptions for a year. Start forming opinions about where the codebase could improve, but listen before suggesting.
>
> Day 30: I should be able to ship features independently, know who to ask for what, and have earned enough context to contribute meaningfully to architecture discussions."

---

## 📋 Round 2 Emergency Kit

| Situation | Say This |
|---|---|
| Architecture question — don't know where to start | "Let me break this into layers: data, state management, component structure, and performance..." |
| They show code and ask "what's wrong" | "Let me read through this... I see a few things..." (start with the most impactful bug) |
| Live coding — you're stuck | "Let me think about the state shape first. What data do I need to hold?" |
| "How would you handle X at scale?" | "For small scale I'd do A. At scale, the bottleneck shifts to B, so I'd use C." |
| They push back on your answer | "That's a good point. You're right that [their concern]. An alternative would be..." (don't get defensive) |
| They ask something you genuinely don't know | "I haven't used that specific API, but conceptually it solves [problem] and I'd approach it by [related experience]..." |
| You realize your answer was wrong mid-sentence | "Actually, let me correct that — [right answer]." (Interviewers RESPECT self-correction) |
