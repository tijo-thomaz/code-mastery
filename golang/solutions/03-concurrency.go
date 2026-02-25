package main

import (
	"fmt"
	"sync"
	"time"
)

// Exercise 1: Goroutines
// WaitGroup is preferred over time.Sleep for synchronization.
func launchGoroutines() {
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			fmt.Printf("Hello from goroutine %d\n", id)
		}(i)
	}
	wg.Wait()
}

// Exercise 2: Channels
// Closing the channel signals the receiver that no more values will be sent.
// range over a channel reads until it's closed.
func channelSum() int {
	ch := make(chan int, 5) // buffered channel

	go func() {
		for i := 1; i <= 5; i++ {
			ch <- i
		}
		close(ch)
	}()

	sum := 0
	for v := range ch {
		sum += v
	}
	return sum
}

// Exercise 3: Select Statement
// Select blocks until one case is ready. If both are ready simultaneously,
// Go picks one at random.
func pingPong() string {
	ping := make(chan string)
	pong := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ping <- "ping"
	}()

	go func() {
		time.Sleep(200 * time.Millisecond)
		pong <- "pong"
	}()

	select {
	case msg := <-ping:
		return msg
	case msg := <-pong:
		return msg
	}
}

// Exercise 4: WaitGroup
// Mutex protects the shared slice from concurrent write corruption.
func concurrentCollect(n int) []int {
	var (
		wg     sync.WaitGroup
		mu     sync.Mutex
		result []int
	)

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			mu.Lock()
			result = append(result, id)
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	return result
}

// Exercise 5: Mutex
// SafeCounter wraps a mutex with the data it protects — idiomatic Go pattern.
type SafeCounter struct {
	mu    sync.Mutex
	count int
}

func (sc *SafeCounter) Increment() {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	sc.count++
}

func (sc *SafeCounter) Value() int {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	return sc.count
}

// Exercise 6: Worker Pool
// Classic fan-out pattern: multiple workers read from a single jobs channel.
// The dispatcher closes jobs when done; workers close results via WaitGroup.
func workerPool(jobs []int, numWorkers int) []int {
	jobsCh := make(chan int, len(jobs))
	resultsCh := make(chan int, len(jobs))

	// Start workers
	var wg sync.WaitGroup
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobsCh {
				resultsCh <- job * job
			}
		}()
	}

	// Send jobs
	for _, j := range jobs {
		jobsCh <- j
	}
	close(jobsCh)

	// Close results after all workers finish
	go func() {
		wg.Wait()
		close(resultsCh)
	}()

	// Collect results
	var results []int
	for r := range resultsCh {
		results = append(results, r)
	}
	return results
}

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
