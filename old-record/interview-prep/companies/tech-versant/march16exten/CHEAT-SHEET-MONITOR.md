# 📌 TAPE TO MONITOR — Quick Glance During Interview

```
ARCHITECTURE FRAMING:
  Security       → LAYERS (network → edge → auth → service → data → monitoring)
  Concurrency    → DB locks → Redis locks → queues → idempotency
  Events         → Publisher → broker → consumers → DLQ → outbox
  Failure        → Circuit breaker → fallback → retry → graceful degradation
  Scale          → Stateless → LB → cache → read replicas → queues
  Consistency    → Strong (PostgreSQL) vs eventual (events) — PER USE CASE

ARCHITECT PHRASES:
  "It depends on the contention level..."
  "The trade-off here is..."
  "Defense in depth — no single layer is sufficient..."
  "I'd start simple and evolve..."
  "In my KYC system, we handled this by..."

GO IMPORTS:
  "encoding/json"  "fmt"  "net/http"  "time"  "sync"  "context"  "os"  "os/signal"

GO API SKELETON:
  mux := http.NewServeMux()
  mux.HandleFunc("GET /api/x", handler)
  json.NewDecoder(r.Body).Decode(&req)
  json.NewEncoder(w).Encode(data)
  w.WriteHeader(http.StatusCreated)
  http.Error(w, "msg", http.StatusBadRequest)

REACT SKELETON:
  useDebounce → useState + useEffect + setTimeout + clearTimeout
  AbortController → new AbortController() → signal → abort() in cleanup
  useReducer → discriminated union actions → switch → immutable updates

STATUS CODES:
  200 OK  201 Created  204 NoContent  400 Bad  401 Unauth  403 Forbidden
  404 NotFound  409 Conflict  429 TooMany  500 Internal
```
