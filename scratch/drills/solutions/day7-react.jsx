// ========================================
// DAY 7 — 5 REACT DRILLS (All builds that failed in interviews)
// ========================================

// ---- DRILL 1: File Explorer — Recursive Tree (12 min) ----
// Render a nested folder structure. Click folder to expand/collapse.
// This is the Infosys question you failed.

const fileData = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'index.js', type: 'file' },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'App.jsx', type: 'file' },
          { name: 'Header.jsx', type: 'file' },
        ],
      },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

function FileExplorer({ data }) {
  // YOUR SOLUTION:

}

function FileItem({ item }) {
  // Handle folder (expandable) vs file
  // Hint: folder needs local state for expanded/collapsed

}


// ---- DRILL 2: Debounced Search (10 min) ----
// Input field that searches after user stops typing for 500ms.
// Show loading state while "fetching".
// Display results as a list.

function DebouncedSearch() {

}


// ---- DRILL 3: Star Rating (8 min) ----
// 5 stars. Click to rate. Hover to preview. Display "3/5".

function StarRating({ maxStars = 5 }) {

}


// ---- DRILL 4: Modal with Portal (8 min) ----
// Button opens a modal overlay. Click outside or X to close.
// Must use createPortal.

function Modal({ isOpen, onClose, children }) {

}

function ModalDemo() {

}


// ---- DRILL 5: useReducer Todo (10 min) ----
// Rewrite the Day 3 todo using useReducer instead of useState.
// Actions: ADD, DELETE, TOGGLE

const todoReducer = (state, action) => {

};

function TodoReducer() {

}


// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
