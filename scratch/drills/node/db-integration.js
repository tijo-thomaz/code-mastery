// GAP #7 — Node.js + Database Integration
// Build from scratch. No peeking. Timer: 10 min.
//
// Requirements:
// 1. Set up a connection pool (pg library)
// 2. Write a parameterized query (prevent SQL injection)
// 3. Write a transaction (BEGIN, operations, COMMIT/ROLLBACK)
// 4. Write a basic Express route that queries the DB
//
// Key patterns:
// - new Pool({ connectionString, max: 20 })
// - pool.query('SELECT * FROM users WHERE id = $1', [id])
// - client = await pool.connect() → BEGIN → queries → COMMIT → client.release()
// - ALWAYS use parameterized queries ($1, $2) — NEVER string concatenation
// - ALWAYS release client in finally block
//
// DELETE THIS COMMENT BLOCK BEFORE YOU START. TYPE FROM MEMORY.

const express = require('express');
const { Pool } = require('pg');

// YOUR CODE BELOW
