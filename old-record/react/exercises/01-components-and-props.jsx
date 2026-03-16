// =============================================================================
// 01 — Components & Props
// =============================================================================

import React from "react";

// =============================================================================
// Exercise 1 — Functional Component 🟢
// Create a `Greeting` component that accepts a `name` prop and renders:
//   <h1>Hello, {name}!</h1>
// If no name is provided, default to "World".
// =============================================================================

// TODO: Create the Greeting component
// export function Greeting({ name }) { ... }

// =============================================================================
// Exercise 2 — Props Drilling 🟡
// Build a 3-level component tree: App → UserPanel → UserAvatar
// Pass a `user` object ({ name, avatarUrl, role }) from App down to UserAvatar.
// UserPanel should display the name and role.
// UserAvatar should display an <img> with the avatarUrl.
// =============================================================================

// TODO: Create UserAvatar component
// TODO: Create UserPanel component that renders UserAvatar
// TODO: Create UserApp component that renders UserPanel

// =============================================================================
// Exercise 3 — Children Prop 🟢
// Create a `Card` component that wraps its children in a styled container:
//   <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
//     {children}
//   </div>
// Then create a `CardWithTitle` that accepts a `title` prop and renders
// it as an <h2> above the children.
// =============================================================================

// TODO: Create Card component
// TODO: Create CardWithTitle component

// =============================================================================
// Exercise 4 — Conditional Rendering 🟢
// Create a `StatusBadge` component that accepts a `status` prop
// ("online", "offline", "away") and renders a colored dot with text:
//   online  → green dot + "Online"
//   offline → gray dot  + "Offline"
//   away    → yellow dot + "Away"
// Use a mapping object, not if/else chains.
// =============================================================================

// TODO: Create StatusBadge component

// =============================================================================
// Exercise 5 — List Rendering with Keys 🟢
// Create a `TodoList` component that accepts a `todos` array:
//   [{ id: 1, text: "Learn React", done: false }, ...]
// Render each todo as an <li>. Use `id` as the key.
// Completed todos should have a line-through style.
// =============================================================================

// TODO: Create TodoList component

// =============================================================================
// Exercise 6 — Component Composition 🟡
// Build a `Page` layout using composition:
//   <Page>
//     <Page.Header>My Site</Page.Header>
//     <Page.Body>
//       <p>Welcome!</p>
//     </Page.Body>
//     <Page.Footer>© 2026</Page.Footer>
//   </Page>
// Use dot-notation sub-components (attach them as properties on Page).
// =============================================================================

// TODO: Create Page component with Header, Body, Footer sub-components
