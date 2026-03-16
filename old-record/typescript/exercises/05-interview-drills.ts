/**
 * 05 — TypeScript Interview Drills (2026 Trending)
 *
 * These are the ACTUAL TS questions interviewers ask.
 * The compiler IS the test — if it compiles, you got it right.
 *
 * Sections:
 *   A. Build Utility Types From Scratch (most asked!)
 *   B. Conditional Types + infer
 *   C. Template Literal Types (trending 2025-2026)
 *   D. Mapped Types + Key Remapping
 *   E. Type Narrowing & Type Guards
 *   F. any vs unknown vs never (tricky output questions)
 *   G. Const Assertions, satisfies, Branded Types
 *   H. Real-World Typing Challenges
 *
 * Rules:
 *   1. Each TODO has a @ts-expect-error test below it
 *   2. If your type is correct, the @ts-expect-error lines stay valid
 *   3. The "// OK" lines must NOT error
 *   4. Do NOT use built-in utility types unless told to
 */

// ============================================================================
// Section A — Build Utility Types From Scratch
// "Implement Partial from scratch" is the #1 TS interview question
// ============================================================================

// A1 — MyPartial<T> ⏱️ 30s ⭐⭐
// Make all properties optional.
// TODO: implement
type MyPartial<T> = any;

// Tests:
type A1_Test = MyPartial<{ name: string; age: number }>;
const a1: A1_Test = {};             // OK — all optional
const a1b: A1_Test = { name: "hi" }; // OK — partial

// A2 — MyRequired<T> ⏱️ 30s ⭐⭐
// Make all properties required. Hint: -? removes optionality.
// TODO: implement
type MyRequired<T> = any;

// Tests:
type A2_Test = MyRequired<{ name?: string; age?: number }>;
// @ts-expect-error — missing 'age'
const a2: A2_Test = { name: "hi" };

// A3 — MyReadonly<T> ⏱️ 30s ⭐⭐
// Make all properties readonly.
// TODO: implement
type MyReadonly<T> = any;

// Tests:
const a3: MyReadonly<{ name: string }> = { name: "hi" };
// @ts-expect-error — readonly
a3.name = "bye";

// A4 — MyPick<T, K> ⏱️ 45s ⭐⭐
// Pick only the specified keys from T.
// TODO: implement
type MyPick<T, K extends keyof T> = any;

// Tests:
type A4_Test = MyPick<{ id: number; name: string; email: string }, "id" | "name">;
const a4: A4_Test = { id: 1, name: "Tijo" };  // OK
// @ts-expect-error — email not picked
const a4b: A4_Test = { id: 1, name: "Tijo", email: "x" };

// A5 — MyOmit<T, K> ⏱️ 60s ⭐⭐⭐
// Remove the specified keys from T.
// TODO: implement (Hint: use MyPick + Exclude)
type MyOmit<T, K extends keyof T> = any;

// Tests:
type A5_Test = MyOmit<{ id: number; name: string; email: string }, "email">;
const a5: A5_Test = { id: 1, name: "Tijo" };  // OK
// @ts-expect-error — email was omitted
const a5b: A5_Test = { id: 1, name: "Tijo", email: "x" };

// A6 — MyRecord<K, V> ⏱️ 30s ⭐⭐
// Create an object type with keys K and values V.
// TODO: implement
type MyRecord<K extends string, V> = any;

// Tests:
const a6: MyRecord<"a" | "b", number> = { a: 1, b: 2 };  // OK
// @ts-expect-error — missing 'b'
const a6b: MyRecord<"a" | "b", number> = { a: 1 };

// A7 — MyExclude<T, U> ⏱️ 30s ⭐⭐
// Remove types from union T that are assignable to U.
// TODO: implement (Hint: conditional type distribution)
type MyExclude<T, U> = any;

// Tests:
type A7_Test = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"
const a7: A7_Test = "b";  // OK
// @ts-expect-error — "a" was excluded
const a7b: A7_Test = "a";

// A8 — MyExtract<T, U> ⏱️ 30s ⭐⭐
// Keep only types from union T that are assignable to U.
// TODO: implement
type MyExtract<T, U> = any;

// Tests:
type A8_Test = MyExtract<string | number | boolean, string | boolean>;  // string | boolean
const a8: A8_Test = "hello";  // OK
// @ts-expect-error — number was not extracted
const a8b: A8_Test = 42;

// A9 — MyReturnType<T> ⏱️ 60s ⭐⭐⭐
// Extract the return type of a function type.
// TODO: implement (Hint: use infer)
type MyReturnType<T extends (...args: any[]) => any> = any;

// Tests:
type A9_Test = MyReturnType<() => string>;  // string
const a9: A9_Test = "hello";  // OK
// @ts-expect-error — should be string, not number
const a9b: A9_Test = 42;

// A10 — MyParameters<T> ⏱️ 60s ⭐⭐⭐
// Extract the parameter types as a tuple.
// TODO: implement (Hint: use infer)
type MyParameters<T extends (...args: any[]) => any> = any;

// Tests:
type A10_Test = MyParameters<(a: string, b: number) => void>;  // [string, number]
const a10: A10_Test = ["hello", 42];  // OK
// @ts-expect-error — wrong types
const a10b: A10_Test = [42, "hello"];

// A11 — MyNonNullable<T> ⏱️ 30s ⭐⭐
// Remove null and undefined from T.
// TODO: implement
type MyNonNullable<T> = any;

// Tests:
type A11_Test = MyNonNullable<string | null | undefined>;  // string
const a11: A11_Test = "hello";  // OK
// @ts-expect-error
const a11b: A11_Test = null;

// A12 — DeepPartial<T> 🔥 ⏱️ 90s ⭐⭐⭐⭐
// Make ALL nested properties optional (recursive).
// TODO: implement
type DeepPartial<T> = any;

// Tests:
type A12_Config = { db: { host: string; port: number }; cache: { ttl: number } };
const a12: DeepPartial<A12_Config> = { db: { host: "localhost" } };  // OK — port missing, cache missing
const a12b: DeepPartial<A12_Config> = {};  // OK — everything optional

// A13 — DeepReadonly<T> 🔥 ⏱️ 90s ⭐⭐⭐⭐
// Make ALL nested properties readonly (recursive).
// TODO: implement
type DeepReadonly<T> = any;

// Tests:
const a13: DeepReadonly<{ a: { b: { c: number } } }> = { a: { b: { c: 1 } } };
// @ts-expect-error — deeply readonly
a13.a.b.c = 2;


// ============================================================================
// Section B — Conditional Types + infer
// "What does infer do?" — asked at every senior interview
// ============================================================================

// B1 — Flatten<T> ⏱️ 45s ⭐⭐
// If T is an array, extract the element type. Otherwise return T.
// Flatten<string[]> → string, Flatten<number> → number
// TODO: implement
type Flatten<T> = any;

// Tests:
type B1a = Flatten<string[]>;   // string
type B1b = Flatten<number[][]>; // number[]
type B1c = Flatten<number>;     // number
const b1a: B1a = "hello";  // OK
// @ts-expect-error
const b1ab: B1a = 42;

// B2 — UnpackPromise<T> ⏱️ 45s ⭐⭐
// Extract the resolved type from a Promise (one level).
// UnpackPromise<Promise<string>> → string
// TODO: implement
type UnpackPromise<T> = any;

// Tests:
type B2_Test = UnpackPromise<Promise<number>>;  // number
const b2: B2_Test = 42;  // OK
// @ts-expect-error
const b2b: B2_Test = "hello";

// B3 — DeepAwaited<T> 🔥 ⏱️ 60s ⭐⭐⭐
// Recursively unwrap nested Promises.
// DeepAwaited<Promise<Promise<string>>> → string
// TODO: implement
type DeepAwaited<T> = any;

// Tests:
type B3_Test = DeepAwaited<Promise<Promise<Promise<number>>>>;  // number
const b3: B3_Test = 42;  // OK
// @ts-expect-error
const b3b: B3_Test = Promise.resolve(42);

// B4 — FirstArg<T> ⏱️ 30s ⭐⭐
// Extract the type of the first argument of a function.
// TODO: implement
type FirstArg<T extends (...args: any[]) => any> = any;

// Tests:
type B4_Test = FirstArg<(name: string, age: number) => void>;  // string
const b4: B4_Test = "Tijo";  // OK
// @ts-expect-error
const b4b: B4_Test = 42;

// B5 — ConstructorParameters (from scratch) ⏱️ 60s ⭐⭐⭐
// Extract constructor parameter types as a tuple.
// TODO: implement
type MyConstructorParams<T extends abstract new (...args: any) => any> = any;

// Tests:
class B5_User { constructor(public name: string, public age: number) {} }
type B5_Test = MyConstructorParams<typeof B5_User>;  // [string, number]
const b5: B5_Test = ["Tijo", 25];  // OK
// @ts-expect-error
const b5b: B5_Test = [25, "Tijo"];

// B6 — IsNever<T> ⏱️ 60s ⭐⭐⭐
// Check if a type is never. Return true or false.
// Tricky! `never extends X` always returns never due to distribution.
// Hint: wrap in tuple to prevent distribution: [T] extends [never]
// TODO: implement
type IsNever<T> = any;

// Tests:
type B6a = IsNever<never>;    // true
type B6b = IsNever<string>;   // false
type B6c = IsNever<undefined>;// false
const b6a: B6a = true;   // OK
const b6b: B6b = false;  // OK


// ============================================================================
// Section C — Template Literal Types (trending 2025-2026)
// ============================================================================

// C1 — EventName<T> ⏱️ 45s ⭐⭐
// Given object keys, generate "on" + capitalized key event names.
// EventName<"click" | "hover"> → "onClick" | "onHover"
// TODO: implement
type EventName<T extends string> = any;

// Tests:
type C1_Test = EventName<"click" | "hover" | "focus">;
const c1a: C1_Test = "onClick";  // OK
const c1b: C1_Test = "onHover";  // OK
// @ts-expect-error
const c1c: C1_Test = "click";

// C2 — Getters<T> ⏱️ 60s ⭐⭐⭐
// For each property, create a getter: { getName: () => string; getAge: () => number }
// TODO: implement
type Getters<T> = any;

// Tests:
type C2_Test = Getters<{ name: string; age: number }>;
const c2: C2_Test = {
  getName: () => "Tijo",
  getAge: () => 25,
};

// C3 — ParseRoute<T> 🔥 ⏱️ 90s ⭐⭐⭐⭐
// Extract dynamic params from a route string.
// ParseRoute<"/users/:id/posts/:postId"> → "id" | "postId"
// TODO: implement
type ParseRoute<T extends string> = any;

// Tests:
type C3_Test = ParseRoute<"/users/:id/posts/:postId">;
const c3a: C3_Test = "id";      // OK
const c3b: C3_Test = "postId";  // OK
// @ts-expect-error
const c3c: C3_Test = "users";

// C4 — Split<S, D> ⏱️ 90s ⭐⭐⭐⭐
// Split a string literal by delimiter into a tuple.
// Split<"a.b.c", "."> → ["a", "b", "c"]
// TODO: implement
type Split<S extends string, D extends string> = any;

// Tests:
type C4_Test = Split<"hello.world.ts", ".">;  // ["hello", "world", "ts"]
const c4: C4_Test = ["hello", "world", "ts"];  // OK
// @ts-expect-error
const c4b: C4_Test = ["hello", "world"];


// ============================================================================
// Section D — Mapped Types + Key Remapping
// ============================================================================

// D1 — ReadonlyExcept<T, K> ⏱️ 60s ⭐⭐⭐
// Make everything readonly EXCEPT keys in K.
// TODO: implement
type ReadonlyExcept<T, K extends keyof T> = any;

// Tests:
type D1_User = { id: number; name: string; email: string };
const d1: ReadonlyExcept<D1_User, "email"> = { id: 1, name: "Tijo", email: "a@b.com" };
d1.email = "new@b.com";  // OK — email is mutable
// @ts-expect-error — id is readonly
d1.id = 2;

// D2 — Mutable<T> ⏱️ 30s ⭐⭐
// Remove readonly from all properties. (Opposite of Readonly)
// Hint: -readonly
// TODO: implement
type Mutable<T> = any;

// Tests:
const d2: Mutable<{ readonly name: string }> = { name: "hi" };
d2.name = "bye";  // OK — no longer readonly

// D3 — OptionalKeys<T> ⏱️ 60s ⭐⭐⭐
// Extract the keys that are optional.
// TODO: implement
type OptionalKeys<T> = any;

// Tests:
type D3_Test = OptionalKeys<{ name: string; age?: number; email?: string }>;
const d3a: D3_Test = "age";    // OK
const d3b: D3_Test = "email";  // OK
// @ts-expect-error — name is required, not optional
const d3c: D3_Test = "name";

// D4 — PickByType<T, V> ⏱️ 60s ⭐⭐⭐
// Pick only properties whose value type matches V.
// TODO: implement
type PickByType<T, V> = any;

// Tests:
type D4_Test = PickByType<{ name: string; age: number; active: boolean; count: number }, number>;
const d4: D4_Test = { age: 25, count: 10 };  // OK — only number props
// @ts-expect-error — name is string, not number
const d4b: D4_Test = { age: 25, count: 10, name: "hi" };


// ============================================================================
// Section E — Type Narrowing & Type Guards
// Write RUNTIME code that narrows types correctly
// ============================================================================

// E1 — Type guard: isString ⏱️ 30s ⭐
// TODO: implement
function isString(value: unknown): value is string {
  // TODO
  return false;
}

// E2 — Type guard: hasProperty ⏱️ 45s ⭐⭐
// Check if unknown value has a specific property.
// TODO: implement
function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  // TODO
  return false;
}

// E3 — Assertion function ⏱️ 45s ⭐⭐
// Throw if value is nullish, otherwise narrow to NonNullable<T>.
// TODO: implement
function assertDefined<T>(value: T, message?: string): asserts value is NonNullable<T> {
  // TODO
}

// E4 — Discriminated union handler ⏱️ 60s ⭐⭐⭐
// Exhaustive switch with never check.
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

// TODO: implement — calculate area for each shape, exhaustive check in default
function getArea(shape: Shape): number {
  // TODO
  return 0;
}

// E5 — Narrow API response ⏱️ 60s ⭐⭐⭐
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string }
  | { status: "loading" };

// TODO: implement a type guard for success responses
function isSuccess<T>(response: ApiResponse<T>): response is { status: "success"; data: T } {
  // TODO
  return false;
}

// Usage should compile:
function handleResponse(res: ApiResponse<string[]>) {
  if (isSuccess(res)) {
    // res.data should be string[] here
    console.log(res.data.length);
  }
}


// ============================================================================
// Section F — any vs unknown vs never (Output Prediction)
// "What's the difference?" — asked EVERY interview
// ============================================================================

// F1 — What types does TypeScript infer? Fill in the blanks.
// TODO: replace `any` with the correct types
type F1_a = string & number;           // Answer type: TODO
type F1_b = string | never;            // Answer type: TODO
type F1_c = string & unknown;          // Answer type: TODO
type F1_d = string | unknown;          // Answer type: TODO
type F1_e = string & any;              // Answer type: TODO
type F1_f = never extends string ? true : false;  // Answer: TODO

// F2 — What are the key differences? (mental model)
// TODO: fill in as string literal types
type F2_Answer = {
  any_assignable_to: "everything" | "nothing" | "must narrow";     // TODO: pick one
  unknown_assignable_to: "everything" | "nothing" | "must narrow"; // TODO: pick one
  never_assignable_to: "everything" | "nothing" | "must narrow";   // TODO: pick one
};


// ============================================================================
// Section G — Const Assertions, satisfies, Branded Types
// ============================================================================

// G1 — as const ⏱️ 30s ⭐
// Fix this so routes has literal types, not string[].
// TODO: add const assertion
const routes = ["/home", "/about", "/contact"];
// After fix: typeof routes should be readonly ["/home", "/about", "/contact"]

// G2 — satisfies ⏱️ 45s ⭐⭐
// Validate the config matches the type WITHOUT losing literal types.
type AppConfig = Record<string, string | number>;
// TODO: add satisfies so config is validated but retains literal types
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  version: "1.0.0",
};
// After fix: typeof config.timeout should be number (not string | number)

// G3 — Branded Types ⏱️ 90s ⭐⭐⭐
// Create branded types so USD and EUR can't be mixed.
// TODO: define USD and EUR branded types
type USD = any;
type EUR = any;

// TODO: implement constructor functions
function usd(amount: number): USD {
  // TODO
  return amount as any;
}
function eur(amount: number): EUR {
  // TODO
  return amount as any;
}

// TODO: this should only accept USD, not EUR or plain number
function chargeUSD(amount: USD): void {
  console.log(`Charged $${amount}`);
}


// ============================================================================
// Section H — Real-World Typing Challenges
// ============================================================================

// H1 — Typed Object.keys ⏱️ 45s ⭐⭐
// Object.keys returns string[]. Write a typed version.
// TODO: implement
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  // TODO
  return [] as any;
}

// H2 — Typed Object.entries ⏱️ 60s ⭐⭐⭐
// TODO: implement
function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  // TODO
  return [] as any;
}

// H3 — Builder Pattern with Types ⏱️ 120s ⭐⭐⭐⭐
// Create a typed query builder. Each method should return the builder
// with updated types so .execute() knows the return shape.
// TODO: implement the QueryBuilder type and createQuery function
interface QueryBuilder<T extends Record<string, any>, Selected extends keyof T = never> {
  select<K extends keyof T>(...keys: K[]): QueryBuilder<T, Selected | K>;
  where(key: keyof T, value: T[keyof T]): QueryBuilder<T, Selected>;
  execute(): Pick<T, Selected>[];
}

// TODO: implement
function createQuery<T extends Record<string, any>>(): QueryBuilder<T> {
  // TODO
  return {} as any;
}

// Usage should compile:
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// const result = createQuery<User>()
//   .select("name", "email")
//   .where("age", 25)
//   .execute();
// result[0].name   // OK — string
// result[0].email  // OK — string
// result[0].age    // Error — not selected

// H4 — Strict Event Map ⏱️ 90s ⭐⭐⭐
// Create a typed event emitter where event names and payloads are enforced.
// TODO: implement
interface TypedEventMap {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  error: { message: string; code: number };
}

interface TypedEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
}

// TODO: implement
function createTypedEmitter<T extends Record<string, any>>(): TypedEmitter<T> {
  // TODO
  return {} as any;
}

// Usage should compile:
// const emitter = createTypedEmitter<TypedEventMap>();
// emitter.on("login", (payload) => {
//   console.log(payload.userId);    // OK
//   console.log(payload.timestamp); // OK
// });
// emitter.emit("login", { userId: "123", timestamp: new Date() }); // OK
// emitter.emit("login", { userId: "123" }); // Error — missing timestamp
