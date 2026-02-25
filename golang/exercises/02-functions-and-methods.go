package main

import "fmt"

// =============================================================================
// Exercise 1: Methods on Structs
// Define a Circle struct with Radius float64.
// Add methods: Area() float64 and Circumference() float64.
// Use math.Pi (import "math").
// =============================================================================

type Circle struct {
	// TODO: Add fields
}

func (c Circle) Area() float64 {
	// TODO: Implement
	return 0
}

func (c Circle) Circumference() float64 {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 2: Interfaces
// Define a Shape interface with Area() float64.
// Define a Square struct that implements Shape.
// Write a function printArea(s Shape) that prints the area.
// =============================================================================

type Shape interface {
	Area() float64
}

type Square struct {
	// TODO: Add fields
}

func (sq Square) Area() float64 {
	// TODO: Implement
	return 0
}

func printArea(s Shape) {
	// TODO: Implement — print the area of the shape
}

// =============================================================================
// Exercise 3: Type Assertions
// Write a function describeValue(i interface{}) string that returns:
//   "int: <value>" for int, "string: <value>" for string,
//   "unknown" for anything else.
// =============================================================================

func describeValue(i interface{}) string {
	// TODO: Implement using type assertion
	return ""
}

// =============================================================================
// Exercise 4: Type Switches
// Write a function typeDescribe(i interface{}) string that uses a type switch
// to return: "integer", "floating", "text", "boolean", or "other".
// =============================================================================

func typeDescribe(i interface{}) string {
	// TODO: Implement using type switch
	return ""
}

// =============================================================================
// Exercise 5: Variadic Functions
// Write a function sum(nums ...int) int that returns the sum of all arguments.
// =============================================================================

func sum(nums ...int) int {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 6: First-Class Functions
// Write a function apply(nums []int, fn func(int) int) []int
// that applies fn to each element and returns a new slice.
// =============================================================================

func apply(nums []int, fn func(int) int) []int {
	// TODO: Implement
	return nil
}

func main() {
	// Exercise 1
	c := Circle{}
	fmt.Printf("1. Circle area: %.2f, circumference: %.2f\n", c.Area(), c.Circumference())

	// Exercise 2
	sq := Square{}
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
