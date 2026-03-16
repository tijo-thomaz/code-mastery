# M3: TypeScript

> **Read → Drill → Trap Questions**
> **Time:** 30 min total

---

## SECTION A: Concepts to Explain Out Loud

---

### 1. interface vs type
> Interface: object shapes, extendable, declaration-mergeable. Type: unions, intersections, computed types. Interface for props/API contracts, type for unions and utility combos.

### 2. Generics
> `<T>` = type parameter. Reusable without losing type safety. Constraints with `extends`. Example: `function fetch<T>(url: string): Promise<T>`.

### 3. Utility Types (know ALL 6)
| Type | What | When |
|------|------|------|
| `Partial<T>` | All props optional | Update/PATCH payloads |
| `Required<T>` | All props required | Form validation |
| `Pick<T, K>` | Select props | Component needs subset |
| `Omit<T, K>` | Exclude props | Remove internal fields |
| `Record<K, V>` | Object type | Maps, lookup tables |
| `Readonly<T>` | Immutable | Config objects, constants |

### 4. Discriminated Unions
> Shared literal field (`type`, `status`, `kind`) + switch/narrowing. Type-safe state machines.

### 5. unknown vs any vs never
> `any` = no checking. `unknown` = must narrow first. `never` = impossible state, exhaustive checks.

### 6. `satisfies` keyword (TS 4.9+)
> Validates type without widening. `const config = {...} satisfies Config` — keeps literal types but checks structure.

---

## SECTION B: 🪤 TRAP QUESTIONS

---

### TRAP 1: Type widening
```ts
let status = 'loading'; // type: string ← widened!
const status2 = 'loading'; // type: "loading" ← literal type

// Fix:
let status: 'loading' | 'error' | 'success' = 'loading';
// or
let status = 'loading' as const;
```

---

### TRAP 2: Object.keys returns string[]
```ts
const user = { name: 'Tijo', age: 30 };
Object.keys(user).forEach(key => {
  console.log(user[key]); // ❌ Error: no index signature
});

// Fix:
(Object.keys(user) as Array<keyof typeof user>).forEach(key => {
  console.log(user[key]); // ✅
});
```

**Why?** TypeScript can't guarantee the object doesn't have extra keys at runtime. Object.keys returns `string[]` by design.

---

### TRAP 3: optional vs undefined
```ts
interface User {
  name: string;
  age?: number;       // age is number | undefined, AND the key can be missing
}

interface User2 {
  name: string;
  age: number | undefined;  // key MUST exist, value can be undefined
}

const u: User = { name: 'Tijo' };          // ✅ age key missing
const u2: User2 = { name: 'Tijo' };        // ❌ age key required
const u3: User2 = { name: 'Tijo', age: undefined }; // ✅
```

---

### TRAP 4: Excess property checking
```ts
interface Props { name: string; }

// Direct literal — excess check triggers
const p: Props = { name: 'Tijo', age: 30 }; // ❌ Error: age not in Props

// Via variable — no excess check
const obj = { name: 'Tijo', age: 30 };
const p2: Props = obj; // ✅ No error — structural typing, obj satisfies Props
```

---

### TRAP 5: enums vs union types
```ts
// Enum — generates runtime code, can be iterated
enum Status { Active, Inactive }

// Union — zero runtime cost, just types
type Status = 'active' | 'inactive';
```
**Recommendation:** Use unions. Enums generate JavaScript code, add bundle size, have numeric value gotchas. Unions are simpler and tree-shakeable.

---

### TRAP 6: readonly is shallow
```ts
interface Config {
  readonly settings: {
    theme: string;
  };
}

const c: Config = { settings: { theme: 'dark' } };
c.settings = { theme: 'light' }; // ❌ Error — readonly
c.settings.theme = 'light';      // ✅ Allowed! readonly is shallow
```

**Fix:** Use `as const` for deep readonly, or create `DeepReadonly<T>` utility type.

---

## SECTION C: Hands-On Drill (10 min)

### 1. Type an API response
```ts
// Type this: GET /api/users returns paginated users
type User = {
  // define it
};

type ApiResponse<T> = {
  // data, total, page, per_page, status
};

// Usage: ApiResponse<User>
```

### 2. Discriminated union for fetch state
```ts
type FetchState<T> =
  | // loading
  | // success with data
  | // error with message

// Write a function that handles all 3 states with switch
```

### 3. Pick and Omit usage
```ts
type User = { id: string; name: string; email: string; password: string; };

type PublicUser = // Omit password
type CreateUser = // Omit id (server generates it)
type UserPreview = // Pick only id and name
```

---

## ✅ Checklist

- [ ] Can explain interface vs type, generics, utility types, discriminated unions
- [ ] Can solve all 6 trap questions
- [ ] Can type an API response with generics from memory
- [ ] Know the difference between optional prop vs `undefined` value
- [ ] Know why `Object.keys` returns `string[]`
