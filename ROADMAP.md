# 🗺️ Top-Tier Full-Stack Developer Roadmap

> **Stack: JavaScript → TypeScript → React → Golang → PostgreSQL**
> Goal: Crack any interview. Build anything. Think like a senior engineer.

---

## 🧠 The Mindset First

Most devs learn **wide**. Top-tier devs learn **deep, then wide**.

```
❌ "I know a little React, a little Go, a little SQL"
✅ "I can design a system, implement it end-to-end, debug it at 2am, and explain every decision"
```

**This roadmap is 6 months.** Do it honestly and you'll outperform 90% of candidates.

---

## 📅 The 24-Week Plan

```
Weeks 01–04   ➜  JavaScript Deep Dive (the foundation of everything)
Weeks 05–08   ➜  TypeScript Mastery (your competitive edge)
Weeks 09–14   ➜  React + Next.js (frontend dominance)
Weeks 15–18   ➜  PostgreSQL (the database that runs the world)
Weeks 19–23   ➜  Golang (backend power)
Week  24      ➜  Full-Stack Integration Project + Interview Sprint
```

---

## 🔵 Phase 1: JavaScript Deep Dive (Weeks 1–4)

> "If you don't understand JS deeply, you'll struggle in React, Node, and every interview."

### Week 1 — Language Mechanics
| Day | Topic | What to Master | Interview Signal |
|-----|-------|----------------|-----------------|
| 1 | Execution Context & Call Stack | How JS runs code line by line, creation vs execution phase | "Explain what happens when JS runs a file" |
| 2 | Hoisting & Temporal Dead Zone | `var` vs `let`/`const` hoisting, function declarations vs expressions | Output prediction questions |
| 3 | Scope Chain & Lexical Scope | Block scope, function scope, scope lookup chain | "What will this log?" questions |
| 4 | `this` keyword | 4 rules: default, implicit, explicit (`call`/`apply`/`bind`), `new` | "What is `this` here?" — #1 JS interview question |
| 5 | Closures | Functions remembering their birth scope, practical uses (data privacy, factories) | Implement counter, memoize, once() |
| 6 | Prototypes & Inheritance | `__proto__`, prototype chain, `Object.create`, `class` sugar | "How does inheritance work in JS?" |
| 7 | Review + Build | Build a mini module system using closures + prototypes | Solidify understanding |

### Week 2 — Async JavaScript
| Day | Topic | What to Master | Interview Signal |
|-----|-------|----------------|-----------------|
| 1 | Event Loop | Call stack, Web APIs, callback queue, microtask queue | "Predict the output of setTimeout + Promise + console.log" |
| 2 | Promises Deep Dive | States, chaining, error propagation, `Promise.resolve`/`reject` | "Implement Promise.all from scratch" |
| 3 | `Promise.all` / `allSettled` / `race` / `any` | When to use each, error handling differences | "Which Promise method for this scenario?" |
| 4 | Async/Await | Sugar over promises, error handling with try/catch, sequential vs parallel | "Refactor this callback hell" |
| 5 | Generators & Iterators | `function*`, `yield`, custom iterables, `for...of` protocol | "How does async/await work under the hood?" |
| 6 | Error Handling Patterns | Custom errors, error boundaries, global handlers, retry patterns | "Design an error handling strategy" |
| 7 | Review + Build | Build a task queue with concurrency limit using Promises | Portfolio piece + interview prep |

### Week 3 — Data Structures in JS
| Day | Topic | What to Master | Interview Signal |
|-----|-------|----------------|-----------------|
| 1 | Arrays Deep Dive | `map`/`filter`/`reduce`/`flat`/`flatMap`, performance characteristics | "Implement groupBy / flatten" |
| 2 | Objects & Maps | Object.keys/values/entries, `Map` vs Object, `WeakMap` | "When to use Map over Object?" |
| 3 | Sets & WeakSets | Deduplication, set operations (union, intersection, difference) | "Remove duplicates from array" |
| 4 | Destructuring & Spread | Deep destructuring, rest params, shallow copy gotchas | "What's wrong with this spread?" |
| 5 | `Proxy` & `Reflect` | Intercept operations, reactive systems, validation | "How does Vue/MobX reactivity work?" |
| 6 | Symbols & Well-known Symbols | `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.hasInstance` | Advanced: "Make an object iterable" |
| 7 | Review + Solve | 10 LeetCode Easy/Medium using JS | Speed + pattern recognition |

### Week 4 — Modern JS & Patterns
| Day | Topic | What to Master | Interview Signal |
|-----|-------|----------------|-----------------|
| 1 | ES Modules vs CommonJS | `import`/`export`, dynamic `import()`, tree shaking | "CJS vs ESM differences?" |
| 2 | Design Patterns | Observer, Pub/Sub, Factory, Singleton, Strategy in JS | "Implement EventEmitter" |
| 3 | Functional Patterns | Pure functions, immutability, composition, currying, pipe | "Implement pipe/compose" |
| 4 | Debounce & Throttle | Implementation from scratch, use cases, requestAnimationFrame | "Implement debounce" — top interview Q |
| 5 | Web APIs | `fetch`, `AbortController`, `IntersectionObserver`, `MutationObserver` | "Cancel an in-flight request" |
| 6 | Memory & Performance | Garbage collection, memory leaks, `WeakRef`, `FinalizationRegistry` | "Find the memory leak" |
| 7 | **JS MOCK INTERVIEW** | 2-hour mock: 3 coding + 2 concept questions | Identify gaps → repeat |

**✅ Phase 1 Checkpoint:** You can explain the event loop, implement Promise.all, write a debounce, and predict any `this` / closure output question.

---

## 🟣 Phase 2: TypeScript Mastery (Weeks 5–8)

> "TypeScript isn't optional anymore. It's the language of production React and modern backends."

### Week 5 — Foundations
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Types, Interfaces, Type Aliases | When to use each, extending, merging, `readonly` |
| 2 | Union & Intersection Types | Discriminated unions, type narrowing with `in`, `typeof`, `instanceof` |
| 3 | Literal Types & Enums | `as const`, string literal unions vs enums, const enums |
| 4 | Functions in TS | Overloads, generic functions, `this` parameter type, rest params |
| 5 | Type Guards & Assertions | `is` predicates, `asserts`, custom type guards, `satisfies` |
| 6 | Classes in TS | Access modifiers, abstract classes, implements vs extends |
| 7 | Review + Exercises | Convert a JS project to strict TypeScript |

### Week 6 — Generics
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Generic Functions | `<T>`, constraints with `extends`, default type params |
| 2 | Generic Interfaces & Classes | Repository pattern, generic React components |
| 3 | Conditional Types | `T extends U ? X : Y`, `infer`, distributive conditionals |
| 4 | Mapped Types | `[K in keyof T]`, modifiers (`+readonly`, `-?`), key remapping |
| 5 | Template Literal Types | String manipulation at type level, pattern matching |
| 6 | `const` Type Parameters | `<const T>`, preserving literal types, builder patterns |
| 7 | Review + Type Challenges | Solve 10 problems from [type-challenges](https://github.com/type-challenges/type-challenges) |

### Week 7 — Utility Types & Advanced
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Built-in Utility Types | `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly` |
| 2 | Extract, Exclude, NonNullable | Set theory with types, filtering unions |
| 3 | `ReturnType`, `Parameters`, `Awaited` | Extracting types from functions and promises |
| 4 | Implement Utility Types from Scratch | Build your own `DeepPartial`, `DeepReadonly`, `Prettify` |
| 5 | Module System | Declaration files (`.d.ts`), module augmentation, ambient declarations |
| 6 | `satisfies` & Advanced Inference | Real-world config patterns, const assertions + satisfies |
| 7 | Review + Type Challenges | Solve 10 Medium type-challenges |

### Week 8 — TS in Practice
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | React + TypeScript | Component props, event types, generic components, `forwardRef` |
| 2 | API Types | Typing REST responses, Zod for runtime validation, tRPC concepts |
| 3 | Error Handling in TS | Result types, discriminated union errors, never type |
| 4 | tsconfig Deep Dive | `strict`, `moduleResolution`, `target`, `paths`, project references |
| 5 | Advanced Patterns | Branded types, phantom types, builder pattern, exhaustive checks |
| 6 | Performance | Avoiding deep type instantiation, `interface` vs `type` perf, `tsc --noEmit` CI |
| 7 | **TS MOCK INTERVIEW** | Type challenges + "Type this function" + "Fix this type error" |

**✅ Phase 2 Checkpoint:** You can implement utility types from scratch, write generic React components, and solve medium type-challenges.

---

## 🟢 Phase 3: React + Next.js (Weeks 9–14)

> "Don't just know the API. Understand WHY React works the way it does."

### Week 9 — React Fundamentals (Deeply)
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | JSX, Components, Props | Composition patterns, children, render props |
| 2 | `useState` Deep Dive | Batching, updater functions, lazy initialization, object state gotchas |
| 3 | `useEffect` Deep Dive | Cleanup, dependency array, stale closures, data fetching |
| 4 | `useRef` & `useReducer` | DOM refs, mutable refs, complex state logic, dispatch patterns |
| 5 | Lists, Keys & Conditional Rendering | Why keys matter (reconciliation), pattern matching rendering |
| 6 | Forms | Controlled vs uncontrolled, `FormData`, React Hook Form basics |
| 7 | Review + Build | Todo app with full CRUD, filters, localStorage persistence |

### Week 10 — Hooks Mastery
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Custom Hooks | `useLocalStorage`, `useFetch`, `useDebounce`, `useMediaQuery` |
| 2 | `useMemo` & `useCallback` | When they help, when they hurt, referential equality |
| 3 | `useContext` | Theme switching, auth context, avoiding re-render hell |
| 4 | `useLayoutEffect` | vs `useEffect`, DOM measurement, preventing flicker |
| 5 | `useSyncExternalStore` | Subscribing to external stores, browser APIs, third-party state |
| 6 | `useId` & `useTransition` | Accessibility, concurrent features, pending UI |
| 7 | Review + Build | Build a custom hook library (5+ hooks with tests) |

### Week 11 — Advanced React Patterns
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Component Composition | Compound components, slot pattern, polymorphic components |
| 2 | State Management | Zustand (create store, selectors, middleware, persist) |
| 3 | Server State | TanStack Query (queries, mutations, invalidation, optimistic updates) |
| 4 | Error Boundaries | `ErrorBoundary` component, `react-error-boundary`, fallback UI |
| 5 | Performance | `React.memo`, virtualization, code splitting, `lazy`/`Suspense` |
| 6 | Testing | React Testing Library, testing hooks, mocking, user-event |
| 7 | Review + Build | Dashboard with Zustand + TanStack Query + error boundaries |

### Week 12 — React 19 & Server Components
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Server Components Mental Model | Server vs Client boundary, `'use client'`, serialization rules |
| 2 | Server Actions | `'use server'`, form actions, `useActionState`, progressive enhancement |
| 3 | `use()` Hook | Unwrapping promises and context in render, Suspense integration |
| 4 | `useOptimistic` | Optimistic UI updates, rollback on error |
| 5 | React Compiler | Auto-memoization, what it means for `useMemo`/`useCallback` |
| 6 | Streaming & Suspense | `<Suspense>` for data, streaming SSR, loading UI patterns |
| 7 | Review + Build | RSC-powered page with server actions and optimistic updates |

### Week 13 — Next.js App Router
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | File-based Routing | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, route groups |
| 2 | Data Fetching | Server component fetching, `fetch` caching, revalidation strategies |
| 3 | Server Actions in Next.js | Form mutations, `revalidatePath`, `redirect` |
| 4 | Middleware & Auth | `middleware.ts`, protecting routes, session handling |
| 5 | API Routes | `route.ts`, streaming responses, edge runtime |
| 6 | Deployment | Vercel, self-hosting, Docker, environment variables |
| 7 | Review + Build | Full-stack Next.js app with auth, CRUD, and protected routes |

### Week 14 — React Interview Sprint
| Day | Focus |
|-----|-------|
| 1 | Build: Autocomplete component from scratch (debounce + fetch + keyboard nav) |
| 2 | Build: Infinite scroll list with virtualization |
| 3 | Build: Multi-step form with validation and state management |
| 4 | Concepts: Virtual DOM, Fiber, reconciliation, concurrent mode — explain clearly |
| 5 | Concepts: "When does React re-render?" — the complete answer |
| 6 | System Design: "Design a chat application frontend" — architecture, state, real-time |
| 7 | **REACT MOCK INTERVIEW** — 1 live coding + 1 system design + concept questions |

**✅ Phase 3 Checkpoint:** You can build a full-stack Next.js app, explain React internals, build any component from scratch, and handle RSC questions.

---

## 🔶 Phase 4: PostgreSQL (Weeks 15–18)

> "Every full-stack dev who knows SQL well gets hired faster. Most don't know it well."

### Week 15 — SQL Fundamentals
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Tables, Types, Constraints | `CREATE TABLE`, `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK` |
| 2 | CRUD Operations | `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `RETURNING` clause |
| 3 | Filtering & Sorting | `WHERE`, `ORDER BY`, `LIMIT`/`OFFSET`, `LIKE`, `IN`, `BETWEEN` |
| 4 | Joins | `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`, `CROSS JOIN` — draw Venn diagrams |
| 5 | Aggregations | `GROUP BY`, `HAVING`, `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` |
| 6 | Subqueries | Correlated vs non-correlated, `EXISTS`, `IN` with subquery, `ANY`/`ALL` |
| 7 | Review + Exercises | 20 SQL problems on [pgexercises.com](https://pgexercises.com/) |

### Week 16 — Intermediate PostgreSQL
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Window Functions | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG`/`LEAD`, `PARTITION BY` |
| 2 | CTEs & Recursive Queries | `WITH` clause, recursive CTEs for trees/hierarchies |
| 3 | Indexes | B-tree, Hash, GIN, GiST, partial indexes, composite indexes, `EXPLAIN ANALYZE` |
| 4 | Transactions | `BEGIN`/`COMMIT`/`ROLLBACK`, isolation levels, `SERIALIZABLE`, deadlocks |
| 5 | Views & Materialized Views | `CREATE VIEW`, `REFRESH MATERIALIZED VIEW`, when to use each |
| 6 | JSON in PostgreSQL | `jsonb`, `->`, `->>`, `@>`, `jsonb_agg`, indexing JSON with GIN |
| 7 | Review + Build | Design a schema for a social media app (users, posts, comments, likes, follows) |

### Week 17 — Advanced PostgreSQL
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Query Optimization | `EXPLAIN ANALYZE`, sequential vs index scan, query planner, `pg_stat_statements` |
| 2 | Stored Functions | `CREATE FUNCTION`, PL/pgSQL, triggers |
| 3 | Full-Text Search | `tsvector`, `tsquery`, `to_tsvector()`, ranking, GIN indexes for search |
| 4 | Partitioning | Range, List, Hash partitioning, when to partition |
| 5 | Constraints & Data Integrity | `ON DELETE CASCADE`, `ON UPDATE`, deferrable constraints, exclusion constraints |
| 6 | Backup, Restore & Replication | `pg_dump`, `pg_restore`, streaming replication concepts |
| 7 | Review + Performance | Take the social media schema → add indexes → benchmark with `EXPLAIN ANALYZE` |

### Week 18 — PostgreSQL in Production
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Connection Pooling | PgBouncer, connection limits, pool sizing |
| 2 | Migrations | Migration tools (golang-migrate, Prisma Migrate, dbmate), up/down patterns |
| 3 | ORMs & Query Builders | Prisma (TS), GORM (Go), sqlc (Go) — when to use ORM vs raw SQL |
| 4 | PostgreSQL + Go | `pgx` driver, connection pool, prepared statements, `sqlc` code generation |
| 5 | PostgreSQL + TypeScript | Prisma or Drizzle ORM, type-safe queries, migrations |
| 6 | Security | Row-level security (RLS), roles, `pg_hba.conf`, SQL injection prevention |
| 7 | **SQL MOCK INTERVIEW** — Write complex queries under pressure, explain indexes, design schemas |

**✅ Phase 4 Checkpoint:** You can design normalized schemas, write window functions, optimize queries with `EXPLAIN ANALYZE`, and use Postgres from both Go and TypeScript.

---

## 🔷 Phase 5: Golang (Weeks 19–23)

> "Go is simple by design. Master the fundamentals and concurrency — that's 90% of Go."

### Week 19 — Go Fundamentals
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Setup, Variables, Types | `go mod init`, `:=`, basic types, zero values, type conversion |
| 2 | Control Flow | `if`, `switch` (no break needed), `for` (the only loop), `range` |
| 3 | Functions | Multiple returns, named returns, variadic, first-class functions |
| 4 | Structs & Methods | Value vs pointer receivers, embedding (composition over inheritance) |
| 5 | Pointers | `&`, `*`, when to use pointers vs values, nil pointers |
| 6 | Slices Deep Dive | Length vs capacity, `append` gotchas, `copy`, slice header internals |
| 7 | Maps & Strings | Map iteration order, `rune` vs `byte`, string immutability, `strings` package |

### Week 20 — Interfaces & Error Handling
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Interfaces | Implicit satisfaction, empty interface, interface composition |
| 2 | Type Assertions & Switches | `x.(Type)`, `x.(type)`, ok pattern, when to use |
| 3 | Standard Interfaces | `io.Reader`, `io.Writer`, `fmt.Stringer`, `error`, `sort.Interface` |
| 4 | Error Handling | `error` interface, `fmt.Errorf` + `%w`, custom errors |
| 5 | `errors.Is` & `errors.As` | Error wrapping chain, sentinel errors, typed errors |
| 6 | `panic` & `recover` | When to panic (almost never), recover in deferred functions |
| 7 | Review + Build | Build a CLI tool with proper error handling and interfaces |

### Week 21 — Concurrency
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Goroutines | `go` keyword, goroutine lifecycle, stack growth, scheduling |
| 2 | Channels Basics | Unbuffered vs buffered, send/receive, closing, `range` over channel |
| 3 | Channel Patterns | Fan-out/fan-in, pipeline, done channel, or-channel |
| 4 | `select` Statement | Multi-channel operations, timeouts, default case, non-blocking ops |
| 5 | `sync` Package | `Mutex`, `RWMutex`, `WaitGroup`, `Once`, `Pool` |
| 6 | `errgroup` & `context` | Cancellation, timeouts, `context.WithCancel`, `context.WithTimeout` |
| 7 | Review + Build | Build a concurrent web scraper with rate limiting and graceful shutdown |

### Week 22 — Go in Production
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | HTTP Server | `net/http`, `http.Handler`, `http.HandlerFunc`, `ServeMux` |
| 2 | Middleware | Logging, auth, CORS, recovery, middleware chaining |
| 3 | Router Libraries | Chi or standard `http.NewServeMux` (Go 1.22+ pattern matching) |
| 4 | JSON & Validation | `encoding/json`, struct tags, custom marshaling, request validation |
| 5 | Database Access | `pgx` for PostgreSQL, connection pooling, `sqlc` for type-safe queries |
| 6 | Testing | `testing` package, table-driven tests, `httptest`, benchmarks, mocks |
| 7 | Review + Build | REST API with PostgreSQL, middleware, proper error handling |

### Week 23 — Advanced Go & Interview Prep
| Day | Topic | What to Master |
|-----|-------|----------------|
| 1 | Generics | Type parameters, constraints, `comparable`, generic data structures |
| 2 | `slog` & Observability | Structured logging, `slog.Handler`, metrics with Prometheus |
| 3 | Dependency Injection | Wire, manual DI, constructor injection, interface-based DI |
| 4 | Project Structure | `/cmd`, `/internal`, `/pkg` layout, clean architecture in Go |
| 5 | Common Gotchas | Goroutine leaks, `defer` in loops, slice append, nil interface |
| 6 | System Design with Go | "Design a URL shortener" — Go backend + PostgreSQL + caching |
| 7 | **GO MOCK INTERVIEW** — Concurrency question + API design + "What's wrong with this code?" |

**✅ Phase 5 Checkpoint:** You can build a production Go API with PostgreSQL, handle concurrency safely, write idiomatic error handling, and explain goroutine internals.

---

## 🏆 Phase 6: Integration & Interview Sprint (Week 24)

### Full-Stack Capstone Project

Build a **real-time task management app** using the full stack:

```
Frontend:  React 19 + TypeScript + Next.js App Router + Zustand + TanStack Query
Backend:   Golang + Chi router + pgx + sqlc
Database:  PostgreSQL (normalized schema, indexes, migrations)
Auth:      JWT or session-based
Deploy:    Docker Compose (local) → Vercel + Fly.io (production)
```

**Features to implement:**
- [ ] User registration & login
- [ ] Create/Read/Update/Delete tasks
- [ ] Real-time updates (WebSocket or SSE)
- [ ] Task assignment & collaboration
- [ ] Search with PostgreSQL full-text search
- [ ] Pagination with cursor-based approach
- [ ] Optimistic UI updates
- [ ] Error handling end-to-end

### Interview Sprint Schedule

| Day | Activity |
|-----|----------|
| Mon | DSA practice — 3 LeetCode Medium (arrays, strings, hashmaps) |
| Tue | System Design — Design one system end-to-end with your stack |
| Wed | Frontend mock — Build a component from scratch + React concepts |
| Thu | Backend mock — Go API design + SQL query challenge |
| Fri | Behavioral — STAR method stories, "Tell me about a time..." |
| Sat | Full mock — 45 min coding + 45 min system design |
| Sun | Review gaps, refine weak areas |

---

## 🎯 Interview Question Bank by Stack

### JavaScript (Top 10 Must-Know)
1. Explain the event loop with an example
2. What is a closure? Give 3 practical uses
3. Implement `Promise.all` from scratch
4. Implement `debounce` and `throttle`
5. Explain prototypal inheritance
6. `==` vs `===` — explain type coercion rules
7. What is `this`? Explain the 4 binding rules
8. Implement `Array.prototype.reduce`
9. Explain event delegation
10. What's the difference between `var`, `let`, `const`?

### TypeScript (Top 10)
1. `interface` vs `type` — when to use each?
2. Implement `Pick<T, K>` from scratch
3. Explain discriminated unions with an example
4. What is `unknown` vs `any` vs `never`?
5. How do conditional types work?
6. What does `satisfies` do?
7. Explain generics constraints with `extends`
8. How does type narrowing work?
9. What are mapped types?
10. How do you type a higher-order function?

### React (Top 10)
1. Explain the Virtual DOM and reconciliation
2. When does React re-render a component? (complete answer)
3. Build an autocomplete component (live coding)
4. `useEffect` cleanup — when and why?
5. `useMemo` vs `useCallback` vs `React.memo`
6. What are Server Components? How do they differ?
7. How would you optimize a slow React app?
8. Controlled vs uncontrolled components
9. How does `useRef` work and when to use it?
10. Design a state management solution for a large app

### PostgreSQL (Top 10)
1. Write a query with window functions (ROW_NUMBER, RANK)
2. Explain indexes — when to use, types, composite indexes
3. What is `EXPLAIN ANALYZE`? Read a query plan
4. Design a normalized schema for [X] (e-commerce, social media)
5. JOINs — explain all types with examples
6. What are transactions and isolation levels?
7. CTEs vs subqueries — when to use each?
8. How would you handle full-text search?
9. What is connection pooling and why does it matter?
10. Write a migration strategy for zero-downtime deployment

### Golang (Top 10)
1. Goroutines vs threads — what's the difference?
2. Explain channels — buffered vs unbuffered
3. How does the `select` statement work?
4. What happens if you don't close a channel?
5. Explain the `context` package — cancellation and timeouts
6. How does Go handle errors? Why no exceptions?
7. Interface satisfaction — explain with code
8. What are the common goroutine leak patterns?
9. Explain `defer` — execution order and gotchas
10. Design a worker pool in Go

---

## 📊 Skill Level Self-Assessment

Rate yourself **honestly** each month (1-5):

| Skill | Month 1 | Month 3 | Month 6 |
|-------|---------|---------|---------|
| JS: Can explain event loop clearly | /5 | /5 | /5 |
| JS: Can implement Promise.all | /5 | /5 | /5 |
| TS: Can solve Medium type challenges | /5 | /5 | /5 |
| TS: Can type a full React app strictly | /5 | /5 | /5 |
| React: Can build any component from scratch | /5 | /5 | /5 |
| React: Can explain RSC and when to use them | /5 | /5 | /5 |
| SQL: Can write window functions confidently | /5 | /5 | /5 |
| SQL: Can optimize queries with EXPLAIN | /5 | /5 | /5 |
| Go: Can build concurrent systems safely | /5 | /5 | /5 |
| Go: Can design & build a REST API | /5 | /5 | /5 |
| System Design: Can design end-to-end | /5 | /5 | /5 |
| Speed Typing: 50+ WPM on code | /5 | /5 | /5 |

---

## 🔑 Daily Routine for Top-Tier Growth

```
Morning (1 hr):
  └─ 30 min: Study topic of the day (from roadmap)
  └─ 30 min: 1-2 LeetCode problems (in JS or Go)

Work Hours:
  └─ Apply what you're learning in real work
  └─ Use TypeScript strict mode, write tests, use PostgreSQL

Evening (1 hr):
  └─ 30 min: Build project / exercises from this repo
  └─ 15 min: Speed typing practice
  └─ 15 min: Review failed interview questions / flashcards

Weekend (2-3 hrs):
  └─ Mock interview or system design practice
  └─ Capstone project work
  └─ Review and fill knowledge gaps
```

---

## 💡 The Difference Between Good and Great

| Good Developer | Top-Tier Developer |
|---|---|
| Knows React hooks | Knows WHY hooks exist (algebraic effects, composition model) |
| Writes SQL queries | Reads `EXPLAIN ANALYZE` and optimizes queries |
| Uses goroutines | Prevents goroutine leaks and designs graceful shutdown |
| Writes TypeScript | Builds type-safe APIs end-to-end (tRPC/sqlc) |
| Follows tutorials | Reads source code and RFCs |
| Preps for interviews | Can explain trade-offs in system design |

---

> **Remember:** Consistency > intensity. 2 hours daily for 6 months beats 10 hours on random weekends. Track your progress, be honest about gaps, and build things that scare you a little.
