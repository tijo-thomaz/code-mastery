/**
 * Exercise 01: Basic Types
 *
 * 8 exercises covering fundamental TypeScript type concepts.
 * Replace all `TODO` placeholders with correct implementations.
 * Lines marked with @ts-expect-error should remain — they verify type safety.
 */

// ============================================================================
// Exercise 1: Type Annotations ⭐
// ============================================================================
// Add explicit type annotations to all variables and the function signature.

// TODO: annotate these variables
const userName = "Alice";
const userAge = 30;
const isActive = true;
const scores = [95, 87, 73];

// TODO: add parameter types and return type
function greetUser(name, age) {
  return `Hello ${name}, you are ${age} years old.`;
}

// ============================================================================
// Exercise 2: Interfaces vs Type Aliases ⭐
// ============================================================================
// Define both an interface and a type alias for a User, then demonstrate
// a capability unique to each (declaration merging for interfaces,
// union/intersection shorthand for type aliases).

// TODO: define an interface IUser with: id (number), name (string), email (string)

// TODO: define a type alias TUser with the same shape

// TODO: demonstrate declaration merging — add an optional `role` field to IUser
// by declaring the interface again

// TODO: create a type alias StatusOrUser that is a union of string and TUser

// ============================================================================
// Exercise 3: Union & Intersection Types ⭐
// ============================================================================

// TODO: define a type `StringOrNumber` that accepts string or number

// TODO: define types `HasName` ({ name: string }) and `HasAge` ({ age: number }),
//       then create an intersection type `Person` combining both.

// TODO: write a function `formatId` that accepts StringOrNumber and always returns a string.
//       If it's a number, prefix with "ID-".
//       If it's a string, return it uppercased.

// ============================================================================
// Exercise 4: Literal Types ⭐
// ============================================================================

// TODO: define a type `Direction` that only allows "north" | "south" | "east" | "west"

// TODO: define a type `HttpStatus` that only allows 200 | 301 | 404 | 500

// TODO: write a function `move` that takes a Direction and returns a message like "Moving north"

// These should cause type errors:
// @ts-expect-error
const badDirection: Direction = "up";
// @ts-expect-error
const badStatus: HttpStatus = 201;

// ============================================================================
// Exercise 5: Enums ⭐
// ============================================================================

// TODO: create a numeric enum `LogLevel` with Debug=0, Info, Warn, Error

// TODO: create a string enum `Color` with Red="RED", Green="GREEN", Blue="BLUE"

// TODO: write a function `shouldLog` that takes a LogLevel and a minimum LogLevel,
//       returns true if the first is >= the second

// ============================================================================
// Exercise 6: Tuple Types ⭐⭐
// ============================================================================

// TODO: define a type `Point2D` as a tuple [number, number]

// TODO: define a type `NamedPoint` as a tuple [string, number, number]
//       representing [label, x, y]

// TODO: define a type `VarArgs` as a tuple [string, ...number[]]
//       (a string followed by any number of numbers)

// TODO: write a function `distance` that takes two Point2D tuples and returns
//       the Euclidean distance between them

// These should cause type errors:
// @ts-expect-error
const badPoint: Point2D = [1, 2, 3];
// @ts-expect-error
const badNamed: NamedPoint = [1, 2, 3];

// ============================================================================
// Exercise 7: unknown vs any ⭐⭐
// ============================================================================

// TODO: write a function `safeParseJson` that:
//   - takes a string parameter
//   - returns `unknown`
//   - uses JSON.parse internally

// TODO: write a function `processValue` that:
//   - takes an `unknown` parameter
//   - if it's a string, returns its length
//   - if it's a number, returns it doubled
//   - otherwise throws an Error
//   (use typeof checks to narrow the type)

// TODO: demonstrate why `any` is dangerous — assign an `any` value to a number
//       variable without error, then show that `unknown` prevents this.
//       Uncomment the lines below and fix the unknown case with a type guard.

// const dangerousValue: any = "not a number";
// const num1: number = dangerousValue; // no error — dangerous!

// const safeValue: unknown = "not a number";
// const num2: number = safeValue; // TODO: fix this line with a type guard

// ============================================================================
// Exercise 8: Type Assertions ⭐⭐
// ============================================================================

// TODO: given the following HTML-fetching scenario, use type assertions properly.

// const inputEl = document.getElementById("username"); // type is HTMLElement | null
// TODO: assert it as HTMLInputElement and access `.value`

// TODO: write a function `assertNonNull` that takes a value of type T | null | undefined
//       and either returns T or throws. Use assertion signature or simple assertion.

// TODO: explain (in a comment) when you should use `as` vs when you should use
//       type guards. Write one example of each.

export {};
