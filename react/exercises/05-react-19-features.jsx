// =============================================================================
// 05 — React 19 Features
// =============================================================================
// Note: These exercises require React 19+. Some features (server components)
// are conceptual and need a framework like Next.js to run fully.
// =============================================================================

import React, { useState, useOptimistic, use } from "react";
// useActionState is imported from "react" in React 19
// import { useActionState } from "react";

// =============================================================================
// Exercise 1 — useActionState 🟡
// Create a `FeedbackForm` component that submits feedback to a simulated API.
// Use useActionState to manage the form submission state.
// The action should:
//   - Accept the previous state and formData
//   - Simulate a 1-second network delay
//   - Return { success: true, message: "Thanks for your feedback!" }
//   - Show a pending state while submitting
// =============================================================================

// async function submitFeedback(previousState, formData) {
//   // TODO: simulate API call, return new state
// }

// TODO: Create FeedbackForm component using useActionState

// =============================================================================
// Exercise 2 — useOptimistic 🔴
// Create a `LikeButton` component that optimistically updates a like count.
// When the user clicks "Like":
//   1. Immediately show the incremented count (optimistic update)
//   2. Send the update to a simulated API (1-second delay)
//   3. If the API fails, the count should revert automatically
// =============================================================================

// async function sendLike(currentLikes) {
//   // TODO: simulate API call that sometimes fails
// }

// TODO: Create LikeButton component using useOptimistic

// =============================================================================
// Exercise 3 — use() Hook 🟡
// Create a component that uses the `use()` hook to read a promise.
// Wrap it in <Suspense> for the loading state.
//
// Steps:
//   1. Create a function that returns a promise fetching a user
//   2. Call it OUTSIDE the component (so it's not recreated each render)
//   3. Inside the component, call use(promise) to read the value
//   4. Wrap the component in <Suspense fallback={<p>Loading...</p>}>
// =============================================================================

// const userPromise = fetch("https://jsonplaceholder.typicode.com/users/1")
//   .then((res) => res.json());

// TODO: Create UserProfile component using use()
// TODO: Create wrapper component with Suspense

// =============================================================================
// Exercise 4 — Server Components Concepts 🔴
// This is a conceptual exercise. Answer the questions in comments and write
// pseudo-code demonstrating the patterns.
//
// Q1: What is the difference between a Server Component and a Client Component?
// Q2: When do you add "use client" to a file?
// Q3: Can a Server Component import a Client Component? Vice versa?
// Q4: Write a pseudo Server Component that fetches data and renders a list.
// Q5: Write the matching Client Component that handles interactivity.
// =============================================================================

// TODO: Answer Q1-Q3 in comments

// TODO: Write pseudo Server Component (Q4)
// e.g., async function ProductList() { ... }

// TODO: Write pseudo Client Component (Q5)
// e.g., "use client"; function AddToCartButton({ productId }) { ... }
