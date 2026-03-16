# Gaps — The Only Things Killing You

> Extracted from REAL interview failures. Not theory. Not 200 drills.
> Just the 8 things that keep coming up. Fix these = clear L2.

---

## GAP 1: React Props Destructuring (Techversant Task)

**What happened:** Wrote `(child, index)` instead of `({child, index})`. Table showed nothing.
**The fix:** React components receive ONE props object. Always destructure with `{}`.

```jsx
// ❌ WRONG — child = entire props object, index = undefined
const TableBody = (child, index) => { ... }

// ✅ RIGHT — destructure from props
const TableBody = ({child, index}) => { ... }
```

**Drill:** Build a dynamic table from JSON. Keys as columns. Delete row. Toggle columns. From scratch. 15 min.
**File:** `drills/react/table-builder.jsx`

---

## GAP 2: Dynamic Key Access (Techversant Task)

**What happened:** Tried `child.name`, `child.age` — hardcoding keys instead of dynamic access.
**The fix:** Use `Object.keys()` + bracket notation `item[key]`.

```jsx
// ❌ Hardcoded
<td>{child.name}</td><td>{child.age}</td>

// ✅ Dynamic
{Object.keys(data[0]).map(key => <td>{item[key]}</td>)}
```

**Drill:** Same table builder drill. Make it work with ANY JSON shape.

---

## GAP 3: HTML Table Structure (Techversant Task)

**What happened:** Put `<tr>` inside `<td>` instead of `<td>` inside `<tr>`.
**The fix:** `<table>` → `<thead>/<tbody>` → `<tr>` → `<th>/<td>`. Always.

**Drill:** Write a table from memory in 60 seconds. Do it 3 times.

---

## GAP 4: React Fiber vs Stack Reconciler (Experion L2)

**What happened:** Knew "Fiber is the new thing" but couldn't explain WHY or HOW.
**The fix:** Practice saying this out loud:

> "The old stack reconciler was synchronous — once React started rendering, it couldn't stop.
> Fiber broke rendering into small units of work (fiber nodes in a linked list). 
> React can now pause, resume, and prioritize — user input gets processed before background updates.
> This powers useTransition, Suspense, and concurrent features."

**Drill:** Explain React Fiber in 60 seconds. Record yourself. No notes.

---

## GAP 5: Build/Dev Scripts & Tooling (Experion L2)

**What happened:** Use `npm run dev` and `npm run build` daily but couldn't explain the difference.
**The fix:** Practice saying this:

> "Dev starts a local server with HMR, source maps, no minification — fast iteration.
> Build creates optimized production output — minified, tree-shaken, code-split.
> Dev is in-memory, build outputs to disk."

**Drill:** Explain dev vs build in 30 seconds. Then explain `--legacy-peer-deps` in 30 seconds.

---

## GAP 6: Architecture-Level Thinking (Techversant L2)

**What happened:** Interviewer (Solution Architect) asked about security, distributed systems, event-driven. You answered at code level. He wanted system level.
**The fix:** Every answer should have LAYERS, not just one tool.

```
❌ "I use bcrypt for passwords"
✅ "Defense-in-depth: API gateway rate-limits login attempts, auth service
    uses bcrypt, tokens are short-lived httpOnly cookies with refresh rotation,
    failed attempts trigger alerts, audit logging for compliance"
```

**Drill:** Pick any topic. Explain it at 3 levels: code → service → system. 90 seconds.

---

## GAP 7: Database Schema Design & Insights (Techversant L2)

**What happened:** Interviewer grilled on DB schemas, indexing, query optimization — Node.js + DB integration.
**The fix:** Master these patterns:

```sql
-- Schema design: normalize, use proper types, add constraints
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes: add where you filter/join/sort
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- EXPLAIN ANALYZE: always check your queries
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 5 AND status = 'pending';
```

**Node.js integration patterns:**
```js
// Connection pooling (never create new connection per request)
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 20 });

// Parameterized queries (prevent SQL injection)
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// Transactions
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO orders ...', [...]);
  await client.query('UPDATE inventory ...', [...]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

**Drill:** Design a schema for an e-commerce app (users, products, orders, order_items). Write it from memory. 10 min.
**File:** `drills/db/schema-design.sql`

---

## GAP 8: Circuit Breaker Pattern (CSE)

**What happened:** Security/resilience scenario question — missed circuit breaker as a key pattern.
**The fix:** Three states: CLOSED (normal) → OPEN (fail fast) → HALF-OPEN (test one request).

> "Circuit breaker prevents cascading failures. If a downstream service fails N times,
> the breaker opens and we fail fast with a fallback. After a timeout, we let one test
> request through. If it succeeds, we close the breaker. This protects the entire system
> from one service's failure."

**Drill:** Implement a CircuitBreaker class from scratch in JS/TS. 5 min.

---

## The Pattern

Look at these 8 gaps. They fall into 3 buckets:

| Bucket | Gaps | Fix |
|--------|------|-----|
| **Syntax under pressure** | #1, #2, #3 | Build the table 3x this week. Muscle memory. |
| **"I use it but can't explain it"** | #4, #5 | 60-second verbal drills. Record yourself. |
| **Wrong level of abstraction** | #6, #7, #8 | Practice at system level, not code level. |

> Fix these 8 things. That's it. Not 200 drills. Eight.
