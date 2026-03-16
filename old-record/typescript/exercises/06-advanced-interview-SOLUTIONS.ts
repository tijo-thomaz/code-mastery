/**
 * ═══════════════════════════════════════════════════════════════════
 * 06 — TypeScript Advanced Interview Drills — SOLUTIONS
 * ═══════════════════════════════════════════════════════════════════
 * EXPERION ROUND 2 — Type inference, annotations, utility types.
 * 🧠 Read → Close → Write from memory → Repeat until automatic.
 * ═══════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// SECTION A: Type Inference vs Type Annotation
// "Do you always need to annotate types?" — They want NUANCE
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// A1 ⭐ | When TS Infers vs When You Must Annotate
// ───────────────────────────────────────────────────────────────

// ✅ TS INFERS — no annotation needed
let name1 = "Tijo";                     // string
const age = 25;                          // literal 25 (const narrows)
const nums = [1, 2, 3];                 // number[]
const user1 = { name: "Tijo", age: 25 }; // { name: string; age: number }
const double = (x: number) => x * 2;    // return type inferred as number

// ❌ MUST ANNOTATE — TS can't infer
let result: string | number;                    // uninitialized — TS doesn't know
function greet(name: string): string {           // params ALWAYS need types
  return `Hi ${name}`;
}
const items: string[] = [];                      // empty array — TS can't know element type
// const res: User = await fetchUser(id);        // complex API return types

// 🔥 SAY THIS: "I annotate function parameters — that's required. For
// return types, I let TS infer unless it's a public API or the inferred
// type is too wide. Over-annotating is a code smell — trust the compiler."


// ───────────────────────────────────────────────────────────────
// A2 ⭐⭐ | Function Return Type: Infer vs Explicit
// ───────────────────────────────────────────────────────────────

// TS infers return type:
function add(a: number, b: number) {
  return a + b;  // inferred: number
}

// When to add explicit return type:
interface User { id: number; name: string; email: string; role: string }

// 1. Public API / exported functions — prevents accidental changes
function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// 2. Recursive functions — TS sometimes needs help
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 3. When inferred type is too wide
function getStatus(): "active" | "inactive" {
  return Math.random() > 0.5 ? "active" : "inactive";
  // Without annotation: inferred as string (too wide)
}

// 🔥 SAY THIS: "I add explicit return types for exported/public functions,
// recursive functions, and when I need a narrower type than what TS infers.
// For internal/private functions, I let TS infer."


// ───────────────────────────────────────────────────────────────
// A3 ⭐⭐ | Generic Inference — TS Infers T From Arguments
// ───────────────────────────────────────────────────────────────

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);      // T inferred as number, returns number | undefined
first(["a", "b"]);     // T inferred as string

// Generic with constraint — keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const u = { name: "Tijo", age: 25 };
const n = getProperty(u, "name"); // string — TS knows!
// getProperty(u, "foo");          // ❌ Error: "foo" not in keyof { name; age }

// Generic with default
function createState<T = string>(initial: T) {
  let state = initial;
  return {
    get: () => state,
    set: (v: T) => { state = v; },
  };
}

// 🔥 SAY THIS: "Generics let TS infer types from arguments — I rarely
// need to specify T manually. keyof T constrains keys to valid properties.
// This gives you autocompletion AND compile-time safety."


// ───────────────────────────────────────────────────────────────
// A4 ⭐⭐ | const Assertions — Narrow to Literal Types
// ───────────────────────────────────────────────────────────────

// Without as const:
const colors1 = ["red", "green", "blue"];          // string[]
const config1 = { api: "https://api.com", port: 3000 }; // { api: string; port: number }

// With as const:
const colors2 = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"]

type Color = (typeof colors2)[number]; // "red" | "green" | "blue"

const config2 = { api: "https://api.com", port: 3000 } as const;
// { readonly api: "https://api.com"; readonly port: 3000 }

// Real use case: route definitions
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  DASHBOARD: "/dashboard",
} as const;
type Route = (typeof ROUTES)[keyof typeof ROUTES]; // "/" | "/about" | "/dashboard"

// 🔥 SAY THIS: "as const narrows values to their literal types and makes
// everything readonly. I use it for config objects, route definitions,
// and enum-like constants. Combined with typeof, it creates union types
// from the values — no need for actual enums."


// ───────────────────────────────────────────────────────────────
// A5 ⭐⭐ | satisfies Operator (TS 4.9+)
// ───────────────────────────────────────────────────────────────

type ColorMap = Record<string, [number, number, number] | string>;

// ❌ Type annotation — LOSES literal types
const colorsAnnotated: ColorMap = {
  red: [255, 0, 0],
  white: "#fff",
};
// colorsAnnotated.red → [number, number, number] | string  (lost the tuple!)

// ✅ satisfies — validates AND keeps literal types
const colorsSatisfies = {
  red: [255, 0, 0],
  white: "#fff",
} satisfies ColorMap;
// colorsSatisfies.red   → [number, number, number]  (exact!)
// colorsSatisfies.white → string  (exact!)

// Real use case: app config
type AppConfig = Record<string, string | number | boolean>;
const appConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  debug: false,
} satisfies AppConfig;
// appConfig.timeout → number (not string | number | boolean)

// 🔥 SAY THIS: "satisfies validates that an object matches a type WITHOUT
// widening it. Type annotation says 'treat this AS this type'. satisfies
// says 'check this matches, but keep the narrow types'. It's perfect for
// configs and lookup objects where you want validation AND autocomplete."


// ═══════════════════════════════════════════════════════════════
// SECTION B: Build Utility Types From Scratch — SOLUTIONS
// "Implement Partial from scratch" = #1 TS interview question
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// B1 ⭐⭐ | MyPartial<T> — Make all properties optional
// ───────────────────────────────────────────────────────────────
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
// keyof T = union of all keys. [K in keyof T] iterates.  ? makes optional.

type B1_Test = MyPartial<{ name: string; age: number }>;
const b1: B1_Test = {};             // ✅ all optional
const b1b: B1_Test = { name: "hi" }; // ✅ partial

// ───────────────────────────────────────────────────────────────
// B2 ⭐⭐ | MyRequired<T> — Make all properties required
// ───────────────────────────────────────────────────────────────
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
  //             ^^ -? REMOVES optionality
};

// ───────────────────────────────────────────────────────────────
// B3 ⭐⭐ | MyReadonly<T> — Make all properties readonly
// ───────────────────────────────────────────────────────────────
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// ───────────────────────────────────────────────────────────────
// B4 ⭐⭐ | MyPick<T, K> — Pick specific keys from T
// ───────────────────────────────────────────────────────────────
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
// K extends keyof T = K must be valid keys of T

type B4_Test = MyPick<User, "id" | "name">;
// { id: number; name: string }

// ───────────────────────────────────────────────────────────────
// B5 ⭐⭐⭐ | MyOmit<T, K> — Remove specific keys from T
// ───────────────────────────────────────────────────────────────
// Version 1: Using Pick + Exclude
type MyOmit1<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Version 2: From scratch using key remapping (TS 4.1+)
type MyOmit2<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
// as P extends K ? never : P → if key is in K, remap to never (remove it)

type B5_Test = MyOmit1<User, "email">;
// { id: number; name: string; role: string }

// ───────────────────────────────────────────────────────────────
// B6 ⭐⭐ | MyRecord<K, V> — Object type with keys K, values V
// ───────────────────────────────────────────────────────────────
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V;
};

const roles: MyRecord<"admin" | "editor" | "viewer", number> = {
  admin: 1, editor: 2, viewer: 3,
};

// ───────────────────────────────────────────────────────────────
// B7 ⭐⭐ | MyExclude<T, U> — Remove types from union
// ───────────────────────────────────────────────────────────────
type MyExclude<T, U> = T extends U ? never : T;
// Distributive conditional type: TS applies this to EACH member of union T
// "a" | "b" | "c" excludes "a" → never | "b" | "c" → "b" | "c"

type B7_Test = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"

// ───────────────────────────────────────────────────────────────
// B8 ⭐⭐ | MyExtract<T, U> — Keep matching types from union
// ───────────────────────────────────────────────────────────────
type MyExtract<T, U> = T extends U ? T : never;

type B8_Test = MyExtract<string | number | boolean, string | boolean>;
// string | boolean

// ───────────────────────────────────────────────────────────────
// B9 ⭐⭐⭐ | MyReturnType<T> — Extract function return type
// ───────────────────────────────────────────────────────────────
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never;
// infer R = "capture whatever the return type is into R"

type B9_Test = MyReturnType<() => string>;   // string
type B9_Test2 = MyReturnType<(x: number) => boolean>; // boolean

// ───────────────────────────────────────────────────────────────
// B10 ⭐⭐ | MyNonNullable<T> — Remove null and undefined
// ───────────────────────────────────────────────────────────────
type MyNonNullable<T> = T extends null | undefined ? never : T;

type B10_Test = MyNonNullable<string | null | undefined>; // string

// 🔥 SAY THIS: "Mapped types iterate over keys: [K in keyof T].
// Conditional types distribute over unions: T extends U ? A : B.
// infer captures a type variable during pattern matching.
// These three concepts are the building blocks of ALL utility types."


// ═══════════════════════════════════════════════════════════════
// SECTION C: Advanced Type Patterns — SOLUTIONS
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// C1 ⭐⭐⭐ | Discriminated Unions + Exhaustive Switch
// ───────────────────────────────────────────────────────────────
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // Exhaustive check — if you add a new shape and forget to handle it,
      // TS errors here because the new shape can't be assigned to `never`
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Real-world: API response state machine
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function renderState(state: RequestState<string[]>) {
  switch (state.status) {
    case "idle":    return "Ready";
    case "loading": return "Loading...";
    case "success": return state.data.join(", "); // TS knows data exists!
    case "error":   return `Error: ${state.error}`; // TS knows error exists!
  }
}

// 🔥 SAY THIS: "Discriminated unions use a literal property as the
// discriminant. TS narrows the type in each case branch. The never
// check in default catches missing cases at compile time — if I add
// a new variant, the code won't compile until I handle it."


// ───────────────────────────────────────────────────────────────
// C2 ⭐⭐ | Type Guards — is keyword, assertion functions
// ───────────────────────────────────────────────────────────────

// Type predicate: value is Type
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Property check guard
function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

// Assertion function: asserts value is Type
function assertDefined<T>(
  val: T,
  msg = "Value is nullish"
): asserts val is NonNullable<T> {
  if (val === null || val === undefined) throw new Error(msg);
}

// Usage:
function processInput(input: unknown) {
  if (isString(input)) {
    console.log(input.toUpperCase()); // TS knows it's string here
  }
  if (hasProperty(input, "name")) {
    console.log(input.name); // TS knows name exists
  }
}

function getUser(): User | null { return null; }
const maybeUser = getUser();
assertDefined(maybeUser, "User not found");
// After assertion, maybeUser is User (not null)

// 🔥 SAY THIS: "Type guards narrow types at runtime. The 'is' keyword
// tells TS what type a value is after the check. Assertion functions
// use 'asserts' — they throw or narrow. I use them at API boundaries
// to validate unknown data and narrow it to known types."


// ───────────────────────────────────────────────────────────────
// C3 ⭐⭐⭐ | Generic React Component — List<T>
// ───────────────────────────────────────────────────────────────

// import React from "react"; // In a real project

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => any; // React.ReactNode in real code
  keyExtractor: (item: T) => string | number;
};

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return items.map(item => ({
    key: keyExtractor(item),
    content: renderItem(item),
  }));
}

// Usage — TS infers T = User from items!
// <List items={users} renderItem={u => u.name} keyExtractor={u => u.id} />
// u is typed as User — no manual generic needed

// 🔥 SAY THIS: "Generic components infer T from props. The consumer
// doesn't need to specify <List<User>> — TS infers it from the items
// prop. This gives you type-safe renderItem and keyExtractor callbacks."


// ───────────────────────────────────────────────────────────────
// C4 ⭐⭐⭐ | Conditional Types with infer
// ───────────────────────────────────────────────────────────────

// Extract element type from array
type Flatten<T> = T extends (infer U)[] ? U : T;
type F1 = Flatten<string[]>;   // string
type F2 = Flatten<number>;     // number

// Unwrap Promise
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UP1 = UnpackPromise<Promise<string>>; // string
type UP2 = UnpackPromise<number>;          // number

// Deep unwrap nested Promises (recursive)
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;
type DA = DeepAwaited<Promise<Promise<Promise<number>>>>; // number

// Extract first argument type
type FirstArg<T extends (...args: any[]) => any> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never;
type FA = FirstArg<(name: string, age: number) => void>; // string

// Extract constructor parameters
type MyConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

// 🔥 SAY THIS: "infer lets you capture a type during pattern matching.
// 'T extends Promise<infer U>' means: if T is a Promise, capture what's
// inside as U. It's like regex capture groups but for types. This is
// how ReturnType, Parameters, and Awaited work internally."


// ───────────────────────────────────────────────────────────────
// C5 ⭐⭐⭐ | Template Literal Types
// ───────────────────────────────────────────────────────────────

type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/${string}`;
type APIRoute = `${HTTPMethod} ${Endpoint}`;
// "GET /users" ✅, "POST /login" ✅, "FOO /bar" ❌

// Getter/Setter pattern
type Getter<T extends string> = `get${Capitalize<T>}`;
type Setter<T extends string> = `set${Capitalize<T>}`;
type G = Getter<"name" | "age">; // "getName" | "getAge"

// 🔥 SAY THIS: "Template literal types combine string literal types with
// template syntax. Capitalize, Uppercase, Lowercase are built-in
// string manipulation types. I'd use these for typed event systems,
// API route definitions, or CSS property helpers."


// ───────────────────────────────────────────────────────────────
// C6 ⭐⭐⭐ | Advanced Mapped Types
// ───────────────────────────────────────────────────────────────

// Remove readonly (opposite of Readonly)
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Make everything readonly EXCEPT specific keys
type ReadonlyExcept<T, K extends keyof T> =
  Readonly<Omit<T, K>> & Pick<T, K>;

// Extract optional keys
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Pick properties by value type
type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type StringProps = PickByType<User, string>; // { name: string; email: string; role: string }

// 🔥 SAY THIS: "Key remapping with 'as' lets you transform or filter
// keys during mapping. 'K as condition ? K : never' removes keys that
// don't match. '-readonly' and '-?' remove modifiers. These are the
// building blocks for any custom utility type."


// ───────────────────────────────────────────────────────────────
// C7 ⭐⭐⭐ | Branded Types — USD vs EUR
// ───────────────────────────────────────────────────────────────

// Branded type pattern: nominal typing in a structural type system
type USD = number & { readonly __brand: unique symbol };
type EUR = number & { readonly __brand: unique symbol };

function usd(amount: number): USD { return amount as USD; }
function eur(amount: number): EUR { return amount as EUR; }

function chargeUSD(amount: USD): void {
  console.log(`Charged $${amount}`);
}

const price = usd(50);
chargeUSD(price);       // ✅ OK
// chargeUSD(eur(50));  // ❌ Error — EUR is not USD
// chargeUSD(50);       // ❌ Error — plain number is not USD

// Real use: UserId vs PostId (both are numbers but shouldn't mix)
type UserId = number & { readonly __brand: "UserId" };
type PostId = number & { readonly __brand: "PostId" };

// 🔥 SAY THIS: "TypeScript is structurally typed — two types with the
// same shape are compatible. Branded types add a phantom property to
// create nominal typing. USD and EUR are both numbers at runtime,
// but TS treats them as incompatible types. I use this for IDs,
// currencies, and validated strings like Email."


// ───────────────────────────────────────────────────────────────
// C8 ⭐⭐⭐⭐ | DeepPartial & DeepReadonly (Recursive)
// ───────────────────────────────────────────────────────────────

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// Test:
type Config = { db: { host: string; port: number }; cache: { ttl: number } };
type PartialConfig = DeepPartial<Config>;
const pc: PartialConfig = { db: { host: "localhost" } }; // ✅ port + cache missing — OK

// 🔥 SAY THIS: "DeepPartial recurses into nested objects — the built-in
// Partial only works one level deep. The pattern: check if T is an object,
// if so recurse, otherwise return T as-is (base case). Same pattern for
// DeepReadonly, DeepRequired, etc."


// ═══════════════════════════════════════════════════════════════
// SECTION D: any vs unknown vs never — The Mental Model
// "What's the difference?" — asked EVERY interview
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// D1-D5 | Type Algebra — What Do These Resolve To?
// ───────────────────────────────────────────────────────────────

// INTERSECTION (&) = AND — must satisfy BOTH
type D1 = string & number;     // never    (nothing is both string AND number)
type D3 = string & unknown;    // string   (unknown is universal set — & preserves)
type D5 = string & any;        // any      (any breaks the type system)

// UNION (|) = OR — satisfies EITHER
type D2 = string | never;      // string   (never is empty set — | with empty = same)
type D4 = string | unknown;    // unknown  (unknown is universal — | with universal = universal)

// never extends anything
type D6 = never extends string ? true : false; // true (never extends everything)

// ───────────────────────────────────────────────────────────────
// THE MENTAL MODEL — Memorize This Table
// ───────────────────────────────────────────────────────────────
//
// TYPE      | ASSIGNABLE TO         | THINGS ASSIGNABLE TO IT | USE WHEN
// ──────────|───────────────────────|─────────────────────────|──────────────────
// any       | EVERYTHING            | EVERYTHING              | Escape hatch (avoid!)
// unknown   | NOTHING (must narrow) | EVERYTHING              | Safe "I don't know yet"
// never     | EVERYTHING            | NOTHING                 | Impossible/exhaustive
//
// any     = "I don't care about types" → turns off type checking
// unknown = "I don't know the type YET" → must narrow before use
// never   = "This should never happen"  → exhaustive checks, impossible states
//
// ───────────────────────────────────────────────────────────────

// Practical examples:
function handleUnknown(input: unknown) {
  // input.toUpperCase(); // ❌ Error — must narrow first!
  if (typeof input === "string") {
    input.toUpperCase();  // ✅ narrowed to string
  }
}

function handleAny(input: any) {
  input.toUpperCase();  // No error — but UNSAFE! Could crash at runtime
}

// never: function that never returns
function throwError(msg: string): never {
  throw new Error(msg);
}

// never: exhaustive check
type Status = "active" | "inactive";
function handleStatus(s: Status) {
  switch (s) {
    case "active": return "✅";
    case "inactive": return "❌";
    default: const _: never = s; return _; // If new status added, TS errors here
  }
}

// 🔥 SAY THIS: "any opts out of type checking — avoid it. unknown is the
// safe alternative — it accepts anything but forces you to narrow before
// use. never represents impossible states — I use it for exhaustive
// switch checks. If I add a new variant and forget to handle it,
// TS errors at compile time."


// ═══════════════════════════════════════════════════════════════
// SECTION E: Real-World TypeScript in React
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// E1 ⭐⭐ | Typing Component Props with Children
// ───────────────────────────────────────────────────────────────

// Method 1: explicit children
type CardProps = {
  title: string;
  children: React.ReactNode; // accepts anything renderable
};

// Method 2: PropsWithChildren helper
// type CardProps = React.PropsWithChildren<{ title: string }>;

// ReactNode vs ReactElement:
// ReactNode = string | number | boolean | null | undefined | ReactElement | ReactFragment
// ReactElement = <div />, <Component /> — actual JSX elements only
// Use ReactNode for children (most permissive)

// ───────────────────────────────────────────────────────────────
// E2 ⭐⭐ | Typing Event Handlers
// ───────────────────────────────────────────────────────────────

// Input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value; // string
};

// Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// Button click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.textContent);
};

// Keyboard
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") { /* submit */ }
};

// 🔥 SAY THIS: "React event types follow the pattern:
// React.[Event]Event<HTMLElementType>. ChangeEvent for inputs,
// FormEvent for forms, MouseEvent for clicks, KeyboardEvent for keys.
// The generic parameter is the DOM element type."

// ───────────────────────────────────────────────────────────────
// E3 ⭐⭐⭐ | Typing a Generic Custom Hook
// ───────────────────────────────────────────────────────────────

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T>(url: string): FetchState<T> {
  // const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });
  // useEffect(() => { ... fetch and setState ... }, [url]);
  return { data: null, loading: true, error: null }; // placeholder
}

// Usage:
// const { data, loading, error } = useFetch<User[]>("/api/users");
// data is User[] | null — TS knows!

// ───────────────────────────────────────────────────────────────
// E4 ⭐⭐⭐ | Typing Context — The Safe Pattern
// ───────────────────────────────────────────────────────────────

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Pattern: createContext with null, custom hook throws if missing
// const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  // const ctx = useContext(AuthContext);
  // if (!ctx) throw new Error("useAuth must be within AuthProvider");
  // return ctx;
  return {} as AuthContextType; // placeholder
}

// 🔥 SAY THIS: "I create context with null as default and use a custom
// hook that throws if used outside the provider. This avoids the ugly
// undefined checks everywhere — any component using useAuth() is
// guaranteed to have the full AuthContextType."

// ───────────────────────────────────────────────────────────────
// E5 ⭐⭐⭐⭐ | Polymorphic Component — as prop
// ───────────────────────────────────────────────────────────────

// A component that can render as any HTML element
type BoxProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "children">;

function Box<C extends React.ElementType = "div">({
  as,
  children,
  ...props
}: BoxProps<C>) {
  const Component = as || "div";
  // return <Component {...props}>{children}</Component>;
}

// Usage:
// <Box as="a" href="/about">Link</Box>
// → TS knows href is valid because 'a' has href
// <Box as="button" onClick={handleClick}>Click</Box>
// → TS knows onClick is valid because 'button' has onClick
// <Box as="a" href={5}>Link</Box>
// → ❌ Error: href must be string for <a>

// 🔥 SAY THIS: "Polymorphic components accept an 'as' prop to change
// the rendered element. The key is: ComponentPropsWithoutRef<C> gives
// you the correct props for whatever element C is. So if as='a',
// you get href, target, etc. If as='button', you get onClick, type, etc.
// This is how Chakra UI and MUI's Box component work."


// ═══════════════════════════════════════════════════════════════
//  SUMMARY — All 28 Drills
// ═══════════════════════════════════════════════════════════════
//
//  SECTION A: Inference vs Annotation (5)
//    A1 When TS infers vs must annotate
//    A2 Function return type inference
//    A3 Generic inference from arguments
//    A4 const assertions — literal types
//    A5 satisfies operator
//
//  SECTION B: Utility Types From Scratch (10)
//    B1  MyPartial     B2  MyRequired   B3  MyReadonly
//    B4  MyPick        B5  MyOmit       B6  MyRecord
//    B7  MyExclude     B8  MyExtract    B9  MyReturnType
//    B10 MyNonNullable
//
//  SECTION C: Advanced Patterns (8)
//    C1 Discriminated Unions + exhaustive switch
//    C2 Type Guards (is, asserts)
//    C3 Generic React Component
//    C4 Conditional Types + infer
//    C5 Template Literal Types
//    C6 Mapped Types (Mutable, PickByType, OptionalKeys)
//    C7 Branded Types (USD vs EUR)
//    C8 DeepPartial & DeepReadonly
//
//  SECTION D: any vs unknown vs never (5 drills in one)
//
//  SECTION E: React + TypeScript (5)
//    E1 Props with children
//    E2 Event handlers
//    E3 Generic useFetch hook
//    E4 Context typing
//    E5 Polymorphic component (as prop)
//
// ═══════════════════════════════════════════════════════════════
//
//  🎯 PRIORITY FOR TONIGHT:
//    1. Section B — Utility types from scratch (MOST ASKED)
//    2. Section D — any/unknown/never (asked EVERY interview)
//    3. Section C1-C2 — Discriminated unions + type guards
//    4. Section A — Inference fundamentals
//    5. Section E — React typing (practical)
//
// ═══════════════════════════════════════════════════════════════

export {};
