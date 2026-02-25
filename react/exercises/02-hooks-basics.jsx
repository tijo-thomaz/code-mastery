// =============================================================================
// 02 — Hooks Basics
// =============================================================================

import React, { useState, useEffect, useRef, useReducer } from "react";

// =============================================================================
// Exercise 1 — useState: Counter 🟢
// Create a `Counter` component with increment, decrement, and reset buttons.
// Display the current count.
// =============================================================================

// TODO: Create Counter component

// =============================================================================
// Exercise 2 — useState: Toggle 🟢
// Create a `ToggleSwitch` component that toggles between ON and OFF.
// Display different background colors for each state.
// =============================================================================

// TODO: Create ToggleSwitch component

// =============================================================================
// Exercise 3 — useState: Form 🟡
// Create a `SignupForm` with fields: name, email, password.
// Store all fields in a single state object.
// Display a summary below the form as the user types.
// Validate that email contains "@" and password is at least 8 characters.
// Show validation errors inline.
// =============================================================================

// TODO: Create SignupForm component

// =============================================================================
// Exercise 4 — useEffect: Fetch Data 🟡
// Create a `UserList` component that fetches users from
// https://jsonplaceholder.typicode.com/users on mount.
// Show a loading state while fetching.
// Display each user's name and email in a list.
// Handle errors gracefully.
// =============================================================================

// TODO: Create UserList component

// =============================================================================
// Exercise 5 — useEffect: Cleanup 🟡
// Create a `WindowSize` component that displays the current window width
// and height. Set up a resize event listener in useEffect.
// Clean it up properly on unmount.
// =============================================================================

// TODO: Create WindowSize component

// =============================================================================
// Exercise 6 — useEffect: Dependencies 🟡
// Create a `SearchFilter` component with a text input.
// When the user types, wait 300ms (debounce), then log
// "Searching for: <query>" to the console.
// Use useEffect with the search term as a dependency and
// clearTimeout in the cleanup function.
// =============================================================================

// TODO: Create SearchFilter component

// =============================================================================
// Exercise 7 — useRef: Focus Input 🟢
// Create a `AutoFocusInput` component with an input field and a
// "Focus" button. Clicking the button should focus the input.
// The input should also auto-focus on mount.
// =============================================================================

// TODO: Create AutoFocusInput component

// =============================================================================
// Exercise 8 — useReducer: Todo App 🔴
// Create a `TodoApp` component using useReducer.
// Actions: ADD_TODO, TOGGLE_TODO, DELETE_TODO, EDIT_TODO
// State shape: { todos: [{ id, text, done }], nextId: 1 }
// Include an input to add todos, and buttons to toggle/delete each todo.
// Add an edit mode: clicking a todo's text turns it into an input to rename it.
// =============================================================================

// const initialState = { todos: [], nextId: 1 };

// function todoReducer(state, action) {
//   switch (action.type) {
//     // TODO: implement cases
//   }
// }

// TODO: Create TodoApp component
