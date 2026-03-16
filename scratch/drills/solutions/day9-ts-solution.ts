// ========================================
// DAY 9 — SOLUTIONS (DO NOT PEEK BEFORE ATTEMPTING)
// ========================================

// ---- DRILL 1: REST API Response ----

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
};

const response: PaginatedResponse<User> = {
  data: [{ id: 1, name: "Alice", email: "a@b.com", role: "admin" }],
  meta: { total: 100, page: 1, perPage: 10, lastPage: 10 },
};


// ---- DRILL 2: Discriminated Union — Fetch State ----

type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// Usage in a component:
function handleState(state: FetchState<User[]>) {
  switch (state.status) {
    case "idle":
      return "Ready";
    case "loading":
      return "Loading...";
    case "success":
      return state.data.map((u) => u.name); // TS knows data exists
    case "error":
      return state.message; // TS knows message exists
  }
}


// ---- DRILL 3: Pick and Omit from scratch ----

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Alternative Omit using Pick + Exclude:
// type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

type UserName = MyPick<User, "name" | "email">;
type UserWithoutRole = MyOmit<User, "role">;


// ---- DRILL 4: Generic fetch wrapper ----

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Usage:
// const users = await fetchJson<User[]>("/api/users");
// const user = await fetchJson<User>("/api/users/1");


// ---- DRILL 5: Typed Event Emitter ----

interface EventMap {
  login: User;
  logout: void;
  error: { code: number; message: string };
}

class TypedEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(payload: T[K]) => void>;
  } = {};

  on<K extends keyof T>(event: K, callback: (payload: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }

  off<K extends keyof T>(event: K, callback: (payload: T[K]) => void): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(
      (cb) => cb !== callback
    );
  }
}

const bus = new TypedEmitter<EventMap>();
bus.on("login", (user) => console.log(user.name));
bus.emit("login", { id: 1, name: "Alice", email: "a@b.com", role: "admin" });
