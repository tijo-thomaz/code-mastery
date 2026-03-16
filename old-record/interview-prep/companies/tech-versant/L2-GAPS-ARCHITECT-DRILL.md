# 🏗️ TECHVERSANT — L2 Gap Fill: Distributed Systems, Event-Driven, Security at Scale

> **Context:** L2 with Arun Antony (Solution Architect) exposed these gaps.
> **He asked:** App security, distributed concurrent users, distributed systems, event-driven architecture.
> **He needs more time to evaluate** → you may get an L3, or he may call back with deeper questions.
> **Time:** 1 hr tonight + 7 AM → 2 PM tomorrow = **8 hrs total**
> **Strategy:** Learn the CONCEPTS deeply. Be able to DRAW and EXPLAIN, not just code.

---

## 🧠 WHY A SOLUTION ARCHITECT ASKS DIFFERENTLY

```
L1 interviewer (dev):  "How do you handle concurrent users?"
                        → wants to hear: optimistic locking, mutex, code-level

L2 interviewer (SA):   "How do you handle distributed concurrent users?"
                        → wants to hear: SYSTEM-level thinking
                        → load balancers, distributed locks, message queues,
                        → event sourcing, CQRS, CAP theorem, eventual consistency
                        → HOW SYSTEMS TALK TO EACH OTHER

The gap: You answered at CODE level. He wanted ARCHITECTURE level.
```

---

## ⏰ TONIGHT: 1 HR — Read + Absorb (no coding)

> Read Parts 1, 2, 3 below. Just READ and understand. Mark what's new to you.
> Don't try to memorize. Understand the WHY. Sleep on it. Morning = drill.

---

## PART 1: DISTRIBUTED SYSTEMS — The Core Concepts

---

### 1.1 CAP Theorem — Know This Cold

```
In a distributed system, you can only guarantee 2 out of 3:

  C — Consistency:    Every read gets the most recent write
  A — Availability:   Every request gets a response (even if stale)
  P — Partition Tolerance: System works even if network between nodes fails

REALITY: Network partitions WILL happen. So you're always choosing between:
  CP → Consistent + Partition-tolerant (sacrifice availability)
       Example: PostgreSQL with sync replication, MongoDB (strong reads)
       "During a partition, some requests will fail but data is correct"

  AP → Available + Partition-tolerant (sacrifice consistency)
       Example: Cassandra, DynamoDB, DNS
       "During a partition, all requests succeed but data might be stale"

SAY THIS:
> "In distributed systems, CAP theorem forces a trade-off. I default to CP with
> PostgreSQL for transactional data — correctness matters more than availability
> for things like payments and user data. For read-heavy, less critical data like
> activity feeds or analytics, I'd choose AP with eventual consistency — Cassandra
> or DynamoDB — because availability matters more than instant consistency."
```

---

### 1.2 Consistency Models

```
STRONG CONSISTENCY:
  → Read always returns latest write
  → How: single DB, synchronous replication
  → Trade-off: higher latency, lower availability
  → Use for: payments, inventory, user accounts

EVENTUAL CONSISTENCY:
  → Read might return stale data, but will converge
  → How: async replication, event propagation
  → Trade-off: lower latency, higher availability, complexity in handling staleness
  → Use for: social feeds, notifications, search indexes, analytics

READ-YOUR-OWN-WRITES:
  → User always sees their own updates immediately
  → Others may see stale data temporarily
  → How: read from primary after write, sticky sessions
  → Use for: user profile updates, settings changes

SAY THIS:
> "I choose consistency level based on the use case. Financial transactions need
> strong consistency — I'd use PostgreSQL with serializable isolation. For a news
> feed, eventual consistency is fine — I'd use an event-driven approach where
> updates propagate asynchronously, and the UI optimistically shows the user's
> own action immediately."
```

---

### 1.3 Distributed Concurrency — Beyond Single-Server Locking

```
PROBLEM: Optimistic locking works on ONE database. What about multiple servers?

SINGLE SERVER:
  → Mutex, RWMutex (Go), synchronized (Java)
  → Works because all requests hit the same process

MULTIPLE SERVERS (distributed):
  → In-process locks are USELESS — each server has its own memory
  → You need DISTRIBUTED coordination

SOLUTIONS:

1. DATABASE-LEVEL LOCKING (simplest, start here)
   → Optimistic: version column + WHERE version = $expected
   → Pessimistic: SELECT FOR UPDATE (holds row lock in transaction)
   → Works across servers because DB is the single source of truth
   → ✅ Use this for most cases

2. DISTRIBUTED LOCK (Redis / Redlock)
   → Redis SETNX with TTL: "lock:resource:123" = "server-1" EX 30
   → Only one server holds the lock at a time
   → Must handle: lock expiry, server crash while holding lock, clock skew
   → Libraries: Redlock (multi-node Redis), etcd, ZooKeeper

   ```
   // Pseudocode
   acquired = redis.SET("lock:order:456", myServerId, NX, EX, 30)
   if acquired:
       try:
           processOrder(456)
       finally:
           if redis.GET("lock:order:456") == myServerId:
               redis.DEL("lock:order:456")
   else:
       // Someone else is processing — retry or queue
   ```

3. MESSAGE QUEUE (serialize access)
   → Push all writes for a resource into a queue
   → Single consumer processes them in order
   → No lock needed — sequential by design
   → ✅ Best for high-contention write-heavy resources

4. IDEMPOTENCY KEYS (retry-safe)
   → Client sends unique key per operation
   → Server checks: "did I already process this?"
   → Prevents double-processing on retries
   → Critical for payments, order creation
```

**SAY THIS:**
> "For distributed concurrent users, I start with database-level optimistic locking
> because the DB is already the shared state. If I need cross-resource coordination,
> I use a Redis distributed lock with TTL and proper cleanup. For high-contention
> write scenarios, I route through a message queue so writes are serialized — no
> locking needed. And every mutation endpoint has an idempotency key for safe retries."

---

### 1.4 Scaling Patterns — The Architecture View

```
HORIZONTAL SCALING:
  ┌─────────┐
  │  Client  │
  └────┬─────┘
       │
  ┌────▼─────┐
  │   Load    │   Round-robin, least connections, IP hash
  │  Balancer │   (NGINX, AWS ALB, Traefik)
  └──┬────┬──┘
     │    │
  ┌──▼──┐ ┌──▼──┐
  │ App  │ │ App  │   Stateless servers (no sessions in memory!)
  │  1   │ │  2   │   Auth via JWT in cookies (validated per request)
  └──┬──┘ └──┬──┘
     │    │
  ┌──▼────▼──┐
  │ Database  │   PostgreSQL with connection pooling (PgBouncer)
  │ (primary) │   Read replicas for read-heavy queries
  └─────┬─────┘
        │
  ┌─────▼─────┐
  │   Redis    │   Cache, sessions, rate limiting, pub/sub
  └───────────┘

KEY RULES:
  → Servers MUST be stateless — no in-memory sessions
  → All shared state in DB or Redis
  → Load balancer distributes traffic
  → Scale by adding more app servers (horizontal)
  → DB scaling: read replicas, connection pooling, sharding (last resort)
```

---

## PART 2: EVENT-DRIVEN ARCHITECTURE — The Big Topic

---

### 2.1 What Is Event-Driven Architecture?

```
TRADITIONAL (request-response):
  User Service ──HTTP──► Order Service ──HTTP──► Payment Service
  → Tight coupling: if Payment is down, Order fails
  → Synchronous: user waits for ALL services to respond
  → Adding new consumers = modifying the producer

EVENT-DRIVEN:
  User creates order → Order Service publishes "OrderCreated" event
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        Payment Service  Inventory Service  Notification Service
        (charges card)   (reserves stock)   (sends email)

  → Loose coupling: services don't know about each other
  → Async: user gets immediate response, processing happens in background
  → Adding new consumers = just subscribe to the event (no code change in producer)
```

**SAY THIS:**
> "Event-driven architecture decouples services by communicating through events
> instead of direct HTTP calls. The producer publishes what happened — 'OrderCreated'
> — and consumers react independently. This gives us loose coupling, async processing,
> and the ability to add new consumers without touching the producer. It's how I'd
> build a system where multiple services need to react to the same business event."

---

### 2.2 Event-Driven Patterns

```
1. EVENT NOTIFICATION (simple)
   → "Something happened" — just a signal
   → Consumer may need to call back for full data
   → Example: { type: "OrderCreated", orderId: "123" }
   → Consumer calls GET /orders/123 for details

2. EVENT-CARRIED STATE TRANSFER (rich events)
   → Event contains ALL the data the consumer needs
   → No callbacks needed — consumer is self-sufficient
   → Example: { type: "OrderCreated", order: { id, items, total, userId, ... } }
   → Better for decoupling but larger messages

3. EVENT SOURCING (advanced)
   → Store EVENTS as the source of truth, not current state
   → State is derived by replaying events
   → Events: OrderCreated → ItemAdded → ItemRemoved → OrderSubmitted → OrderPaid
   → Current state = replay all events
   → Audit trail for free, can rebuild state at any point in time
   → Complex but powerful for: finance, audit-heavy systems, KYC

4. CQRS (Command Query Responsibility Segregation)
   → Separate models for READ and WRITE
   → Write model: normalized, handles commands (CreateOrder)
   → Read model: denormalized, optimized for queries (OrderListView)
   → Often paired with Event Sourcing
   → Use when: read and write patterns are very different (dashboards, reports)

SAY THIS:
> "I'd use event notification for simple decoupling — 'user created, here's the ID.'
> For more autonomous services, event-carried state transfer sends the full payload
> so consumers don't need callbacks. Event sourcing I'd use for audit-critical
> systems like the KYC portal — every state change is an immutable event, giving
> you a complete audit trail. CQRS makes sense when your read and write patterns
> diverge significantly, like a dashboard reading denormalized data while writes
> go through a normalized command model."
```

---

### 2.3 Message Brokers — The Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│ Broker          │ Model          │ Best For                         │
├─────────────────────────────────────────────────────────────────────┤
│ RabbitMQ        │ Message Queue  │ Task queues, work distribution   │
│                 │ (point-to-point│ Email sending, image processing  │
│                 │  or fanout)    │ Guaranteed delivery, simple setup│
├─────────────────────────────────────────────────────────────────────┤
│ Apache Kafka    │ Event Log      │ Event sourcing, high throughput  │
│                 │ (pub/sub +     │ Real-time analytics, log         │
│                 │  replay)       │ aggregation, stream processing   │
├─────────────────────────────────────────────────────────────────────┤
│ AWS SQS/SNS     │ Queue + PubSub │ Serverless, managed, AWS-native  │
│                 │                │ Simple decoupling in cloud        │
├─────────────────────────────────────────────────────────────────────┤
│ Redis Pub/Sub   │ Fire-and-forget│ Real-time notifications,         │
│                 │ (no persistence│ lightweight inter-service comms   │
│                 │  by default)   │ NOT for critical events           │
├─────────────────────────────────────────────────────────────────────┤
│ NATS            │ Lightweight    │ Microservices comms, Go-native    │
│                 │ pub/sub        │ Low latency, simple               │
└─────────────────────────────────────────────────────────────────────┘

KAFKA vs RABBITMQ — know the difference:
  Kafka:    Event LOG. Messages persist. Consumers can REPLAY. High throughput.
            → Use when: you need event history, stream processing, analytics
  RabbitMQ: Message QUEUE. Messages consumed and deleted. Routing rules.
            → Use when: you need task queues, guaranteed delivery, simple routing

SAY THIS:
> "For task queues like email sending or PDF generation, I'd use RabbitMQ —
> messages are consumed and acknowledged. For event-driven architecture where
> multiple services need to react to the same event and I might need replay,
> I'd use Kafka — it's an append-only log, so consumers can replay from any
> offset. Redis Pub/Sub is fine for real-time notifications but it's
> fire-and-forget — no persistence, so it's not suitable for critical events."
```

---

### 2.4 Event-Driven in Go — Practical Patterns

```go
// PRODUCER: Publish event after business logic
func (s *OrderService) CreateOrder(ctx context.Context, req CreateOrderRequest) (*Order, error) {
    // 1. Save to DB (transaction)
    order, err := s.repo.Create(ctx, req)
    if err != nil {
        return nil, err
    }

    // 2. Publish event (async — don't fail the request if queue is slow)
    event := OrderCreatedEvent{
        OrderID:   order.ID,
        UserID:    order.UserID,
        Items:     order.Items,
        Total:     order.Total,
        CreatedAt: order.CreatedAt,
    }
    go s.publisher.Publish(ctx, "orders.created", event) // fire-and-forget

    return order, nil
}

// CONSUMER: React to events
func (s *NotificationService) HandleOrderCreated(event OrderCreatedEvent) error {
    return s.emailSender.Send(
        event.UserID,
        "Order Confirmed",
        fmt.Sprintf("Your order %s for $%.2f has been placed.", event.OrderID, event.Total),
    )
}

// CONSUMER: Different service, same event
func (s *InventoryService) HandleOrderCreated(event OrderCreatedEvent) error {
    for _, item := range event.Items {
        if err := s.repo.ReserveStock(item.ProductID, item.Quantity); err != nil {
            return fmt.Errorf("reserving stock for %s: %w", item.ProductID, err)
        }
    }
    return nil
}
```

**Outbox Pattern — Reliable Event Publishing:**
```
PROBLEM: What if DB commit succeeds but event publish fails?
         → Data saved but downstream services never know

SOLUTION: Outbox Pattern
  1. Save order AND event in the SAME DB transaction
     INSERT INTO orders (...) VALUES (...)
     INSERT INTO outbox (event_type, payload, published) VALUES ('OrderCreated', '{...}', false)
  2. Separate process polls outbox table and publishes to broker
  3. Mark as published after successful send
  → Guarantees: if order is saved, event WILL be published (eventually)

SAY THIS:
> "For reliable event publishing, I use the outbox pattern. The event is written
> to an outbox table in the same DB transaction as the business data. A separate
> poller reads unpublished events and sends them to the message broker. This
> guarantees that if the data is committed, the event will eventually be
> published — solving the dual-write problem."
```

---

## PART 3: SECURITY AT ARCHITECTURE LEVEL

> SA-level security ≠ "XSS prevention." It's about securing the SYSTEM.

---

### 3.1 Security Layers — The Full Stack View

```
┌─────────────────────────────────────────────────────────┐
│ LAYER              │ WHAT TO SECURE                     │
├─────────────────────────────────────────────────────────┤
│ Network            │ TLS/HTTPS everywhere, VPC, firewall│
│                    │ rules, WAF (Web Application Firewall│
├─────────────────────────────────────────────────────────┤
│ Edge / API Gateway │ Rate limiting, DDoS protection,    │
│                    │ IP whitelisting, SSL termination    │
├─────────────────────────────────────────────────────────┤
│ Authentication     │ JWT validation, OAuth2/OIDC,       │
│                    │ MFA, session management             │
├─────────────────────────────────────────────────────────┤
│ Authorization      │ RBAC/ABAC, policy engine (OPA),    │
│                    │ per-resource access checks           │
├─────────────────────────────────────────────────────────┤
│ Service-to-Service │ mTLS, service tokens, API keys,    │
│                    │ zero-trust (verify even in VPC)      │
├─────────────────────────────────────────────────────────┤
│ Data at Rest       │ DB encryption, encrypted backups,   │
│                    │ secrets in Vault/KMS                 │
├─────────────────────────────────────────────────────────┤
│ Data in Transit    │ TLS for all connections,            │
│                    │ encrypted message payloads           │
├─────────────────────────────────────────────────────────┤
│ Application        │ Input validation, SQL injection,    │
│                    │ XSS, CSRF, dependency scanning       │
├─────────────────────────────────────────────────────────┤
│ Monitoring         │ Audit logs, anomaly detection,      │
│                    │ failed auth alerts, SIEM             │
└─────────────────────────────────────────────────────────┘

SAY THIS:
> "I think about security in layers — defense in depth. Network level: TLS and
> VPC isolation. Edge: rate limiting and WAF. Auth: JWT with short-lived tokens
> in httpOnly cookies. Service-to-service: mTLS or internal tokens with zero-trust.
> Data: encrypted at rest and in transit. Application: parameterized queries,
> input validation, CSP headers. And monitoring: audit logs with anomaly alerts.
> No single layer is sufficient — each assumes the previous one might fail."
```

---

### 3.2 Zero Trust Architecture

```
TRADITIONAL: "Trust the internal network"
  → If you're inside the VPC, you're trusted
  → Problem: if one service is compromised, attacker has access to everything

ZERO TRUST: "Never trust, always verify"
  → Every request is verified, even internal
  → Every service authenticates to every other service
  → Least privilege: services only access what they need
  → Micro-segmentation: network is divided into small zones

IMPLEMENTATION:
  1. mTLS between all services (mutual certificate verification)
  2. Service mesh (Istio, Linkerd) manages mTLS automatically
  3. Service identity: each service has its own certificate/token
  4. Policy engine (OPA): defines who can call what
  5. Short-lived tokens: rotate frequently, reduce blast radius

SAY THIS:
> "I advocate for zero-trust — verify every request regardless of network
> boundary. In practice, that means mTLS between services, a service mesh
> like Istio handling certificate rotation, and an authorization policy
> that enforces least privilege. Even if an attacker compromises one service,
> they can't move laterally because every hop requires authentication."
```

---

### 3.3 Securing Distributed Systems

```
1. API GATEWAY as security boundary
   → All external traffic enters through one point
   → Rate limiting, auth validation, request sanitization
   → Internal services never exposed directly

2. SECRETS MANAGEMENT
   → HashiCorp Vault / AWS Secrets Manager
   → Secrets injected at runtime, never in code or env files
   → Automatic rotation with zero-downtime
   → Audit trail: who accessed what secret when

3. DATA ENCRYPTION
   → At rest: AES-256 for DB, encrypted backups
   → In transit: TLS 1.3 for all connections
   → Field-level encryption for PII (encrypt before storing)
   → Key management: KMS, never store keys alongside data

4. AUDIT LOGGING
   → WHO did WHAT to WHICH resource at WHEN
   → Immutable audit log (append-only, separate storage)
   → Alert on: unusual access patterns, privilege escalation attempts
   → For KYC/compliance: required by regulation (GDPR, SOX)
```

---

## PART 4: PUTTING IT ALL TOGETHER — Architecture Scenarios

---

### SCENARIO: "Design a Distributed Order Processing System"

> This is the kind of question a Solution Architect asks.

```
REQUIREMENTS:
  → Users place orders (high traffic, concurrent)
  → Payment processing (must be reliable)
  → Inventory must be updated (can't oversell)
  → User gets email confirmation
  → Admin dashboard shows real-time order status

ARCHITECTURE:

  ┌─────────┐     ┌───────────┐     ┌──────────────┐
  │  React   │────►│ API Gateway│────►│ Order Service │
  │  Client  │     │ (rate limit│     │ (Go)          │
  └─────────┘     │  auth)     │     └──────┬────────┘
                  └───────────┘            │
                                    publishes event
                                    "OrderCreated"
                                           │
                          ┌────────────────┼────────────────┐
                          ▼                ▼                ▼
                   ┌──────────┐    ┌──────────┐    ┌──────────┐
                   │ Payment  │    │ Inventory│    │ Notif.   │
                   │ Service  │    │ Service  │    │ Service  │
                   │ (Go)     │    │ (Go)     │    │ (Go)     │
                   └──────────┘    └──────────┘    └──────────┘
                        │                │                │
                   publishes         updates DB       sends email
                   "PaymentProcessed"

DATA FLOW:
  1. User submits order → API validates → Order Service saves to DB
  2. Order Service publishes "OrderCreated" to message broker (Kafka/RabbitMQ)
  3. Payment Service consumes → charges card → publishes "PaymentProcessed"
  4. Inventory Service consumes → reserves stock
  5. Notification Service consumes → sends email
  6. Each service updates its own DB (database-per-service)
  7. Admin dashboard reads from a read-optimized view (CQRS)

CONCURRENCY HANDLING:
  → Inventory: pessimistic lock (SELECT FOR UPDATE) — can't oversell
  → Order: optimistic lock (version column) — handle concurrent edits
  → Payment: idempotency key — prevent double charges
  → Distributed lock: Redis for cross-service resource coordination

FAILURE HANDLING:
  → Payment fails → publish "PaymentFailed" → Order Service marks order failed
  → Inventory out of stock → publish "StockUnavailable" → compensating action
  → Dead letter queue for events that fail processing after N retries
  → Circuit breaker on external payment API (retry, then fail fast)

SAGA PATTERN (distributed transaction):
  → No distributed transactions across services
  → Instead: each service does local transaction + publishes event
  → If a step fails → compensating events undo previous steps
  → Example: PaymentFailed → release inventory → cancel order → notify user
```

**SAY THIS:**
> "I'd design this with event-driven architecture. The Order Service handles the
> initial write and publishes an OrderCreated event. Payment, Inventory, and
> Notification services consume independently. For distributed consistency, I'd
> use the Saga pattern — each service commits locally and publishes, and
> compensating events handle failures. Inventory uses pessimistic locking to
> prevent overselling, payments use idempotency keys to prevent double charges,
> and I'd use the outbox pattern to guarantee reliable event publishing."

---

## PART 5: RAPID-FIRE TABLE — SA-Level Questions

| Question | 30-second answer |
|----------|-----------------|
| "CAP theorem?" | "Can't have all 3 in distributed system. I default to CP (PostgreSQL) for transactional data, AP for read-heavy analytics. Network partitions are inevitable." |
| "Eventual consistency?" | "Data converges over time, not instantly. Fine for feeds, notifications. Not for payments. UI shows optimistic updates, background sync catches up." |
| "Event sourcing?" | "Store events, not state. Replay to rebuild. Gives audit trail for free. Used it in KYC — every document status change was an event." |
| "CQRS?" | "Separate read/write models. Write goes through commands + domain logic. Read comes from denormalized views optimized for queries. Useful when read/write patterns diverge." |
| "Saga pattern?" | "Distributed transactions without 2PC. Each service does local commit + publishes event. Failures trigger compensating actions. Choreography (events) or orchestration (central coordinator)." |
| "Outbox pattern?" | "Write event to outbox table in same DB transaction as business data. Separate poller publishes to broker. Solves dual-write problem." |
| "Distributed lock?" | "Redis SETNX with TTL. Only one process holds lock at a time. Must handle expiry and cleanup. Use for cross-instance coordination like scheduled jobs." |
| "Service mesh?" | "Infrastructure layer for service-to-service communication. Handles mTLS, load balancing, retries, observability. Istio, Linkerd. No code changes in services." |
| "Circuit breaker?" | "Three states: closed (normal), open (fail fast), half-open (test one). Prevents cascading failures. Use for external API calls. Libraries: gobreaker (Go), opossum (Node)." |
| "Backpressure?" | "When producer is faster than consumer. Solutions: bounded channels, rate limiting, dropping oldest messages, scaling consumers. Go channels with buffer = natural backpressure." |
| "Idempotency?" | "Same request repeated = same result. Client sends unique key. Server checks before processing. Critical for payments, order creation. Store key + result, return cached result on retry." |
| "Dead letter queue?" | "Where failed messages go after N retries. Alerts on DLQ size. Manual inspection + replay after fixing the bug. Never lose a message." |
| "Blue-green deployment?" | "Two identical environments. Green = new version. Route traffic to green. If bad, switch back to blue instantly. Zero-downtime, instant rollback." |
| "Feature flags?" | "Deploy code without activating. Enable per user/percentage/environment. Decouple deployment from release. Roll back = flip flag. Tools: LaunchDarkly, Unleash." |
| "Observability?" | "Three pillars: logs (what happened), metrics (how much), traces (where). Structured JSON logs, Prometheus metrics, OpenTelemetry tracing. Alert on anomalies, not just thresholds." |

---

## ⏰ TOMORROW MORNING PLAN: 7 AM → 2 PM (7 hrs)

```
7:00 AM → 8:00 AM   RE-READ Parts 1-3 (fresh mind, absorb concepts)
8:00 AM → 9:00 AM   VERBAL DRILL: explain each concept out loud (60s each)
                     → CAP theorem, eventual consistency, event-driven vs request-response
                     → Saga pattern, outbox pattern, distributed locks
                     → Zero trust, security layers, mTLS
                     → Practice the order processing scenario end-to-end (5 min talk)

9:00 AM → 10:30 AM  HANDS-ON: Build a mini event-driven system in Go
                     → Order service that publishes to a channel
                     → Payment consumer that processes + publishes result
                     → Notification consumer that logs
                     → Use Go channels to simulate message broker
                     → This gives you CODE to talk about

10:30 AM → 11:30 AM HANDS-ON: React + Go fullstack flow
                     → React form → POST to Go API → returns order
                     → Debounced search component (speed run)
                     → Todo with useReducer (speed run)
                     → Keep React hands-on sharp — L3 may still test it

11:30 AM → 12:30 PM SECURITY DEEP REVIEW
                     → Re-read FULLSTACK-SECURITY-DRILL.md (Parts 1-3)
                     → Practice security layers answer (architect level, not code level)
                     → mTLS, zero trust, API gateway security — new material

12:30 PM → 1:30 PM  SCENARIO PRACTICE — say these out loud like you're in the interview:
                     → "Design a distributed order processing system" (5 min)
                     → "How do you secure a distributed system?" (3 min)
                     → "How do you handle concurrent users across servers?" (3 min)
                     → "Explain event-driven architecture" (3 min)
                     → "Tell me about your KYC system architecture" (5 min)

1:30 PM → 2:00 PM   RAPID-FIRE: Go through Part 5 table, answer each in 30s
                     Mark any you stumble on → re-read that section
```

---

## 🧠 KEY MINDSET SHIFT

```
BEFORE (code-level thinking):
  "I use mutex for concurrency"
  "I use bcrypt for passwords"
  "I use httpOnly cookies for tokens"

AFTER (architecture-level thinking):
  "I use optimistic locking at DB level for single-instance,
   Redis distributed locks for cross-instance, and message queues
   for high-contention serialized processing"

  "Security is defense-in-depth: network isolation, API gateway
   with rate limiting, mTLS between services, JWT auth middleware,
   encrypted data at rest, and audit logging for compliance"

  "I design event-driven systems where services communicate through
   events, using the saga pattern for distributed consistency and
   the outbox pattern for reliable publishing"

The gap between "senior dev" and "tech lead/architect" is:
  → Senior dev: HOW to implement (code)
  → Architect:  WHY this approach, WHAT are the trade-offs,
                HOW does it scale, WHAT breaks under load
```

---

## 🔗 CONNECT EVERYTHING TO YOUR KYC EXPERIENCE

> Arun is a solution architect. He wants to hear you THINK at system level.
> Your KYC portal IS a distributed, event-driven, security-critical system.

```
KYC → Event-Driven:
  "Document uploaded → event → verification service processes →
   status update event → notification sent → dashboard updated"

KYC → Distributed Concurrency:
  "Multiple compliance officers reviewing the same application.
   Optimistic locking on the review record. Version conflict →
   reviewer gets notified to refresh and re-review."

KYC → Security at Scale:
  "PII encryption at rest, field-level encryption for sensitive docs,
   audit trail for every access (who viewed what document when),
   role-based access with compliance officers vs admins vs support"

KYC → Consistency:
  "Document verification status must be strongly consistent —
   you can't approve and reject simultaneously. Used PostgreSQL
   with serializable isolation for verification decisions."
```

---

> **The gap isn't knowledge — you KNOW this stuff from building KYC.
> The gap is FRAMING: talking at architecture level, not code level.
> Tomorrow morning, practice SAYING these answers out loud.
> When Arun hears you speak in systems, not in code, you'll click. 🏗️🔥**
