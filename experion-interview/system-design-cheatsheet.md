# 🏗️ Frontend System Design Cheatsheet — Senior React Interview

> This is NOT backend system design. No databases, no load balancers.
> This is: "How would you architect this React frontend?"
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. The Framework — 6 Steps for Any Frontend System Design Question

```
Step 1: CLARIFY REQUIREMENTS
  → Functional: What does the user DO? List 3-5 core features.
  → Non-functional: Performance? SEO? Offline? Real-time? Accessibility?
  → Scale: How many users? How much data on screen? How many widgets/pages?
  → "Before I start designing, let me clarify a few things..."

Step 2: COMPONENT ARCHITECTURE
  → Draw the component tree (top-down)
  → Identify boundaries: page-level, feature-level, shared/reusable
  → Where do error boundaries go? Where do Suspense boundaries go?

Step 3: STATE MANAGEMENT
  → What state exists? Classify it:
     • UI state (modal open, sidebar collapsed) → useState / useReducer
     • Server state (API data, cached responses) → React Query / SWR
     • URL state (filters, pagination, search) → URL params / searchParams
     • Auth state (user, roles, permissions) → Context + cookie/token
     • Global app state (theme, locale) → Context or Zustand
  → Rule: push state DOWN, not up. Colocate state with where it's used.

Step 4: DATA FETCHING
  → API design: What endpoints do you need?
  → Caching: React Query with staleTime? SWR with revalidation?
  → Loading states: Skeleton screens vs spinners vs Suspense
  → Error states: Per-component error boundaries vs global fallback
  → Real-time: WebSocket / SSE / polling (and why you chose it)

Step 5: PERFORMANCE
  → Code splitting: Route-level? Widget-level?
  → Lazy loading: React.lazy + Suspense for heavy components
  → Virtualization: Long lists? Use react-window
  → Memoization: React.memo for expensive re-renders
  → Image optimization: next/image, lazy loading, WebP
  → Bundle size: What can be dynamically imported?

Step 6: EDGE CASES
  → Error handling: What happens when an API fails?
  → Empty states: No data yet? Show meaningful UI
  → Loading states: Skeleton screens, not blank pages
  → Offline: Service workers? Optimistic updates?
  → Accessibility: Keyboard nav, ARIA roles, focus management
  → Security: XSS prevention, CSRF tokens, auth token storage
```

**Say this in interview:**
> "I follow a 6-step framework for frontend system design: clarify requirements, design the component tree, decide state management, plan data fetching with caching and error handling, address performance — code splitting, virtualization, memoization — and finally handle edge cases like offline support and accessibility. Let me walk through each one."

---

## 2. Worked Example: Dashboard with 15 Widgets, Real-Time Updates, Role-Based Access

### Step 1: Clarify Requirements

```
Functional:
  - 15 widgets (charts, tables, metrics cards, activity feed)
  - Real-time data updates (stock prices, live metrics)
  - Role-based access (Admin sees all, Viewer sees subset, Editor can configure)
  - Drag-and-drop layout customization
  - Filter/date range affects all widgets

Non-functional:
  - Must load in < 3 seconds (many widgets, lots of data)
  - Graceful degradation (one widget failing shouldn't crash the page)
  - Works on tablet (responsive grid)
```

### Step 2: Component Tree

```
<App>
├── <AuthProvider>              ← role/permissions context
├── <DashboardLayout>
│   ├── <Sidebar />             ← navigation, user info, role indicator
│   ├── <TopBar>
│   │   ├── <DateRangeFilter /> ← shared filter, state in URL params
│   │   └── <UserMenu />
│   └── <WidgetGrid>            ← CSS Grid / react-grid-layout for drag-drop
│       ├── <ErrorBoundary>     ← per-widget error boundary!
│       │   └── <Suspense fallback={<WidgetSkeleton />}>
│       │       └── <LazyWidget1 />  ← React.lazy() each widget
│       ├── <ErrorBoundary>
│       │   └── <Suspense>
│       │       └── <LazyWidget2 />
│       └── ... (15 widgets, each wrapped independently)
```

### Step 3: State Decisions

```
Server state (API data per widget)  → React Query (each widget fetches independently)
UI state (sidebar open, drag state) → useState (local)
Filter state (date range, filters)  → URL searchParams (shareable, bookmarkable)
Auth state (user, role, permissions) → AuthContext (from JWT / session)
Layout state (widget positions)     → localStorage + API sync
```

### Step 4: Real-Time Strategy

```
Option A: WebSocket
  ✅ True real-time, server pushes updates
  ✅ Single connection for all widgets
  ❌ Complex — reconnection logic, multiplexing
  → Use for: Live stock prices, chat, critical alerts

Option B: Polling (React Query refetchInterval)
  ✅ Simple — just re-fetch every N seconds
  ✅ Works with existing REST APIs
  ❌ Not truly real-time, wastes bandwidth
  → Use for: Metrics that update every 30s-60s

Option C: Server-Sent Events (SSE)
  ✅ Server push, simpler than WebSocket (HTTP-based)
  ✅ Auto-reconnection built into browser
  ❌ One-direction only (server → client)
  → Use for: Activity feeds, notifications
```

**Say this in interview:**
> "For this dashboard, I'd use a hybrid approach. React Query with a 30-second refetchInterval for most widgets — it's simple and gives us caching, deduplication, and background updates for free. For the 2-3 widgets that need true real-time — like live metrics or an activity feed — I'd use a WebSocket connection with a custom hook that feeds updates into React Query's cache."

### Step 5: Role-Based Rendering

```jsx
// Don't render widgets the user can't see — don't just hide them with CSS
const WIDGET_PERMISSIONS = {
  revenueChart: ['admin', 'manager'],
  userTable: ['admin'],
  activityFeed: ['admin', 'manager', 'viewer'],
};

function WidgetGrid({ widgets }) {
  const { role } = useAuth();
  const visibleWidgets = widgets.filter(w =>
    WIDGET_PERMISSIONS[w.id]?.includes(role)
  );
  return visibleWidgets.map(w => <WidgetWrapper key={w.id} widget={w} />);
}
```

### Step 6: Performance

```
Problem: 15 widgets = huge initial bundle + 15 API calls on mount

Solutions:
1. Code split EVERY widget → React.lazy(() => import('./widgets/RevenueChart'))
   Only loads JS for widgets actually on screen

2. Error boundary PER widget → one crash doesn't take down the whole dashboard

3. Stagger API calls → don't fire 15 requests simultaneously
   React Query's staleTime + refetchOnWindowFocus handles this

4. Virtualize if widgets scroll → only render visible widgets
   (usually not needed if grid layout fits on viewport)

5. Skeleton screens per widget → instant perceived load, no layout shift
```

---

## 3. Worked Example: E-Commerce Product Page

### Component Breakdown

```
<ProductPage>
├── <Breadcrumbs />                    ← SSR (SEO)
├── <ProductGallery>                   ← lazy loaded images, srcSet, zoom
│   ├── <MainImage />
│   └── <ThumbnailStrip />
├── <ProductInfo>
│   ├── <ProductTitle />               ← SSR (SEO — in <h1>)
│   ├── <Price />                      ← SSR
│   ├── <StarRating />                 ← SSR (structured data / rich snippets)
│   ├── <VariantSelector />            ← Client (interactive — color, size)
│   ├── <AddToCartButton />            ← Client (onClick, quantity state)
│   └── <StockStatus />               ← Client (real-time check)
├── <ProductTabs>                      ← lazy loaded below fold
│   ├── <Description />
│   ├── <Specifications />
│   └── <Reviews />                    ← paginated, infinite scroll
└── <RecommendedProducts />            ← lazy loaded, carousel
```

### Data Fetching Strategy

```
SSR (SEO-critical, above fold):
  → Product title, price, description, images, rating
  → getServerSideProps or Server Component
  → Renders HTML for Google crawlers

Client-side (interactive, below fold):
  → Stock availability (real-time check)
  → Reviews (paginated, loaded on tab click)
  → Recommendations (lazy loaded on scroll)
  → Cart operations (client-only, no SEO value)
```

### Cart State Management

```
Cart = global state (persists across pages)

Options:
1. React Context + useReducer  → simple, fine for most SPAs
2. Zustand                     → if cart logic gets complex (discounts, bundles)
3. Server-side cart (API)      → if user must see cart across devices

Cart state shape:
{ items: [{ productId, variantId, quantity, price }], total, itemCount }

Optimistic updates: Add to cart → update UI immediately → sync with server
Persist: localStorage for guests, API for logged-in users
```

### Performance (Core Web Vitals)

```
LCP (Largest Contentful Paint) — target < 2.5s:
  → Hero product image is usually LCP
  → priority prop on main image, preload in <head>
  → SSR the above-fold content

CLS (Cumulative Layout Shift) — target < 0.1:
  → Set explicit width/height on all images
  → Reserve space for price, rating, variant selector
  → No content jumping after hydration

INP (Interaction to Next Paint) — target < 200ms:
  → Add-to-cart button must respond instantly
  → Debounce quantity input changes
  → Don't block main thread during image carousel swipe
```

**Say this in interview:**
> "For the product page, I'd SSR the above-fold content — title, price, images, rating — for SEO and fast LCP. Below-fold content like reviews and recommendations load client-side with lazy loading. The hero image gets a priority attribute and explicit dimensions to avoid CLS. Cart state lives in Zustand with localStorage persistence for guests and API sync for logged-in users."

---

## 4. Common Patterns to Know

### Component Composition

```
Container / Presentational (classic):
  → Container: fetches data, manages state
  → Presentational: pure UI, receives props
  → Still useful, but hooks reduced the need for this

Compound Components (advanced):
  → <Tabs> <Tabs.List> <Tabs.Panel> pattern
  → Components share implicit state via Context
  → User controls composition, component controls behavior

Render Props / Children as Function:
  → <DataFetcher render={(data) => <Chart data={data} />} />
  → Largely replaced by hooks, but still useful for cross-cutting concerns

Custom Hooks (modern standard):
  → Extract reusable logic: useAuth, useDebounce, usePagination
  → One hook per concern, composable
```

### Data Fetching Patterns

```
Fetch-on-render (useEffect):
  → Component mounts → triggers fetch → shows loading → shows data
  → Problem: waterfall — parent fetches, then child fetches, then grandchild
  → Fine for simple cases, bad for nested data dependencies

Fetch-then-render (loader/getServerSideProps):
  → Fetch ALL data before rendering anything
  → No loading spinners — page appears complete
  → Problem: slowest API blocks everything

Render-as-you-fetch (Suspense + React Query):
  → Start fetching BEFORE component mounts (prefetch)
  → Components suspend individually — fast ones appear first
  → Best UX — progressive loading, no waterfalls
  → This is the pattern React team recommends
```

### State Management Decision Tree

```
Where should this state live?

  "Is it only used by one component?"
      YES → useState (local)

  "Should it survive page refresh or be shareable via URL?"
      YES → URL searchParams (useSearchParams)

  "Is it server data (from an API)?"
      YES → React Query / SWR (server cache, NOT Redux)

  "Do 2-3 nearby components need it?"
      YES → lift state to common parent + props

  "Do distant components need it, but it rarely changes?"
      YES → React Context (theme, auth, locale)

  "Do many components need it AND it changes frequently?"
      YES → Zustand / Redux Toolkit (global store)
```

---

## 5. Performance Optimization Checklist

```
React.memo / useMemo / useCallback:
  → React.memo: skip re-render if props haven't changed
  → useMemo: cache expensive computation results
  → useCallback: stable function reference for child props
  → ⚠️ Don't use everywhere — adds memory overhead. Profile first.
  → Rule: only memoize when you've measured a real perf problem

Code Splitting:
  → Route-based: React.lazy(() => import('./pages/Dashboard'))
  → Component-based: lazy-load heavy widgets, modals, charts
  → Library-based: dynamic import('heavy-lib') only when needed

Virtualization (long lists):
  → react-window (lightweight) or react-virtualized (full-featured)
  → Only renders visible rows — 10,000 items feel like 20
  → Use for: tables, feeds, search results, dropdowns

Image Optimization:
  → next/image: auto WebP/AVIF, responsive srcSet, lazy loading
  → Explicit width/height to prevent CLS
  → priority for above-fold hero images
  → loading="lazy" for below-fold images

Bundle Analysis:
  → webpack-bundle-analyzer or source-map-explorer
  → Find bloated dependencies, replace or lazy-load them
  → Target: main bundle < 200KB gzipped

Core Web Vitals:
  → LCP < 2.5s: SSR above-fold, preload hero image, minimize render-blocking
  → INP < 200ms: no heavy computation on main thread, debounce inputs
  → CLS < 0.1: explicit image dimensions, no content shift on load

Debouncing / Throttling:
  → Search input: debounce 300ms (don't fire API on every keystroke)
  → Scroll handlers: throttle 100ms (don't re-calculate on every pixel)
  → Window resize: debounce 200ms

Web Workers:
  → Offload heavy computation (data parsing, filtering 100K rows)
  → Main thread stays responsive for user interaction
  → Use for: CSV processing, complex calculations, image manipulation
```

---

## 6. Trade-offs They Want to Hear

### SSR vs CSR

```
SSR when: SEO matters, fast first paint, content-heavy pages
CSR when: highly interactive, auth-gated (no SEO), SPA dashboards
Hybrid: SSR the shell + critical content, CSR for interactive parts
```

### Redux vs Context vs Zustand

```
Context: simple shared state (theme, auth), infrequent updates
  ⚠️ Every consumer re-renders on ANY context value change

Redux Toolkit: complex state with many actions, middleware needs, devtools
  ⚠️ Boilerplate, overkill for most apps

Zustand: simple API, no provider needed, selective subscriptions
  ✅ My default choice for global state in new projects

React Query: for server state — DON'T put API data in Redux
```

### REST vs GraphQL

```
REST: simpler, cacheable, well-understood, great tooling
  → Use when: CRUD operations, simple data shapes, team knows REST

GraphQL: client controls shape, no over-fetching, single endpoint
  → Use when: complex nested data, mobile + web share backend, many entities
  → ⚠️ Caching is harder, more complex server setup
```

### Micro-Frontends vs Monolith

```
Monolith (single React app): simpler, shared state, faster development
  → Use when: one team, < 50 pages, startup/early stage

Micro-frontends (Module Federation, single-spa):
  → Use when: multiple teams own different features independently
  → Each team deploys independently, different tech stacks possible
  → ⚠️ Shared state is painful, bundle duplication, complex infrastructure
```

**Say this in interview:**
> "I always discuss trade-offs because there's no universally right answer. For state management, I'd use React Query for server state, Zustand for global client state, and Context only for rarely-changing values like theme or auth. For rendering, I'd SSR the SEO-critical pages and CSR the interactive dashboards. The choice depends on the specific requirements — SEO needs, team size, data complexity, and performance targets."

---

## Quick-Fire System Design Answers

| Question | 30-Second Answer |
|---|---|
| "How do you handle state in a large app?" | "I separate server state (React Query) from client state (Zustand/Context). Server state is cached, invalidated, and refetched automatically. Client state is colocated — local first, lifted only when needed, global only as a last resort." |
| "How would you optimize a slow React app?" | "First, I profile with React DevTools and Chrome Performance tab — never guess. Common fixes: memoize expensive components with React.memo, virtualize long lists, code-split heavy routes, lazy-load below-fold content, and check bundle size for bloated dependencies." |
| "How do you handle errors in a large app?" | "Granular error boundaries — one per widget or feature, not just one at the top. Each boundary shows a local fallback ('Failed to load chart — Retry') instead of crashing the whole page. For API errors, React Query gives me retry, error state, and fallback per query." |
| "How do you make a React app accessible?" | "Semantic HTML first — use button, not div-with-onClick. ARIA roles where needed. Keyboard navigation for all interactive elements. Focus management on modals and route changes. Color contrast ratios. Test with screen reader and axe-core." |
| "Micro-frontends — when would you use them?" | "Only when multiple teams need to deploy independently. The complexity cost is high — shared state is painful, bundles can duplicate, and debugging across boundaries is harder. For one team, a well-structured monolith with code splitting is simpler and faster." |

---

*Last updated: Feb 26, 2026 — Experion Senior ReactJS Interview Prep*
