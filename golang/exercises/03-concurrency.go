package main

import (
	"fmt"
	"sync"
	"time"
)

// =============================================================================
// Exercise 1: Goroutines
// Launch 5 goroutines, each printing "Hello from goroutine <i>".
// Use time.Sleep or sync.WaitGroup to wait for them to finish.
// =============================================================================

func launchGoroutines() {
	// TODO: Implement
}

// =============================================================================
// Exercise 2: Channels (Unbuffered & Buffered)
// Write a function that:
//   a) Creates an unbuffered channel.
//   b) Spawns a goroutine that sends the numbers 1-5 into the channel then closes it.
//   c) Reads from the channel in main and returns the sum.
// Then modify to use a buffered channel of capacity 5.
// =============================================================================

func channelSum() int {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 3: Select Statement
// Create two channels. Spawn two goroutines:
//   - One sends "ping" after 100ms
//   - One sends "pong" after 200ms
// Use select to receive whichever arrives first and return it.
// =============================================================================

func pingPong() string {
	// TODO: Implement
	return ""
}

// =============================================================================
// Exercise 4: WaitGroup
// Launch n goroutines that each append their index to a shared slice (use mutex).
// Use sync.WaitGroup to wait for all to finish.
// Return the slice (order doesn't matter).
// =============================================================================

func concurrentCollect(n int) []int {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 5: Mutex
// Implement a thread-safe counter using sync.Mutex.
// SafeCounter has methods Increment() and Value() int.
// =============================================================================

type SafeCounter struct {
	// TODO: Add fields (mu sync.Mutex, count int)
}

func (sc *SafeCounter) Increment() {
	// TODO: Implement
}

func (sc *SafeCounter) Value() int {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 6: Worker Pool
// Implement a worker pool:
//   - jobs channel receives integers
//   - numWorkers goroutines read from jobs, square the number, send to results
//   - Collect all results and return them as a slice
// =============================================================================

func workerPool(jobs []int, numWorkers int) []int {
	// TODO: Implement
	return nil
}

// Silence the import if unused during development
var _ = time.Sleep
var _ = sync.Mutex{}

func main() {
	// Exercise 1
	fmt.Println("=== Exercise 1: Goroutines ===")
	launchGoroutines()

	// Exercise 2
	fmt.Println("\n=== Exercise 2: Channels ===")
	fmt.Printf("Channel sum: %d\n", channelSum())

	// Exercise 3
	fmt.Println("\n=== Exercise 3: Select ===")
	fmt.Printf("First received: %s\n", pingPong())

	// Exercise 4
	fmt.Println("\n=== Exercise 4: WaitGroup ===")
	fmt.Printf("Collected: %v\n", concurrentCollect(5))

	// Exercise 5
	fmt.Println("\n=== Exercise 5: Mutex ===")
	sc := &SafeCounter{}
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			sc.Increment()
		}()
	}
	wg.Wait()
	fmt.Printf("Counter: %d\n", sc.Value())

	// Exercise 6
	fmt.Println("\n=== Exercise 6: Worker Pool ===")
	results := workerPool([]int{1, 2, 3, 4, 5, 6, 7, 8}, 3)
	fmt.Printf("Squared results: %v\n", results)
}
