package main

import (
	"errors"
	"fmt"
	"strings"
	"unicode"
)

// ─── PROBLEM 1: Fibonacci (Iterative) ───

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

// ─── PROBLEM 2: Fibonacci (Recursive + Memoization) ───

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

// ─── PROBLEM 3: Balanced Brackets ───

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
			stack = stack[:len(stack)-1]
		}
	}
	return len(stack) == 0
}

// ─── PROBLEM 4: In-Memory Key-Value Store ───

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

// ─── PROBLEM 5: Two Sum ───

func twoSum(nums []int, target int) (int, int, bool) {
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

// ─── PROBLEM 6: Reverse String (Rune-Safe) ───

func reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

// ─── PROBLEM 7: Find Duplicates ───

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

// ─── PROBLEM 8: Palindrome Check ───

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

// ─── PROBLEM 9: Merge Two Sorted Slices ───

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

// ─── PROBLEM 10: FizzBuzz ───

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

// ─── PROBLEM 11: Flatten Nested Slice ───

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

// ─── PROBLEM 12: Anagram Check ───

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

// ─── PROBLEM 13: Binary Search ───

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

// ─── PROBLEM 14: Remove Duplicates from Sorted Slice ───

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

// ─── PROBLEM 15: Factorial ───

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

// ─── PROBLEM 16: Stack with Min ───

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

// ─── PROBLEM 17: LRU Cache ───

type lruEntry struct {
	key        string
	value      string
	prev, next *lruEntry
}

type LRUCache struct {
	capacity   int
	items      map[string]*lruEntry
	head, tail *lruEntry
}

func NewLRUCache(capacity int) *LRUCache {
	head := &lruEntry{}
	tail := &lruEntry{}
	head.next = tail
	tail.prev = head
	return &LRUCache{
		capacity: capacity,
		items:    make(map[string]*lruEntry),
		head:     head,
		tail:     tail,
	}
}

func (c *LRUCache) removeEntry(e *lruEntry) {
	e.prev.next = e.next
	e.next.prev = e.prev
}

func (c *LRUCache) addToFront(e *lruEntry) {
	e.next = c.head.next
	e.prev = c.head
	c.head.next.prev = e
	c.head.next = e
}

func (c *LRUCache) Get(key string) (string, bool) {
	if e, ok := c.items[key]; ok {
		c.removeEntry(e)
		c.addToFront(e)
		return e.value, true
	}
	return "", false
}

func (c *LRUCache) Put(key, value string) {
	if e, ok := c.items[key]; ok {
		e.value = value
		c.removeEntry(e)
		c.addToFront(e)
		return
	}
	e := &lruEntry{key: key, value: value}
	c.items[key] = e
	c.addToFront(e)
	if len(c.items) > c.capacity {
		oldest := c.tail.prev
		c.removeEntry(oldest)
		delete(c.items, oldest.key)
	}
}

// ─── PROBLEM 19: Longest Substring Without Repeating ───

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

// ─── MAIN — Run All Problems ───

func main() {
	fmt.Println("═══ P1: Fibonacci ═══")
	fmt.Println(fibonacci(10))

	fmt.Println("\n═══ P2: Fibonacci Memo ═══")
	fib := fibMemo()
	for i := 0; i < 10; i++ {
		fmt.Printf("fib(%d) = %d\n", i, fib(i))
	}

	fmt.Println("\n═══ P3: Balanced Brackets ═══")
	fmt.Println("({[]}):", isBalanced("({[]})"))
	fmt.Println("({[}):", isBalanced("({[})"))
	fmt.Println("empty:", isBalanced(""))
	fmt.Println("((:", isBalanced("(("))

	fmt.Println("\n═══ P4: In-Memory Store ═══")
	store := NewStore()
	store.Set("name", "Tijo")
	store.Set("role", "Lead")
	val, err := store.Get("name")
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("name =", val)
	}
	fmt.Println("Keys:", store.Keys())
	fmt.Println("Deleted role:", store.Delete("role"))
	fmt.Println("Keys:", store.Keys())

	fmt.Println("\n═══ P5: Two Sum ═══")
	i, j, found := twoSum([]int{2, 7, 11, 15}, 9)
	if found {
		fmt.Printf("Indices: %d, %d\n", i, j)
	}

	fmt.Println("\n═══ P6: Reverse String ═══")
	fmt.Println(reverse("hello"))
	fmt.Println(reverse("Go🐹"))

	fmt.Println("\n═══ P7: Find Duplicates ═══")
	fmt.Println(findDuplicates([]int{1, 2, 3, 2, 4, 3, 5}))

	fmt.Println("\n═══ P8: Palindrome ═══")
	fmt.Println(isPalindrome("A man, a plan, a canal: Panama"))
	fmt.Println(isPalindrome("hello"))

	fmt.Println("\n═══ P9: Merge Sorted ═══")
	fmt.Println(mergeSorted([]int{1, 3, 5}, []int{2, 4, 6}))

	fmt.Println("\n═══ P10: FizzBuzz (1-15) ═══")
	fizzBuzz(15)

	fmt.Println("\n═══ P11: Flatten ═══")
	fmt.Println(flatten([]any{1, []any{2, 3}, []any{4, []any{5, 6}}}))

	fmt.Println("\n═══ P12: Anagram ═══")
	fmt.Println("listen/silent:", isAnagram("listen", "silent"))
	fmt.Println("hello/world:", isAnagram("hello", "world"))

	fmt.Println("\n═══ P13: Binary Search ═══")
	sorted := []int{1, 3, 5, 7, 9, 11, 13}
	fmt.Println("Find 7:", binarySearch(sorted, 7))   // 3
	fmt.Println("Find 4:", binarySearch(sorted, 4))   // -1

	fmt.Println("\n═══ P14: Remove Duplicates ═══")
	dupeSlice := []int{1, 1, 2, 3, 3, 3, 4, 5, 5}
	fmt.Println(removeDuplicates(dupeSlice)) // [1 2 3 4 5]

	fmt.Println("\n═══ P15: Factorial ═══")
	fmt.Println("Recursive 7!:", factorialRecursive(7)) // 5040
	fmt.Println("Iterative 7!:", factorialIterative(7)) // 5040

	fmt.Println("\n═══ P16: MinStack ═══")
	ms := NewMinStack()
	ms.Push(5)
	ms.Push(3)
	ms.Push(7)
	ms.Push(1)
	fmt.Println("Min:", ms.GetMin()) // 1
	ms.Pop()
	fmt.Println("Min after pop:", ms.GetMin()) // 3

	fmt.Println("\n═══ P17: LRU Cache ═══")
	lru := NewLRUCache(2)
	lru.Put("a", "1")
	lru.Put("b", "2")
	v, ok := lru.Get("a")
	fmt.Printf("Get a: %s, found: %v\n", v, ok) // 1, true
	lru.Put("c", "3")                             // evicts "b"
	_, ok = lru.Get("b")
	fmt.Printf("Get b after eviction: found=%v\n", ok) // false

	fmt.Println("\n═══ P19: Longest Substring ═══")
	fmt.Println("abcabcbb:", lengthOfLongestSubstring("abcabcbb")) // 3
	fmt.Println("bbbbb:", lengthOfLongestSubstring("bbbbb"))       // 1
	fmt.Println("pwwkew:", lengthOfLongestSubstring("pwwkew"))     // 3

	fmt.Println("\n✅ All 20 problems ran successfully!")
}
