package main

import "fmt"

// =============================================================================
// Exercise 1: Variables and Types
// Declare variables of different types and return them.
// Return: an int (42), a float64 (3.14), a string ("hello"), a bool (true)
// =============================================================================

func variablesAndTypes() (int, float64, string, bool) {
	// TODO: Implement
	return 0, 0.0, "", false
}

// =============================================================================
// Exercise 2: If/Switch
// Given an integer score (0-100), return a grade string:
//   90-100 -> "A", 80-89 -> "B", 70-79 -> "C", 60-69 -> "D", below 60 -> "F"
// Use either if/else or switch.
// =============================================================================

func grade(score int) string {
	// TODO: Implement
	return ""
}

// =============================================================================
// Exercise 3: Loops
// Return the sum of all integers from 1 to n (inclusive) using a for loop.
// =============================================================================

func sumToN(n int) int {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 4: Slices
// Given a slice of ints, return a new slice containing only the even numbers.
// =============================================================================

func filterEvens(nums []int) []int {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 5: Maps
// Given a string, return a map of each character to its frequency count.
// =============================================================================

func charFrequency(s string) map[rune]int {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 6: Structs
// Define a Rectangle struct with Width and Height (float64).
// Implement Area() that returns width * height.
// =============================================================================

type Rectangle struct {
	// TODO: Add fields
}

func (r Rectangle) Area() float64 {
	// TODO: Implement
	return 0
}

// =============================================================================
// Exercise 7: Pointers
// Write a function that takes a pointer to an int and doubles its value in place.
// =============================================================================

func doubleValue(p *int) {
	// TODO: Implement
}

// =============================================================================
// Exercise 8: Functions with Multiple Returns
// Divide a by b. Return the result and an error if b is zero.
// Use the "errors" package or fmt.Errorf.
// =============================================================================

func safeDivide(a, b float64) (float64, error) {
	// TODO: Implement
	return 0, nil
}

func main() {
	// Exercise 1
	i, f, s, b := variablesAndTypes()
	fmt.Printf("1. Variables: %d, %.2f, %s, %t\n", i, f, s, b)

	// Exercise 2
	fmt.Printf("2. Grade(85): %s\n", grade(85))
	fmt.Printf("   Grade(42): %s\n", grade(42))

	// Exercise 3
	fmt.Printf("3. Sum to 10: %d\n", sumToN(10))

	// Exercise 4
	evens := filterEvens([]int{1, 2, 3, 4, 5, 6, 7, 8})
	fmt.Printf("4. Evens: %v\n", evens)

	// Exercise 5
	freq := charFrequency("hello")
	fmt.Printf("5. Char freq of 'hello': %v\n", freq)

	// Exercise 6
	rect := Rectangle{}
	fmt.Printf("6. Rectangle area: %.2f\n", rect.Area())

	// Exercise 7
	val := 21
	doubleValue(&val)
	fmt.Printf("7. Doubled: %d\n", val)

	// Exercise 8
	result, err := safeDivide(10, 3)
	fmt.Printf("8. 10/3 = %.2f, err: %v\n", result, err)
	result, err = safeDivide(10, 0)
	fmt.Printf("   10/0 = %.2f, err: %v\n", result, err)
}
