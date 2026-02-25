/**
 * Solutions: 01 — Basic Types
 *
 * Full solutions with explanations for each exercise.
 */

// ============================================================================
// Exercise 1: Type Annotations
// ============================================================================
// Explicit type annotations make intent clear and catch mistakes at compile time.

const userName: string = "Alice";
const userAge: number = 30;
const isActive: boolean = true;
const scores: number[] = [95, 87, 73];

function greetUser(name: string, age: number): string {
  return `Hello ${name}, you are ${age} years old.`;
}

// ============================================================================
// Exercise 2: Interfaces vs Type Aliases
// ============================================================================

// Interface — can be extended and declaration-merged.
interface IUser {
  id: number;
  name: string;
  email: string;
}

// Type alias — same shape but uses `=` syntax.
type TUser = {
  id: number;
  name: string;
  email: string;
};

// Declaration merging: re-declaring the same interface adds fields to it.
// This only works with interfaces, NOT type aliases.
interface IUser {
  role?: string;
}

// Union shorthand — only possible with type aliases (or inline).
type StatusOrUser = string | TUser;

// ============================================================================
// Exercise 3: Union & Intersection Types
// ============================================================================

type StringOrNumber = string | number;

type HasName = { name: string };
type HasAge = { age: number };

// Intersection: the resulting type must satisfy BOTH HasName AND HasAge.
type Person = HasName & HasAge;

function formatId(id: StringOrNumber): string {
  // `typeof` narrows the union — TypeScript knows which branch is which.
  if (typeof id === "number") {
    return `ID-${id}`;
  }
  return id.toUpperCase();
}

// ============================================================================
// Exercise 4: Literal Types
// ============================================================================

// Literal types restrict values to an exact set.
type Direction = "north" | "south" | "east" | "west";
type HttpStatus = 200 | 301 | 404 | 500;

function move(direction: Direction): string {
  return `Moving ${direction}`;
}

// These correctly produce type errors:
// @ts-expect-error — "up" is not in the Direction union
const badDirection: Direction = "up";
// @ts-expect-error — 201 is not in the HttpStatus union
const badStatus: HttpStatus = 201;

// ============================================================================
// Exercise 5: Enums
// ============================================================================

// Numeric enum — values auto-increment from the first assigned value.
enum LogLevel {
  Debug = 0,
  Info,   // 1
  Warn,   // 2
  Error,  // 3
}

// String enum — every member must have an explicit string value.
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

function shouldLog(level: LogLevel, minimum: LogLevel): boolean {
  return level >= minimum;
}

// ============================================================================
// Exercise 6: Tuple Types
// ============================================================================

// Tuples are fixed-length arrays where each position has a specific type.
type Point2D = [number, number];
type NamedPoint = [string, number, number];

// Rest element in tuple — a string followed by any number of numbers.
type VarArgs = [string, ...number[]];

function distance(a: Point2D, b: Point2D): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// @ts-expect-error — Point2D only allows exactly 2 elements
const badPoint: Point2D = [1, 2, 3];
// @ts-expect-error — first element of NamedPoint must be string
const badNamed: NamedPoint = [1, 2, 3];

// ============================================================================
// Exercise 7: unknown vs any
// ============================================================================

// `unknown` is type-safe — you must narrow before using the value.
function safeParseJson(input: string): unknown {
  return JSON.parse(input);
}

function processValue(value: unknown): number {
  if (typeof value === "string") {
    return value.length; // narrowed to string
  }
  if (typeof value === "number") {
    return value * 2; // narrowed to number
  }
  throw new Error(`Unexpected value type: ${typeof value}`);
}

// `any` bypasses the type system entirely — assignments like this silently succeed:
const dangerousValue: any = "not a number";
const num1: number = dangerousValue; // no error — this is a bug waiting to happen

// `unknown` forces you to check first:
const safeValue: unknown = "not a number";
const num2: number = typeof safeValue === "number" ? safeValue : 0;

// ============================================================================
// Exercise 8: Type Assertions
// ============================================================================

// Use `as` to tell TypeScript you know more about the type than it does.
// const inputEl = document.getElementById("username") as HTMLInputElement;
// const value = inputEl.value;

// Assertion function — throws if the value is null/undefined, otherwise narrows.
function assertNonNull<T>(value: T | null | undefined, message = "Value is null"): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

// When to use `as` vs type guards:
//
// Use `as` when you have external knowledge the compiler can't verify:
//   const el = document.getElementById("app") as HTMLDivElement;
//
// Use type guards when you can check at runtime — this is safer:
//   const el = document.getElementById("app");
//   if (el instanceof HTMLDivElement) {
//     el.style.color = "red"; // safely narrowed
//   }

export {};
