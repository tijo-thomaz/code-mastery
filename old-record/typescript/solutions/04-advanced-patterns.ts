/**
 * Solutions: 04 — Advanced Patterns
 *
 * Full solutions with explanations.
 */

// ============================================================================
// Exercise 1: Discriminated Unions
// ============================================================================

// Each variant shares a `kind` field with a unique literal type — the discriminant.
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };
type Shape = Circle | Rectangle | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // Exhaustiveness check: if we miss a case, `shape` won't be `never`
      // and this line will produce a compile error.
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function unwrapResult<T>(result: Result<T>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}

// ============================================================================
// Exercise 2: Type Guards (is / asserts)
// ============================================================================

interface Cat {
  kind: "cat";
  purr(): void;
}

interface Dog {
  kind: "dog";
  bark(): void;
}

type Animal = Cat | Dog;

// `animal is Cat` narrows the type in the calling scope when the function returns true.
function isCat(animal: Animal): animal is Cat {
  return animal.kind === "cat";
}

function isDog(animal: Animal): animal is Dog {
  return animal.kind === "dog";
}

// Assertion functions narrow the type for ALL subsequent code (not just a branch).
// If the assertion fails, it throws — so the code after it is guaranteed to be narrowed.
function assertDog(animal: Animal): asserts animal is Dog {
  if (animal.kind !== "dog") {
    throw new Error("Expected a dog");
  }
}

// Generic type guard for checking if an unknown value has a specific property.
function hasProperty<K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.purr(); // narrowed to Cat
  }
}

// ============================================================================
// Exercise 3: Function Overloads
// ============================================================================

// Overload signatures (what callers see):
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement;
// Implementation signature (must be compatible with all overloads):
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

function parse(input: string, asNumber: true): number;
function parse(input: string, asNumber: false): string;
function parse(input: string): string;
function parse(input: string, asNumber?: boolean): string | number {
  if (asNumber) {
    const num = Number(input);
    if (isNaN(num)) throw new Error(`Cannot parse "${input}" as number`);
    return num;
  }
  return input;
}

// ============================================================================
// Exercise 4: `satisfies` Operator (TS 5.0)
// ============================================================================

// `satisfies` validates the value against a type WITHOUT widening it.
// The variable retains its literal/specific types for downstream use.
type ColorMap = Record<string, [number, number, number] | string>;

const colors = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  white: "#ffffff",
  black: "#000000",
} satisfies ColorMap;

// TypeScript knows `colors.red` is `number[]` (tuple), not `string | number[]`.
const redChannel: number = colors.red[0];
// TypeScript knows `colors.white` is `string`, not `number[] | string`.
const whiteHex: string = colors.white;

const appConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} satisfies Record<string, string | number>;

// `appConfig.timeout` is `number`, not `string | number`.
const timeout: number = appConfig.timeout;

// ============================================================================
// Exercise 5: Const Type Parameters (TS 5.0)
// ============================================================================

// `const T` infers literal types automatically — no `as const` needed at the call site.
function asConst<const T>(value: T): T {
  return value;
}

// Without `const`: asConst({ x: 1 }) → { x: number }
// With `const`:    asConst({ x: 1 }) → { readonly x: 1 }
const literal = asConst({ x: 1, y: "hello" });
// literal.x is 1 (not number), literal.y is "hello" (not string)

function createRoutes<const T extends readonly { path: string; name: string }[]>(
  routes: T,
): T {
  return routes;
}

const routes = createRoutes([
  { path: "/home", name: "Home" },
  { path: "/about", name: "About" },
]);

// The type preserves literal values:
type RouteName = (typeof routes)[number]["name"]; // "Home" | "About"

// ============================================================================
// Exercise 6: Declaration Merging
// ============================================================================

// First declaration:
interface Config {
  database: string;
}

// Second declaration — merges with the first.
interface Config {
  port: number;
}

// Now Config has both `database` and `port`.
const config: Config = { database: "postgres://localhost", port: 5432 };

// Namespace merging:
namespace Validation {
  export function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

namespace Validation {
  export function isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}

// Both functions are accessible:
Validation.isEmail("test@example.com");
Validation.isUrl("https://example.com");

// Interface + namespace with the same name:
interface Logger {
  log(msg: string): void;
}

namespace Logger {
  export const DEFAULT_LEVEL = "info";
}

// ============================================================================
// Exercise 7: Module Augmentation
// ============================================================================

// Augmenting global interfaces:
declare global {
  interface Array<T> {
    unique(): T[];
  }

  interface String {
    toTitleCase(): string;
  }
}

// Augmenting a third-party module (e.g., Express):
// In a real project this would be in a `.d.ts` file.
declare module "express" {
  interface Request {
    user?: { id: string; role: string };
  }
}

// ============================================================================
// Exercise 8: Branded Types
// ============================================================================

// Branded types use an intersection with a phantom property to create
// nominal-like types in TypeScript's structural type system.
declare const UserIdBrand: unique symbol;
type UserId = number & { readonly [UserIdBrand]: typeof UserIdBrand };

declare const EmailBrand: unique symbol;
type Email = string & { readonly [EmailBrand]: typeof EmailBrand };

function createUserId(id: number): UserId {
  if (id <= 0 || !Number.isInteger(id)) {
    throw new Error("User ID must be a positive integer");
  }
  return id as UserId;
}

function createEmail(email: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(`Invalid email: ${email}`);
  }
  return email as Email;
}

function getUserById(id: UserId): void {
  console.log(`Fetching user ${id}`);
}

const id = createUserId(1);
getUserById(id); // OK

// @ts-expect-error — plain number is not UserId
getUserById(1);
// @ts-expect-error — string is not UserId
getUserById("abc");

export {};
