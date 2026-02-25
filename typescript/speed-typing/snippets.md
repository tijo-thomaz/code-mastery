# TypeScript Speed Typing Snippets

Practice typing these snippets for muscle memory. Time yourself and aim to reduce errors over sessions.

---

## 1. Basic Interface

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}
```

## 2. Generic Function

```typescript
function mapArray<T, U>(arr: T[], fn: (item: T, index: number) => U): U[] {
  return arr.map(fn);
}
```

## 3. Utility Type Composition

```typescript
type CreateUserDto = Omit<User, "id" | "createdAt"> & {
  password: string;
  confirmPassword: string;
};

type UpdateUserDto = Partial<Omit<User, "id">> & Pick<User, "id">;
```

## 4. Discriminated Union

```typescript
type ApiResult<T> =
  | { status: "success"; data: T; timestamp: Date }
  | { status: "error"; error: string; code: number }
  | { status: "loading" };

function handleResult<T>(result: ApiResult<T>): T | null {
  switch (result.status) {
    case "success":
      return result.data;
    case "error":
      console.error(result.error);
      return null;
    case "loading":
      return null;
  }
}
```

## 5. React Component Props

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, size = "md", disabled, onClick, children }) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
```

## 6. Generic API Response Handler

```typescript
interface ApiResponse<T> {
  data: T;
  meta: { page: number; total: number; perPage: number };
  error: string | null;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<ApiResponse<T>>;
}
```

## 7. Type Guard

```typescript
interface Admin {
  role: "admin";
  permissions: string[];
}

interface Guest {
  role: "guest";
  sessionId: string;
}

type AppUser = Admin | Guest;

function isAdmin(user: AppUser): user is Admin {
  return user.role === "admin";
}
```

## 8. Mapped Type with Template Literals

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type WithAccessors<T> = T & Getters<T> & Setters<T>;
```

## 9. Conditional Type with Infer

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

type FirstParameter<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;

type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
```

## 10. Enum with Exhaustive Switch

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

function getStatusText(method: HttpMethod): string {
  switch (method) {
    case HttpMethod.GET:
      return "Fetching resource";
    case HttpMethod.POST:
      return "Creating resource";
    case HttpMethod.PUT:
      return "Replacing resource";
    case HttpMethod.PATCH:
      return "Updating resource";
    case HttpMethod.DELETE:
      return "Deleting resource";
    default:
      const _exhaustive: never = method;
      return _exhaustive;
  }
}
```

## 11. Generic Constraint with keyof

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of items) {
    const group = map.get(item[key]) ?? [];
    group.push(item);
    map.set(item[key], group);
  }
  return map;
}
```

## 12. Branded Types

```typescript
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;
type UserId = Brand<string, "UserId">;

function usd(amount: number): USD {
  return amount as USD;
}

function addUsd(a: USD, b: USD): USD {
  return (a + b) as USD;
}
```

## 13. Record with Satisfies

```typescript
type Theme = Record<string, { bg: string; fg: string; border: string }>;

const theme = {
  primary: { bg: "#007bff", fg: "#ffffff", border: "#0056b3" },
  secondary: { bg: "#6c757d", fg: "#ffffff", border: "#545b62" },
  danger: { bg: "#dc3545", fg: "#ffffff", border: "#c82333" },
} satisfies Theme;
```

## 14. Generic Class with Constraints

```typescript
interface Identifiable {
  id: string;
}

class Repository<T extends Identifiable> {
  private items: Map<string, T> = new Map();

  save(item: T): void {
    this.items.set(item.id, item);
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}
```

## 15. Async Iterator Type

```typescript
async function* paginate<T>(
  fetcher: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
): AsyncGenerator<T[], void, unknown> {
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const result = await fetcher(page);
    yield result.data;
    hasMore = result.hasMore;
    page++;
  }
}
```

## 16. Zod-style Schema Builder

```typescript
interface Schema<T> {
  parse(input: unknown): T;
  optional(): Schema<T | undefined>;
}

function string(): Schema<string> {
  return {
    parse(input: unknown): string {
      if (typeof input !== "string") throw new Error("Expected string");
      return input;
    },
    optional() {
      return {
        parse: (input: unknown) => (input === undefined ? undefined : string().parse(input)),
        optional: () => this.optional(),
      };
    },
  };
}
```
