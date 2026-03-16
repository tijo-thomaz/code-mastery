# 🔑 Auth Deep Dive — JWT Vulnerabilities, OIDC, SAML — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. JWT — How It Works (Quick Recap)

**One-line:** JWT (JSON Web Token) is a self-contained token with 3 parts — header, payload, and signature — that lets the server verify identity without hitting a database.

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzA5MjM0NTY3fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 \_____header______/  \______________payload________________/  \_________signature_________/

Header:   { "alg": "HS256", "typ": "JWT" }
Payload:  { "user_id": 42, "role": "admin", "exp": 1709234567 }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

**How verification works:**
```
1. Server receives JWT
2. Decodes header + payload (base64 — NOT encrypted, just encoded)
3. Recomputes signature using its SECRET_KEY
4. If computed signature === token's signature → token is valid and untampered
5. Checks exp claim → is the token expired?
6. Trusts the payload (user_id, role) without a DB lookup
```

**Key point: JWT is SIGNED, not ENCRYPTED. Anyone can read the payload. The signature only proves it wasn't tampered with.**

---

## 2. JWT Vulnerabilities — Why JWT Is NOT Bulletproof

### Vulnerability 1: Token Theft (THE Big One)

```
Problem:
  JWT is a bearer token — whoever HAS it IS authenticated.
  If an attacker steals the JWT, they ARE the user until it expires.
  No way to check "is this the real user?" — the token IS the proof.

How tokens get stolen:
  → XSS attack reads localStorage/sessionStorage
  → Man-in-the-middle on HTTP (not HTTPS)
  → Token logged in server logs or error tracking
  → Token in URL query params (appears in browser history, referrer headers)
  → Compromised third-party JavaScript (npm supply chain attack)

Why this is worse than session-based auth:
  Session: Server can invalidate the session immediately (delete from DB)
  JWT: Server CAN'T invalidate it — it's self-contained. Valid until expiry.
```

**Say this in interview:**
> "JWT's biggest vulnerability is that it's a bearer token — if stolen, there's no server-side way to revoke it before expiry. With session-based auth, you can delete the session from the database. With JWT, you'd need a token blocklist, which defeats the stateless advantage. That's why short expiry times and httpOnly cookies are essential."

### Vulnerability 2: No Built-In Revocation

```
Problem:
  User changes password → old JWT still works until it expires
  User is banned → old JWT still works until it expires
  Token is stolen → can't invalidate it

"Solutions" (all have trade-offs):
  1. Short expiry (15 min) + refresh tokens
     → Limits damage window. But adds complexity.

  2. Token blocklist (store revoked tokens in Redis)
     → Works, but now you're hitting a DB on every request
     → Defeats the stateless benefit of JWT

  3. Token versioning (store a "token_version" per user in DB)
     → Increment version on logout/password change
     → Check version on every request → DB hit again
```

### Vulnerability 3: Algorithm Confusion Attack

```
Problem:
  JWT header says which algorithm to use: { "alg": "HS256" }
  Attack: Change header to { "alg": "none" } → server skips verification
  Attack: Change from RS256 (asymmetric) to HS256 (symmetric)
         → Use the PUBLIC key as the HMAC secret → forges valid tokens

Fix:
  → NEVER trust the alg from the token header
  → Hardcode the expected algorithm on the server
  → Use a well-maintained JWT library (jose, jsonwebtoken)
```

### Vulnerability 4: Payload is NOT Encrypted

```
Problem:
  JWT payload is just base64-encoded — anyone can decode it:
  
  echo "eyJ1c2VyX2lkIjo0Miwicm9sZSI6ImFkbWluIn0=" | base64 -d
  → { "user_id": 42, "role": "admin" }

  NEVER put sensitive data in JWT:
  ❌ passwords, credit card numbers, PII, secrets
  ✅ user_id, role, expiry — enough to authorize, nothing to steal
```

### Vulnerability 5: Long-Lived Tokens

```
Problem:
  JWT with 30-day expiry = 30-day window for an attacker if stolen

Fix:
  Access token:  15 min expiry (short-lived, used for API calls)
  Refresh token: 7-30 days (long-lived, stored securely, only used to get new access tokens)
  
  Refresh flow:
    1. Access token expires
    2. Client sends refresh token to /auth/refresh
    3. Server validates refresh token → issues new access token
    4. If refresh token is stolen → can be revoked in DB (it's NOT stateless)
```

**Say this in interview:**
> "JWT is powerful but has real vulnerabilities. The payload isn't encrypted — just base64-encoded — so never store sensitive data in it. There's no built-in revocation — a stolen token works until expiry. Algorithm confusion attacks can bypass signature verification if the server trusts the token's alg header. My mitigation strategy is: short-lived access tokens in httpOnly cookies, refresh tokens with server-side revocation, hardcoded algorithms, and defense-in-depth with CSP and input sanitization to prevent XSS."

---

## 3. JWT vs Session-Based Auth

```
                     JWT (Stateless)              Session (Stateful)
────────────         ──────────────               ──────────────────
Storage              Token in cookie/header        Session ID in cookie,
                                                   data in server DB/Redis

Server state         None (self-contained)         Must store session data

Scalability          ✅ Easy — any server can       ❌ Need shared session
                     verify (no DB lookup)          store across servers

Revocation           ❌ Hard — valid until expiry    ✅ Easy — delete from DB

Token size           Large (payload in every req)   Small (just session ID)

Cross-domain         ✅ Easy (send in header)        ❌ Cookies are same-origin

Mobile/API           ✅ Natural fit                  ❌ Cookie-based, awkward

When to use          SPAs, mobile apps,             Traditional server-rendered
                     microservices, cross-domain     apps, when revocation matters
```

**Say this in interview:**
> "JWT is great for stateless auth in distributed systems — any server can verify the token without a shared database. The trade-off is revocation: you can't easily invalidate a JWT before expiry. Session-based auth stores state on the server, making revocation trivial but scaling harder. For SPAs and APIs, I prefer short-lived JWTs with refresh tokens — you get the scalability of stateless auth with the revocation capability of refresh tokens."

---

## 4. OIDC (OpenID Connect)

**One-line:** OIDC is an identity layer ON TOP of OAuth 2.0 — OAuth handles authorization ("what can you access?"), OIDC adds authentication ("who ARE you?").

**The problem OIDC solves:**
```
OAuth 2.0 alone:
  → Gives you an access token to call APIs
  → But doesn't tell you WHO the user is
  → Access token is opaque — no standard user info in it
  → You have to call a separate /userinfo endpoint to get the user's identity

OIDC adds:
  → An ID Token (a JWT!) with user identity claims
  → Standardized user info (name, email, picture)
  → A standard /userinfo endpoint
  → Discovery document (/.well-known/openid-configuration)
```

**How OIDC works (built on OAuth 2.0 Authorization Code flow):**
```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐
│  Browser  │     │  Your Server  │     │ Identity Provider │
│  (React)  │     │  (Backend)    │     │ (Google, Okta,    │
│           │     │               │     │  Auth0, Keycloak) │
└─────┬─────┘     └──────┬───────┘     └──────┬───────────┘
      │                  │                     │
  1.  │ Click "Sign in with Google"            │
      │──────────────────────────────────────►│
      │  Redirect with scope=openid email      │  ← "openid" scope = OIDC
      │                  │                     │
  2.  │◄─────────────────────────────────────│
      │  User authenticates at Google          │
      │  Redirect back with auth code          │
      │                  │                     │
  3.  │─────────────────►│                     │
      │                  │  Exchange code for:  │
  4.  │                  │────────────────────►│
      │                  │  ← Access Token      │ (for API calls)
      │                  │  ← ID Token (JWT!)   │ (WHO the user is)
      │                  │  ← Refresh Token     │ (get new tokens)
      │                  │◄────────────────────│
      │                  │                     │
  5.  │                  │  Decode ID Token:    │
      │                  │  {                   │
      │                  │    "sub": "1234",    │  ← Unique user ID
      │                  │    "email": "a@b.c", │
      │                  │    "name": "Alice",  │
      │                  │    "picture": "...", │
      │                  │    "iss": "google",  │  ← Who issued it
      │                  │    "aud": "your-app",│  ← Intended audience
      │                  │    "exp": 170923456  │
      │                  │  }                   │
      │                  │                     │
  6.  │  Set session /   │                     │
      │  httpOnly cookie │                     │
      │◄─────────────────│                     │
```

**Key OIDC concepts:**
```
ID Token        → JWT containing user identity. NEVER send to APIs.
                  Only consumed by YOUR app to know who logged in.

Access Token    → Sent to APIs to authorize requests.
                  May or may not be a JWT (depends on provider).

Scopes          → openid (required for OIDC), email, profile, phone

Claims          → Fields in the ID token: sub, email, name, picture, etc.

Discovery       → GET /.well-known/openid-configuration
                  Returns all endpoints, supported scopes, signing keys
```

**OIDC vs OAuth 2.0:**
```
OAuth 2.0:  "Let this app access my Google Drive files"  → AUTHORIZATION
OIDC:       "Let this app know who I am"                  → AUTHENTICATION

OAuth alone gives you a key to a door.
OIDC tells you WHO is holding the key.

OIDC = OAuth 2.0 + ID Token + UserInfo endpoint + standard claims
```

**Say this in interview:**
> "OIDC is an authentication layer built on top of OAuth 2.0. OAuth alone handles authorization — 'can this app access my resources?' — but doesn't standardize identity. OIDC adds an ID Token — a JWT with user identity claims like email and name — so your app knows WHO logged in, not just that they're authorized. When I implement 'Sign in with Google', I'm using OIDC — the scope includes 'openid', and I get back an ID token with the user's identity alongside the access token."

---

## 5. SAML (Security Assertion Markup Language)

**One-line:** SAML is an older XML-based Single Sign-On (SSO) standard used mainly in enterprise environments — one login gives you access to multiple corporate apps (Salesforce, Jira, internal tools).

**How SAML works (SP-initiated flow):**
```
┌──────────┐     ┌──────────────────┐     ┌────────────────┐
│  Browser  │     │ Service Provider  │     │ Identity       │
│  (User)   │     │ (Your App /       │     │ Provider (IdP) │
│           │     │  Salesforce, etc.) │     │ (Okta, ADFS,   │
│           │     │                    │     │  OneLogin)     │
└─────┬─────┘     └──────┬────────────┘     └──────┬─────────┘
      │                  │                         │
  1.  │ Go to app.com    │                         │
      │─────────────────►│                         │
      │                  │ Not authenticated        │
  2.  │◄─────────────────│                         │
      │  Redirect to IdP with SAML AuthnRequest    │
      │────────────────────────────────────────────►│
      │                  │                         │
  3.  │  User logs in at IdP (company SSO page)    │
      │  IdP validates credentials                  │
      │                  │                         │
  4.  │◄────────────────────────────────────────────│
      │  Redirect back to SP with SAML Response     │
      │  (XML document with signed Assertion)       │
      │─────────────────►│                         │
      │                  │                         │
  5.  │                  │ Validate SAML signature  │
      │                  │ Extract user attributes  │
      │  Session created │ (email, name, roles)     │
      │◄─────────────────│                         │
      │  Logged in! ✅    │                         │
```

**SAML Assertion (XML):**
```xml
<saml:Assertion>
  <saml:Subject>
    <saml:NameID>alice@company.com</saml:NameID>
  </saml:Subject>
  <saml:Conditions NotBefore="..." NotOnOrAfter="..." />
  <saml:AttributeStatement>
    <saml:Attribute Name="email">alice@company.com</saml:Attribute>
    <saml:Attribute Name="role">admin</saml:Attribute>
  </saml:AttributeStatement>
  <ds:Signature>...</ds:Signature>  <!-- Digitally signed by IdP -->
</saml:Assertion>
```

---

## 6. OIDC vs SAML vs OAuth 2.0 — The Comparison

```
                OAuth 2.0           OIDC                  SAML
────────        ─────────           ────                  ────
Purpose         Authorization       Authentication         Authentication (SSO)
                "What can you       "Who are you?"         "Who are you?"
                access?"

Format          JSON                JSON + JWT             XML

Token           Access Token        Access Token           SAML Assertion
                (opaque)            + ID Token (JWT)       (XML, signed)

Transport       HTTP redirects      HTTP redirects         HTTP redirects
                + API calls         + API calls            (browser POST with XML)

Use case        API access,         Consumer login         Enterprise SSO
                third-party apps    ("Sign in with         (Okta → Salesforce,
                                    Google/GitHub")        ADFS → Internal tools)

Mobile/SPA      ✅ Great            ✅ Great               ❌ Bad (XML is heavy,
                                                           not designed for SPAs)

Complexity      Medium              Medium                 High (XML parsing,
                                                           certificate management)

Modern?         ✅ Yes              ✅ Yes                 ⚠️ Legacy but still
                                                           dominant in enterprise
```

**When to use which:**
```
Building a consumer app with social login?
  → OIDC (Sign in with Google/GitHub/Facebook)

Building an enterprise app with corporate SSO?
  → SAML if their IdP only supports SAML (Okta, ADFS, OneLogin)
  → OIDC if their IdP supports it (most modern ones do)
  → Many apps support BOTH

Building an API that third parties consume?
  → OAuth 2.0 (API keys + access tokens)

Building a SPA / mobile app?
  → OIDC + PKCE (SAML is too heavy for SPAs)
```

**Say this in interview:**
> "OAuth 2.0 handles authorization — granting access to resources. OIDC adds authentication on top of OAuth — it gives you a standardized ID token so you know WHO the user is. SAML does authentication too but uses XML and is designed for enterprise SSO — one login to access Salesforce, Jira, internal tools. For modern SPAs and consumer apps, I'd use OIDC. For enterprise SSO where the customer's IdP requires SAML, I'd support SAML as well. Many identity platforms like Auth0 and Okta let you support both without implementing either from scratch."

---

## 7. Practical Architecture: Auth in a React App

```
┌─────────────────────────────────────────────────────────┐
│  React SPA                                              │
│                                                         │
│  Login Page → Redirect to IdP (Google/Okta)             │
│  Callback Page → Receive auth code → send to backend    │
│  Auth Context → { user, isAuthenticated, logout }       │
│  Protected Routes → check auth, redirect to login       │
│  API calls → httpOnly cookie sent automatically         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ AuthProvider (Context)                          │    │
│  │  ├── user: { id, name, email, role }            │    │
│  │  ├── isAuthenticated: boolean                   │    │
│  │  ├── login: () => redirect to IdP               │    │
│  │  ├── logout: () => clear cookie + redirect      │    │
│  │  └── isLoading: boolean (checking auth state)   │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ httpOnly cookie (auto-sent)
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Node/Next.js)                                 │
│                                                         │
│  POST /auth/callback → exchange code for tokens         │
│  GET  /auth/me       → return user from token/session   │
│  POST /auth/logout   → clear cookie + revoke refresh    │
│  POST /auth/refresh  → issue new access token           │
│                                                         │
│  Middleware: verify JWT on every API request             │
│  Role check: req.user.role === 'admin' for admin routes │
└─────────────────────────────────────────────────────────┘
```

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "Why is JWT vulnerable?" | "It's a bearer token — whoever has it IS authenticated. No built-in revocation. Payload is encoded, not encrypted. Algorithm confusion attacks can bypass verification. Mitigate with short expiry, httpOnly cookies, refresh tokens, and hardcoded algorithms." |
| "JWT vs session-based?" | "JWT is stateless — scalable, no DB lookup. Session is stateful — easy revocation, harder to scale. I use short-lived JWTs + refresh tokens for SPAs." |
| "What is OIDC?" | "An authentication layer on top of OAuth 2.0. OAuth = authorization (access resources). OIDC adds an ID Token (JWT) with user identity — who logged in, not just what they can access." |
| "What is SAML?" | "XML-based enterprise SSO standard. User logs in once at the IdP (Okta, ADFS), gets access to multiple apps. Older than OIDC, still dominant in enterprise." |
| "OIDC vs SAML?" | "Both do authentication. OIDC is JSON/JWT-based, modern, great for SPAs and mobile. SAML is XML-based, heavier, designed for enterprise SSO. For new apps, I'd use OIDC. I'd add SAML support if enterprise customers require it." |
| "What is micro-frontend?" | "Independent frontend apps composed into one product. Each team owns and deploys a slice independently. Use Module Federation for runtime integration." |
| "When would you use MFE?" | "3+ teams needing independent deploys, or legacy migration. NOT for small teams — monorepo (Nx/Turborepo) gives the same organization without runtime complexity." |
| "How do you handle auth across MFEs?" | "Shell owns auth. Passes user context down to MFEs via props or custom events. Each MFE doesn't implement its own auth — it trusts the shell." |
