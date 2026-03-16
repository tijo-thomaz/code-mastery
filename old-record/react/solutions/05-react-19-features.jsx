// =============================================================================
// 05 — React 19 Features — SOLUTIONS
// =============================================================================

import React, { useState, useOptimistic, use, Suspense } from "react";
// import { useActionState } from "react";

// =============================================================================
// Exercise 1 — useActionState
// =============================================================================

async function submitFeedback(previousState, formData) {
  const feedback = formData.get("feedback");

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!feedback.trim()) {
    return { success: false, message: "Feedback cannot be empty." };
  }

  return { success: true, message: "Thanks for your feedback!" };
}

// export function FeedbackForm() {
//   const [state, formAction, isPending] = useActionState(submitFeedback, {
//     success: false,
//     message: "",
//   });
//
//   return (
//     <form action={formAction}>
//       <textarea name="feedback" placeholder="Your feedback..." required />
//       <button type="submit" disabled={isPending}>
//         {isPending ? "Submitting..." : "Submit"}
//       </button>
//       {state.message && (
//         <p style={{ color: state.success ? "green" : "red" }}>{state.message}</p>
//       )}
//     </form>
//   );
// }

// Explanation:
// useActionState replaces the pattern of useState + handleSubmit + loading state.
// It takes an async action function and initial state. Returns:
//   [state, formAction, isPending]
// The action receives (previousState, formData) and returns the new state.
// React automatically manages the pending state.

// =============================================================================
// Exercise 2 — useOptimistic
// =============================================================================

async function sendLike(currentLikes) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate 20% failure rate
  if (Math.random() < 0.2) {
    throw new Error("Failed to save like");
  }

  return currentLikes + 1;
}

export function LikeButton() {
  const [likes, setLikes] = useState(42);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes, _optimisticValue) => currentLikes + 1
  );
  const [error, setError] = useState(null);

  async function handleLike() {
    setError(null);
    addOptimisticLike(1);

    try {
      const newLikes = await sendLike(likes);
      setLikes(newLikes);
    } catch (err) {
      setError(err.message);
      // optimistic state automatically reverts when the transition ends
    }
  }

  return (
    <div>
      <button onClick={handleLike}>❤️ {optimisticLikes}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// Explanation:
// useOptimistic(actualState, updateFn) returns [optimisticState, addOptimistic].
// When addOptimistic is called, it immediately applies the updateFn to produce
// a temporary optimistic value. When the actual state updates (or the async
// action completes/errors), React reconciles back to the real state.

// =============================================================================
// Exercise 3 — use() Hook
// =============================================================================

const userPromise = fetch("https://jsonplaceholder.typicode.com/users/1").then(
  (res) => res.json()
);

function UserProfile() {
  const user = use(userPromise);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
}

export function UserProfileWrapper() {
  return (
    <Suspense fallback={<p>Loading user profile...</p>}>
      <UserProfile />
    </Suspense>
  );
}

// Explanation:
// use() can read a promise during render. It integrates with Suspense:
// while the promise is pending, React shows the Suspense fallback.
// When resolved, it renders the component with the data.
//
// Key rules:
// - The promise must be created OUTSIDE the component (or cached)
// - use() can be called conditionally (unlike other hooks)
// - use() also works with Context: use(MyContext) replaces useContext(MyContext)

// =============================================================================
// Exercise 4 — Server Components Concepts
// =============================================================================

// Q1: What is the difference between a Server Component and a Client Component?
//
// Server Components run ONLY on the server. They can:
//   - Directly access databases, file systems, and server-only APIs
//   - Not use hooks (useState, useEffect, etc.)
//   - Not use browser APIs (window, document)
//   - Not have event handlers (onClick, onChange)
// They produce serialized React output sent to the client (not JS bundles).
//
// Client Components run on the client (and optionally server for SSR). They:
//   - Use hooks and browser APIs
//   - Handle interactivity and event handlers
//   - Are marked with "use client" at the top of the file

// Q2: When do you add "use client" to a file?
//
// Add "use client" when the component needs:
//   - useState, useEffect, or any hooks
//   - Event handlers (onClick, onChange)
//   - Browser-only APIs (window, document, localStorage)
//   - Third-party libraries that use any of the above
// It marks the boundary — everything imported by a "use client" file
// is also treated as client code.

// Q3: Can a Server Component import a Client Component? Vice versa?
//
// ✅ Server Component CAN import Client Component — this is normal.
//    The server component renders the client component's placeholder,
//    and the client component hydrates on the client.
//
// ❌ Client Component CANNOT import Server Component directly.
//    But it CAN receive a Server Component as children (composition pattern):
//    // Server Component
//    <ClientWrapper>
//      <ServerChild />   ← this works!
//    </ClientWrapper>

// Q4: Pseudo Server Component
//
// async function ProductList() {
//   // Direct database access — no API route needed
//   const products = await db.query("SELECT * FROM products LIMIT 20");
//
//   return (
//     <div>
//       <h1>Products</h1>
//       <ul>
//         {products.map((p) => (
//           <li key={p.id}>
//             <span>{p.name} — ${p.price}</span>
//             <AddToCartButton productId={p.id} />  {/* Client Component */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// Q5: Pseudo Client Component
//
// "use client";
//
// import { useState } from "react";
//
// function AddToCartButton({ productId }) {
//   const [added, setAdded] = useState(false);
//
//   async function handleClick() {
//     await fetch("/api/cart", {
//       method: "POST",
//       body: JSON.stringify({ productId }),
//     });
//     setAdded(true);
//   }
//
//   return (
//     <button onClick={handleClick} disabled={added}>
//       {added ? "Added ✓" : "Add to Cart"}
//     </button>
//   );
// }
