# 🏗️ TECH VERSANT — SOLID Principles + Design Patterns Drill

> **Role:** Team Lead — Full Stack (React + TS + Go)
> **Why they ask:** They want to see if you write maintainable, scalable code and can lead a team to do the same.
> **Format:** Principle → One-liner → Bad code → Good code → "Say this"

---

## PART 1: SOLID PRINCIPLES

---

### S — Single Responsibility Principle

**One-liner:** A class/module/function should have only ONE reason to change.

**❌ BAD — does too much:**
```typescript
class UserService {
  createUser(data: UserInput) { /* saves to DB */ }
  sendWelcomeEmail(user: User) { /* sends email */ }
  generateReport(users: User[]) { /* creates PDF */ }
  validatePassword(pw: string) { /* checks strength */ }
}
// 4 reasons to change: DB schema, email template, report format, password rules
```

**✅ GOOD — one job each:**
```typescript
class UserRepository {
  create(data: UserInput): Promise<User> { /* DB only */ }
}

class EmailService {
  sendWelcome(user: User): Promise<void> { /* email only */ }
}

class ReportGenerator {
  generateUserReport(users: User[]): Promise<Buffer> { /* report only */ }
}

class PasswordValidator {
  validate(pw: string): ValidationResult { /* validation only */ }
}
```

**In React:**
```tsx
// ❌ BAD — component fetches, transforms, and renders
function UserDashboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
        const active = sorted.filter(u => u.status === 'active');
        setUsers(active);
      });
  }, []);
  return <ul>{users.map(u => <li key={u.id}>{u.name} - {u.email}</li>)}</ul>;
}

// ✅ GOOD — separated concerns
function useActiveUsers() {
  return useQuery(['users'], fetchUsers, {
    select: (data) => data.filter(u => u.status === 'active'),
  });
}

function UserDashboard() {
  const { data: users } = useActiveUsers();
  return <UserList users={users} />;
}

function UserList({ users }: { users: User[] }) {
  return <ul>{users.map(u => <UserRow key={u.id} user={u} />)}</ul>;
}
```

**In Go:**
```go
// ❌ BAD — handler does everything
func handleCreateUser(w http.ResponseWriter, r *http.Request) {
    // parse body, validate, hash password, insert DB, send email, return response
}

// ✅ GOOD — each layer does one thing
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request)  // parse + respond
func (s *UserService) Create(input CreateUserInput) (*User, error)        // business logic
func (r *UserRepo) Insert(user *User) error                               // DB only
func (e *EmailService) SendWelcome(user *User) error                      // email only
```

**SAY THIS:**
> "Single Responsibility means one reason to change. I split handlers, services, and repositories in Go — the handler parses requests, the service handles business logic, the repo talks to the DB. In React, I separate data fetching hooks from presentation components. It makes testing trivial — each piece has one job."

---

### O — Open/Closed Principle

**One-liner:** Open for extension, closed for modification. Add new behavior WITHOUT changing existing code.

**❌ BAD — modify existing code for every new type:**
```typescript
function calculateDiscount(type: string, amount: number): number {
  if (type === 'regular') return amount * 0.05;
  if (type === 'premium') return amount * 0.1;
  if (type === 'vip') return amount * 0.2;
  // Every new customer type = modify this function
  return 0;
}
```

**✅ GOOD — extend with new strategies:**
```typescript
interface DiscountStrategy {
  calculate(amount: number): number;
}

class RegularDiscount implements DiscountStrategy {
  calculate(amount: number) { return amount * 0.05; }
}

class PremiumDiscount implements DiscountStrategy {
  calculate(amount: number) { return amount * 0.1; }
}

// Adding VIP = NEW class, NO modification to existing code
class VIPDiscount implements DiscountStrategy {
  calculate(amount: number) { return amount * 0.2; }
}

function calculateDiscount(strategy: DiscountStrategy, amount: number): number {
  return strategy.calculate(amount);
}
```

**In React (config-driven — your KYC pattern!):**
```tsx
// ❌ BAD — hardcoded steps
function KYCForm({ country }) {
  if (country === 'UK') return <UKForm />;
  if (country === 'US') return <USForm />;
  if (country === 'India') return <IndiaForm />; // modify for every country
}

// ✅ GOOD — config-driven (open for extension)
const kycConfig: Record<string, FormConfig> = {
  UK: { steps: [...], validations: [...] },
  US: { steps: [...], validations: [...] },
  // Adding India = new config entry, NO code change
};

function KYCForm({ country }) {
  const config = kycConfig[country];
  return <DynamicForm config={config} />;
}
```

**In Go (interfaces):**
```go
// Go interfaces are implicitly satisfied — ultimate Open/Closed
type Notifier interface {
    Notify(user User, message string) error
}

type EmailNotifier struct{}
func (e EmailNotifier) Notify(user User, msg string) error { /* send email */ }

type SlackNotifier struct{}
func (s SlackNotifier) Notify(user User, msg string) error { /* send slack */ }

// Adding SMS = new struct, no modification
type SMSNotifier struct{}
func (s SMSNotifier) Notify(user User, msg string) error { /* send SMS */ }

func NotifyAll(notifiers []Notifier, user User, msg string) {
    for _, n := range notifiers {
        n.Notify(user, msg)
    }
}
```

**SAY THIS:**
> "Open/Closed means I can add new behavior without touching existing code. My KYC system was exactly this — config-driven. Adding a new country meant adding a config file, not modifying the form engine. In Go, interfaces make this natural — any struct that implements the method signature satisfies the interface. No modification needed."

---

### L — Liskov Substitution Principle

**One-liner:** Subtypes must be usable in place of their parent type without breaking behavior.

**❌ BAD — subclass breaks parent contract:**
```typescript
class Bird {
  fly(): string { return 'flying'; }
}

class Penguin extends Bird {
  fly(): string { throw new Error("Can't fly!"); } // Breaks LSP!
  // Code expecting Bird.fly() will crash
}

function makeBirdFly(bird: Bird) {
  bird.fly(); // 💥 crashes if penguin
}
```

**✅ GOOD — separate what's actually different:**
```typescript
interface Bird {
  move(): string;
}

interface FlyingBird extends Bird {
  fly(): string;
}

class Eagle implements FlyingBird {
  move() { return 'flying'; }
  fly() { return 'soaring high'; }
}

class Penguin implements Bird {
  move() { return 'swimming'; } // No fly() — no violation
}
```

**Real-world example — payment processors:**
```typescript
interface PaymentProcessor {
  charge(amount: number): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
}

class StripeProcessor implements PaymentProcessor {
  async charge(amount: number) { /* Stripe API */ }
  async refund(txId: string) { /* Stripe refund */ }
}

class PayPalProcessor implements PaymentProcessor {
  async charge(amount: number) { /* PayPal API */ }
  async refund(txId: string) { /* PayPal refund */ }
}

// Any PaymentProcessor works here — LSP satisfied
async function processOrder(processor: PaymentProcessor, amount: number) {
  return processor.charge(amount);
}
```

**SAY THIS:**
> "Liskov means any subtype must work wherever the parent type is expected. If a function takes a PaymentProcessor, Stripe and PayPal must both work without the function needing to know which one it got. If a subclass throws exceptions or changes behavior the parent guarantees, that's an LSP violation — redesign the hierarchy."

---

### I — Interface Segregation Principle

**One-liner:** Don't force classes to implement interfaces they don't use. Many small interfaces > one fat interface.

**❌ BAD — fat interface:**
```typescript
interface Worker {
  code(): void;
  test(): void;
  design(): void;
  manageSprint(): void;
  conductReview(): void;
}

// Junior dev forced to implement manageSprint? No.
class JuniorDev implements Worker {
  code() { /* yes */ }
  test() { /* yes */ }
  design() { throw new Error('Not my job'); } // ISP violation
  manageSprint() { throw new Error('Not my job'); }
  conductReview() { throw new Error('Not my job'); }
}
```

**✅ GOOD — segregated interfaces:**
```typescript
interface Coder {
  code(): void;
}

interface Tester {
  test(): void;
}

interface Designer {
  design(): void;
}

interface Manager {
  manageSprint(): void;
  conductReview(): void;
}

class JuniorDev implements Coder, Tester {
  code() { /* yes */ }
  test() { /* yes */ }
}

class TechLead implements Coder, Tester, Manager {
  code() { /* yes */ }
  test() { /* yes */ }
  manageSprint() { /* yes */ }
  conductReview() { /* yes */ }
}
```

**Go does this naturally — small interfaces:**
```go
// Go stdlib: io.Reader, io.Writer — just ONE method each
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose when needed
type ReadWriter interface {
    Reader
    Writer
}

// Your function asks for ONLY what it needs
func processData(r io.Reader) error {
    // Only needs Read — doesn't care about Write, Close, etc.
}
```

**SAY THIS:**
> "Interface Segregation means don't make a God interface. In Go, the stdlib is the perfect example — io.Reader has one method, io.Writer has one method. You compose them when needed. In TypeScript, I split fat interfaces into focused ones and let classes implement only what they actually do. A junior dev shouldn't be forced to implement manageSprint."

---

### D — Dependency Inversion Principle

**One-liner:** High-level modules shouldn't depend on low-level modules. Both should depend on abstractions (interfaces).

**❌ BAD — directly coupled to implementation:**
```typescript
class UserService {
  private db = new PostgresDB(); // Hardcoded dependency
  private mailer = new SendGrid(); // Hardcoded dependency

  async createUser(data: UserInput) {
    const user = await this.db.insert('users', data); // Tied to Postgres
    await this.mailer.send(user.email, 'Welcome!'); // Tied to SendGrid
  }
}
// Can't test without real DB and real email service
```

**✅ GOOD — depend on abstractions:**
```typescript
interface UserRepository {
  insert(data: UserInput): Promise<User>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class UserService {
  constructor(
    private repo: UserRepository,    // abstraction
    private email: EmailService,     // abstraction
  ) {}

  async createUser(data: UserInput) {
    const user = await this.repo.insert(data);
    await this.email.send(user.email, 'Welcome!', 'Hello...');
  }
}

// Production
new UserService(new PostgresUserRepo(), new SendGridEmail());

// Testing — swap with mocks
new UserService(new InMemoryUserRepo(), new MockEmail());
```

**In Go (constructor injection):**
```go
type UserRepository interface {
    Insert(ctx context.Context, user *User) error
}

type EmailService interface {
    Send(to, subject, body string) error
}

type UserService struct {
    repo  UserRepository
    email EmailService
}

func NewUserService(repo UserRepository, email EmailService) *UserService {
    return &UserService{repo: repo, email: email}
}

// Production
svc := NewUserService(postgresRepo, sendgridEmail)

// Testing
svc := NewUserService(mockRepo, mockEmail)
```

**SAY THIS:**
> "Dependency Inversion means coding against interfaces, not implementations. My UserService depends on a UserRepository interface — it doesn't know or care if it's Postgres, MongoDB, or an in-memory mock. This makes testing trivial and swapping implementations painless. In Go, constructor injection with interfaces is the standard pattern."

---

## PART 2: DESIGN PATTERNS (Interview Favorites)

---

### 1. Strategy Pattern ⭐ (Most Asked)

**When:** You have multiple algorithms/behaviors and want to switch between them.

```typescript
// Sorting strategy
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[]) { /* quicksort */ }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(data: T[]) { /* mergesort */ }
}

class DataProcessor<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  process(data: T[]) {
    return this.strategy.sort(data);
  }
}

// Runtime switching
const processor = new DataProcessor(new QuickSort());
processor.setStrategy(new MergeSort()); // swap at runtime
```

**Real-world: Payment processing, notification channels, auth strategies**

---

### 2. Observer Pattern ⭐

**When:** One-to-many dependency. When one thing changes, notify all subscribers.

```typescript
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Map<string, Listener<T>[]> = new Map();

  on(event: string, listener: Listener<T>) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, [...existing, listener]);
  }

  emit(event: string, data: T) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }

  off(event: string, listener: Listener<T>) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, existing.filter(fn => fn !== listener));
  }
}

// Usage
const events = new EventEmitter<Order>();
events.on('order:created', (order) => sendEmail(order));
events.on('order:created', (order) => updateInventory(order));
events.on('order:created', (order) => notifySlack(order));

events.emit('order:created', newOrder); // all 3 fire
```

**React connection:** `useState` + re-render = observer pattern. Context = pub/sub. Redux = global observer.

---

### 3. Factory Pattern ⭐

**When:** Object creation logic is complex or varies by type.

```typescript
interface Notification {
  send(message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(msg: string) { /* email */ }
}

class SMSNotification implements Notification {
  async send(msg: string) { /* SMS */ }
}

class PushNotification implements Notification {
  async send(msg: string) { /* push */ }
}

// Factory — centralizes creation logic
class NotificationFactory {
  static create(type: 'email' | 'sms' | 'push'): Notification {
    switch (type) {
      case 'email': return new EmailNotification();
      case 'sms': return new SMSNotification();
      case 'push': return new PushNotification();
    }
  }
}

// Usage — caller doesn't know concrete classes
const notifier = NotificationFactory.create('email');
notifier.send('Hello!');
```

**In Go:**
```go
func NewNotifier(notifType string) (Notifier, error) {
    switch notifType {
    case "email":
        return &EmailNotifier{}, nil
    case "sms":
        return &SMSNotifier{}, nil
    default:
        return nil, fmt.Errorf("unknown notifier type: %s", notifType)
    }
}
```

---

### 4. Singleton Pattern

**When:** Exactly one instance needed (DB connection, logger, config).

```typescript
class Database {
  private static instance: Database;

  private constructor() { /* connect */ }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Always the same instance
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

**In Go (sync.Once — goroutine-safe):**
```go
var (
    dbInstance *Database
    dbOnce    sync.Once
)

func GetDB() *Database {
    dbOnce.Do(func() {
        dbInstance = &Database{
            // connect
        }
    })
    return dbInstance
}
// Goroutine-safe — sync.Once guarantees init runs exactly once
```

**⚠️ Say this if asked about Singleton downsides:**
> "Singletons introduce hidden global state, make testing harder — you can't inject mocks easily — and create tight coupling. I prefer dependency injection in most cases. Singleton is justified for truly shared resources like a connection pool or logger."

---

### 5. Adapter Pattern

**When:** Make incompatible interfaces work together.

```typescript
// Old system returns XML
interface LegacyAPI {
  fetchXML(): string;
}

// New system expects JSON
interface ModernAPI {
  fetchJSON(): object;
}

// Adapter bridges the gap
class LegacyAdapter implements ModernAPI {
  constructor(private legacy: LegacyAPI) {}

  fetchJSON(): object {
    const xml = this.legacy.fetchXML();
    return parseXMLtoJSON(xml); // convert format
  }
}

// Usage — new code doesn't know about XML
const api: ModernAPI = new LegacyAdapter(oldSystem);
const data = api.fetchJSON(); // gets JSON, adapter handles conversion
```

**Your KYC angle:** "I used the adapter pattern when migrating from the legacy KYC system. The TypeScript bridge adapted postMessage events from the old system into the React state format the new system expected."

---

### 6. Decorator Pattern

**When:** Add behavior to objects dynamically without modifying them.

```typescript
// Base
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}

// Decorators — add behavior
class TimestampLogger implements Logger {
  constructor(private inner: Logger) {}
  log(message: string) {
    this.inner.log(`[${new Date().toISOString()}] ${message}`);
  }
}

class JSONLogger implements Logger {
  constructor(private inner: Logger) {}
  log(message: string) {
    this.inner.log(JSON.stringify({ message, level: 'info' }));
  }
}

// Stack decorators
const logger = new TimestampLogger(new JSONLogger(new ConsoleLogger()));
logger.log('User created');
// Output: [2026-03-13T...] {"message":"User created","level":"info"}
```

**Go connection:** HTTP middleware IS the decorator pattern — each middleware wraps the next handler and adds behavior (auth, logging, rate limiting).

---

### 7. Middleware Pattern (Go-specific — THEY WILL ASK)

```go
type Middleware func(http.Handler) http.Handler

func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Cookie("access_token")
        if !validToken(token) {
            http.Error(w, "Unauthorized", 401)
            return
        }
        next.ServeHTTP(w, r)
    })
}

// Chain: request → logging → auth → handler
handler := loggingMiddleware(authMiddleware(mux))
```

---

### 8. Repository Pattern

**When:** Abstract data access behind an interface.

```go
type UserRepository interface {
    FindByID(ctx context.Context, id string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
}

// Postgres implementation
type PostgresUserRepo struct {
    db *sql.DB
}

func (r *PostgresUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    row := r.db.QueryRowContext(ctx, "SELECT id, name, email FROM users WHERE id = $1", id)
    // scan and return
}

// In-memory for tests
type InMemoryUserRepo struct {
    users map[string]*User
}

func (r *InMemoryUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
    user, ok := r.users[id]
    if !ok { return nil, ErrNotFound }
    return user, nil
}
```

---

## PART 3: PATTERNS IN REACT

---

### Compound Component Pattern
```tsx
// Instead of one component with 20 props
<Select
  options={opts}
  label="Pick"
  placeholder="Choose..."
  onSelect={fn}
  renderOption={fn}
  isMulti={true}
/>

// Compound: composable, flexible
<Select onSelect={fn}>
  <Select.Label>Pick</Select.Label>
  <Select.Trigger placeholder="Choose..." />
  <Select.Options>
    {opts.map(o => <Select.Option key={o.id} value={o} />)}
  </Select.Options>
</Select>
```

### Custom Hook Pattern (Separation of Concerns)
```tsx
// Extract logic into reusable hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}
```

### Render Props / HOC → Custom Hooks
```tsx
// Old: HOC (Higher-Order Component)
const withAuth = (Component) => (props) => {
  const user = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Component {...props} user={user} />;
};

// Modern: Custom hook (preferred)
function Dashboard() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  return <DashboardContent user={user} />;
}
```

---

## ⚡ RAPID-FIRE TABLE

| Question | One-Liner |
|----------|-----------|
| SRP? | One reason to change. Handler parses, service has logic, repo does DB. |
| OCP? | Extend with new code, don't modify existing. Config-driven = OCP in action. |
| LSP? | Subtypes must work wherever parent is expected. No surprise exceptions. |
| ISP? | Small focused interfaces. Go's io.Reader = one method. Don't force unused methods. |
| DIP? | Depend on interfaces, not implementations. Constructor injection for testability. |
| Strategy? | Swap algorithms at runtime via interface. Payment processors, sort strategies. |
| Observer? | One-to-many. When X changes, notify all subscribers. Event emitters, React state. |
| Factory? | Centralize object creation. Caller doesn't know concrete class. |
| Singleton? | One instance (DB, logger). Use sync.Once in Go. Prefer DI over singleton. |
| Adapter? | Bridge incompatible interfaces. Legacy XML → modern JSON. |
| Decorator? | Add behavior without modification. Go middleware = decorator pattern. |
| Repository? | Abstract data access. Interface → swap Postgres/InMemory/Mock. |
| Middleware? | Chain of handlers that each add behavior. Logging → auth → rate limit → handler. |
| HOC vs Hook? | HOC is old pattern. Custom hooks are modern React — simpler, composable. |
| Compound Component? | Composable sub-components. <Select.Option> instead of 20 props. |

---

## 🎯 TEAM LEAD ANGLE — How You Enforce These

| Practice | How |
|----------|-----|
| SRP in PRs | "This PR does 3 things — split it" |
| OCP in architecture | Config-driven features > if/else chains |
| DIP in testing | "If you can't test it without a real DB, you need an interface" |
| Pattern consistency | Document team patterns in ADRs (Architecture Decision Records) |
| Pattern education | Pair-program on refactoring God classes → SOLID |
| Code review signal | "Is there an existing pattern for this, or are we inventing a new one?" |

**SAY THIS:**
> "I enforce SOLID through code reviews — if a PR touches too many concerns, I ask them to split it. If a new feature requires modifying existing code instead of extending it, that's a design smell. I document team patterns in ADRs so everyone's aligned. And the biggest enforcement tool is testability — if code is hard to test, it's usually violating DIP or SRP."

---

## 🧠 CONFIDENCE ANCHORS

1. **Your KYC system IS Open/Closed** — config-driven forms, no code changes for new countries. You LIVED this principle.

2. **Go middleware IS Decorator pattern** — you write this daily. Auth → logging → rate limit → handler.

3. **Go interfaces ARE ISP** — small, implicit, composable. You already think this way.

4. **Dependency injection in Go** — constructor injection with interfaces. That's DIP. You do this naturally.

5. **You can explain WHY, not just WHAT** — "Singleton makes testing hard. That's why I prefer DI." That's senior-level thinking.

---

> **SOLID isn't academic theory for you — it's how you built the KYC system. Config-driven = OCP. Interface injection = DIP. Layered services = SRP. Just talk about what you built. 🏗️**
