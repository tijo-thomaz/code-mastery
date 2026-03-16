// GAP #1, #2, #3 — Dynamic Table Builder
// Build this from scratch. No peeking. Timer: 15 min.
//
// Requirements:
// 1. Render a table from JSON (any shape — don't hardcode keys)
// 2. Delete a row
// 3. Toggle columns (show/hide)
//
// Key patterns:
// - Object.keys(data[0]) for dynamic columns
// - item[key] for dynamic access (NOT item.name, item.age)
// - ({child, index}) for props — destructure with {}
// - <tr> wraps <td>, never the reverse
//
// DELETE THIS COMMENT BLOCK BEFORE YOU START. TYPE FROM MEMORY.

import React from 'react';

const data = [
  { eid: 1, name: "Sam", age: 20, job: "SE", place: "Delhi", country: "India" },
  { eid: 2, name: "Alex", age: 23, job: "SE", place: "UP", country: "India" },
  { eid: 3, name: "Marc", age: 23, job: "SE", place: "Ontario", country: "Canada" },
];

// YOUR CODE BELOW — build the full App component
