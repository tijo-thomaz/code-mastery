# 🔷 TypeScript — Theory + Real World (Senior Interview 2026)

> Not just types. WHY they exist and WHERE you use them.

---

## 1. Generics — The #1 TS Interview Topic

### Theory
Generics let you write code that works with ANY type while keeping type safety. Without generics, you'd either use `any` (unsafe) or write duplicate code for each type.

### Real World
```ts
// ❌ Without generics — loses type info
function getFirst(arr: any[]): any {
  return arr[0];
}
const val = getFirst([1, 2, 3]); // val is `any` — TS can't help you

// ✅ With generics — preserves type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
const val = getFirst([1, 2, 3]); // val is `number` — TS knows!
const name = getFirst(["a", "b"]); // name is `string`
```

### Where you use this daily
```ts
// React component that renders any list
function List<T extends { id: number }>({ items, render }: {
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  return <ul>{items.map(item => <li key={item.id}>{render(item)}</li>)}</ul>;
}

// Usage — TS knows `user` is User type inside render
<List items={users} render={(user) => <span>{user.name}</span>} />

// API fetch wrapper
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as Promise<T>;
}
const users = await fetchJson<User[]>("/api/users"); // typed!

// Zustand store
const useStore = create<{ count: number; inc: () => void }>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
```

### Interview one-liner
> "Generics are type parameters — they let functions and components work with any type without losing type safety. Like function parameters but for types."

---

## 2. Discriminated Unions — Most Practical TS Pattern

### Theory
A discriminated union is a union of types that share a common literal field (the "discriminant"). TypeScript uses this field to narrow the type automatically in switch/if statements.

### Real World — API State (you'll use this in EVERY React app)
```ts
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function UserList() {
  const [state, setState] = useState<ApiState<User[]>>({ status: "idle" });

  // In JSX — TS narrows automatically:
  switch (state.status) {
    case "idle":    return <p>Ready</p>;
    case "loading": return <Spinner />;
    case "success": return state.data.map(u => <p>{u.name}</p>); // TS knows .data exists
    case "error":   return <p>{state.message}</p>;               // TS knows .message exists
  }
}
```

### Real World — Action types (Redux/useReducer)
```ts
type TodoAction =
  | { type: "ADD"; payload: string }
  | { type: "DELETE"; payload: number }
  | { type: "TOGGLE"; payload: number };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD":
      // TS knows payload is string here
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "DELETE":
      // TS knows payload is number here
      return state.filter(t => t.id !== action.payload);
    case "TOGGLE":
      return state.map(t =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
  }
}
```

### Real World — Backend response handling
```ts
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function handleResponse<T>(res: ApiResponse<T>) {
  if (res.ok) {
    console.log(res.data);   // TS knows data exists
  } else {
    console.log(res.error);  // TS knows error exists
  }
}
```

### Interview one-liner
> "Discriminated unions use a shared literal property to let TypeScript narrow types automatically in conditionals. I use them for API states, reducer actions, and response handling."

---

## 3. Utility Types — Know All 8

### The ones interviewers ask you to explain AND implement

| Type | What it does | Real world use |
|------|-------------|----------------|
| `Partial<T>` | All properties optional | Form updates: `updateUser(Partial<User>)` |
| `Required<T>` | All properties required | Validated config after defaults applied |
| `Pick<T, K>` | Keep only specified keys | API response subset: `Pick<User, "name" \| "email">` |
| `Omit<T, K>` | Remove specified keys | Create form (no id): `Omit<User, "id">` |
| `Record<K, V>` | Object with keys K, values V | Lookup table: `Record<string, User>` |
| `Readonly<T>` | All properties readonly | Config objects, Redux state |
| `Extract<T, U>` | Keep union members matching U | `Extract<"a" \| "b" \| "c", "a" \| "b">` → `"a" \| "b"` |
| `Exclude<T, U>` | Remove union members matching U | `Exclude<"a" \| "b" \| "c", "a">` → `"b" \| "c"` |

### Implement from scratch (interview favorite)
```ts
// Pick — keep only K keys
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit — remove K keys
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Partial — make all optional
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Required — make all required
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// Readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Record
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};
```

### Real world usage
```ts
// Creating a user (no id — server generates it)
type CreateUserDTO = Omit<User, "id">;

// Updating a user (all fields optional)
type UpdateUserDTO = Partial<Omit<User, "id">>;

// API route map
type ApiRoutes = Record<string, (...args: any[]) => Promise<any>>;

// Component props — pick only what the component needs
type UserCardProps = Pick<User, "name" | "email" | "avatar">;
```

---

## 4. Mapped Types — The Engine Behind Utility Types

### Theory
Mapped types transform every property of a type. They're the `map()` of the type system.

```ts
// Syntax: iterate over keys, transform values
type Mapped<T> = {
  [K in keyof T]: SomeTransformation<T[K]>;
};
```

### Real World — Form errors
```ts
// Every field in the form gets an optional error string
type FormErrors<T> = {
  [K in keyof T]?: string;
};

type LoginForm = { email: string; password: string };
type LoginErrors = FormErrors<LoginForm>;
// { email?: string; password?: string }
```

### Real World — Getters
```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getEmail: () => string; getAge: () => number }
```

---

## 5. Conditional Types — Type-level if/else

### Theory
```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
```

### The `infer` keyword — pattern matching for types
```ts
// Extract return type of a function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = (x: number) => string;
type Result = MyReturnType<Fn>; // string

// Extract promise resolved type
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>; // string
type B = Unwrap<number>;          // number

// Extract array element type
type ElementOf<T> = T extends (infer E)[] ? E : never;

type C = ElementOf<string[]>; // string
```

### Real World — API response unwrapper
```ts
type ApiResponse<T> = { data: T; status: number };

type UnwrapApi<T> = T extends ApiResponse<infer D> ? D : never;

type UserData = UnwrapApi<ApiResponse<User>>; // User
```

---

## 6. Template Literal Types — String manipulation at type level

### Theory
```ts
type Greeting = `Hello, ${string}`;  // any string starting with "Hello, "

type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"
```

### Real World — Route params
```ts
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

type Params = ExtractParams<"/users/:id/posts/:postId">;
// { id: string } & { postId: string }
```

### Real World — CSS utility types
```ts
type CSSUnit = "px" | "rem" | "em" | "%";
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = "100px";  // ✅
// const bad: CSSValue = "abc";   // ❌
```

---

## 7. `unknown` vs `any` vs `never`

| Type | Meaning | When to use |
|------|---------|-------------|
| `any` | Opt out of type checking | Migration from JS, escape hatch (AVOID in new code) |
| `unknown` | Safe `any` — must narrow before use | External data: API responses, user input, JSON.parse |
| `never` | Impossible state — can't have a value | Exhaustive checks, functions that always throw |

### Real World
```ts
// unknown — safe API response handling
function processInput(input: unknown) {
  // input.name  ← TS ERROR: can't access before narrowing
  if (typeof input === "string") {
    console.log(input.toUpperCase()); // TS knows it's string now
  }
  if (isUser(input)) {
    console.log(input.name); // TS knows it's User now
  }
}

// never — exhaustive switch check
function handleAction(action: TodoAction): never | void {
  switch (action.type) {
    case "ADD": /* ... */ break;
    case "DELETE": /* ... */ break;
    case "TOGGLE": /* ... */ break;
    default:
      const _exhaustive: never = action; // TS ERROR if you miss a case
  }
}
```

### Interview one-liner
> "`any` opts out of TS. `unknown` is safe — you must narrow it. `never` means it can't happen — I use it for exhaustive checks in switch statements."

---

## 8. `satisfies` (TS 4.9+) — Validate without widening

### Problem
```ts
// With type annotation — loses literal types
const config: Record<string, string | number> = {
  port: 3000,
  host: "localhost",
};
config.port; // string | number ← lost the fact that it's number
```

### Solution
```ts
// With satisfies — validates AND preserves literal types
const config = {
  port: 3000,
  host: "localhost",
} satisfies Record<string, string | number>;

config.port;  // number ← TS remembers!
config.host;  // string ← TS remembers!
```

### Real World — Route config
```ts
const routes = {
  home: "/",
  users: "/users",
  profile: "/users/:id",
} satisfies Record<string, string>;

// TS knows routes.home is exactly "/" not just string
```

---

## 9. `interface` vs `type` — The Settled Debate

| Feature | `interface` | `type` |
|---------|------------|--------|
| Object shapes | ✅ | ✅ |
| Extends | `extends` | `&` (intersection) |
| Declaration merging | ✅ (same name merges) | ❌ |
| Unions | ❌ | ✅ `type A = B \| C` |
| Computed/mapped types | ❌ | ✅ |
| Performance | Slightly better (cached) | Recomputed |

### Rule of thumb
- **`interface`** for public API contracts, component props, class shapes
- **`type`** for unions, intersections, utility types, anything computed

```ts
// Interface — component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// Type — union, computed
type ApiState = "idle" | "loading" | "success" | "error";
type UserKeys = keyof User;
type ReadonlyUser = Readonly<User>;
```

---

## 10. Type Guards — Runtime Narrowing

```ts
// typeof guard
function process(value: string | number) {
  if (typeof value === "string") {
    value.toUpperCase(); // TS knows string
  }
}

// in guard
function handle(shape: Circle | Square) {
  if ("radius" in shape) {
    shape.radius; // TS knows Circle
  }
}

// instanceof guard
if (error instanceof APIError) {
  error.statusCode; // TS knows APIError
}

// Custom type guard (the `is` keyword)
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "email" in data
  );
}

// Usage — after guard, TS narrows automatically
const input: unknown = JSON.parse(rawData);
if (isUser(input)) {
  console.log(input.name); // TS knows it's User
}
```

### Interview one-liner
> "Type guards narrow types at runtime. `typeof` for primitives, `in` for object properties, `instanceof` for classes, and custom guards with `is` for complex validation."

---

## Quick Verbal Drill — Explain These in 60 Seconds Each

1. "What are generics and when do you use them?"
2. "What is a discriminated union? Give a real example."
3. "Implement `Pick<T, K>` from scratch."
4. "What's the difference between `unknown` and `any`?"
5. "What does `satisfies` do that a type annotation doesn't?"
6. "When do you use `interface` vs `type`?"
7. "What is `infer` and where do you use it?"
8. "How do you make a type-safe event emitter?"
