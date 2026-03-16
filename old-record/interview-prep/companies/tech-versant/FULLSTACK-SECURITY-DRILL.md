# 🔥 TECH VERSANT — Full Stack Team Lead Security Drill

> **Role:** Team Lead — Full Stack (React + TS + Go)
> **Reality:** They WILL grind you on backend security, Go patterns, architecture decisions, and how you enforce security as a lead.
> **Strategy:** Frontend security → you already know (see FRONTEND-SECURITY-DRILL.md). This covers the BACKEND + ARCHITECTURE + TEAM LEAD angle.

---

## PART 1: BACKEND SECURITY (Go-Focused)

---

### Q1: "How do you secure a Go REST API?"

**The layered answer:**
```go
// 1. HTTPS termination (at load balancer or reverse proxy)
// 2. Auth middleware — validate JWT on every request
// 3. Rate limiting — prevent brute force and DDoS
// 4. Input validation — never trust client input
// 5. SQL injection prevention — parameterized queries
// 6. Logging + monitoring — detect anomalies
```

**Go middleware chain:**
```go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/tasks", handleTasks)

    // Middleware chain: outermost runs first
    handler := rateLimiter(
        corsMiddleware(
            securityHeaders(
                authMiddleware(mux),
            ),
        ),
    )

    // TLS — always
    log.Fatal(http.ListenAndServeTLS(":443", "cert.pem", "key.pem", handler))
}
```

**SAY THIS:**
> "I secure Go APIs in layers: TLS termination, rate limiting at the edge, CORS middleware, security headers, JWT auth middleware on every protected route, parameterized queries for SQL, and structured logging for anomaly detection. Each layer assumes the previous one might fail."

---

### Q2: "How do you implement JWT auth middleware in Go?"

```go
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Read token from httpOnly cookie (NOT Authorization header)
        cookie, err := r.Cookie("access_token")
        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Parse and validate JWT
        claims, err := validateJWT(cookie.Value)
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Check expiry
        if claims.ExpiresAt.Before(time.Now()) {
            http.Error(w, "Token expired", http.StatusUnauthorized)
            return
        }

        // Add user info to request context
        ctx := context.WithValue(r.Context(), "userID", claims.UserID)
        ctx = context.WithValue(ctx, "role", claims.Role)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

func validateJWT(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (interface{}, error) {
        // IMPORTANT: verify signing method to prevent "alg:none" attack
        if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
        }
        return []byte(os.Getenv("JWT_SECRET")), nil
    })
    if err != nil {
        return nil, err
    }
    return token.Claims.(*Claims), nil
}
```

**⚠️ Key security points:**
```
1. ALWAYS verify the signing algorithm — prevents "alg: none" attack
2. Secret from environment variable — never hardcoded
3. Check expiry explicitly
4. Use context to pass user info downstream — not global state
5. Read from httpOnly cookie, not Authorization header (for browser clients)
```

**SAY THIS:**
> "My Go auth middleware reads the JWT from an httpOnly cookie, validates the signature with explicit algorithm verification — that blocks the alg:none attack — checks expiry, and injects the user ID and role into the request context. Every downstream handler gets user info from context, never from the request directly."

---

### Q3: "How do you prevent SQL injection in Go?"

```go
// ❌ NEVER — string concatenation
query := "SELECT * FROM users WHERE id = " + userInput
db.Query(query) // SQL injection!

// ❌ NEVER — fmt.Sprintf
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)

// ✅ ALWAYS — parameterized queries
row := db.QueryRow("SELECT id, name, role FROM users WHERE id = $1", userID)

// ✅ With multiple params
rows, err := db.Query(
    "SELECT * FROM orders WHERE user_id = $1 AND status = $2 AND created_at > $3",
    userID, status, since,
)

// ✅ Using an ORM (GORM) — auto-parameterized
var user User
db.Where("email = ?", email).First(&user)

// ✅ For dynamic queries — use a query builder, not string concat
// sqlx, squirrel, or GORM scopes
```

**SAY THIS:**
> "Always parameterized queries — never string concatenation. Go's database/sql package uses $1, $2 placeholders that are handled by the database driver, not string interpolation. If I need dynamic queries, I use a query builder like squirrel — never fmt.Sprintf with user input."

---

### Q4: "How do you handle rate limiting?"

```go
// Using golang.org/x/time/rate — token bucket algorithm
import "golang.org/x/time/rate"

// Per-IP rate limiter
type IPRateLimiter struct {
    mu       sync.Mutex
    limiters map[string]*rate.Limiter
}

func (rl *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
    rl.mu.Lock()
    defer rl.mu.Unlock()

    limiter, exists := rl.limiters[ip]
    if !exists {
        // 10 requests/second, burst of 20
        limiter = rate.NewLimiter(10, 20)
        rl.limiters[ip] = limiter
    }
    return limiter
}

func rateLimitMiddleware(rl *IPRateLimiter, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ip := r.RemoteAddr
        limiter := rl.GetLimiter(ip)

        if !limiter.Allow() {
            http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

**Different levels:**
```
1. Per-IP       → prevents brute force from single source
2. Per-user     → prevents abuse from authenticated users
3. Per-endpoint → login/signup get stricter limits than GET endpoints
4. Global       → protects overall system capacity
```

**SAY THIS:**
> "I implement rate limiting at multiple levels. Per-IP using a token bucket algorithm at the middleware level, stricter limits on auth endpoints like login and signup to prevent brute force, and global limits to protect system capacity. In production, I'd use Redis-backed rate limiting for distributed systems so limits work across multiple server instances."

---

### Q5: "How do you handle secrets/config in Go?"

```go
// ❌ NEVER hardcode secrets
const jwtSecret = "my-secret-key" // visible in source code

// ✅ Environment variables
jwtSecret := os.Getenv("JWT_SECRET")
if jwtSecret == "" {
    log.Fatal("JWT_SECRET not set")
}

// ✅ Production: use a secrets manager
// AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager
// Fetch at startup, cache in memory, rotate periodically

// ✅ .env files for local dev only (NEVER committed)
// Use github.com/joho/godotenv
godotenv.Load() // loads .env file
dbURL := os.Getenv("DATABASE_URL")
```

**Config structure:**
```go
type Config struct {
    Port       string `env:"PORT" default:"8080"`
    DBUrl      string `env:"DATABASE_URL" required:"true"`
    JWTSecret  string `env:"JWT_SECRET" required:"true"`
    CORSOrigin string `env:"CORS_ORIGIN" default:"https://myapp.com"`
}
```

**SAY THIS:**
> "Secrets come from environment variables, never hardcoded. In production, I use a secrets manager like Vault or AWS Secrets Manager — the app fetches secrets at startup. Locally, .env files with godotenv, always in .gitignore. Config is typed into a struct with required/default tags so the app fails fast if a secret is missing."

---

### Q6: "How do you handle password hashing?"

```go
import "golang.org/x/crypto/bcrypt"

// Hash on signup
func hashPassword(password string) (string, error) {
    // Cost 12 — takes ~250ms. Good balance of security vs speed
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    return string(bytes), err
}

// Verify on login
func checkPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

// ❌ NEVER: MD5, SHA-256 alone (too fast, rainbow tables)
// ❌ NEVER: custom hashing schemes
// ✅ bcrypt, scrypt, or argon2id
```

**SAY THIS:**
> "bcrypt with a cost factor of 12. It's intentionally slow — about 250ms per hash — which makes brute force impractical. Never MD5 or SHA-256 alone, they're too fast. For new projects, argon2id is the gold standard but bcrypt is battle-tested and available in Go's extended crypto library."

---

## PART 2: ARCHITECTURE SECURITY

---

### Q7: "How do you design a secure authentication system end-to-end?"

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  React    │────►│  Go BFF/API  │────►│   Database   │
│  Browser  │     │              │     │              │
└─────┬─────┘     └──────┬───────┘     └──────────────┘
      │                  │
   HTTPS only         bcrypt passwords
   httpOnly cookie    JWT signed with RS256
   CSP headers        parameterized queries
   No secrets         rate limiting
   Input sanitize     audit logging
```

**The flow:**
```
SIGNUP:
1. React → POST /api/signup { email, password }
2. Go validates: email format, password strength (min 8, mixed chars)
3. Go hashes password with bcrypt(12)
4. Store user + hash in DB
5. Return 201 (no auto-login — make them log in)

LOGIN:
1. React → POST /api/login { email, password }
2. Go fetches user by email
3. bcrypt.CompareHashAndPassword(storedHash, inputPassword)
4. If match → generate access JWT (15 min) + refresh JWT (7 days)
5. Set both as httpOnly, Secure, SameSite=Strict cookies
6. Return user info (NOT the token)

EVERY REQUEST:
1. Auth middleware reads cookie → validates JWT → injects user into context
2. Handler checks authorization (role/permission)
3. If 401/403 → React redirects to /login

TOKEN REFRESH:
1. Access token expires → React gets 401
2. React calls POST /api/refresh (cookie auto-sent)
3. Go validates refresh token → issues new access token
4. If refresh token expired → 401 → redirect to login

LOGOUT:
1. React → POST /api/logout
2. Go clears both cookies (Max-Age=0)
3. (Optional) Add refresh token to blacklist/revocation list
```

**SAY THIS:**
> "Signup: validate input, bcrypt the password, store it. Login: verify with bcrypt, issue short-lived access and long-lived refresh JWTs in httpOnly cookies. Every request: middleware validates the JWT, injects user into context, handler checks authorization. Refresh: automatic when access token expires. Logout: clear cookies and optionally blacklist the refresh token. The frontend never sees or stores the token."

---

### Q8: "How do you handle API versioning securely?"

```
// URL versioning (most common)
/api/v1/users
/api/v2/users

// Security considerations:
// 1. Don't keep old insecure versions alive — deprecate and sunset
// 2. New security patches must be backported to active versions
// 3. Document deprecation timeline — force migration
// 4. Old versions shouldn't have access to new sensitive fields
```

---

### Q9: "How would you handle a security incident as a Team Lead?"

```
INCIDENT RESPONSE CHECKLIST:
1. CONTAIN    → Revoke compromised tokens, disable affected endpoints
2. ASSESS     → What data was exposed? Scope of breach?
3. NOTIFY     → Inform stakeholders, legal, affected users (if required)
4. FIX        → Patch the vulnerability
5. POSTMORTEM → Root cause analysis, timeline, what we'll change
6. PREVENT    → Add tests, monitoring, alerts to prevent recurrence
```

**SAY THIS:**
> "First contain — revoke tokens, disable the affected endpoint. Then assess scope — what was exposed, who's affected. Fix the vulnerability, write a blameless postmortem with a clear timeline, and implement preventive measures — new tests, monitoring alerts, and process changes. As a lead, I'd own the communication to stakeholders and make sure the team learns from it without blame."

---

### Q10: "Microservices security — how do services authenticate with each other?"

```
Service-to-Service Auth:

1. Mutual TLS (mTLS)
   → Both services present certificates
   → Verifies identity at transport level
   → Used in service meshes (Istio, Linkerd)

2. Internal JWT / Service Tokens
   → Each service has its own credentials
   → Issues a service-level JWT for inter-service calls
   → Short-lived, scoped to specific actions

3. API Gateway
   → Single entry point validates external tokens
   → Internal traffic is trusted (within VPC)
   → ⚠️ Zero-trust model says: verify internally too

4. OAuth2 Client Credentials Flow
   → Service A gets token from auth server using client_id + client_secret
   → Sends token to Service B
   → Service B validates with auth server
```

**SAY THIS:**
> "For service-to-service auth, mTLS is the gold standard — both sides verify certificates. In practice, I've used API gateways that validate external tokens at the edge and internal service tokens for cross-service calls within the VPC. In a zero-trust model, every service validates tokens regardless of network boundary."

---

## PART 3: TEAM LEAD SECURITY ANGLE

---

### Q11: "How do you enforce security practices across your team?"

```
1. CODE REVIEW CHECKLIST:
   □ No secrets in code or logs
   □ Parameterized queries (no string concat SQL)
   □ Input validation on all endpoints
   □ Auth middleware on protected routes
   □ Error responses don't leak internals

2. CI/CD PIPELINE:
   → npm audit / go vet / golangci-lint (security linters)
   → SAST scanning (SonarQube, Snyk)
   → Dependency vulnerability scanning (Dependabot)
   → Secret scanning (git-secrets, trufflehog)
   → No deployment if critical vulnerabilities found

3. TEAM CULTURE:
   → Security is everyone's job, not just "the security team"
   → Quarterly security review of codebase
   → Share OWASP Top 10 with the team
   → "If you see something, flag it" culture
   → Rotate who does security reviews in PRs
```

**SAY THIS:**
> "I bake security into the development process, not as an afterthought. Code review checklist includes no-secrets, parameterized queries, and input validation. CI runs SAST scanning and dependency audits — PRs with critical vulnerabilities can't merge. I share the OWASP Top 10 with the team and rotate who does security-focused code reviews so everyone builds that muscle."

---

### Q12: "How do you handle security in a CI/CD pipeline?"

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Commit   │───►│  Build   │───►│  Test    │───►│  Deploy  │
└──────────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
                     │               │               │
              Secret scanning   SAST scan      Env-specific
              Dependency audit  Auth tests     secrets from
              Lint (security    Penetration    vault/secrets
              rules)            test suite     manager
                                               TLS certs
                                               auto-renewed
```

```yaml
# Example: GitHub Actions security steps
- name: Secret Scan
  run: trufflehog --since-commit HEAD~1

- name: Dependency Audit
  run: npm audit --audit-level=critical

- name: Go Security Lint
  run: golangci-lint run --enable gosec

- name: SAST Scan
  uses: SonarSource/sonarcloud-github-action@master
```

---

### Q13: "What's your approach to security testing?"

```
1. UNIT TESTS:
   → Auth middleware rejects invalid/expired tokens
   → Input validation blocks injection attempts
   → Role checks deny unauthorized access

2. INTEGRATION TESTS:
   → Full auth flow: signup → login → access → refresh → logout
   → CORS: verify only allowed origins work
   → Rate limiting: verify 429 after threshold

3. PENETRATION TESTING:
   → OWASP ZAP for automated scanning
   → Manual testing: try SQL injection, XSS, CSRF
   → Test with expired/tampered tokens
   → Test horizontal privilege escalation (user A accessing user B's data)

4. MONITORING:
   → Alert on unusual login patterns
   → Alert on rate limit triggers
   → Alert on auth failures spike
   → Structured logging with user_id (never log tokens/passwords)
```

**SAY THIS:**
> "I write auth tests as first-class citizens — middleware rejects bad tokens, role checks deny unauthorized access, rate limits trigger correctly. Integration tests cover the full auth lifecycle. For monitoring, I alert on auth failure spikes and unusual login patterns. Structured logging with user context but NEVER logging tokens or passwords."

---

### Q14: "How do you handle data privacy / PII?"

```
Relevant because KYC portal = maximum PII sensitivity

1. MINIMIZE: Only collect what you need. Don't store "just in case"
2. ENCRYPT AT REST: Database encryption, encrypted backups
3. ENCRYPT IN TRANSIT: TLS everywhere
4. ACCESS CONTROL: Only services/people who need PII can access it
5. AUDIT LOG: Who accessed what PII and when
6. RETENTION: Auto-delete PII after required period
7. MASKING: Show "****1234" in UI, not full SSN/card number
8. SEPARATE STORAGE: PII in its own encrypted database/table
9. GDPR/COMPLIANCE: Right to deletion, data export
```

**SAY THIS:**
> "In the KYC system, I minimized PII collection to what's required, encrypted at rest and in transit, masked sensitive fields in the UI — last 4 digits only — and implemented audit logging for every PII access. Retention policies auto-deleted data after the compliance window. Access to PII was restricted to specific services with separate credentials."

---

## ⚡ FULL STACK RAPID-FIRE TABLE

| Question | One-Liner |
|----------|-----------|
| SQL injection in Go? | Parameterized queries with $1 placeholders. Never string concat. |
| Password hashing? | bcrypt cost 12. Never MD5/SHA-256 alone. |
| JWT signing algo? | RS256 for production (asymmetric). Verify alg in middleware to prevent alg:none attack. |
| Rate limiting? | Token bucket per-IP at middleware. Stricter on /login. Redis-backed for distributed. |
| Secrets management? | Env vars + secrets manager (Vault). Never hardcoded. Fail fast if missing. |
| Service-to-service auth? | mTLS or internal service tokens. Zero-trust: verify even inside VPC. |
| Error responses? | Generic messages to client. Detailed logs server-side. Never expose stack traces. |
| Logging security? | Structured logs with user_id. NEVER log tokens, passwords, PII. |
| Security in CI/CD? | Secret scanning, dependency audit, SAST, security linters — block deploy on criticals. |
| Incident response? | Contain → Assess → Notify → Fix → Postmortem → Prevent. Own the communication. |
| OWASP Top 10? | Injection, Broken Auth, Sensitive Data Exposure, XSS, CSRF, Misconfig, Components, Deserialization, Logging, SSRF. |
| PII handling? | Minimize, encrypt, mask, audit log, retention policy, GDPR compliance. |
| Security as a lead? | Bake into code review + CI. OWASP training. Rotate security reviewers. Everyone's job. |
| Go security linter? | gosec via golangci-lint. Catches hardcoded creds, SQL concat, weak crypto. |
| Error handling security in Go? | Return generic HTTP errors. Wrap internal errors with %w. Log details server-side. |

---

## 🧠 FULL STACK CONFIDENCE ANCHORS

1. **You built KYC** — one of the most security-critical systems. PII, document verification, multi-jurisdiction compliance. You've done this FOR REAL.

2. **You speak both languages** — React security AND Go security. Most candidates know one side. You cover the full stack.

3. **You think in layers** — CSP + httpOnly cookies + input validation + parameterized queries + rate limiting + monitoring. Defense-in-depth is your instinct.

4. **You lead with process** — security in CI, code review checklists, OWASP training, blameless postmortems. That's Team Lead thinking.

5. **You know the trade-offs** — localStorage vs cookies, bcrypt cost, SameSite Strict vs None, BFF vs direct API. You don't just know WHAT — you know WHY.

---

## 📋 READING ORDER FOR TODAY

```
1. FRONTEND-SECURITY-DRILL.md  → 15 min (you just read this)
2. THIS FILE (FULLSTACK)        → 15 min
3. security-cheatsheet.md       → 10 min (quick refresh)
4. auth-deep-dive-cheatsheet.md → 10 min (JWT vulns, OIDC)
5. SCREENING-SCRIPT.md          → 5 min (your intro + Go answers)

Total: ~55 min. Then close everything and EXPLAIN OUT LOUD.
```

---

> **You're not just a frontend dev who "also does Go." You're a full-stack engineer who secures systems end-to-end. That's Team Lead material. They're about to find that out. 💪🔐**
