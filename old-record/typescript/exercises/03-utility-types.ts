/**
 * Exercise 03: Utility Types
 *
 * 8 exercises: use built-in utility types AND implement some from scratch.
 * Replace all `TODO` placeholders with correct implementations.
 */

// Shared types for exercises
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Post {
  id: number;
  title: string;
  body: string;
  authorId: number;
  tags: string[];
  published: boolean;
}

// ============================================================================
// Exercise 1: Partial & Required ⭐
// ============================================================================

// TODO: define a type `UpdateUserDto` using Partial<User> but with `id` required.
//       Hint: use intersection of Pick and Partial.

// TODO: implement `MyPartial<T>` from scratch using mapped types
type MyPartial<T> = unknown; // replace `unknown`

// TODO: implement `MyRequired<T>` from scratch using mapped types
type MyRequired<T> = unknown; // replace `unknown`

// TODO: write a function `updateUser` that takes an UpdateUserDto and returns User
//       (just return a dummy user — focus is on the types)

// Type tests:
type _PartialUser = MyPartial<User>;
// @ts-expect-error — MyRequired should make all fields required
const _requiredTest: MyRequired<{ a?: string; b?: number }> = { a: "hi" };

// ============================================================================
// Exercise 2: Pick & Omit ⭐
// ============================================================================

// TODO: define a type `UserPreview` that picks only `id`, `name`, `email` from User

// TODO: define a type `UserWithoutSensitive` that omits `password` from User

// TODO: implement `MyPick<T, K>` from scratch
type MyPick<T, K extends keyof T> = unknown; // replace `unknown`

// TODO: implement `MyOmit<T, K>` from scratch
type MyOmit<T, K extends keyof T> = unknown; // replace `unknown`

// @ts-expect-error — Pick should only allow valid keys
type _BadPick = MyPick<User, "nonexistent">;

// ============================================================================
// Exercise 3: Record ⭐
// ============================================================================

// TODO: define a type `UserRoles` using Record with role names as keys
//       and arrays of User as values.
//       Roles: "admin" | "editor" | "viewer"

// TODO: define a type `HttpStatusMessages` using Record<number, string>

// TODO: implement `MyRecord<K, V>` from scratch
type MyRecord<K extends string | number | symbol, V> = unknown; // replace `unknown`

// TODO: create a variable `statusMessages` of type HttpStatusMessages with at least 3 entries

// ============================================================================
// Exercise 4: Exclude & Extract ⭐⭐
// ============================================================================

type AllEvents = "click" | "focus" | "blur" | "scroll" | "resize" | "keydown" | "keyup";
type MouseEvents = "click" | "scroll";
type KeyEvents = "keydown" | "keyup";

// TODO: define `NonMouseEvents` using Exclude to remove MouseEvents from AllEvents

// TODO: define `InputEvents` using Extract to keep only KeyEvents from AllEvents

// TODO: implement `MyExclude<T, U>` from scratch using conditional types
type MyExclude<T, U> = unknown; // replace `unknown`

// TODO: implement `MyExtract<T, U>` from scratch using conditional types
type MyExtract<T, U> = unknown; // replace `unknown`

// Type tests:
type _Excluded = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"
type _Extracted = MyExtract<"a" | "b" | "c", "a" | "b">; // "a" | "b"

// ============================================================================
// Exercise 5: ReturnType & Parameters ⭐⭐
// ============================================================================

function createUser(name: string, email: string, age: number): User {
  return { id: 1, name, email, password: "", createdAt: new Date(), updatedAt: new Date() };
}

async function fetchPosts(userId: number, limit?: number): Promise<Post[]> {
  return [];
}

// TODO: define `CreateUserReturn` using ReturnType
// TODO: define `CreateUserParams` using Parameters
// TODO: define `FetchPostsReturn` using Awaited<ReturnType<...>> to unwrap the Promise

// TODO: implement `MyReturnType<T>` from scratch using `infer`
type MyReturnType<T extends (...args: any[]) => any> = unknown; // replace `unknown`

// TODO: implement `MyParameters<T>` from scratch using `infer`
type MyParameters<T extends (...args: any[]) => any> = unknown; // replace `unknown`

// Type tests:
type _Ret = MyReturnType<typeof createUser>;  // User
type _Params = MyParameters<typeof createUser>; // [string, string, number]

// ============================================================================
// Exercise 6: Readonly & Record Patterns ⭐⭐
// ============================================================================

// TODO: define a type `ImmutableUser` that is deeply readonly
//       (Readonly only works one level deep — you need a recursive type)
type DeepReadonly<T> = unknown; // replace `unknown`

// TODO: define a type `Config` using nested Records:
//       { database: { host: string; port: number }; cache: { ttl: number } }
//       Make the entire Config deeply readonly.

// TODO: write a function `freeze<T extends object>(obj: T): DeepReadonly<T>`
//       that returns Object.freeze(obj) with the correct deep readonly type.

// ============================================================================
// Exercise 7: Combining Utility Types ⭐⭐
// ============================================================================

// TODO: define `CreatePostDto` — like Post but:
//   - omit `id` (auto-generated)
//   - make `tags` optional
//   - make `published` optional (default false)

// TODO: define `PatchPostDto` — like Post but:
//   - require `id`
//   - make everything else optional

// TODO: define a type `ApiEndpoint<TReq, TRes>` that is:
//   { request: TReq; response: ApiResponse<TRes> }
//   where ApiResponse<T> = { data: T; error: string | null; status: number }

// TODO: create a type `CreatePostEndpoint` using ApiEndpoint with
//       CreatePostDto as request and Post as response

// ============================================================================
// Exercise 8: Custom Utility Types ⭐⭐⭐
// ============================================================================

// TODO: implement `Mutable<T>` — removes readonly from all properties

// TODO: implement `PickByType<T, V>` — picks only properties of T whose value is V
//       e.g., PickByType<User, string> → { name: string; email: string; password: string }

// TODO: implement `RequiredKeys<T>` — extracts a union of keys that are required in T

// TODO: implement `OptionalKeys<T>` — extracts a union of keys that are optional in T

// Type tests:
interface Mixed {
  required: string;
  alsoRequired: number;
  optional?: boolean;
  alsoOptional?: string;
}

type _ReqKeys = RequiredKeys<Mixed>;   // "required" | "alsoRequired"
type _OptKeys = OptionalKeys<Mixed>;   // "optional" | "alsoOptional"

export {};
