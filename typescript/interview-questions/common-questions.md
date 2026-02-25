# Common TypeScript Interview Questions

12 frequently asked TypeScript interview questions with detailed answers.

---

## 1. What is the difference between `type` and `interface`?

**Answer:**

Both define object shapes, but they have key differences:

| Feature | `interface` | `type` |
|---------|------------|--------|
| Declaration merging | ✅ Yes | ❌ No |
| `extends` keyword | ✅ Yes | Uses `&` intersection |
| Union types | ❌ No | ✅ Yes |
| Mapped types | ❌ No | ✅ Yes |
| Computed properties | ❌ No | ✅ Yes |

**Rule of thumb:** Use `interface` for public API contracts (they can be extended by consumers). Use `type` for unions, intersections, mapped types, and utility compositions.

```typescript
// Interface — declaration merging
interface User { id: number; }
interface User { name: string; } // merges into one interface

// Type — unions and complex compositions
type Result<T> = { ok: true; data: T } | { ok: false; error: Error };
type ReadonlyUser = Readonly<User>;
```

---

## 2. Explain `any` vs `unknown` vs `never`.

**Answer:**

- **`any`** — Disables type checking entirely. Any operation is allowed. Avoid in strict codebases.
- **`unknown`** — The type-safe counterpart of `any`. You must narrow before using the value.
- **`never`** — Represents values that never occur. Used for exhaustiveness checks and impossible states.

```typescript
// any — no safety
const a: any = "hello";
a.nonExistentMethod(); // no error — runtime crash

// unknown — must narrow first
const b: unknown = "hello";
if (typeof b === "string") {
  b.toUpperCase(); // OK after narrowing
}

// never — exhaustiveness
type Shape = "circle" | "square";
function check(s: Shape) {
  switch (s) {
    case "circle": return;
    case "square": return;
    default:
      const _: never = s; // compile error if a case is missed
  }
}
```

---

## 3. What are generics and why are they useful?

**Answer:**

Generics allow you to write reusable code that works with multiple types while maintaining type safety. Instead of using `any`, generics preserve the relationship between inputs and outputs.

```typescript
// Without generics — loses type information
function first(arr: any[]): any { return arr[0]; }

// With generics — preserves types
function first<T>(arr: T[]): T | undefined { return arr[0]; }

const num = first([1, 2, 3]);    // num: number
const str = first(["a", "b"]);   // str: string
```

Key generic features: constraints (`extends`), defaults (`<T = string>`), and multiple parameters (`<K, V>`).

---

## 4. How does type narrowing work?

**Answer:**

TypeScript narrows types using control flow analysis. Common narrowing techniques:

```typescript
function process(value: string | number | null) {
  // 1. typeof guard
  if (typeof value === "string") {
    value.toUpperCase(); // string
  }

  // 2. truthiness check
  if (value) {
    value; // string | number (null eliminated)
  }

  // 3. equality check
  if (value === null) {
    value; // null
  }

  // 4. instanceof
  if (value instanceof Date) { /* ... */ }

  // 5. `in` operator
  if (typeof value === "object" && value !== null && "name" in value) { /* ... */ }

  // 6. Custom type guard
  // function isString(v: unknown): v is string { return typeof v === "string"; }
}
```

---

## 5. Explain TypeScript's utility types: Partial, Required, Pick, Omit, Record.

**Answer:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

Partial<User>         // All properties optional
Required<User>        // All properties required
Pick<User, "id">      // { id: number }
Omit<User, "email">   // { id: number; name: string }
Record<string, User>  // { [key: string]: User }
```

**From scratch:**

```typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
type MyRecord<K extends string, V> = { [P in K]: V };
```

---

## 6. What is strict mode and what flags does it enable?

**Answer:**

`"strict": true` in `tsconfig.json` enables a bundle of stricter checks:

| Flag | What it does |
|------|-------------|
| `strictNullChecks` | `null` and `undefined` are distinct types |
| `strictFunctionTypes` | Contravariant parameter checking |
| `strictBindCallApply` | Correct types for `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Class properties must be initialized |
| `noImplicitAny` | Error on implicit `any` types |
| `noImplicitThis` | Error on `this` with implicit `any` type |
| `alwaysStrict` | Emit `"use strict"` in every file |
| `useUnknownInCatchVariables` | `catch(e)` gives `e: unknown` instead of `any` |

**Always enable `strict: true` in new projects.** It catches real bugs.

---

## 7. What are conditional types and how does distribution work?

**Answer:**

Conditional types follow the pattern `T extends U ? X : Y`.

**Distribution:** When `T` is a union, the conditional type is applied to each member individually:

```typescript
type IsString<T> = T extends string ? true : false;

// Distribution in action:
type Test = IsString<string | number>;
// = IsString<string> | IsString<number>
// = true | false
// = boolean

// Prevent distribution with [] wrapper:
type IsStringNoDistribute<T> = [T] extends [string] ? true : false;
type Test2 = IsStringNoDistribute<string | number>; // false (union doesn't match string)
```

**`infer`** introduces a type variable in the true branch:

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Flatten<T> = T extends Array<infer U> ? U : T;
```

---

## 8. What are decorators in TypeScript?

**Answer:**

Decorators (stage 3, stabilized in TS 5.0) are functions that modify classes, methods, accessors, or fields at definition time.

```typescript
// TS 5.0+ standard decorators
function log<T extends (...args: any[]) => any>(
  originalMethod: T,
  context: ClassMethodDecoratorContext,
) {
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    console.log(`Calling ${String(context.name)}`, args);
    return originalMethod.apply(this, args);
  } as T;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**Note:** Legacy (experimental) decorators use `--experimentalDecorators`. The new standard decorators (TS 5.0+) work without this flag and have a different API.

---

## 9. What is the `satisfies` operator?

**Answer:**

`satisfies` (TS 5.0) validates a value against a type **without widening** it. The variable retains its specific/literal types.

```typescript
type Colors = Record<string, [number, number, number] | string>;

// Without satisfies — type is widened:
const a: Colors = { red: [255, 0, 0], white: "#fff" };
a.red; // [number, number, number] | string — lost specificity

// With satisfies — validated but specific:
const b = { red: [255, 0, 0], white: "#fff" } satisfies Colors;
b.red;   // [number, number, number] — knows it's a tuple
b.white; // string — knows it's a string
```

---

## 10. What are mapped types and key remapping?

**Answer:**

Mapped types transform each property of a type:

```typescript
// Basic mapped type
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Key remapping with `as` (TS 4.1+)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Filtering keys
type RemoveMethods<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
```

---

## 11. How do branded/nominal types work in TypeScript?

**Answer:**

TypeScript uses structural typing — two types with the same shape are compatible. Branded types create nominal-like distinctions:

```typescript
type USD = number & { readonly __brand: unique symbol };
type EUR = number & { readonly __brand: unique symbol };

function usd(n: number): USD { return n as USD; }
function eur(n: number): EUR { return n as EUR; }

function addUsd(a: USD, b: USD): USD { return (a + b) as USD; }

addUsd(usd(10), usd(20)); // OK
addUsd(usd(10), eur(20)); // Error — EUR is not USD
addUsd(usd(10), 20);      // Error — number is not USD
```

**Use cases:** Preventing unit mismatches (USD/EUR, pixels/rem), validated strings (Email, URL), entity IDs.

---

## 12. What is the `infer` keyword and how is it used?

**Answer:**

`infer` declares a type variable inside a conditional type's `extends` clause. It "captures" part of the matched type:

```typescript
// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract array element
type ElementOf<T> = T extends (infer U)[] ? U : never;

// Extract Promise value (recursive)
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract second argument
type SecondArg<T> = T extends (a: any, b: infer B, ...rest: any[]) => any ? B : never;

// Pattern matching on strings
type ParseInt<T> = T extends `${infer N extends number}` ? N : never;
type Five = ParseInt<"5">; // 5
```

`infer` is the foundation for most advanced utility types and type-level programming in TypeScript.
