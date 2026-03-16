// ========================================
// DAY 8 — 5 GOLANG DRILLS
// ========================================
// Run: go run drills/day8-go.go

package main

import (
	"fmt"
	"sync"
)

// ---- DRILL 1: Worker Pool (8 min) ----
// 3 workers read from jobs channel, process (double the number), write to results.
// Use WaitGroup. Close results when done.

func workerPool() {
	// YOUR SOLUTION:

}

// ---- DRILL 2: Frequency Count with Map (3 min) ----
// Count occurrences of each word in a slice.
// Input:  ["go", "is", "go", "fast", "is"]
// Output: map[go:2 is:2 fast:1]

func frequencyCount(words []string) map[string]int {
	// YOUR SOLUTION:
	return nil
}

// ---- DRILL 3: Generic GroupBy (5 min) ----
// Group a slice of strings by their first letter.
// Input:  ["apple", "avocado", "banana", "blueberry", "cherry"]
// Output: map[a:[apple avocado] b:[banana blueberry] c:[cherry]]

func groupByFirstLetter(words []string) map[byte][]string {
	// YOUR SOLUTION:
	return nil
}

// ---- DRILL 4: Safe Counter with Mutex (5 min) ----
// Increment a counter from 100 goroutines. Must be goroutine-safe.
// Final count should be exactly 100.

func safeCounter() int {
	// YOUR SOLUTION:
	return 0
}

// ---- DRILL 5: Context Timeout (8 min) ----
// Simulate a slow operation (2 sec). Cancel it if it takes longer than 1 sec.
// Print "timeout" if cancelled, "done" if completed.
// Hint: use context.WithTimeout + select

func contextTimeout() {
	// YOUR SOLUTION:

}

func main() {
	fmt.Println("=== Worker Pool ===")
	workerPool()

	fmt.Println("\n=== Frequency Count ===")
	fmt.Println(frequencyCount([]string{"go", "is", "go", "fast", "is"}))

	fmt.Println("\n=== GroupBy First Letter ===")
	fmt.Println(groupByFirstLetter([]string{"apple", "avocado", "banana", "blueberry", "cherry"}))

	fmt.Println("\n=== Safe Counter ===")
	fmt.Println(safeCounter())

	fmt.Println("\n=== Context Timeout ===")
	contextTimeout()
}

// ========================================
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
