// ========================================
// DAY 10 — SOLUTIONS (DO NOT PEEK BEFORE ATTEMPTING)
// ========================================

// ---- DRILL 1: DeepReadonly ----

type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type Config = {
  db: { host: string; port: number };
  features: { darkMode: boolean };
};

const config: DeepReadonly<Config> = {
  db: { host: "localhost", port: 5432 },
  features: { darkMode: true },
};
// config.db.port = 3000;  // TS Error: Cannot assign to 'port' because it is a read-only property


// ---- DRILL 2: DeepPartial ----

type DeepPartial<T> = T extends Function
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

const update: DeepPartial<Config> = {
  db: { port: 3000 }, // host not required — works!
};


// ---- DRILL 3: Type-safe form handler ----

interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
}

function createForm<T extends Record<string, any>>(initial: T): FormState<T> {
  const values = { ...initial };
  const errors: Partial<Record<keyof T, string>> = {};

  return {
    values,
    errors,
    handleChange<K extends keyof T>(field: K, value: T[K]) {
      values[field] = value;
    },
  };
}

const form = createForm({ name: "", email: "", age: 0 });
form.handleChange("name", "Alice"); // ✅
form.handleChange("age", 25);       // ✅
// form.handleChange("name", 123);   // ❌ TS error
// form.handleChange("xyz", "x");    // ❌ TS error


// ---- DRILL 4: Extract route params ----

// Step by step:
// 1. Check if string has `:param/rest` → extract param, recurse on rest
// 2. Check if string has `:param` at the end → extract param
// 3. Check if string has `prefix/rest` (no param) → skip prefix, recurse
// 4. Otherwise → empty object (no params)

type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

type Params1 = ExtractParams<"/users/:id">;
// { id: string }

type Params2 = ExtractParams<"/users/:id/posts/:postId">;
// { id: string } & { postId: string }

type Params3 = ExtractParams<"/static/page">;
// {} — no params


// ---- DRILL 5: Builder Pattern ----

interface TableSchema {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

class QueryBuilder<T extends Record<string, any>> {
  private fields: (keyof T)[] = [];
  private conditions: string[] = [];

  select<K extends keyof T>(...fields: K[]): this {
    this.fields.push(...fields);
    return this;
  }

  where<K extends keyof T>(field: K, op: "=" | ">" | "<" | ">=" | "<=" | "!=", value: T[K]): this {
    this.conditions.push(`${String(field)} ${op} ${value}`);
    return this;
  }

  build(): string {
    const select = this.fields.length
      ? `SELECT ${this.fields.map(String).join(", ")}`
      : "SELECT *";

    const where = this.conditions.length
      ? ` WHERE ${this.conditions.join(" AND ")}`
      : "";

    return select + where;
  }
}

const query = new QueryBuilder<TableSchema>()
  .select("name", "age")
  .where("age", ">", 30)
  .where("active", "=", true)
  .build();

console.log(query);
// "SELECT name, age WHERE age > 30 AND active = true"

// Bonus: TS prevents invalid field names:
// .select("invalid")      // ❌ TS error
// .where("age", ">", "x") // ❌ TS error: age expects number, not string
