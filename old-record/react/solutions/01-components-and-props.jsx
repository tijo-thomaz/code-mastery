// =============================================================================
// 01 — Components & Props — SOLUTIONS
// =============================================================================

import React from "react";

// =============================================================================
// Exercise 1 — Functional Component
// =============================================================================

export function Greeting({ name = "World" }) {
  return <h1>Hello, {name}!</h1>;
}

// Explanation:
// Default parameter value handles the missing-name case.
// Props are destructured directly in the function signature.

// =============================================================================
// Exercise 2 — Props Drilling
// =============================================================================

function UserAvatar({ avatarUrl, name }) {
  return <img src={avatarUrl} alt={name} style={{ borderRadius: "50%", width: 48, height: 48 }} />;
}

function UserPanel({ user }) {
  return (
    <div>
      <UserAvatar avatarUrl={user.avatarUrl} name={user.name} />
      <h3>{user.name}</h3>
      <span>{user.role}</span>
    </div>
  );
}

export function UserApp() {
  const user = {
    name: "Jane Doe",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    role: "Admin",
  };
  return <UserPanel user={user} />;
}

// Explanation:
// Data flows one way: UserApp → UserPanel → UserAvatar.
// This works for shallow trees. For deeper trees, use Context (exercise 04).

// =============================================================================
// Exercise 3 — Children Prop
// =============================================================================

export function Card({ children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
      {children}
    </div>
  );
}

export function CardWithTitle({ title, children }) {
  return (
    <Card>
      <h2>{title}</h2>
      {children}
    </Card>
  );
}

// Explanation:
// `children` is a special prop — whatever you put between <Card>...</Card>
// is passed as children. CardWithTitle composes Card, adding a title.

// =============================================================================
// Exercise 4 — Conditional Rendering
// =============================================================================

const STATUS_CONFIG = {
  online: { color: "green", label: "Online" },
  offline: { color: "gray", label: "Offline" },
  away: { color: "#f59e0b", label: "Away" },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: config.color,
          display: "inline-block",
        }}
      />
      {config.label}
    </span>
  );
}

// Explanation:
// A mapping object is cleaner than if/else or switch. Easy to extend —
// just add a new key. Returns null for unknown statuses.

// =============================================================================
// Exercise 5 — List Rendering with Keys
// =============================================================================

export function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{ textDecoration: todo.done ? "line-through" : "none" }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Explanation:
// key={todo.id} uses a stable unique identifier. Never use array index as key
// if the list can be reordered/filtered — it causes subtle bugs with state.

// =============================================================================
// Exercise 6 — Component Composition
// =============================================================================

export function Page({ children }) {
  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>{children}</div>;
}

Page.Header = function PageHeader({ children }) {
  return <header style={{ padding: 16, borderBottom: "1px solid #ccc" }}>{children}</header>;
};

Page.Body = function PageBody({ children }) {
  return <main style={{ flex: 1, padding: 16 }}>{children}</main>;
};

Page.Footer = function PageFooter({ children }) {
  return <footer style={{ padding: 16, borderTop: "1px solid #ccc", textAlign: "center" }}>{children}</footer>;
};

// Usage:
// <Page>
//   <Page.Header>My Site</Page.Header>
//   <Page.Body><p>Welcome!</p></Page.Body>
//   <Page.Footer>© 2026</Page.Footer>
// </Page>

// Explanation:
// Dot-notation components are just functions attached as properties on the
// parent component. This pattern creates a clear API without exporting many
// separate components. Common in UI libraries (Radix, Headless UI).
