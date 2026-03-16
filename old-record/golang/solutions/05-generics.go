package main

import "fmt"

// Exercise 1: Generic Functions
// The Ordered constraint allows comparison operators on the type parameter.
type Ordered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~float32 | ~float64 |
		~string
}

func Max[T Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}

// Exercise 2: Type Constraints
// Filter with any constraint works on all types — the predicate handles specifics.
func Filter[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if predicate(v) {
			result = append(result, v)
		}
	}
	return result
}

// Exercise 3: Generic Stack
// Stack backed by a slice — Push appends, Pop removes from the end.
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(val T) {
	s.items = append(s.items, val)
}

func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	val := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return val, true
}

func (s *Stack[T]) Peek() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	return s.items[len(s.items)-1], true
}

func (s *Stack[T]) Len() int {
	return len(s.items)
}

// Exercise 4: Generic Linked List
// Singly linked list with head/tail pointers for O(1) append.
type Node[T any] struct {
	Value T
	Next  *Node[T]
}

type LinkedList[T any] struct {
	head *Node[T]
	tail *Node[T]
	len  int
}

func (ll *LinkedList[T]) Append(val T) {
	node := &Node[T]{Value: val}
	if ll.head == nil {
		ll.head = node
		ll.tail = node
	} else {
		ll.tail.Next = node
		ll.tail = node
	}
	ll.len++
}

func (ll *LinkedList[T]) ToSlice() []T {
	result := make([]T, 0, ll.len)
	current := ll.head
	for current != nil {
		result = append(result, current.Value)
		current = current.Next
	}
	return result
}

func (ll *LinkedList[T]) Len() int {
	return ll.len
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
