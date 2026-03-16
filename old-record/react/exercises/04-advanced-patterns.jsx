// =============================================================================
// 04 — Advanced Patterns
// =============================================================================

import React, {
  createContext,
  useContext,
  useState,
  memo,
  useMemo,
  useCallback,
} from "react";

// =============================================================================
// Exercise 1 — Context API: Theme Switcher 🟡
// Create a ThemeContext with "light" and "dark" themes.
// Build ThemeProvider, useTheme hook, and a ThemedPage component.
// ThemedPage should have a button that toggles the theme.
// Apply background/text colors based on the current theme.
// =============================================================================

// TODO: Create ThemeContext
// TODO: Create ThemeProvider component
// TODO: Create useTheme hook
// TODO: Create ThemedPage component

// =============================================================================
// Exercise 2 — Compound Components 🔴
// Create an <Accordion> component with compound children:
//   <Accordion>
//     <Accordion.Item>
//       <Accordion.Header>Section 1</Accordion.Header>
//       <Accordion.Panel>Content for section 1</Accordion.Panel>
//     </Accordion.Item>
//     <Accordion.Item>
//       <Accordion.Header>Section 2</Accordion.Header>
//       <Accordion.Panel>Content for section 2</Accordion.Panel>
//     </Accordion.Item>
//   </Accordion>
// Only one panel should be open at a time.
// Use Context to share state between parent and children.
// =============================================================================

// TODO: Create Accordion compound component

// =============================================================================
// Exercise 3 — Render Props 🟡
// Create a `MouseTracker` component that tracks the mouse position
// and passes { x, y } to its children via a render prop.
// Usage:
//   <MouseTracker>
//     {({ x, y }) => <p>Mouse: {x}, {y}</p>}
//   </MouseTracker>
// =============================================================================

// TODO: Create MouseTracker component

// =============================================================================
// Exercise 4 — Higher-Order Component (HOC) 🟡
// Create a `withLoading` HOC that:
//   - Accepts a component and returns a new component
//   - The new component accepts an `isLoading` prop
//   - When isLoading is true, show "Loading..."
//   - Otherwise render the wrapped component with remaining props
// Usage:
//   const UserListWithLoading = withLoading(UserList);
//   <UserListWithLoading isLoading={true} users={[]} />
// =============================================================================

// TODO: Create withLoading HOC

// =============================================================================
// Exercise 5 — Error Boundary 🔴
// Create a class-based ErrorBoundary component.
// It should catch errors in its children and display a fallback UI:
//   "Something went wrong: {error.message}"
// Include a "Try Again" button that resets the error state.
// Also create a `BuggyComponent` that throws an error when a button is clicked.
// =============================================================================

// TODO: Create ErrorBoundary class component
// TODO: Create BuggyComponent to test it

// =============================================================================
// Exercise 6 — React.memo Optimization 🟡
// Create a parent component with a counter and a text input.
// Create an `ExpensiveList` child that receives a `items` array prop.
// Wrap ExpensiveList in React.memo.
// Demonstrate that typing in the text input does NOT re-render ExpensiveList.
// Use console.log inside ExpensiveList to verify renders.
// =============================================================================

// TODO: Create ExpensiveList component (memoized)
// TODO: Create MemoDemo parent component
