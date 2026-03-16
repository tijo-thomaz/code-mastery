# 🔒 Security & OAuth — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. XSS (Cross-Site Scripting)

**One-line:** Attacker injects malicious JavaScript into your page, which runs in other users' browsers — stealing cookies, tokens, or data.

**3 Types:**
```
Stored XSS    → Malicious script saved in DB (e.g., comment field)
                → Every user who views that comment runs the script
                → Most dangerous

Reflected XSS → Script in URL query param, reflected back in HTML
                → https://site.com/search?q=<script>steal()</script>
                → Needs victim to click the link

DOM-based XSS → Script manipulates the DOM directly via JS
                → e.g., innerHTML = userInput
                → Never touches the server
```

**How React protects you:**
```jsx
// React auto-escapes JSX content — this is SAFE
const name = '<script>alert("xss")</script>';
return <p>{name}</p>;
// Renders as text: <script>alert("xss")</script>
// Does NOT execute
```

**When you're STILL vulnerable in React:**
```jsx
// ❌ DANGEROUS — bypasses React's escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ DANGEROUS — javascript: protocol in href
<a href={userInput}>Click</a>
// If userInput = "javascript:alert('xss')" → executes

// ❌ DANGEROUS — injecting into style attributes from user input
<div style={{ background: userInput }} />
```

**Prevention checklist:**
1. **Never use `dangerouslySetInnerHTML` with user input.** If you must, sanitize with DOMPurify first
2. **Validate `href` values** — ensure they start with `https://` or `/`, never `javascript:`
3. **CSP headers** — restrict where scripts can load from (see section 5)
4. **HttpOnly cookies** — even if XSS runs, it can't access the token
5. **Server-side output encoding** — the last line of defense

**Say this in interview:**
> "React's JSX auto-escaping handles most XSS by default — it renders user input as text, not HTML. The risks come from dangerouslySetInnerHTML, unvalidated href attributes, and injecting into style props. I'd also set CSP headers to block inline scripts and store tokens in httpOnly cookies so even if XSS gets through, it can't steal the auth token."

---

## 2. CSRF (Cross-Site Request Forgery)

**One-line:** Attacker tricks a logged-in user's browser into making an unwanted request to a site where they're authenticated — using the browser's auto-sent cookies.

**How it works:**
```
1. You're logged into bank.com (session cookie in browser)
2. You visit evil.com
3. evil.com has: <form action="https://bank.com/transfer" method="POST">
4. Browser auto-sends your bank.com cookie with the request
5. Bank thinks it's YOU making the transfer
```

**Prevention:**
```
1. CSRF Token    → Server generates random token, embeds in form,
                   validates on submission. Attacker can't guess it.

2. SameSite Cookie → Set-Cookie: token=xyz; SameSite=Strict
                     Browser won't send cookie on cross-origin requests

3. Check Origin/Referer headers → Server rejects if origin doesn't match
```

**Why SPAs with JWT in headers are mostly immune:**
```
If you store JWT in memory/localStorage and send via Authorization header:
→ Attacker's site can't set custom headers on cross-origin requests
→ CSRF relies on COOKIES being auto-sent — headers are NOT auto-sent
→ But you're now vulnerable to XSS stealing the token from localStorage

Trade-off: httpOnly cookie → immune to XSS theft, needs CSRF protection
           localStorage   → immune to CSRF, vulnerable to XSS theft
```

**Say this in interview:**
> "CSRF exploits the browser auto-sending cookies on cross-origin requests. The fix is SameSite=Strict on cookies and CSRF tokens for form submissions. SPAs that send JWTs via Authorization headers are mostly immune because headers aren't auto-sent — but then the token is in JavaScript-accessible storage, which opens XSS risk. That's why I prefer httpOnly cookies with SameSite=Strict — it covers both."

---

## 3. JWT Storage — THE Question

**"Where do you store the JWT? Why?"**

This is the #1 security question for frontend seniors. Know this cold.

### The Options:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Storage         │ XSS Can Steal? │ CSRF Risk? │ Persists?           │
├──────────────────────────────────────────────────────────────────────┤
│ localStorage    │ ✅ YES         │ ❌ No      │ Forever (manual)    │
│ sessionStorage  │ ✅ YES         │ ❌ No      │ Until tab closes    │
│ httpOnly Cookie │ ❌ NO          │ ✅ YES*    │ Until expiry        │
│ Memory (JS var) │ ✅ YES (XSS)   │ ❌ No      │ Until page refresh  │
└──────────────────────────────────────────────────────────────────────┘
* CSRF risk mitigated with SameSite=Strict
```

### The Correct Answer:

**httpOnly cookie with Secure + SameSite=Strict**

```
Set-Cookie: access_token=eyJhbGc...;
  HttpOnly;        → JavaScript can't read it (XSS can't steal it)
  Secure;          → Only sent over HTTPS
  SameSite=Strict; → Not sent on cross-origin requests (prevents CSRF)
  Path=/;          → Sent on all routes
  Max-Age=900;     → Expires in 15 minutes
```

**Why NOT localStorage:**
- Any XSS vulnerability = attacker reads `localStorage.getItem('token')` = game over
- You can sanitize all you want, but one npm dependency with XSS = all tokens stolen

**Why httpOnly cookie wins:**
- XSS runs JavaScript → but `httpOnly` means JS can't access the cookie → token is safe
- CSRF? → `SameSite=Strict` blocks cross-origin cookie sending
- Result: immune to both XSS token theft AND CSRF

**Say this in interview:**
> "I store JWTs in httpOnly cookies, not localStorage. HttpOnly means JavaScript — and therefore any XSS attack — can't read the token. I set SameSite=Strict to prevent CSRF, and Secure to ensure it's only sent over HTTPS. For short-lived access tokens, I set a 15-minute expiry. Refresh tokens go in a separate httpOnly cookie with a longer TTL and are only sent to the /refresh endpoint via Path restriction."

### If they push: "But what about SPAs where the API is on a different domain?"

> "If the API is cross-origin, SameSite=Strict won't send the cookie. I'd use SameSite=None with Secure — this requires HTTPS and explicit CORS configuration with credentials:true. Or better, I'd use a BFF (Backend for Frontend) pattern where the Next.js server proxies API calls, keeping the cookie on the same origin."

---

## 4. CORS (Cross-Origin Resource Sharing)

**One-line:** CORS is a browser mechanism that blocks cross-origin HTTP requests unless the server explicitly allows them via response headers.

**Same-Origin Policy:**
```
Same origin = same scheme + host + port
  https://app.com  →  https://app.com/api  ✅ Same origin
  https://app.com  →  https://api.app.com  ❌ Different host
  https://app.com  →  http://app.com       ❌ Different scheme
  http://localhost:3000 → http://localhost:8080  ❌ Different port
```

**Simple vs Preflight requests:**
```
Simple (no preflight):
  → GET, HEAD, POST with simple headers (Content-Type: text/plain, etc.)

Preflight required (browser sends OPTIONS first):
  → POST/PUT/PATCH/DELETE with Content-Type: application/json
  → Any request with custom headers (Authorization, X-Custom-*)

Preflight:
  OPTIONS /api/tasks
  Origin: https://myapp.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Authorization, Content-Type

  → 204 No Content
  Access-Control-Allow-Origin: https://myapp.com
  Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
  Access-Control-Allow-Headers: Authorization, Content-Type
  Access-Control-Max-Age: 86400  ← cache preflight for 24 hrs
```

**Common CORS mistakes:**
1. `Allow-Origin: *` with `credentials: true` → **browser rejects this**
2. Forgetting to handle OPTIONS on the server → preflight fails → request blocked
3. Not including `Authorization` in `Allow-Headers` → Bearer token requests blocked

---

## 5. CSP (Content Security Policy)

**One-line:** CSP is an HTTP header that tells the browser which sources of scripts, styles, images, etc. are allowed — blocking everything else, including injected XSS scripts.

```
Content-Security-Policy:
  default-src 'self';                    → Only load from own origin by default
  script-src 'self' https://cdn.js.com;  → Scripts only from self + this CDN
  style-src 'self' 'unsafe-inline';      → Styles from self + inline (needed for CSS-in-JS)
  img-src 'self' https: data:;           → Images from self, any HTTPS, or data URIs
  connect-src 'self' https://api.app.com; → Fetch/XHR only to self + API
  frame-ancestors 'none';                → Prevent clickjacking (replaces X-Frame-Options)
```

**How CSP prevents XSS:**
```
Without CSP: <script>steal(document.cookie)</script> → RUNS
With CSP: script-src 'self' → browser blocks inline scripts → XSS blocked
```

**Say this in interview:**
> "CSP is a defense-in-depth measure against XSS. Even if an attacker injects a script tag, the browser blocks it because it's not from an allowed source. I set script-src to only allow our own origin and trusted CDNs, and frame-ancestors to 'none' to prevent clickjacking."

---

## 6. Input Sanitization

**Rule:** Never trust user input. Validate on client (for UX). Sanitize on server (for security).

```javascript
// Client-side: for UX, not security
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// If you MUST render user HTML (rich text editor output):
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userHTML);
// Strips <script>, onclick=, javascript:, etc.

// Then render:
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

**Say this in interview:**
> "Client-side validation is for user experience — fast feedback. Server-side validation is for security — never trust client input. If I need to render user-generated HTML, I sanitize with DOMPurify before using dangerouslySetInnerHTML."

---

## 7. HTTPS & HSTS

**HTTPS:** Encrypts data in transit. Prevents man-in-the-middle attacks (reading/modifying data between client and server).

**HSTS (HTTP Strict Transport Security):**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
→ Forces browsers to ONLY use HTTPS for this domain
→ Prevents SSL stripping attacks (downgrade to HTTP)
```

---

## 8. Clickjacking

**What:** Attacker puts your site in an invisible iframe, overlays a "Click here to win!" button that actually clicks a button on your site.

**Prevention:**
```
X-Frame-Options: DENY                          → Old way, still works
Content-Security-Policy: frame-ancestors 'none' → Modern way (CSP)
```

---

## 9. Dependency Security

```bash
npm audit              → Check for known vulnerabilities
npm audit fix          → Auto-fix what's possible
npx npm-check-updates  → Check for outdated packages

# Lock files (package-lock.json / yarn.lock)
→ Pin exact versions so CI installs the same packages
→ Review lock file diffs in PRs — catch supply chain attacks
```

**Say this in interview:**
> "I run npm audit in CI to catch known vulnerabilities. I review lock file changes in PRs to catch supply chain attacks. For critical dependencies, I pin exact versions and use tools like Snyk or Dependabot for automated monitoring."

---

## 10. OAuth 2.0 — Authorization Code Flow (Google/Facebook Sign-In)

**One-line:** OAuth 2.0 lets users log into your app using their Google/Facebook account without sharing their password with you.

**The Flow (Authorization Code + PKCE for SPAs):**
```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Browser  │     │  Your Server  │     │ Google/Auth  │
│  (React)  │     │  (Backend)    │     │   Provider   │
└─────┬─────┘     └──────┬───────┘     └──────┬───────┘
      │                  │                     │
  1.  │ User clicks "Sign in with Google"      │
      │──────────────────────────────────────►│
      │        Redirect to Google login page   │
      │        with client_id + redirect_uri   │
      │        + scope + state + code_verifier │
      │                  │                     │
  2.  │◄─────────────────────────────────────│
      │  User logs in at Google, grants access │
      │  Google redirects back with AUTH CODE   │
      │  → https://yourapp.com/callback?code=abc123
      │                  │                     │
  3.  │ Send auth code   │                     │
      │─────────────────►│                     │
      │                  │  Exchange code       │
  4.  │                  │────────────────────►│
      │                  │  for access token    │
      │                  │  + refresh token     │
      │                  │◄────────────────────│
      │                  │                     │
  5.  │  Set httpOnly    │                     │
      │  cookie with     │                     │
      │◄─────────────────│                     │
      │  tokens          │                     │
      │                  │                     │
  6.  │  Use access token to call Google APIs   │
      │  (or just use the user profile info)   │
```

**Key terms:**
```
Authorization Code  → Short-lived code Google gives you (step 2)
                      Exchanged for tokens on YOUR server (step 4)
                      Never exposed to the browser long-term

Access Token        → Short-lived (15 min–1 hr). Used to call APIs.
Refresh Token       → Long-lived (days/weeks). Used to get new access tokens
                      without re-login. Store server-side only.

PKCE (Proof Key for Code Exchange)
  → Extra security for SPAs. Client generates a code_verifier,
    sends code_challenge with auth request, proves it during exchange.
    Prevents authorization code interception attacks.

Scope               → What permissions you're asking for
                      e.g., "openid email profile" for basic sign-in

State               → Random string to prevent CSRF on the OAuth flow
                      You generate it, send it, verify it comes back unchanged
```

**Say this in interview:**
> "OAuth 2.0 Authorization Code flow: the user clicks 'Sign in with Google', we redirect them to Google's login page with our client ID and requested scopes. After they authenticate, Google redirects back to our callback URL with an authorization code. Our backend exchanges that code for an access token and refresh token — this exchange happens server-to-server, so the tokens are never exposed to the browser. We set the access token in an httpOnly cookie. For SPAs, I'd add PKCE to prevent code interception attacks."

**Access Token vs Refresh Token:**

| | Access Token | Refresh Token |
|---|---|---|
| Lifetime | 15 min – 1 hour | Days – weeks |
| Used for | Calling APIs | Getting new access tokens |
| Stored where | httpOnly cookie | Server-side only (or httpOnly cookie to /refresh) |
| If stolen | Limited damage (expires fast) | Can generate unlimited access tokens |

---

## 11. Authentication vs Authorization

**Authentication** = "WHO are you?" → Login, verify identity
**Authorization** = "WHAT can you do?" → Permissions, roles, access control

```
Example:
  Authentication: User logs in with email/password → server verifies → issues JWT
  Authorization:  JWT contains role: "editor" → server checks if editors can DELETE posts → yes/no
```

**Say this in interview:**
> "Authentication verifies identity — who you are. Authorization determines permissions — what you can do. I handle authentication at the login layer with JWT or OAuth, and authorization with role-based access control — checking the user's role against the required permission for each endpoint."

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "Where do you store the JWT?" | "httpOnly cookie with Secure and SameSite=Strict. HttpOnly prevents XSS from reading it, SameSite prevents CSRF, Secure ensures HTTPS only." |
| "How do you prevent XSS in React?" | "React's JSX auto-escapes by default. I avoid dangerouslySetInnerHTML, validate href attributes, set CSP headers, and store tokens in httpOnly cookies as defense-in-depth." |
| "How does OAuth 2.0 work?" | "User clicks Sign In → redirect to Google → user authenticates → Google redirects back with auth code → our server exchanges code for tokens server-to-server → access token in httpOnly cookie." |
| "Authentication vs Authorization?" | "Authentication = who are you (login). Authorization = what can you do (permissions/roles)." |
| "What is CORS?" | "Browser blocks cross-origin requests by default. The server must respond with Access-Control-Allow-Origin headers to allow specific origins. Preflight OPTIONS requests check permission before the real request." |
| "localStorage vs cookies for tokens?" | "localStorage is accessible to JavaScript — any XSS steals it. httpOnly cookies are invisible to JS. I always use httpOnly cookies for auth tokens." |
| "What is CSRF and how do you prevent it?" | "Attacker tricks the browser into sending a request with the user's cookies. SameSite=Strict on cookies blocks cross-origin cookie sending. For forms, CSRF tokens add a second layer." |
