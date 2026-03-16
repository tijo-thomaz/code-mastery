# Tech Versant L2 — March 16, 2026

> **Result:** ⏳ Evaluating — interviewer needs more time
> **Gap Identified:** Answered at code-level, interviewer (Solution Architect) wanted architecture-level

---

### Entry #8

**Date:** 2026-03-16 (Monday)
**Company:** Tech Versant
**Role:** Team Lead — Full Stack
**Round:** L2 — Deep Dive
**Interviewer:** Mr. Arun Antony (Solution Architect)
**L1 Result:** ✅ Cleared

---

## Topics Asked

| Topic | What they expected | Where I landed |
|-------|-------------------|----------------|
| How do you secure an application? | Architecture-level: security layers, zero trust, mTLS, API gateway, defense-in-depth | Likely answered at code level: XSS, CSRF, JWT, httpOnly |
| Distributed concurrent users | Distributed locks, message queues, saga pattern, outbox pattern, CAP theorem | Likely answered: optimistic locking, mutex |
| Distributed systems | CAP theorem, consistency models, service-to-service auth, scaling patterns | Likely answered: specific tools/code |
| Event-driven systems | Event sourcing, CQRS, message brokers (Kafka vs RabbitMQ), saga pattern, outbox | Likely answered: webhooks, pub/sub basics |

---

## The Pattern

**New Pattern: "Code-Level vs Architecture-Level Thinking"**

This is different from "I use it but can't explain it" (Experion).
Here you CAN explain, but at the wrong LEVEL.

```
Junior/Mid:  "I use bcrypt for passwords"
Senior:      "I use bcrypt with cost 12, store hash not password, compare with timing-safe function"
Architect:   "Password security is one layer. The system has defense-in-depth: 
              API gateway rate-limits login attempts, auth service uses bcrypt,
              tokens are short-lived in httpOnly cookies with refresh rotation,
              failed attempts trigger alerts, and we have anomaly detection
              on the auth service logs."
```

The interviewer is a Solution Architect — he thinks in SYSTEMS, not FUNCTIONS.

---

## Recovery Plan

- [ ] Study: CAP theorem, consistency models, distributed locking
- [ ] Study: Event-driven architecture (event sourcing, CQRS, saga, outbox)
- [ ] Study: Message brokers (Kafka vs RabbitMQ — when to use which)
- [ ] Study: Security at architecture level (zero trust, mTLS, service mesh)
- [ ] Practice: Explain each topic at SYSTEM level, not code level
- [ ] Practice: "Design a distributed order processing system" — 5 min verbal
- [ ] Connect: Map every concept to your KYC portal experience

**Key file:** `interview-prep/companies/tech-versant/L2-GAPS-ARCHITECT-DRILL.md`

---

## Status

🟡 Not failed — evaluating. But the gap is clear. Fill it NOW.
