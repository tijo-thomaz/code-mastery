/**
 * Solutions: 02 — Generics
 *
 * Full solutions with explanations.
 */

// ============================================================================
// Exercise 1: Generic Functions
// ============================================================================

// The simplest generic — T flows through unchanged.
function identity<T>(value: T): T {
  return value;
}

function wrapInArray<T>(value: T): T[] {
  return [value];
}

// Multiple type parameters capture each argument's type independently.
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const s: string = identity("hello");
const n: number[] = wrapInArray(42);
const p: [string, number] = pair("age", 30);

// ============================================================================
// Exercise 2: Generic Interfaces
// ============================================================================

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(item: T): void;
  delete(id: string): boolean;
}

type UserResponse = ApiResponse<{ id: number; name: string }>;

// ============================================================================
// Exercise 3: Generic Constraints (extends)
// ============================================================================

// `K extends keyof T` ensures K is a valid key of T.
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// `extends object` prevents primitives.
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

// `extends { length: number }` works with strings, arrays, or anything with .length.
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

const val = getProperty({ name: "Alice", age: 30 }, "name"); // string

// @ts-expect-error — "foo" is not a key of { name: string }
getProperty({ name: "Alice" }, "foo");

// ============================================================================
// Exercise 4: Conditional Types
// ============================================================================

// Conditional types use `T extends U ? X : Y` syntax.
type IsString<T> = T extends string ? true : false;

// `infer U` captures the element type when T is an array.
type Flatten<T> = T extends (infer U)[] ? U : T;

// Exclude null | undefined using a conditional.
type NonNullableCustom<T> = T extends null | undefined ? never : T;

// Verification:
type _Test1 = IsString<string>;    // true
type _Test2 = IsString<number>;    // false
type _Test3 = Flatten<string[]>;   // string
type _Test4 = Flatten<number>;     // number

// ============================================================================
// Exercise 5: Mapped Types
// ============================================================================

// Mapped types iterate over keys with `[K in keyof T]`.
type Readonly2<T> = { readonly [K in keyof T]: T[K] };

type Optional<T> = { [K in keyof T]?: T[K] };

// `-readonly` removes the readonly modifier.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// `| null` adds null to each property's type.
type Nullable<T> = { [K in keyof T]: T[K] | null };

interface TestObj {
  readonly id: number;
  name: string;
  email: string;
}

type _ReadonlyTest = Readonly2<TestObj>;
type _MutableTest = Mutable<TestObj>;
type _NullableTest = Nullable<TestObj>;

// ============================================================================
// Exercise 6: Template Literal Types
// ============================================================================

// Template literal types build string types from other string types.
type EventName<T extends string> = `on${Capitalize<T>}`;

type CssProperty = `${string}-${string}`;

// Mapped type + template literal = generate method names from property names.
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type _ClickEvent = EventName<"click">;  // "onClick"
type _FocusEvent = EventName<"focus">;  // "onFocus"

interface PersonExample {
  name: string;
  age: number;
}
type _PersonGetters = Getters<PersonExample>;
// { getName: () => string; getAge: () => number }

// ============================================================================
// Exercise 7: The `infer` Keyword
// ============================================================================

// `infer R` introduces a type variable in the true branch of a conditional type.
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type FirstArg<T> = T extends (first: infer A, ...rest: any[]) => any ? A : never;

// Recursive unwrapping — handles Promise<Promise<T>> by recursing.
type PromiseValue<T> = T extends Promise<infer U> ? PromiseValue<U> : T;

type ArrayElement<T> = T extends (infer U)[] ? U : never;

type _Ret = ReturnTypeOf<(x: number) => string>;      // string
type _Arg = FirstArg<(x: number, y: string) => void>;  // number
type _Prom = PromiseValue<Promise<Promise<boolean>>>;   // boolean
type _Elem = ArrayElement<string[]>;                    // string

// ============================================================================
// Exercise 8: Generic Classes
// ============================================================================

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

class Result<T, E> {
  private constructor(
    private readonly value: T | undefined,
    private readonly error: E | undefined,
    private readonly _isOk: boolean,
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(value, undefined, true);
  }

  static err<E>(error: E): Result<never, E> {
    return new Result<never, E>(undefined, error, false);
  }

  isOk(): boolean {
    return this._isOk;
  }

  isErr(): boolean {
    return !this._isOk;
  }

  unwrap(): T {
    if (!this._isOk) {
      throw this.error;
    }
    return this.value as T;
  }

  unwrapOr(fallback: T): T {
    return this._isOk ? (this.value as T) : fallback;
  }
}

export {};
