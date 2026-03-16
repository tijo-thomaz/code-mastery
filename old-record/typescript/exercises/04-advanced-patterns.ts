/**
 * Exercise 04: Advanced Patterns
 *
 * 8 exercises covering advanced TypeScript patterns used in production.
 * Replace all `TODO` placeholders with correct implementations.
 */

// ============================================================================
// Exercise 1: Discriminated Unions ⭐⭐
// ============================================================================

// TODO: define a discriminated union `Shape` with a `kind` discriminant:
//   - Circle: { kind: "circle"; radius: number }
//   - Rectangle: { kind: "rectangle"; width: number; height: number }
//   - Triangle: { kind: "triangle"; base: number; height: number }

// TODO: write a function `area(shape: Shape): number` that uses a switch
//       on `shape.kind` to compute the area. Include an exhaustive check
//       in the default case using `never`.

// TODO: define a discriminated union `Result<T, E = Error>`:
//   - { ok: true; value: T }
//   - { ok: false; error: E }

// TODO: write a function `unwrapResult<T>(result: Result<T>): T`
//       that returns the value or throws the error.

// ============================================================================
// Exercise 2: Type Guards (is / asserts) ⭐⭐
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

// TODO: write a type guard function `isCat(animal: Animal): animal is Cat`

// TODO: write a type guard function `isDog(animal: Animal): animal is Dog`

// TODO: write an assertion function `assertDog(animal: Animal): asserts animal is Dog`
//       that throws if the animal is not a dog.

// TODO: write a generic type guard `hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown>`
//       that checks if an object has a specific property.

// Type test:
function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.purr(); // should compile — animal is narrowed to Cat
  }
}

// ============================================================================
// Exercise 3: Function Overloads ⭐⭐
// ============================================================================

// TODO: write an overloaded function `createElement` with these signatures:
//   - createElement("div"): HTMLDivElement
//   - createElement("span"): HTMLSpanElement
//   - createElement("input"): HTMLInputElement
//   - createElement(tag: string): HTMLElement
// Implementation should use document.createElement internally.

// TODO: write an overloaded function `parse`:
//   - parse(input: string, asNumber: true): number
//   - parse(input: string, asNumber: false): string
//   - parse(input: string): string

// ============================================================================
// Exercise 4: `satisfies` Operator (TS 5.0) ⭐⭐
// ============================================================================

type ColorMap = Record<string, [number, number, number] | string>;

// TODO: create a `colors` object that satisfies ColorMap but retains
//       its literal types. Include at least 3 colors, mixing tuple and string formats.
//       After defining it, demonstrate that you can access a specific color
//       and TypeScript knows its exact type (tuple vs string).

// Example of what we want:
// colors.red    → TypeScript knows this is [number, number, number]
// colors.white  → TypeScript knows this is string

// TODO: define a config object that satisfies a Record<string, string | number>
//       but preserves literal types for autocomplete.

// ============================================================================
// Exercise 5: Const Type Parameters (TS 5.0) ⭐⭐⭐
// ============================================================================

// TODO: write a function `asConst<const T>(value: T): T`
//       and demonstrate that it infers literal types without needing `as const`.

// TODO: write a function `createRoutes<const T extends readonly { path: string; name: string }[]>(routes: T): T`
//       and show that the returned type preserves literal path and name values.

// Example usage (should compile with literal types):
// const routes = createRoutes([
//   { path: "/home", name: "Home" },
//   { path: "/about", name: "About" },
// ]);
// type RouteName = (typeof routes)[number]["name"]; // "Home" | "About"

// ============================================================================
// Exercise 6: Declaration Merging ⭐⭐
// ============================================================================

// TODO: define an interface `Config` with a `database` property of type string.

// TODO: use declaration merging to add a `port` property (number) to Config.

// TODO: define a namespace `Validation` with an exported function `isEmail(value: string): boolean`

// TODO: use declaration merging to add a namespace member `isUrl(value: string): boolean`

// TODO: demonstrate merging an interface with a namespace of the same name.
//       Create an interface `Logger` with `log(msg: string): void`,
//       and a namespace `Logger` with a constant `DEFAULT_LEVEL: string`.

// ============================================================================
// Exercise 7: Module Augmentation ⭐⭐⭐
// ============================================================================

// TODO: augment the global `Array` interface to add a method:
//       `unique(): T[]` — returns an array with duplicates removed.
//       (Declare it, don't implement it — this is about the type declaration.)

// TODO: augment the global `String` interface to add a method:
//       `toTitleCase(): string`

// Hint: use `declare global { interface Array<T> { ... } }` syntax.

// TODO: demonstrate how you would augment a third-party module's types.
//       Create a mock module declaration for "express" and add a `user` property
//       to the Request interface.

// ============================================================================
// Exercise 8: Branded Types ⭐⭐⭐
// ============================================================================

// TODO: define a branded type `UserId` that is a number but distinct from plain numbers.
//       Use the pattern: type UserId = number & { readonly __brand: unique symbol }

// TODO: define a branded type `Email` that is a string but validated.

// TODO: write a constructor function `createUserId(id: number): UserId`
// TODO: write a constructor function `createEmail(email: string): Email`
//       that validates the email format and throws if invalid.

// TODO: write a function `getUserById(id: UserId): void` that only accepts UserId,
//       not plain numbers.

// Type tests:
// const id = createUserId(1);
// getUserById(id);       // OK
// @ts-expect-error
// getUserById(1);        // Error — plain number is not UserId
// @ts-expect-error
// getUserById("abc");    // Error — string is not UserId

export {};
