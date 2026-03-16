//go:build ignore

package main

import (
	"fmt"
	"strings"
	"sync"
	"sync/atomic"
	"unicode"
)

// ═══════════════════════════════════════════════════════════════
// GO INTERVIEW DRILLS — SOLUTIONS
// ═══════════════════════════════════════════════════════════════
//
// Read → Close → Type from memory in exercises.go → Compare
//
// ═══════════════════════════════════════════════════════════════

// ╔═══════════════════════════════════════════╗
// ║  TIER 1 — EASY (⭐) — Must Be INSTANT    ║
// ╚═══════════════════════════════════════════╝

// ─── A3: Dedup Primitives ───
// JS: [...new Set(arr)]
// Go: map[int]bool as set
func A3_dedup(arr []int) []int {
	seen := make(map[int]bool)
	result := []int{}
	for _, v := range arr {
		if !seen[v] {
			seen[v] = true
			result = append(result, v)
		}
	}
	return result
}

// ─── E1: Reverse String (rune-safe) ───
// JS: str.split("").reverse().join("")
// Go: []rune conversion + two-pointer swap
func E1_reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

// ─── E7: Count Vowels ───
// JS: str.match(/[aeiou]/gi)?.length
// Go: range + strings.ContainsRune
func E7_countVowels(s string) int {
	count := 0
	for _, ch := range strings.ToLower(s) {
		if strings.ContainsRune("aeiou", ch) {
			count++
		}
	}
	return count
}

// ─── A10: FizzBuzz ───
// JS: if/else chain
// Go: switch without condition (cleaner)
func A10_fizzBuzz(n int) []string {
	result := make([]string, n)
	for i := 1; i <= n; i++ {
		switch {
		case i%15 == 0:
			result[i-1] = "FizzBuzz"
		case i%3 == 0:
			result[i-1] = "Fizz"
		case i%5 == 0:
			result[i-1] = "Buzz"
		default:
			result[i-1] = fmt.Sprintf("%d", i)
		}
	}
	return result
}

// ╔═══════════════════════════════════════════╗
// ║  TIER 2 — MEDIUM (⭐⭐) — Under 60s      ║
// ╚═══════════════════════════════════════════╝

// ─── A1: Frequency Count ───
// JS: arr.reduce((acc, item) => { acc[item] = (acc[item]||0)+1; return acc }, {})
// Go: map[string]int, ++ auto-initializes to 0
func A1_frequencyCount(arr []string) map[string]int {
	freq := make(map[string]int)
	for _, v := range arr {
		freq[v]++
	}
	return freq
}

// ─── A2: Most Frequent Element ───
// JS: build freq map, track max
// Go: same pattern, single pass
func A2_mostFrequent(arr []string) string {
	freq := make(map[string]int)
	maxCount, maxItem := 0, arr[0]
	for _, v := range arr {
		freq[v]++
		if freq[v] > maxCount {
			maxCount = freq[v]
			maxItem = v
		}
	}
	return maxItem
}

// ─── A6: Move Zeros ───
// JS: filter non-zeros, pad zeros
// Go: two-pointer — write non-zeros first, fill zeros
func A6_moveZeros(nums []int) []int {
	result := make([]int, len(nums))
	j := 0
	for _, v := range nums {
		if v != 0 {
			result[j] = v
			j++
		}
	}
	// remaining positions are already 0 (Go zero-initializes)
	return result
}

// ─── A7: Second Largest ───
// JS: sort or two-variable track
// Go: single pass, track first and second
func A7_secondLargest(nums []int) int {
	first, second := nums[0], nums[0]
	for _, v := range nums {
		if v > first {
			second = first
			first = v
		} else if v > second && v != first {
			second = v
		}
	}
	return second
}

// ─── A8: Chunk Slice ───
// JS: for loop with slice(i, i+size)
// Go: for loop with arr[i:end]
func A8_chunk(arr []int, size int) [][]int {
	var result [][]int
	for i := 0; i < len(arr); i += size {
		end := i + size
		if end > len(arr) {
			end = len(arr)
		}
		result = append(result, arr[i:end])
	}
	return result
}

// ─── A9: Intersection ───
// JS: filter + includes or Set
// Go: map as set, iterate second slice
func A9_intersection(a, b []int) []int {
	set := make(map[int]bool)
	for _, v := range a {
		set[v] = true
	}
	result := []int{}
	for _, v := range b {
		if set[v] {
			result = append(result, v)
			delete(set, v) // prevent duplicates
		}
	}
	return result
}

// ─── A10b: Difference ───
// JS: filter where !bSet.has(item)
// Go: map set from b, filter a
func A10b_difference(a, b []int) []int {
	set := make(map[int]bool)
	for _, v := range b {
		set[v] = true
	}
	result := []int{}
	for _, v := range a {
		if !set[v] {
			result = append(result, v)
		}
	}
	return result
}

// ─── E2: Palindrome Check ───
// JS: clean with regex, compare with reverse
// Go: filter letters/digits, two-pointer compare
func E2_isPalindrome(s string) bool {
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

// ─── E3: Anagram Check ───
// JS: sort both or char count
// Go: map[rune]int counting — increment for a, decrement for b
func E3_isAnagram(a, b string) bool {
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

// ─── E5: First Non-Repeating Character ───
// JS: two-pass — count then find first with count 1
// Go: same — map[rune]int then range to preserve order
func E5_firstNonRepeating(s string) string {
	count := make(map[rune]int)
	for _, ch := range s {
		count[ch]++
	}
	for _, ch := range s {
		if count[ch] == 1 {
			return string(ch)
		}
	}
	return ""
}

// ─── C1: Fibonacci Iterative ───
// JS: loop pushing fib[i-1] + fib[i-2]
// Go: make([]int, n) pre-allocate, fill
func C1_fibonacci(n int) []int {
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

// ─── C3: Binary Search ───
// JS: while (lo <= hi) with Math.floor
// Go: lo + (hi-lo)/2 avoids overflow
func C3_binarySearch(nums []int, target int) int {
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

// ─── C4: Two Sum ───
// JS: Map for complement lookup
// Go: map[int]int — value→index
func C4_twoSum(nums []int, target int) (int, int, bool) {
	seen := make(map[int]int)
	for i, num := range nums {
		complement := target - num
		if j, ok := seen[complement]; ok {
			return j, i, true
		}
		seen[num] = i
	}
	return 0, 0, false
}

// ─── C6: Factorial ───
// JS: recursive or loop
// Go: same patterns
func C6_factorialRecursive(n int) int {
	if n <= 1 {
		return 1
	}
	return n * C6_factorialRecursive(n-1)
}

func C6_factorialIterative(n int) int {
	result := 1
	for i := 2; i <= n; i++ {
		result *= i
	}
	return result
}

// ╔═══════════════════════════════════════════════╗
// ║  TIER 3 — INTERVIEW STANDARD (⭐⭐⭐)        ║
// ╚═══════════════════════════════════════════════╝

// ─── A4: GroupBy ───
// JS: arr.reduce with acc[key] ??= []
// Go: map[string][]Item, append
type Item struct {
	Name string
	Type string
}

func A4_groupBy(items []Item) map[string][]Item {
	groups := make(map[string][]Item)
	for _, item := range items {
		groups[item.Type] = append(groups[item.Type], item)
	}
	return groups
}

// ─── A5: Flatten Nested Slice ───
// JS: arr.reduce + Array.isArray + recursion
// Go: type assertion []any with comma-ok, spread with ...
func A5_flatten(input []any) []any {
	result := []any{}
	for _, item := range input {
		if nested, ok := item.([]any); ok {
			result = append(result, A5_flatten(nested)...)
		} else {
			result = append(result, item)
		}
	}
	return result
}

// ─── E4: Balanced Brackets ───
// JS: stack array + push/pop
// Go: slice as stack, map for pair lookup
func E4_isBalanced(s string) bool {
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

// ─── B6: Longest Substring Without Repeating ───
// JS: sliding window with Map
// Go: sliding window with map[byte]int
func B6_lengthOfLongest(s string) int {
	seen := make(map[byte]int)
	maxLen, left := 0, 0
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

// ─── C2: Fibonacci Memoized (Closure) ───
// JS: closure with cache object
// Go: closure returning func, map[int]int cache
func C2_fibMemo() func(int) int {
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

// ─── C5: Merge Sorted Slices ───
// JS: two pointers + push remaining
// Go: two pointers + append remaining with ...
func C5_mergeSorted(a, b []int) []int {
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

// ─── C8: Remove Duplicates from Sorted (in-place) ───
// JS: two-pointer, splice or reslice
// Go: two-pointer, reslice nums[:j+1]
func C8_removeDuplicates(nums []int) []int {
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

// ─── D1: In-Memory Key-Value Store ───
// JS: class with Map
// Go: struct with map + pointer receiver methods
type KVStore struct {
	data map[string]string
}

func NewKVStore() *KVStore {
	return &KVStore{data: make(map[string]string)}
}

func (s *KVStore) Get(key string) (string, bool) {
	val, ok := s.data[key]
	return val, ok
}

func (s *KVStore) Set(key, value string) {
	s.data[key] = value
}

func (s *KVStore) Delete(key string) bool {
	_, ok := s.data[key]
	if ok {
		delete(s.data, key)
	}
	return ok
}

func (s *KVStore) Keys() []string {
	keys := make([]string, 0, len(s.data))
	for k := range s.data {
		keys = append(keys, k)
	}
	return keys
}

// ╔═══════════════════════════════════════════════╗
// ║  TIER 4 — SENIOR LEVEL (⭐⭐⭐⭐)            ║
// ╚═══════════════════════════════════════════════╝

// ─── D2: MinStack ───
// JS: two arrays — main + min tracker
// Go: two slices, second tracks minimum at each level
type ExMinStack struct {
	stack    []int
	minStack []int
}

func NewExMinStack() *ExMinStack {
	return &ExMinStack{}
}

func (s *ExMinStack) Push(val int) {
	s.stack = append(s.stack, val)
	if len(s.minStack) == 0 || val <= s.minStack[len(s.minStack)-1] {
		s.minStack = append(s.minStack, val)
	}
}

func (s *ExMinStack) Pop() int {
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

func (s *ExMinStack) GetMin() int {
	if len(s.minStack) == 0 {
		return -1
	}
	return s.minStack[len(s.minStack)-1]
}

// ─── E1c: Safe Counter (Mutex + Atomic) ───
// JS: no equivalent (single-threaded)
// Go: sync.Mutex or sync/atomic + sync.WaitGroup

// Mutex version:
func E1c_safeCounter() int {
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
	return count // always 1000
}

// Atomic version (preferred for simple counters):
func E1c_safeCounterAtomic() int64 {
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
	return count // always 1000
}

// ─── E2c: Worker Pool ───
// JS: no true equivalent (Promise.all is closest)
// Go: buffered channel + N goroutines + WaitGroup
func E2c_workerPool(jobs []int, numWorkers int) []int {
	jobsCh := make(chan int, len(jobs))
	resultsCh := make(chan int, len(jobs))

	// Start workers
	var wg sync.WaitGroup
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobsCh {
				resultsCh <- job * 2 // process: double the value
			}
		}()
	}

	// Send jobs
	for _, job := range jobs {
		jobsCh <- job
	}
	close(jobsCh)

	// Wait for workers, then close results
	go func() {
		wg.Wait()
		close(resultsCh)
	}()

	// Collect results
	results := []int{}
	for r := range resultsCh {
		results = append(results, r)
	}
	return results
}

// ═══════════════════════════════════════════════════════════
// JS → GO PATTERN CHEAT SHEET
// ═══════════════════════════════════════════════════════════
//
// JS                          →  GO
// ─────────────────────────────────────────────────────────
// [...new Set(arr)]           →  map[int]bool + append
// arr.reduce((acc,v) => ...)  →  for range + accumulator variable
// arr.filter(v => v > 3)      →  for range + if + append
// arr.map(v => v * 2)         →  for range + append(result, v*2)
// arr.find(v => v === x)      →  for range + if + return
// arr.includes(x)             →  for range + if + return true
// arr.sort((a,b) => a-b)      →  sort.Ints(arr) or sort.Slice()
// str.split("").reverse()     →  []rune + two-pointer swap
// str.match(/[aeiou]/gi)      →  for range + strings.ContainsRune
// new Map()                   →  make(map[K]V)
// map.set(k, v)               →  m[k] = v
// map.get(k)                  →  v, ok := m[k]
// map.has(k)                  →  _, ok := m[k]
// map.delete(k)               →  delete(m, k)
// arr.push(v)                 →  arr = append(arr, v)
// arr.pop()                   →  v = arr[len-1]; arr = arr[:len-1]
// Promise.all                 →  sync.WaitGroup + goroutines
// async/await                 →  goroutines + channels
// setTimeout                  →  time.Sleep or time.After
// class + constructor         →  struct + NewX() constructor func
// this.method()               →  receiver method (s *Struct)
// try/catch                   →  if err != nil
// throw new Error             →  return fmt.Errorf() or errors.New()
// JSON.parse / stringify      →  json.Decoder / json.Encoder
// ═══════════════════════════════════════════════════════════
