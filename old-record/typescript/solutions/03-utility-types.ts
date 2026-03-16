/**
 * Solutions: 03 — Utility Types
 *
 * Full solutions with explanations.
 */

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
// Exercise 1: Partial & Required
// ============================================================================

// Intersect Pick (to require `id`) with Partial (to make everything else optional).
type UpdateUserDto = Pick<User, "id"> & Partial<User>;

// Mapped type with `?` makes every property optional.
type MyPartial<T> = { [K in keyof T]?: T[K] };

// `-?` removes the optional modifier, making every property required.
type MyRequired<T> = { [K in keyof T]-?: T[K] };

function updateUser(dto: UpdateUserDto): User {
  return {
    id: dto.id,
    name: dto.name ?? "",
    email: dto.email ?? "",
    password: dto.password ?? "",
    createdAt: dto.createdAt ?? new Date(),
    updatedAt: new Date(),
  };
}

// @ts-expect-error — MyRequired makes `b` required, so omitting it is an error
const _requiredTest: MyRequired<{ a?: string; b?: number }> = { a: "hi" };

// ============================================================================
// Exercise 2: Pick & Omit
// ============================================================================

type UserPreview = Pick<User, "id" | "name" | "email">;

type UserWithoutSensitive = Omit<User, "password">;

// Pick: iterate only over keys in K.
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Omit: iterate over all keys EXCEPT those in K.
// `Exclude` filters the key union, then we map over the remaining keys.
type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

// @ts-expect-error — "nonexistent" is not a key of User
type _BadPick = MyPick<User, "nonexistent">;

// ============================================================================
// Exercise 3: Record
// ============================================================================

type UserRoles = Record<"admin" | "editor" | "viewer", User[]>;

type HttpStatusMessages = Record<number, string>;

// Record maps every key in K to a value of type V.
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };

const statusMessages: HttpStatusMessages = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error",
};

// ============================================================================
// Exercise 4: Exclude & Extract
// ============================================================================

type AllEvents = "click" | "focus" | "blur" | "scroll" | "resize" | "keydown" | "keyup";
type MouseEvents = "click" | "scroll";
type KeyEvents = "keydown" | "keyup";

type NonMouseEvents = Exclude<AllEvents, MouseEvents>;
// = "focus" | "blur" | "resize" | "keydown" | "keyup"

type InputEvents = Extract<AllEvents, KeyEvents>;
// = "keydown" | "keyup"

// Conditional types distribute over unions:
// Exclude<"a" | "b" | "c", "a"> evaluates as:
//   ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c")
//   = never | "b" | "c" = "b" | "c"
type MyExclude<T, U> = T extends U ? never : T;

type MyExtract<T, U> = T extends U ? T : never;

type _Excluded = MyExclude<"a" | "b" | "c", "a">;      // "b" | "c"
type _Extracted = MyExtract<"a" | "b" | "c", "a" | "b">; // "a" | "b"

// ============================================================================
// Exercise 5: ReturnType & Parameters
// ============================================================================

function createUser(name: string, email: string, age: number): User {
  return { id: 1, name, email, password: "", createdAt: new Date(), updatedAt: new Date() };
}

async function fetchPosts(userId: number, limit?: number): Promise<Post[]> {
  return [];
}

type CreateUserReturn = ReturnType<typeof createUser>;       // User
type CreateUserParams = Parameters<typeof createUser>;       // [string, string, number]
type FetchPostsReturn = Awaited<ReturnType<typeof fetchPosts>>; // Post[]

// `infer R` in the return position captures the return type.
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

// `infer P` in the parameter position captures the parameter tuple.
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

type _Ret = MyReturnType<typeof createUser>;    // User
type _Params = MyParameters<typeof createUser>; // [string, string, number]

// ============================================================================
// Exercise 6: Readonly & Record Patterns
// ============================================================================

// Recursive type: if a property is an object, apply DeepReadonly recursively.
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]                  // don't recurse into functions
      : DeepReadonly<T[K]>
    : T[K];
};

type ImmutableUser = DeepReadonly<User>;

type Config = DeepReadonly<{
  database: { host: string; port: number };
  cache: { ttl: number };
}>;

function freeze<T extends object>(obj: T): DeepReadonly<T> {
  return Object.freeze(obj) as DeepReadonly<T>;
}

// ============================================================================
// Exercise 7: Combining Utility Types
// ============================================================================

// Omit auto-generated fields, make some optional.
type CreatePostDto = Omit<Post, "id"> & {
  tags?: string[];
  published?: boolean;
};

// Require id, make everything else optional.
type PatchPostDto = Pick<Post, "id"> & Partial<Omit<Post, "id">>;

type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

type ApiEndpoint<TReq, TRes> = {
  request: TReq;
  response: ApiResponse<TRes>;
};

type CreatePostEndpoint = ApiEndpoint<CreatePostDto, Post>;

// ============================================================================
// Exercise 8: Custom Utility Types
// ============================================================================

// Remove readonly from all properties.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Keep only properties whose value type extends V.
// `as` clause in mapped types filters keys.
type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// A key is required if adding `?` changes the type (i.e., {} extends Pick<T,K> is false).
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Mixed {
  required: string;
  alsoRequired: number;
  optional?: boolean;
  alsoOptional?: string;
}

type _ReqKeys = RequiredKeys<Mixed>;   // "required" | "alsoRequired"
type _OptKeys = OptionalKeys<Mixed>;   // "optional" | "alsoOptional"
type _Picked = PickByType<User, string>; // { name, email, password }

export {};
