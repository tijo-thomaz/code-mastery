# Failed Interview Log — TypeScript

Track TypeScript questions you struggled with. Revisit and practice until each topic feels solid.

---

## How to Use

1. After an interview, add an entry below with the date, question, what went wrong, and what the correct answer is.
2. Rate your confidence (1–5) at the time and after studying.
3. Revisit entries weekly until confidence reaches 5.

---

## Entry 1

**Date:** 2025-01-15
**Company:** Acme Corp
**Question:** "Implement a `DeepPartial<T>` type that makes all nested properties optional."

**What I said:**
I wrote `Partial<T>` but couldn't figure out how to recurse into nested objects. I tried a conditional type but got confused about handling arrays vs objects vs primitives.

**What went wrong:**
- Didn't know how to use recursive conditional types
- Forgot to handle the `Function` case (functions are objects but shouldn't be recursed into)
- Wasn't sure how to handle arrays

**Correct answer:**

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]                   // Don't recurse into functions
      : T[K] extends any[]
        ? DeepPartialArray<T[K]> // Handle arrays specially
        : DeepPartial<T[K]>     // Recurse into objects
    : T[K];                     // Primitives stay as-is
};

type DeepPartialArray<T extends any[]> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : never;

// Test:
interface Config {
  db: { host: string; port: number; options: { ssl: boolean } };
  cache: { ttl: number };
}

type PartialConfig = DeepPartial<Config>;
// db?: { host?: string; port?: number; options?: { ssl?: boolean } }
```

**Key takeaways:**
- Recursive types need base cases (primitives, functions)
- Arrays need special handling because `Array<T>` is technically an object
- Test with nested structures to verify depth

**Confidence:** 2/5 → after study: 4/5

---

## Entry 2

**Date:** 2025-02-20
**Company:** TechStart Inc
**Question:** "Why does `Exclude<'a' | 'b' | 'c', 'a'>` work, and what is conditional type distribution?"

**What I said:**
I knew `Exclude` removes types from a union but couldn't explain the distribution mechanism. I said "TypeScript just checks each member" but couldn't describe _how_ or _why_ it distributes.

**What went wrong:**
- Couldn't explain that distribution happens because the checked type is a "naked" type parameter
- Didn't know how to prevent distribution (wrap in tuple `[T] extends [U]`)
- Couldn't explain why `Exclude<string | number, string>` gives `number`

**Correct answer:**

When a conditional type `T extends U ? X : Y` is applied to a **naked type parameter** that receives a **union**, TypeScript distributes — it applies the conditional to each union member individually and unions the results:

```typescript
type Exclude<T, U> = T extends U ? never : T;

// Exclude<'a' | 'b' | 'c', 'a'>
// Distributes to:
//   ('a' extends 'a' ? never : 'a') |  → never
//   ('b' extends 'a' ? never : 'b') |  → 'b'
//   ('c' extends 'a' ? never : 'c')    → 'c'
// = never | 'b' | 'c'
// = 'b' | 'c'

// Preventing distribution:
type NoDistribute<T, U> = [T] extends [U] ? true : false;
type Test = NoDistribute<string | number, string>; // false (the whole union is checked)
```

**Key takeaways:**
- Distribution only happens with **naked** (unwrapped) type parameters
- Wrapping in `[]` prevents distribution
- This is why `Exclude`, `Extract`, `NonNullable` work on unions

**Confidence:** 2/5 → after study: 5/5

---

## Template

```markdown
## Entry N

**Date:**
**Company:**
**Question:**

**What I said:**

**What went wrong:**

**Correct answer:**

```typescript
// code here
```

**Key takeaways:**

**Confidence:** /5 → after study: /5
```
