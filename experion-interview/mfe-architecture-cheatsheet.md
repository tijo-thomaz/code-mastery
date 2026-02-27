# 🧩 Micro-Frontend Architecture — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. What is Micro-Frontend Architecture?

**One-line:** Micro-frontends split a large frontend app into smaller, independently developed, tested, and deployed pieces — each owned by a different team, composed together at runtime or build time.

```
Monolith Frontend:
  ┌──────────────────────────────────┐
  │         ONE BIG REACT APP         │
  │  Dashboard + Settings + Billing   │
  │  + Admin + Reports + Auth         │
  │  All teams work in same codebase  │
  │  One deploy = everything ships    │
  └──────────────────────────────────┘
  → Merge conflicts, slow CI, one bug breaks everything

Micro-Frontend:
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Dashboard │  │ Settings │  │ Billing  │
  │ Team A    │  │ Team B   │  │ Team C   │
  │ React     │  │ React    │  │ Vue(!)   │
  │ v18       │  │ v18      │  │ v3       │
  └─────┬─────┘  └─────┬─────┘  └────┬─────┘
        │              │              │
  ┌─────▼──────────────▼──────────────▼─────┐
  │           App Shell / Container           │
  │     Routing, Auth, Shared Layout          │
  └───────────────────────────────────────────┘
  → Independent deploys, team autonomy, tech flexibility
```

**Say this in interview:**
> "Micro-frontends extend the microservices concept to the frontend. Each team owns a vertical slice of the product — from UI to API — and deploys independently. The app shell handles shared concerns like routing, auth, and layout, and composes the individual micro-apps together."

---

## 2. Integration Approaches

### A. Build-Time Integration (npm packages)

```
Each MFE is published as an npm package.
The shell app installs them as dependencies.

// package.json of shell
{
  "dependencies": {
    "@company/dashboard-mfe": "^2.1.0",
    "@company/settings-mfe": "^1.5.0"
  }
}
```

```
✅ Simple, type-safe, good DX
❌ NOT truly independent — changing one MFE requires rebuilding + redeploying the shell
❌ Version coupling — shell must update the dependency
→ Use for: Small teams, shared component libraries (not true MFE)
```

### B. Runtime Integration — Module Federation (Webpack 5)

```
Each MFE is a separate app that EXPOSES modules at runtime.
Shell loads them dynamically over the network. No rebuild needed.

// Dashboard MFE — webpack.config.js (exposes)
new ModuleFederationPlugin({
  name: 'dashboard',
  filename: 'remoteEntry.js',
  exposes: {
    './DashboardApp': './src/DashboardApp',
  },
  shared: ['react', 'react-dom'],  // Share to avoid duplicate React
})

// Shell — webpack.config.js (consumes)
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    dashboard: 'dashboard@https://dashboard.cdn.com/remoteEntry.js',
  },
  shared: ['react', 'react-dom'],
})

// Shell — usage
const DashboardApp = React.lazy(() => import('dashboard/DashboardApp'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardApp />
    </Suspense>
  );
}
```

```
✅ True independent deployment — update dashboard without touching shell
✅ Shared dependencies (single React instance)
✅ Works with any framework
❌ Complex setup (Webpack config, versioning shared deps)
❌ Runtime failures possible (remote is down, version mismatch)
→ Use for: Large orgs, 3+ teams, independent deploy requirement
```

### C. Runtime Integration — iframes

```html
<!-- Shell -->
<iframe src="https://dashboard.myapp.com" />
<iframe src="https://settings.myapp.com" />
```

```
✅ Complete isolation (CSS, JS, errors can't leak)
✅ Different frameworks, different versions, zero conflicts
❌ No shared state (postMessage only — slow, awkward)
❌ Bad UX (no shared routing, separate scrollbars, accessibility issues)
❌ Performance (each iframe loads its own React, CSS, etc.)
→ Use for: Embedding third-party widgets, legacy app migration (temporary)
```

### D. Runtime Integration — Web Components

```javascript
// Dashboard MFE defines a custom element
class DashboardElement extends HTMLElement {
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(<DashboardApp />);
  }
  disconnectedCallback() { /* cleanup */ }
}
customElements.define('dashboard-app', DashboardElement);

// Shell uses it as a regular HTML element
<dashboard-app user-id="42"></dashboard-app>
```

```
✅ Framework-agnostic (standard browser API)
✅ Style isolation via Shadow DOM
❌ React ↔ Web Component interop is clunky (passing objects, events)
❌ SSR support is limited
→ Use for: Framework-diverse teams, design system components
```

---

## 3. When to Use Micro-Frontends (and When NOT To)

### ✅ Use MFE When:

```
1. Multiple teams (3+) working on the same product
   → Team autonomy > code sharing. Each team deploys on their own schedule.

2. App is genuinely large and modular
   → Dashboard, admin, billing, reports are truly independent domains.

3. Independent deployment is a real requirement
   → "Billing team needs to ship a fix without waiting for Dashboard team's sprint."

4. Legacy migration
   → Wrap old Angular app in an iframe/web component, build new features in React.
   → Strangler fig pattern: replace piece by piece.

5. Different tech stacks per team
   → Team A prefers React, Team B inherited a Vue app. MFE lets them coexist.
```

### ❌ Do NOT Use MFE When:

```
1. Small team (1-5 devs)
   → The overhead of MFE setup, shared dependencies, deployment pipeline
      is WAY more than the benefit. Just use a monolith.

2. Features are tightly coupled
   → If Dashboard and Settings share 80% of the same state/components,
      splitting them creates more problems than it solves.

3. You just want code organization
   → Use a monorepo with workspaces (Nx, Turborepo) instead.
      Same code organization benefits without the runtime complexity.

4. "Netflix does it"
   → Netflix has 100+ frontend teams. You have 3 devs. Don't cargo cult.
```

**Say this in interview:**
> "I'd only reach for micro-frontends when there are genuinely independent teams that need independent deployment cycles. For a single team or a small app, the overhead isn't worth it — a well-structured monolith or monorepo gives you the same code organization without the runtime complexity. The biggest win for MFE is team autonomy, not code organization."

---

## 4. Key Challenges & How to Solve Them

| Challenge | Solution |
|---|---|
| **Shared dependencies** (duplicate React?) | Module Federation `shared` config. Singleton: true for React. Version ranges to allow flexibility |
| **Shared state** (user auth across MFEs?) | Shell owns auth state. Pass down via props, custom events, or a shared state bus. NOT Redux across MFEs |
| **Consistent UI** (MFEs look different?) | Shared design system as an npm package. All MFEs consume it. Version it carefully |
| **Routing** (who owns the URL?) | Shell owns top-level routes (`/dashboard/*`, `/settings/*`). Each MFE owns its sub-routes internally |
| **CSS conflicts** (styles leak between MFEs?) | CSS Modules, CSS-in-JS (styled-components), Shadow DOM, or naming conventions (BEM with MFE prefix) |
| **Error isolation** (one MFE crash kills all?) | Wrap each MFE in an ErrorBoundary. MFE crash → shows fallback, rest of app works |
| **Performance** (multiple bundles?) | Shared deps reduce duplication. Lazy load MFEs. Prefetch on hover/route proximity |
| **Testing** (how to test integration?) | Each MFE has its own unit/integration tests. E2E tests at shell level for integration |

---

## 5. Monolith vs Monorepo vs Micro-Frontend

```
                Monolith          Monorepo              Micro-Frontend
─────────────   ──────────        ──────────            ──────────────
Codebase        Single app        Single repo,          Separate repos
                                  multiple packages     (or monorepo + independent builds)

Deploy          All at once       Can deploy             Each MFE independently
                                  independently (Nx/Turbo)

Team coupling   High              Medium                 Low

Shared code     Easy (imports)    Easy (workspace refs)  Hard (npm packages or shared deps)

Complexity      Low               Medium                 High

Best for        Small teams,      Medium teams,          Large orgs,
                early stage       growing apps           3+ teams, legacy migration
```

**Say this in interview:**
> "I see it as a spectrum. Start with a monolith — it's simple and fast. When the codebase grows, move to a monorepo with Nx or Turborepo for better organization and independent builds. Only reach for micro-frontends when you have multiple teams that genuinely need independent deployment. The cost of MFE — shared dependency management, runtime integration, testing complexity — only pays off at scale."

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "What are micro-frontends?" | "Independent frontend apps composed into one product. Each team owns a vertical slice, deploys independently. Shell handles routing/auth." |
| "When would you use them?" | "3+ teams, independent deploy needs, or legacy migration. NOT for small teams — monorepo gives the same code organization without runtime complexity." |
| "Module Federation vs iframes?" | "Module Federation shares dependencies and integrates natively. Iframes give complete isolation but terrible UX and no shared state. MF is almost always better." |
| "How do you share state across MFEs?" | "Shell owns global state (auth, user). Pass to MFEs via props or custom events. Never share a Redux store across MFEs — that defeats the independence." |
| "What about CSS conflicts?" | "CSS Modules or CSS-in-JS per MFE. Or a shared design system package that all MFEs consume for consistency." |
| "Biggest risk of MFE?" | "Complexity without benefit. If teams aren't truly independent, MFE adds overhead for no gain. Also: runtime failures when a remote is down, and shared dependency version conflicts." |
| "Monolith vs MFE?" | "Start monolith. Move to monorepo when organized growth is needed. MFE only when team autonomy and independent deployment are real requirements." |
