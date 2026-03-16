/**
 * Exercise 02: Generics
 *
 * 8 exercises covering generics from basics to advanced type-level programming.
 * Replace all `TODO` placeholders with correct implementations.
 */

// ============================================================================
// Exercise 1: Generic Functions ⭐
// ============================================================================

// TODO: write a generic function `identity<T>` that takes a value of type T
//       and returns it unchanged.

// TODO: write a generic function `wrapInArray<T>` that takes a value of type T
//       and returns T[].

// TODO: write a generic function `pair<A, B>` that takes two arguments
//       of types A and B and returns a tuple [A, B].

// Type tests:
// const s: string = identity("hello");
// const n: number[] = wrapInArray(42);
// const p: [string, number] = pair("age", 30);

// ============================================================================
// Exercise 2: Generic Interfaces ⭐
// ============================================================================

// TODO: define a generic interface `ApiResponse<T>` with:
//   - data: T
//   - status: number
//   - message: string

// TODO: define a generic interface `Repository<T>` with methods:
//   - findById(id: string): T | undefined
//   - findAll(): T[]
//   - save(item: T): void
//   - delete(id: string): boolean

// TODO: create a type `UserResponse` that is ApiResponse<{ id: number; name: string }>

// ============================================================================
// Exercise 3: Generic Constraints (extends) ⭐⭐
// ============================================================================

// TODO: write a function `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`

// TODO: write a function `merge<T extends object, U extends object>(a: T, b: U): T & U`

// TODO: write a function `longest<T extends { length: number }>(a: T, b: T): T`
//       that returns whichever argument is longer

// Type tests:
// const val = getProperty({ name: "Alice", age: 30 }, "name"); // string
// @ts-expect-error
// getProperty({ name: "Alice" }, "foo");

// ============================================================================
// Exercise 4: Conditional Types ⭐⭐
// ============================================================================

// TODO: define a type `IsString<T>` that evaluates to `true` if T is string, else `false`

// TODO: define a type `Flatten<T>` that:
//   - if T is an array of U, returns U
//   - otherwise returns T

// TODO: define a type `NonNullableCustom<T>` that removes null and undefined from T
//       (without using the built-in NonNullable)

// Type tests:
type _Test1 = IsString<string>;    // should be true
type _Test2 = IsString<number>;    // should be false
type _Test3 = Flatten<string[]>;   // should be string
type _Test4 = Flatten<number>;     // should be number

// ============================================================================
// Exercise 5: Mapped Types ⭐⭐
// ============================================================================

// TODO: define a type `Readonly2<T>` that makes all properties of T readonly
//       (re-implement built-in Readonly)

// TODO: define a type `Optional<T>` that makes all properties of T optional
//       (re-implement built-in Partial)

// TODO: define a type `Mutable<T>` that removes readonly from all properties of T

// TODO: define a type `Nullable<T>` that makes every property of T also accept null

// Type tests:
interface TestObj {
  readonly id: number;
  name: string;
  email: string;
}

type _ReadonlyTest = Readonly2<TestObj>;   // all readonly
type _MutableTest = Mutable<TestObj>;      // none readonly
type _NullableTest = Nullable<TestObj>;    // all allow null

// ============================================================================
// Exercise 6: Template Literal Types ⭐⭐
// ============================================================================

// TODO: define a type `EventName<T extends string>` that produces `on${Capitalize<T>}`
//       e.g., EventName<"click"> = "onClick"

// TODO: define a type `CssProperty` that is `${string}-${string}`
//       (any string with a hyphen)

// TODO: define a type `Getters<T>` that for each key K of T creates a method
//       `get${Capitalize<string & K>}(): T[K]`

// Type tests:
type _ClickEvent = EventName<"click">;     // "onClick"
type _FocusEvent = EventName<"focus">;     // "onFocus"

interface Person {
  name: string;
  age: number;
}
type _PersonGetters = Getters<Person>;
// should have: getName(): string; getAge(): number;

// ============================================================================
// Exercise 7: The `infer` Keyword ⭐⭐⭐
// ============================================================================

// TODO: define a type `ReturnTypeOf<T>` that extracts the return type of a function type
//       (re-implement ReturnType using `infer`)

// TODO: define a type `FirstArg<T>` that extracts the first argument type of a function

// TODO: define a type `PromiseValue<T>` that unwraps Promise<T> to get T
//       (should work for nested promises: Promise<Promise<string>> → string)

// TODO: define a type `ArrayElement<T>` that extracts the element type of an array

// Type tests:
type _Ret = ReturnTypeOf<(x: number) => string>;     // string
type _Arg = FirstArg<(x: number, y: string) => void>; // number
type _Prom = PromiseValue<Promise<Promise<boolean>>>;  // boolean
type _Elem = ArrayElement<string[]>;                   // string

// ============================================================================
// Exercise 8: Generic Classes ⭐⭐
// ============================================================================

// TODO: implement a generic class `Stack<T>` with:
//   - push(item: T): void
//   - pop(): T | undefined
//   - peek(): T | undefined
//   - get size(): number
//   - isEmpty(): boolean

// TODO: implement a generic class `Result<T, E>` with:
//   - static ok<T>(value: T): Result<T, never>
//   - static err<E>(error: E): Result<never, E>
//   - isOk(): boolean
//   - isErr(): boolean
//   - unwrap(): T (throws if error)
//   - unwrapOr(fallback: T): T

export {};
