# 🌐 REST API Design — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. What is REST?

**One-line:** REST (Representational State Transfer) is an architectural style for APIs that uses HTTP methods on URL-identified resources, with stateless communication.

**6 Constraints (they rarely ask all 6, but know them):**
```
1. Client-Server     → Frontend and backend are separate
2. Stateless         → Each request contains ALL info needed (no server-side sessions)
3. Cacheable         → Responses must say if they're cacheable or not
4. Uniform Interface → Consistent URL structure + HTTP methods
5. Layered System    → Client doesn't know if it's talking to the real server or a proxy
6. Code on Demand    → (Optional) Server can send executable code (rarely used)
```

**Say this in interview:**
> "REST is an architectural style where resources are identified by URLs, manipulated through standard HTTP methods, and communication is stateless — meaning each request carries everything the server needs. This makes APIs predictable, cacheable, and scalable."

---

## 2. HTTP Methods → CRUD Mapping

```
Method    CRUD       Idempotent?   Request Body?   Example
──────    ────       ───────────   ─────────────   ───────
GET       Read       ✅ Yes        ❌ No           GET /api/tasks
POST      Create     ❌ No         ✅ Yes          POST /api/tasks
PUT       Replace    ✅ Yes        ✅ Yes          PUT /api/tasks/42
PATCH     Update     ✅ Yes        ✅ Yes          PATCH /api/tasks/42
DELETE    Delete     ✅ Yes        ❌ No           DELETE /api/tasks/42
```

**Key distinction — PUT vs PATCH:**
- **PUT** = replace the ENTIRE resource (send all fields)
- **PATCH** = update ONLY the fields you send (partial update)

**Say this in interview:**
> "PUT replaces the entire resource — if you omit a field, it gets removed. PATCH only updates the fields you include. In practice, most frontends use PATCH for updates because you rarely want to send every field."

**Idempotent means:** Calling it 10 times has the same effect as calling it once. GET, PUT, PATCH, DELETE are idempotent. POST is NOT — calling POST 10 times creates 10 resources.

---

## 3. Status Codes — The Ones That Matter

```
2xx — SUCCESS
  200 OK              → General success (GET, PATCH, DELETE)
  201 Created         → Resource created (POST). Include Location header
  204 No Content      → Success but no body to return (DELETE)

3xx — REDIRECTION
  301 Moved Permanently → URL changed forever. SEO: search engines update
  302 Found             → Temporary redirect
  304 Not Modified      → Cached version is still valid (ETag match)

4xx — CLIENT ERROR (your fault)
  400 Bad Request       → Invalid input, malformed JSON, validation failed
  401 Unauthorized      → Not authenticated (no token / expired token)
  403 Forbidden         → Authenticated but not authorized (wrong role)
  404 Not Found         → Resource doesn't exist
  409 Conflict          → Duplicate resource (e.g., email already registered)
  422 Unprocessable     → Valid JSON but semantically wrong (validation errors)
  429 Too Many Requests → Rate limited. Check Retry-After header

5xx — SERVER ERROR (their fault)
  500 Internal Server Error → Something crashed on the server
  502 Bad Gateway           → Server got bad response from upstream
  503 Service Unavailable   → Server overloaded or in maintenance
  504 Gateway Timeout       → Upstream server didn't respond in time
```

**The tricky one — 401 vs 403:**
- **401** = "Who are you?" (not logged in)
- **403** = "I know who you are, but you can't do this" (wrong permissions)

**Say this in interview:**
> "401 means the user isn't authenticated — no token or expired token. 403 means they're authenticated but lack permission — like a regular user trying to access an admin endpoint."

---

## 4. API Endpoint Design — Naming Conventions

**Rules:**
```
✅ Use plural nouns:        /api/tasks, /api/users
❌ Don't use verbs:         /api/getTask, /api/createUser ← WRONG
✅ Nest for relationships:  /api/users/42/tasks (tasks belonging to user 42)
✅ Use query params for filtering: /api/tasks?status=completed&priority=high
✅ Use path params for identity:   /api/tasks/42
```

**Real example — Task management API:**
```
GET    /api/tasks                    → List all tasks (with pagination)
GET    /api/tasks/42                 → Get task #42
POST   /api/tasks                    → Create a new task
PATCH  /api/tasks/42                 → Update task #42
DELETE /api/tasks/42                 → Delete task #42
GET    /api/tasks?status=completed   → Filter by status
GET    /api/tasks?assignee=5&sort=due_date  → Filter + sort
GET    /api/users/5/tasks            → Get tasks for user #5
```

**Query params vs Path params:**
- **Path params** = identifying a specific resource: `/tasks/42`
- **Query params** = filtering, sorting, pagination: `/tasks?status=done&page=2`

---

## 5. Pagination

### Offset-based (simple, common)
```json
// Request
GET /api/tasks?page=2&limit=20

// Response
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Cursor-based (scalable, better for real-time)
```json
// Request
GET /api/tasks?cursor=eyJpZCI6NDJ9&limit=20

// Response
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6NjJ9",
    "hasMore": true
  }
}
```

**Trade-off:**
| | Offset | Cursor |
|---|---|---|
| Simple to implement | ✅ | ❌ |
| Can jump to page N | ✅ | ❌ |
| Handles real-time inserts/deletes | ❌ (items shift) | ✅ |
| Performance on large datasets | ❌ (slow at page 1000) | ✅ |

**Say this in interview:**
> "I'd use offset pagination for admin dashboards where users jump between pages. For infinite scroll or real-time feeds, cursor-based is better because new inserts don't shift the results."

---

## 6. Error Response Structure

**Standard shape — be consistent across all endpoints:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": [
      { "field": "title", "message": "Title cannot be empty" },
      { "field": "dueDate", "message": "Due date must be in the future" }
    ]
  }
}
```

**How frontend handles it:**
```javascript
try {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    const { error } = await res.json();
    if (res.status === 422) {
      // Validation errors → show field-level messages
      setFieldErrors(error.details);
    } else if (res.status === 401) {
      // Unauthorized → redirect to login
      router.push('/login');
    } else {
      // Generic error → show toast
      showToast(error.message);
    }
    return;
  }

  const task = await res.json();
  // Success handling
} catch (err) {
  // Network error (no internet, server down)
  showToast('Something went wrong. Please try again.');
}
```

**Say this in interview:**
> "I structure error responses with a machine-readable code, a human-readable message, and field-level details for validation errors. On the frontend, I branch on the status code — 422 for field errors, 401 for auth redirect, and a generic toast for everything else. Network failures get caught separately."

---

## 7. API Versioning

```
Strategy 1: URL path (most common, most visible)
  /api/v1/tasks
  /api/v2/tasks

Strategy 2: Header (cleaner URL, harder to discover)
  Accept: application/vnd.myapp.v2+json

Strategy 3: Query param (easy but messy)
  /api/tasks?version=2
```

**Say this in interview:**
> "I prefer URL-based versioning — `/api/v1/` — because it's explicit, easy to route, and easy to discover. Header-based is cleaner but harder to test in a browser. I'd only introduce v2 when there's a breaking change, not for every update."

---

## 8. Rate Limiting

**What it is:** Server limits how many requests a client can make in a time window.

**Response headers:**
```
X-RateLimit-Limit: 100        → Max requests per window
X-RateLimit-Remaining: 23     → Requests left
X-RateLimit-Reset: 1677654321 → When the window resets (Unix timestamp)
```

**When exceeded → 429 Too Many Requests:**
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 37 seconds.",
    "retryAfter": 37
  }
}
```

**Frontend handling:**
```javascript
if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After') || 30;
  showToast(`Too many requests. Retrying in ${retryAfter}s...`);
  setTimeout(() => retryRequest(), retryAfter * 1000);
}
```

---

## 9. Authentication in APIs

```
Method              Where Token Lives     Best For
──────              ─────────────────     ────────
Bearer Token        Authorization header  SPAs, mobile apps
  → Authorization: Bearer eyJhbGc...

HttpOnly Cookie     Cookie (auto-sent)    SSR apps, traditional web
  → Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict

API Key             Header or query       Server-to-server, third-party
  → X-API-Key: abc123
```

**Say this in interview:**
> "For SPAs, I use JWT in an httpOnly cookie — not localStorage — because httpOnly prevents XSS from stealing the token, and SameSite=Strict prevents CSRF. The Authorization header with Bearer token works for mobile apps. API keys are for server-to-server communication where there's no user session."

*(See `security-cheatsheet.md` for the full JWT storage deep dive)*

---

## 10. CORS (Cross-Origin Resource Sharing)

**One-line:** CORS is a browser security mechanism that blocks requests from a different origin unless the server explicitly allows it.

**What is an origin?**
```
https://myapp.com:443   → scheme + host + port = origin
https://api.myapp.com   → DIFFERENT origin (different host)
http://myapp.com        → DIFFERENT origin (different scheme)
```

**How it works:**
```
1. Browser sends request from https://myapp.com to https://api.myapp.com
2. For "unsafe" requests (POST with JSON, custom headers), browser sends
   a PREFLIGHT request first:
     OPTIONS /api/tasks
     Origin: https://myapp.com
     Access-Control-Request-Method: POST
     Access-Control-Request-Headers: Content-Type, Authorization
3. Server responds:
     Access-Control-Allow-Origin: https://myapp.com
     Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
     Access-Control-Allow-Headers: Content-Type, Authorization
     Access-Control-Allow-Credentials: true
4. If headers match → browser sends actual request
   If not → browser blocks it (CORS error)
```

**Common mistakes:**
- `Access-Control-Allow-Origin: *` + `credentials: true` → **doesn't work.** Wildcard + credentials is not allowed.
- Forgetting to handle OPTIONS preflight on the server → request blocked.

---

## 11. Caching

```
Cache-Control: public, max-age=3600    → Cache for 1 hour
Cache-Control: no-cache                → Always revalidate with server
Cache-Control: no-store                → Never cache (sensitive data)

ETag: "abc123"                         → Fingerprint of the response
If-None-Match: "abc123"                → Client sends back ETag
→ Server returns 304 Not Modified if unchanged (no body = fast)
```

**Say this in interview:**
> "For API responses, I set Cache-Control headers based on data freshness needs — static reference data gets long max-age, user-specific data gets no-cache or short TTL. ETags let the browser revalidate without re-downloading unchanged data."

---

## 12. Interview Scenario: "Design the API for a Task Management Feature"

**Step 1 — Clarify requirements:**
> "Before I design the endpoints, can I clarify: Do tasks have assignees? Subtasks? Labels/tags? Due dates? Comments?"

**Step 2 — Core resources and endpoints:**
```
Tasks:
  GET    /api/tasks                          → List (paginated, filterable)
  GET    /api/tasks/:id                      → Get single task
  POST   /api/tasks                          → Create task
  PATCH  /api/tasks/:id                      → Update task
  DELETE /api/tasks/:id                      → Delete task

Task filtering:
  GET    /api/tasks?status=in_progress&assignee=5&sort=-due_date&page=1&limit=20

Comments:
  GET    /api/tasks/:id/comments             → List comments on task
  POST   /api/tasks/:id/comments             → Add comment

Labels:
  GET    /api/labels                         → List all labels
  POST   /api/tasks/:id/labels               → Add label to task
  DELETE /api/tasks/:id/labels/:labelId      → Remove label
```

**Step 3 — Request/Response shapes:**
```json
// POST /api/tasks
// Request:
{
  "title": "Implement login page",
  "description": "Build the login form with email/password",
  "assigneeId": 5,
  "dueDate": "2026-03-15",
  "priority": "high",
  "labelIds": [1, 3]
}

// Response: 201 Created
{
  "id": 42,
  "title": "Implement login page",
  "description": "Build the login form with email/password",
  "status": "todo",
  "priority": "high",
  "assignee": { "id": 5, "name": "Alice" },
  "labels": [
    { "id": 1, "name": "frontend" },
    { "id": 3, "name": "auth" }
  ],
  "dueDate": "2026-03-15",
  "createdAt": "2026-02-26T10:00:00Z",
  "updatedAt": "2026-02-26T10:00:00Z"
}
```

**Step 4 — Error cases:**
```json
// 422 — Validation error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid task data",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "dueDate", "message": "Due date must be in the future" }
    ]
  }
}

// 404 — Task not found
{ "error": { "code": "NOT_FOUND", "message": "Task 999 not found" } }

// 403 — Not authorized
{ "error": { "code": "FORBIDDEN", "message": "You can only delete your own tasks" } }
```

**Say this in interview:**
> "I'd design it around the Task resource with standard CRUD endpoints. Filtering and sorting go through query params on the list endpoint. Nested resources like comments use sub-routes. Every response has a consistent shape, and errors include field-level details for the frontend to display inline validation. I'd add pagination from day one — even if the dataset is small now, it prevents breaking changes later."

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "REST vs GraphQL?" | "REST is simpler, well-cached, good for CRUD. GraphQL is better when the frontend needs flexible queries or you have over-fetching problems. I'd start with REST unless the data shape is deeply nested or varies per client." |
| "What makes an API RESTful?" | "Resources identified by URLs, manipulated with HTTP methods, stateless communication, standard status codes, and a consistent response format." |
| "How do you handle API errors on the frontend?" | "I check the status code — 401 redirects to login, 422 shows field errors, 429 retries after delay, everything else shows a generic toast. Network failures are caught separately." |
| "PUT vs PATCH?" | "PUT replaces the entire resource. PATCH updates only the fields you send. I use PATCH for most updates." |
| "How do you handle file uploads?" | "Multipart form data for direct upload. For large files, I'd use pre-signed URLs — the frontend gets a signed S3 URL from the API, uploads directly to storage, then notifies the API." |
