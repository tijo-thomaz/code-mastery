// ========================================
// DAY 9 — 5 TYPESCRIPT DRILLS (Real World Interview Patterns)
// ========================================
// Run: npx tsx drills/day9-ts.ts

// ---- DRILL 1: Type a REST API response (5 min) ----
// Define types for a paginated API response.
// GET /api/users → { data: User[], meta: { total, page, perPage, lastPage } }

type User = {
  // define this
};

type PaginatedResponse<T> = {
  // define this — generic so it works with any entity
};

// This should work without errors:
const response: PaginatedResponse<User> = {
  data: [{ id: 1, name: "Alice", email: "a@b.com", role: "admin" }],
  meta: { total: 100, page: 1, perPage: 10, lastPage: 10 },
};


// ---- DRILL 2: Discriminated Union — API State (5 min) ----
// Type a fetch state that can be: idle | loading | success | error
// Each state should ONLY have the fields that make sense for it.
// success has `data`, error has `message`, loading/idle have neither.

type FetchState<T> =
  // define this — use discriminated union with `status` field

// These should all work:
const idle: FetchState<User[]> = { status: "idle" };
const loading: FetchState<User[]> = { status: "loading" };
const success: FetchState<User[]> = { status: "success", data: [] };
const error: FetchState<User[]> = { status: "error", message: "Not found" };

// This should ERROR (data doesn't exist on loading):
// const bad: FetchState<User[]> = { status: "loading", data: [] };


// ---- DRILL 3: Implement Pick and Omit from scratch (5 min) ----

type MyPick<T, K extends keyof T> = {
  // implement
};

type MyOmit<T, K extends keyof T> = {
  // implement
};

// Test:
type UserName = MyPick<User, "name" | "email">;
// Should be: { name: string; email: string }

type UserWithoutRole = MyOmit<User, "role">;
// Should be: { id: number; name: string; email: string }


// ---- DRILL 4: Generic fetch wrapper with type safety (8 min) ----
// Write a typed fetch wrapper that:
// - Takes a URL and returns typed data
// - Handles errors
// - Caller gets full type safety on the response

async function fetchJson<T>(url: string): Promise<T> {
  // implement
}

// Usage should look like:
// const users = await fetchJson<User[]>("/api/users");
// users[0].name ← TypeScript knows this is string


// ---- DRILL 5: Typed Event Emitter (10 min) ----
// Create an event emitter where events and their payload types are defined upfront.
// emitter.on("login", (user: User) => {})  ← TS knows payload is User
// emitter.emit("login", { wrong: true })   ← TS ERROR

interface EventMap {
  login: User;
  logout: void;
  error: { code: number; message: string };
}

class TypedEmitter<T extends Record<string, any>> {
  // implement: on(event, callback), emit(event, payload), off(event, callback)

}

// Test:
const bus = new TypedEmitter<EventMap>();
bus.on("login", (user) => console.log(user.name));  // TS knows user is User
bus.emit("login", { id: 1, name: "Alice", email: "a@b.com", role: "admin" });
// bus.emit("login", { wrong: true });  // ← Should be TS error

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
