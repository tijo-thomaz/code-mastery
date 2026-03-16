/**
 * Solutions: 05 — TypeScript Interview Drills (2026 Trending)
 *
 * Every type and function implemented. Study the patterns.
 */

// ============================================================================
// Section A — Build Utility Types From Scratch
// ============================================================================

// A1 — MyPartial: mapped type + optional modifier
type MyPartial<T> = { [K in keyof T]?: T[K] };

// A2 — MyRequired: -? removes optionality
type MyRequired<T> = { [K in keyof T]-?: T[K] };

// A3 — MyReadonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// A4 — MyPick: iterate only over K
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// A5 — MyOmit: exclude K from keyof T, then pick the rest
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

// A6 — MyRecord: map string literals to value type
type MyRecord<K extends string, V> = { [P in K]: V };

// A7 — MyExclude: conditional type distribution
// When T is a union, it distributes: each member checked individually
type MyExclude<T, U> = T extends U ? never : T;

// A8 — MyExtract: opposite of Exclude
type MyExtract<T, U> = T extends U ? T : never;

// A9 — MyReturnType: infer captures the return type
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

// A10 — MyParameters: infer captures args as tuple
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

// A11 — MyNonNullable: exclude null and undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

// A12 — DeepPartial: recursive — check if object, then recurse
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

// A13 — DeepReadonly: recursive readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};

// Tests:
type A1_Test = MyPartial<{ name: string; age: number }>;
const a1: A1_Test = {};
const a1b: A1_Test = { name: "hi" };

type A2_Test = MyRequired<{ name?: string; age?: number }>;
// @ts-expect-error
const a2: A2_Test = { name: "hi" };

const a3: MyReadonly<{ name: string }> = { name: "hi" };
// @ts-expect-error
a3.name = "bye";

type A4_Test = MyPick<{ id: number; name: string; email: string }, "id" | "name">;
const a4: A4_Test = { id: 1, name: "Tijo" };
// @ts-expect-error
const a4b: A4_Test = { id: 1, name: "Tijo", email: "x" };

type A5_Test = MyOmit<{ id: number; name: string; email: string }, "email">;
const a5: A5_Test = { id: 1, name: "Tijo" };
// @ts-expect-error
const a5b: A5_Test = { id: 1, name: "Tijo", email: "x" };

const a6: MyRecord<"a" | "b", number> = { a: 1, b: 2 };
// @ts-expect-error
const a6b: MyRecord<"a" | "b", number> = { a: 1 };

type A7_Test = MyExclude<"a" | "b" | "c", "a">;
const a7: A7_Test = "b";
// @ts-expect-error
const a7b: A7_Test = "a";

type A8_Test = MyExtract<string | number | boolean, string | boolean>;
const a8: A8_Test = "hello";
// @ts-expect-error
const a8b: A8_Test = 42;

type A9_Test = MyReturnType<() => string>;
const a9: A9_Test = "hello";
// @ts-expect-error
const a9b: A9_Test = 42;

type A10_Test = MyParameters<(a: string, b: number) => void>;
const a10: A10_Test = ["hello", 42];
// @ts-expect-error
const a10b: A10_Test = [42, "hello"];

type A11_Test = MyNonNullable<string | null | undefined>;
const a11: A11_Test = "hello";
// @ts-expect-error
const a11b: A11_Test = null;

type A12_Config = { db: { host: string; port: number }; cache: { ttl: number } };
const a12: DeepPartial<A12_Config> = { db: { host: "localhost" } };
const a12b: DeepPartial<A12_Config> = {};

const a13: DeepReadonly<{ a: { b: { c: number } } }> = { a: { b: { c: 1 } } };
// @ts-expect-error
a13.a.b.c = 2;


// ============================================================================
// Section B — Conditional Types + infer
// ============================================================================

// B1 — Flatten: infer element from array
type Flatten<T> = T extends (infer U)[] ? U : T;

// B2 — UnpackPromise: infer from Promise
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// B3 — DeepAwaited: recursively unwrap Promise
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

// B4 — FirstArg: infer first param
type FirstArg<T extends (...args: any[]) => any> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

// B5 — ConstructorParameters: infer from new()
type MyConstructorParams<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;

// B6 — IsNever: wrap in tuple to prevent distribution over never
type IsNever<T> = [T] extends [never] ? true : false;

// Tests:
type B1a = Flatten<string[]>;
type B1b = Flatten<number[][]>;
type B1c = Flatten<number>;
const b1a: B1a = "hello";
// @ts-expect-error
const b1ab: B1a = 42;

type B2_Test = UnpackPromise<Promise<number>>;
const b2: B2_Test = 42;
// @ts-expect-error
const b2b: B2_Test = "hello";

type B3_Test = DeepAwaited<Promise<Promise<Promise<number>>>>;
const b3: B3_Test = 42;
// @ts-expect-error
const b3b: B3_Test = Promise.resolve(42);

type B4_Test = FirstArg<(name: string, age: number) => void>;
const b4: B4_Test = "Tijo";
// @ts-expect-error
const b4b: B4_Test = 42;

class B5_User { constructor(public name: string, public age: number) {} }
type B5_Test = MyConstructorParams<typeof B5_User>;
const b5: B5_Test = ["Tijo", 25];
// @ts-expect-error
const b5b: B5_Test = [25, "Tijo"];

type B6a = IsNever<never>;
type B6b = IsNever<string>;
type B6c = IsNever<undefined>;
const b6a: B6a = true;
const b6b: B6b = false;


// ============================================================================
// Section C — Template Literal Types
// ============================================================================

// C1 — EventName: template literal + Capitalize
type EventName<T extends string> = `on${Capitalize<T>}`;

// C2 — Getters: key remapping with template literals
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// C3 — ParseRoute: recursive template literal pattern matching
type ParseRoute<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ParseRoute<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

// C4 — Split: recursive string splitting
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S];

// Tests:
type C1_Test = EventName<"click" | "hover" | "focus">;
const c1a: C1_Test = "onClick";
const c1b: C1_Test = "onHover";
// @ts-expect-error
const c1c: C1_Test = "click";

type C2_Test = Getters<{ name: string; age: number }>;
const c2: C2_Test = {
  getName: () => "Tijo",
  getAge: () => 25,
};

type C3_Test = ParseRoute<"/users/:id/posts/:postId">;
const c3a: C3_Test = "id";
const c3b: C3_Test = "postId";
// @ts-expect-error
const c3c: C3_Test = "users";

type C4_Test = Split<"hello.world.ts", ".">;
const c4: C4_Test = ["hello", "world", "ts"];
// @ts-expect-error
const c4b: C4_Test = ["hello", "world"];


// ============================================================================
// Section D — Mapped Types + Key Remapping
// ============================================================================

// D1 — ReadonlyExcept: combine Readonly + mutable parts
type ReadonlyExcept<T, K extends keyof T> =
  { readonly [P in Exclude<keyof T, K>]: T[P] } &
  { [P in K]: T[P] };

// D2 — Mutable: -readonly removes readonly modifier
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// D3 — OptionalKeys: check if {} extends Pick<T, K> (optional keys allow empty)
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// D4 — PickByType: filter by value type using `as` key remapping
type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// Tests:
type D1_User = { id: number; name: string; email: string };
const d1: ReadonlyExcept<D1_User, "email"> = { id: 1, name: "Tijo", email: "a@b.com" };
d1.email = "new@b.com";
// @ts-expect-error
d1.id = 2;

const d2: Mutable<{ readonly name: string }> = { name: "hi" };
d2.name = "bye";

type D3_Test = OptionalKeys<{ name: string; age?: number; email?: string }>;
const d3a: D3_Test = "age";
const d3b: D3_Test = "email";
// @ts-expect-error
const d3c: D3_Test = "name";

type D4_Test = PickByType<{ name: string; age: number; active: boolean; count: number }, number>;
const d4: D4_Test = { age: 25, count: 10 };
// @ts-expect-error
const d4b: D4_Test = { age: 25, count: 10, name: "hi" };


// ============================================================================
// Section E — Type Narrowing & Type Guards
// ============================================================================

// E1 — isString
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// E2 — hasProperty: check object has key
function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

// E3 — assertDefined: throws if nullish
function assertDefined<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message ?? "Value is null or undefined");
  }
}

// E4 — getArea: exhaustive switch with never
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    case "triangle": return 0.5 * shape.base * shape.height;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// E5 — isSuccess type guard
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string }
  | { status: "loading" };

function isSuccess<T>(response: ApiResponse<T>): response is { status: "success"; data: T } {
  return response.status === "success";
}


// ============================================================================
// Section F — any vs unknown vs never
// ============================================================================

// F1 — Type results:
type F1_a = string & number;           // never (no overlap)
type F1_b = string | never;            // string (never disappears in unions)
type F1_c = string & unknown;          // string (unknown is identity for &)
type F1_d = string | unknown;          // unknown (unknown absorbs in unions)
type F1_e = string & any;              // any (any is infectious)
type F1_f = never extends string ? true : false;  // true (never extends everything)

// F2 — Key differences:
type F2_Answer = {
  any_assignable_to: "everything";   // any bypasses type system entirely
  unknown_assignable_to: "must narrow"; // must narrow before use
  never_assignable_to: "everything"; // never is subtype of all types (bottom type)
};


// ============================================================================
// Section G — Const Assertions, satisfies, Branded Types
// ============================================================================

// G1 — as const: creates readonly tuple with literal types
const routes = ["/home", "/about", "/contact"] as const;

// G2 — satisfies: validates type but keeps literal inference
type AppConfig = Record<string, string | number>;
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  version: "1.0.0",
} satisfies AppConfig;
// config.timeout is number, not string | number

// G3 — Branded types: intersection with unique symbol brand
type USD = number & { readonly __brand: unique symbol };
type EUR = number & { readonly __brand: unique symbol };

function usd(amount: number): USD { return amount as USD; }
function eur(amount: number): EUR { return amount as EUR; }

function chargeUSD(amount: USD): void {
  console.log(`Charged $${amount}`);
}

// chargeUSD(usd(10));  // OK
// chargeUSD(eur(10));  // Error — EUR is not USD
// chargeUSD(10);       // Error — number is not USD


// ============================================================================
// Section H — Real-World Typing Challenges
// ============================================================================

// H1 — typedKeys: Object.keys with proper types
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

// H2 — typedEntries: Object.entries with proper types
function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

// H3 — Builder pattern
interface QueryBuilder<T extends Record<string, any>, Selected extends keyof T = never> {
  select<K extends keyof T>(...keys: K[]): QueryBuilder<T, Selected | K>;
  where(key: keyof T, value: T[keyof T]): QueryBuilder<T, Selected>;
  execute(): Pick<T, Selected>[];
}

function createQuery<T extends Record<string, any>>(): QueryBuilder<T> {
  const selected: string[] = [];
  const conditions: [string, any][] = [];

  const builder: QueryBuilder<T, any> = {
    select(...keys: (keyof T)[]) {
      selected.push(...keys as string[]);
      return builder;
    },
    where(key: keyof T, value: any) {
      conditions.push([key as string, value]);
      return builder;
    },
    execute() {
      return [] as any; // runtime implementation would query data
    },
  };
  return builder as any;
}

// H4 — Typed Event Emitter
interface TypedEventMap {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  error: { message: string; code: number };
}

interface TypedEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
}

function createTypedEmitter<T extends Record<string, any>>(): TypedEmitter<T> {
  const handlers: Record<string, ((payload: any) => void)[]> = {};
  return {
    on(event, handler) {
      (handlers[event as string] ??= []).push(handler);
    },
    emit(event, payload) {
      (handlers[event as string] || []).forEach(fn => fn(payload));
    },
  };
}

// Verify it works:
const emitter = createTypedEmitter<TypedEventMap>();
emitter.on("login", (payload) => {
  console.log(payload.userId);
  console.log(payload.timestamp);
});
emitter.emit("login", { userId: "123", timestamp: new Date() });
