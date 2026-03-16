# 🔐 TECH VERSANT — Frontend Security Deep Drill

> **Context:** CSE cleared ✅. TechVersant emphasizes frontend security handling.
> **Format:** Question → Crisp answer → Code example → "Say this" script
> **Prep:** Read once. Close. Explain out loud. Repeat until boring.

---

## 🎯 TOP 15 SECURITY QUESTIONS THEY WILL ASK

---

### Q1: "How do you handle security in a React application?"

> **The framework answer — say this FIRST, then they'll drill into specifics:**

**SAY THIS:**
> "I approach frontend security in layers. First, React's JSX auto-escaping protects against most XSS by default. On top of that, I set CSP headers to block inline scripts, store auth tokens in httpOnly cookies — never localStorage — with SameSite=Strict for CSRF protection. Input validation happens on both client and server. Dependencies are audited in CI with `npm audit`. And I enforce HTTPS with HSTS headers. It's defense-in-depth — no single layer is enough."

---

### Q2: "How do you prevent XSS in React?"

**3 Types — know them:**
```
Stored XSS    → Script saved in DB (comment field) → runs for all users
Reflected XSS → Script in URL param → reflected in HTML response
DOM-based XSS → Script manipulates DOM via JS (innerHTML) → never hits server
```

**React's built-in protection:**
```jsx
// ✅ SAFE — React auto-escapes this
const userInput = '<script>alert("xss")</script>';
return <p>{userInput}</p>;
// Renders as TEXT, not HTML — script does NOT execute
```

**Where React DOESN'T protect you:**
```jsx
// ❌ dangerouslySetInnerHTML — bypasses escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ javascript: in href — executes JS
<a href={userInput}>Click</a>
// If userInput = "javascript:alert('xss')" → runs!

// ❌ Dynamic script injection
const script = document.createElement('script');
script.src = userInput; // attacker controls URL
document.body.appendChild(script);

// ❌ eval() with user input — NEVER
eval(userInput);
```

**How to fix when you MUST render HTML:**
```jsx
import DOMPurify from 'dompurify';

// Sanitize BEFORE rendering
const clean = DOMPurify.sanitize(userHTML);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

**Validate href:**
```jsx
const isSafeUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Usage
<a href={isSafeUrl(url) ? url : '#'}>Link</a>
```

**SAY THIS:**
> "React auto-escapes JSX — that's the first layer. But dangerouslySetInnerHTML, unvalidated href, and eval bypass that. I sanitize with DOMPurify when rendering user HTML, validate URLs to block javascript: protocol, set CSP headers to block inline scripts, and store tokens in httpOnly cookies so even if XSS runs, it can't steal the auth token."

---

### Q3: "Where do you store JWT tokens? Why?"

```
┌──────────────────────────────────────────────────────────────┐
│ Storage          │ XSS Steals?  │ CSRF Risk?  │ Verdict     │
├──────────────────────────────────────────────────────────────┤
│ localStorage     │ ✅ YES       │ ❌ No       │ ❌ AVOID    │
│ sessionStorage   │ ✅ YES       │ ❌ No       │ ❌ AVOID    │
│ httpOnly Cookie  │ ❌ NO        │ ✅ YES*     │ ✅ USE THIS │
│ Memory (JS var)  │ ✅ YES       │ ❌ No       │ ⚠️ Lost on  │
│                  │              │             │   refresh   │
└──────────────────────────────────────────────────────────────┘
* CSRF mitigated with SameSite=Strict
```

**The correct cookie setup:**
```
Set-Cookie: access_token=eyJhbGc...;
  HttpOnly;          → JS can't read it (blocks XSS theft)
  Secure;            → HTTPS only
  SameSite=Strict;   → blocks cross-origin requests (prevents CSRF)
  Path=/;
  Max-Age=900;       → 15 min expiry
```

**SAY THIS:**
> "httpOnly cookies, always. HttpOnly means JavaScript can't access it — so XSS can't steal the token. SameSite=Strict prevents CSRF by blocking cross-origin cookie sending. Secure ensures HTTPS only. For refresh tokens, I use a separate httpOnly cookie scoped to the /refresh endpoint via Path restriction. Never localStorage — one XSS vulnerability and all tokens are stolen."

---

### Q4: "What is CSRF and how do you prevent it?"

**The attack:**
```
1. You're logged into bank.com (cookie in browser)
2. You visit evil.com
3. evil.com has: <img src="https://bank.com/transfer?to=attacker&amount=10000">
4. Browser auto-sends your bank.com cookie
5. Bank processes the transfer thinking it's YOU
```

**Prevention:**
```
1. SameSite=Strict cookie  → browser won't send cookie on cross-origin requests
2. CSRF Token              → server generates, embeds in form, validates on submit
3. Origin/Referer check    → server rejects if origin doesn't match
4. Custom header check     → require X-Requested-With header (can't be set cross-origin)
```

**In React (using a CSRF token):**
```jsx
// Backend sends CSRF token in a non-httpOnly cookie or meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

// Attach to every mutating request
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,   // server validates this
  },
  credentials: 'include',        // send cookies
  body: JSON.stringify(data),
});
```

**SAY THIS:**
> "CSRF tricks the browser into making requests with the user's cookies. SameSite=Strict is the primary defense — the browser won't send cookies on cross-origin requests. I also use CSRF tokens for form submissions — the server generates a random token, the frontend sends it in a header, and the server validates it. Cross-origin requests can't read or set this token."

---

### Q5: "Explain CORS — how do you configure it securely?"

**What CORS does:**
```
Browser blocks cross-origin requests by DEFAULT (Same-Origin Policy).
CORS headers tell the browser which origins are allowed.
```

**Secure configuration (backend):**
```javascript
// ✅ GOOD — specific origin
app.use(cors({
  origin: 'https://myapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,  // cache preflight for 24 hrs
}));

// ❌ BAD — wide open
app.use(cors({ origin: '*' }));
// Even worse: origin: '*' with credentials: true → browser REJECTS this

// ⚠️ DYNAMIC — validate against whitelist
const whitelist = ['https://myapp.com', 'https://admin.myapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

**Preflight (OPTIONS) — when it happens:**
```
Simple requests (no preflight): GET, HEAD, POST with text/plain
Preflight required:
  → POST/PUT/PATCH/DELETE with Content-Type: application/json
  → Any custom headers (Authorization, X-Custom-*)
  → Browser sends OPTIONS first → server responds with allowed origins/methods
```

**SAY THIS:**
> "CORS is the browser enforcing same-origin policy. The server responds with Access-Control-Allow-Origin to whitelist specific origins — never use wildcard in production. For requests with credentials, you must specify the exact origin. I set maxAge to cache preflight responses and reduce OPTIONS requests. Preflight happens automatically for any request with JSON content type or custom headers like Authorization."

---

### Q6: "What is CSP and how do you implement it?"

**Content Security Policy — HTTP header that blocks unauthorized resources:**

```
Content-Security-Policy:
  default-src 'self';                        → default: only own origin
  script-src 'self' https://cdn.trusted.com; → scripts: self + this CDN
  style-src 'self' 'unsafe-inline';          → styles: self + inline (CSS-in-JS)
  img-src 'self' https: data:;               → images: self + any HTTPS + data URIs
  connect-src 'self' https://api.myapp.com;  → fetch/XHR: self + API
  frame-ancestors 'none';                    → prevent iframe embedding (clickjacking)
  base-uri 'self';                           → prevent base tag injection
  form-action 'self';                        → forms can only submit to self
```

**In Next.js (next.config.js):**
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://api.myapp.com; frame-ancestors 'none';",
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

**How CSP blocks XSS:**
```
Attacker injects: <script>steal(document.cookie)</script>
CSP: script-src 'self' → browser blocks inline script → XSS neutralized
```

**SAY THIS:**
> "CSP is defense-in-depth for XSS. Even if an attacker injects a script tag, the browser blocks it because inline scripts aren't in our allowed sources. I set script-src to self and trusted CDNs only, frame-ancestors to none to prevent clickjacking, and connect-src to whitelist our API endpoints. In Next.js, I configure it in the headers config."

---

### Q7: "How do you handle authentication securely in a React SPA?"

**The secure auth flow:**
```
1. User submits credentials → HTTPS POST to /api/login
2. Server validates → issues JWT access token (15 min) + refresh token (7 days)
3. Both sent as httpOnly, Secure, SameSite=Strict cookies
4. Frontend sends requests → browser auto-attaches cookies
5. Access token expires → frontend calls /api/refresh → gets new access token
6. Refresh token expires → user must re-login
```

**React implementation pattern:**
```jsx
// Auth context — stores user info, NOT the token
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — check if session is valid
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // cookies
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) setUser(await res.json());
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Protected route:**
```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

**SAY THIS:**
> "Token is in httpOnly cookie — the frontend never sees or stores it. On mount, I call /api/me to check if the session is valid. The auth context stores the user object, not the token. Token refresh happens automatically via the cookie. Protected routes redirect to login if no user. All requests use credentials: include so the browser sends the cookie."

---

### Q8: "How do you prevent sensitive data exposure in the frontend?"

```
1. NEVER put secrets in frontend code:
   ❌ const API_KEY = 'sk-abc123';          → visible in bundle
   ❌ REACT_APP_SECRET=xyz in .env          → bundled into JS
   ✅ Use backend proxy — frontend calls YOUR server, server uses the key

2. Environment variables:
   ❌ REACT_APP_* / NEXT_PUBLIC_* for secrets → they're in the JS bundle
   ✅ Only put PUBLIC values (API URLs, feature flags) in NEXT_PUBLIC_*
   ✅ Secrets stay server-side only

3. Source maps in production:
   ❌ Deploying .map files → attackers read your source code
   ✅ Disable source maps OR upload to error tracking (Sentry) only

4. Network tab exposure:
   → Assume users can see EVERY request/response in DevTools
   → Never return sensitive data the frontend doesn't need
   → Backend should filter responses to only include necessary fields

5. Git:
   → .gitignore: .env, .env.local, *.pem, *.key
   → If a secret was ever committed, rotate it — git history is permanent
```

**SAY THIS:**
> "Rule one: never put secrets in frontend code — environment variables prefixed with NEXT_PUBLIC are in the JS bundle, visible to anyone. Secrets go server-side only. I use a backend proxy for third-party APIs. Source maps are disabled in production or uploaded to Sentry privately. And I design APIs to return only the data the frontend needs — minimize exposure."

---

### Q9: "How do you secure API calls from the frontend?"

```javascript
// 1. Always use HTTPS — never HTTP
const API_BASE = 'https://api.myapp.com';

// 2. Send auth via cookies, not headers (for httpOnly security)
fetch(`${API_BASE}/data`, {
  credentials: 'include',
});

// 3. Validate and sanitize inputs BEFORE sending
const sanitizedInput = input.trim().slice(0, 500); // limit length

// 4. Rate limiting — backend enforces, frontend respects
// Debounce search inputs, disable buttons after submit

// 5. Request/Response interceptor (Axios example)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired — try refresh
      return refreshTokenAndRetry(error.config);
    }
    if (error.response?.status === 403) {
      // Not authorized — redirect
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);
```

**SAY THIS:**
> "HTTPS only, auth via httpOnly cookies, debounce user-triggered requests to reduce abuse surface. Axios interceptors handle 401s with automatic token refresh and 403s with redirects. Input is validated and length-limited before sending. The real security is on the backend — rate limiting, input validation, authorization checks — but the frontend should be a responsible first layer."

---

### Q10: "How do you handle role-based access control (RBAC) on the frontend?"

```jsx
// Role from auth context (decoded from JWT by backend, not frontend)
const { user } = useContext(AuthContext);
// user = { id: 1, name: 'Tijo', role: 'admin', permissions: ['read', 'write', 'delete'] }

// Permission check utility
const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission);
};

// Conditional rendering
function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <ViewReports />  {/* everyone sees this */}

      {hasPermission(user, 'write') && <CreateReport />}
      {hasPermission(user, 'delete') && <DeleteButton />}
      {user.role === 'admin' && <AdminPanel />}
    </div>
  );
}

// Protected route with role check
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" />;
  return children;
}
```

**⚠️ CRITICAL — say this:**
> "Frontend RBAC is for UX — hiding buttons and routes the user shouldn't see. It is NOT security. The real authorization check happens on the backend — every API endpoint verifies the user's role/permissions from the JWT. A user can always bypass frontend checks with DevTools or curl. Frontend hides, backend enforces."

---

### Q11: "What security headers should every app have?"

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  → Force HTTPS for 1 year. Prevent SSL stripping.

Content-Security-Policy: default-src 'self'; script-src 'self'; ...
  → Block unauthorized scripts, styles, resources.

X-Content-Type-Options: nosniff
  → Prevent browser from MIME-sniffing (treating a text file as JS).

X-Frame-Options: DENY
  → Prevent clickjacking. Use CSP frame-ancestors instead (modern).

Referrer-Policy: strict-origin-when-cross-origin
  → Don't leak full URL path in Referer header on cross-origin requests.

Permissions-Policy: camera=(), microphone=(), geolocation=()
  → Disable browser features you don't use.

X-XSS-Protection: 0
  → Disable legacy XSS filter (it has bypass bugs). CSP is better.

Cache-Control: no-store
  → For sensitive pages (dashboards, account). Prevent caching.
```

**SAY THIS:**
> "My baseline headers are HSTS for forced HTTPS, CSP for script control, X-Content-Type-Options nosniff, X-Frame-Options DENY, strict Referrer-Policy, and Permissions-Policy to disable unused browser APIs. For sensitive pages like account settings, I add Cache-Control: no-store."

---

### Q12: "How do you handle file uploads securely?"

```javascript
// Frontend validation (UX, not security)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const handleUpload = (file) => {
  // Type check
  if (!ALLOWED_TYPES.includes(file.type)) {
    return showError('Invalid file type');
  }
  // Size check
  if (file.size > MAX_SIZE) {
    return showError('File too large (max 5MB)');
  }

  // Upload with FormData
  const formData = new FormData();
  formData.append('file', file);

  fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // NO Content-Type header — browser sets multipart boundary
  });
};

// Backend MUST also:
// 1. Validate file type by magic bytes, not just extension/MIME
// 2. Limit file size
// 3. Store outside webroot (not in /public)
// 4. Generate random filenames (prevent path traversal)
// 5. Scan for malware if handling user docs
// 6. Serve via CDN with Content-Disposition: attachment
```

**SAY THIS:**
> "Frontend validates type and size for UX — fast feedback. But the real validation is backend: check magic bytes not just MIME type, limit file size, store outside the webroot with random filenames to prevent path traversal, and serve downloads with Content-Disposition: attachment. Never trust the frontend-only check."

---

### Q13: "How do you protect against clickjacking?"

```
Attack: Attacker loads your site in an invisible iframe,
        overlays a fake button that aligns with your "Delete Account" button.
        User clicks "Win Prize!" → actually clicks "Delete Account" on your site.

Prevention:
1. X-Frame-Options: DENY              → old but works everywhere
2. CSP: frame-ancestors 'none'        → modern replacement
3. JavaScript frame-busting (backup):
```

```javascript
// Frame-busting fallback (if headers fail)
if (window.self !== window.top) {
  window.top.location = window.self.location;
}
```

---

### Q14: "How do you handle third-party scripts securely?"

```html
<!-- Subresource Integrity (SRI) — verify CDN scripts haven't been tampered -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>

<!-- If the hash doesn't match → browser blocks the script -->
```

```javascript
// CSP to restrict which scripts can load
// Content-Security-Policy: script-src 'self' https://cdn.example.com

// Never load scripts from untrusted sources
// Audit third-party scripts regularly
// Use npm audit for dependencies
// Consider sandboxing third-party widgets in iframes
```

**SAY THIS:**
> "I use Subresource Integrity hashes for CDN scripts — if the file is tampered with, the browser blocks it. CSP script-src whitelists only trusted sources. For npm dependencies, I run npm audit in CI and review lock file diffs in PRs to catch supply chain attacks. Third-party widgets get sandboxed in iframes with restrictive sandbox attributes."

---

### Q15: "What is the BFF pattern and when do you use it?"

```
BFF = Backend For Frontend

Without BFF:
  React SPA → directly calls multiple microservices
  → CORS complexity, token handling in browser, API key exposure

With BFF:
  React SPA → YOUR Next.js/Express server → microservices
  → Same-origin cookies (no CORS issues)
  → Server holds API keys (never exposed to browser)
  → Server aggregates data from multiple services
  → Token refresh handled server-side
```

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐
│  React   │────►│  BFF (Next)  │────►│ Microservice │
│  Browser │     │  Same Origin │     │ Auth Service │
│          │◄────│  httpOnly    │     │ User Service │
│          │     │  cookies     │────►│ Data Service │
└─────────┘     └─────────────┘     └──────────────┘
```

**SAY THIS:**
> "BFF keeps security server-side. The React app talks only to its own origin — same-origin httpOnly cookies, no CORS, no API keys in the browser. The BFF aggregates data from microservices and handles token management. In Next.js, API routes or server components act as the BFF layer naturally."

---

## ⚡ RAPID-FIRE TABLE — If They Speed-Test You

| Question | One-Liner |
|----------|-----------|
| XSS prevention in React? | JSX auto-escapes. Avoid dangerouslySetInnerHTML. CSP headers. httpOnly cookies. |
| localStorage for tokens? | Never. XSS can read it. Use httpOnly cookies. |
| CSRF prevention? | SameSite=Strict cookies + CSRF tokens for forms. |
| CORS wildcard? | Never in production. Specify exact origins. |
| CSP purpose? | Whitelist allowed script/resource sources. Blocks injected scripts. |
| HTTPS vs HTTP? | Always HTTPS. HSTS header forces it. Prevents MITM. |
| Frontend RBAC real security? | No. It's UX. Backend enforces authorization on every request. |
| Source maps in production? | Disable or upload to Sentry only. Attackers read your code otherwise. |
| npm audit? | Run in CI. Review lock file diffs. Use Dependabot. |
| Clickjacking? | X-Frame-Options: DENY or CSP frame-ancestors 'none'. |
| File upload security? | Frontend: type + size check. Backend: magic bytes, random names, outside webroot. |
| SRI? | Hash on CDN script tags. Browser blocks if tampered. |
| BFF pattern? | Frontend talks to same-origin server. Server holds secrets + calls microservices. |
| Refresh token storage? | httpOnly cookie scoped to /refresh endpoint via Path. |
| NEXT_PUBLIC_ secrets? | NEVER. They're in the JS bundle. Secrets stay server-side. |

---

## 🧠 CONFIDENCE ANCHORS

1. **You built a KYC portal** — that's one of the most security-sensitive systems possible. You've handled PII, document verification, multi-jurisdiction compliance.

2. **You know the JWT storage answer cold** — httpOnly + Secure + SameSite=Strict. This is THE question they ask.

3. **Defense-in-depth is your theme** — no single security measure is enough. Layers: React escaping → CSP → httpOnly cookies → server validation.

4. **Frontend security is UX + first layer** — you understand that the backend is the real enforcer. This shows maturity.

5. **You can code it, not just explain it** — DOMPurify, CSRF tokens, auth context, protected routes. You have implementation examples ready.

---

> **Go crush it. You know this material. Talk about what you've built. Security is layers, not magic. 🔐**
