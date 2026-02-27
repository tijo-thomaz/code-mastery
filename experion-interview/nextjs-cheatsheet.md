# ⚡ Next.js Cheatsheet — Everything for Interview Day

> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. SSR vs SSG vs ISR — The Decision Tree

```
Question: "When is the HTML built?"

SSG (Static Site Generation)
  → HTML built at BUILD TIME (npm run build)
  → Fastest. Served from CDN.
  → Use for: Blog, docs, marketing pages, rarely-changing content
  → Think: "Build once, serve forever"

SSR (Server-Side Rendering)
  → HTML built on EVERY REQUEST on the server
  → Slower (server does work per request), but always fresh
  → Use for: Dashboard, user-specific pages, search results, anything personalized
  → Think: "Fresh every time, but costs server CPU"

ISR (Incremental Static Regeneration)
  → HTML built at build time, REVALIDATES after N seconds
  → Best of both: fast like SSG, fresh-ish like SSR
  → Use for: Product pages, news articles, anything that changes periodically
  → Think: "Static but refreshes itself"

CSR (Client-Side Rendering)
  → No server HTML. JS loads in browser, renders there.
  → Use for: Heavily interactive parts (charts, editors) after initial page load
  → Think: "Regular React SPA behavior"
```

**Say this in interview:**
> "I'd use SSG for content that rarely changes — docs, landing pages. SSR for personalized or real-time data — dashboards, user profiles. ISR when content changes periodically — product pages that update every 60 seconds. And CSR for heavily interactive widgets that don't need SEO."

---

## 2. App Router File Conventions

```
app/
├── layout.tsx          → Shared wrapper (persists across navigations)
├── page.tsx            → The route's UI (/ route)
├── loading.tsx         → Suspense fallback (auto-wraps page in <Suspense>)
├── error.tsx           → Error boundary (auto-wraps page in ErrorBoundary)
├── not-found.tsx       → 404 page
├── route.ts            → API endpoint (GET, POST handlers)
│
├── dashboard/
│   ├── page.tsx        → /dashboard route
│   ├── layout.tsx      → Dashboard-specific layout (nested)
│   └── [id]/
│       └── page.tsx    → /dashboard/123 (dynamic route)
│
├── (marketing)/        → Route group (parentheses = no URL segment)
│   ├── about/page.tsx  → /about
│   └── pricing/page.tsx → /pricing
│
└── api/
    └── users/
        └── route.ts    → /api/users endpoint
```

**Key rules:**
- `page.tsx` = makes a route accessible
- `layout.tsx` = wraps children, persists state across navigations (no re-mount)
- `loading.tsx` = auto Suspense (no manual `<Suspense>` needed)
- `error.tsx` = auto ErrorBoundary (must be `'use client'`)
- `(folder)` = route group, organizes files without affecting URL
- `[param]` = dynamic segment, accessed via `params.param`
- `[...slug]` = catch-all route

---

## 3. Server Components vs Client Components

```
SERVER COMPONENTS (default)                CLIENT COMPONENTS ('use client')
──────────────────────────                 ─────────────────────────────
✅ Run on server only                      ✅ Run in browser
✅ Can access DB, filesystem directly      ✅ Can use useState, useEffect
✅ Zero JS shipped to browser              ✅ Can use onClick, onChange
✅ Can use async/await in component        ✅ Can use browser APIs (localStorage)
❌ NO useState, useEffect                  ❌ Can't access DB directly
❌ NO onClick, onChange                    ❌ JS shipped to browser
❌ NO browser APIs                        ❌ Must serialize props from server
```

**The rule:** Everything is a Server Component by default. Add `'use client'` ONLY when you need interactivity (state, effects, events, browser APIs).

**Say this in interview:**
> "Server Components are the default in App Router. They run on the server, can access the database directly, and ship zero JavaScript to the browser. I add 'use client' only when I need interactivity — useState, useEffect, event handlers, or browser APIs like localStorage. The boundary is: server for data, client for interaction."

**The boundary pattern:**
```jsx
// ServerPage.tsx — NO 'use client' needed
export default async function Page() {
  const data = await db.query("SELECT * FROM users"); // direct DB access!
  return <ClientForm users={data} />;  // pass data down
}

// ClientForm.tsx
'use client';
import { useState } from 'react';
export function ClientForm({ users }) {
  const [search, setSearch] = useState('');
  // interactive stuff here
}
```

---

## 4. Data Fetching in App Router

```jsx
// SERVER COMPONENT — just use async/await. No useEffect. No loading state.
export default async function UsersPage() {
  const res = await fetch('https://api.example.com/users');
  const users = await res.json();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Caching behavior (fetch options):
fetch(url)                          // Default: cached (like SSG)
fetch(url, { cache: 'no-store' })   // No cache (like SSR — fresh every request)
fetch(url, { next: { revalidate: 60 } })  // ISR (revalidate every 60 seconds)
```

**Say this in interview:**
> "In the App Router, Server Components can fetch data directly with async/await — no useEffect, no loading state needed. The loading.tsx file handles Suspense automatically. Fetch is extended with caching options: default is cached like SSG, `no-store` forces SSR, and `revalidate: N` gives you ISR."

---

## 5. Server Actions

```jsx
// What: Functions that run on the SERVER, called from CLIENT forms/buttons.
// Why: Replace API routes for mutations. Progressive enhancement built-in.

// app/actions.ts
'use server';
export async function addTodo(formData: FormData) {
  const text = formData.get('text');
  await db.insert({ text, done: false });
  revalidatePath('/todos');  // refresh the page data
}

// app/todos/page.tsx
import { addTodo } from '../actions';

export default function TodosPage() {
  return (
    <form action={addTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}
// Works even with JS disabled! Progressive enhancement.
```

**Say this in interview:**
> "Server Actions are functions marked with 'use server' that run on the server but can be called from client forms. They replace API routes for mutations — no need to write a POST endpoint and fetch to it. I use revalidatePath to refresh the page data after a mutation. They also work without JavaScript enabled, which is progressive enhancement."

---

## 6. Middleware

```typescript
// middleware.ts (at project root — runs on EVERY request)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// Only run on specific paths:
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

**Use cases:** Auth redirects, geolocation, A/B testing, rate limiting, adding headers.

---

## 7. next/image & next/link

```jsx
// next/image — auto-optimizes images
import Image from 'next/image';
<Image src="/hero.jpg" alt="Hero" width={800} height={400} priority />
// Auto: lazy loading, WebP/AVIF conversion, responsive sizing, blur placeholder

// next/link — client-side navigation + prefetching
import Link from 'next/link';
<Link href="/about">About</Link>
// Auto: prefetches page on hover/viewport, no full page reload
```

---

## 8. Pages Router vs App Router (They WILL Ask)

| Feature | Pages Router (old) | App Router (new, Next 13+) |
|---|---|---|
| File convention | `pages/about.tsx` | `app/about/page.tsx` |
| Data fetching | `getServerSideProps`, `getStaticProps` | `async` Server Components, `fetch` |
| Layouts | `_app.tsx`, `_document.tsx` (global only) | `layout.tsx` (nested, per-route) |
| Loading states | Manual (useState) | `loading.tsx` (auto Suspense) |
| Error handling | `_error.tsx` (global) | `error.tsx` (per-route ErrorBoundary) |
| Server Components | ❌ No | ✅ Default |
| Streaming | ❌ No | ✅ Built-in with Suspense |

**Say this in interview:**
> "App Router is the current standard. The big shifts: Server Components by default, nested layouts that persist across navigations, file-based loading and error states, and streaming with Suspense. Pages Router used getServerSideProps and getStaticProps — App Router replaces those with async Server Components and extended fetch."

---

## 9. Key Next.js APIs

| API | What It Does |
|---|---|
| `useRouter()` | Client-side navigation: `router.push('/about')`, `router.back()` |
| `useParams()` | Access dynamic route params: `const { id } = useParams()` |
| `useSearchParams()` | Access query string: `searchParams.get('q')` |
| `usePathname()` | Current pathname: `/dashboard/settings` |
| `redirect()` | Server-side redirect (in Server Components or Server Actions) |
| `revalidatePath(path)` | Purge cache for a path (in Server Actions) |
| `revalidateTag(tag)` | Purge cache by tag (for tagged fetches) |
| `generateMetadata()` | Dynamic SEO metadata per page |
| `generateStaticParams()` | Pre-render dynamic routes at build time (like getStaticPaths) |

---

## 10. When to Use Next.js vs Plain React (CRA/Vite)

| Use Next.js When | Use Plain React (Vite) When |
|---|---|
| SEO matters (marketing, blog, e-commerce) | Internal tools, admin panels, dashboards |
| You need SSR/SSG/ISR | Pure client-side app (no SEO needs) |
| Full-stack (API routes + frontend) | Frontend only (separate backend) |
| Image optimization needed | Simple app without heavy images |
| You want file-based routing | You prefer manual routing (react-router) |

---

## Quick-Fire Answers (Say These Out Loud)

| Question | 30-Second Answer |
|---|---|
| "What is Next.js?" | "A React framework that adds server-side rendering, static generation, file-based routing, and API routes. It's React with production superpowers — SEO, performance, and full-stack capabilities out of the box." |
| "SSR vs SSG?" | "SSG builds HTML at deploy time — fastest, served from CDN. SSR builds HTML per request — always fresh, but server work per request. I pick based on how often data changes." |
| "What are Server Components?" | "Components that run on the server, ship zero JS to the browser, and can access databases directly. They're the default in App Router. I add 'use client' only when I need interactivity." |
| "What is ISR?" | "Incremental Static Regeneration. Static pages that revalidate after a time period. Best of both worlds — fast like SSG, fresh-ish like SSR. I'd use it for product pages that update every 60 seconds." |
| "App Router vs Pages Router?" | "App Router is current. Key differences: Server Components by default, nested layouts, file-based loading/error states, and streaming. Pages Router used getServerSideProps — App Router replaces that with async components." |
| "What are Server Actions?" | "Functions marked 'use server' that run on the server but are called from client forms. Replace API routes for mutations. Work without JS enabled — progressive enhancement." |
| "How does next/image help?" | "Auto lazy loading, format conversion to WebP/AVIF, responsive sizing, blur placeholders. Images are the #1 performance problem on the web — next/image solves it automatically." |
