# M5: Tooling — Webpack, Babel, NPM

> **JD says:** "Experience with Webpack, Babel, ESLint, NPM/Yarn"
> **This is where Experion killed you. Not again.**
> **Time:** 20 min

---

## SECTION A: Concepts to Explain

---

### 1. Webpack — What It Does

> "Module bundler. Takes source files (JS, TS, CSS, images), resolves the dependency graph via import/export, and bundles into optimized output files."

**Core concepts:**
| Concept | What |
|---------|------|
| Entry | Starting point (`src/index.js`) — Webpack builds the graph from here |
| Output | Where bundles go (`dist/bundle.js`) |
| Loaders | Transform files. `babel-loader` for JS/TS, `css-loader` for CSS, `file-loader` for images |
| Plugins | Extend functionality. `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `DefinePlugin` |
| Code splitting | `import()` creates separate chunks loaded on demand |
| Tree shaking | Removes unused exports — only works with ESM (import/export) |

### 2. Babel — What It Does

> "JavaScript compiler. Transforms modern JS/TS into backwards-compatible JS that older browsers can run. Also transforms JSX into React.createElement calls."

**Key presets:**
| Preset | What |
|--------|------|
| `@babel/preset-env` | Transforms ES6+ → ES5 based on browser targets |
| `@babel/preset-react` | Transforms JSX → `React.createElement` (or JSX runtime) |
| `@babel/preset-typescript` | Strips TypeScript types (doesn't type-check — use `tsc` for that) |

### 3. Dev vs Build (YOU KNOW THIS NOW)

| Aspect | `dev` | `build` |
|--------|-------|---------|
| Purpose | Local development | Production |
| Server | Dev server with HMR | No server — static files |
| Source maps | Full | Minimal or none |
| Minification | No | Yes (Terser/esbuild) |
| Tree-shaking | No | Yes |
| NODE_ENV | development | production |
| Speed | Fast rebuilds | Slower (full optimization) |

### 4. NPM — What `npm install` Does

> "Reads package.json → resolves dependency tree → downloads to node_modules → generates package-lock.json (pins exact versions for reproducible installs)."

### 5. `--legacy-peer-deps` (YOU KNOW THIS NOW)

> "npm 7+ made peer dep conflicts errors instead of warnings. `--legacy-peer-deps` uses old npm 6 behavior — ignores conflicts. It's a workaround. Better fix: update packages or use `overrides` in package.json."

### 6. ESLint

> "Static analysis tool — catches bugs and enforces code style WITHOUT running code. Configurable rules. Plugins for React (`eslint-plugin-react-hooks`), accessibility (`eslint-plugin-jsx-a11y`), TypeScript (`@typescript-eslint`). I enforce it in CI — PRs can't merge with lint errors."

---

## SECTION B: 🪤 TRAP QUESTIONS

---

### TRAP 1: What's tree-shaking? When does it NOT work?

> Tree-shaking removes unused exports from the bundle. Only works with ESM (`import/export`) — NOT CommonJS (`require`). Won't shake code with side effects — if a module runs code at import time, bundler keeps it. Mark packages as `"sideEffects": false` in package.json to enable aggressive shaking.

---

### TRAP 2: What's the difference between `dependencies`, `devDependencies`, and `peerDependencies`?

| Type | When installed | Example |
|------|---------------|---------|
| `dependencies` | Always — in dev AND production | react, axios |
| `devDependencies` | Only in development (`npm install --production` skips them) | jest, eslint, webpack |
| `peerDependencies` | NOT auto-installed. Consumer must provide them | react in a component library |

**Trap:** "Should React be a dependency or peer dependency?"
> In an **app**: dependency. In a **library/package**: peerDependency (don't bundle your own React — use the consumer's).

---

### TRAP 3: What's HMR and how does it work?

> "Hot Module Replacement. Dev server injects updated modules into the running app WITHOUT a full page reload. Preserves application state. Webpack dev server + webpack HMR plugin watches for file changes → sends updates over WebSocket → replaces only changed modules. Vite does this natively with ESM."

---

### TRAP 4: package.json vs package-lock.json

| File | What | Commit it? |
|------|------|-----------|
| `package.json` | Declares dependencies with version ranges (`^1.2.3`) | ✅ Yes |
| `package-lock.json` | Pins EXACT versions of entire dependency tree | ✅ Yes — ensures reproducible installs |

**Trap:** "Why commit the lock file?"
> Without it, `npm install` on different machines can resolve to different versions → "works on my machine" bugs.

---

### TRAP 5: `^` vs `~` in version ranges

```
^1.2.3 → >=1.2.3, <2.0.0  (allows minor + patch updates)
~1.2.3 → >=1.2.3, <1.3.0  (allows only patch updates)
1.2.3  → exactly 1.2.3    (no updates)
```

**Default:** `npm install react` adds `^` — allows minor updates. Lock file pins the exact resolved version.

---

## ✅ Checklist

- [ ] Can explain Webpack core concepts (entry, output, loaders, plugins)
- [ ] Can explain dev vs build cold (this killed you at Experion — never again)
- [ ] Can explain Babel presets and what they transform
- [ ] Can explain `--legacy-peer-deps` and the real fix (overrides)
- [ ] Know deps vs devDeps vs peerDeps with examples
- [ ] Can solve all 5 trap questions
