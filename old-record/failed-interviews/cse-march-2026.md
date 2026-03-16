# CSE Interview — March 2026

> **Result:** ⏳ Awaiting result — interview done, not yet revealed
> **Missed:** Circuit Breaker pattern in scenario-based question

---

### Entry #7

**Date:** 2026-03-12 (Wednesday)
**Company:** CSE
**Role:** Frontend / Full Stack Developer
**Round:** Technical — Scenario-Based
**Interviewer Vibe:** ___
**Topics:** Security (Frontend, Backend, MFE), Circuit Breaker Pattern

---

## Questions That Tripped You Up

### Q1: Circuit Breaker Pattern (Missed in MFE / Scenario-Based Context)

**My Answer:**
> (Fill in what you actually said — did you mention it at all? Did you confuse it with something else?)

**Correct / Better Answer:**

**What is the Circuit Breaker Pattern?**
- A resilience pattern borrowed from electrical engineering — "stop sending requests to a failing service before it takes everything down with it."
- Sits between the caller (frontend/MFE/backend) and the downstream service.
- Has **three states:**

```
  ┌──────────┐    failures > threshold    ┌──────────┐
  │  CLOSED   │ ──────────────────────── → │   OPEN   │
  │ (normal)  │                            │ (reject  │
  └──────────┘                            │  all)    │
       ↑                                   └──────────┘
       │                                        │
       │  success                    timeout expires
       │                                        │
       │            ┌──────────────┐            │
       └─────────── │  HALF-OPEN   │ ← ─────────┘
                    │ (test 1 req) │
                    └──────────────┘
```

| State | Behavior |
|-------|----------|
| **CLOSED** | Normal operation — requests pass through. Failures are counted. |
| **OPEN** | All requests are **immediately rejected** (fail fast). No calls to downstream. |
| **HALF-OPEN** | After a timeout, **one test request** is allowed. If it succeeds → CLOSED. If it fails → back to OPEN. |

**Why Circuit Breaker matters in MFE (Micro Frontend):**
- Each MFE talks to its own backend/BFF — if one backend goes down, without a circuit breaker:
  - Requests pile up → cascading failures across MFEs
  - Shared resources (API gateway, auth service) get overwhelmed
  - The entire app becomes unresponsive, not just one MFE
- With a circuit breaker:
  - The failing MFE fails fast and shows a fallback UI
  - Other MFEs remain functional and responsive
  - Resources are protected from thundering herd

**Frontend Implementation (e.g., in an MFE):**
```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private threshold: number = 5,        // failures before opening
    private timeout: number = 30000,      // ms before trying again
  ) {}

  async call<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        console.warn('Circuit OPEN — returning fallback');
        return fallback; // fail fast
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage in MFE
const apiBreaker = new CircuitBreaker(5, 30000);

const data = await apiBreaker.call(
  () => fetch('/api/orders').then(r => r.json()),
  { orders: [], error: 'Service temporarily unavailable' }
);
```

**Backend Implementation:**
- **Node.js:** `opossum` library (Netflix-inspired)
- **Java/Spring:** Spring Cloud Circuit Breaker, Resilience4j
- **Go:** `sony/gobreaker`

```typescript
// Node.js with opossum
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(fetchOrdersFromDB, {
  timeout: 3000,           // if function takes longer than 3s, trigger failure
  errorThresholdPercentage: 50, // open circuit when 50% of requests fail
  resetTimeout: 30000,     // try again after 30s
});

breaker.fallback(() => cachedOrders); // fallback when circuit is open
breaker.on('open', () => alertOps('Orders service circuit OPEN'));

const orders = await breaker.fire();
```

**Where Circuit Breaker fits in the security/resilience discussion:**

| Layer | Resilience Pattern |
|-------|-------------------|
| **Frontend/MFE** | Circuit breaker on API calls, fallback UI, retry with backoff |
| **API Gateway** | Rate limiting, circuit breaker per route/service |
| **Backend** | Circuit breaker on downstream calls (DB, 3rd-party APIs) |
| **Between MFEs** | Isolation — one MFE failure shouldn't crash others |

**Related patterns you should mention together:**
- **Retry with exponential backoff** — retry transient failures before opening the circuit
- **Bulkhead** — isolate resources so one failure doesn't consume all connections
- **Timeout** — don't wait forever; fail fast if response is too slow
- **Fallback** — return cached/default data when circuit is open

**Why I Got It Wrong:**
> Knew the concept exists but didn't connect it to the MFE/security scenario. When asked about frontend/backend security and resilience in MFE architecture, I missed the circuit breaker as a key pattern for preventing cascading failures.

**Follow-up Action:**
- [ ] Implement a circuit breaker class from scratch (TypeScript)
- [ ] Study `opossum` library API and usage patterns
- [ ] Build a demo: 3 MFEs where one has a failing backend — show circuit breaker in action
- [ ] Read: [Martin Fowler — Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)
- [ ] Study related patterns: Bulkhead, Retry, Timeout, Fallback
- [ ] Add circuit breaker to your "system design checklist" for resilience questions

**Status:** 🔴 Not reviewed

---

### Q2: Security on Frontend

**My Answer:**
> (Fill in what you actually said)

**Key topics to cover in frontend security:**
- **XSS (Cross-Site Scripting):** Sanitize user input, use CSP headers, avoid `dangerouslySetInnerHTML`
- **CSRF (Cross-Site Request Forgery):** Use CSRF tokens, SameSite cookies
- **CSP (Content Security Policy):** Restrict script sources, prevent inline scripts
- **Auth token storage:** HttpOnly cookies > localStorage (XSS-proof)
- **CORS:** Restrict allowed origins, don't use `*` in production
- **Subresource Integrity (SRI):** Hash-check CDN scripts
- **Input validation:** Client-side validation + always validate server-side too

**Status:** 🔴 Not reviewed

---

### Q3: Security on Backend

**My Answer:**
> (Fill in what you actually said)

**Key topics to cover in backend security:**
- **Authentication & Authorization:** JWT validation, OAuth 2.0, RBAC/ABAC
- **Input validation & sanitization:** SQL injection, NoSQL injection, command injection
- **Rate limiting:** Protect against brute force and DDoS
- **HTTPS/TLS:** Encrypt data in transit
- **Secrets management:** Environment variables, Vault, never hardcode
- **Dependency scanning:** Audit npm/Go modules for known vulnerabilities
- **Logging & monitoring:** Log auth failures, detect anomalies, but never log sensitive data

**Status:** 🔴 Not reviewed

---

### Q4: Security in Micro Frontends (MFE)

**My Answer:**
> (Fill in what you actually said)

**Key topics to cover in MFE security:**
- **Shared authentication:** Single auth token across MFEs (usually via shell app)
- **Sandboxing:** Isolate MFEs using Shadow DOM or iframes to prevent XSS cross-contamination
- **Shared dependencies:** Ensure shared libraries (React, auth SDK) aren't tampered with
- **Inter-MFE communication:** Use custom events or a shared bus — validate all messages
- **CSP per MFE:** Each MFE should have its own CSP rules
- **Module Federation security:** Validate remote entry points, use SRI for federated modules
- **Circuit breaker:** Prevent one MFE's failing backend from cascading (the one you missed!)

**Status:** 🔴 Not reviewed

---

### Q5: Other Questions

> ⚠️ Fill in any other questions you remember — even fragments help.
>
> - Question: ___
> - What I said: ___
> - What I should have said: ___

---

## Pattern Update

| # | Company | Round | Task | Result | Category |
|---|---------|-------|------|--------|----------|
| 13 | CSE | Technical | Security (FE/BE/MFE), Circuit Breaker | ⏳ Awaiting | Resilience patterns + Security |

**Gap identified:** Missed circuit breaker in MFE scenario. Rest of the interview went well — just need to plug this resilience pattern gap.

---

## Recovery Plan

> Don't just feel bad. Do the drills.

- [ ] Day 1: Study circuit breaker pattern — read Martin Fowler + implement from scratch
- [ ] Day 2: Study all resilience patterns (bulkhead, retry, timeout, fallback)
- [ ] Day 3: Review frontend security checklist (XSS, CSRF, CSP, CORS, SRI)
- [ ] Day 4: Review backend security checklist (injection, auth, rate limiting, secrets)
- [ ] Day 5: Review MFE-specific security (shared auth, sandboxing, module federation)
- [ ] Day 6: Mock interview — scenario-based MFE architecture with security & resilience focus
