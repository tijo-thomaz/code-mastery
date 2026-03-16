package main

import (
	"fmt"
	"math"
)

// Exercise 1: Methods on Structs
// Circle uses value receivers since it's a small, immutable struct.
type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func (c Circle) Circumference() float64 {
	return 2 * math.Pi * c.Radius
}

// Exercise 2: Interfaces
// Go interfaces are satisfied implicitly — no "implements" keyword needed.
type Shape interface {
	Area() float64
}

type Square struct {
	Side float64
}

func (sq Square) Area() float64 {
	return sq.Side * sq.Side
}

func printArea(s Shape) {
	fmt.Printf("Area: %.2f\n", s.Area())
}

// Exercise 3: Type Assertions
// Type assertions extract the concrete type from an interface value.
// The comma-ok idiom prevents panics on failed assertions.
func describeValue(i interface{}) string {
	if v, ok := i.(int); ok {
		return fmt.Sprintf("int: %d", v)
	}
	if v, ok := i.(string); ok {
		return fmt.Sprintf("string: %s", v)
	}
	return "unknown"
}

// Exercise 4: Type Switches
// Type switch is cleaner than chaining type assertions.
func typeDescribe(i interface{}) string {
	switch i.(type) {
	case int:
		return "integer"
	case float64:
		return "floating"
	case string:
		return "text"
	case bool:
		return "boolean"
	default:
		return "other"
	}
}

// Exercise 5: Variadic Functions
// The ... syntax lets you pass zero or more arguments.
// Internally, nums is a []int slice.
func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

// Exercise 6: First-Class Functions
// Functions are values in Go — pass them as arguments, return them, store them.
func apply(nums []int, fn func(int) int) []int {
	result := make([]int, len(nums))
	for i, n := range nums {
		result[i] = fn(n)
	}
	return result
}

func main() {
	// Exercise 1
	c := Circle{Radius: 5}
	fmt.Printf("1. Circle area: %.2f, circumference: %.2f\n", c.Area(), c.Circumference())

	// Exercise 2
	sq := Square{Side: 4}
	fmt.Print("2. ")
	printArea(sq)

	// Exercise 3
	fmt.Printf("3. describeValue(42): %s\n", describeValue(42))
	fmt.Printf("   describeValue(\"hi\"): %s\n", describeValue("hi"))
	fmt.Printf("   describeValue(3.14): %s\n", describeValue(3.14))

	// Exercise 4
	fmt.Printf("4. typeDescribe(42): %s\n", typeDescribe(42))
	fmt.Printf("   typeDescribe(3.14): %s\n", typeDescribe(3.14))
	fmt.Printf("   typeDescribe(\"hi\"): %s\n", typeDescribe("hi"))
	fmt.Printf("   typeDescribe(true): %s\n", typeDescribe(true))

	// Exercise 5
	fmt.Printf("5. sum(1,2,3,4,5): %d\n", sum(1, 2, 3, 4, 5))

	// Exercise 6
	doubled := apply([]int{1, 2, 3, 4}, func(n int) int { return n * 2 })
	fmt.Printf("6. apply double: %v\n", doubled)
}
