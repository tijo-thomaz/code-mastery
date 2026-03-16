package main

import (
	"fmt"
)

// =============================================================================
// Exercise 1: Generic Functions
// Write a generic function Max[T comparable] that takes two ordered values
// and returns the larger one. Use the constraints package or define your own
// Ordered constraint (supports int, float64, string).
// =============================================================================

type Ordered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~float32 | ~float64 |
		~string
}

func Max[T Ordered](a, b T) T {
	// TODO: Implement
	var zero T
	return zero
}

// =============================================================================
// Exercise 2: Type Constraints
// Write a generic function Filter[T any](slice []T, predicate func(T) bool) []T
// that returns a new slice with only elements where predicate returns true.
// =============================================================================

func Filter[T any](slice []T, predicate func(T) bool) []T {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 3: Generic Stack
// Implement a generic Stack[T any] with methods:
//   Push(val T), Pop() (T, bool), Peek() (T, bool), Len() int
// =============================================================================

type Stack[T any] struct {
	// TODO: Add fields
}

func (s *Stack[T]) Push(val T) {
	// TODO: Implement
}

func (s *Stack[T]) Pop() (T, bool) {
	// TODO: Implement
	var zero T
	return zero, false
}

func (s *Stack[T]) Peek() (T, bool) {
	// TODO: Implement
	var zero T
	return zero, false
}

func (s *Stack[T]) Len() int {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 4: Generic Linked List
// Implement a singly linked list with:
//   Node[T any] struct, LinkedList[T any] struct
//   Methods: Append(val T), ToSlice() []T, Len() int
// =============================================================================

type Node[T any] struct {
	// TODO: Add fields
}

type LinkedList[T any] struct {
	// TODO: Add fields
}

func (ll *LinkedList[T]) Append(val T) {
	// TODO: Implement
}

func (ll *LinkedList[T]) ToSlice() []T {
	// TODO: Implement
	return nil
}

func (ll *LinkedList[T]) Len() int {
	// TODO: Implement
	return 0
}

func main() {
	// Exercise 1
	fmt.Println("=== Exercise 1: Generic Max ===")
	fmt.Printf("Max(3, 7): %d\n", Max(3, 7))
	fmt.Printf("Max(3.14, 2.71): %.2f\n", Max(3.14, 2.71))
	fmt.Printf("Max(\"apple\", \"banana\"): %s\n", Max("apple", "banana"))

	// Exercise 2
	fmt.Println("\n=== Exercise 2: Generic Filter ===")
	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Printf("Filter evens: %v\n", evens)
	long := Filter([]string{"go", "rust", "python", "c"}, func(s string) bool { return len(s) > 2 })
	fmt.Printf("Filter long strings: %v\n", long)

	// Exercise 3
	fmt.Println("\n=== Exercise 3: Generic Stack ===")
	s := &Stack[int]{}
	s.Push(10)
	s.Push(20)
	s.Push(30)
	fmt.Printf("Len: %d\n", s.Len())
	if v, ok := s.Peek(); ok {
		fmt.Printf("Peek: %d\n", v)
	}
	if v, ok := s.Pop(); ok {
		fmt.Printf("Pop: %d\n", v)
	}
	fmt.Printf("Len after pop: %d\n", s.Len())

	// Exercise 4
	fmt.Println("\n=== Exercise 4: Generic Linked List ===")
	ll := &LinkedList[string]{}
	ll.Append("hello")
	ll.Append("world")
	ll.Append("go")
	fmt.Printf("Len: %d\n", ll.Len())
	fmt.Printf("ToSlice: %v\n", ll.ToSlice())
}
