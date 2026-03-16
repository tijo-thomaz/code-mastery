// ========================================
// DAY 10 — 5 TYPESCRIPT DRILLS (Senior Interview Level)
// ========================================

// ---- DRILL 1: DeepReadonly (5 min) ----
// Make all properties readonly recursively — nested objects too.

type DeepReadonly<T> = {
  // implement
};

// Test:
type Config = {
  db: { host: string; port: number };
  features: { darkMode: boolean };
};
const config: DeepReadonly<Config> = {
  db: { host: "localhost", port: 5432 },
  features: { darkMode: true },
};
// config.db.port = 3000;  ← Should be TS error


// ---- DRILL 2: DeepPartial (3 min) ----
// Make all properties optional recursively.

type DeepPartial<T> = {
  // implement
};

// Test — should allow partial nested updates:
const update: DeepPartial<Config> = {
  db: { port: 3000 },  // host not required
};


// ---- DRILL 3: Type-safe form handler (8 min) ----
// Create a generic useForm-like type that:
// - Takes a shape, returns { values, errors, handleChange }
// - handleChange only accepts keys of the shape
// - errors are partial (not all fields have errors)

interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
}

// Implement a function that creates this form state:
function createForm<T extends Record<string, any>>(initial: T): FormState<T> {
  // implement
}

// Test:
const form = createForm({ name: "", email: "", age: 0 });
form.handleChange("name", "Alice");     // ✅ valid
form.handleChange("age", 25);           // ✅ valid
// form.handleChange("name", 123);      // ❌ TS error: name expects string
// form.handleChange("invalid", "x");   // ❌ TS error: "invalid" not a key


// ---- DRILL 4: Extract route params from URL pattern (8 min) ----
// Given "/users/:id/posts/:postId", extract { id: string; postId: string }

type ExtractParams<T extends string> =
  // implement using template literal types + infer
  // Hint: check if string matches `${infer Start}:${infer Param}/${infer Rest}`

// Test:
type Params1 = ExtractParams<"/users/:id">;
// Should be: { id: string }

type Params2 = ExtractParams<"/users/:id/posts/:postId">;
// Should be: { id: string; postId: string }


// ---- DRILL 5: Builder Pattern with Types (10 min) ----
// Create a typed query builder where:
// .select("name", "age") → knows only those fields are selected
// .where("age", ">", 30) → only accepts fields from the table
// .build() → returns the query string

interface TableSchema {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

class QueryBuilder<T extends Record<string, any>> {
  // implement: select(...fields), where(field, op, value), build()

}

// Test:
const query = new QueryBuilder<TableSchema>()
  .select("name", "age")
  .where("age", ">", 30)
  .where("active", "=", true)
  .build();

console.log(query);
// "SELECT name, age WHERE age > 30 AND active = true"

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
