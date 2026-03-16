# 🐹 GO HANDS-ON DRILL — Interview Coding Problems

> **Purpose:** Type each from memory. These are the TOP problems asked in Go interviews in India 2025.
> **Strategy:** Read solution → close file → type from memory → compare → repeat until < 3 min each.
> **You already know these in JS.** This is about Go syntax fluency, not problem-solving.

---

## PROBLEM 1: Fibonacci (Iterative)

> **Why asked:** Tests loops, slices, basic Go syntax. Warm-up problem.

```go
package main

import "fmt"

func fibonacci(n int) []int {
	if n <= 0 {
		return []int{}
	}
	fib := make([]int, n)
	fib[0] = 0
	if n > 1 {
		fib[1] = 1
	}
	for i := 2; i < n; i++ {
		fib[i] = fib[i-1] + fib[i-2]
	}
	return fib
}

func main() {
	fmt.Println(fibonacci(10)) // [0 1 1 2 3 5 8 13 21 34]
}
```

**JS equivalent you know:** `const fib = (n) => { let a = 0, b = 1; ... }`
**Go difference:** Use `make([]int, n)` to pre-allocate slice with known size.

---

## PROBLEM 2: Fibonacci (Recursive + Memoization)

> **Why asked:** Tests recursion, maps, closures. Follow-up to Problem 1.

```go
package main

import "fmt"

func fibMemo() func(int) int {
	cache := map[int]int{}
	var fib func(int) int
	fib = func(n int) int {
		if n <= 1 {
			return n
		}
		if val, ok := cache[n]; ok {
			return val
		}
		cache[n] = fib(n-1) + fib(n-2)
		return cache[n]
	}
	return fib
}

func main() {
	fib := fibMemo()
	for i := 0; i < 10; i++ {
		fmt.Printf("fib(%d) = %d\n", i, fib(i))
	}
}
```

**Go patterns shown:** Closure returning function, `map[int]int`, comma-ok idiom.

---

## PROBLEM 3: Balanced Brackets

> **Why asked:** Tests stack logic, rune handling, maps. Very common in Indian interviews.

```go
package main

import "fmt"

func isBalanced(s string) bool {
	stack := []rune{}
	pairs := map[rune]rune{
		')': '(',
		']': '[',
		'}': '{',
	}

	for _, ch := range s {
		switch ch {
		case '(', '[', '{':
			stack = append(stack, ch)
		case ')', ']', '}':
			if len(stack) == 0 || stack[len(stack)-1] != pairs[ch] {
				return false
			}
			stack = stack[:len(stack)-1] // pop
		}
	}
	return len(stack) == 0
}

func main() {
	fmt.Println(isBalanced("({[]})"))  // true
	fmt.Println(isBalanced("({[})"))   // false
	fmt.Println(isBalanced(""))        // true
	fmt.Println(isBalanced("(("))      // false
}
```

**Go patterns shown:** `range` over string gives runes, slice as stack, `stack[:len-1]` to pop.
**JS equivalent:** Same logic but `s.split('')` + array push/pop.

---

## PROBLEM 4: In-Memory Key-Value Store (CRUD)

> **Why asked:** Tests maps, struct methods, error handling, Go idioms. Can extend to concurrent.

```go
package main

import (
	"errors"
	"fmt"
)

type Store struct {
	data map[string]string
}

func NewStore() *Store {
	return &Store{data: make(map[string]string)}
}

func (s *Store) Set(key, value string) {
	s.data[key] = value
}

func (s *Store) Get(key string) (string, error) {
	val, ok := s.data[key]
	if !ok {
		return "", errors.New("key not found: " + key)
	}
	return val, nil
}

func (s *Store) Delete(key string) bool {
	_, ok := s.data[key]
	if ok {
		delete(s.data, key)
	}
	return ok
}

func (s *Store) Keys() []string {
	keys := make([]string, 0, len(s.data))
	for k := range s.data {
		keys = append(keys, k)
	}
	return keys
}

func main() {
	store := NewStore()
	store.Set("name", "Tijo")
	store.Set("role", "Lead")

	val, err := store.Get("name")
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("name =", val) // name = Tijo
	}

	fmt.Println("Keys:", store.Keys())      // Keys: [name role]
	fmt.Println("Deleted:", store.Delete("role")) // Deleted: true
	fmt.Println("Keys:", store.Keys())      // Keys: [name]
}
```

**Go patterns shown:** Constructor with `New*`, pointer receiver, comma-ok, `errors.New`, `make` with capacity.

**EXTENSION — Make it concurrent-safe (if interviewer asks):**
```go
import "sync"

type SafeStore struct {
	mu   sync.RWMutex
	data map[string]string
}

func (s *SafeStore) Get(key string) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	if !ok {
		return "", errors.New("key not found")
	}
	return val, nil
}

func (s *SafeStore) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = value
}
```

---

## PROBLEM 5: Two Sum

> **Why asked:** #1 most asked DSA problem globally. Tests map usage in Go.

```go
package main

import "fmt"

func twoSum(nums []int, target int) (int, int, bool) {
	seen := make(map[int]int) // value → index
	for i, num := range nums {
		complement := target - num
		if j, ok := seen[complement]; ok {
			return j, i, true
		}
		seen[num] = i
	}
	return 0, 0, false
}

func main() {
	i, j, found := twoSum([]int{2, 7, 11, 15}, 9)
	if found {
		fmt.Printf("Indices: %d, %d\n", i, j) // Indices: 0, 1
	}
}
```

**Go pattern shown:** Multiple return values, comma-ok idiom on map.

---

## PROBLEM 6: Reverse a String (Rune-Safe)

> **Why asked:** Tests Go's string/rune distinction. Classic Go-specific trap.

```go
package main

import "fmt"

func reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func main() {
	fmt.Println(reverse("hello"))  // olleh
	fmt.Println(reverse("Go🐹"))   // 🐹oG  ← rune-safe!
}
```

**⚠️ TRAP:** `s[i]` gives bytes, NOT characters. Always convert to `[]rune` first.
**Go swap:** `a, b = b, a` — no temp variable needed.

---

## PROBLEM 7: Find Duplicates in Slice

> **Why asked:** Tests map as set, slice iteration. Common warmup.

```go
package main

import "fmt"

func findDuplicates(nums []int) []int {
	seen := make(map[int]bool)
	dupes := []int{}
	for _, n := range nums {
		if seen[n] {
			dupes = append(dupes, n)
		} else {
			seen[n] = true
		}
	}
	return dupes
}

func main() {
	fmt.Println(findDuplicates([]int{1, 2, 3, 2, 4, 3, 5})) // [2 3]
}
```

**Go pattern:** `map[int]bool` as a set. Zero value of bool is `false`, so missing key = not seen.

---

## PROBLEM 8: Palindrome Check

> **Why asked:** String manipulation, two pointers, rune handling.

```go
package main

import (
	"fmt"
	"strings"
	"unicode"
)

func isPalindrome(s string) bool {
	s = strings.ToLower(s)
	runes := []rune{}
	for _, r := range s {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			runes = append(runes, r)
		}
	}
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		if runes[i] != runes[j] {
			return false
		}
	}
	return true
}

func main() {
	fmt.Println(isPalindrome("A man, a plan, a canal: Panama")) // true
	fmt.Println(isPalindrome("hello"))                          // false
}
```

**Go patterns shown:** `unicode.IsLetter`, `strings.ToLower`, two-pointer technique.

---

## PROBLEM 9: Merge Two Sorted Slices

> **Why asked:** Tests slice manipulation, two-pointer merge. Common DSA.

```go
package main

import "fmt"

func mergeSorted(a, b []int) []int {
	result := make([]int, 0, len(a)+len(b))
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		if a[i] <= b[j] {
			result = append(result, a[i])
			i++
		} else {
			result = append(result, b[j])
			j++
		}
	}
	result = append(result, a[i:]...)
	result = append(result, b[j:]...)
	return result
}

func main() {
	fmt.Println(mergeSorted([]int{1, 3, 5}, []int{2, 4, 6})) // [1 2 3 4 5 6]
}
```

**Go pattern shown:** `make` with capacity hint, `a[i:]...` to spread remaining slice.

---

## PROBLEM 10: FizzBuzz (Classic Warmup)

> **Why asked:** Literally the first question some interviewers ask. Takes 60 seconds.

```go
package main

import "fmt"

func fizzBuzz(n int) {
	for i := 1; i <= n; i++ {
		switch {
		case i%15 == 0:
			fmt.Println("FizzBuzz")
		case i%3 == 0:
			fmt.Println("Fizz")
		case i%5 == 0:
			fmt.Println("Buzz")
		default:
			fmt.Println(i)
		}
	}
}

func main() {
	fizzBuzz(15)
}
```

**Go pattern shown:** `switch` without condition (like `switch true`). Clean alternative to if-else chain.

---

## PROBLEM 11: Flatten Nested Slice (Recursive)

> **Why asked:** Tests `interface{}`, type assertion, recursion. Go-specific challenge.

```go
package main

import "fmt"

func flatten(input []any) []any {
	result := []any{}
	for _, item := range input {
		if nested, ok := item.([]any); ok {
			result = append(result, flatten(nested)...)
		} else {
			result = append(result, item)
		}
	}
	return result
}

func main() {
	nested := []any{1, []any{2, 3}, []any{4, []any{5, 6}}}
	fmt.Println(flatten(nested)) // [1 2 3 4 5 6]
}
```

**Go pattern shown:** `any` (alias for `interface{}`), type assertion with comma-ok, spread with `...`.

---

## PROBLEM 12: Anagram Check

> **Why asked:** Map counting, string comparison. Quick problem.

```go
package main

import "fmt"

func isAnagram(a, b string) bool {
	if len(a) != len(b) {
		return false
	}
	count := make(map[rune]int)
	for _, ch := range a {
		count[ch]++
	}
	for _, ch := range b {
		count[ch]--
		if count[ch] < 0 {
			return false
		}
	}
	return true
}

func main() {
	fmt.Println(isAnagram("listen", "silent")) // true
	fmt.Println(isAnagram("hello", "world"))   // false
}
```

---

## ⚡ DRILL ORDER — Tonight & Tomorrow

### TONIGHT (if time, else skip to tomorrow):
```
Just READ Problems 1-4. Don't type yet. Absorb the Go shapes.
```

### TOMORROW MORNING (8:30-9:00 slot):
```
Priority A — Type from memory (MUST DO):
  ✅ P1: Fibonacci iterative           — target < 2 min
  ✅ P3: Balanced brackets             — target < 3 min
  ✅ P4: In-memory store (basic)       — target < 3 min
  ✅ P5: Two Sum                       — target < 2 min

Priority B — If time permits:
  ⚠️ P6: Reverse string (rune-safe)   — target < 1 min
  ⚠️ P7: Find duplicates              — target < 1 min
  ⚠️ P10: FizzBuzz                    — target < 1 min

Skip unless asked:
  ⛔ P2, P8, P9, P11, P12 — know them conceptually, don't drill
```

---

## 🧠 GO SYNTAX PATTERNS TO INTERNALIZE

```
SLICE AS STACK:
  push:  stack = append(stack, val)
  pop:   val = stack[len(stack)-1]; stack = stack[:len(stack)-1]
  peek:  stack[len(stack)-1]
  empty: len(stack) == 0

MAP AS SET:
  seen := make(map[int]bool)
  seen[val] = true
  if seen[val] { ... }

MULTIPLE RETURNS:
  func foo() (int, error) { return 42, nil }
  val, err := foo()

TWO POINTERS:
  for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 { ... }

SWAP:
  a, b = b, a    // no temp needed

PRE-ALLOCATE:
  make([]int, n)           // length n, zero-filled
  make([]int, 0, n)        // length 0, capacity n (for append)

STRING ↔ RUNE:
  runes := []rune(s)       // string to rune slice
  str := string(runes)     // rune slice to string
```

---

> **You know all these problems in JS. This drill is ONLY about Go syntax muscle memory.**
> **Read → Close → Type → Compare → Repeat. You'll be fast by morning. 🐹🔥**

---

## PROBLEM 13: Binary Search

> **Why asked:** Classic algorithm. Tests iterative logic + edge cases in Go.
> **Interview Q:** "Implement binary search on a sorted slice."

```go
func binarySearch(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		} else if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}
```

**Go pattern shown:** `lo + (hi-lo)/2` avoids integer overflow vs `(lo+hi)/2`.

---

## PROBLEM 14: Remove Duplicates from Sorted Slice

> **Why asked:** In-place slice manipulation. Tests two-pointer + slice reslicing.
> **Interview Q:** "Given a sorted slice, remove duplicates in-place and return the new length."

```go
func removeDuplicates(nums []int) []int {
	if len(nums) == 0 {
		return nums
	}
	j := 0
	for i := 1; i < len(nums); i++ {
		if nums[i] != nums[j] {
			j++
			nums[j] = nums[i]
		}
	}
	return nums[:j+1]
}
```

---

## PROBLEM 15: Factorial (Recursive + Iterative)

> **Why asked:** Basic recursion test. Often a warmup.
> **Interview Q:** "Write both recursive and iterative factorial."

```go
func factorialRecursive(n int) int {
	if n <= 1 {
		return 1
	}
	return n * factorialRecursive(n-1)
}

func factorialIterative(n int) int {
	result := 1
	for i := 2; i <= n; i++ {
		result *= i
	}
	return result
}
```

---

## PROBLEM 16: Stack with Min (O(1) min lookup)

> **Why asked:** Tests data structure design. Very common in Indian interviews.
> **Interview Q:** "Implement a stack that supports push, pop, and getMin in O(1)."

```go
type MinStack struct {
	stack    []int
	minStack []int
}

func NewMinStack() *MinStack {
	return &MinStack{}
}

func (s *MinStack) Push(val int) {
	s.stack = append(s.stack, val)
	if len(s.minStack) == 0 || val <= s.minStack[len(s.minStack)-1] {
		s.minStack = append(s.minStack, val)
	}
}

func (s *MinStack) Pop() int {
	if len(s.stack) == 0 {
		return -1
	}
	top := s.stack[len(s.stack)-1]
	s.stack = s.stack[:len(s.stack)-1]
	if top == s.minStack[len(s.minStack)-1] {
		s.minStack = s.minStack[:len(s.minStack)-1]
	}
	return top
}

func (s *MinStack) GetMin() int {
	if len(s.minStack) == 0 {
		return -1
	}
	return s.minStack[len(s.minStack)-1]
}
```

**Go pattern shown:** Two slices as stacks. Second stack tracks minimums.

---

## PROBLEM 17: LRU Cache (Senior-Level — Most Asked!)

> **Why asked:** THE most asked senior Go interview problem. Tests map + doubly linked list.
> **Interview Q:** "Implement an LRU cache with Get and Put in O(1)."

```go
type entry struct {
	key        string
	value      string
	prev, next *entry
}

type LRUCache struct {
	capacity   int
	items      map[string]*entry
	head, tail *entry
}

func NewLRUCache(capacity int) *LRUCache {
	head := &entry{}
	tail := &entry{}
	head.next = tail
	tail.prev = head
	return &LRUCache{
		capacity: capacity,
		items:    make(map[string]*entry),
		head:     head,
		tail:     tail,
	}
}

func (c *LRUCache) remove(e *entry) {
	e.prev.next = e.next
	e.next.prev = e.prev
}

func (c *LRUCache) addToFront(e *entry) {
	e.next = c.head.next
	e.prev = c.head
	c.head.next.prev = e
	c.head.next = e
}

func (c *LRUCache) Get(key string) (string, bool) {
	if e, ok := c.items[key]; ok {
		c.remove(e)
		c.addToFront(e)
		return e.value, true
	}
	return "", false
}

func (c *LRUCache) Put(key, value string) {
	if e, ok := c.items[key]; ok {
		e.value = value
		c.remove(e)
		c.addToFront(e)
		return
	}
	e := &entry{key: key, value: value}
	c.items[key] = e
	c.addToFront(e)
	if len(c.items) > c.capacity {
		oldest := c.tail.prev
		c.remove(oldest)
		delete(c.items, oldest.key)
	}
}
```

**NARRATE:** "I use a hashmap for O(1) lookup and a doubly linked list for O(1) insert/remove. Most recently used goes to front, evict from tail when full."

---

## PROBLEM 18: Simple Rate Limiter (Token Bucket)

> **Why asked:** Tests concurrency + time handling. Very relevant for backend/architect roles.
> **Interview Q:** "Implement a rate limiter that allows N requests per second."

```go
import (
	"sync"
	"time"
)

type RateLimiter struct {
	mu         sync.Mutex
	tokens     int
	maxTokens  int
	refillRate int
	lastRefill time.Time
}

func NewRateLimiter(maxTokens, refillRate int) *RateLimiter {
	return &RateLimiter{
		tokens:     maxTokens,
		maxTokens:  maxTokens,
		refillRate: refillRate,
		lastRefill: time.Now(),
	}
}

func (rl *RateLimiter) Allow() bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(rl.lastRefill)
	newTokens := int(elapsed.Seconds()) * rl.refillRate
	if newTokens > 0 {
		rl.tokens += newTokens
		if rl.tokens > rl.maxTokens {
			rl.tokens = rl.maxTokens
		}
		rl.lastRefill = now
	}

	if rl.tokens > 0 {
		rl.tokens--
		return true
	}
	return false
}
```

**NARRATE:** "Token bucket — start with N tokens, consume one per request, refill at fixed rate. Mutex for thread safety. If no tokens left, reject."

---

## PROBLEM 19: Longest Substring Without Repeating Characters

> **Why asked:** Sliding window pattern. Top LeetCode problem. Tests map + string in Go.
> **Interview Q:** "Find the length of the longest substring without repeating characters."

```go
func lengthOfLongestSubstring(s string) int {
	seen := make(map[byte]int)
	maxLen := 0
	left := 0
	for right := 0; right < len(s); right++ {
		if idx, ok := seen[s[right]]; ok && idx >= left {
			left = idx + 1
		}
		seen[s[right]] = right
		if right-left+1 > maxLen {
			maxLen = right - left + 1
		}
	}
	return maxLen
}
```

**Go pattern shown:** Sliding window with `left`/`right` pointers + map for last seen index.

---

## PROBLEM 20: Concurrent-Safe Counter with WaitGroup

> **Why asked:** Tests goroutines + sync primitives. THE concurrency hello-world.
> **Interview Q:** "Increment a counter from 1000 goroutines safely. What's wrong with naive approach?"

```go
import (
	"fmt"
	"sync"
	"sync/atomic"
)

// WRONG — data race
func wrongCounter() {
	var count int
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			count++ // DATA RACE!
		}()
	}
	wg.Wait()
	fmt.Println("Wrong:", count) // random number < 1000
}

// FIX 1 — Mutex
func mutexCounter() {
	var count int
	var mu sync.Mutex
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			count++
			mu.Unlock()
		}()
	}
	wg.Wait()
	fmt.Println("Mutex:", count) // always 1000
}

// FIX 2 — Atomic (preferred for simple counters)
func atomicCounter() {
	var count int64
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			atomic.AddInt64(&count, 1)
		}()
	}
	wg.Wait()
	fmt.Println("Atomic:", count) // always 1000
}
```

**NARRATE:** "Naive count++ is a data race — read-modify-write isn't atomic. Fix with Mutex (general) or sync/atomic (simple counters). Detect with `go run -race`."

---

## 🎯 INTERVIEW QUESTION PROMPTS FOR ALL PROBLEMS

> These are the exact ways interviewers phrase these problems:

```
WARM-UP:
  "Write a function that returns the first N Fibonacci numbers"        → P1
  "Implement FizzBuzz"                                                  → P10
  "Write a factorial function — both recursive and iterative"          → P15

STRING / ARRAY:
  "Check if brackets/parentheses are balanced"                         → P3
  "Reverse a string — handle Unicode correctly"                        → P6
  "Check if two strings are anagrams"                                  → P12
  "Find the longest substring without repeating characters"            → P19
  "Check if a string is a palindrome (ignore spaces, punctuation)"     → P8

SLICE / MAP:
  "Find two numbers that add up to a target"                           → P5
  "Find all duplicates in an array"                                    → P7
  "Merge two sorted arrays"                                            → P9
  "Remove duplicates from a sorted array in-place"                     → P14
  "Flatten a nested array"                                             → P11
  "Implement binary search"                                            → P13

DATA STRUCTURES:
  "Build an in-memory key-value store with CRUD operations"            → P4
  "Implement a stack that supports getMin in O(1)"                     → P16
  "Implement an LRU cache with O(1) get and put"                       → P17

CONCURRENCY (Go-specific):
  "Implement a rate limiter"                                           → P18
  "Increment a counter from 1000 goroutines safely"                    → P20
  "Make the key-value store concurrent-safe"                           → P4 extension

ADVANCED (if time):
  "Implement fibonacci with memoization using closures"                → P2
```

---

## 🔥 UPDATED DRILL ORDER — Priority for Tomorrow

```
TIER 1 — MUST TYPE FROM MEMORY (45 min):
  ✅ P1:  Fibonacci iterative             — target < 2 min
  ✅ P3:  Balanced brackets               — target < 3 min
  ✅ P4:  In-memory store (basic CRUD)     — target < 3 min
  ✅ P5:  Two Sum                          — target < 2 min
  ✅ P13: Binary search                    — target < 2 min
  ✅ P6:  Reverse string (rune-safe)       — target < 1 min
  ✅ P10: FizzBuzz                         — target < 1 min

TIER 2 — READ + UNDERSTAND SHAPE (20 min):
  ⚠️ P16: MinStack                        — know the two-stack trick
  ⚠️ P17: LRU Cache                       — know map + linked list approach
  ⚠️ P19: Longest substring no repeat     — know sliding window
  ⚠️ P20: Concurrent counter              — know mutex vs atomic

TIER 3 — SKIP UNLESS ASKED:
  ⛔ P2, P7, P8, P9, P11, P12, P14, P15, P18
  → Know them conceptually, don't drill
```
